const express = require("express");

const router = express.Router();

const {
    getParkings,
    createParking,
    getParkingById,
    updateParking,
    deleteParking,
} = require("../controllers/parkingController");

const authMiddleware = require("../middleware/authMiddleware");

// ==========================================
// GET ALL PARKING
// ==========================================

router.get(
    "/",
    getParkings
);

// ==========================================
// ADD PARKING
// OWNER MUST BE LOGGED IN
// ==========================================

router.post(
    "/",
    authMiddleware,
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
    authMiddleware,
    updateParking
);

// ==========================================
// DELETE PARKING
// ==========================================

router.delete(
    "/:id",
    authMiddleware,
    deleteParking
);

module.exports = router;