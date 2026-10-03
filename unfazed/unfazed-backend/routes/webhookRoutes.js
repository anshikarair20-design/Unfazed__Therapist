const express = require("express");

const {
    razorpayWebhook
} = require("../controllers/paymentController");

const router = express.Router();

router.post(
    "/razorpay",
    express.raw({
        type: "application/json"
    }),
    razorpayWebhook
);

module.exports = router;