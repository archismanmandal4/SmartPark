const Parking = require("../models/Parking");

// ===============================
// GET ALL PARKING SPOTS
// ===============================

exports.getParkings = async(req, res) => {
    try {
        const parkings = await Parking.find().sort({
            createdAt: -1,
        });

        res.status(200).json(parkings);
    } catch (error) {
        console.error("GET PARKINGS ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// ===============================
// ADD NEW PARKING SPOT
// ===============================

exports.createParking = async(req, res) => {
    try {
        console.log("=================================");
        console.log("CREATE PARKING REQUEST RECEIVED");
        console.log("REQUEST BODY:", req.body);
        console.log("USER:", req.user);
        console.log("=================================");

        const {
            name,
            address,
            latitude,
            longitude,
            totalSlots,
            occupiedSlots,
            pricePerHour,
            vehicleType,
        } = req.body;

        // ===============================
        // VALIDATION
        // ===============================

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Parking name is required.",
            });
        }

        if (!address || !address.trim()) {
            return res.status(400).json({
                message: "Parking address is required.",
            });
        }

        if (
            latitude === undefined ||
            latitude === null ||
            latitude === ""
        ) {
            return res.status(400).json({
                message: "Latitude is required.",
            });
        }

        if (
            longitude === undefined ||
            longitude === null ||
            longitude === ""
        ) {
            return res.status(400).json({
                message: "Longitude is required.",
            });
        }

        if (
            totalSlots === undefined ||
            totalSlots === null ||
            totalSlots === ""
        ) {
            return res.status(400).json({
                message: "Total slots are required.",
            });
        }

        if (
            pricePerHour === undefined ||
            pricePerHour === null ||
            pricePerHour === ""
        ) {
            return res.status(400).json({
                message: "Price per hour is required.",
            });
        }

        // ===============================
        // CONVERT NUMBERS
        // ===============================

        const latitudeNumber = Number(latitude);
        const longitudeNumber = Number(longitude);
        const totalSlotsNumber = Number(totalSlots);
        const priceNumber = Number(pricePerHour);

        // ===============================
        // NUMERIC VALIDATION
        // ===============================

        if (
            Number.isNaN(latitudeNumber) ||
            Number.isNaN(longitudeNumber) ||
            Number.isNaN(totalSlotsNumber) ||
            Number.isNaN(priceNumber)
        ) {
            return res.status(400).json({
                message: "Invalid numeric parking data.",
            });
        }

        if (
            latitudeNumber < -90 ||
            latitudeNumber > 90
        ) {
            return res.status(400).json({
                message: "Latitude must be between -90 and 90.",
            });
        }

        if (
            longitudeNumber < -180 ||
            longitudeNumber > 180
        ) {
            return res.status(400).json({
                message: "Longitude must be between -180 and 180.",
            });
        }

        if (totalSlotsNumber <= 0) {
            return res.status(400).json({
                message: "Total parking slots must be greater than 0.",
            });
        }

        if (priceNumber < 0) {
            return res.status(400).json({
                message: "Price cannot be negative.",
            });
        }

        // ===============================
        // OCCUPIED SLOTS
        // ===============================

        const occupiedSlotsNumber =
            occupiedSlots === undefined ||
            occupiedSlots === null ||
            occupiedSlots === "" ?
            0 :
            Number(occupiedSlots);

        if (
            Number.isNaN(occupiedSlotsNumber) ||
            occupiedSlotsNumber < 0
        ) {
            return res.status(400).json({
                message: "Invalid occupied slots value.",
            });
        }

        if (
            occupiedSlotsNumber > totalSlotsNumber
        ) {
            return res.status(400).json({
                message: "Occupied slots cannot exceed total slots.",
            });
        }

        // ===============================
        // CREATE PARKING
        // ===============================

        const parking = new Parking({
            name: name.trim(),
            address: address.trim(),

            latitude: latitudeNumber,
            longitude: longitudeNumber,

            totalSlots: totalSlotsNumber,

            occupiedSlots: occupiedSlotsNumber,

            pricePerHour: priceNumber,

            vehicleType: vehicleType || "Car",
        });

        console.log(
            "PARKING DOCUMENT BEFORE SAVE:",
            parking
        );

        // ===============================
        // SAVE TO DATABASE
        // ===============================

        const savedParking =
            await parking.save();

        console.log(
            "PARKING CREATED SUCCESSFULLY:",
            savedParking
        );

        console.log("=================================");

        res.status(201).json(savedParking);

    } catch (error) {
        console.error("=================================");
        console.error("CREATE PARKING ERROR:");
        console.error(error);
        console.error("ERROR MESSAGE:");
        console.error(error.message);
        console.error("=================================");

        res.status(500).json({
            message: error.message,
        });
    }
};

// ===============================
// GET SINGLE PARKING BY ID
// ===============================

exports.getParkingById = async(req, res) => {
    try {
        const parking =
            await Parking.findById(req.params.id);

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found",
            });
        }

        res.status(200).json(parking);

    } catch (error) {
        console.error(
            "GET PARKING BY ID ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// ===============================
// UPDATE PARKING
// ===============================

exports.updateParking = async(req, res) => {
    try {
        const parking =
            await Parking.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    new: true,
                    runValidators: true,
                }
            );

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found",
            });
        }

        res.status(200).json(parking);

    } catch (error) {
        console.error(
            "UPDATE PARKING ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};

// ===============================
// DELETE PARKING
// ===============================

exports.deleteParking = async(req, res) => {
    try {
        const parking =
            await Parking.findByIdAndDelete(
                req.params.id
            );

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found",
            });
        }

        res.status(200).json({
            message: "Parking deleted successfully",
        });

    } catch (error) {
        console.error(
            "DELETE PARKING ERROR:",
            error
        );

        res.status(500).json({
            message: error.message,
        });
    }
};