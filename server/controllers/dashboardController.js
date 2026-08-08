const Parking = require("../models/Parking");
const Booking = require("../models/Booking");
const User = require("../models/User");

const getDashboardStats = async(req, res) => {

    try {

        const parkings = await Parking.find();

        const bookings = await Booking.find().populate("parkingId");

        const totalUsers =
            await User.countDocuments();

        let totalSlots = 0;
        let occupiedSlots = 0;

        let revenue = 0;

        parkings.forEach((parking) => {

            totalSlots += parking.totalSlots || 0;

            occupiedSlots += parking.occupiedSlots || 0;

        });

        bookings.forEach((booking) => {

            if (
                booking.parkingId &&
                booking.parkingId.pricePerHour
            ) {
                revenue += booking.parkingId.pricePerHour;
            }

        });

        const occupancyPercentage =
            totalSlots > 0 ?
            Number(
                (
                    (occupiedSlots / totalSlots) *
                    100
                ).toFixed(1)
            ) :
            0;

        res.json({

            totalParkings: parkings.length,

            totalSlots,

            occupiedSlots,

            availableSlots: totalSlots - occupiedSlots,

            totalBookings: bookings.length,

            totalUsers,

            totalRevenue: revenue,

            occupancyPercentage

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {
    getDashboardStats
};