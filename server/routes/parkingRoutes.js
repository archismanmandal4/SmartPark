const express = require("express");

const router = express.Router();

const {
    getParkings,
    createParking,
    getParkingById,
    updateParking,
    deleteParking
} = require("../controllers/parkingController");


// ==========================================
// GET ALL PARKING
// ==========================================

router.get(
    "/",
    getParkings
);


// ==========================================
// ADD PARKING
// ==========================================

router.post(
    "/",
    createParking
);


// ==========================================
// GET SINGLE PARKING
// ==========================================

router.get(
    "/:id",
    getParkingById
);


// ==========================================
// UPDATE PARKING
// ==========================================

router.put(
    "/:id",
    updateParking
);


// ==========================================
// DELETE PARKING
// ==========================================

router.delete(
    "/:id",
    deleteParking
);


module.exports = router;