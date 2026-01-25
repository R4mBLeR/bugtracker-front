import React from "react";
import styles from "./Changelog.module.css";

const Changelog = ({ title, description }) => {
  return (
    <div className={styles.changelogContainer}>
      <div className={styles.changelogTitle}>{title}</div>
      <div className={styles.changelogText}>{description}</div>
    </div>
  );
};

export default Changelog;
