import React, { useState, useEffect, useCallback } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const FooterCompact = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newsletterEmail.trim()) return;

      setIsSubscribed(true);
      setNewsletterEmail('');

      const timer = setTimeout(() => {
        setIsSubscribed(false);
      }, 3000);

      return () => clearTimeout(timer);
    },
    [newsletterEmail]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-compact" id="footer">
      <div className="footer-content">
        {/* Brand */}
        <div className="footer-section">
          <img
            src={assets.logo}
            alt="Tomato brand logo"
            className="footer-logo"
            loading="lazy"
          />
          <p>Fresh, delicious meals delivered fast.</p>
        </div>

        {/* Navigation */}
        <nav className="footer-section" aria-label="Footer navigation">
          <h4>Quick Links</h4>
          <div className="links-row">
            <a href="/">Home</a>
            <a href="/#menu">Menu</a>
            <a href="/myorders">Orders</a>
            <a href="/about">About</a>
          </div>
        </nav>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="contact-row">
            <a href="tel:+918229862782" aria-label="Call us">
              📞 Call
            </a>
            <a href="mailto:contact@.com" aria-label="Email us">
              ✉️ Email
            </a>
          </div>
        </div>

        {/* Newsletter + Social */}
        <div className="footer-section">
          <h4>Stay Updated</h4>

          <form
            onSubmit={handleNewsletterSubmit}
            className="newsletter-compact"
            aria-live="polite"
          >
            <input
              type="email"
              placeholder="Your email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              disabled={isSubscribed}
              aria-label="Subscribe to newsletter"
            >
              {isSubscribed ? '✓' : '→'}
            </button>
          </form>

          <div className="social-icons-compact">
            <a href="#" aria-label="Facebook">
              <img src={assets.facebook_icon} alt="Facebook" loading="lazy" />
            </a>
            <a href="#" aria-label="Twitter">
              <img src={assets.twitter_icon} alt="Twitter" loading="lazy" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={assets.linkedin_icon} alt="LinkedIn" loading="lazy" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>
          © {currentYear}{' '}
          <span className="brand-highlight">EatSprint.com</span>
        </p>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
      </div>

      {/* Back to top */}
      <button
        className="back-to-top"
        onClick={scrollToTop}
        aria-label="Back to top"
        title="Back to top"
      >
        ↑
      </button>
    </footer>
  );
};

export default FooterCompact;
