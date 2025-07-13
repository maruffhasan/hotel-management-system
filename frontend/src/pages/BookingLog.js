import React, { useState, useEffect } from "react";
import { bookRoom } from "../api";

export default function BookingLog() {
  const [form, setForm] = useState({
    check_in: "",
    check_out: "",
    price: 0,
    addonIds: ""
  });
  const [roomIds, setRoomIds] = useState([]);

  useEffect(() => {
    const storedRooms = localStorage.getItem("selectedRooms");
    const checkIn = localStorage.getItem("check_in");
    const checkOut = localStorage.getItem("check_out");
    if (storedRooms) {
      setRoomIds(JSON.parse(storedRooms));
    }
    setForm(prev => ({
      ...prev,
      check_in: checkIn || "",
      check_out: checkOut || ""
    }));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleBook() {
    const body = {
      ...form,
      price: parseFloat(form.price),
      roomIds,
      addonIds: form.addonIds.split(',').map(Number)
    };
    const res = await bookRoom(body);
    alert("Booking success");

    localStorage.removeItem("selectedRooms");
    localStorage.removeItem("check_in");
    localStorage.removeItem("check_out");
  }

  return (
    <div>
      <h2>Book Room</h2>
      <p>Selected Rooms: {roomIds.join(", ")}</p>
      <input type="date" name="check_in" value={form.check_in} onChange={handleChange} />
      <input type="date" name="check_out" value={form.check_out} onChange={handleChange} />
      <input type="number" name="price" placeholder="Total Price" onChange={handleChange} />
      <input name="addonIds" placeholder="Addon IDs (comma-separated)" onChange={handleChange} />
      <button onClick={handleBook}>Book</button>
    </div>
  );
}
