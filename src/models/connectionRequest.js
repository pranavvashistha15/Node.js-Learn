const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);


// Create an index on 'fromUserId' and 'toUserId' fields to speed up queries
// This index will allow faster searching for connections between users by 'fromUserId' and 'toUserId'
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

// Middleware to check before saving a connection request
connectionRequestSchema.pre("save", function (next) {
  // 'this' refers to the current instance of the connection request being saved

  // Check if the 'fromUserId' (sender) is the same as 'toUserId' (receiver)
  if (this.fromUserId.equals(this.toUserId)) {
    // If the sender and receiver are the same, prevent saving the request and return an error
    return next(new Error("Cannot send connection request to yourself!"));
  }

  // If the sender and receiver are different, proceed with saving the connection request
  next();
});



const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectionRequestModel;
