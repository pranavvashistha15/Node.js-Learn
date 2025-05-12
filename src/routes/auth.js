
const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const {validateSignUpData} = require("../utils/validators");
const bcrypt = require("bcrypt");





authRouter.post("/signUp", async (req, res) => {

  try {
    validateSignUpData(req);

    const {firstName, lastName, emailID, password} = req.body;
    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordhash,
    });  
    await user.save();
    res.send("You are successfully signed up");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


authRouter.post("/login", async (req, res) => {

  try {
    const {emailID, password} = req.body;
    const user = await User.findOne({emailID: emailID})
    if(!user) {
      throw new Error ("Invalid Credentials");
      } 

      const isPasswordValid = await user.validatePassword(password);
    if(isPasswordValid) {

      //create a json web token
      const token = await user.getJWT();

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      })

      res.send("Login successful")
    } else {
      throw new Error("Invalid Credentials")
    }  

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;