// filepath: c:\Users\SHIVAM TIWARI\Desktop\food-del\backend\config\db.js
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        process.exit(1); // Exit process with failure
    }
};