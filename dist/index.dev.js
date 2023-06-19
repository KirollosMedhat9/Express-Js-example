"use strict";

var express = require('express');

var mongoose = require("mongoose");

var app = express(); // Define the user schema

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}); // Create the User model based on the schema

var User = mongoose.model("User", userSchema);
var uri = "mongodb+srv://kirollosmedhat:kiro01206517417@cluster0.5g5kioq.mongodb.net/?retryWrites=true&w=majority";

function connect() {
  var users;
  return regeneratorRuntime.async(function connect$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }));

        case 3:
          console.log("Connected to MongoDB");
          _context.next = 6;
          return regeneratorRuntime.awrap(mongoose.connection.db.collection("users").find().toArray());

        case 6:
          users = _context.sent;
          // Display the retrieved documents
          console.log(users);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.error(_context.t0);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

connect();
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json()); // Signup route

app.post('/signup', function _callee(req, res) {
  var _req$body, username, password, existingUser, newUser;

  return regeneratorRuntime.async(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, username = _req$body.username, password = _req$body.password; // Check if the username already exists

          _context2.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 4:
          existingUser = _context2.sent;

          if (!existingUser) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(409).json({
            error: "Username already exists"
          }));

        case 7:
          // Create a new user
          newUser = new User({
            username: username,
            password: password
          });
          _context2.next = 10;
          return regeneratorRuntime.awrap(newUser.save());

        case 10:
          res.status(201).json({
            message: "Signup successful"
          });
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          console.error(_context2.t0);
          res.status(500).json({
            error: "Server error"
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
}); // Login route

app.post('/login', function _callee2(req, res) {
  var _req$body2, username, password, user;

  return regeneratorRuntime.async(function _callee2$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password; // Find the user by username

          _context3.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            username: username
          }));

        case 4:
          user = _context3.sent;

          if (user) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            error: "User not found"
          }));

        case 7:
          if (!(user.password !== password)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(401).json({
            error: "Invalid password"
          }));

        case 9:
          res.status(200).json({
            message: "Login successful"
          });
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error(_context3.t0);
          res.status(500).json({
            error: "Server error"
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
});
app.get('/', function (req, res) {
  res.send('Hello, this is the homepage');
});
app.listen(8000, function () {
  console.log("Server has started at port 8000");
});