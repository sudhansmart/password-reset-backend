const User = require('../models/User');
const { sendMail } = require('./sendmail');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const VerifyUser = require('../models/VerifyUser');
dotenv.config();

async function InsertVerifyUser(name, email, password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const token = generateToken(email);

    const newUser = new VerifyUser({
      name: name,
      email: email,
      password: hashedPassword,
      token: token
    });

    const activationLink = `https://password-reset-6ofd.onrender.com/signin/${token}`;
    const content = `<h4>Hello Sir/Madam,</h4>
                     <h5>Welcome to My Page</h5>
                     <p>Thank You For Signing up. Click on the below link to Activate</p>
                     <a href="${activationLink}">Click Here</a>
                     <p>Regards,</p>
                     <p>Hari </p>`;

    await newUser.save();
    sendMail(email, "User Verification", content);
  } catch (error) {
    console.log("Error occurred in InsertVerifyUser: ", error);
  }
}

function generateToken(email) {
  const token = jwt.sign({ email: email }, process.env.signUp_SecretKey, {
    expiresIn: '1h', 
  });

  return token;
}



async function InsertSignUpUser(token) {
  try {
    const userVerify = await VerifyUser.findOne({ token: token });
    if (userVerify) {
      const newUser = new User({
        name: userVerify.name,
        email: userVerify.email,
        password: userVerify.password,
        forgetPassword:"",
        token: token, 
      });

      await newUser.save();
      await VerifyUser.deleteOne({ token: token });
       
      const activationLink = `http://localhost:5173/`;
      const content = `<h4>Hello Sir/Madam,</h4>
                        <h5>Welcome to My Page</h5>
                        <p>You are Successfully Registered.Please  <a href="${activationLink}">Click Here</a> To Login </p>
                        <p>Regards,</p>
                        <p>Hari</p>`;

      sendMail(newUser.email, "Registration Successful", content);
    }
  } catch (error) {
    console.log("Error occurred in InsertSignUpUser: ", error);
  }
}




module.exports = { InsertVerifyUser, InsertSignUpUser };
