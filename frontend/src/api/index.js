const API = "http://localhost:8080"; // Centralized API base URL

export async function loginUser(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
   if (!res.ok) {
    const text = await res.text();  // get plain text response
    const error=new Error(text || 'LOGIN ERROR');
    error.status=res.status;
    throw error;
  }

  return await res.json();
}

export async function signupUser(first_name,last_name,email,password)
{
    const res= await fetch(`${API}/api/auth/user-sign-up`,{
    method: "POST",
    headers: {"Content-Type":  "application/json"},
    body: JSON.stringify({first_name, last_name, email, password}),
  });

  if(!res.ok) {
    const text = await res.text();
    const error=new Error(text || 'SIGNUP ERROR');
    error.status=res.status;
    throw error;
  }

  return await loginUser(email,password);
}

export async function getRooms(filters) {
  const params = new URLSearchParams();

  for (const key in filters) {
    if (key === "feature_ids" && Array.isArray(filters[key])) {
      filters[key].forEach((id) => params.append("feature_id", id)); // ✅ CORRECT: not "feature_ids"
    } else if (filters[key] !== "" && filters[key] !== null && filters[key] !== undefined) {
      params.append(key, filters[key]);
    }
  }

  const res = await fetch(`${API}/api/rooms/all?${params.toString()}`);
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

 export async function getAddon() {
  const res = await fetch(`${API}/api/addon/all`);
  return res.json();
 }

export async function bookRoom(data) {
  const token = localStorage.getItem("token");
  
  const response = await fetch(`${API}/api/booking/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error(`Booking failed: ${response.status} ${response.statusText}`);
  }
  
    return await response.text();
}

export async function askChatbot(qns) {
  const res = await fetch(`${API}/api/chatbot?qns=${encodeURIComponent(qns)}`);
  const text = await res.text();
  return text;
}

export async function getRoomById(id) {
  const res = await fetch(`${API}/api/rooms/${id}`);
  return res.json();
}

export async function getBookingDetailsUser() {
  const token=localStorage.getItem("token");
  const res = await fetch(`${API}/api/user/booking`, {
    method : "GET",
    headers : {
      "Authorization": `Bearer ${token}`,
      "Content-type": "application/json"
    },
 })

 if(!res.ok) 
    throw new Error(`Couldnt fetch details booking for the user: ${response.status} `);
  
 return await res.json();
};

export async function verifyBooking(bookingId) {
  const token=localStorage.getItem("token");
  try {
    const response = await fetch(`${API}/api/booking/details/${bookingId.trim()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Booking not found');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying booking:', error);
    throw error;
  }
};

export const getRoomClass= async() =>{
    const roomClassesResponse = await fetch(`${API}/api/room-class/all`);
    return await roomClassesResponse.json();
};