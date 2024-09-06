const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: false },
    image: { type: Buffer, required: true },
    bgcolor: { type: String, required: true },
    panelcolor: { type: String, required: true },
    textcolor: { type: String, required: true },
    details: { type: String, required: true },
    availability: { type: Boolean, default: true }, // New field for availability
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", productSchema);
