import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api";
import styles from "./Login.module.css"

export default function Login({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    try{
        const res = await loginUser(email, password);
        localStorage.setItem("token", res.token);
        localStorage.setItem("role", res.role);
        setRole(res.role);

        // <-- Redirect based on role here!
        navigate(res.role === "admin" ? "/admin" : "/user");
    }
    catch(err)
    {
        alert(err.message);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1>Login</h1>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className={styles.loginButton}>Login</button>
      </form>
    </div>
  );
}
