import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

dotenv.config();

const run = async () => {
    await connectDB();
    const result = await User.deleteOne({ email: process.env.ADMIN_EMAIL });
    console.log("Deleted:", result.deletedCount);
    await mongoose.connection.close();
    process.exit(0);
};

run();