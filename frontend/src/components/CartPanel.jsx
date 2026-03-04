import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from './CartItem.jsx';
import styles from './CartPanel.module.css';

export default function CartPanel() {
  const { items, cartTotal, cartCount, isPanelOpen, closePanel } = useCart();
  const navigate = useNavigate();
  const panelRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    if (!isPanelOpen) return;
    function handleKey(e) {
      if (e.key === 'Escape') closePanel();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isPanelOpen, closePanel]);

  // Prevent body scroll when panel is open
  useEffect(() => {
    if (isPanelOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isPanelOpen]);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) closePanel();
  }

  function handleCheckout() {
    closePanel();
    navigate('/cart');
  }

  return (
    <div
      className={`${styles.overlay} ${isPanelOpen ? styles.overlayVisible : ''}`}
      onClick={handleOverlayClick}
      aria-hidden={!isPanelOpen}
    >
      <aside
        ref={panelRef}
        className={`${styles.panel} ${isPanelOpen ? styles.panelOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            Your Cart
            {cartCount > 0 && (
              <span className={styles.count}>{cartCount}</span>
            )}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closePanel}
            aria-label="Close cart"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map(item => (
                <CartItem key={item.id} item={item} compact />
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
            <button
              className={styles.checkoutBtn}
              onClick={handleCheckout}
              type="button"
            >
              Checkout → ${cartTotal.toFixed(2)}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
