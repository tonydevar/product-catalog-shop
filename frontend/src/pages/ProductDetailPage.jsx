import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import RatingStars from '../components/RatingStars.jsx';
import ProductCard from '../components/ProductCard.jsx';
import QuantitySelector from '../components/QuantitySelector.jsx';
import styles from './ProductDetailPage.module.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { dispatch, openPanel } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedMsg, setAddedMsg] = useState(false);

  useEffect(() => {
    setLoading(true);
    setQuantity(1);
    setAddedMsg(false);
    fetch(`/api/products/${encodeURIComponent(id)}`)
      .then(r => {
        if (!r.ok) throw new Error('Not found');
        return r.json();
      })
      .then(data => {
        setProduct(data.product || null);
        setRelated(data.related || []);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    if (!product) return;
    dispatch({ type: 'addItem', payload: { ...product, quantity } });
    setAddedMsg(true);
    openPanel();
    setTimeout(() => setAddedMsg(false), 2500);
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.skeleton} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <h2>Product not found</h2>
          <Link to="/" className={styles.back}>← Back to all products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>← Back to all products</Link>

      <div className={styles.detail}>
        {/* Left: image */}
        <div className={styles.imageCol}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />
        </div>

        {/* Right: info */}
        <div className={styles.infoCol}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.name}>{product.name}</h1>

          <div className={styles.ratingRow}>
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
          </div>

          <p className={styles.price}>${product.price.toFixed(2)}</p>

          <p className={styles.description}>{product.description}</p>

          <div className={styles.stockRow}>
            {product.stock > 0 ? (
              <span className={styles.inStock}>✓ In Stock ({product.stock} available)</span>
            ) : (
              <span className={styles.outOfStock}>✕ Out of Stock</span>
            )}
          </div>

          <div className={styles.tags}>
            {product.tags.map(tag => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>

          {product.stock > 0 && (
            <div className={styles.addToCartRow}>
              <QuantitySelector
                value={quantity}
                min={1}
                max={product.stock}
                onChange={setQuantity}
              />
              <button
                className={`${styles.addBtn} ${addedMsg ? styles.addBtnAdded : ''}`}
                onClick={handleAddToCart}
                type="button"
              >
                {addedMsg ? '✓ Added!' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>You might also like</h2>
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
