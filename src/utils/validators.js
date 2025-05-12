const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailID, password} = req.body;
  if (!firstName || !lastName) {
    throw new Error("firstName and lastName is required");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("Invalid credentials");
  }
   else if (!validator.isEmail(emailID)) {
    throw new Error("Invalid email password");
   }
   else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a Strong Password");
   }

};

module.exports = {
    validateSignUpData,
}
