import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/UserDashboard.module.css";

export default function UserDashboard() {
  const [userInfo, setUserInfo] = useState({ email: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      
      if (!token || !role) {
        navigate("/login");
        return;
      }

      // Decode JWT token to get user email
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserInfo({
        email: decodedToken.sub,
        role: role
      });
    } catch (error) {
      console.error("Error decoding token:", error);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const confirmLogout = () => {
    setShowLogoutConfirm(true);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getRoleDisplayName = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "Administrator";
      case "manager":
        return "Hotel Manager";
      case "guest":
        return "Guest";
      default:
        return role;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.welcomeSection}>
          <h1 className={styles.greeting}>
            {getGreeting()}, {userInfo.email.split('@')[0]}!
          </h1>
          <p className={styles.roleInfo}>
            Logged in as: <span className={styles.rolebadge}>{getRoleDisplayName(userInfo.role)}</span>
          </p>
        </div>
        <button 
          className={styles.logoutBtn}
          onClick={confirmLogout}
          aria-label="Logout"
        >
          Logout
        </button>
      </header>

      <main className={styles.mainContent}>
        <nav className={styles.navigation}>
          <h2 className={styles.navTitle}>Quick Access</h2>
          <div className={styles.navGrid}>
            <Link to="/" className={styles.navCard}>
            <div className={styles.navIcon}>🏠</div>
            <span className={styles.navText}>Home menu</span>
            <p className={styles.navSubtext}>View available rooms and offers!</p>
            </Link>
            <Link to="/rooms" className={styles.navCard}>
              <div className={styles.navIcon}>🏨</div>
              <span className={styles.navText}>Browse Rooms</span>
              <p className={styles.navSubtext}>View available accommodations</p>
            </Link>
            
            <Link to="/booking" className={styles.navCard}>
              <div className={styles.navIcon}>📅</div>
              <span className={styles.navText}>Make a Booking</span>
              <p className={styles.navSubtext}>Reserve your stay</p>
            </Link>
            
            <Link to="/chatbot" className={styles.navCard}>
              <div className={styles.navIcon}>💬</div>
              <span className={styles.navText}>Ask Chatbot</span>
              <p className={styles.navSubtext}>Get instant help</p>
            </Link>
            
            <Link to="/cart" className={styles.navCard}>
              <div className={styles.navIcon}>🛒</div>
              <span className={styles.navText}>Go to Cart</span>
              <p className={styles.navSubtext}>Review your selections</p>
            </Link>
          </div>
        </nav>

        <section className={styles.dashboardStats}>
          <h2 className={styles.statsTitle}>Dashboard Overview</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <h3>Account Status</h3>
              <p className={styles.statValue}>Active</p>
            </div>
            <div className={styles.statCard}>
              <h3>Member Since</h3>
              <p className={styles.statValue}>Welcome!</p>
            </div>
          </div>
        </section>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmBtn}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}