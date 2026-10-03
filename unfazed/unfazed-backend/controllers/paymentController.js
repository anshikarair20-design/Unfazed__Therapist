const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../models/Payment");

const {
    paymentConfirmation
} = require("../services/notificationService");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

const createPaymentOrder = async (req, res) => {
    try {

        const {
            clientName,
            clientEmail,
            amount
        } = req.body;


        if (!clientName || !clientEmail || !amount) {
            return res.status(400).json({
                message:
                    "Client name, email and amount are required"
            });
        }


        const numericAmount = Number(amount);


        if (numericAmount <= 0) {
            return res.status(400).json({
                message:
                    "Amount must be greater than zero"
            });
        }


        const razorpayOrder =
            await razorpay.orders.create({
                amount: numericAmount * 100,
                currency: "INR",
                receipt:
                    `receipt_${Date.now()}`
            });


        const platformFee =
            numericAmount * 0.05;


        const netAmount =
            numericAmount - platformFee;


        const payment =
            await Payment.create({

                therapist:
                    req.therapist.id,

                clientName,

                clientEmail,

                amount:
                    numericAmount,

                razorpayOrderId:
                    razorpayOrder.id,

                gatewayTransactionId:
                    "",

                platformFee,

                netAmount,

                status:
                    "pending"
            });


        res.status(201).json({

            message:
                "Payment order created",

            order:
                razorpayOrder,

            payment,

            keyId:
                process.env.RAZORPAY_KEY_ID

        });


    } catch (error) {

        console.error(
            "RAZORPAY ORDER ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Failed to create payment order",

            error:
                error.message

        });
    }
};


// ==========================================
// VERIFY PAYMENT FROM CLIENT
// ==========================================

const verifyPayment = async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;


        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature
        ) {

            return res.status(400).json({

                message:
                    "Payment verification details are missing"

            });
        }


        const body =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");


        if (
            expectedSignature !==
            razorpay_signature
        ) {

            return res.status(400).json({

                message:
                    "Payment verification failed"

            });
        }


        const payment =
            await Payment.findOne({

                therapist:
                    req.therapist.id,

                razorpayOrderId:
                    razorpay_order_id

            });


        if (!payment) {

            return res.status(404).json({

                message:
                    "Payment record not found"

            });
        }


        payment.gatewayTransactionId =
            razorpay_payment_id;

        payment.status =
            "successful";


        await payment.save();


        paymentConfirmation({

            clientName:
                payment.clientName,

            clientEmail:
                payment.clientEmail,

            amount:
                payment.amount

        });


        res.json({

            message:
                "Payment verified successfully",

            payment

        });


    } catch (error) {

        console.error(
            "PAYMENT VERIFICATION ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Payment verification failed",

            error:
                error.message

        });
    }
};


// ==========================================
// GET PAYMENTS
// ==========================================

const getPayments = async (req, res) => {
    try {

        const payments =
            await Payment.find({

                therapist:
                    req.therapist.id

            }).sort({
                createdAt: -1
            });


        res.json({

            payments

        });


    } catch (error) {

        console.error(
            "GET PAYMENTS ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Server error",

            error:
                error.message

        });
    }
};


// ==========================================
// RAZORPAY WEBHOOK
// ==========================================

const razorpayWebhook = async (req, res) => {
    try {

        const webhookSignature =
            req.headers[
            "x-razorpay-signature"
            ];


        if (!webhookSignature) {

            return res.status(400).json({

                message:
                    "Webhook signature missing"

            });
        }


        const webhookSecret =
            process.env.RAZORPAY_WEBHOOK_SECRET;


        if (!webhookSecret) {

            return res.status(500).json({

                message:
                    "Webhook secret is not configured"

            });
        }


        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    webhookSecret
                )
                .update(req.body)
                .digest("hex");


        if (
            expectedSignature !==
            webhookSignature
        ) {

            return res.status(400).json({

                message:
                    "Invalid webhook signature"

            });
        }


        const eventData =
            JSON.parse(
                req.body.toString()
            );


        console.log(
            "RAZORPAY WEBHOOK EVENT:",
            eventData.event
        );


        // ------------------------------------------
        // PAYMENT CAPTURED
        // ------------------------------------------

        if (
            eventData.event ===
            "payment.captured"
        ) {

            const paymentEntity =
                eventData.payload
                    ?.payment
                    ?.entity;


            if (!paymentEntity) {

                return res.status(400).json({

                    message:
                        "Payment information missing"

                });
            }


            const razorpayOrderId =
                paymentEntity.order_id;


            const razorpayPaymentId =
                paymentEntity.id;


            const payment =
                await Payment.findOne({

                    razorpayOrderId

                });


            if (!payment) {

                console.log(
                    "Payment record not found for order:",
                    razorpayOrderId
                );

                return res.status(200).json({

                    message:
                        "Webhook received but payment record was not found"

                });
            }


            // Prevent duplicate processing
            if (
                payment.status !==
                "successful"
            ) {

                payment.gatewayTransactionId =
                    razorpayPaymentId;

                payment.status =
                    "successful";


                await payment.save();


                paymentConfirmation({

                    clientName:
                        payment.clientName,

                    clientEmail:
                        payment.clientEmail,

                    amount:
                        payment.amount

                });

            }


            console.log(
                "Payment confirmed through Razorpay webhook"
            );
        }


        // ------------------------------------------
        // PAYMENT FAILED
        // ------------------------------------------

        if (
            eventData.event ===
            "payment.failed"
        ) {

            const paymentEntity =
                eventData.payload
                    ?.payment
                    ?.entity;


            if (paymentEntity) {

                const razorpayOrderId =
                    paymentEntity.order_id;


                const payment =
                    await Payment.findOne({

                        razorpayOrderId

                    });


                if (payment) {

                    payment.status =
                        "failed";


                    await payment.save();

                }

            }


            console.log(
                "Payment marked as failed"
            );
        }


        res.status(200).json({

            message:
                "Webhook processed successfully"

        });


    } catch (error) {

        console.error(
            "RAZORPAY WEBHOOK ERROR:",
            error
        );


        res.status(500).json({

            message:
                "Webhook processing failed",

            error:
                error.message

        });
    }
};


module.exports = {

    createPaymentOrder,

    verifyPayment,

    getPayments,

    razorpayWebhook

};