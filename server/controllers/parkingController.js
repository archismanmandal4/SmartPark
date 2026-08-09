const Parking = require("../models/Parking");

// ==========================================
// GET ALL PARKING SPOTS
// ==========================================

exports.getParkings = async(req, res) => {
    try {
        const parkings = await Parking.find()
            .populate("owner", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(parkings);

    } catch (error) {
        console.error("GET PARKINGS ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};


// ==========================================
// ADD NEW PARKING SPOT
// ==========================================

exports.createParking = async(req, res) => {
    try {

        console.log("=================================");
        console.log("CREATE PARKING REQUEST RECEIVED");
        console.log("REQUEST BODY:");
        console.log(req.body);

        console.log("AUTHENTICATED USER:");
        console.log(req.user);

        console.log("=================================");


        // ==========================================
        // CHECK AUTHENTICATION
        // ==========================================

        if (!req.user || !req.user.id) {

            return res.status(401).json({
                message: "Authentication required. Owner information not found.",
            });

        }


        // ==========================================
        // CHECK OWNER ROLE
        // ==========================================

        if (req.user.role !== "owner") {

            return res.status(403).json({
                message: "Only parking owners can add parking locations.",
            });

        }


        // ==========================================
        // CHECK REQUEST BODY
        // ==========================================

        if (!req.body) {

            return res.status(400).json({
                message: "Request body is missing.",
            });

        }


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


        // ==========================================
        // VALIDATION
        // ==========================================

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


        // ==========================================
        // CONVERT NUMBERS
        // ==========================================

        const latitudeNumber = Number(latitude);

        const longitudeNumber = Number(longitude);

        const totalSlotsNumber = Number(totalSlots);

        const priceNumber = Number(pricePerHour);

        const occupiedSlotsNumber =
            occupiedSlots === undefined ||
            occupiedSlots === null ||
            occupiedSlots === "" ?
            0 :
            Number(occupiedSlots);


        // ==========================================
        // NUMBER VALIDATION
        // ==========================================

        if (!Number.isFinite(latitudeNumber) ||
            !Number.isFinite(longitudeNumber) ||
            !Number.isFinite(totalSlotsNumber) ||
            !Number.isFinite(priceNumber) ||
            !Number.isFinite(occupiedSlotsNumber)
        ) {

            return res.status(400).json({
                message: "Latitude, longitude, slots and price must be valid numbers.",
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
                message: "Total slots must be greater than 0.",
            });

        }


        if (occupiedSlotsNumber < 0) {

            return res.status(400).json({
                message: "Occupied slots cannot be negative.",
            });

        }


        if (
            occupiedSlotsNumber >
            totalSlotsNumber
        ) {

            return res.status(400).json({
                message: "Occupied slots cannot exceed total slots.",
            });

        }


        if (priceNumber < 0) {

            return res.status(400).json({
                message: "Price cannot be negative.",
            });

        }


        // ==========================================
        // CREATE PARKING DATA
        // ==========================================

        const parkingData = {

            name: name.trim(),

            address: address.trim(),

            latitude: latitudeNumber,

            longitude: longitudeNumber,

            totalSlots: totalSlotsNumber,

            occupiedSlots: occupiedSlotsNumber,

            pricePerHour: priceNumber,

            vehicleType: vehicleType || "Car",

            // ========================================
            // IMPORTANT:
            // LINK PARKING TO LOGGED-IN OWNER
            // ========================================

            owner: req.user.id,
        };


        console.log(
            "PARKING DATA BEFORE MONGOOSE:"
        );

        console.log(parkingData);


        // ==========================================
        // CREATE MONGOOSE DOCUMENT
        // ==========================================

        const parking =
            new Parking(parkingData);


        // ==========================================
        // SAVE DATABASE
        // ==========================================

        const savedParking =
            await parking.save();


        // ==========================================
        // RESPONSE
        // ==========================================

        console.log("=================================");
        console.log(
            "PARKING CREATED SUCCESSFULLY"
        );
        console.log(savedParking);
        console.log("=================================");


        return res.status(201).json({

            message: "Parking location added successfully.",

            parking: savedParking,

        });

    } catch (error) {

        console.error("=================================");
        console.error(
            "CREATE PARKING ERROR"
        );
        console.error(error);
        console.error(
            "ERROR MESSAGE:",
            error.message
        );
        console.error("=================================");


        return res.status(500).json({

            message: error.message,

        });

    }
};


// ==========================================
// GET SINGLE PARKING
// ==========================================

exports.getParkingById = async(
    req,
    res
) => {

    try {

        const parking =
            await Parking.findById(
                req.params.id
            ).populate(
                "owner",
                "name email"
            );


        if (!parking) {

            return res.status(404).json({
                message: "Parking not found",
            });

        }


        res.status(200).json(
            parking
        );

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


// ==========================================
// UPDATE PARKING
// ==========================================

exports.updateParking = async(
    req,
    res
) => {

    try {

        const parking =
            await Parking.findById(
                req.params.id
            );


        if (!parking) {

            return res.status(404).json({
                message: "Parking not found",
            });

        }


        // ========================================
        // ONLY OWNER CAN UPDATE
        // ========================================

        if (
            parking.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({
                message: "You are not allowed to update this parking.",
            });

        }


        const updatedParking =
            await Parking.findByIdAndUpdate(
                req.params.id,
                req.body, {
                    new: true,
                    runValidators: true,
                }
            );


        res.status(200).json(
            updatedParking
        );

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


// ==========================================
// DELETE PARKING
// ==========================================

exports.deleteParking = async(
    req,
    res
) => {

    try {

        const parking =
            await Parking.findById(
                req.params.id
            );


        if (!parking) {

            return res.status(404).json({
                message: "Parking not found",
            });

        }


        // ========================================
        // ONLY OWNER CAN DELETE
        // ========================================

        if (
            parking.owner.toString() !==
            req.user.id.toString()
        ) {

            return res.status(403).json({
                message: "You are not allowed to delete this parking.",
            });

        }


        await Parking.findByIdAndDelete(
            req.params.id
        );


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