import React, { useState, useEffect } from "react";
import styles from "./ChangelogsPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import useTitle from "../../hooks/useTitle";
import Changelog from "../../components/common/Changelog/Changelog";
import {useAuth} from "../../context/AuthContext";

const ChangelogsPage = () => {
  const [changelogsData, setChangelogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const {fetchWithAuth, isAuthenticated} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            setSending(true);
            const response = await fetchWithAuth(API_URL + "/changelogs", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, description}),
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
                console.log(response);
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
            } else {
                setMessage("Changelog failed. Please try again.");
            }
        } finally {
            setSending(false);
        }
    };

    useTitle('Changelogs');


    useEffect(() => {
        const fetchChangelogs = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL + "/changelogs");
                if (response.ok) {
                    const data = await response.json();
                    setChangelogsData(Array.isArray(data) ? data : []);
                } else {
                    setError("No available changelogs");
                }
            } catch (error) {
                setError("API Connection error");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchChangelogs();
  }, [API_URL]);

  return (
    <div className={styles.changelogsPage}>
      <div className={baseStyles.wrapper}>
        <div className={baseStyles.title}>Changelogs</div>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.changelogs}>
          <div className={styles.changelogsScrollingContainer}>
            {isLoading ? (
              <div className={styles.isLoading}>isLoading...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : changelogsData.length === 0 ? (
              <div className={styles.noChangelogs}>No changelogs found</div>
            ) : (
                changelogsData.map((changelog) => (
                <Changelog
                  key={changelog.id}
                  title={changelog.title}
                  description={changelog.description}
                />
              ))
            )}
          </div>
        </div>
          {isAuthenticated && (<div>
              <div className={baseStyles.lineSeparator}></div>
              <div className={styles.inputForm}>
                  <div className={styles.title}>Add Changelog</div>
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
                              className={styles.textarea} // Используем отдельный класс
                              placeholder="Enter changelog description"
                              rows={5} // Указываем количество строк
                          />
                      </div>
                      <button
                          type="submit"
                          className={styles.sendButton}
                          disabled={isSending}
                      >
                          Send changelog
                      </button>
                      {message && <div className={styles.message}>{message}</div>}
                  </form>
              </div></div>)}

      </div>
    </div>
  );
};

export default ChangelogsPage;
