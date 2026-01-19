import React from "react";
import styles from "./Header.module.css";
import instagramLogo from "../../../assets/instagramLogo.png";
import companyLogo from "../../../assets/companyLogo.png";
import cart from "../../../assets/cart.png";
import { isWorkingTime } from "../../../utils/timeUtils";

const Header = () => {
  const working = isWorkingTime();

  return (
    <header>
      {/* Верхняя черная полоса */}
      <div className={styles.headerTopBackground}>
        <div className={styles.wrapper}>
          <div className={styles.headerTop}>
            <div className={styles.headerSchedule}>
              <div
                className={`${styles.headerScheduleIndicator} ${
                  working ? styles.green : styles.red
                }`}
              ></div>
              <span className={styles.headerDays}>Mon-Thu:</span>
              <span className={styles.headerHours}>9:00 AM - 6:00 PM</span>
            </div>

            <div className={styles.headerLocation}>
              Visit our showroom in 1234 Street Address City Address, 1234
              <span className={styles.headerContact}>Contact Us</span>
            </div>

            <div className={styles.headerContactInfo}>
              <a href="tel:+11239999999" className={styles.headerPhone}>
                Call Us: (123) 999-9999
              </a>
              <div className={styles.headerContactLogo}>
                <img src={instagramLogo} alt="instagram" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Основная навигация */}
      <nav className={styles.headerNav}>
        <div className={styles.wrapper}>
          <div className={styles.headerNavContainer}>
            {/* Логотип */}
            <a href="/" className={styles.headerLogo}>
              <img src={companyLogo} alt="Company" />
            </a>

            {/* Основное меню */}
            <ul className={styles.headerMenu}>
              <li className={styles.headerMenuItem}>
                <a href="/products/laptops" className={styles.headerMenuLink}>
                  Laptops
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a href="/products/desktop" className={styles.headerMenuLink}>
                  Desktops PCs
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a
                  href="/products/networking"
                  className={styles.headerMenuLink}
                >
                  Networking Devices
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a
                  href="/products/printers_scanners"
                  className={styles.headerMenuLink}
                >
                  Printers & Scanners
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a href="/products/pc_parts" className={styles.headerMenuLink}>
                  PC Parts
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a href="/products/other" className={styles.headerMenuLink}>
                  All other Products
                </a>
              </li>
              <li className={styles.headerMenuItem}>
                <a href="/repairs" className={styles.headerMenuLink}>
                  Repairs
                </a>
              </li>
              <li
                className={`${styles.headerMenuItem} ${styles.menuItemDeals}`}
              >
                <a href="/deals" className={styles.headerMenuLink}>
                  Our Deals
                </a>
              </li>
            </ul>

            {/* Корзина */}
            <div className={styles.headerUserActions}>
              <a href="/" className={styles.headerCart}>
                <img src={cart} alt="Cart" />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
