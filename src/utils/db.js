

import mongoose from 'mongoose';
import 'dotenv/config';

const connectToDB = async () => {
    const URL_DB = process.env.MONGODB_URI;
    const DB_NAME = process.env.DB_NAME;

    try {
        await mongoose.connect(URL_DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB.");

        // Return the connection object
        return mongoose.connection.db;
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        throw err;
    }
};

export default connectToDB;
