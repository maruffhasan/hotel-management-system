import React, { useState, useEffect } from 'react';
import { getAllRooms } from '../utils/apiHelpers';
import styles from '../styles/RoomSection.module.css';
import RoomEdit from './RoomEdit';

const RoomSection = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [formData, setFormData] = useState({
        room_class_id: '',
        bed_type_id: '',
        room_status_id: '',
        floor: 1,
        bed_count: 1
    });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await getAllRooms();
      setRooms(response.data || response);
      setError(null);
    } catch (err) {
      setError('Failed to fetch rooms. Please try again.');
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (roomId,room_class_id,bed_type_id,room_status_id,floor,bed_count) => {
    setEditingRoomId(roomId);
    setFormData({room_class_id,
      bed_type_id,
      room_status_id,
      floor,
      bed_count
    });
  };

  const handleBackToRoomSection = () => {
    setEditingRoomId(null);
    // Refetch rooms to show any updates
    fetchRooms();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'available':
        return styles.statusAvailable;
      case 'occupied':
        return styles.statusOccupied;
      case 'maintenance':
        return styles.statusMaintenance;
      default:
        return styles.statusDefault;
    }
  };

  if (editingRoomId) {
    return (
      <RoomEdit 
        roomId={editingRoomId} 
        sentFormData={formData}
        onBack={handleBackToRoomSection}
      />
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading rooms...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={fetchRooms} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Room Management</h2>
        <div className={styles.roomCount}>
          Total Rooms: {rooms.length}
        </div>
      </div>

      <div className={styles.roomGrid}>
        {rooms.map((room) => (
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
              <div className={`${styles.statusBadge} ${getStatusColor(room.room_status_name)}`}>
                {room.room_status_name}
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
                  <span className={styles.priceValue}>${room.base_price}</span>
                </div>
                <div className={styles.bedPrice}>
                  <span className={styles.priceLabel}>Per Bed:</span>
                  <span className={styles.priceValue}>${room.price_per_bed}</span>
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
                            ? `+$${feature.price_per_use}` 
                            : 'Free'
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.cardActions}>
                <button 
                  className={styles.editButton}
                  onClick={() => handleEdit(room.id,room.room_class_id,room.bed_type_id,room.room_status_id,room.floor,room.bed_count)}
                >
                  Edit Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <div className={styles.emptyState}>
          <p>No rooms found.</p>
        </div>
      )}
    </div>
  );
};

export default RoomSection;