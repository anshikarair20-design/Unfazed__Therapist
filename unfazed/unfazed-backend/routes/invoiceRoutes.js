const express = require("express");

const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");
const {
    generateInvoice
} = require("../controllers/invoiceController");

const router = express.Router();

router.get("/:paymentId", authMiddleware, async (req, res) => {
    try {
        const payment = await Payment.findOne({
            _id: req.params.paymentId,
            therapist: req.therapist.id,
            status: "successful"
        });

        if (!payment) {
            return res.status(404).json({
                message: "Successful payment not found"
            });
        }

        generateInvoice(payment, res);

    } catch (error) {
        console.error("INVOICE ERROR:", error);

        res.status(500).json({
            message: "Failed to generate invoice",
            error: error.message
        });
    }
});

module.exports = router;