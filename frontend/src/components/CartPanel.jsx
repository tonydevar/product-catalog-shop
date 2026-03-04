import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartPanel.module.css';

export default function CartPanel({ isOpen, onClose }) {
  const { items, dispatch, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Lock body scroll while panel is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleViewCart() {
    onClose();
    navigate('/cart');
  }

  function handleCheckout() {
    // no-op per spec
  }

  function updateQty(id, quantity) {
    if (quantity <= 0) {
      dispatch({ type: 'removeItem', payload: id });
    } else {
      dispatch({ type: 'updateQuantity', payload: { id, quantity } });
    }
  }

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`}
      onClick={handleBackdropClick}
      aria-hidden={!isOpen}
    >
      <aside
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Cart
            {cartCount > 0 && <span className={styles.countBadge}>{cartCount}</span>}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close cart panel"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
              <button className={styles.emptyShopBtn} onClick={() => { onClose(); navigate('/'); }} type="button">
                Browse Products
              </button>
            </div>
          ) : (
            <ul className={styles.itemList}>
              {items.map(item => (
                <li key={item.id} className={styles.item}>
                  <Link to={`/product/${item.id}`} onClick={onClose} className={styles.thumbLink}>
                    <img src={item.image} alt={item.name} className={styles.thumb} />
                  </Link>
                  <div className={styles.itemInfo}>
                    <Link to={`/product/${item.id}`} onClick={onClose} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <p className={styles.unitPrice}>${item.price.toFixed(2)} each</p>
                    <div className={styles.controls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        type="button"
                      >
                        −
                      </button>
                      <span className={styles.qty}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        aria-label="Increase quantity"
                        type="button"
                      >
                        +
                      </button>
                      <span className={styles.lineTotal}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        className={styles.removeBtn}
                        onClick={() => dispatch({ type: 'removeItem', payload: item.id })}
                        aria-label={`Remove ${item.name}`}
                        type="button"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.subtotalRow}>
              <span>Subtotal</span>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <div className={styles.footerActions}>
              <button
                className={styles.viewCartBtn}
                onClick={handleViewCart}
                type="button"
              >
                View Cart
              </button>
              <button
                className={styles.checkoutBtn}
                onClick={handleCheckout}
                type="button"
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
