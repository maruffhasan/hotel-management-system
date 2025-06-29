import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";

export default function Login({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await loginUser(email, password);
    if (res && res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      setRole(res.role);

      // <-- Redirect based on role here!
      navigate(res.role === "admin" ? "/admin" : "/user");
    } else {
      alert("Invalid credentials");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
