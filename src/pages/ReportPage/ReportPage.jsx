import React, { useEffect, useState } from "react";
import styles from "./ReportPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [reportStatus, setNewReportStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;
  const { isAuthenticated, accessToken, refreshToken } = useAuth();

  const ReportStatus = {
    IN_PROGRESS: "in_progress",
    RESOLVED: "resolved",
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/reports/${id}`);

        if (response.status === 404) {
          navigate("/not-found", { replace: true });
          return;
        }

        if (!response.ok) {
          throw new Error("REPORT_LOAD_ERROR");
        }

        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error("Error fetching report:", error);
        navigate("/error", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id, navigate]);

  const deleteReport = async () => {
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`},
      body: JSON.stringify({ id }),
    };
    const response = await fetch(API_URL + "/reports", requestOptions);
    const data = await response.json();
    if(response.status === 401) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json",
          'Authorization': `Bearer ${refreshToken}`},
        body: JSON.stringify({ id }),
      };
      const response = await fetch(API_URL + "/reports", requestOptions);
    }
    console.log(data);

  };

  const updateReportStatus = async (newStatus) => {};

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!report) {
    return null;
  }

  return (
    <div className={styles.reportPage}>
      <div className={baseStyles.wrapper}>
        <div className={baseStyles.lineSeparator}></div>
        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <div className={styles.reportWrapper}>
            <h3 className={styles.reportId}>Report #{report.id}</h3>
            <div className={styles.reportCard}>
              <h3 className={styles.reportTitle}>{report.title}</h3>
              <div className={styles.reportDescription}>
                {report.description}
              </div>
              <div className={styles.reportFooter}>{report.email}</div>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className={styles.adminPanel}>
            <button onClick={deleteReport} className={`${styles.button} ${styles.deleteButton}`} title="Delete Report">Delete Report</button>
            <button
              onClick={updateReportStatus(ReportStatus.IN_PROGRESS)}
              title='Set "inProgress" status'
              className={`${styles.button} ${styles.updateButton}`}
            >Set InProgress Status</button>
            <button
              onClick={updateReportStatus(ReportStatus.RESOLVED)}
              title="Close Report"
              className={`${styles.button} ${styles.closeButton}`}
            >Close Report</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
