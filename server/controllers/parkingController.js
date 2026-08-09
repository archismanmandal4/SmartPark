const Parking = require("../models/Parking");

// ===============================
// GET ALL PARKING SPOTS
// ===============================

exports.getParkings = async(req, res) => {
    try {
        const parkings = await Parking.find();

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
        console.log("CREATE PARKING REQUEST BODY:");
        console.log(JSON.stringify(req.body, null, 2));

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

        if (!name) {
            return res.status(400).json({
                message: "Parking name is required.",
            });
        }

        if (!address) {
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

        if (!totalSlots) {
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
        // CREATE PARKING
        // ===============================

        const parking = new Parking({
            name: name.trim(),

            address: address.trim(),

            latitude: Number(latitude),

            longitude: Number(longitude),

            totalSlots: Number(totalSlots),

            occupiedSlots: occupiedSlots !== undefined ?
                Number(occupiedSlots) :
                0,

            pricePerHour: Number(pricePerHour),

            vehicleType: vehicleType || "Car",
        });

        console.log("PARKING OBJECT BEFORE SAVE:");
        console.log(parking);

        // ===============================
        // SAVE TO DATABASE
        // ===============================

        const savedParking = await parking.save();

        console.log("PARKING SAVED SUCCESSFULLY:");
        console.log(savedParking);

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
        const parking = await Parking.findById(req.params.id);

        if (!parking) {
            return res.status(404).json({
                message: "Parking not found",
            });
        }

        res.status(200).json(parking);

    } catch (error) {
        console.error("GET PARKING ERROR:", error);

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
        console.error("UPDATE PARKING ERROR:", error);

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
        console.error("DELETE PARKING ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};