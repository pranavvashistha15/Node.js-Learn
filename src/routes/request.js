
const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");





// Define the route for sending a connection request
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    // Extract the sender's ID (from the authenticated user), recipient's ID, and status from the request
    const fromUserId = req.user._id; // The ID of the user who is sending the request
    const toUserId = req.params.toUserId; // The ID of the user who will receive the request
    const status = req.params.status; // The status of the request (either "interested", "ignored", etc.)

    // Define the allowed status values for the request
    const allowedStatus = ["ignored", "accepted"];
    
    // Check if the provided status is valid
    if (!allowedStatus.includes(status)) {
      // If the status is not valid, return a 400 (Bad Request) with a message
      return res.status(400).json({ message: "Invalid status type: " + status });
    }

    // Fetch the recipient user to check if they exist in the database
    const toUser = await User.findById(toUserId); // Find the recipient user by their ID
    if (!toUser) {
      // If the recipient user is not found, return a 404 (Not Found) with a message
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the sender and recipient are the same user (to prevent self-request)
    if (fromUserId.toString() === toUserId.toString()) {
      // If they are the same user, return a 400 (Bad Request) with an error message
      return res.status(400).json({ message: "You cannot send a request to yourself!" });
    }

    // Check if a connection request already exists between the two users
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId }, // Request from the sender to the receiver
        { fromUserId: toUserId, toUserId: fromUserId }, // Request from the receiver to the sender (reverse check)
      ],
    });
    
    // If a connection request already exists, return a 400 (Bad Request) with an error message
    if (existingConnectionRequest) {
      return res.status(400).send({ message: "Connection Request Already Exists!!" });
    }

    // Create a new connection request object with the provided data
    const connectionRequest = new ConnectionRequest({
      fromUserId, // Sender's ID
      toUserId, // Recipient's ID
      status, // Status of the request (e.g., "interested", "ignored")
    });

    // Save the new connection request to the database
    const data = await connectionRequest.save();

    // Return a success response with the created data
    res.json({
      message: `Connection request from ${req.user.firstName} to ${toUser.firstName} with status: ${status}`,
      data, // The saved request data
    });
    
  } catch (err) {
    // If any error occurs during the process, return a 402 (Payment Required) with the error message
    res.status(402).send("Error: " + err.message);
  }
});

  
  

module.exports = requestRouter;