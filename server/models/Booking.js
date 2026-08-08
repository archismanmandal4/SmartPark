const mongoose = require("mongoose");


const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },


    parkingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Parking",
        required: true
    },


    vehicleNumber: {
        type: String,
        required: true
    },


    bookingDate: {
        type: Date,
        default: Date.now
    },


    status: {
        type: String,
        default: "Booked"
    }


});


module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );