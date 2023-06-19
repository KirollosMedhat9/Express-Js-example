const express = require('express');
const mongoose = require("mongoose");
const path = require("path");
const app = express();
// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Create the User model based on the schema
const User = mongoose.model("User", userSchema);

const uri = "mongodb+srv://kirollosmedhat:kiro01206517417@cluster0.5g5kioq.mongodb.net/user?retryWrites=true&w=majority"
async function connect() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");

        const users = await mongoose.connection.db.collection("users").find().toArray();
        console.log(users);

    } catch (error) {
        console.error(error);
    }
}

connect();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Signup post
app.post('/signup', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({
            username
        });
        if (existingUser) {
            console.log('Existing User:', existingUser);
            return res.status(409).json({
                error: "Username already exists"
            });
        }

        // Create a new user
        const newUser = new User({
            username,
            password
        });
        await newUser.save();

        res.status(201).json({
            message: "Signup successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});
//Sign up get
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Login post
app.post('/login', async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;

        const user = await User.findOne({
            username
        });
        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        if (user.password !== password) {
            return res.status(401).json({
                error: "Invalid password"
            });
        }

        res.status(200).json({
            message: "Login successful"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});

//Login get
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});



app.listen(8000, () => {
    console.log("Server has started at port 8000");
});