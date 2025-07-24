const BASE_URL = 'http://localhost:8080/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || localStorage.getItem('authToken');
};

// Helper function to make authenticated requests
const makeRequest = async (url, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Admin signup function
export const adminSignUp = async (userData) => {
  const token = localStorage.getItem('token'); 
  const url = `${BASE_URL}/auth/admin-sign-up`;
  
  const requestData = {
    first_name: userData.firstName,
    last_name: userData.lastName,
    email: userData.email,
    password: userData.password,
  };
  
  return makeRequest(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestData),
  });
};

// Get current admin profile
export const getCurrentAdmin = async () => {
  const url = `${BASE_URL}/user/me`; // Adjust endpoint as needed
  return makeRequest(url, {
    method: 'GET',
  });
};

// Get all admin users
export const getAllAdmins = async () => {
  const url = `${BASE_URL}/user/all`; // Adjust endpoint as needed
  return makeRequest(url, {
    method: 'GET',
  });
};

// Update admin user
export const updateAdmin = async (userId, userData) => {
  const url = `${BASE_URL}/admin/users/${userId}`;
  return makeRequest(url, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

// Delete admin user
export const deleteAdmin = async (userId) => {
  const url = `${BASE_URL}/admin/users/${userId}`;
  return makeRequest(url, {
    method: 'DELETE',
  });
};

// Additional API functions for other sections (placeholders for now)

// Hotels
export const getAllHotels = async () => {
  const url = `${BASE_URL}/admin/hotels`;
  return makeRequest(url, { method: 'GET' });
};

export const createHotel = async (hotelData) => {
  const url = `${BASE_URL}/admin/hotels`;
  return makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(hotelData),
  });
};

// Bookings
export const getAllBookings = async () => {
  const url = `${BASE_URL}/admin/bookings`;
  return makeRequest(url, { method: 'GET' });
};

// Reviews
export const getAllReviews = async () => {
  const url = `${BASE_URL}/admin/reviews`;
  return makeRequest(url, { method: 'GET' });
};

// Rooms
export const getAllRooms = async () => {
  const url = `${BASE_URL}/admin/rooms`;
  return makeRequest(url, { method: 'GET' });
};

export const createRoom = async (roomData) => {
  const url = `${BASE_URL}/admin/rooms`;
  return makeRequest(url, {
    method: 'POST',
    body: JSON.stringify(roomData),
  });
};

// Room Statuses
export const getAllRoomStatuses = async () => {
  const url = `${BASE_URL}/admin/room-statuses`;
  return makeRequest(url, { method: 'GET' });
};

// Room Classes
export const getAllRoomClasses = async () => {
  const url = `${BASE_URL}/admin/room-classes`;
  return makeRequest(url, { method: 'GET' });
};

// Room Features
export const getAllRoomFeatures = async () => {
  const url = `${BASE_URL}/admin/room-features`;
  return makeRequest(url, { method: 'GET' });
};