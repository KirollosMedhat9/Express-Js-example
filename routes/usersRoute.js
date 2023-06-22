const express = require("express");
const router = express.Router();
const path = require("path");
const usersController = require("../controllers/usersController");


router.get("/users", usersController.getUsers);

module.exports = router;
//Learnt here the  module.exports = {router}; will export an object file of function not the function 