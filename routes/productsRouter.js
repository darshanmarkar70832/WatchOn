const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");
const userModel = require("../models/usermodel");

// Route to create a product
router.post("/create", upload.single("image"), async (req, res) => {
    try {
        let { name, price, discount, bgcolor, panelcolor, textcolor, availability } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor,
            availability: availability === "true" // Convert string to boolean
        });
        req.flash("success", "Your product has been created successfully!");
        res.redirect("/products/createproducts");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Route to display shop with sorting
router.get("/", async (req, res) => {
    try {
        const sortby = req.query.sortby || 'popular'; // Default to 'popular' if not provided
        let products = [];

        if (sortby === "newest") {
            products = await productModel.find().sort({ createdAt: -1 });
        } else {
            products = await productModel.find(); // default sort
        }

        res.render("shop", {
            products,
            success: req.flash("success"),
            info: req.flash("info"),
            error: req.flash("error"),
            sortby: sortby // Pass sortby to the template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route to filter by availability (assuming you have an 'availability' field in your product schema)
router.get("/filter/availability", async (req, res) => {
    try {
        let products = await productModel.find({ availability: true });
        res.render("shop", { products, success: req.flash("success"), info: req.flash("info"), error: req.flash("error"), sortby: 'popular' });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route to filter by discount
router.get("/filter/discount", async (req, res) => {
    try {
        let products = await productModel.find({ discount: { $gt: 0 } });
        res.render("shop", { products, success: req.flash("success"), info: req.flash("info"), error: req.flash("error"), sortby: 'popular' });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});

// Route to render product creation form
router.get("/createproducts", (req, res) => {
    res.render("createproducts");
});

module.exports = router;
