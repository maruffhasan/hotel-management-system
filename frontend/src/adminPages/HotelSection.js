import React, { useState, useEffect } from 'react';
import { getHotelInfo, editHotelInfo } from '../api/index.js';
import styles from '../styles/HotelSection.module.css';

export default function HotelSection() {
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    phone: '',
    email: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchHotelInfo();
  }, []);

  useEffect(() => {
    // Check if there are any changes
    const changes = Object.keys(hotelData).some(key => 
      hotelData[key] !== originalData[key]
    );
    setHasChanges(changes);
  }, [hotelData, originalData]);

  const fetchHotelInfo = async () => {
    setLoading(true);
    try {
      const data = await getHotelInfo();
      if (data) {
        setHotelData(data);
        setOriginalData(data);
      }
    } catch (error) {
      console.error('Error fetching hotel info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setHotelData(originalData);
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.keys(hotelData).forEach(key => {
        if (hotelData[key]) {
          formData.append(key, hotelData[key]);
        }
      });

      const result = await editHotelInfo(formData);
      if (result) {
        setOriginalData(hotelData);
        setIsEditing(false);
        setHasChanges(false);
        alert('Hotel information updated successfully!');
      }
    } catch (error) {
      console.error('Error updating hotel info:', error);
      alert('Error updating hotel information. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.contentSection}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading hotel information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <h1>Hotel Information</h1>
        <div className={styles.actionButtons}>
          {!isEditing ? (
            <button 
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleEdit}
            >
              Edit Information
            </button>
          ) : (
            <div className={styles.editActions}>
              <button 
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={handleCancel}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                className={`${styles.btn} ${styles.btnSuccess}`}
                onClick={handleSave}
                disabled={!hasChanges || saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.hotelCard}>
        <div className={styles.cardHeader}>
          <h2>Hotel Details</h2>
          {hasChanges && isEditing && (
            <span className={styles.changesBadge}>Unsaved Changes</span>
          )}
        </div>

        {!isEditing ? (
          /* Display Mode - Show current hotel information in a nice layout */
          <div className={styles.displayMode}>
            <div className={styles.hotelOverview}>
              <div className={styles.hotelTitle}>
                <h3>{hotelData.name || 'Hotel Name Not Set'}</h3>
                <p className={styles.hotelSubtitle}>Current Hotel Information</p>
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📧</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Email Address</span>
                  <span className={styles.infoValue}>
                    {hotelData.email || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📞</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Phone Number</span>
                  <span className={styles.infoValue}>
                    {hotelData.phone || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📍</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Address</span>
                  <span className={styles.infoValue}>
                    {hotelData.address || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🏙️</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>City</span>
                  <span className={styles.infoValue}>
                    {hotelData.city || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>📮</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>ZIP Code</span>
                  <span className={styles.infoValue}>
                    {hotelData.zip || 'Not provided'}
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>🌍</div>
                <div className={styles.infoContent}>
                  <span className={styles.infoLabel}>Country</span>
                  <span className={styles.infoValue}>
                    {hotelData.country || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.fullAddress}>
              <h4>Complete Address</h4>
              <p className={styles.addressText}>
                {[hotelData.address, hotelData.city, hotelData.zip, hotelData.country]
                  .filter(Boolean)
                  .join(', ') || 'Address information not complete'}
              </p>
            </div>
          </div>
        ) : (
          /* Edit Mode - Show form inputs */
          <div className={styles.hotelForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Hotel Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={hotelData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter hotel name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={hotelData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={hotelData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="address" className={styles.label}>
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={hotelData.address}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter street address"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city" className={styles.label}>
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={hotelData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter city"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="zip" className={styles.label}>
                  ZIP Code
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={hotelData.zip}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter ZIP code"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="country" className={styles.label}>
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={hotelData.country}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>
        )}

        {isEditing && (
          <div className={styles.helpText}>
            <p>💡 All fields are optional. Only fill in the information you want to update.</p>
          </div>
        )}
      </div>
    </div>
  );
}