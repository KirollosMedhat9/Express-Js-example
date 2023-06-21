const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});
// const User = mongoose.model("User", userSchema);
module.exports = userSchema;

// // Create the User model based on the schema