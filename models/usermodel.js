const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: {
        type: String,
        unique: true // Ensure emails are unique
    },
    password: String,
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    contactNumber: String,
    picture: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user' // Default role is 'user'
    }
});

module.exports = mongoose.model("User", userSchema);