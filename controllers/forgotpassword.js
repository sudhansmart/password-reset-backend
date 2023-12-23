const User = require('../models/User');
const { sendMail } = require('./sendmail');
const dotenv = require('dotenv');

dotenv.config();

async function forgotpassword(email) {
  try {
    const token = generateRandomString(82); // Change 32 to the desired length of your random string
    const user = await User.findOne({ email });
    user.forgetPassword = token;

    const resetLink = `http://localhost:5173/resetpassword/${token}`;
    const content = `<h4>Hello Sir/Madam,</h4>
                     <h5>Welcome to My Page</h5>
                     <p>Click on the below link to Reset Password</p>
                     <a href="${resetLink}">Click Here</a>
                     <p>Regards,</p>
                     <p>Hari </p>`;

    await user.save();
    sendMail(email, 'Password Reset', content);
  } catch (error) {
    console.log('Error occurred in Password Reset: ', error);
  }
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
}

async function CheckUser(email) {
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error in Password Reset Controller:', error);
    return 'Server Busy';
  }
}

module.exports = { CheckUser, forgotpassword };
