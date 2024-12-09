const jwt = require("jsonwebtoken");
const User = require("../models/user");

// Middleware to authenticate any user
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.podDeckUserToken;
  console.log("User Token:", token);
  try {
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded User:", decode);
      const user = await User.findById(decode.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "No token provided, access denied" });
    }
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(500).json({ message: "Invalid Token" });
  }
};

// Middleware to authenticate admin users
const adminMiddleware = async (req, res, next) => {
  const token = req.cookies.podDeckAdminToken;
  try {
    if (token) {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decode.id);
      if (!user || !user.isAdmin) {
        return res.status(403).json({ message: "Access denied, admin only" });
      }
      req.user = user; // Attach the admin user to the request object
      next();
    } else {
      return res.status(401).json({ message: "No token provided, access denied" });
    }
  } catch (error) {
    res.status(500).json({ message: "Invalid Token" });
  }
};

module.exports = { authMiddleware, adminMiddleware };
