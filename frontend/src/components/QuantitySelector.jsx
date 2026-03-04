import React from 'react';
import styles from './QuantitySelector.module.css';

export default function QuantitySelector({ value, min = 1, max, onChange }) {
  function decrement() {
    if (value > min) onChange(value - 1);
  }

  function increment() {
    if (max === undefined || value < max) onChange(value + 1);
  }

  function handleInput(e) {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) return;
    const clamped = Math.max(min, max !== undefined ? Math.min(parsed, max) : parsed);
    onChange(clamped);
  }

  return (
    <div className={styles.wrapper} role="group" aria-label="Quantity">
      <button
        className={styles.btn}
        onClick={decrement}
        disabled={value <= min}
        aria-label="Decrease quantity"
        type="button"
      >
        −
      </button>
      <input
        type="number"
        className={styles.input}
        value={value}
        min={min}
        max={max}
        onChange={handleInput}
        aria-label="Quantity"
      />
      <button
        className={styles.btn}
        onClick={increment}
        disabled={max !== undefined && value >= max}
        aria-label="Increase quantity"
        type="button"
      >
        +
      </button>
    </div>
  );
}
