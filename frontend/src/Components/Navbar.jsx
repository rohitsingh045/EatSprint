import { useState, useRef, useEffect, useContext } from 'react';
import './Navbar/Navbar.css';
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartItems, token, setToken } = useContext(StoreContext);
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const toggleSearch = () => {
    setSearchVisible(prev => !prev);
    if (searchVisible) {
      setSearchQuery("");
    }
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <Link to='/'
      onClick={() => {
              setMenu("home");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
             className="navbar-brand">
        <img src={assets.logo} alt="Tomato Logo" className="logo" />
      </Link>
      
      <ul className={`navbar-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <li>
          <Link
            to='/'
            onClick={() => {
              setMenu("home");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={menu === "home" ? "active-link" : ""}
          >
            🏠 Home
          </Link>
        </li>
        <li>
          <a 
            href='#explore-menu' 
            onClick={() => {
              setMenu("menu");
              setMobileMenuOpen(false);
            }} 
            className={menu === "menu" ? "active-link" : ""}
          >
            🍽️ Menu
          </a>
        </li>
        <li>
          <a 
            href='#app-download' 
            onClick={() => {
              setMenu("mobile-app");
              setMobileMenuOpen(false);
            }} 
            className={menu === "mobile-app" ? "active-link" : ""}
          >
            📱 Mobile App
          </a>
        </li>
        <li>
          <Link 
            to='/contact' 
            onClick={() => {
              setMenu("contact");
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={menu === "contact" ? "active-link" : ""}
          >
            📞 Contact
          </Link>
        </li>
      </ul>

      <div className="navbar-right">
        {/* Search Section */}
        <div className={`search-container ${searchVisible ? 'search-open' : ''}`}>
          {searchVisible && (
            <input
              type="text"
              placeholder="Search food..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              autoFocus
            />
          )}
          <button className="search-btn" onClick={toggleSearch}>
            {searchVisible ? '✕' : '🔍'}
          </button>
        </div>

        {/* Cart Section */}
        <div className="navbar-cart">
          <Link to='/cart' className="cart-link">
            <div className="cart-icon-wrapper">
              <img src={assets.basket_icon} alt="cart" />
              {getTotalCartItems() > 0 && (
                <span className="cart-badge">{getTotalCartItems()}</span>
              )}
            </div>
          </Link>
        </div>

        {/* Auth Section */}
        {!token ? (
          <button className="signin-btn" onClick={() => setShowLogin(true)}>
            <span className="btn-icon">👤</span>
            Sign In
          </button>
        ) : (
          <div className='navbar-profile' ref={dropdownRef}>
            <div className="profile-avatar" onClick={toggleDropdown}>
              <img src={assets.profile_icon} alt="profile" />
              <span className="online-indicator"></span>
            </div>
            {dropdownOpen && (
              <ul className='nav-profile-dropdown'>
                <li onClick={() => navigate('/myorders')}>
                  <img src={assets.bag_icon} alt="orders" />
                  <span>My Orders</span>
                  <div className="dropdown-arrow">→</div>
                </li>
                <li onClick={logout}>
                  <img src={assets.logout_icon} alt="logout" />
                  <span>Logout</span>
                  <div className="dropdown-arrow">→</div>
                </li>
              </ul>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
