import React, { useState, useEffect } from "react";
import {formatDate, getBookingStatus } from "../utils/utility.js";
import {bookRoom, getBookingDetailsUser, verifyBooking} from "../api/index.js";
import "../styles/BookingLog.css";

export default function BookingLog() {
  const [form, setForm] = useState({
    check_in: "",
    check_out: "",
    price: 0,
    addonIds: ""
  });
  const [roomIds, setRoomIds] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Verification panel state
  const [verificationBookingId, setVerificationBookingId] = useState("");
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState(null);
  const [showVerificationPanel, setShowVerificationPanel] = useState(false);

  useEffect(() => {
    const storedRooms = localStorage.getItem("selectedRooms");
    const checkIn = localStorage.getItem("check_in");
    const checkOut = localStorage.getItem("check_out");
    
    if (storedRooms) {
      setRoomIds(JSON.parse(storedRooms));
      setShowBookingForm(true);
    }
    
    setForm(prev => ({
      ...prev,
      check_in: checkIn || "",
      check_out: checkOut || ""
    }));

    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setLoading(true);
      const data = await getBookingDetailsUser();
      setBookings(data);
    } catch (error) {
      console.error("Error loading bookings:", error);
      alert("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleBook() {
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
        roomIds,
        addonIds: form.addonIds.split(',').map(Number).filter(id => !isNaN(id))
      };
      
      const res = await bookRoom(body);
      alert("Booking success");
      
      // Clear localStorage
      localStorage.removeItem("selectedRooms");
      localStorage.removeItem("check_in");
      localStorage.removeItem("check_out");
      
      // Reset form and reload bookings
      setForm({ check_in: "", check_out: "", price: 0, addonIds: "" });
      setRoomIds([]);
      setShowBookingForm(false);
      loadBookings();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    }
  }

  async function handleVerifyBooking() {
    if (!verificationBookingId.trim()) {
      setVerificationError("Please enter a booking ID");
      return;
    }

    try {
      setVerificationLoading(true);
      setVerificationError(null);
      setVerificationResult(null);
      
      const bookingData = await verifyBooking(verificationBookingId);
      setVerificationResult(bookingData);
    } catch (error) {
      setVerificationError(error.message || "Failed to verify booking");
    } finally {
      setVerificationLoading(false);
    }
  }

  function clearVerification() {
    setVerificationBookingId("");
    setVerificationResult(null);
    setVerificationError(null);
  }

  if (loading) {
    return <div className="loading">Loading bookings...</div>;
  }

  return (
    <div className="booking-log-container">
      <div className="main-content">
        <div className="header-section">
          <h2 className="page-title">My Bookings</h2>
          <button 
            className="verify-button"
            onClick={() => setShowVerificationPanel(!showVerificationPanel)}
          >
            {showVerificationPanel ? "Hide Verification" : "Verify Booking"}
          </button>
        </div>
        
        {showBookingForm && (
          <div className="booking-form-section">
            <h3>Complete Your Booking</h3>
            <div className="booking-form">
              <p className="selected-rooms">Selected Rooms: {roomIds.join(", ")}</p>
              
              <div className="form-group">
                <label>Check-in Date</label>
                <input 
                  type="date" 
                  name="check_in" 
                  value={form.check_in} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Check-out Date</label>
                <input 
                  type="date" 
                  name="check_out" 
                  value={form.check_out} 
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Total Price</label>
                <input 
                  type="number" 
                  name="price" 
                  placeholder="Total Price" 
                  value={form.price}
                  onChange={handleChange} 
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Addon IDs (optional)</label>
                <input 
                  name="addonIds" 
                  placeholder="Addon IDs (comma-separated)" 
                  value={form.addonIds}
                  onChange={handleChange} 
                />
              </div>
              
              <button className="book-button" onClick={handleBook}>
                Complete Booking
              </button>
            </div>
          </div>
        )}

        <div className="bookings-section">
          {bookings.length === 0 ? (
            <div className="no-bookings">
              <p>No bookings found.</p>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-header">
                    <h3 className="booking-id">{booking.id}</h3>
                    <span className={`status-badge ${getBookingStatus(booking.check_in, booking.check_out)}`}>
                      {getBookingStatus(booking.check_in, booking.check_out)}
                    </span>
                  </div>
                  
                  <div className="booking-details">
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{booking.email}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Check-in:</span>
                      <span className="value">{formatDate(booking.check_in)}</span>
                    </div>
                    
                    <div className="detail-row">
                      <span className="label">Check-out:</span>
                      <span className="value">{formatDate(booking.check_out)}</span>
                    </div>
                    
                    {booking.booking_date && (
                      <div className="detail-row">
                        <span className="label">Booked on:</span>
                        <span className="value">{formatDate(booking.booking_date)}</span>
                      </div>
                    )}
                    
                    {booking.price && (
                      <div className="detail-row">
                        <span className="label">Total Price:</span>
                        <span className="value price">${booking.price}</span>
                      </div>
                    )}
                    
                    {booking.rooms && booking.rooms.length > 0 && (
                      <div className="detail-row">
                        <span className="label">Rooms:</span>
                        <span className="value">{booking.rooms.join(", ")}</span>
                      </div>
                    )}
                    
                    {booking.addons && booking.addons.length > 0 && (
                      <div className="detail-row">
                        <span className="label">Addons:</span>
                        <span className="value">{booking.addons.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verification Side Panel */}
      {showVerificationPanel && (
        <div className="verification-panel">
          <div className="panel-header">
            <h3>Verify Booking</h3>
            <button 
              className="close-panel"
              onClick={() => setShowVerificationPanel(false)}
            >
              ×
            </button>
          </div>
          
          <div className="panel-content">
            <div className="verification-form">
              <div className="form-group">
                <label>Booking ID</label>
                <input
                  type="text"
                  value={verificationBookingId}
                  onChange={(e) => setVerificationBookingId(e.target.value)}
                  placeholder="Enter booking ID"
                />
              </div>
              
              <div className="button-group">
                <button 
                  className="verify-btn"
                  onClick={handleVerifyBooking}
                  disabled={verificationLoading}
                >
                  {verificationLoading ? "Verifying..." : "Verify"}
                </button>
                <button 
                  className="clear-btn"
                  onClick={clearVerification}
                >
                  Clear
                </button>
              </div>
            </div>

            {verificationError && (
              <div className="verification-error">
                <p>{verificationError}</p>
              </div>
            )}

            {verificationResult && (
              <div className="verification-result">
                <div className="result-header">
                  <h4>Booking Details</h4>
                  <span className={`status-badge ${getBookingStatus(verificationResult.check_in, verificationResult.check_out)}`}>
                    {getBookingStatus(verificationResult.check_in, verificationResult.check_out)}
                  </span>
                </div>
                
                <div className="result-details">
                  <div className="detail-row">
                    <span className="label">Booking ID:</span>
                    <span className="value">{verificationBookingId}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{verificationResult.booker_email}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Check-in:</span>
                    <span className="value">{formatDate(verificationResult.check_in)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="label">Check-out:</span>
                    <span className="value">{formatDate(verificationResult.check_out)}</span>
                  </div>
                  
                  {verificationResult.booking_date && (
                    <div className="detail-row">
                      <span className="label">Booked on:</span>
                      <span className="value">{formatDate(verificationResult.booking_date)}</span>
                    </div>
                  )}
                  
                  {verificationResult.price && (
                    <div className="detail-row">
                      <span className="label">Total Price:</span>
                      <span className="value price">${verificationResult.price}</span>
                    </div>
                  )}
                  
                  {verificationResult.rooms && verificationResult.rooms.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Room IDs:</span>
                      <span className="value">{verificationResult.rooms.map(room => room.id).join(", ")}</span>
                    </div>
                  )}
                  
                  {verificationResult.addons && verificationResult.addons.length > 0 && (
                    <div className="detail-row">
                      <span className="label">Addons:</span>
                      <span className="value">{verificationResult.addons.join(", ")}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}