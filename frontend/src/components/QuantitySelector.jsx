import React from 'react';
import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, min = 1, max, onChange }) {
  return (
    <div className={styles.wrapper} role="group" aria-label="Quantity">
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className={styles.display} aria-live="polite" aria-atomic="true">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        onClick={() => onChange(value + 1)}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
