const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // ==========================================
        // CHECK AUTHORIZATION HEADER
        // ==========================================

        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        // ==========================================
        // CHECK BEARER TOKEN
        // ==========================================

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format",
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "No token provided",
            });
        }

        // ==========================================
        // VERIFY TOKEN
        // ==========================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // ==========================================
        // SAVE USER DATA
        // ==========================================

        req.user = decoded;

        console.log("AUTH USER:", req.user);

        next();

    } catch (error) {
        console.error("AUTH MIDDLEWARE ERROR:", error);

        return res.status(401).json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;