import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser } from "../api";
import styles from "./Login.module.css"; // Reusing login styles
import { getErrorMessageByStatus } from "./loginUtils";

export default function UserSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await signupUser({ firstName, lastName, email, password });

      localStorage.setItem("token", res.token);
      localStorage.setItem("role", res.role);
      navigate("/login");
    } catch (err) {
      const status = err.status || null;
      const message = getErrorMessageByStatus(status) || err.message;
      setErrorMessage(message);
      setShowError(true);
    }
  }

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h1>Sign Up</h1>

        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            required
          />
        </div>

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

        <button type="submit" className={styles.loginButton}>Sign Up</button>
        <div>
          <h3>Already have an account? <a href="/login">Login</a></h3>
        </div>
      </form>

      {/* Modal */}
      {showError && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Signup Error</h3>
            <p>{errorMessage}</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowError(false)}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
