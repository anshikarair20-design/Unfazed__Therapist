const express = require("express");

const {
    createPaymentOrder,
    verifyPayment,
    getPayments
} = require("../controllers/paymentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/order",
    authMiddleware,
    createPaymentOrder
);

router.post(
    "/verify",
    authMiddleware,
    verifyPayment
);

router.get(
    "/",
    authMiddleware,
    getPayments
);

module.exports = router;