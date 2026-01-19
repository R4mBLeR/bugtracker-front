import React from "react";
import styles from "./HomePage.module.css";
import bannerImg from "../../assets/banner.png";
import productPhoto from "../../assets/product_photo.png";
import Product from "../../components/common/Product/Product";
import Banner from "../../components/common/Banner/Banner";
import useProducts from "../../hooks/useProduct"

const HomePage = () => {
  // Используем хук
  const { products, loading, error, refetch } = useProducts();
  
  // Функция рендеринга продуктов
  const renderProducts = () => {
    // Если идет загрузка, показываем 5 скелетонов
    if (loading) {
      const skeletons = [];
      for (let i = 1; i <= 5; i++) {
        skeletons.push(
          <Product
            key={`skeleton-${i}`}
            isLoading={true}
          />
        );
      }
      return skeletons;
    }
    
    // Если есть ошибка
    if (error) {
      console.error("Error loading products:", error);
      
      // Показываем демо-продукты при ошибке (ваш оригинальный код)
      const demoProducts = [];
      for (let i = 1; i < 5; i++) {
        demoProducts.push(
          <Product
            key={`demo-${i}`}
            name="Смартфон iPhone 15 Pro Max 256GB"
            price={599.99}
            imageUrl={productPhoto}
            stock={7}
            rating={4.8}
            reviewCount={324}
            discount={15}
          />
        );
      }
      
      demoProducts.push(
        <Product
          key="demo-out-of-stock"
          name="Смартфон iPhone 15 Pro Max 256GB"
          price={599.99}
          imageUrl={productPhoto}
          stock={0}
          rating={4.8}
          reviewCount={324}
          discount={15}
        />
      );
      
      return demoProducts;
    }
    
    // Если загрузка успешна и есть продукты
    if (products.length > 0) {
      return products.slice(0, 5).map((product, index) => (
        <Product
          key={product.id || index}
          name={product.name || "Без названия"}
          price={product.price || 0}
          imageUrl={product.image || productPhoto}
          stock={product.quantity > 0}
          rating={4.8}
          reviewCount={324}
          discount={15}
        />
      ));
    }
    
    // Если нет продуктов
    return (
      <div className={styles.noProducts}>
        <p>Нет доступных товаров</p>
      </div>
    );
  };

  return (
    <div className={styles.mainPage}>
      <Banner img={bannerImg} />
      
      <div className={styles.mainPageTitles}>
        <div className={styles.mainPageProductsTitle}>New Products</div>
        <div className={styles.mainPageNewProductsTitle}>
          <a href="/">See all New Products</a>
        </div>
      </div>
      
      <div className={styles.productsGrid}>
        {renderProducts()}
      </div>
    </div>
  );
};

export default HomePage;