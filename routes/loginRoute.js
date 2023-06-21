const express = require("express");
const router = express.Router();
const path = require("path");
const loginController = require("../controllers/loginController");


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
});

router.post('/login', loginController.login);
module.exports = router;