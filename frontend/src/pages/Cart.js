import React, { useEffect, useState } from "react";
import { getRoomById, getAddon, bookRoom } from "../api";
import { useNavigate } from "react-router-dom";
import {
  calculateNights,
  calculateRoomTotal,
  calculateAddonTotal,
  calculateGrandTotal,
  formatPrice,
  formatDate,
  getRoomIcon,
  validateBookingForm,
  getStoredData,
  setStoredData,
  clearStoredData
} from "../utils/cartUtils";
import "../styles/Cart.css";

export default function Cart() {
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [form, setForm] = useState({
    check_in: localStorage.getItem("check_in"),
    check_out: localStorage.getItem("check_out"),
    price: ""
  });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  
  const navigate = useNavigate();

  // Load data on component mount
  useEffect(() => {
    loadCartData();
  }, []);

  // Recalculate price when dependencies change
  useEffect(() => {
    if (rooms.length > 0) {
      const nights = calculateNights(form.check_in, form.check_out);
      const roomTotal = calculateRoomTotal(rooms, nights);
      const addonTotal = calculateAddonTotal(addons, selectedAddons);
      const grandTotal = calculateGrandTotal(roomTotal, addonTotal);
      
      setForm(prev => ({
        ...prev,
        price: grandTotal.toFixed(2)
      }));
    }
  }, [rooms, addons, selectedAddons, form.check_in, form.check_out]);

  const loadCartData = async () => {
    try {
      setLoading(true);
      
      // Get stored data
      const storedRoomIds = getStoredData("selectedRooms", []);
      const storedCheckIn = getStoredData("check_in", "");
      const storedCheckOut = getStoredData("check_out", "");
      
      setSelectedRoomIds(storedRoomIds);
      setForm(prev => ({
        ...prev,
        check_in: storedCheckIn,
        check_out: storedCheckOut
      }));

      // Load addons
      const addonsData = await getAddon();
      setAddons(addonsData);

      // Load room details if we have selected rooms
      if (storedRoomIds.length > 0) {
        const roomPromises = storedRoomIds.map(id => getRoomById(id));
        const fetchedRooms = await Promise.all(roomPromises);
        setRooms(fetchedRooms.filter(room => room)); // Filter out any null/undefined rooms
      }
    } catch (error) {
      console.error("Error loading cart data:", error);
      setErrors(["Failed to load cart data. Please try again."]);
    } finally {
      setLoading(false);
    }
  };

  const removeRoom = (roomId) => {
    const updatedRoomIds = selectedRoomIds.filter(id => id !== roomId);
    const updatedRooms = rooms.filter(room => room.id !== roomId);
    
    setSelectedRoomIds(updatedRoomIds);
    setRooms(updatedRooms);
    setStoredData("selectedRooms", updatedRoomIds);
  };

  const toggleAddon = (addonId) => {
    setSelectedAddons(prev => {
      const updated = prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId];
      return updated;
    });
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setStoredData(name, value);
    setErrors([]); // Clear errors when user makes changes
  };

  const handleBooking = async () => {
    // Validate form
    const validation = validateBookingForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (selectedRoomIds.length === 0) {
      setErrors(["No rooms selected for booking"]);
      return;
    }

    setBookingLoading(true);
    setErrors([]);

    const payload = {
      check_in: form.check_in,
      check_out: form.check_out,
      price: parseFloat(form.price),
      roomIds: selectedRoomIds,
      addonIds: selectedAddons,
    };

    try {
      await bookRoom(payload);
      
      // Clear stored data
      clearStoredData(["selectedRooms", "check_in", "check_out"]);
      
      // Show success message and redirect
      alert("Booking confirmed successfully!");
      navigate("/user");
    } catch (error) {
      console.error("Booking failed:", error);
      setErrors(["Booking failed. Please try again."]);
    } finally {
      setBookingLoading(false);
    }
  };

  const goBackToRooms = () => {
    navigate("/rooms");
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  const nights = calculateNights(form.check_in, form.check_out);
  const roomTotal = calculateRoomTotal(rooms, nights);
  const addonTotal = calculateAddonTotal(addons, selectedAddons);
  const grandTotal = calculateGrandTotal(roomTotal, addonTotal);

  return (
    <div className="cart-container">
      {/* Header */}
      <header className="cart-header">
        <h1 className="cart-title">
          <span className="section-icon">🛒</span>
          Your Booking Cart
        </h1>
        <p className="cart-subtitle">Review your selection and complete your booking</p>
      </header>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="error-message">
          <strong>Please fix the following errors:</strong>
          <ul className="error-list">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Content */}
      <div className="cart-content">
        <div className="cart-main">
          {/* Empty Cart State */}
          {rooms.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛏️</div>
              <h3>Your cart is empty</h3>
              <p>Add some rooms to get started with your booking</p>
              <button className="btn btn-primary" onClick={goBackToRooms}>
                <span className="btn-icon">🔍</span>
                Browse Rooms
              </button>
            </div>
          ) : (
            <>
              {/* Selected Rooms */}
              <section className="rooms-section">
                <h2 className="section-title">
                  <span className="section-icon">🏨</span>
                  Selected Rooms ({rooms.length})
                </h2>
                
                {rooms.map(room => (
                  <div key={room.id} className="room-item">
                    <div className="room-icon">
                      {getRoomIcon(room.room_class_name)}
                    </div>
                    <div className="room-details">
                      <h3 className="room-number">Room #{room.id}</h3>
                      <div className="room-info">
                        <div className="room-info-item">
                          <span>🏨</span>
                          <span>{room.room_class_name}</span>
                        </div>
                        <div className="room-info-item">
                          <span>🛏️</span>
                          <span>{room.bed_type_name}</span>
                        </div>
                        <div className="room-info-item">
                          <span>🏢</span>
                          <span>Floor {room.floor || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="room-price">
                        {formatPrice(room.base_price)} per night
                        {nights > 0 && (
                          <span> • {formatPrice(room.base_price * nights)} total</span>
                        )}
                      </div>
                    </div>
                    <button
                      className="remove-room"
                      onClick={() => removeRoom(room.id)}
                      title="Remove room"
                    >
                      <span className="btn-icon">🗑️</span>
                    </button>
                  </div>
                ))}
              </section>

              {/* Add-ons Section */}
              <section className="addons-section">
                <h2 className="section-title">
                  <span className="section-icon">⭐</span>
                  Available Add-ons
                </h2>
                
                {addons.length === 0 ? (
                  <p style={{ color: '#6c757d', textAlign: 'center', padding: '20px' }}>
                    No add-ons available
                  </p>
                ) : (
                  addons.map(addon => (
                    <div 
                      key={addon.id} 
                      className={`addon-item ${selectedAddons.includes(addon.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="addon-checkbox"
                        checked={selectedAddons.includes(addon.id)}
                        onChange={() => toggleAddon(addon.id)}
                        id={`addon-${addon.id}`}
                      />
                      <label htmlFor={`addon-${addon.id}`} className="addon-details">
                        <div className="addon-name">{addon.name}</div>
                        <div className="addon-price">{formatPrice(addon.price)}</div>
                      </label>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>

        {/* Sidebar */}
        {rooms.length > 0 && (
          <div className="cart-sidebar">
            <form className="booking-form">
              <h2 className="section-title">
                <span className="section-icon">📋</span>
                Booking Details
              </h2>

              <div className="form-group">
                <label className="form-label">Check-in Date</label>
                <input
                  type="date"
                  name="check_in"
                  value={form.check_in}
                  onChange={handleDateChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Check-out Date</label>
                <input
                  type="date"
                  name="check_out"
                  value={form.check_out}
                  onChange={handleDateChange}
                  className="form-input"
                  required
                />
              </div>

              {/* Stay Duration */}
              {nights > 0 && (
                <div className="stay-duration">
                  <span className="duration-icon">📅</span>
                  <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <h3 className="breakdown-title">Price Breakdown</h3>
                
                <div className="breakdown-item">
                  <span>Room{rooms.length > 1 ? 's' : ''} ({nights} night{nights !== 1 ? 's' : ''})</span>
                  <span>{formatPrice(roomTotal)}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="breakdown-item">
                    <span>Add-ons ({selectedAddons.length})</span>
                    <span>{formatPrice(addonTotal)}</span>
                  </div>
                )}
                
                <div className="breakdown-divider"></div>
                
                <div className="breakdown-item total">
                  <span>Total</span>
                  <span>{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={goBackToRooms}
                >
                  <span className="btn-icon">🔙</span>
                  Back to Rooms
                </button>
                
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleBooking}
                  disabled={bookingLoading}
                >
                  {bookingLoading ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">✅</span>
                      Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}