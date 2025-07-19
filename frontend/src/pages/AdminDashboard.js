import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignUp, getCurrentAdmin, getAllAdmins } from '../utils/apiHelpers.js';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('users');
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrentAdmin();
    if (activeSection === 'users') {
      fetchUsers();
    }
  }, [activeSection]);

  const fetchCurrentAdmin = async () => {
    try {
      const admin = await getCurrentAdmin();
      setCurrentAdmin(admin);
    } catch (error) {
      console.error('Error fetching current admin:', error);
      // If token is invalid, redirect to login
      handleLogout();
    }
  };

  const fetchUsers = async () => {
    try {
      const adminUsers = await getAllAdmins();
      setUsers(adminUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await adminSignUp(newUser);
      setShowAddUserModal(false);
      setNewUser({ email: '', firstName: '', lastName: '', password: '' });
      fetchUsers(); // Refresh the user list
      alert('Admin user added successfully!');
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Error adding user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderSidebar = () => (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          <span className="nav-icon">👤</span>
          Users
        </button>
        <button
          className={`nav-item ${activeSection === 'hotels' ? 'active' : ''}`}
          onClick={() => setActiveSection('hotels')}
        >
          <span className="nav-icon">🏨</span>
          Hotels
        </button>
        <button
          className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveSection('bookings')}
        >
          <span className="nav-icon">📅</span>
          Bookings
        </button>
        <button
          className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveSection('reviews')}
        >
          <span className="nav-icon">⭐</span>
          Reviews
        </button>
        <button
          className={`nav-item ${activeSection === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveSection('rooms')}
        >
          <span className="nav-icon">🏠</span>
          Rooms
        </button>
        <button
          className={`nav-item ${activeSection === 'roomStatuses' ? 'active' : ''}`}
          onClick={() => setActiveSection('roomStatuses')}
        >
          <span className="nav-icon">📊</span>
          Room Statuses
        </button>
        <button
          className={`nav-item ${activeSection === 'roomClasses' ? 'active' : ''}`}
          onClick={() => setActiveSection('roomClasses')}
        >
          <span className="nav-icon">🏢</span>
          Room Classes
        </button>
        <button
          className={`nav-item ${activeSection === 'roomFeatures' ? 'active' : ''}`}
          onClick={() => setActiveSection('roomFeatures')}
        >
          <span className="nav-icon">🏷️</span>
          Room Features
        </button>
      </nav>
    </div>
  );

  const renderUsersSection = () => (
    <div className="content-section">
      <div className="section-header">
        <h1>Users</h1>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddUserModal(true)}
        >
          Add New
        </button>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="table-cell">Email</div>
          <div className="table-cell">First Name</div>
          <div className="table-cell">Last Name</div>
          <div className="table-cell">Role</div>
          <div className="table-cell">Actions</div>
        </div>

        {users.map((user, index) => (
          <div key={user.id || index} className="table-row">
            <div className="table-cell">{user.email}</div>
            <div className="table-cell">{user.firstName}</div>
            <div className="table-cell">{user.lastName}</div>
            <div className="table-cell">
              <span className="role-badge">Admin</span>
            </div>
            <div className="table-cell">
              <button className="btn btn-edit">Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Add New Admin User</h3>
              <button
                className="modal-close"
                onClick={() => setShowAddUserModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddUser} className="modal-body">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={newUser.firstName}
                  onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  const renderPlaceholderSection = (title) => (
    <div className="content-section">
      <div className="section-header">
        <h1>{title}</h1>
      </div>
      <div className="placeholder-content">
        <p>{title} section coming soon...</p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case 'users':
        return renderUsersSection();
      case 'hotels':
        return renderPlaceholderSection('Hotels');
      case 'bookings':
        return renderPlaceholderSection('Bookings');
      case 'reviews':
        return renderPlaceholderSection('Reviews');
      case 'rooms':
        return renderPlaceholderSection('Rooms');
      case 'roomStatuses':
        return renderPlaceholderSection('Room Statuses');
      case 'roomClasses':
        return renderPlaceholderSection('Room Classes');
      case 'roomFeatures':
        return renderPlaceholderSection('Room Features');
      default:
        return renderUsersSection();
    }
  };

  return (
    <div className="admin-dashboard">
      {renderSidebar()}
      <div className="main-content">
        <div className="top-bar">
          <div className="welcome-message">
            Welcome, {currentAdmin?.firstName || 'Admin'}!
          </div>
          <button className="btn btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
        {renderMainContent()}
      </div>
    </div>
  );
}