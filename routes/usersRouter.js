const express = require("express");
const router = express.Router();
const userModel = require("../models/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");
const isLoggedIn = require("../middlewares/isLoggedIn");

// Register a new user
router.post("/register", async (req, res) => {
    try {
        let { email, password, fullname } = req.body;
        if(!email || !password || !fullname) return res.status(401).send("Enter all the required fields");
        let user = await userModel.findOne({ email: email });
        if (user) {
            return res.status(409).send("Account already registered!");
        }

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(500).send(err.message);
                let newUser = await userModel.create({
                    email,
                    password: hash,
                    fullname
                });
                let token = generateToken(newUser);
                res.cookie("token", token);
                res.redirect("/intro");
            });
        });

    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Login a user
router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    if(!email || !password) return res.status(401).send("Enter all the required fields");
    let user = await userModel.findOne({ email: email });
    if (!user) return res.status(401).send("Email or password is incorrect!");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            res.redirect("/intro");
        } else {
            return res.status(401).send("Email or password is incorrect!");
        }
    });
});

// Logout a user
router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// Delete product from cart
router.get("/cart/delete/:id",isLoggedIn, async (req, res) => {
    try {
        const productId = req.params.id;
        const token = req.cookies.token;
        if (!token) return res.redirect("/login");

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findById(decoded.id);

        if (!user) return res.redirect("/login");

        // Remove the product from the cart
        user.cart = user.cart.filter(item => item.toString() !== productId);
        await user.save();

        res.redirect("/cart");
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

module.exports = router;
