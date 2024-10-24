const mongoose = require("mongoose");

// Establishing connection to the database

const connectDb = async () => {
    try {
    
    await mongoose.connect(process.env.MONGO_URL);

        console.log('MongoDB connection established');
 
    }
    catch (error) {
        console.log('Error occured');
    }
}

module.exports = connectDb;