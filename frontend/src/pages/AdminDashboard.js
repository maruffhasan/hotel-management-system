import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div>
      <h2>Welcome Admin! (Dashboard Coming Soon)</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
