import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useStore';
import { storage } from '../../utils/storage';
import { showToast } from '../../utils/toast';
import './Profile.css';

const Profile = () => {
  const { token, setToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    phone: ''
  });

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    loadAddresses();
  }, [token, navigate]);

  const loadAddresses = () => {
    setAddresses(storage.getAddresses());
  };

  const handleLogout = () => {
    storage.clearAll();
    setToken(null);
    showToast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zipcode) {
      showToast.error('Please fill all required fields');
      return;
    }
    storage.addAddress(newAddress);
    loadAddresses();
    setNewAddress({ label: '', street: '', city: '', state: '', zipcode: '', phone: '' });
    setShowAddressForm(false);
    showToast.success('Address added successfully');
  };

  const handleDeleteAddress = (id) => {
    storage.removeAddress(id);
    loadAddresses();
    showToast.success('Address removed');
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <h2>My Account</h2>
          <nav className="profile-nav">
            <button
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={activeTab === 'addresses' ? 'active' : ''}
              onClick={() => setActiveTab('addresses')}
            >
              Saved Addresses
            </button>
            <button
              className={activeTab === 'security' ? 'active' : ''}
              onClick={() => setActiveTab('security')}
            >
              Security
            </button>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h3>Profile Information</h3>
              <div className="info-card">
                <p className="info-text">Manage your personal information and preferences</p>
                <div className="info-item">
                  <span className="label">Status</span>
                  <span className="value">Active</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <div className="section-header">
                <h3>Saved Addresses</h3>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="add-address-btn"
                >
                  {showAddressForm ? 'Cancel' : 'Add New Address'}
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="address-form">
                  <input
                    type="text"
                    placeholder="Label (Home, Work, etc.)"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    required
                  />
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="City *"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="ZIP Code *"
                      value={newAddress.zipcode}
                      onChange={(e) => setNewAddress({ ...newAddress, zipcode: e.target.value })}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="save-btn">Save Address</button>
                </form>
              )}

              <div className="addresses-grid">
                {addresses.length === 0 ? (
                  <p className="empty-message">No saved addresses yet</p>
                ) : (
                  addresses.map((address) => (
                    <div key={address.id} className="address-card">
                      <div className="address-header">
                        {address.label && <span className="address-label">{address.label}</span>}
                        <button
                          onClick={() => handleDeleteAddress(address.id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zipcode}</p>
                      {address.phone && <p className="phone">{address.phone}</p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <h3>Security Settings</h3>
              <div className="security-card">
                <p className="info-text">Manage your password and security preferences</p>
                <button className="change-password-btn">Change Password</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
