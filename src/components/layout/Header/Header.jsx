import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import companyLogo from "../../../assets/companyLogo.png";

const Header = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    if (path === "/") {
      return location.pathname === path ? styles.active : "";
    }
    return location.pathname.startsWith(path) ? styles.active : "";
  };

  return (
    <header>
      <div className={styles.container}>
        <a href="/" className={styles.headerLogo}>
          <img src={companyLogo} alt="Company" />
        </a>
        <div className={styles.gameName}>Nomo</div>
        <div className={styles.infoText}>by manyakasia</div>
      </div>
      <nav className={styles.navigation}>
        <div className={`${styles.navContainer} ${getActiveClass("/")}`}>
          <a href="/">Main Page</a>
        </div>
        <div
          className={`${styles.navContainer} ${getActiveClass("/changelogs")}`}
        >
          <a href="/changelogs">Changelogs</a>
        </div>
        <div className={`${styles.navContainer} ${getActiveClass("/reports")}`}>
          <a href="/reports">Reports</a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
