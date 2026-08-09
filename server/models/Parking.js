const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
    // ===============================
    // PARKING NAME
    // ===============================
    name: {
        type: String,
        required: true,
        trim: true,
    },

    // ===============================
    // PARKING ADDRESS
    // ===============================
    address: {
        type: String,
        required: true,
        trim: true,
    },

    // ===============================
    // LOCATION
    // ===============================
    latitude: {
        type: Number,
        required: true,
    },

    longitude: {
        type: Number,
        required: true,
    },

    // ===============================
    // PARKING CAPACITY
    // ===============================
    totalSlots: {
        type: Number,
        required: true,
        min: 1,
    },

    occupiedSlots: {
        type: Number,
        default: 0,
        min: 0,
    },

    // ===============================
    // PRICING
    // ===============================
    pricePerHour: {
        type: Number,
        required: true,
        min: 0,
    },

    // ===============================
    // VEHICLE TYPE
    // ===============================
    vehicleType: {
        type: String,
        enum: ["Car", "Bike", "Car & Bike"],
        default: "Car",
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model("Parking", parkingSchema);