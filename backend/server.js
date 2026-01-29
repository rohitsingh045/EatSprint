import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// Static folder for images
app.use('/images', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/user', userRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Server Error' });
});

app.get('/',(req,res)=>{
    res.send("API working successfully")
})

app.listen(port, () => {
});
