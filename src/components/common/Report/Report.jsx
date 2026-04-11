import React from "react";
import { Link } from "react-router-dom";
import styles from "./Report.module.css";

const Report = ({ id, title, status = 0, senderEmail }) => {
  const statusConfig = {
    0: {
      text: "Open",
      style: "open",
    },
    1: {
      text: "In Progress",
      style: "in-progress",
    },
    2: {
      text: "Resolved",
      style: "resolved",
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <Link to={`/reports/${id}`} className={styles.reportLink}>
      <div className={styles.reportCard}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
            <h3 className={styles.title}>{title}</h3>
            <span className={`${styles.status} ${styles[currentStatus.style]}`}>
              {currentStatus.text}
            </span>
          </div>
          <div className={styles.footer}>
            <span className={styles.id}>#{id}</span>
            <span className={styles.senderEmail}>{senderEmail}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Report;
