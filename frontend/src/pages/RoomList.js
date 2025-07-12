import React, { useEffect, useState } from "react";
import { getRooms, getOptions } from "../api";
import { useNavigate } from "react-router-dom";
import { formatPrice, getRoomIcon, formatDate, calculateNights, setStoredData } from "../utils/utility";
import "../styles/RoomList.css";

export default function RoomList() {
  const [filters, setFilters] = useState({
    check_in: "",
    check_out: "",
    room_class_id: "",
    bed_type_id: "",
    feature_ids: [],
    floor: "",
    min_price: "",
    max_price: "",
    person_count: "",
  });

  // Initialize selected from localStorage or empty array
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedRooms");
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = useState([]);
  const [options, setOptions] = useState({ bed: [], feature: [], roomClass: [], status: [] });
  const [loading, setLoading] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOptions().then(setOptions);
  }, []);

  const handleChange = (e) =>{
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    
  }

  const handleFeatureChange = (featureId) => {
    setFilters((prev) => ({
      ...prev,
      feature_ids: prev.feature_ids.includes(featureId)
        ? prev.feature_ids.filter(id => id !== featureId)
        : [...prev.feature_ids, featureId]
    }));
  };

  const fetchRooms = async () => {
    if (!filters.check_in || !filters.check_out) {
      alert("Check-in and Check-out dates are required");
      return;
    }
    
    setLoading(true);
    try {
      const data = await getRooms(filters);
      // Filter to only show available rooms
      const availableRooms = data.filter(room => 
        room.room_status_name?.toLowerCase() === 'available' || 
        !room.room_status_name // If no status is provided, assume available
      );
      setRooms(availableRooms);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (roomId) => {
    setSelected((prev) => {
      let updated;
      if (prev.includes(roomId)) {
        updated = prev.filter((id) => id !== roomId);
      } else {
        updated = [...prev, roomId];
      }
      localStorage.setItem("selectedRooms", JSON.stringify(updated));
      return updated;
    });
  };

  const goToCart = () => {
    // Save check_in/out for booking too
    setStoredData("check_in", filters.check_in);
    setStoredData("check_out", filters.check_out);
    navigate("/cart");
  };

  const clearFilters = () => {
    setFilters({
      check_in: "",
      check_out: "",
      room_class_id: "",
      bed_type_id: "",
      feature_ids: [],
      floor: "",
      min_price: "",
      max_price: "",
      person_count: "",
    });
    setRooms([]);
  };

  const nights = calculateNights(filters.check_in, filters.check_out);

  return (
    <div className="roomlist-container">
      {/* Header */}
      <header className="roomlist-header">
        <div className="container">
          <h1 className="page-title">
            <span className="title-icon">🔍</span>
            Find Your Perfect Room
          </h1>
          <p className="page-subtitle">Search and book from our premium room collection</p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-header">
            <h2 className="filters-title">Search Filters</h2>
            <button 
              className="filters-toggle"
              onClick={() => setFiltersExpanded(!filtersExpanded)}
            >
              <span className="toggle-icon">{filtersExpanded ? '▼' : '▶'}</span>
              {filtersExpanded ? 'Hide Filters' : 'Show More Filters'}
            </button>
          </div>

          <div className="filters-grid">
            {/* Essential Filters - Always Visible */}
            <div className="filter-group essential">
              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">📅</span>
                  Check-in Date
                </label>
                <input
                  type="date"
                  name="check_in"
                  value={filters.check_in}
                  onChange={handleChange}
                  className="filter-input"
                  required
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">📅</span>
                  Check-out Date
                </label>
                <input
                  type="date"
                  name="check_out"
                  value={filters.check_out}
                  onChange={handleChange}
                  className="filter-input"
                  required
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">👥</span>
                  Guests
                </label>
                <input
                  type="number"
                  name="person_count"
                  placeholder="Number of guests"
                  value={filters.person_count}
                  onChange={handleChange}
                  className="filter-input"
                  min="1"
                />
              </div>
            </div>

            {/* Extended Filters - Collapsible */}
            <div className={`filter-group extended ${filtersExpanded ? 'expanded' : ''}`}>
              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">🏨</span>
                  Room Class
                </label>
                <select 
                  name="room_class_id" 
                  value={filters.room_class_id} 
                  onChange={handleChange}
                  className="filter-select"
                >
                  <option value="">All Room Classes</option>
                  {options.roomClass.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">🛏️</span>
                  Bed Type
                </label>
                <select 
                  name="bed_type_id" 
                  value={filters.bed_type_id} 
                  onChange={handleChange}
                  className="filter-select"
                >
                  <option value="">All Bed Types</option>
                  {options.bed.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item features-filter">
                <label className="filter-label">
                  <span className="label-icon">⭐</span>
                  Features
                </label>
                <div className="features-checkboxes">
                  {options.feature.map((f) => (
                    <div key={f.id} className="feature-checkbox">
                      <input
                        type="checkbox"
                        id={`feature-${f.id}`}
                        checked={filters.feature_ids.includes(f.id)}
                        onChange={() => handleFeatureChange(f.id)}
                        className="checkbox-input"
                      />
                      <label htmlFor={`feature-${f.id}`} className="checkbox-label">
                        {f.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">🏢</span>
                  Floor
                </label>
                <select 
                  name="floor" 
                  value={filters.floor} 
                  onChange={handleChange}
                  className="filter-select"
                >
                  <option value="">All Floors</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((f) => (
                    <option key={f} value={f}>
                      Floor {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">💰</span>
                  Min Price
                </label>
                <input
                  type="number"
                  name="min_price"
                  placeholder="Minimum price"
                  value={filters.min_price}
                  onChange={handleChange}
                  className="filter-input"
                  min="0"
                />
              </div>

              <div className="filter-item">
                <label className="filter-label">
                  <span className="label-icon">💰</span>
                  Max Price
                </label>
                <input
                  type="number"
                  name="max_price"
                  placeholder="Maximum price"
                  value={filters.max_price}
                  onChange={handleChange}
                  className="filter-input"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="filter-actions">
            <button 
              className="btn btn-primary search-btn"
              onClick={fetchRooms}
              disabled={loading}
            >
              <span className="btn-icon">🔍</span>
              {loading ? 'Searching...' : 'Search Rooms'}
            </button>
            <button 
              className="btn btn-outline clear-btn"
              onClick={clearFilters}
            >
              <span className="btn-icon">🗑️</span>
              Clear Filters
            </button>
          </div>

          {/* Stay Summary */}
          {filters.check_in && filters.check_out && (
            <div className="stay-summary">
              <div className="summary-item">
                <span className="summary-label">Check-in:</span>
                <span className="summary-value">{formatDate(filters.check_in)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Check-out:</span>
                <span className="summary-value">{formatDate(filters.check_out)}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Duration:</span>
                <span className="summary-value">{nights} night{nights !== 1 ? 's' : ''}</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="container">
          <div className="results-header">
            <h2 className="results-title">
              Available Rooms
              {rooms.length > 0 && <span className="results-count">({rooms.length} found)</span>}
            </h2>
            {/* REMOVED: Duplicate cart button that was here */}
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Searching for available rooms...</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <div className="room-title">
                      <span className="room-icon">{getRoomIcon(room.room_class_name)}</span>
                      <h3 className="room-number">Room #{room.id}</h3>
                    </div>
                    <div className="room-floor">Floor {room.floor || 'N/A'}</div>
                  </div>
                  
                  <div className="room-details">
                    <div className="room-info">
                      <div className="info-item">
                        <span className="info-label">Class:</span>
                        <span className="info-value">{room.room_class_name}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Bed:</span>
                        <span className="info-value">
                          <span className="bed-icon">🛏️</span>
                          {room.bed_type_name}
                        </span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">Status:</span>
                        <span className="status-badge available">
                          Available
                        </span>
                      </div>
                    </div>
                    
                    <div className="room-pricing">
                      <div className="price-per-night">
                        <span className="price-label">Per night</span>
                        <span className="price-amount">{formatPrice(room.base_price)}</span>
                      </div>
                      {nights > 0 && (
                        <div className="total-price">
                          <span className="total-label">Total ({nights} night{nights !== 1 ? 's' : ''})</span>
                          <span className="total-amount">{formatPrice(room.base_price * nights)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="room-actions">
                    <button 
                      className={`btn ${selected.includes(room.id) ? 'btn-danger' : 'btn-primary'} select-btn`}
                      onClick={() => toggleSelect(room.id)}
                    >
                      <span className="btn-icon">
                        {selected.includes(room.id) ? '✖️' : '➕'}
                      </span>
                      {selected.includes(room.id) ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && rooms.length === 0 && filters.check_in && filters.check_out && (
            <div className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>No rooms found</h3>
              <p>Try adjusting your search filters or dates to find available rooms.</p>
            </div>
          )}

          {!loading && rooms.length === 0 && !filters.check_in && !filters.check_out && (
            <div className="search-prompt">
              <span className="prompt-icon">📅</span>
              <h3>Ready to find your perfect room?</h3>
              <p>Select your check-in and check-out dates to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Cart Button - Keep this one, it's the best UX */}
      {selected.length > 0 && (
        <div className="floating-cart">
          <button 
            className="btn btn-primary floating-cart-btn"
            onClick={goToCart}
          >
            <span className="btn-icon">🛒</span>
            <span className="cart-count">{selected.length}</span>
          </button>
        </div>
      )}
    </div>
  );
}