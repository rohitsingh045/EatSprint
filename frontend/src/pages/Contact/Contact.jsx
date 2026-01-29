import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const url = "http://localhost:5001";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (formData.message.length < 10) {
        setError('Message must be at least 10 characters long');
        setLoading(false);
        return;
      }

      // Send form data to backend
      const response = await axios.post(`${url}/api/contact/submit`, formData);

      if (response.data.success) {
        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
          });
          setSubmitted(false);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="contact-hero-content">
          <h1>📞 Contact Us</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      {/* Contact Container */}
      <div className="contact-container">
        {/* Contact Info Section */}
        <div className="contact-info-section">
          <div className="info-box">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p className="info-label">Customer Support</p>
            <p className="info-content">1800-EATSPRINT</p>
            <p className="info-time">Mon - Fri: 9:00 AM - 10:00 PM</p>
          </div>

          <div className="info-box">
            <div className="info-icon">📧</div>
            <h3>Email Us</h3>
            <p className="info-label">Support Email</p>
            <p className="info-content">support@eatsprint.com</p>
            <p className="info-time">We'll reply within 24 hours</p>
          </div>

          <div className="info-box">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p className="info-label">Office Address</p>
            <p className="info-content">123 Food Street, Delhi, India</p>
            <p className="info-time">Open 9:00 AM - 11:00 PM</p>
          </div>

          <div className="info-box">
            <div className="info-icon">⏱️</div>
            <h3>Delivery Hours</h3>
            <p className="info-label">Fast Delivery Available</p>
            <p className="info-content">7:00 AM - 11:00 PM</p>
            <p className="info-time">Every day including weekends</p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          
          {submitted && (
            <div className="success-message">
              <div className="success-content">
                <span className="success-icon">✅</span>
                <h3>Thank You!</h3>
                <p>Your message has been sent successfully. We'll get back to you soon!</p>
              </div>
            </div>
          )}

          {error && (
            <div className="error-message">
              <div className="error-content">
                <span className="error-icon">❌</span>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!submitted && (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us what's on your mind... (minimum 10 characters)"
                  rows="6"
                  minLength="10"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? '⏳ Sending...' : '📤 Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="contact-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>🚴 How long does delivery take?</h4>
            <p>Our average delivery time is 30-45 minutes depending on your location.</p>
          </div>
          <div className="faq-item">
            <h4>💳 What payment methods do you accept?</h4>
            <p>We accept online payments via Stripe and Cash on Delivery (COD).</p>
          </div>
          <div className="faq-item">
            <h4>🔄 Can I modify or cancel my order?</h4>
            <p>Orders can be cancelled before the restaurant starts preparing. Check your order status for details.</p>
          </div>
          <div className="faq-item">
            <h4>🌟 How do I track my order?</h4>
            <p>You can track your order in real-time from the "My Orders" section after logging in.</p>
          </div>
          <div className="faq-item">
            <h4>🎁 Do you offer discounts or promo codes?</h4>
            <p>Yes! We regularly offer discounts. Check your emails for exclusive promo codes.</p>
          </div>
          <div className="faq-item">
            <h4>🍔 Are the items fresh?</h4>
            <p>All items are prepared fresh from our partner restaurants and delivered hot to your door.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
