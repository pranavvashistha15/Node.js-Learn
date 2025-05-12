const mongoose = require("mongoose");
const validator = require("validator");

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
      // validate(value) {
      //   if(!validator.isEmail(value)) {
      //     throw new Error ("Invalid email" + value);
      //  
      // }
    },
   
     password: {
      type: String,
      required: true,
      unique: true
    //   validate(value){
    //   if(!validate.isStrongPassword(value)) {
    //     throw new Error("Enter Strong Password" + value);
    //   }
    // }

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
        "https://thumbs.dreamstime.com/z/code-javascript-language-white-background-developing-programming-binar-gibberish-dummy-lorem-ipsum-text-screen-web-dark-291324452.jpg",
        // validate(value){
        //   if(!validate.isURL(value)) {
        //     throw new Error("Invalid Photo url" + value);
        //   }
        // },
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

module.exports = mongoose.model("User", userSchema);