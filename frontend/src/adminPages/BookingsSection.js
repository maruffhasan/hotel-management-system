import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getAllBookings } from '../utils/apiHelpers';

export default function BookingsSection() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await getAllBookings(); 
      setBookings(response);
      generateChartData(response);
      setError(null);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = (bookingsData) => {
    // Group bookings by date
    const bookingsByDate = bookingsData.reduce((acc, booking) => {
      const date = booking.booking_date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {});

    // Convert to chart data format and sort by date
    const chartData = Object.entries(bookingsByDate)
      .map(([date, count]) => ({
        date,
        bookings: count
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    setChartData(chartData);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return `$${price.toFixed(2)}`;
  };

  const calculateTotalRevenue = () => {
    return bookings.reduce((total, booking) => total + booking.price, 0);
  };

  const calculateAverageBookingValue = () => {
    if (bookings.length === 0) return 0;
    return calculateTotalRevenue() / bookings.length;
  };

  if (loading) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Bookings</h1>
        </div>
        <div className="placeholder-content">
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content-section">
        <div className="section-header">
          <h1>Bookings</h1>
        </div>
        <div className="placeholder-content">
          <p>Error loading bookings: {error}</p>
          <button className="btn btn-primaryy" onClick={fetchBookings} style={{ marginTop: '16px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="content-section">
      <div className="section-header">
        <h1>Bookings</h1>
        <button className="btn btn-primaryy" onClick={fetchBookings}>
          Refresh
        </button>
      </div>

      {/* Statistics Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '20px', 
        marginBottom: '24px' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '14px' }}>Total Bookings</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: '#3498db' }}>
            {bookings.length}
          </p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '14px' }}>Total Revenue</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: '#27ae60' }}>
            {formatPrice(calculateTotalRevenue())}
          </p>
        </div>
        
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' 
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '14px' }}>Average Booking Value</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: '600', color: '#e67e22' }}>
            {formatPrice(calculateAverageBookingValue())}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      {chartData.length > 0 && (
        <div style={{ 
          background: 'white', 
          padding: '24px', 
          borderRadius: '8px', 
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', 
          marginBottom: '24px' 
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#2c3e50' }}>Bookings Per Day</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => formatDate(value)}
                formatter={(value) => [value, 'Bookings']}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#3498db" name="Number of Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bookings Table */}
      <div className="users-table bookings-table">
        <div className="table-header">
          <div className="table-cell">Booking ID</div>
          <div className="table-cell">Email</div>
          <div className="table-cell">Booking Date</div>
          <div className="table-cell">Check In</div>
          <div className="table-cell">Check Out</div>
          <div className="table-cell">Price</div>
        </div>
        
        {bookings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#7f8c8d' }}>
            No bookings found
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking.id} className="table-row">
              <div className="table-cell">
                <strong>{booking.id}</strong>
              </div>
              <div className="table-cell">{booking.email}</div>
              <div className="table-cell">{formatDate(booking.booking_date)}</div>
              <div className="table-cell">{formatDate(booking.check_in)}</div>
              <div className="table-cell">{formatDate(booking.check_out)}</div>
              <div className="table-cell">
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  {formatPrice(booking.price)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}