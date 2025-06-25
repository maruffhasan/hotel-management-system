import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return navigate("/");
    setUser(JSON.parse(userStr));
  }, [navigate]);

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div>
      <button onClick={logout} style={{ float: "right" }}>
        Logout
      </button>
      <h2>
        {user
          ? `Hello, ${user.first_name} ${user.last_name}. Welcome!`
          : "Loading..."}
      </h2>
    </div>
  );
}
