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

// Log environment for debugging
console.log('🔧 Environment:', process.env.NODE_ENV);
console.log('🔧 MongoDB:', process.env.MONGO_URL ? 'Set' : 'Missing');
console.log('🔧 Cloudinary Name:', process.env.CLOUDINARY_NAME ? 'Set' : 'Missing');

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
  max: 1000, // Increased limit for development
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Increased for development
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
  skipSuccessfulRequests: true,
  skip: (req) => process.env.NODE_ENV === 'development', // Skip in development
});

// Apply rate limiting to all routes (disabled in development)
app.use(limiter);

// Middleware
app.use(express.json({ limit: '10mb' }));

// CORS Configuration - More permissive for development
const isDevelopment = process.env.NODE_ENV !== 'production';

if (isDevelopment) {
  // Development: Allow all localhost origins
  app.use(cors({
    origin: true,
    credentials: true
  }));
  console.log('🔓 CORS: Development mode - All origins allowed');
} else {
  // Production: Whitelist specific domains
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.ADMIN_URL
  ].filter(Boolean);

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log('❌ CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200
  };

  app.use(cors(corsOptions));
  console.log('🔒 CORS: Production mode - Whitelist enabled');
}

// DB connection
connectDB().catch(error => {
  console.error('❌ Database connection failed:', error.message);
});

// API routes
app.use('/api/user', authLimiter, userRouter);
app.use('/api/food', foodRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
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
    console.log(`🚀 Server started on http://localhost:${port}`);
  });
}
