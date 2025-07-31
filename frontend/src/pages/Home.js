import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllRoomsNew, getHotelInfo, getFeatures } from "../api";
import { formatPrice, getRoomIcon } from "../utils/utility";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [rooms, setRooms] = useState([]);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({ email: "", role: "" });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info if logged in
        if (role) {
          const token = localStorage.getItem("token");
          if (token) {
            try {
              const decodedToken = JSON.parse(atob(token.split('.')[1]));
              setUserInfo({
                email: decodedToken.sub,
                role: role
              });
            } catch (error) {
              console.error("Error decoding token:", error);
            }
          }
        }

        // Fetch hotel info
        const hotelData = await getHotelInfo();
        setHotelInfo(hotelData);

        // Fetch features
        const featuresData = await getFeatures();
        setFeatures(featuresData);

        // Fetch rooms with fixed dates for preview
        const today = new Date();
        const checkIn = today.toISOString().split("T")[0]; // YYYY-MM-DD

        const checkOutDate = new Date(today);
        checkOutDate.setDate(checkOutDate.getDate() + 1); // 1 day later
        const checkOut = checkOutDate.toISOString().split("T")[0];

        // const roomsData = await getRooms({
        //   check_in: checkIn,
        //   check_out: checkOut
        // });
        const roomsData = await getAllRoomsNew();
        setRooms(roomsData);
        console.log(rooms)
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [role]);

  const handleLogout = () => {
    localStorage.clear();
    setUserInfo({ email: "", role: "" });
    setShowLogoutConfirm(false);
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

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading hotel information...</p>
      </div>
    );
  }

  return (
    <div className={styles.homeContainer}>
      {/* Top Navigation Bar - Only show if user is logged in */}
      {role && (
        <nav className={styles.topNavbar}>
          <div className={styles.navbarContent}>
            <div className={styles.userInfo}>
              <span className={styles.greeting}>
                {getGreeting()}, {userInfo.email.split('@')[0]}!
              </span>
              <span className={styles.roleDisplay}>
                {getRoleDisplayName(userInfo.role)}
              </span>
            </div>
            
            <div className={styles.navLinks}>
              <Link to="/rooms" className={styles.navLink}>
                <span className={styles.navIcon}>🏨</span>
                Browse Rooms
              </Link>
              
              <Link to="/bookingLog" className={styles.navLink}>
                <span className={styles.navIcon}>📅</span>
                Booking Logs
              </Link>
              
              <Link to="/chatbot" className={styles.navLink}>
                <span className={styles.navIcon}>💬</span>
                Ask Chatbot
              </Link>
              
              <Link to="/cart" className={styles.navLink}>
                <span className={styles.navIcon}>🛒</span>
                Cart
              </Link>
              
              <button 
                className={styles.logoutBtn}
                onClick={confirmLogout}
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Header Section */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.hotelIcon}>🏨</span>
            Welcome to {hotelInfo?.name || "Hotel Yammi"}
          </h1>
          <p className={styles.heroSubtitle}>
            {hotelInfo?.description || "Experience luxury and comfort in the heart of the city"}
          </p>
          {hotelInfo?.address && (
            <p className={styles.hotelAddress}>
              <span className={styles.locationIcon}>📍</span>
              {hotelInfo.address}
            </p>
          )}

          {/* Show login button only if not logged in */}
          {!role && (
            <div className={styles.authSection}>
              <Link to="/login" className={styles.btnLink}>
                <button className={`${styles.btn} ${styles.btnSecondary} ${styles.loginBtn}`}>
                  <span className={styles.btnIcon}>🔐</span>
                  Login
                </button>
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Rooms Section */}
      <section className={styles.roomsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Available Rooms</h2>
          <p className={styles.sectionSubtitle}>Choose from our selection of premium accommodations</p>

          <div className={styles.roomGrid}>
            {rooms.map(room => (
              <div key={room.id} className={styles.roomCard}>
                <div className={styles.roomImage}>
                  {room.image ? (
                    <img 
                      src={`data:image/jpeg;base64,${room.image}`} 
                      alt={`Room ${room.id}`}
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <span>No Image</span>
                    </div>
                  )}
                  <div className={`${styles.statusBadge} ${styles.statusAvailable}`}>
                    Available
                  </div>
                </div>

                <div className={styles.roomContent}>
                  <div className={styles.roomHeader}>
                    <h3 className={styles.roomTitle}>Room {room.id}</h3>
                    <span className={styles.floorInfo}>Floor {room.floor}</span>
                  </div>

                  <div className={styles.roomDetails}>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Class:</span>
                      <span className={styles.value}>{room.room_class_name}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Bed Type:</span>
                      <span className={styles.value}>{room.bed_type_name}</span>
                    </div>
                    <div className={styles.detailRow}>
                      <span className={styles.label}>Bed Count:</span>
                      <span className={styles.value}>{room.bed_count}</span>
                    </div>
                  </div>

                  <div className={styles.priceSection}>
                    <div className={styles.basePrice}>
                      <span className={styles.priceLabel}>Base Price:</span>
                      <span className={styles.priceValue}>{formatPrice(room.base_price)}</span>
                    </div>
                  </div>

                  {room.features && room.features.length > 0 && (
                    <div className={styles.featuresSection}>
                      <h4 className={styles.featuresTitle}>Features:</h4>
                      <div className={styles.featuresList}>
                        {room.features.map((feature) => (
                          <div key={feature.id} className={styles.featureItem}>
                            <span className={styles.featureName}>{feature.name}</span>
                            <span className={styles.featurePrice}>
                              {feature.price_per_use > 0 
                                ? `+${formatPrice(feature.price_per_use)}` 
                                : 'Free'
                              }
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={styles.cardActions}>
                    <Link to={`/room2/${room.id}`} className={styles.btnLink}>
                      <button className={styles.editButton}>
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {rooms.length === 0 && (
            <div className={styles.noRooms}>
              <span className={styles.noRoomsIcon}>🏨</span>
              <h3>No rooms available</h3>
              <p>Please try different dates or check back later.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      {features.length > 0 && (
        <section className={styles.featuresSection}>
          <div className={styles.container}>
            <h2 className={styles.sectionTitle}>Hotel Features & Services</h2>
            <p className={styles.sectionSubtitle}>Enhance your stay with our premium amenities</p>

            <div className={styles.featuresGrid}>
              {features.map(feature => (
                <div key={feature.id} className={styles.featureCard}>
                  <div className={styles.featureHeader}>
                    <span className={styles.featureIcon}>✨</span>
                    <h3 className={styles.featureName}>{feature.name}</h3>
                  </div>
                  
                  {feature.description && (
                    <p className={styles.featureDescription}>{feature.description}</p>
                  )}
                  
                  <div className={styles.featurePrice}>
                    <span className={styles.priceAmount}>{formatPrice(feature.price_per_use)}</span>
                    {feature.price_per_use > 0 && <span className={styles.pricePeriod}>per use</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2025 {hotelInfo?.name || "Hotel Yammi"}. All rights reserved.</p>
          {hotelInfo?.phone && (
            <p className={styles.contactInfo}>
              📞 {hotelInfo.phone} | 📧 {hotelInfo.email}
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}