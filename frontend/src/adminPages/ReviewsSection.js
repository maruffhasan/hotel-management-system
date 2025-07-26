import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { getAllReviews, getAllRooms, getAllRoomClasses } from '../utils/apiHelpers';

const ReviewsSection = () => {
  const [reviews, setReviews] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [roomClasses, setRoomClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    roomID: '',
    roomClassID: '',
    from: '',
    to: ''
  });

  // Mock API functions - replace with your actual API calls
  

  const styles = {
    container: {
      height: '100vh',
      overflowY: 'scroll',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      width: '100%',
      boxSizing: 'border-box'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#333',
      margin: 0
    },
    filtersContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '30px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#555',
      marginBottom: '5px'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#fff',
      cursor: 'pointer'
    },
    input: {
      padding: '8px 12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      alignItems: 'flex-end'
    },
    button: {
      padding: '8px 16px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    buttonSecondary: {
      padding: '8px 16px',
      backgroundColor: '#6c757d',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500'
    },
    statsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    statCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      textAlign: 'center'
    },
    statNumber: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#007bff',
      margin: '0 0 5px 0'
    },
    statLabel: {
      fontSize: '14px',
      color: '#666',
      margin: 0
    },
    chartsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    chartCard: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    chartTitle: {
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      marginBottom: '20px',
      textAlign: 'center'
    },
    reviewsList: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      overflow: 'visible',
      marginBottom: '40px'
    },
    reviewsHeader: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      fontSize: '18px',
      fontWeight: '500',
      color: '#333',
      backgroundColor: '#f8f9fa'
    },
    reviewItem: {
      padding: '20px',
      borderBottom: '1px solid #eee',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      transition: 'background-color 0.2s ease',
      minHeight: 'auto',
      overflow: 'visible'
    },
    reviewContent: {
      flex: 1
    },
    reviewHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    reviewerInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    reviewerName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#333'
    },
    reviewerEmail: {
      fontSize: '14px',
      color: '#666'
    },
    reviewRating: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '14px',
      fontWeight: '500'
    },
    ratingStars: {
      color: '#ffc107',
      fontSize: '16px'
    },
    ratingNumber: {
      color: '#666',
      fontSize: '14px'
    },
    reviewText: {
      margin: '10px 0',
      color: '#444',
      fontSize: '15px',
      lineHeight: '1.5',
      fontStyle: 'italic'
    },
    reviewMeta: {
      display: 'flex',
      gap: '15px',
      fontSize: '13px',
      color: '#888',
      marginTop: '10px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    loadingSpinner: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '200px',
      fontSize: '16px'
    },
    noData: {
      textAlign: 'center',
      padding: '40px',
      color: '#666',
      fontSize: '16px'
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchRooms();
    fetchRoomClasses();
    fetchReviews();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await getAllRooms();
      // Handle the API response structure - it might be wrapped in a data property
      const roomsArray = Array.isArray(data) ? data : (data?.data || data?.rooms || []);
      setRooms(roomsArray);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setRooms([]);
    }
  };

  const fetchRoomClasses = async () => {
    try {
      const data = await getAllRoomClasses();
      // Handle the API response structure - it might be wrapped in a data property
      const roomClassesArray = Array.isArray(data) ? data : (data?.data || data?.roomClasses || []);
      setRoomClasses(roomClassesArray);
    } catch (error) {
      console.error('Error fetching room classes:', error);
      setRoomClasses([]);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Pass filter parameters to the API call
      const data = await getAllReviews(
        filters.roomID || null,
        filters.roomClassID || null,
        filters.from || null,
        filters.to || null
      );
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyFilters = () => {
    // The filters will be applied when fetchReviews is called
    fetchReviews();
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      roomID: '',
      roomClassID: '',
      from: '',
      to: ''
    };
    
    setFilters(clearedFilters);
    
    // Immediately call the API with cleared filters instead of relying on state update
    setLoading(true);
    getAllReviews(null, null, null, null)
      .then(data => {
        setReviews(data || []);
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
        setReviews([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getStatsData = () => {
    const totalReviews = reviews.length;
    const averageRating = reviews.length > 0 ? 
      (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1) : 0;
    
    const ratings = reviews.map(r => r.rating || 0).filter(r => r > 0);
    const highestRating = ratings.length > 0 ? Math.max(...ratings) : 0;
    const lowestRating = ratings.length > 0 ? Math.min(...ratings) : 0;

    return {
      totalReviews,
      averageRating,
      highestRating,
      lowestRating
    };
  };

  const getRatingDistributionData = () => {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(review => {
      const rating = Math.floor(review.rating || 0);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });

    return Object.entries(distribution).map(([rating, count]) => ({
      rating: `${rating} Star${rating !== '1' ? 's' : ''}`,
      count,
      percentage: reviews.length > 0 ? ((count / reviews.length) * 100).toFixed(1) : 0
    }));
  };

  const getMonthlyReviewsData = () => {
    const monthlyData = {};
    reviews.forEach(review => {
      if (review.created_at) {
        const date = new Date(review.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      }
    });

    return Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({
        month,
        reviews: count
      }));
  };

  const getRoomRatingsData = () => {
    const roomRatings = {};
    reviews.forEach(review => {
      const roomId = review.room_id;
      if (roomId) {
        if (!roomRatings[roomId]) {
          roomRatings[roomId] = { total: 0, count: 0 };
        }
        roomRatings[roomId].total += review.rating || 0;
        roomRatings[roomId].count += 1;
      }
    });

    return Object.entries(roomRatings)
      .map(([roomId, data]) => ({
        roomId: `Room ${roomId}`,
        averageRating: parseFloat((data.total / data.count).toFixed(1)),
        reviewCount: data.count
      }))
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getRoomClassName = (roomClassId) => {
    const roomClass = roomClasses.find(rc => rc.id === roomClassId);
    return roomClass?.name || 'Unknown';
  };

  const stats = getStatsData();
  const ratingDistribution = getRatingDistributionData();
  const monthlyReviews = getMonthlyReviewsData();
  const roomRatings = getRoomRatingsData();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Reviews Management</h1>
      </div>

      {/* Filters */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Room ID</label>
          <select
            style={styles.select}
            value={filters.roomID}
            onChange={(e) => handleFilterChange('roomID', e.target.value)}
          >
            <option value="">All Rooms</option>
            {rooms.map(room => (
              <option key={room.id} value={room.id}>
                Room {room.id}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Room Class</label>
          <select
            style={styles.select}
            value={filters.roomClassID}
            onChange={(e) => handleFilterChange('roomClassID', e.target.value)}
          >
            <option value="">All Room Classes</option>
            {roomClasses.map(roomClass => (
              <option key={roomClass.id} value={roomClass.id}>
                {roomClass.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>From Date</label>
          <input
            type="date"
            style={styles.input}
            value={filters.from}
            onChange={(e) => handleFilterChange('from', e.target.value)}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>To Date</label>
          <input
            type="date"
            style={styles.input}
            value={filters.to}
            onChange={(e) => handleFilterChange('to', e.target.value)}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button style={styles.button} onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button style={styles.buttonSecondary} onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {loading ? (
        <div style={styles.loadingSpinner}>
          Loading reviews...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.totalReviews}</div>
              <div style={styles.statLabel}>Total Reviews</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.averageRating}</div>
              <div style={styles.statLabel}>Average Rating</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.highestRating}</div>
              <div style={styles.statLabel}>Highest Rating</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statNumber}>{stats.lowestRating}</div>
              <div style={styles.statLabel}>Lowest Rating</div>
            </div>
          </div>

          {/* Charts */}
          <div style={styles.chartsContainer}>
            {/* Rating Distribution */}
            <div style={styles.chartCard}>
              <div style={styles.chartTitle}>Rating Distribution</div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ratingDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="rating" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Rating Distribution Pie Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartTitle}>Rating Distribution (Pie)</div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ratingDistribution.filter(d => d.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ rating, percentage }) => `${rating}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {ratingDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Reviews Trend */}
            {monthlyReviews.length > 0 && (
              <div style={styles.chartCard}>
                <div style={styles.chartTitle}>Monthly Reviews Trend</div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyReviews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="reviews" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Room Ratings */}
            {roomRatings.length > 0 && (
              <div style={styles.chartCard}>
                <div style={styles.chartTitle}>Top Room Ratings</div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={roomRatings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="roomId" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="averageRating" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div style={styles.reviewsList}>
            <div style={styles.reviewsHeader}>
              Recent Reviews ({reviews.length})
            </div>
            {reviews.length === 0 ? (
              <div style={styles.noData}>
                No reviews found with the current filters.
              </div>
            ) : (
              reviews.slice(0, 10).map((review) => (
                <div key={review.id} style={styles.reviewItem}>
                  <div style={styles.reviewContent}>
                    <div style={styles.reviewHeader}>
                      <div style={styles.reviewerInfo}>
                        <div style={styles.reviewerName}>{review.name}</div>
                        <div style={styles.reviewerEmail}>({review.email})</div>
                      </div>
                      <div style={styles.reviewRating}>
                        <span style={styles.ratingStars}>
                          {'★'.repeat(Math.floor(review.rating || 0))}
                          {'☆'.repeat(5 - Math.floor(review.rating || 0))}
                        </span>
                        <span style={styles.ratingNumber}>({review.rating}/5)</span>
                      </div>
                    </div>
                    <div style={styles.reviewText}>
                      "{review.comment || 'No comment provided'}"
                    </div>
                    <div style={styles.reviewMeta}>
                      <div style={styles.metaItem}>
                        <strong>Room:</strong> {review.room_id}
                      </div>
                      <div style={styles.metaItem}>
                        <strong>Class:</strong> {getRoomClassName(review.room_class_id)}
                      </div>
                      <div style={styles.metaItem}>
                        <strong>Date:</strong> {formatDate(review.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewsSection;