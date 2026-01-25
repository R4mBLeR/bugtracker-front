import { useState, useEffect } from "react";
import Report from "../../components/common/Report/Report";
import styles from "./ReportsPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";

const ReportsPage = () => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL + "reports");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reportsResponse = await response.json();
        console.log("API Response:", reportsResponse);

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
        setLoading(false);
      }
    };

    fetchData();
  }, [API_URL]); // Добавляем API_URL в зависимости

  return (
    <div className={baseStyles.wrapper}>
      <div className={styles.reportsPage}>
        <div className={baseStyles.title}>Reports</div>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.reportsContainer}>
          <div className={styles.reportsScrollingContainer}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
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
      </div>
    </div>
  );
};

export default ReportsPage;
