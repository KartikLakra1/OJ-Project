import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
    const MONGOURL = process.env.MONGODB_URI;
    console.log(MONGOURL);
    try {
        await mongoose.connect(MONGOURL);
        console.log("Database connected successfully");
        
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1); 
    }
}

export default connectDB;