import React from 'react'
import styles from './Banner.module.css';

const Banner = (props) => {
  return (
    <img src={props.img} alt="banner" className={styles.Banner}/>
  )
}

export default Banner;

