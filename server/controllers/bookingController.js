const Booking = require("../models/Booking");
const Parking = require("../models/Parking");

// ===============================
// CREATE BOOKING
// ===============================
exports.createBooking = async(req, res) => {
    try {
        const { parkingId, vehicleNumber } = req.body;

        if (!parkingId || !vehicleNumber) {
            return res.status(400).json({
                message: "Parking ID and Vehicle Number are required."
            });
        }

        const parking = await Parking.findById(parkingId);

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found."
            });
        }

        const availableSlots =
            parking.totalSlots - parking.occupiedSlots;

        if (availableSlots <= 0) {
            return res.status(400).json({
                message: "No parking slots available."
            });
        }

        // Get logged-in user's ID from auth middleware
        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({
                message: "User authentication required."
            });
        }

        const booking = new Booking({
            userId,
            parkingId,
            vehicleNumber,
            status: "Booked"
        });

        await booking.save();

        parking.occupiedSlots += 1;

        await parking.save();

        const populatedBooking = await Booking.findById(booking._id)
            .populate("parkingId")
            .populate("userId", "name email");

        res.status(201).json({
            message: "Booking successful",
            booking: populatedBooking
        });

    } catch (error) {
        console.error("CREATE BOOKING ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ===============================
// GET ALL BOOKINGS
// ===============================
exports.getBookings = async(req, res) => {
    try {

        const bookings = await Booking.find()
            .populate("parkingId")
            .populate("userId", "name email");

        res.status(200).json(bookings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ===============================
// GET MY BOOKINGS
// ===============================
exports.getMyBookings = async(req, res) => {
    try {

        const userId = req.user ? req.user.id : null;

        if (!userId) {
            return res.status(401).json({
                message: "Authentication required."
            });
        }

        const bookings = await Booking.find({
                userId
            })
            .populate("parkingId")
            .sort({ bookingDate: -1 });

        res.status(200).json(bookings);

    } catch (error) {

        console.error("MY BOOKINGS ERROR:", error);

        res.status(500).json({
            message: error.message
        });

    }
};


// ===============================
// GET BOOKING BY ID
// ===============================
exports.getBookingById = async(req, res) => {

    try {

        const booking = await Booking.findById(req.params.id)
            .populate("parkingId")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        res.status(200).json(booking);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ===============================
// CANCEL BOOKING
// ===============================
exports.cancelBooking = async(req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        if (booking.status === "Cancelled") {
            return res.status(400).json({
                message: "Booking is already cancelled."
            });
        }

        const parking = await Parking.findById(
            booking.parkingId
        );

        if (parking && parking.occupiedSlots > 0) {
            parking.occupiedSlots -= 1;
            await parking.save();
        }

        booking.status = "Cancelled";

        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully.",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};


// ===============================
// DELETE BOOKING
// ===============================
exports.deleteBooking = async(req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found."
            });
        }

        await Booking.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Booking deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};