const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// REGISTER USER
// =======================

const registerUser = async(req, res) => {
    try {
        let { name, email, password, role } = req.body;

        email = email.trim().toLowerCase();

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        console.log("REGISTER ERROR:", error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// =======================
// LOGIN USER
// =======================

const loginUser = async(req, res) => {
    try {
        let { email, password } = req.body;

        email = email.trim().toLowerCase();

        console.log("Login Email:", email);

        const users = await User.find();

        console.log("Users in Database:");
        console.log(users);

        const user = await User.findOne({ email });

        console.log("Matched User:");
        console.log(user);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password",
            });
        }

        const token = jwt.sign({
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user,
        });

    } catch (error) {

        console.log("LOGIN ERROR:", error);

        res.status(500).json({
            message: error.message,
        });

    }
};

module.exports = {
    registerUser,
    loginUser,
};