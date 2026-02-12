import React from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from '../../utils/toast'

const Cart = () => {
  const {cartItems, food_list, removeFromCart, getTotalCartAmount, url, addToCart} = useContext(StoreContext);
  const navigate = useNavigate();

  const cartCount = food_list.filter(item => cartItems[item._id] > 0).length;

  const getImageUrl = (img) => {
    if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    return `${url}/images/${img}`;
  };

  const handleRemoveItem = (item) => {
    for(let i = 0; i < cartItems[item._id]; i++) {
      removeFromCart(item._id);
    }
    showToast.success(`${item.name} removed from cart`);
  };

  return (
    <div className='cart'>
      <div className="cart-header">
        <h2>Shopping Cart</h2>
        <p className="cart-count">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      {cartCount === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add some delicious items to get started!</p>
          <button onClick={() => navigate('/')} className="browse-menu-btn">
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-header">
              <p>Item</p>
              <p>Details</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Action</p>
            </div>

            <div className="cart-items-list">
              {food_list.map((item) => {
                if (cartItems[item._id] > 0) {
                  return (
                    <div key={item._id} className='cart-item-card'>
                      <div className="cart-item-image">
                        <img src={getImageUrl(item.image)} alt={item.name} />
                      </div>
                      
                      <div className="cart-item-details">
                        <h4>{item.name}</h4>
                        <p className="item-category">{item.category || 'Food Item'}</p>
                      </div>

                      <div className="cart-item-price">
                        <p>₹{item.price}</p>
                      </div>

                      <div className="cart-item-quantity">
                        <button 
                          className="qty-btn minus" 
                          onClick={() => removeFromCart(item._id)}
                        >
                          -
                        </button>
                        <span className="qty-value">{cartItems[item._id]}</span>
                        <button 
                          className="qty-btn plus" 
                          onClick={() => addToCart(item._id)}
                        >
                          +
                        </button>
                      </div>

                      <div className="cart-item-total">
                        <p>₹{(item.price * cartItems[item._id]).toFixed(2)}</p>
                      </div>

                      <div className="cart-item-remove">
                        <button 
                          onClick={() => handleRemoveItem(item)} 
                          className='remove-btn'
                          title="Remove item"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>

          <div className="cart-bottom">
            <div className="cart-promocode">
              <div className="promocode-card">
                <h3>Have a Promo Code?</h3>
                <p>Enter your code to get special discounts</p>
                <div className='cart-promocode-input'>
                  <input type="text" placeholder='Enter promo code' />
                  <button>Apply</button>
                </div>
              </div>
            </div>

            <div className="cart-total">
              <h2>Order Summary</h2>
              <div className="summary-details">
                <div className="cart-total-row">
                  <p>Subtotal</p>
                  <p>₹{getTotalCartAmount().toFixed(2)}</p>
                </div>
                <div className="cart-total-row delivery-row">
                  <p>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                    Delivery Fee
                  </p>
                  <p className="free-delivery">FREE</p>
                </div>
                <hr />
                <div className="cart-total-row total-row">
                  <h3>Total</h3>
                  <h3>₹{getTotalCartAmount().toFixed(2)}</h3>
                </div>
              </div>
              <button 
                onClick={() => navigate('/order')} 
                className="checkout-btn"
              >
                <span>Proceed to Checkout</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
              <p className="secure-checkout">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Secure Checkout
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
