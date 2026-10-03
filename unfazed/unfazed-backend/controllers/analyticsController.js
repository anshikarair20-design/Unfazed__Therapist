const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const Client = require("../models/Client");

const {
    canAccess
} = require("../services/entitlementService");


const getAnalytics = async (req, res) => {
    try {

        // Check analytics entitlement
        const allowed = await canAccess(
            req.therapist.id,
            "analytics"
        );

        if (!allowed) {
            return res.status(403).json({
                message:
                    "Analytics is available on the Premium plan. Please upgrade your subscription."
            });
        }


        // ==========================================
        // TOTAL SUCCESSFUL REVENUE
        // ==========================================

        const revenueResult = await Payment.aggregate([
            {
                $match: {
                    therapist: req.therapist._id,
                    status: "successful"
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$amount"
                    }
                }
            }
        ]);


        const totalRevenue =
            revenueResult.length > 0
                ? revenueResult[0].totalRevenue
                : 0;


        // ==========================================
        // MONTHLY REVENUE TREND
        // ==========================================

        const revenueTrend = await Payment.aggregate([
            {
                $match: {
                    therapist: req.therapist._id,
                    status: "successful"
                }
            },
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    revenue: {
                        $sum: "$amount"
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);


        // ==========================================
        // ACTIVE CLIENTS
        // ==========================================

        const activeClientsResult = await Client.aggregate([
            {
                $match: {
                    therapist: req.therapist._id
                }
            },
            {
                $count: "activeClients"
            }
        ]);


        const activeClients =
            activeClientsResult.length > 0
                ? activeClientsResult[0].activeClients
                : 0;


        // ==========================================
        // BOOKING STATISTICS
        // ==========================================

        const bookingStats = await Booking.aggregate([
            {
                $match: {
                    therapist: req.therapist._id
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: {
                        $sum: 1
                    }
                }
            }
        ]);


        let totalBookings = 0;
        let noShows = 0;


        bookingStats.forEach((item) => {

            totalBookings += item.count;

            if (item._id === "no-show") {
                noShows = item.count;
            }

        });


        // ==========================================
        // NO-SHOW RATE
        // ==========================================

        const noShowRate =
            totalBookings > 0
                ? (noShows / totalBookings) * 100
                : 0;


        // ==========================================
        // SEND ANALYTICS DATA
        // ==========================================

        res.json({
            totalRevenue,
            activeClients,
            totalBookings,
            noShows,
            noShowRate: Number(
                noShowRate.toFixed(2)
            ),
            revenueTrend
        });


    } catch (error) {

        console.error(
            "ANALYTICS ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to load analytics",
            error: error.message
        });
    }
};


module.exports = {
    getAnalytics
};