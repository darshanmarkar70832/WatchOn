const userModel = require("../models/usermodel");
const ownerModel = require("../models/owners-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generateToken");

// Register a new user or admin (owner)
module.exports.registerUser = async (req, res) => {
    try {
        let { email, password, fullname, role } = req.body;

        // Check if it's an admin registration
        if (role === "admin") {
            let owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(503).send("You can't create a new owner");
            }

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return res.status(500).send(err.message);
                    try {
                        let owner = await ownerModel.create({
                            email,
                            password: hash,
                            fullname,
                            role
                        });
                        let token = generateToken(owner);
                        res.cookie("token", token);
                        res.redirect("/owners/admin");
                    } catch (error) {
                        res.status(500).send(error.message);
                    }
                });
            });
        } else {
            let user = await userModel.findOne({ email });
            if (user) {
                return res.status(401).send("Account already registered!");
            }

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, async (err, hash) => {
                    if (err) return res.send(err.message);
                    try {
                        let newUser = await userModel.create({
                            email,
                            password: hash,
                            fullname,
                            role: role || "user"
                        });
                        let token = generateToken(newUser);
                        res.cookie("token", token);
                        res.redirect("/intro");
                    } catch (error) {
                        res.status(500).send(error.message);
                    }
                });
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Login a user or admin
module.exports.loginUser = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email: email });
    if (!user) return res.status(401).send("Email or password is incorrect!");

    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            let token = generateToken(user);
            res.cookie("token", token);
            // Redirect to admin page if user is admin
            if (user.role === "admin") {
                return res.redirect("/owners/admin");
            } else {
                return res.redirect("/shop"); // Redirect to shop for non-admin users
            }
        } else {
            return res.status(401).send("Email or password is incorrect!");
        }
    });
};

// Logout
module.exports.logout = (req, res) => {
    res.cookie("token", "");
    res.redirect("/");
};
