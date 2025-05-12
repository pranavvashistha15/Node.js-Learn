const mongoose = require('mongoose');
const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://pranavvashistha:8TDcTpodgsV9LMJe@fullstack-app.az9mpqn.mongodb.net/"
    );
};


module.exports =  connectDB ;