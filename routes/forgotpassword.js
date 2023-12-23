const express = require('express');
const router = express.Router();
const { CheckUser, forgotpassword} = require('../controllers/forgotpassword');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/token', async (req, res) => {
  try {
    const data = req.body;
    const user = await User.findOne({ forgetPassword : data.token });
    if(user)
        res.status(201).send(true)  
    if (!user) {
      return res.status(404).send(false);
    }
    
  } catch (error) {
    console.log("error occurred in get token: ", error);
    res.status(500).send(false);
  }
});

router.post('/verify', async (req, res) => {
    try {
      const {email} = req.body; 
  
      const registerCredentials = await CheckUser(email);
      if (registerCredentials === true) {
        await forgotpassword(email);
        res.status(200).send(true);
      } else if (registerCredentials === false) {
        res.status(201).send(false);
      } else if (registerCredentials === "Server Busy") {
        res.status(500).send("Server Busy");
      }
    } catch (error) {
      console.log("Error occurred in /verify route: ", error);
      res.status(500).send("Internal Server Error");
    }
  });
// Update Password Logic Here
router.post('/change',async(req,res) => {
 try {
  const{token ,newpassword ,confirmpassword} = req.body
  const user = await User.findOne({forgetPassword : token})

  if (!user) {
    return res.status(404).send(false);
  }
   if(newpassword === confirmpassword){
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);

    user.password = hashedPassword;
    user.forgetPassword = "";
    await user.save();
    res.status(200).send(true);
   }
 } catch (error) {
  console.log("Error occurred in /change route: ", error);
  res.status(500).send("Internal Server Error");
 }
})


module.exports = router;