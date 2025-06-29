import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getRooms } from "../api";


export default function Home() {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    // Just fetch all rooms with fixed dates for preview
    getRooms({
      check_in: "2025-06-05",
      check_out: "2025-07-06"
    }).then(setRooms);
  }, []);

  return (
    <div>
      <h1>🏨 Welcome to Hotel Yammi</h1>

      {role ? (
        <button onClick={() => navigate(role === "admin" ? "/admin" : "/user")}>
          Go to Dashboard
        </button>
      ) : (
        <Link to="/login"><button>Login</button></Link>
      )}

      <h2>Available Rooms</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            Room #{room.id} - {room.room_class_name} - Bed: {room.bed_type_name} - ${room.base_price}
          </li>
        ))}
      </ul>
    </div>
  );
}
