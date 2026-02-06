import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const result = await login(username, password);

      if (!result.success) {
        setMessage("Incorrect username or password");
        return;
      }
      console.log("Login successful:", result.data);
      setUserName("");
      setPassword("");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>LOGIN</h2>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <div className={styles.inputField}>
          <label className={styles.label}>Username: </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
            required
            className={styles.input}
            placeholder="Enter your username"
            disabled={isLoading}
          />
        </div>

        <div className={styles.inputField}>
          <label className={styles.label}>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
            placeholder="Enter your password"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default LoginPage;
