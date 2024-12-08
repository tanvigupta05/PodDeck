const router = require("express").Router();
const User = require("../models/user");
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

// Admin Sign-In Route
router.post("/admin-sign-in", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user exists (find by email)
        const existingAdmin = await Admin.findOne({ email: email , isAdmin:true});

        if (!existingAdmin) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if the user is an admin
        if (!existingAdmin.isAdmin) {
            return res.status(403).json({ message: "You do not have admin privileges" });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: existingAdmin._id, email: existingAdmin.email, isAdmin: true },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        // Set cookie with the token
        res.cookie("podDeckAdminToken", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === "production", // Secure cookies in production
            sameSite: "Strict",
        });

        return res.status(200).json({
            message: "Admin sign-in successful",
            username: existingAdmin.username,
            email: email,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// Admin logout route
router.post("/admin-logout", async (req, res) => {
    try {
        // Clear the admin token cookie
        res.clearCookie("podDeckAdminToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure cookies in production
            sameSite: 'Strict', // Ensures the cookie is sent only for same-site requests
        });
        
        // Optional: Invalidate token on the server-side if you're using a token blacklist
        
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed" });
    }
});


module.exports = router;
