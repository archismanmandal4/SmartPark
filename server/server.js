const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// ==========================================
// ROUTES
// ==========================================

const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// ==========================================
// INITIALIZE EXPRESS
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(
    express.urlencoded({
        extended: true,
    })
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
    res.status(200).send("SmartPark Backend Running 🚗");
});

// ==========================================
// API ROUTES
// ==========================================

app.use("/api/auth", authRoutes);

app.use("/api/parking", parkingRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ==========================================
// MONGODB CONNECTION
// ==========================================

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error(
            "MongoDB Connection Error:",
            error.message
        );
    });

// ==========================================
// SERVER PORT
// ==========================================

const PORT = process.env.PORT || 5000;

// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(
        `
SmartPark Server running on port $ { PORT }
`
    );
});