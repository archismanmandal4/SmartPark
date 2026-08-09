const mongoose = require("mongoose");

const parkingSchema = new mongoose.Schema({
        // ==========================================
        // PARKING NAME
        // ==========================================
        name: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // PARKING ADDRESS
        // ==========================================
        address: {
            type: String,
            required: true,
            trim: true,
        },

        // ==========================================
        // LOCATION
        // ==========================================
        latitude: {
            type: Number,
            required: true,
        },

        longitude: {
            type: Number,
            required: true,
        },

        // ==========================================
        // CAPACITY
        // ==========================================
        totalSlots: {
            type: Number,
            required: true,
        },

        occupiedSlots: {
            type: Number,
            default: 0,
        },

        // ==========================================
        // PRICE
        // ==========================================
        pricePerHour: {
            type: Number,
            required: true,
        },

        // ==========================================
        // VEHICLE TYPE
        // ==========================================
        vehicleType: {
            type: String,
            enum: ["Car", "Bike", "Car & Bike"],
            default: "Car",
        },

        // ==========================================
        // PARKING OWNER
        // ==========================================
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },

    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Parking", parkingSchema);