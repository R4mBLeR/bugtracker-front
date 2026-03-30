import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPanelPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import { useAuth } from "../../context/AuthContext";
import useTitle from "../../hooks/useTitle";

const AdminPanelPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  const { fetchWithAuth, isAuthenticated } = useAuth();
  useTitle('Admin Panel');
  useEffect(() => {
    const checkAuth = setTimeout(() => {
      setIsCheckingAuth(false);
      if (!isAuthenticated) {
        navigate("/login");
      }
    }, 100);

    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, navigate]);

  if (isCheckingAuth) {
    return (
      <div className={baseStyles.wrapper}>
        <div className={styles.loading}>Checking authentication...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      setSending(true);
      const response = await fetchWithAuth(API_URL + "/changelogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (response.status === 201) {
        setMessage("The changelog was sent successfully!");
        setTitle("");
        setDescription("");
        return;
      }

      if (response.status === 409) {
        setMessage("Something went wrong, please try later.");
        return;
      }

      if (!response.ok) {
        const body = await response.json();
        console.error("Send changelog error", body);
        setMessage(body.message?.[0] || "An error occurred");
        return;
      }
    } catch (error) {
      console.error("Send changelog error", error);
      if (
        error.message === "Authentication failed" ||
        error.message === "No refresh token available"
      ) {
        setMessage("Session expired. Please login again.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage("Changelog failed. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className={baseStyles.wrapper}>
      <div className={styles.AdminPanel}>
        <div className={baseStyles.title}>Admin Panel</div>
        <div className={baseStyles.lineSeparator}></div>

        <div className={styles.inputForm}>
          <div className={styles.title}>Create Changelog</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <label className={styles.label}>Title: </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter changelog title"
              />
            </div>

            <div className={styles.inputField}>
              <label className={styles.label}>Description: </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={styles.textarea}
                placeholder="Enter changelog description"
                rows={7}
              />
            </div>

            <button
              type="submit"
              className={styles.sendButton}
              disabled={isSending}
            >
              {isSending ? "Sending..." : "Send changelog"}
            </button>

            {message && (
              <div
                className={`${styles.message} ${
                  message.includes("expired") || message.includes("login")
                    ? styles.errorMessage
                    : ""
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;
