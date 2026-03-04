import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartPage.module.css';

export default function CartPage() {
  const { items, dispatch, cartTotal } = useCart();

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <p>Your cart is empty.</p>
        <Link to="/" className={styles.shopLink}>Start Shopping →</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Cart</h1>
      <div className={styles.layout}>
        <ul className={styles.list}>
          {items.map(item => (
            <li key={item.id} className={styles.item}>
              <img src={item.image} alt={item.name} className={styles.thumb} />
              <div className={styles.info}>
                <Link to={`/product/${item.id}`} className={styles.name}>{item.name}</Link>
                <p className={styles.price}>${item.price.toFixed(2)} each</p>
              </div>
              <div className={styles.qty}>
                <button
                  aria-label="Decrease quantity"
                  onClick={() => dispatch({ type: 'updateQuantity', payload: { id: item.id, quantity: item.quantity - 1 } })}
                >−</button>
                <span>{item.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  onClick={() => dispatch({ type: 'updateQuantity', payload: { id: item.id, quantity: item.quantity + 1 } })}
                >+</button>
              </div>
              <p className={styles.subtotal}>${(item.price * item.quantity).toFixed(2)}</p>
              <button
                className={styles.remove}
                aria-label={`Remove ${item.name}`}
                onClick={() => dispatch({ type: 'removeItem', payload: item.id })}
              >✕</button>
            </li>
          ))}
        </ul>
        <div className={styles.summary}>
          <h2>Order Summary</h2>
          <div className={styles.row}>
            <span>Subtotal</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <button className={styles.checkoutBtn}>Checkout</button>
          <button
            className={styles.clearBtn}
            onClick={() => dispatch({ type: 'clearCart' })}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
