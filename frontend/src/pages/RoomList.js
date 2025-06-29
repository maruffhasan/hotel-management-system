import React, { useEffect, useState } from "react";
import { getRooms, getOptions } from "../api";
import { useNavigate } from "react-router-dom";

export default function RoomList() {
  const [filters, setFilters] = useState({
    check_in: "",
    check_out: "",
    room_class_id: "",
    bed_type_id: "",
    room_status_id: "",
    floor: "",
    min_price: "",
    max_price: "",
    person_count: "",
  });

  // Initialize selected from localStorage or empty array
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selectedRooms");
    return saved ? JSON.parse(saved) : [];
  });

  const [rooms, setRooms] = useState([]);
  const [options, setOptions] = useState({ bed: [], feature: [], roomClass: [], status: [] });
  const navigate = useNavigate();

  useEffect(() => {
    getOptions().then(setOptions);
  }, []);

  const handleChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const fetchRooms = async () => {
    if (!filters.check_in || !filters.check_out) {
      alert("Check-in and Check-out dates are required");
      return;
    }
    const data = await getRooms(filters);
    setRooms(data);
  };

  const toggleSelect = (roomId) => {
    setSelected((prev) => {
      let updated;
      if (prev.includes(roomId)) {
        updated = prev.filter((id) => id !== roomId);
      } else {
        updated = [...prev, roomId];
      }
      localStorage.setItem("selectedRooms", JSON.stringify(updated));
      return updated;
    });
  };

  const goToCart = () => {
    // Save check_in/out for booking too
    localStorage.setItem("check_in", filters.check_in);
    localStorage.setItem("check_out", filters.check_out);
    navigate("/cart");
  };

  return (
    <div>
      <h2>Room List</h2>

      <input
        type="date"
        name="check_in"
        value={filters.check_in}
        onChange={handleChange}
        required
      />
      <input
        type="date"
        name="check_out"
        value={filters.check_out}
        onChange={handleChange}
        required
      />

      <select name="room_class_id" value={filters.room_class_id} onChange={handleChange}>
        <option value="">Room Class</option>
        {options.roomClass.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select name="bed_type_id" value={filters.bed_type_id} onChange={handleChange}>
        <option value="">Bed Type</option>
        {options.bed.map((b) => (
          <option key={b.id} value={b.id}>
            {b.name}
          </option>
        ))}
      </select>

      <select name="room_status_id" value={filters.room_status_id} onChange={handleChange}>
        <option value="">Room Status</option>
        {options.status.map((s) => (
          <option key={s.id} value={s.id}>
            {s.status}
          </option>
        ))}
      </select>

      <select name="floor" value={filters.floor} onChange={handleChange}>
        <option value="">Floor</option>
        {Array.from({ length: 10 }, (_, i) => i + 1).map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="min_price"
        placeholder="Min Price"
        value={filters.min_price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="max_price"
        placeholder="Max Price"
        value={filters.max_price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="person_count"
        placeholder="Person Count"
        value={filters.person_count}
        onChange={handleChange}
      />

      <button onClick={fetchRooms}>Search</button>

      <h3>Available Rooms</h3>
      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            Room #{room.id} - {room.room_class_name}, Bed: {room.bed_type_name} - $
            {room.base_price.toFixed(2)}
            <button onClick={() => toggleSelect(room.id)} style={{ marginLeft: 10 }}>
              {selected.includes(room.id) ? "Remove from Cart" : "Add to Cart"}
            </button>
          </li>
        ))}
      </ul>

      {selected.length > 0 && (
        <button onClick={goToCart}>Go to Cart ({selected.length})</button>
      )}
    </div>
  );
}
