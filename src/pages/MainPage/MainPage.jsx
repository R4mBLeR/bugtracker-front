import { useState, useEffect } from "react";
import Report from "../../components/common/Report/Report";
import styles from "./MainPage.module.css";

const MainPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:443/api/reports")
      .then((response) => response.json())
      .then((result) => {
        setData(result);
      });
  }, []);

  return (
    <div className={styles.mainPage}>
      <div className={styles.changelogContainer}>
        <div className={styles.title}>Changelog</div>
        <div className={styles.changelogInfo}>Coming Soon...</div>
      </div>

      <div className={styles.lineSeparator}></div>

      <div className={styles.reportsContainer}>
        <div className={styles.title}>Reports</div>
        <div className={styles.scrollingContainer}>
          {data.map((report) => (
            <Report
              key={report.id}
              id={report.id}
              title={report.title}
              status="open"
              senderEmail={report.email}
            />
          ))}
          {data.length === 0 && (
            <Report
              id={1}
              title="АПИ ОПЯТЬ ЗДОХЛО"
              status="open"
              senderEmail="pizdorez@tck.com"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
