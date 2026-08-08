const express = require("express");

const router = express.Router();

const {
    createBooking,
    getBookings,
    getMyBookings,
    getBookingById,
    cancelBooking,
    deleteBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");


// ===============================
// CREATE BOOKING
// ===============================

router.post(
    "/",
    authMiddleware,
    createBooking
);


// ===============================
// MY BOOKINGS
// ===============================

router.get(
    "/my",
    authMiddleware,
    getMyBookings
);


// ===============================
// ALL BOOKINGS
// ===============================

router.get(
    "/",
    getBookings
);


// ===============================
// SINGLE BOOKING
// ===============================

router.get(
    "/:id",
    getBookingById
);


// ===============================
// CANCEL BOOKING
// ===============================

router.put(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);


// ===============================
// DELETE BOOKING
// ===============================

router.delete(
    "/:id",
    authMiddleware,
    deleteBooking
);


module.exports = router;