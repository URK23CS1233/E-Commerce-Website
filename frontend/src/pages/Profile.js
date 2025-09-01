import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ordersAPI, authAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user) {
      setUserInfo({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    
    fetchUserData();
  }, [user, isAuthenticated, navigate]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'orders') {
        const ordersResponse = await ordersAPI.getAll();
        setOrders(ordersResponse.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement profile update API
      console.log('Saving profile:', userInfo);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case 'processing': return '#f39c12';
      case 'shipped': return '#3498db';
      case 'delivered': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar Navigation */}
          <div className="profile-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>

            <nav className="profile-nav">
              <button 
                className={activeTab === 'account' ? 'active' : ''}
                onClick={() => setActiveTab('account')}
              >
                📋 My Account
              </button>
              <button 
                className={activeTab === 'orders' ? 'active' : ''}
                onClick={() => { setActiveTab('orders'); fetchUserData(); }}
              >
                📦 My Orders
              </button>
              <Link to="/wishlist" className="nav-link">
                ❤️ My Wishlist
              </Link>
              <Link to="/cart" className="nav-link">
                🛒 Cart
              </Link>
              <button 
                className={activeTab === 'settings' ? 'active' : ''}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ Settings
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                🚪 Log Out
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {activeTab === 'account' && (
              <div className="account-section">
                <div className="section-header">
                  <h2>My Account</h2>
                  <button 
                    className="edit-btn"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="account-form">
                  <div className="form-group">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={userInfo.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={userInfo.email}
                      onChange={handleInputChange}
                      disabled={!editMode}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={userInfo.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address:</label>
                    <textarea
                      name="address"
                      value={userInfo.address}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter your address"
                      rows="3"
                    />
                  </div>

                  {editMode && (
                    <button className="save-btn" onClick={handleSaveProfile}>
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h2>My Orders</h2>
                {loading ? (
                  <div className="loading">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/products" className="shop-btn">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order._id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <h4>Order #{order._id.slice(-8)}</h4>
                            <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="order-status">
                            <span 
                              className="status-badge"
                              style={{ backgroundColor: getOrderStatusColor(order.orderStatus) }}
                            >
                              {order.orderStatus.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          {order.items?.map((item, index) => (
                            <div key={index} className="order-item">
                              <img 
                                src={item.product?.images?.[0] || '/placeholder-image.jpg'} 
                                alt={item.product?.name}
                              />
                              <div className="item-info">
                                <h5>{item.product?.name}</h5>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="order-total">
                          <strong>Total: ${order.totalAmount}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-section">
                <h2>Settings</h2>
                <div className="settings-options">
                  <div className="setting-item">
                    <h4>Notifications</h4>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span>Email notifications</span>
                    </label>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span>SMS notifications</span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <h4>Privacy</h4>
                    <label className="toggle">
                      <input type="checkbox" />
                      <span>Make profile public</span>
                    </label>
                  </div>
                  
                  <div className="setting-item">
                    <h4>Theme</h4>
                    <select>
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
