import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, checkReviewEligibility, postReview } from "../api";
import { formatPrice, getRoomIcon, setStoredData } from "../utils/utility";
import "../styles/RoomDetails.css";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Review-related state
  const [canReview, setCanReview] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ""
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Add selected state management similar to RoomList
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedRooms");
    const savedRooms = saved ? JSON.parse(saved) : [];
    return savedRooms.includes(parseInt(id)) || false;
  });

  useEffect(() => {
    if (id) {
      fetchRoomDetails();
      checkUserReviewEligibility();
    }
  }, [id]);

  // Update selected state when room ID changes
  useEffect(() => {
    const saved = localStorage.getItem("selectedRooms");
    const savedRooms = saved ? JSON.parse(saved) : [];
    setSelected(savedRooms.includes(parseInt(id)));
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      setLoading(true);
      const data = await getRoomById(id);
      setRoom(data);
    } catch (error) {
      console.error("Error fetching room details:", error);
      setError("Failed to load room details");
    } finally {
      setLoading(false);
    }
  };

  const checkUserReviewEligibility = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setCanReview(false);
        return;
      }
      
      const eligible = await checkReviewEligibility(id);
      setCanReview(eligible);
    } catch (error) {
      console.error("Error checking review eligibility:", error);
      setCanReview(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!reviewData.comment.trim()) {
      alert("Please write a comment for your review.");
      return;
    }

    setReviewSubmitting(true);
    
    try {
      await postReview(parseInt(id), reviewData.rating, reviewData.comment.trim());
      setReviewSubmitted(true);
      setShowReviewForm(false);
      setCanReview(false);
      
      // Optionally refresh room details to show the new review
      // await fetchRoomDetails();
      
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleRatingChange = (rating) => {
    setReviewData(prev => ({ ...prev, rating }));
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return "status-available";
    
    switch (status.toLowerCase()) {
      case "available":
        return "status-available";
      case "booked":
        return "status-booked";
      case "out of service":
        return "status-out-of-service";
      default:
        return "status-unknown";
    }
  };

  const calculateTotalFeaturePrice = (features) => {
    return features.reduce((sum, feature) => sum + feature.price_per_use, 0);
  };

  // Add toggle select function similar to RoomList
  const toggleSelect = (roomId) => {
    const saved = localStorage.getItem("selectedRooms");
    const savedRooms = saved ? JSON.parse(saved) : [];
    
    let updated;
    if (savedRooms.includes(roomId)) {
      updated = savedRooms.filter((id) => id !== roomId);
      setSelected(false);
    } else {
      updated = [...savedRooms, roomId];
      setSelected(true);
    }
    
    localStorage.setItem("selectedRooms", JSON.stringify(updated));
  };

  // Add go to cart function similar to RoomList
  const goToCart = () => {
    // You might want to get these dates from URL params or state
    // For now, using placeholder logic - you can modify as needed
    const checkIn = new URLSearchParams(window.location.search).get('check_in');
    const checkOut = new URLSearchParams(window.location.search).get('check_out');
    
    if (checkIn) setStoredData("check_in", checkIn);
    if (checkOut) setStoredData("check_out", checkOut);
    
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="room-details-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading room details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="room-details-container">
        <div className="error-container">
          <span className="error-icon">❌</span>
          <h3>Error</h3>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="room-details-container">
        <div className="error-container">
          <span className="error-icon">🔍</span>
          <h3>Room Not Found</h3>
          <p>The room you're looking for doesn't exist.</p>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isAvailable = room.room_status_name?.toLowerCase() === "available" || !room.room_status_name;

  return (
    <div className="room-details-container">
      {/* Header */}
      <header className="room-details-header">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
            Back
          </button>
          <div className="room-title-section">
            <h1 className="room-title">
              <span className="room-icon">{getRoomIcon(room.room_class_name)}</span>
              Room #{room.id}
            </h1>
            <div className="room-subtitle">
              <span className="room-class">{room.room_class_name}</span>
              <span className="room-floor">Floor {room.floor}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="room-details-main">
        <div className="container">
          <div className="room-details-grid">
            
            {/* Room Image Section */}
            <div className="room-image-section">
              <div className="room-image-placeholder">
                {room.image ? (
                  <img src={room.image} alt={`Room ${room.id}`} className="room-image" />
                ) : (
                  <div className="no-image">
                    <span className="no-image-icon">🏨</span>
                    <p>No image available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Room Information */}
            <div className="room-info-section">
              <div className="info-card">
                <h2 className="info-title">Room Information</h2>
                
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">
                      <span className="info-icon">🏨</span>
                      Room Class
                    </span>
                    <span className="info-value">{room.room_class_name}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">
                      <span className="info-icon">🛏️</span>
                      Bed Type
                    </span>
                    <span className="info-value">{room.bed_type_name}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">
                      <span className="info-icon">🔢</span>
                      Bed Count
                    </span>
                    <span className="info-value">{room.bed_count}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">
                      <span className="info-icon">🏢</span>
                      Floor
                    </span>
                    <span className="info-value">{room.floor}</span>
                  </div>

                  <div className="info-item">
                    <span className="info-label">
                      <span className="info-icon">📊</span>
                      Status
                    </span>
                    <span className={`status-badge ${getStatusBadgeClass(room.room_status_name)}`}>
                      {room.room_status_name || "Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="pricing-card">
                <h2 className="pricing-title">Pricing</h2>
                
                <div className="pricing-details">
                  <div className="price-item">
                    <span className="price-label">Base Price</span>
                    <span className="price-value">{formatPrice(room.base_price)}</span>
                  </div>

                  <div className="price-item">
                    <span className="price-label">Price per Bed</span>
                    <span className="price-value">{formatPrice(room.price_per_bed)}</span>
                  </div>

                  {room.features && room.features.length > 0 && (
                    <div className="price-item">
                      <span className="price-label">Features Total</span>
                      <span className="price-value">{formatPrice(calculateTotalFeaturePrice(room.features))}</span>
                    </div>
                  )}

                  <div className="price-item total-price">
                    <span className="price-label">Total per Night</span>
                    <span className="price-value">
                      {formatPrice(
                        room.base_price + 
                        (room.features ? calculateTotalFeaturePrice(room.features) : 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          {room.features && room.features.length > 0 && (
            <div className="features-section">
              <h2 className="features-title">Room Features</h2>
              <div className="features-grid">
                {room.features.map((feature) => (
                  <div key={feature.id} className="feature-card">
                    <div className="feature-header">
                      <span className="feature-icon">⭐</span>
                      <h3 className="feature-name">{feature.name}</h3>
                    </div>
                    <div className="feature-price">
                      {feature.price_per_use === 0 ? (
                        <span className="free-badge">Free</span>
                      ) : (
                        <span className="price-badge">{formatPrice(feature.price_per_use)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="reviews-section">
            <div className="reviews-header">
              <h2 className="reviews-title">Guest Reviews</h2>
              {canReview && !reviewSubmitted && (
                <button 
                  className="btn btn-primary write-review-btn"
                  onClick={() => setShowReviewForm(!showReviewForm)}
                >
                  <span className="btn-icon">✍️</span>
                  {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                </button>
              )}
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="review-form-container">
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <h3 className="review-form-title">Write Your Review</h3>
                  
                  <div className="rating-section">
                    <label className="rating-label">Rating:</label>
                    <div className="star-rating">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${star <= reviewData.rating ? 'active' : ''}`}
                          onClick={() => handleRatingChange(star)}
                        >
                          ⭐
                        </button>
                      ))}
                      <span className="rating-text">({reviewData.rating}/5)</span>
                    </div>
                  </div>

                  <div className="comment-section">
                    <label htmlFor="comment" className="comment-label">Your Review:</label>
                    <textarea
                      id="comment"
                      className="comment-textarea"
                      placeholder="Share your experience with this room..."
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="review-form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={reviewSubmitting || !reviewData.comment.trim()}
                    >
                      <span className="btn-icon">
                        {reviewSubmitting ? '⏳' : '📝'}
                      </span>
                      {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={() => setShowReviewForm(false)}
                      disabled={reviewSubmitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Reviews */}
            {room.reviews && room.reviews.length > 0 ? (
              <div className="reviews-grid">
                {room.reviews.map((review, index) => (
                  <div key={index} className="review-card">
                    <div className="review-header">
                      <span className="reviewer-name">{review.name}</span>
                      <span className="review-rating">⭐ {review.rating}/5</span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <span className="review-date">{review.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-reviews">
                <span className="no-reviews-icon">💬</span>
                <h3>No Reviews Yet</h3>
                <p>Be the first to review this room!</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="room-actions">
            {isAvailable ? (
              <>
                <button 
                  className={`btn ${selected ? 'btn-danger' : 'btn-primary'} book-btn`}
                  onClick={() => toggleSelect(parseInt(room.id))}
                >
                  <span className="btn-icon">
                    {selected ? '✖️' : '🛒'}
                  </span>
                  {selected ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                
                {selected && (
                  <button 
                    className="btn btn-primary view-cart-btn"
                    onClick={goToCart}
                  >
                    <span className="btn-icon">🛒</span>
                    View Cart
                  </button>
                )}
              </>
            ) : (
              <button className="btn btn-disabled" disabled>
                <span className="btn-icon">❌</span>
                Room Not Available
              </button>
            )}
            
            <button 
              className="btn btn-outline"
              onClick={() => navigate(-1)}
            >
              <span className="btn-icon">🔙</span>
              Back to Rooms
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}