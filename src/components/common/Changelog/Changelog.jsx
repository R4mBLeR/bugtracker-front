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

const ChangelogWithEdit = ({ title, description, handleClick }) => {
  return (
    <div className={styles.changelogContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.changelogTitle}>{title}</div>
        <button onClick={handleClick}>Edit</button>
      </div>
      <div className={styles.changelogText}>{description}</div>
    </div>
  );
};

export { Changelog, ChangelogWithEdit };
