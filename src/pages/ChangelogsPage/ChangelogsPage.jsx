import React, { useState, useEffect } from "react";
import styles from "./ChangelogsPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import useTitle from "../../hooks/useTitle";
import Changelog from "../../components/common/Changelog/Changelog";

const ChangelogsPage = () => {
  const [changelogsData, setChangelogsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
      e.preventDefault();
    setMessage("");

    try {
      setSending(true);
      setError(null);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      };
      const response = await fetch(API_URL + "/changelogs", requestOptions);
      if (response.status === 201) {
        setMessage("The changelog was sent successfully!");
        return;
      }
      if (response.status === 409) {
        setMessage("Something went wrong, please try later.");
        return;
      }
      if (!response.ok) {
        const body = await response.json();
        console.error("Send changelog error", body);
        setMessage(body.message[0]);
        return;
      }
    } catch (error) {
      console.error("Send changelog error", error);
      setMessage("Changelog failed. Please try again.");
    } finally {
      setSending(false);
    }
  };

    useTitle('Changelogs');


    useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        setError(null);

        const response = await fetch(API_URL + "/changelogs");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const changelogsResponse = await response.json();

        if (Array.isArray(changelogsResponse)) {
          if (changelogsResponse.length === 0) {
            setChangelogsData([
              {
                id: 0,
                title: "No reports available",
                status: "info",
                email: "system@admin.com",
              },
            ]);
          } else {
            setChangelogsData(changelogsData);
          }
        } else {
          // Если ответ не массив
          console.error("API response is not an array:", changelogsResponse);
          setChangelogsData([
            {
              id: 0,
              title: "Invalid data format from API",
              status: "error",
              email: "system@admin.com",
            },
          ]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке отчетов:", error);
        setError(error.message);
        setChangelogsData([
          {
            id: 0,
            title: "API Connection Error",
          },
        ]);
      } finally {
        setisLoading(false);
      }
    };

    fetchData();
  }, [API_URL]);

  return (
    <div className={baseStyles.wrapper}>
      <div className={styles.changelogs}>
        <div className={baseStyles.title}>Changelogs</div>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.changelogsContainer}>
          <div className={styles.changelogsScrollingContainer}>
            {isLoading ? (
              <div className={styles.isLoading}>isLoading...</div>
            ) : error ? (
              <div className={styles.error}>Error: {error}</div>
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
        </div>
      </div>
    </div>
  );
};

export default ChangelogsPage;
