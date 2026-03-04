import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import RatingStars from './RatingStars.jsx';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { dispatch } = useCart();

  function handleAddToCart(e) {
    e.preventDefault();
    dispatch({ type: 'addItem', payload: product });
  }

  return (
    <Link to={`/product/${product.id}`} className={styles.card}>
      <img
        src={product.image}
        alt={product.name}
        className={styles.image}
        loading="lazy"
      />
      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>
        <h3 className={styles.name}>{product.name}</h3>
        <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
}
