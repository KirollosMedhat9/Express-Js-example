const express = require('express');
const router = express.Router();
const path = require("path");
const signupController = require('../controllers/signupController');



router.post('/signup', signupController.signup);

router.get('/signup', (request, response) => {
    response.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

module.exports = router;