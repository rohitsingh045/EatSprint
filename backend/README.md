# EatSprint Backend API

Node.js/Express backend for the EatSprint food delivery platform.

## Features

- 🔐 JWT-based authentication
- 🛡️ Helmet.js security headers
- 🔒 HTTPS enforcement (production)
- 📦 File upload with Multer
- 💳 Payment integration (Stripe, Razorpay)
- 📊 MongoDB database
- 🚀 RESTful API design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install security packages:
```bash
npm install helmet express-rate-limit
```

3. Configure environment variables:
Create `.env` file:
```env
MONGO_URL=your_mongodb_connection_string
PORT=5001
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_key
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
```

4. Start server:
```bash
# Development
npm run server

# Production
npm start
```

## API Endpoints

### User Routes (`/api/user`)
- `POST /register` - Register new user
- `POST /login` - User login

### Food Routes (`/api/food`)
- `POST /add` - Add food item (admin)
- `GET /list` - List all food items
- `POST /remove` - Remove food item (admin)

### Order Routes (`/api/order`)
- `POST /place` - Place new order
- `GET /list` - List all orders (admin)
- `POST /status` - Update order status (admin)
- `POST /user-orders` - Get user orders
- `POST /verify` - Verify payment

### Cart Routes (`/api/cart`)
- `POST /add` - Add to cart
- `POST /remove` - Remove from cart
- `GET /get` - Get cart items

## Security Features

### Helmet.js Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options (nosniff)
- X-Frame-Options (deny)
- Strict-Transport-Security (HSTS)
- X-XSS-Protection

### HTTPS Enforcement
Automatically redirects HTTP to HTTPS in production when `NODE_ENV=production`.

### Rate Limiting
- **General Routes**: 100 requests per 15 minutes per IP
- **Auth Routes**: 5 login attempts per 15 minutes per IP
- Prevents brute force and DOS attacks

### File Upload Security
- **Allowed Types**: JPEG, JPG, PNG, WebP, GIF only
- **Max Size**: 5MB per file
- **Filename Sanitization**: Random generated names
- **Type Validation**: MIME type checking

### CORS Protection
Whitelist-based origin checking:
- Only configured domains can access API
- Credentials support enabled
- Development and production URLs separated

### Request Size Limiting
JSON payload limited to 10MB to prevent DOS attacks.

### Error Handling
- Development: Detailed error messages
- Production: Generic error messages (no stack traces)

## Production Deployment

1. Set environment:
```env
NODE_ENV=production
```

2. Use HTTPS:
- Configure SSL certificate on hosting platform
- Update API URLs to use HTTPS

3. Secure secrets:
- Use strong JWT secret (32+ characters)
- Never commit .env files
- Rotate secrets regularly

## Dependencies

- **express** - Web framework
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting & DOS protection
- **mongoose** - MongoDB ORM
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **multer** - File upload with validation
- **cors** - Cross-origin requests (whitelisted)
- **stripe/razorpay** - Payment processing

## Scripts

- `npm start` - Production server
- `npm run server` - Development server with nodemon

## License

ISC
