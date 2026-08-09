const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    totalSlots: {
        type: Number,
        required: true,
    },

    occupiedSlots: {
        type: Number,
        default: 0,
    },

    pricePerHour: {
        type: Number,
        required: true,
    },

    vehicleType: {
        type: String,
        enum: ["Car", "Bike", "Car & Bike"],
        default: "Car",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model(
    "Parking",
    parkingSchema
);