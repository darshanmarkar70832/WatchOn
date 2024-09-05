const jwt = require("jsonwebtoken");
const userModel = require("../models/usermodel");

module.exports = async (req, res, next) => {
    try {
        if (!req.cookies.token) {
            req.flash("error", "You need to login first!");
            return res.redirect("/");
        }

        if (!process.env.JWT_KEY) {
            throw new Error("JWT_KEY is not defined in .env file");
        }

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            req.flash("error", "User not found!");
            return res.redirect("/");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        req.flash("error", "Authentication failed!");
        res.redirect("/");
    }
};
