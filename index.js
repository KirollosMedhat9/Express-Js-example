const express = require('express');
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const app = express();

// Configure the session middleware
app.use(session({
    secret: 'key', //secret key
    resave: true,
    /*It determines whether the session should be saved to the session store even 
        if it hasn't been modified during the request. Setting it to false optimizes performance
        by preventing unnecessary session saves. 
        However, it's recommended to set it to true during development to ensure session persistence.
    */
    saveUninitialized: false,
    /*
    It specifies whether a new and uninitialized session should be saved to the session store.
    Setting it to false prevents saving empty sessions,
    which can be useful for complying with privacy regulations
    */
}));



// Define the user schema
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
//Make one user admin and then in the future add the MakeAdmin feature 
async function makeAdmin() {
    const admin = await User.findOne({
        username: "admin"
    });

    admin.isAdmin = true;
    await admin.save();

}
makeAdmin();
//add restrictions for non admins
const checkAdmin = (req, res, next) => {
    if (req.User && req.User.isAdmin) {
        next(); //continue
    } else {
        res.status(403).json({
            error: "You need admin privilege"
        })
    }
}


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
        const newUserPrint = await User.findOne(newUser);
        console.log("new User: " + newUserPrint);
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

        // res.status(200).json({
        //     message: "Login successful"
        // });
        res.redirect('/users');
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


//get users request
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', {
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: 'Server Error'
        })
    }
});
app.post('/deleteUser', async (req, res) => {
    try {
        const userId = req.body.userId;
        console.log("Deleted: ", User.findOne, {
            userId
        });
        await User.findByIdAndDelete(userId); //drop remove 

        res.redirect('/users'); //users
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Server error"
        });
    }
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(8000, () => {
    console.log("Server has started at port 8000");
});