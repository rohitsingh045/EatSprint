import React from 'react';
import './AboutNew.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-content">
          <h1>About EatSprint</h1>
          <p className="hero-subtitle">Delivering happiness, one meal at a time</p>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-section">
        <div className="container">
          <div className="content-card">
            <h2>Our Story</h2>
            <p>
              EatSprint was born from a simple idea: everyone deserves access to delicious, 
              quality meals without the hassle. We connect food lovers with the best local 
              restaurants, ensuring every order arrives fresh and fast.
            </p>
            <p>
              What started as a small delivery service has grown into a platform trusted by 
              thousands of customers and hundreds of restaurant partners.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="about-section values-section">
        <div className="container">
          <h2 className="section-title">What We Stand For</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🍕</div>
              <h3>Quality First</h3>
              <p>We partner only with restaurants that meet our high standards for food quality and safety.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Lightning Fast</h3>
              <p>Your time matters. We ensure quick delivery without compromising on care.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">💚</div>
              <h3>Customer Love</h3>
              <p>Your satisfaction drives us. We're here to make every meal memorable.</p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Local Support</h3>
              <p>We empower local restaurants and create opportunities in our community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="about-section why-section">
        <div className="container">
          <h2 className="section-title">Why Choose EatSprint?</h2>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Wide Variety</h4>
                <p>From local favorites to international cuisines, discover endless options.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Easy Ordering</h4>
                <p>Simple, intuitive interface. Order in just a few clicks.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Secure Payments</h4>
                <p>Multiple payment options with bank-level security.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Live Tracking</h4>
                <p>Know exactly where your order is, every step of the way.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>24/7 Support</h4>
                <p>Our team is always ready to help with any questions or concerns.</p>
              </div>
            </div>

            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <div>
                <h4>Best Prices</h4>
                <p>Great deals and no hidden fees. What you see is what you pay.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="about-section stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">200+</div>
              <div className="stat-label">Restaurant Partners</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Orders Delivered</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8★</div>
              <div className="stat-label">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>Ready to Order?</h2>
          <p>Join thousands of satisfied customers and experience the EatSprint difference.</p>
          <a href="/#menu" className="cta-button">Browse Menu</a>
        </div>
      </section>
    </div>
  );
};

export default About;
