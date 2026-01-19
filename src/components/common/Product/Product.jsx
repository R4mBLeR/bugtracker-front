import React, { useState } from "react";
import styles from "./Product.module.css";
import stockIndicatorImg from "../../../assets/stockIndicator.png";
import outOfStockIndicatorImg from "../../../assets/outOfStockIndicator.png";



const Product = ({
  name,
  price,
  imageUrl,
  stock,
  rating,
  reviewCount,
  discount,
}) => {
  const [imageError, setImageError] = useState(false);
  const isInStock = stock > 0;
  const reviewLink = "/";

  // Обработчик ошибки изображения
  const handleImageError = () => {
    setImageError(true);
  };

  const discountedPrice = discount ? Math.round(price * (1 - discount / 100) * 100) /100 : null;

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

     for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Полная звезда
        stars.push(
          <span key={i} className={styles.starFilled}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffc107">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Половина звезды
        stars.push(
          <span key={i} className={styles.starHalf}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="halfGradient">
                  <stop offset="50%" stopColor="#ffc107" />
                  <stop offset="50%" stopColor="#e0e0e0" />
                </linearGradient>
              </defs>
              <path 
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
                fill="url(#halfGradient)"
              />
            </svg>
          </span>
        );
      } else {
        // Пустая звезда
        stars.push(
          <span key={i} className={styles.star}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#e0e0e0">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          </span>
        );
      }
    }
    return stars;

  };

  return (
    <div className={styles.productCard}>
      <div className={styles.stockInfo}>
        <img src={
            isInStock ? stockIndicatorImg : outOfStockIndicatorImg} alt="stockIndicator"
          className={`${styles.stockIndicator} ${
            isInStock ? styles.inStock : styles.outOfStock
          }`}
        />
        <span className={styles.stockLabel}>
          {isInStock ? "In Stock" : "Not in Stock"}
        </span>
      </div>

      {/* Изображение с fallback */}
      <div className={styles.productImage}>
        {imageError ? (
          <div className={styles.imagePlaceHolder}>
            <span className={styles.placeholderText}>Изображение недоступно</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={name || "Изображение товара"}
            onError={handleImageError}
            loading="lazy"
          />
        )}
      </div>

      {/* Рейтинг и отзывы */}
      <div className={styles.ratingInfo}>
        <div className={styles.stars}>{renderStars()}</div>
          <a href={reviewLink} className={styles.reviewLink}>
            Reviews ({reviewCount})
          </a>
      </div>

      {/* Название товара */}
      <h3 className={styles.productName}>{name || "Без названия"}</h3>

      {/* Цена */}
      <div className={styles.priceInfo}>
        {discountedPrice ? (
          <>
            <span className={styles.priceOld}>${price}</span>
            <span className={styles.PriceNew}>${discountedPrice}</span>
          </>
        ) : (
          <span className={styles.priceCurrent}>{price}</span>
        )}
      </div>
    </div>
  );
};

export default Product;
