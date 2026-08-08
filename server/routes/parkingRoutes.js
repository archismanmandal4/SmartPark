const express = require("express");

const router = express.Router();

const {
    getParkings,
    createParking,
    getParkingById,
    updateParking,
    deleteParking
} = require("../controllers/parkingController");



// Get all parking
router.get(
    "/",
    getParkings
);


// Add parking
router.post(
    "/",
    createParking
);


// Get single parking
router.get(
    "/:id",
    getParkingById
);


// Update parking
router.put(
    "/:id",
    updateParking
);


// Delete parking
router.delete(
    "/:id",
    deleteParking
);



module.exports = router;