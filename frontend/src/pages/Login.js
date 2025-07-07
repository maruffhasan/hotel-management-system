import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import styles from "./Login.module.css"
import {getErrorMessageByStatus} from "./loginUtils"

export default function Login({ setRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showError,setShowError] = useState(false);
  const [errorMessage,setErrorMessage] = useState("");
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
        const status = err.status || null;
        const message = getErrorMessageByStatus(status);
        setErrorMessage(message);
        setShowError(true);
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
        <div>
            <h3 className={styles.loginPrompt}>
              Create an account{" "}
              <Link to="/usersignup" className={styles.loginLink}>Sign up</Link>
            </h3>
        </div>
      </form>

      {/*modal*/}
      {showError && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Login Error</h3>
            <p>{errorMessage}</p>
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn}
                onClick={()=> setShowError(!showError)}
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
