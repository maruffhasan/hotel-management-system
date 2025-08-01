import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import RoomList from "./pages/RoomList";
import AdminDashboard from "./adminPages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import BookingLog from "./pages/BookingLog";
import Chatbot from "./pages/Chatbot";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import UserSignup from "./pages/UserSignup";
import RoomDetails from './pages/RoomDetails';
import RoomDetails2 from './pages/RoomDetails2';

function App() {
  const [role, setRole] = useState(localStorage.getItem("role"));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setRole={setRole} />} />
        <Route path="/usersignup" element={role === "admin" ? <Navigate to ="/login"/>: <UserSignup setRole={setRole}/> }/>
        <Route path="/rooms" element={role === "user" ? <RoomList /> : <Navigate to="/login" />} />
        <Route path="/bookingLog" element={role === "user" ? <BookingLog /> : <Navigate to="/login" />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/admin" element={role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/user" element={role === "user" ? <UserDashboard/> : <Navigate to="/login" />} />
        <Route path="/cart" element={role === "user" ? <Cart /> : <Navigate to="/login" />} />
        <Route path="/room2/:id" element={<RoomDetails2 />} />
        <Route path="/room/:id" element={<RoomDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
