const express = require("express");
const cors = require("cors");

const availabilityRoutes =
    require("./routes/availabilityRoutes");

const bookingRoutes =
    require("./routes/bookingRoutes");

const therapistRoutes =
    require("./routes/therapistRoutes");

const clientRoutes =
    require("./routes/clientRoutes");

const paymentRoutes =
    require("./routes/paymentRoutes");

const packageRoutes =
    require("./routes/packageRoutes");

const invoiceRoutes =
    require("./routes/invoiceRoutes");

const noteRoutes =
    require("./routes/noteRoutes");

const analyticsRoutes =
    require("./routes/analyticsRoutes");

const webhookRoutes =
    require("./routes/webhookRoutes");


const app = express();


// ==========================================
// CORS
// ==========================================

app.use(cors());


// ==========================================
// RAZORPAY WEBHOOK
// IMPORTANT: BEFORE express.json()
// ==========================================

app.use(
    "/api/webhooks",
    webhookRoutes
);


// ==========================================
// JSON BODY PARSER
// ==========================================

app.use(
    express.json()
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {

    res.json({

        message:
            "Unfazed backend is running"

    });

});


// ==========================================
// ROUTES
// ==========================================

app.use(
    "/api/bookings",
    bookingRoutes
);


app.use(
    "/api/therapists",
    therapistRoutes
);


app.use(
    "/api/clients",
    clientRoutes
);


app.use(
    "/api/availability",
    availabilityRoutes
);


app.use(
    "/api/payments",
    paymentRoutes
);


app.use(
    "/api/packages",
    packageRoutes
);


app.use(
    "/api/invoices",
    invoiceRoutes
);


app.use(
    "/api/notes",
    noteRoutes
);


app.use(
    "/api/analytics",
    analyticsRoutes
);


module.exports = app;