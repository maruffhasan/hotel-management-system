import React from "react";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const role = localStorage.getItem("role");
  const email = JSON.parse(atob(localStorage.getItem("token").split('.')[1])).sub;

  function logout() {
    localStorage.clear();
    window.location.href = "/login";
  }

  return (
    <div>
      <h2>Welcome, {email}</h2>
      <p>You are logged in as: <strong>{role}</strong></p>
      <nav>
        <Link to="/rooms">Browse Rooms</Link> |{" "}
        <Link to="/booking">Make a Booking</Link> |{" "}
        <Link to="/chatbot">Ask Chatbot</Link> |{" "}
        <Link to="/cart">Go to Cart</Link>

        <button onClick={logout}>Logout</button>
      </nav>
    </div>
  );
}
