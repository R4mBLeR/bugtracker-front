import React, { useState, useEffect } from "react";
import Report from "../../components/common/Report/Report";
import styles from "./MainPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import photo from "../../assets/game-photo.jpg";
import useTitle from "../../hooks/useTitle";

const MainPage = () => {
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

    useTitle('Nomo');


    useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(API_URL + "/reports");
        if (response.ok) {
          const data = await response.json();
          setReportsData(Array.isArray(data) ? data : []);
        } else {
          throw new Error(`HTTP ${response.status}`);
        }
      } catch (error) {
        console.warn("Failed to load reports:", error);
        setReportsData([
          {
            id: 1,
            title: "Unable to load reports",
            status: "open",
            email: "system@admin.com",
          },
        ]);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchReports();

      setLoading(false);
    };

    fetchData();
  }, [API_URL]);

  return (
    <div className={styles.mainPage}>
      <div className={baseStyles.wrapper}>
        <div className={styles.aboutContainer}>
          <div className={baseStyles.title}>About</div>
          <div className={styles.aboutRow}>
            <div className={styles.textColumn}>
              <div className={styles.aboutText}>
                Concept of the game is immersive FPS survival-adventure
                experience. Player after shipwreck got trapped on the snowy
                abandoned island where he should investigate world, collect and
                manage limited resources to survive in harsh environment. The
                main goal to finish the game is to fix broken ship and escape
                the island.
              </div>
              <div className={styles.aboutSubtitle}>@manyakasia (CEO)</div>
            </div>
            <div className={styles.imageColumn}>
              <img src={photo} alt="main-image" className={styles.gameImage} />
            </div>
          </div>
        </div>

        <div className={baseStyles.lineSeparator}></div>

        <div className={styles.downloadContainer}>
          <div className={baseStyles.title}>Download</div>
            <div className={styles.downloadText}>NOMO is a first-person survival adventure set in a remote northern
                landscape. After a violent storm, you find yourself stranded on an unknown island. Explore, gather
                resources, survive the harsh environment, and repair your boat to find your way home.</div>
            <a className={styles.downloadButton} href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
                <button
                    title="Download"
                >
                    Download
                </button>
            </a>
        </div>

        <div className={baseStyles.lineSeparator}></div>

        <div className={styles.reportsContainer}>
          <div className={baseStyles.title}>Reports</div>
          <div className={styles.reportsScrollingContainer}>
            {loading ? (
              <div className={styles.loading}>Loading reports...</div>
            ) : reportsData.length === 0 ? (
              <div className={styles.noData}>No reports available</div>
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

export default MainPage;
