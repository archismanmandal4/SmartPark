const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();


// Routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const parkingRoutes = require("./routes/parkingRoutes");
const bookingRoutes = require("./routes/bookingRoutes");



// Initialize Express

const app = express();



// Middleware

app.use(cors());

app.use(express.json());




// Test Route

app.get("/", (req, res) => {

    res.send(
        "SmartPark Backend Running 🚗"
    );

});




// API Routes
app.use(
    "/api/auth",
    authRoutes
);


app.use(
    "/api/parking",
    parkingRoutes
);


app.use(
    "/api/bookings",
    bookingRoutes
);

app.use("/api/dashboard", dashboardRoutes);


// MongoDB Connection

mongoose.connect(
    process.env.MONGO_URI
)

.then(() => {

    console.log(
        "MongoDB Connected Successfully"
    );

})

.catch((error) => {

    console.log(
        "MongoDB Connection Error:",
        error
    );

});




// Server Port

const PORT =
    process.env.PORT || 5000;



app.listen(
    PORT,
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);