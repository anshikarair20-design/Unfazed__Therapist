// Notification Service
// Simple event-driven notification system for Unfazed


const sendNotification = ({
    type,
    recipient,
    message
}) => {

    console.log("=================================");
    console.log("UNFAZED NOTIFICATION");
    console.log("=================================");

    console.log("Type:", type);
    console.log("Recipient:", recipient);
    console.log("Message:", message);

    console.log("WhatsApp: STUB / QUEUED");

    console.log("=================================");


    return {
        success: true,
        type,
        recipient,
        message,
        channel: "whatsapp-stub",
        status: "queued"
    };
};


// BOOKING CONFIRMATION
const bookingConfirmation = ({
    clientName,
    clientEmail,
    date,
    startTime
}) => {

    return sendNotification({
        type: "booking_confirmation",
        recipient: clientEmail,
        message:
            `Hello ${clientName}, your therapy session is confirmed for ${date} at ${startTime}.`
    });

};


// PAYMENT CONFIRMATION
const paymentConfirmation = ({
    clientName,
    clientEmail,
    amount
}) => {

    return sendNotification({
        type: "payment_confirmation",
        recipient: clientEmail,
        message:
            `Hello ${clientName}, your payment of ₹${amount} was successful.`
    });

};


// SESSION FOLLOW-UP
const sessionFollowUp = ({
    clientName,
    clientEmail
}) => {

    return sendNotification({
        type: "session_follow_up",
        recipient: clientEmail,
        message:
            `Hello ${clientName}, thank you for attending your therapy session. We hope you are doing well.`
    });

};


module.exports = {
    sendNotification,
    bookingConfirmation,
    paymentConfirmation,
    sessionFollowUp
};