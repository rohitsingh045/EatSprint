import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import foodRouter from './routes/foodRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// HTTPS Redirect Middleware (for production)
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(301, `https://${req.headers.host}${req.url}`);
  }
  next();
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development',
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit login attempts
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
  skipSuccessfulRequests: true,
  skip: (req) => process.env.NODE_ENV === 'development',
});

app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS Configuration
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      // and allow all origins in development
      if (!origin || process.env.NODE_ENV !== 'production' || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
};

app.use(cors(corsOptions));

// DB connection
connectDB().catch(error => {
  console.error('Database connection failed:', error.message);
});

// API routes
app.use('/api/user', authLimiter, userRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message 
  });
});

app.get('/',(req,res)=>{
    res.send("API working successfully")
})

// Export for Vercel serverless
export default app;

// Only listen on port if not in serverless environment  
if (process.env.VERCEL !== '1') {
  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
}
