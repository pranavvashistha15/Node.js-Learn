const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    emailID: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error(
            "Invalid gender value. Accepted values are: male, female, others."
          );
        }
      },
    },
    age: {
      type: Number,
      min: [18, "You must be at least 18 years old to register."]
    },
    photoUrl: {
      type: String,
      trim: true,
      default:
        "https://thumbs.dreamstime.com/z/code-javascript-language-white-background-developing-programming-binar-gibberish-dummy-lorem-ipsum-text-screen-web-dark-291324452.jpg"
    },
    skills: {
      type: [String],
      default: "This is the default value"
    },
    about: {
      type : String,
      default : "This is your default about" 
    }
  },
  {
    timestamps: true,
  }
);

// ✅ Attach methods BEFORE exporting model
userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign(
    { _id: user._id },
    'Match@Made!@12',
    { expiresIn: "7d" }
  );
  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
  return isPasswordValid;
};

// ✅ Export model AFTER methods are defined
module.exports = mongoose.model("User", userSchema);
