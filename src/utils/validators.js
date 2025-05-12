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


const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};



module.exports = {
    validateSignUpData,
    validateEditProfileData
}
