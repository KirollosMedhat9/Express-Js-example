const mongoose = require('mongoose');
const userSchema = require("../models/user");
const User = mongoose.model('User', userSchema);

const login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            username,
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found",
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                error: "Invalid password",
            });
        }

        // res.status(200).json({
        //     message: "Login successful"
        // });
        res.redirect("/users");
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error",
        });
    }
};

module.exports = {
    login
};