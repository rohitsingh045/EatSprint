# EatSprint Admin Panel

Admin dashboard for managing the EatSprint food delivery platform.

## Features

- **Add Food Items** - Upload food items with images, descriptions, prices, and categories
- **List Management** - View, search, and delete food items
- **Order Management** - Track and update order statuses in real-time
- **Search & Filter** - Quickly find food items and orders

## Tech Stack

- React 18.2 with Vite
- React Router for navigation
- Axios for API calls
- React Toastify for notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file:
```
VITE_API_URL=http://localhost:5001
VITE_CURRENCY=₹
```

3. Start development server:
```bash
npm run dev
```

Admin panel runs on `http://localhost:5174`

## Security

This application implements multiple security layers:

- ✅ **Helmet.js** - Security headers (XSS, Clickjacking, MIME sniffing protection)
- ✅ **HTTPS Enforcement** - Automatic redirect in production
- ✅ **JWT Authentication** - User session management
- ✅ **Environment Variables** - Secure configuration management
- ✅ **Error Handling** - Safe error messages (no stack traces in production)
- ✅ **CORS Configuration** - Cross-origin request handling
- ✅ **Input Validation** - Client and server-side validation

See [SECURITY.md](../SECURITY.md) for detailed security guidelines.

## Environment Variables

- `VITE_API_URL` - Backend API URL (default: http://localhost:5001)
- `VITE_CURRENCY` - Currency symbol (default: ₹)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
