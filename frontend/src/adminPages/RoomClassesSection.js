import React, { useState, useEffect } from 'react';
import { getAllRoomClasses, updateRoomClass, getAllFeatures } from '../utils/roomClassesApiHelpers.js';
import "../styles/RoomClassesSection.css"

export default function RoomClassesSection() {
  const [roomClasses, setRoomClasses] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    base_price: '',
    feature_ids: []
  });

  useEffect(() => {
    fetchRoomClasses();
    fetchAllFeatures();
  }, []);

  const fetchRoomClasses = async () => {
    try {
      setLoading(true);
      const classes = await getAllRoomClasses();
      setRoomClasses(classes);
    } catch (error) {
      console.error('Error fetching room classes:', error);
      alert('Error fetching room classes');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllFeatures = async () => {
    try {
      const features = await getAllFeatures();
      setAllFeatures(features);
    } catch (error) {
      console.error('Error fetching features:', error);
    }
  };

  const calculateTotalPrice = (basePrice, features) => {
    const featuresTotal = features.reduce((sum, feature) => sum + feature.price_per_use, 0);
    return basePrice + featuresTotal;
  };

  const handleEditClick = (roomClass) => {
    setEditingClass(roomClass);
    setEditForm({
      id: roomClass.id,
      name: roomClass.name,
      base_price: roomClass.base_price.toString(),
      feature_ids: roomClass.features.map(f => f.id)
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeatureToggle = (featureId) => {
    setEditForm(prev => ({
      ...prev,
      feature_ids: prev.feature_ids.includes(featureId)
        ? prev.feature_ids.filter(id => id !== featureId)
        : [...prev.feature_ids, featureId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        name: editForm.name,
        base_price: parseFloat(editForm.base_price),
        features_id: editForm.feature_ids
      };

      await updateRoomClass(editForm.id, updateData);
      
      setShowEditModal(false);
      setEditingClass(null);
      setEditForm({ id: '', name: '', base_price: '', feature_ids: [] });
      
      // Refresh room classes
      await fetchRoomClasses();
      
      alert('Room class updated successfully!');
    } catch (error) {
      console.error('Error updating room class:', error);
      alert(`Error updating room class: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingClass(null);
    setEditForm({ id: '', name: '', base_price: '', feature_ids: [] });
  };

  const getSelectedFeatures = () => {
    return allFeatures.filter(feature => editForm.feature_ids.includes(feature.id));
  };

  const calculatePreviewTotal = () => {
    const basePrice = parseFloat(editForm.base_price) || 0;
    const selectedFeatures = getSelectedFeatures();
    return calculateTotalPrice(basePrice, selectedFeatures);
  };

  if (loading && roomClasses.length === 0) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Room Classes</h1>
        </div>
        <div className="placeholder-content">
          <p>Loading room classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Room Classes</h1>
      </div>

      <div className="room-classes-grid">
        {roomClasses.map((roomClass) => (
          <div key={roomClass.id} className="room-class-card">
            <div className="card-header">
              <h3>{roomClass.name}</h3>
              <button
                className="btn btn-edit"
                onClick={() => handleEditClick(roomClass)}
              >
                Edit
              </button>
            </div>
            
            <div className="card-content">
              <div className="price-info">
                <div className="base-price">
                  Base Price: <span className="price">${roomClass.base_price}</span>
                </div>
                <div className="total-price">
                  Total Price: <span className="price total">${calculateTotalPrice(roomClass.base_price, roomClass.features)}</span>
                </div>
              </div>
              
              <div className="features-section">
                <h4>Features:</h4>
                {roomClass.features.length > 0 ? (
                  <div className="features-list">
                    {roomClass.features.map((feature) => (
                      <div key={feature.id} className="feature-item">
                        <span className="feature-name">{feature.name}</span>
                        <span className="feature-price">
                          {feature.price_per_use > 0 ? `+$${feature.price_per_use}` : 'Free'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-features">No features assigned</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal room-class-modal">
            <div className="modal-header">
              <h3>Edit Room Class</h3>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Class Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="base_price">Base Price ($)</label>
                  <input
                    type="number"
                    id="base_price"
                    name="base_price"
                    value={editForm.base_price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Features</label>
                  <div className="features-selector">
                    {allFeatures.map((feature) => (
                      <div key={feature.id} className="feature-checkbox">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={editForm.feature_ids.includes(feature.id)}
                            onChange={() => handleFeatureToggle(feature.id)}
                          />
                          <span className="checkbox-text">
                            {feature.name}
                            <span className="feature-price-small">
                              {feature.price_per_use > 0 ? ` (+$${feature.price_per_use})` : ' (Free)'}
                            </span>
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="price-preview">
                  <div className="preview-item">
                    <span>Base Price:</span>
                    <span>${parseFloat(editForm.base_price) || 0}</span>
                  </div>
                  <div className="preview-item">
                    <span>Features Total:</span>
                    <span>${getSelectedFeatures().reduce((sum, f) => sum + f.price_per_use, 0)}</span>
                  </div>
                  <div className="preview-item total-preview">
                    <span>Total Price:</span>
                    <span>${calculatePreviewTotal()}</span>
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primaryy"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Room Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}