import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext, } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    state: '',
    zipcode: '',
    country: '',
    city: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('online');
  const [codConfirmation, setCodConfirmation] = useState({ show: false, orderId: null, message: '' });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (getTotalCartAmount() === 0) {
      alert('Your cart is empty.');
      return;
    }

    try {
      const orderItems = food_list
        .filter((item) => cartItems[item._id] > 0)
        .map((item) => ({
          name: item.name,
          price: Math.round(item.price * 100), // Convert to smallest currency unit (paise)
          quantity: cartItems[item._id],
        }));

         const orderData = {
        address: data,
        items: orderItems,
        amount: Math.round(getTotalCartAmount() * 100), // Convert to paise (no delivery fee)
          paymentMethod,
      };

      // Only send Authorization header if token is valid
      const config = {};
      if (token && token !== "setContext") {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await axios.post(`${url}/api/order/place`, orderData, config);

      if (response.data.success && response.data.session_url) {
        window.location.replace(response.data.session_url);
      } else if (response.data.success && response.data.cod) {
        // COD order placed — show confirmation banner (user can view orders)
        setCodConfirmation({ show: true, orderId: response.data.orderId, message: response.data.message || 'Order placed (Cash on Delivery).' });
        // Auto-navigate to My Orders after 4 seconds
        setTimeout(() => {
          navigate('/myorders');
        }, 4000);
      } else {
        alert(response.data.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order Error:', error.response?.data || error);
      alert(error.response?.data?.message || 'An error occurred while placing the order.');
    }
  };

  const deliveryFee = 0; // Free delivery
  const totalAmount = getTotalCartAmount();
 
const navigate = useNavigate()
  useEffect(()=>{
   if (!token) {
    navigate('/cart') 
   }else if(getTotalCartAmount()===0)
   {
    navigate('/cart')
   }
  },[token])

  return (
    <form onSubmit={handlePlaceOrder} className="place-order">
      {codConfirmation.show && (
        <div className="cod-confirmation">
          <div className="cod-content">
            <div className="success-icon">✓</div>
            <h3>🎉 Order Placed Successfully!</h3>
            <p>{codConfirmation.message}</p>
            {codConfirmation.orderId && (
              <p className="order-id-display">
                Order ID: <span className="order-id-value">{codConfirmation.orderId}</span>
              </p>
            )}
            <div className="actions">
              <button type="button" className="view-orders-btn" onClick={() => navigate('/myorders')}>
                View My Orders
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="place-order-container">
        <div className="place-order-header">
          <h1>📍 Checkout</h1>
          <p className="checkout-subtitle">Complete your order by providing delivery details</p>
        </div>

        <div className="place-order-content">
          <div className="place-order-left">
            <div className="section-card">
              <div className="section-header">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Personal Information
                </h2>
              </div>
              
              <div className="form-group">
                <div className="multi-fields">
                  <div className="input-wrapper">
                    <label>First Name *</label>
                    <input
                      required
                      name="firstName"
                      value={data.firstName}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="John"
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>Last Name *</label>
                    <input
                      required
                      name="lastName"
                      value={data.lastName}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <label>Email Address *</label>
                  <div className="input-with-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      required
                      name="email"
                      value={data.email}
                      onChange={onChangeHandler}
                      type="email"
                      placeholder="john.doe@example.com"
                    />
                  </div>
                </div>

                <div className="input-wrapper">
                  <label>Phone Number *</label>
                  <div className="input-with-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <input
                      required
                      name="phone"
                      value={data.phone}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  Delivery Address
                </h2>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <label>Street Address *</label>
                  <input
                    required
                    name="street"
                    value={data.street}
                    onChange={onChangeHandler}
                    type="text"
                    placeholder="123 Main Street, Apartment 4B"
                  />
                </div>

                <div className="multi-fields">
                  <div className="input-wrapper">
                    <label>City *</label>
                    <input
                      required
                      name="city"
                      value={data.city}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>State *</label>
                    <input
                      required
                      name="state"
                      value={data.state}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                <div className="multi-fields">
                  <div className="input-wrapper">
                    <label>Pin Code *</label>
                    <input
                      required
                      name="zipcode"
                      value={data.zipcode}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="400001"
                    />
                  </div>
                  <div className="input-wrapper">
                    <label>Country *</label>
                    <input
                      required
                      name="country"
                      value={data.country}
                      onChange={onChangeHandler}
                      type="text"
                      placeholder="India"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="section-card">
              <div className="section-header">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Payment Method
                </h2>
              </div>

              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'online' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="online"
                    checked={paymentMethod === 'online'}
                    onChange={() => setPaymentMethod('online')}
                  />
                  <div className="payment-card">
                    <div className="payment-icon online">💳</div>
                    <div className="payment-info">
                      <h4>Online Payment</h4>
                      <p>Pay securely with cards, UPI, wallets</p>
                    </div>
                    <div className="check-icon">✓</div>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-card">
                    <div className="payment-icon cod">💵</div>
                    <div className="payment-info">
                      <h4>Cash on Delivery</h4>
                      <p>Pay with cash when you receive</p>
                    </div>
                    <div className="check-icon">✓</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="place-order-right">
            <div className="order-summary-card">
              <h2>Order Summary</h2>
              
              <div className="order-items-preview">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  Cart Items
                </h3>
                <div className="items-list">
                  {food_list.filter((item) => cartItems[item._id] > 0).map((item) => (
                    <div key={item._id} className="summary-item">
                      <div className="item-info">
                        <span className="item-name">{item.name}</span>
                        <span className="item-qty">× {cartItems[item._id]}</span>
                      </div>
                      <span className="item-price">₹{(item.price * cartItems[item._id]).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{getTotalCartAmount().toFixed(2)}</span>
                </div>
                <div className="summary-row delivery">
                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    Delivery Fee
                  </span>
                  <span className="free">FREE</span>
                </div>
                <hr />
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button type="submit" className="place-order-btn" disabled={getTotalCartAmount() === 0}>
                <span>Place Order</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <div className="secure-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                <span>Secure Checkout - Your information is safe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;