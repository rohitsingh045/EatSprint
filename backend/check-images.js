import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    checkFoodImages();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Food Model
const foodSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
});

const foodModel = mongoose.model("Food", foodSchema);

async function checkFoodImages() {
  try {
    const foods = await foodModel.find({}).limit(5);
    
    console.log('\n📊 Checking Food Items in Database:\n');
    console.log('Total items found:', foods.length);
    console.log('\n' + '='.repeat(80) + '\n');
    
    foods.forEach((food, index) => {
      console.log(`${index + 1}. ${food.name}`);
      console.log(`   Category: ${food.category}`);
      console.log(`   Price: ₹${food.price}`);
      console.log(`   Image: ${food.image}`);
      console.log(`   Is Cloudinary URL: ${food.image.includes('cloudinary.com') ? '✅ YES' : '❌ NO (Local path)'}`);
      console.log('\n' + '-'.repeat(80) + '\n');
    });
    
    const cloudinaryCount = foods.filter(f => f.image.includes('cloudinary.com')).length;
    const localCount = foods.length - cloudinaryCount;
    
    console.log('\n📈 Summary:');
    console.log(`   Cloudinary URLs: ${cloudinaryCount}`);
    console.log(`   Local paths: ${localCount}`);
    
    if (localCount > 0) {
      console.log('\n⚠️  WARNING: Some images still use local paths!');
      console.log('   These will NOT work on Vercel.');
      console.log('   You need to re-upload these items through the admin panel.');
    } else {
      console.log('\n✅ All images use Cloudinary URLs - Ready for deployment!');
    }
    
  } catch (error) {
    console.error('Error fetching food items:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n👋 Database connection closed');
  }
}
