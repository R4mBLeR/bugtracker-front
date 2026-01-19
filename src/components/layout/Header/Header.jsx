import React from "react";
import styles from "./Header.module.css";
import companyLogo from "../../../assets/companyLogo.png";

const Header = () => {
  return (
    <header>
      <div className={styles.container}>
        <a href="/" className={styles.headerLogo}>
          <img src={companyLogo} alt="Company" />
        </a>
        <div className={styles.gameName}>Game Name</div>
        <div className={styles.infoText}>by manyakasia</div>
      </div>
    </header>
  );
};

export default Header;
