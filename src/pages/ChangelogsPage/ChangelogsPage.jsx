import React, { useState, useEffect } from "react";
import styles from "./ChangelogsPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import useTitle from "../../hooks/useTitle";
import {
  Changelog,
  ChangelogWithEdit,
} from "../../components/common/Changelog/Changelog";
import { useAuth } from "../../context/AuthContext";

const ChangelogsPage = () => {
  const [changelogsData, setChangelogsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [changelogEditId, setChangelogEditId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [isSending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const { fetchWithAuth, isAuthenticated } = useAuth();

  const clearInputForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleEditMode = async (changelog) => {
    if (editMode) {
      clearInputForm();
      setEditMode(false);
    } else {
      setEditMode(true);
      setTitle(changelog.title);
      setDescription(changelog.description);
      setChangelogEditId(changelog.id);
    }
    return;
  };

  const fetchChangelogs = async () => {
    setIsLoading(true);
    try {
      // Для получения changelog'ов не нужна авторизация, используем обычный fetch
      const response = await fetch(API_URL + "/changelogs");
      if (response.ok) {
        const data = await response.json();
        // Сортируем по id (новые сверху)
        const sortedData = Array.isArray(data)
          ? [...data].sort((a, b) => b.id - a.id)
          : [];
        setChangelogsData(sortedData);
        setError(null);
      } else {
        setError("No available changelogs");
        setChangelogsData([]);
      }
    } catch (error) {
      console.error("Fetch changelogs error:", error);
      setError("API Connection error");
      setChangelogsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSending(true);

    try {
      const response = await fetchWithAuth(API_URL + "/changelogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (response.status === 201) {
        setMessage("The changelog was sent successfully!");
        clearInputForm();
        await fetchChangelogs();
        return;
      }

      if (response.status === 401 || response.status === 403) {
        setMessage("Session expired. Please login again.");
        return;
      }

      if (response.status === 409) {
        throw new Error("Something went wrong, please try later.");
      }

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message?.[0] || "An error occurred");
      }
    } catch (error) {
      console.error("Send changelog error", error);

      if (
        error.message === "Authentication failed" ||
        error.message === "No refresh token available"
      ) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage(error.message || "Changelog failed. Please try again.");
      }
    } finally {
      setSending(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSending(true);

    try {
      const response = await fetchWithAuth(API_URL + "/changelogs/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: changelogEditId, title, description }),
      });

      if (response.status === 201) {
        setMessage("The changelog update was sent successfully!");
        clearInputForm();
        setEditMode(false);
        await fetchChangelogs();
        return;
      }

      if (response.status === 401 || response.status === 403) {
        setMessage("Session expired. Please login again.");
        return;
      }

      if (response.status === 409) {
        throw new Error("Something went wrong, please try later.");
      }

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.message || "An error occurred");
      }
    } catch (error) {
      console.error("Update changelog error", error);

      if (
        error.message === "Authentication failed" ||
        error.message === "No refresh token available"
      ) {
        setMessage("Session expired. Please login again.");
      } else {
        setMessage(
          error.message || "Changelog update failed. Please try again.",
        );
      }
    } finally {
      setSending(false);
    }
  };

  useTitle("Changelogs");

  useEffect(() => {
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
              <div className={styles.isLoading}>Loading...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : changelogsData.length === 0 ? (
              <div className={styles.noChangelogs}>No changelogs found</div>
            ) : (
              changelogsData.map((changelog) =>
                isAuthenticated ? (
                  <ChangelogWithEdit
                    key={changelog.id}
                    title={changelog.title}
                    description={changelog.description}
                    handleClick={() => handleEditMode(changelog)}
                  />
                ) : (
                  <Changelog
                    key={changelog.id}
                    title={changelog.title}
                    description={changelog.description}
                  />
                ),
              )
            )}
          </div>
        </div>
        {isAuthenticated && (
          <div>
            <div className={baseStyles.lineSeparator}></div>
            {editMode === false ? (
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
                      className={styles.textarea}
                      placeholder="Enter changelog description"
                      rows={5}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={isSending}
                  >
                    {isSending ? "Sending..." : "Send changelog"}
                  </button>
                  {message && <div className={styles.message}>{message}</div>}
                </form>
              </div>
            ) : (
              <div className={styles.inputForm}>
                <div className={styles.title}>Edit Changelog</div>
                <form onSubmit={handleEdit}>
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
                      rows={5}
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.sendButton}
                    disabled={isSending}
                  >
                    {isSending ? "Editing..." : "Edit changelog"}
                  </button>
                  {message && <div className={styles.message}>{message}</div>}
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangelogsPage;
