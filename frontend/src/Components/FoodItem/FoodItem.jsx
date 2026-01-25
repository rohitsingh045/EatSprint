import React, { useContext, useState, useEffect } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [isHovered, setIsHovered] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Helper function to get correct image URL
  const getImageUrl = (img) => {
    // If image is already a full URL (starts with http), use it directly
    if (img && (img.startsWith('http://') || img.startsWith('https://'))) {
      return img;
    }
    // Otherwise, it's an old local path, use the backend URL
    return `${url}/images/${img}`;
  };

  // Simulate determining if item is new or popular (you can replace this with real logic)
  useEffect(() => {
    // Random chance for demo - replace with real data
    setIsNew(Math.random() < 0.2); // 20% chance of being "new"
    setIsPopular(Math.random() < 0.3); // 30% chance of being "popular"
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(id);
  };

  const handleQuickRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(id);
  };

  const itemCount = cartItems[id] || 0;

  return (
    <div 
      className='food-item'
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
    >
      <div className="food-item-img-container">
        {/* Badges */}
        {isNew && <div className="new-badge">New</div>}
        {isPopular && <div className="popular-badge">Popular</div>}
        
        {/* Image with loading placeholder */}
        <img 
          className='food-item-image' 
          src={getImageUrl(image)} 
          alt={name}
          onLoad={handleImageLoad}
          onError={(e) => {
            console.error('Image load error for:', name, 'URL:', getImageUrl(image));
            e.target.style.opacity = 0.3;
          }}
          style={{
            opacity: imageLoaded ? 1 : 0.7,
            transition: 'opacity 0.3s ease'
          }}
        />
        
        {/* Loading overlay */}
        {!imageLoaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '20px 20px 0 0'
          }} />
        )}

        {/* Add to cart controls */}
        {!itemCount ? (
          <img
            className='add'
            onClick={handleQuickAdd}
            src={assets.add_icon_white}
            alt="Add to cart"
            title="Add to cart"
            style={{
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
          />
        ) : (
          <div className='food-item-counter'>
            <img 
              onClick={handleQuickRemove} 
              src={assets.remove_icon_red} 
              alt="Remove from cart"
              title="Remove from cart"
            />
            <p>{itemCount}</p>
            <img 
              onClick={handleQuickAdd} 
              src={assets.add_icon_green} 
              alt="Add more"
              title="Add more"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p title={name}>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        
        <p className="food-item-desc" title={description}>
          {description}
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '15px'
        }}>
          <p className="food-item-price">
            {price}
          </p>
          
          {/* Quick action buttons */}
          <div style={{
            display: 'flex',
            gap: '8px',
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add to favorites functionality (you can implement this)
                console.log('Added to favorites:', name);
              }}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              title="Add to favorites"
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              ❤️
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Share functionality (you can implement this)
                console.log('Sharing:', name);
              }}
              style={{
                background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                border: 'none',
                borderRadius: '50%',
                width: '30px',
                height: '30px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease'
              }}
              title="Share"
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              📤
            </button>
          </div>
        </div>

        {/* Item in cart indicator */}
        {itemCount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '15px',
            fontSize: '0.8rem',
            fontWeight: '600',
            textAlign: 'center',
            marginTop: '10px',
            animation: 'scaleIn 0.3s ease-out'
          }}>
            🛒 {itemCount} in cart
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
