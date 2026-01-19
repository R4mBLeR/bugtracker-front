import React from 'react'
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.footer}>
        <div className={styles.headerText}>Sign Up To Our Newsletter.</div>
        <div className={styles.headerSmallText}>Be the first to hear about the latest offers.</div>
    </div>
  )
}

export default Footer