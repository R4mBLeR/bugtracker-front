import React, { useEffect, useState } from "react";
import styles from "./ReportPage.module.css";
import baseStyles from "../../styles/baseStyle.module.css";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useTitle from "../../hooks/useTitle";

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;
  const { isAuthenticated, fetchWithAuth } = useAuth();

  const ReportStatus = {
    IN_PROGRESS: 1,
    RESOLVED: 2,
  };

  useTitle("Report #" + id);

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
  }, [id, navigate, API_URL]);

  const deleteReport = async () => {
    try {
      const response = await fetchWithAuth(`${API_URL}/reports/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(id) }),
      });

      if (response.ok) {
        navigate("/reports");
      } else {
        const data = await response.json();
        setMessage(data.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setMessage("An error occurred while deleting");
    }
  };

  const updateReportStatus = async (newStatus) => {
    try {
      const response = await fetchWithAuth(`${API_URL}/reports/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(id), status: newStatus }),
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setReport(updatedReport);

        if (newStatus === ReportStatus.RESOLVED) {
          setMessage("Report status successfully updated to 'Resolved'");
        } else if (newStatus === ReportStatus.IN_PROGRESS) {
          setMessage("Report status successfully updated to 'In Progress'");
        }

        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await response.json();
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Update status error:", error);
      setMessage("An error occurred while updating status");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!report) {
    return null;
  }

  return (
    <div className={styles.reportPage}>
      <div className={baseStyles.wrapper}>
        <div className={baseStyles.lineSeparator}></div>
        <div className={styles.reportWrapper}>
          <h3 className={styles.reportId}>Report #{report.id}</h3>
          <div className={styles.reportCard}>
            <h3 className={styles.reportTitle}>{report.title}</h3>
            <div className={styles.reportDescription}>{report.description}</div>
            <div className={styles.reportFooter}>{report.email}</div>
          </div>
        </div>

        {isAuthenticated && (
          <div className={styles.adminPanel}>
            <div className={styles.adminButtons}>
              <button
                onClick={deleteReport}
                className={`${styles.button} ${styles.deleteButton}`}
                title="Delete Report"
              >
                Delete Report
              </button>
              <button
                onClick={() => updateReportStatus(ReportStatus.IN_PROGRESS)}
                title='Set "In Progress" status'
                className={`${styles.button} ${styles.updateButton}`}
              >
                Set In Progress Status
              </button>
              <button
                onClick={() => updateReportStatus(ReportStatus.RESOLVED)}
                title="Close Report"
                className={`${styles.button} ${styles.closeButton}`}
              >
                Resolve Report
              </button>
            </div>
            {message && <div className={styles.adminMessage}>{message}</div>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
