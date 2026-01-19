import React from "react";
import styles from "./Report.module.css";

const Report = ({ id, title, status = "open", senderEmail }) => {
  const statusText =
    {
      open: "Open",
      "in-progress": "In Progress",
      resolved: "Resolved",
    }[status] || status;

  return (
    <div className={styles.reportCard}>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h3 className={styles.title}>{title}</h3>
          <span className={`${styles.status} ${styles[status]}`}>
            {statusText}
          </span>
        </div>
        <div className={styles.footer}>
          <span className={styles.id}>#{id}</span>
          <span className={styles.senderEmail}>{senderEmail}</span>
        </div>
      </div>
    </div>
  );
};

export default Report;
