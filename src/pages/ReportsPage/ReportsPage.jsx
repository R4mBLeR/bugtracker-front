import { useState, useEffect } from "react";
import Report from "../../components/common/Report/Report";
import styles from "./ReportsPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";

const ReportsPage = () => {
  const [reportsData, setReportsData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
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
        body: JSON.stringify({ title, description, email }),
      };
      const response = await fetch(API_URL + "/reports", requestOptions);
      if (response.status === 201) {
        setMessage("The report was sent successfully!");
        return;
      }
      if (response.status === 409) {
        setMessage("Something went wrong, please try later.");
        return;
      }
      if (!response.ok) {
        const body = await response.json();
        console.error("Send report error", body);
        setMessage(body.message[0]);
        return;
      }
    } catch (error) {
      console.error("Send report error", error);
      setMessage("Report failed. Please try again.");
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setisLoading(true);
        setError(null);

        const response = await fetch(API_URL + "/reports");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reportsResponse = await response.json();

        // Проверяем, что ответ - массив
        if (Array.isArray(reportsResponse)) {
          if (reportsResponse.length === 0) {
            // Если массив пустой, показываем сообщение
            setReportsData([
              {
                id: 0,
                title: "No reports available",
                status: "info",
                email: "system@admin.com",
              },
            ]);
          } else {
            setReportsData(reportsResponse);
          }
        } else {
          // Если ответ не массив
          console.error("API response is not an array:", reportsResponse);
          setReportsData([
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
        setReportsData([
          {
            id: 0,
            title: "API Connection Error",
            status: "error",
            email: "system@admin.com",
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
      <div className={styles.reportsPage}>
        <div className={baseStyles.title}>Reports</div>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.reportsContainer}>
          <div className={styles.reportsScrollingContainer}>
            {isLoading ? (
              <div className={styles.isLoading}>isLoading...</div>
            ) : error ? (
              <div className={styles.error}>Error: {error}</div>
            ) : reportsData.length === 0 ? (
              <div className={styles.noReports}>No reports found</div>
            ) : (
              reportsData.map((report) => (
                <Report
                  key={report.id}
                  id={report.id}
                  title={report.title}
                  status={report.status}
                  senderEmail={report.email}
                />
              ))
            )}
          </div>
        </div>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.inputForm}>
          <div className={styles.title}>Create Report</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputField}>
              <label className={styles.label}>Title: </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter report title"
              />
            </div>

            <div className={styles.inputField}>
              <label className={styles.label}>Description: </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={styles.textarea} // Используем отдельный класс
                placeholder="Enter report description"
                rows={5} // Указываем количество строк
              />
            </div>

            <div className={styles.inputField}>
              <label className={styles.label}>Email: </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={styles.input}
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className={styles.sendButton}
              disabled={isSending}
            >
              Send report
            </button>
            {message && <div className={styles.message}>{message}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
