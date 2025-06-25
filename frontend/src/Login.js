import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "./api";
import styles from "./Login.module.css"

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    const res = await login(email, password);
    if (res.status === 200) {
      const user = await res.json();
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } else if (res.status === 404) {
      alert("Email not found");
    } else if (res.status === 401) {
      alert("Incorrect password");
    } else {
      alert("Login failed");
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
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
              onChange={(e) => setPassword(e.target.value)}
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
        <p>
          Don't have an account? <Link to="/sign-up">Register here</Link>
        </p>
      </form>
    </div>
  );
}
