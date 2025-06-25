import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signUp } from "./api";
import styles from './Register.module.css'

export default function Register() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    const res = await signUp({ first_name, last_name, email, password });
    if (res.status === 201 || res.status === 200) {
      alert("Registration successful! Please login.");
      navigate("/");
    } else {
      alert("Registration failed");
    }
  }

  return (
    <>
      <div className={styles.registerContainer}>
        <form onSubmit={handleRegister} className={styles.registerForm}>
          <div>
            <h1><b>Register</b></h1>
            <input
              type="text"
              placeholder="First Name"
              value={first_name}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Last Name"
              value={last_name}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
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
          <button type="submit" className={styles.registerButton}>Register</button>
          <p>
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </>
  );
}
