import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms } from "../api";
import { formatPrice, getRoomIcon } from "../utils/utility";
import "../styles/Home.css";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Just fetch all rooms with fixed dates for preview
    getRooms({
      check_in: "2025-06-05",
      check_out: "2025-07-06"
    })
    .then(setRooms)
    .finally(() => setLoading(false));
  }, []);

  const handleDashboardClick = () => {
    navigate(role === "admin" ? "/admin" : "/user");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      {/* Header Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hotel-icon">🏨</span>
            Welcome to Hotel Yammi
          </h1>
          <p className="hero-subtitle">Experience luxury and comfort in the heart of the city</p>
          
          <div className="auth-section">
            {role ? (
              <button 
                className="btn btn-primary dashboard-btn"
                onClick={handleDashboardClick}
              >
                <span className="btn-icon">📊</span>
                Go to Dashboard
              </button>
            ) : (
              <Link to="/login" className="btn-link">
                <button className="btn btn-secondary login-btn">
                  <span className="btn-icon">🔐</span>
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Rooms Section */}
      <section className="rooms-section">
        <div className="container">
          <h2 className="section-title">Available Rooms</h2>
          <p className="section-subtitle">Choose from our selection of premium accommodations</p>
          
          <div className="rooms-grid">
            {rooms.map(room => (
              <div key={room.id} className="room-card">
                <div className="room-header">
                  <span className="room-icon">{getRoomIcon(room.room_class_name)}</span>
                  <h3 className="room-number">Room #{room.id}</h3>
                </div>
                
                <div className="room-details">
                  <div className="room-info">
                    <span className="room-class">{room.room_class_name}</span>
                    <span className="bed-type">
                      <span className="bed-icon">🛏️</span>
                      {room.bed_type_name}
                    </span>
                  </div>
                  
                  <div className="room-price">
                    <span className="price-label">Starting from</span>
                    <span className="price-amount">{formatPrice(room.base_price)}</span>
                    <span className="price-period">per night</span>
                  </div>
                </div>
                
                <button className="btn btn-outline book-btn">
                  <span className="btn-icon">📅</span>
                  Book Now
                </button>
              </div>
            ))}
          </div>
          
          {rooms.length === 0 && (
            <div className="no-rooms">
              <span className="no-rooms-icon">🏨</span>
              <h3>No rooms available</h3>
              <p>Please try different dates or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Hotel Yammi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}