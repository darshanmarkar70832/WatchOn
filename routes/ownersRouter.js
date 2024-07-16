const express = require("express");
const router = express.Router();
const ownerModel = require("../models/owners-model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const isLoggedIn = require("../middlewares/isLoggedIn");

// Route to create an owner (assuming this is a one-time operation)
router.post("/create", async (req, res) => {
    try {
        let owners = await ownerModel.find();
        if (owners.length > 0) {
            return res.status(403).send("Cannot create a new owner. An owner already exists.");
        }
        let { fullname, email, password } = req.body;
        let createdOwner = await ownerModel.create({
            fullname,
            email,
            password
        });
        res.status(201).send(createdOwner);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// POST route to handle owner login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the owner in the database
        const owner = await ownerModel.findOne({ email });

        // If owner not found
        if (!owner) {
            return res.status(401).send("Email or password is incorrect!");
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, owner.password);

        // If passwords match
        if (passwordMatch) {
            // Generate token
            const token = generateToken(owner);
            res.cookie("token", token);
            // Redirect to admin dashboard or another endpoint
            return res.redirect("/owners/admin");
        } else {
            return res.status(401).send("Email or password is incorrect!");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Route to display admin dashboard (requires login)

router.get("/admin", isLoggedIn, (req, res) => {
    let success = req.flash("success");
    res.render("admin", { success });
});
router.get("/owner-login", isLoggedIn, (req, res) => {
    let success = req.flash("success");
    res.render("owner-login", { success });
});

module.exports = router;
