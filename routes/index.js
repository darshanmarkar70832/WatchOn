const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/usermodel");
const mongoose = require("mongoose");

router.get("/", (req, res) => {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/intro", isLoggedIn, (req, res) => {
    res.render("intro");
});

router.get("/shop", isLoggedIn, async (req, res) => {
    try {
        let products = await productModel.find();
        let success = req.flash("success");
        let info = req.flash("info");
        let error = req.flash("error");
        res.render("shop", { products, success, info, error });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load products!");
        res.redirect("/");
    }
});

router.get("/cart", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email }).populate("cart");
        res.render("cart", { user });
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to load cart!");
        res.redirect("/shop");
    }
});
router.get('/account',isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });
        if (!user) {
            req.flash('error', 'User not found.');
            return res.redirect('/'); // Redirect to homepage if user not found
        }
        res.render('account', { user });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to load account info!');
        res.redirect('/');
    }
});



router.get("/addtocart/:productid", isLoggedIn, async (req, res) => {
    try {
        let user = await userModel.findOne({ email: req.user.email });

        // Check if the product is already in the cart
        if (user.cart.includes(req.params.productid)) {
            req.flash("info", "Product is already in your cart!");
        } else {
            // Add the product to the cart
            user.cart.push(req.params.productid);
            await user.save();
            req.flash("success", "Added to Cart");
        }

        res.redirect("/shop");
    } catch (error) {
        console.error(error);
        req.flash("error", "Failed to add to cart!");
        res.redirect("/shop");
    }
});

router.get("/logout", isLoggedIn, (req, res) => {
    // Perform logout operations
    req.logout();
    res.redirect("/");
});

module.exports = router;
