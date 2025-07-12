import React, { useEffect, useState } from "react";
import { getRoomById, getAddon, bookRoom } from "../api";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const [selectedRoomIds, setSelectedRoomIds] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [form, setForm] = useState({ check_in: "", check_out: "", price: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const storedRoomIds = JSON.parse(localStorage.getItem("selectedRooms") || "[]");
    setSelectedRoomIds(storedRoomIds);

    const check_in = localStorage.getItem("check_in") || "";
    const check_out = localStorage.getItem("check_out") || "";
    setForm(prev => ({ ...prev, check_in, check_out }));

    getAddon().then(setAddons);

    // Fetch room details one by one
    Promise.all(storedRoomIds.map(id => getRoomById(id))).then(fetchedRooms => {
      setRooms(fetchedRooms);
    });
  }, []);

  const toggleAddon = (id) => {
    setSelectedAddons(prev =>
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!form.check_in || !form.check_out || !form.price) {
      alert("Please fill all booking details");
      return;
    }
    if (selectedRoomIds.length === 0) {
      alert("No rooms selected");
      return;
    }

    const payload = {
      check_in: form.check_in,
      check_out: form.check_out,
      price: parseFloat(form.price),
      roomIds: selectedRoomIds,
      addonIds: selectedAddons,
    };

    try {
      await bookRoom(payload);
      alert("Booking confirmed!");
      localStorage.removeItem("selectedRooms");
      localStorage.removeItem("check_in");
      localStorage.removeItem("check_out");
      navigate("/user");
    } catch (err) {
      alert("Booking failed, please try again.");
    }
  };

  return (
    <div>
      <h2>Your Cart</h2>

      <h3>Rooms in Cart</h3>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            Room #{room.id} - {room.room_class_name}, Bed: {room.bed_type_name} - $
            {room.base_price.toFixed(2)}
          </li>
        ))}
      </ul>

      <label>
        Check-In:{" "}
        <input
          type="date"
          name="check_in"
          value={form.check_in}
          onChange={handleInput}
        />
      </label>
      <br />
      <label>
        Check-Out:{" "}
        <input
          type="date"
          name="check_out"
          value={form.check_out}
          onChange={handleInput}
        />
      </label>
      <br />
      <label>
        Total Price:{" "}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleInput}
          min="0"
          step="0.01"
        />
      </label>

      <h3>Add Addons</h3>
      <ul>
        {addons.map(f => (
          <li key={f.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedAddons.includes(f.id)}
                onChange={() => toggleAddon(f.id)}
              />{" "}
              {f.name} (${f.price})
            </label>
          </li>
        ))}
      </ul>

      <button onClick={handleBooking}>Confirm Booking</button>
    </div>
  );
}
