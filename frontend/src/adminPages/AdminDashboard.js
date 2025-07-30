import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminSignUp, getCurrentAdmin, getAllAdmins } from '../utils/apiHelpers.js';
import UsersSection from './UsersSection.js';
import BookingsSection from './BookingsSection.js';
import '../styles/AdminDashboard.css';
import RoomClassesSection from './RoomClassesSection.js';
import RoomFeaturesSection from './RoomFeaturesSection.js';
import ReviewsSection from './ReviewsSection.js';
import RoomSection from './RoomSection.js';
import HotelSection from './HotelSection.js';

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
      alert(`Error adding user: ${error.message}`);
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

const renderMainContent = () => {
  switch (activeSection) {
    case 'users':
      return (
        <UsersSection
          users={users}
          showAddUserModal={showAddUserModal}
          setShowAddUserModal={setShowAddUserModal}
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
          loading={loading}
          onUserUpdate={fetchUsers} // Add this line to refresh users after ban/unban
        />
      );
    case 'hotels':
      return <HotelSection />;
    case 'bookings':
      return <BookingsSection />;
    case 'reviews':
      return <ReviewsSection />;
    case 'rooms':
      return <RoomSection />;
    case 'roomClasses':
      return <RoomClassesSection />;
    case 'roomFeatures':
      return <RoomFeaturesSection />;
    default:
      return (
        <UsersSection
          users={users}
          showAddUserModal={showAddUserModal}
          setShowAddUserModal={setShowAddUserModal}
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
          loading={loading}
          onUserUpdate={fetchUsers} // Add this line here too
        />
      );
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