import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true }, // Fix the typo here
        password: { type: String, required: true },
        cartData: { type: Object, default: {} },
    },
    { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;


export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (error) {
        console.error("DB Connection Error:", error.message);
        process.exit(1); // Exit process with failure
    }
};