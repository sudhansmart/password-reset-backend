const express = require('express');
const router = express.Router();
const { CheckUser } = require('../controllers/login');
const { InsertVerifyUser, InsertSignUpUser } = require('../controllers/signin');

router.get('/:token', async (req, res) => {
  try {
    const response = await InsertSignUpUser(req.params.token);
    res.status(200).send(` <div style="color: darkslategray; text-align: center;">
                                 <h3>You are Successfully Registered</h3>
                                 <h4>Please go to the login page to use our service <a href='http://localhost:5173/'>Click here</a></h4>
                             <p>Regards,</p>
                             <p>Hari</p>
                           </div>`)
  } catch (error) {
    console.log("error occurred in get token: ", error);
    res.status(500).send(`<h4>Hello Sir/Madam,</h4>
                          <h5>Registration Failed</h5>
                           <p>Link Expired</p>
                           <p>Regards,</p>
                           <p>Team</p>`);
  }
});

router.post('/verify', async (req, res) => {
  try {
    const { name, email, password } = req.body; 
    const registerCredentials = await CheckUser(email);
    if (registerCredentials === false) {
      await InsertVerifyUser(name, email, password);
      res.status(200).send(true);
    } else if (registerCredentials === true) {
      res.status(201).send(false);
    } else if (registerCredentials === "Server Busy") {
      res.status(500).send("Server Busy");
    }
  } catch (error) {
    console.log("Error occurred in /verify route: ", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
