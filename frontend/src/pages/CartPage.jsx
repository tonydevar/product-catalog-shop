import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem.jsx';
import styles from './CartPage.module.css';

const SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING = 9.99;

export default function CartPage() {
  const { items, dispatch, cartTotal } = useCart();

  const shipping = cartTotal >= SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = cartTotal + shipping;

  function handleCheckout() {
    alert('Checkout coming soon!');
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyInner}>
          <span className={styles.emptyIcon}>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Browse our catalog to find something you love.</p>
          <Link to="/" className={styles.shopLink}>Start Shopping →</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        {/* Cart items */}
        <div className={styles.itemsCol}>
          <div className={styles.itemsHeader}>
            <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
            <button
              className={styles.clearBtn}
              onClick={() => dispatch({ type: 'clearCart' })}
              type="button"
            >
              Clear cart
            </button>
          </div>
          <ul className={styles.list}>
            {items.map(item => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>
        </div>

        {/* Order summary */}
        <aside className={styles.summary}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>

          <div className={styles.summaryRows}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span className={shipping === 0 ? styles.freeShipping : ''}>
                {shipping === 0
                  ? 'FREE'
                  : `$${FLAT_SHIPPING.toFixed(2)}`
                }
              </span>
            </div>
            {shipping > 0 && (
              <p className={styles.shippingNote}>
                Add ${(SHIPPING_THRESHOLD - cartTotal).toFixed(2)} more for free shipping
              </p>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>

          <button
            className={styles.checkoutBtn}
            onClick={handleCheckout}
            type="button"
          >
            Proceed to Checkout
          </button>

          <Link to="/" className={styles.continueLink}>
            ← Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
