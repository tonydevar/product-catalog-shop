import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import ProductCard from '../components/ProductCard.jsx';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    setAdded(false);
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        setProduct(data.product);
        setRelated(data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    dispatch({ type: 'addItem', payload: product });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!product) return (
    <div className={styles.notFound}>
      <p>Product not found.</p>
      <Link to="/">← Back to products</Link>
    </div>
  );

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>← Back to products</Link>
      <div className={styles.detail}>
        <div className={styles.imageCol}>
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.infoCol}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>
          <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          <p className={styles.price}>${product.price.toFixed(2)}</p>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.meta}>
            <span className={product.stock > 0 ? styles.inStock : styles.outOfStock}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>
          <div className={styles.tags}>
            {product.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <button
            className={styles.addBtn}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Related Products</h2>
          <div className={styles.relatedGrid}>
            {related.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
