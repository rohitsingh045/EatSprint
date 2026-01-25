import foodModel from '../models/foodModel.js';
import { v2 as cloudinary } from 'cloudinary';

const addFood = async (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    // Get Cloudinary URL from uploaded file
    let image_filename = req.file ? req.file.path : null;

    console.log("🖼️ Cloudinary Image URL:", image_filename);

    const food = new foodModel({
        name,
        description,
        price,
        category,
        image: image_filename,
    });

    try {
        await food.save();
        console.log("✅ Food saved to MongoDB with image:", image_filename);
        res.json({ success: true, message: "Food Added" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error saving food" });
    }
};

// All food list
const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({ success: true, data: foods })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Error" })
    }
}

// Remove food item
const removeFood = async(req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        
        // Delete from Cloudinary if image exists
        if (food.image) {
            // Extract public_id from Cloudinary URL
            const urlParts = food.image.split('/');
            const filename = urlParts[urlParts.length - 1];
            const publicId = `eatsprint-foods/${filename.split('.')[0]}`;
            
            try {
                await cloudinary.uploader.destroy(publicId);
            } catch (cloudinaryError) {
                console.log('Cloudinary delete error:', cloudinaryError);
            }
        }

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success: true, message: "Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success: false, message: "Error"})
    }
}

export { addFood, listFood, removeFood };