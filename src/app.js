const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validators")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth")


const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(cookieParser());

app.post("/signUp", async (req, res) => {

  try {
    validateSignUpData(req);

    const {firstName, lastName, emailID, password, phoneNumber} = req.body;
    const passwordhash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: passwordhash,
      phoneNumber
    });  
    await user.save();
    res.send("You are successfully signed up");
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


app.post("/login", async (req, res) => {

  try {
    const {emailID, password} = req.body;
    const user = await User.findOne({emailID: emailID})
    if(!user) {
      throw new Error ("Invalid Credentials");
      } 

      const isPasswordValid = await bcrypt.compare(password, user.password);

    if(isPasswordValid) {

      //create a json web token
      const token = await jwt.sign({ _id : user._id}, 'Match@Made!@12');

      //Add the token to cookie and send the response back to the user
      res.cookie("token", token)

      res.send("Login successful")
    } else {
      throw new Error("Passwor is incorrect")
    }  

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
 
  try {
const user = await req.user;

res.send(user);

   
  } catch (err) {
    res.status(404).send("Error :" + err.message);
  }
});

//to get the data of single user with email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailID;
  try {
    const users = await User.find({ emailID: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Error saving the user:" + err.message);
  }
});

//get all the user from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//delete the user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted succesfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user", async (req, res) => {
    const userId = req.body.id;
    const data = req.body;
  
    try {
      const allowUpdates = ['age', 'gender', 'photoUrl', 'skills', 'about']; // Allowed fields

      
  
      // Check if all keys in data are allowed
      const isAllow = Object.keys(data).every(k => allowUpdates.includes(k));
      if (!isAllow) {
        return res.status(400).send('Invalid fields in data');
      }
  
      // Check if the 'skills' field is an array and has more than 10 items
      if (Array.isArray(data.skills) && data.skills.length > 10) {
        return res.status(400).send('Skills cannot have more than 10 items');
      }
  
      // Find the user and update
      const user = await User.findByIdAndUpdate(userId, data, {
        new: true,  // This ensures the updated user is returned
        runValidators: true,
      });
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      res.send('User updated successfully');
    } catch (err) {
      console.error(err);  // Log the error for debugging
      res.status(400).send(err.message || 'Something went wrong');
    }
  });
  

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected:", err.message);
  });
