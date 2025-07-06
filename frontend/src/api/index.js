const API = "http://localhost:8080"; // Centralized API base URL

export async function loginUser(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
   if (!res.ok) {
    const text = await res.text();  // get plain text response
    throw new Error(text);
  }

  return await res.json();
}

export async function getRooms(filters) {
  const query = new URLSearchParams(filters).toString();
  const res = await fetch(`${API}/api/rooms/all?${query}`);
  return res.json();
}

export async function getOptions() {
  const [bed, feature, roomClass, status] = await Promise.all([
    fetch(`${API}/api/bed-type/all`).then(r => r.json()),
    fetch(`${API}/api/feature/all`).then(r => r.json()),
    fetch(`${API}/api/room-class/all`).then(r => r.json()),
    fetch(`${API}/api/room-status/all`).then(r => r.json()),
  ]);
  return { bed, feature, roomClass, status };
}

export async function getFeatures() {
  const res = await fetch(`${API}/api/feature/all`);
  return res.json();
}

export async function bookRoom(data) {
  const token = localStorage.getItem("token");
  return fetch(`${API}/api/booking/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
}

export async function askChatbot(qns) {
  const res = await fetch(`${API}/api/chatbot?qns=${encodeURIComponent(qns)}`);
  const text = await res.text();
  return text;
}

export async function getRoomById(id) {
  const res = await fetch(`http://localhost:8080/api/rooms/${id}`);
  return res.json();
}