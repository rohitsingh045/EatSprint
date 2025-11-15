# EatSprint - Food Delivery Application

A full-stack food delivery application built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring a customer frontend, admin panel, and backend API with integrated Stripe payments.

## 📁 Project Structure

```
EatSprint/
├── admin/          # Admin panel for managing orders and menu
├── backend/        # Express.js server and API
└── frontend/       # Customer-facing React application
```

## 🚀 Features

### Frontend (Customer App)
- **Browse Menu**: Explore diverse food categories with search functionality
- **Cart Management**: Add/remove items with real-time cart updates
- **User Authentication**: Secure login and registration with JWT
- **Order Placement**: Complete checkout with delivery information
- **Order Tracking**: View order history and current order status
- **Payment Integration**: Stripe payment gateway integration
- **Responsive Design**: Mobile-friendly UI with smooth animations

### Admin Panel
- **Menu Management**: Add, edit, and remove food items
- **Order Management**: View and update order status
- **Image Upload**: Upload food images for menu items
- **Dashboard**: Overview of all orders and menu items

### Backend
- **RESTful API**: Express.js server with organized routes
- **Authentication**: JWT-based user authentication
- **Database**: MongoDB with Mongoose ODM
- **File Upload**: Multer for handling image uploads
- **Payment Processing**: Stripe integration for secure payments
- **CORS Enabled**: Cross-origin resource sharing configured

## 🛠️ Tech Stack

### Frontend
- React 19.0.0
- React Router DOM 7.5.0
- Axios for API calls
- Vite for build tooling
- CSS3 with animations

### Backend
- Node.js with Express 5.1.0
- MongoDB with Mongoose 8.13.2
- JWT for authentication
- Bcrypt for password hashing
- Stripe 18.0.0 for payments
- Multer for file uploads
- Validator for data validation

### Admin Panel
- React 18.2.0
- React Router DOM 6.22.0
- Axios
- React Toastify for notifications
- Vite

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Stripe account for payment processing

### Backend Setup

```bash
cd backend
npm install

# Create .env file with the following variables:
# MONGO_URL=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret
# STRIPE_SECRET_KEY=your_stripe_secret_key

npm start
# Server runs on http://localhost:5001
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

### Admin Panel Setup

```bash
cd admin
npm install
npm run dev
# Admin panel runs on http://localhost:5174
```

## 🔑 Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📱 Key Components

### Frontend Components
- **Navbar** - Navigation with cart and user menu
- **Header** - Hero section with call-to-action
- **ExploreMenu** - Category browser
- **FoodDisplay** - Food items grid
- **FoodItem** - Individual food card with add/remove functionality
- **LoginPopup** - Authentication modal
- **Cart** - Shopping cart page
- **PlaceOrder** - Checkout page
- **MyOrders** - Order history and tracking
- **Verify** - Payment verification page
- **Footer** - Site footer with links
- **AppDownload** - Mobile app download section

### Backend API Routes

#### User Routes (`/api/user`)
- `POST /register` - Register new user
- `POST /login` - User login

#### Food Routes (`/api/food`)
- `POST /add` - Add new food item (admin)
- `GET /list` - Get all food items
- `POST /remove` - Remove food item (admin)

#### Cart Routes (`/api/cart`)
- `POST /add` - Add item to cart
- `POST /remove` - Remove item from cart
- `POST /get` - Get user cart

#### Order Routes (`/api/order`)
- `POST /place` - Place new order
- `POST /verify` - Verify Stripe payment
- `POST /userorders` - Get user orders
- `GET /list` - Get all orders (admin)
- `POST /status` - Update order status (admin)

### Admin Components
- **Add** - Add new food items with image upload
- **List** - View and manage food items
- **Orders** - Manage customer orders and update status
- **Sidebar** - Navigation sidebar
- **Navbar** - Admin navigation bar

## 🎨 Design Features

- Modern gradient backgrounds and animations
- Smooth transitions and hover effects
- Responsive grid layouts
- Loading states and toast notifications
- Mobile-optimized navigation
- Clean and intuitive user interface

## 🔐 Authentication Flow

1. User registers/logs in via LoginPopup component
2. Backend validates credentials using `userController.js`
3. Password hashed with bcrypt
4. JWT token issued and stored in localStorage
5. Token used for authenticated requests via `auth.js` middleware
6. Protected routes require valid token

## 💳 Payment Flow

1. User adds items to cart via `StoreContext`
2. User fills delivery information in PlaceOrder page
3. Order sent to backend `orderController.js`
4. Stripe checkout session created with order details
5. User redirected to Stripe payment page
6. After payment, redirected to Verify page
7. Payment verified and order status updated
8. User can view order in MyOrders page

## 📊 Database Models

### User Model
- name, email, password
- cartData (object storing food items and quantities)
- Timestamps

### Food Model
- name, description, price
- image (file path)
- category
- Timestamps

### Order Model
- userId, items (array)
- amount, address (delivery details)
- status (Food Processing, Out for delivery, Delivered)
- payment (boolean)
- Timestamps

## 🌐 API Endpoints

**Base URL**: `http://localhost:5001`

### Authentication
```
POST /api/user/register
POST /api/user/login
```

### Food Management
```
POST /api/food/add (with image upload)
GET /api/food/list
POST /api/food/remove
```

### Cart Operations
```
POST /api/cart/add
POST /api/cart/remove
POST /api/cart/get
```

### Orders
```
POST /api/order/place
POST /api/order/verify
POST /api/order/userorders
GET /api/order/list
POST /api/order/status
```

## 🚀 Deployment

The backend includes Vercel configuration in `vercel.json` for easy deployment.

### Vercel Deployment
```bash
cd backend
vercel
```

## 📄 Scripts

### Backend
```bash
npm start          # Start server with node
npm run server     # Start server with nodemon (dev)
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Admin
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔧 Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Admin Panel
cd admin
npm run dev
```

## 📝 File Upload

Food images are uploaded to the `backend/uploads` directory using Multer middleware. Images are served statically via Express.

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with validator
- CORS configuration
- Environment variables for sensitive data
- Authentication middleware for protected routes

## 🌟 Key Features Highlight

- **Context API**: Global state management with StoreContext
- **Protected Routes**: Authentication-based route protection
- **Real-time Cart**: Dynamic cart updates without page reload
- **Order Tracking**: Multi-stage order status (Processing → Out for Delivery → Delivered)
- **Image Upload**: Admin can upload food images
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Toast Notifications**: User-friendly feedback messages
- **Payment Integration**: Secure Stripe checkout

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📧 Contact

For any inquiries, please contact the repository owner.

## 📄 License

ISC

---

**Note**: This is a food delivery application with integrated payment processing. Ensure proper security measures and environment variables are configured before deploying to production.
