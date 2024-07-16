const jwt = require("jsonwebtoken");
const userModel = require("../models/usermodel");

module.exports = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            req.flash("error", "You need to login first!");
            return res.redirect("/");
        }

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/");
        }

        // if (user.role !== "admin") {
        //     req.flash("error", "Unauthorized access!");
        //     return res.redirect("/");
        // }

        req.user = user; // Attach user object to request
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        req.flash("error", "Authentication failed!");
        res.redirect("/");
    }
};
