import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './CartItem.module.css';

export default function CartItem({ item, compact = false }) {
  const { dispatch } = useCart();

  function updateQty(delta) {
    const next = item.quantity + delta;
    if (next <= 0) {
      dispatch({ type: 'removeItem', payload: item.id });
    } else {
      dispatch({ type: 'updateQuantity', payload: { id: item.id, quantity: next } });
    }
  }

  function remove() {
    dispatch({ type: 'removeItem', payload: item.id });
  }

  return (
    <li className={`${styles.item} ${compact ? styles.compact : ''}`}>
      <Link to={`/product/${item.id}`} className={styles.thumbLink}>
        <img
          src={item.image}
          alt={item.name}
          className={styles.thumb}
        />
      </Link>

      <div className={styles.info}>
        <Link to={`/product/${item.id}`} className={styles.name}>
          {item.name}
        </Link>
        <p className={styles.unitPrice}>${item.price.toFixed(2)} each</p>

        <div className={styles.controls}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQty(-1)}
            aria-label="Decrease quantity"
            type="button"
          >
            −
          </button>
          <span className={styles.qty}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQty(1)}
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
            onClick={remove}
            aria-label={`Remove ${item.name} from cart`}
            type="button"
          >
            ✕
          </button>
        </div>
      </div>
    </li>
  );
}
