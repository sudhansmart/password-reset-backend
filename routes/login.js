const express = require('express');
const router = express.Router();
const { AuthenticateUser } = require('../controllers/login');

router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;
        const logincred = await AuthenticateUser(email, password);

        if (logincred === "Invalid Username or Password") {
            res.status(200).send("Invalid Username or Password");
        } else if (logincred === "Server Busy") {
            res.status(200).send("Server Busy");
        } else if (logincred.status === true) {
            res.status(200).send(logincred);
        } else {
            res.status(200).send("Unexpected response");
        }
    } catch (error) {
        console.error("Error in login route:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
    