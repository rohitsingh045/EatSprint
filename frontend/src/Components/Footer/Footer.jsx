

import React, { useState, useEffect, useCallback } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const FooterCompact = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const currentYear = new Date().getFullYear();

  // Show "Back to Top" button only after scrolling down 400px
  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 400) {
        setShowScrollBtn(true);
      } else {
        setShowScrollBtn(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const handleNewsletterSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newsletterEmail.trim()) return;

      setIsSubscribed(true);
      setNewsletterEmail('');

      setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);
    },
    [newsletterEmail]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-compact" id="footer">
      <div className="footer-content">
        
        {/* Brand & Mission */}
        <div className="footer-section brand-info">
          <img
            src={assets.logo}
            alt="EatSprint Logo"
            className="footer-logo"
            loading="lazy"
          />
          <p>Sprinting fresh flavors straight to your doorstep. Quality ingredients, lightning-fast delivery.</p>
          <div className="payment-icons">
             {/* Replace these strings with your actual payment icon assets if available */}
             <span>💳</span> <span>🅿️</span> <span>🏦</span>
             <small>Secure Payments</small>
          </div>
        </div>

        {/* Navigation - Added more "Important" links */}
        <nav className="footer-section" aria-label="Footer navigation">
          <h4>Explore</h4>
          <div className="links-row">
            <a href="/">Home</a>
            <a href="/#menu">Our Menu</a>
            <a href="/myorders">Track Orders</a>
            <a href="/about">Our Story</a>
            <a href="/contact">Help Center</a>
          </div>
        </nav>

        {/* Contact info - More professional layout */}
        <div className="footer-section">
          <h4>Get in Touch</h4>
          <div className="contact-row">
            <p>📍 123 Delivery St, Foodie City</p>
            <a href="tel:+918229862782">📞 +91 82298 62782</a>
            <a href="mailto:support@eatsprint.com">✉️ support@eatsprint.com</a>
            <p className="working-hours">⏰ 10:00 AM - 11:00 PM</p>
          </div>
        </div>

        {/* Newsletter + Social */}
        <div className="footer-section">
          <h4>Join the Foodie Club</h4>
          <p className="newsletter-text">Get 10% off your first order!</p>

          <form
            onSubmit={handleNewsletterSubmit}
            className="newsletter-compact"
            aria-live="polite"
          >
            <input
              type="email"
              placeholder="Enter email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              disabled={isSubscribed}
              aria-label="Subscribe"
            >
              {isSubscribed ? '✓' : 'Join'}
            </button>
          </form>

          <div className="social-icons-compact">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {currentYear} <span className="brand-highlight">EatSprint</span>. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/cookies">Cookies</a>
        </div>
      </div>

      {/* Conditional Back to top button */}
      {showScrollBtn && (
        <button
          className="back-to-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </footer>
  );
};

export default FooterCompact;