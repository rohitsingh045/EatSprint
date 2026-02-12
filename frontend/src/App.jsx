import React, { Suspense, lazy, useState } from 'react';
import Navbar from './Components/Navbar';
import { Route, Routes } from 'react-router-dom';
import Footer from './Components/Footer/Footer';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = lazy(() => import('./pages/Home/Home'));
const Cart = lazy(() => import('./pages/cart/Cart'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder/PlaceOrder'));
const Verify = lazy(() => import('./pages/Verify/Verify'));
const MyOrders = lazy(() => import('./pages/MyOrders/MyOrders'));
const About = lazy(() => import('./pages/About/AboutNew'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

const LoadingFallback = () => (
  <div style={styles.loading}>
    <div style={styles.spinner}></div>
    <p>Loading...</p>
  </div>
);

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <ErrorBoundary>
      <ToastContainer />
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

      <div className='app'>
        <Navbar setShowLogin={setShowLogin} />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/about' element={<About />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    color: '#4a5568'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default App;
