import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  function handleChange(e) {
    const val = e.target.value;
    setLocalValue(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChange(val);
    }, 300);
  }

  function handleClear() {
    setLocalValue('');
    clearTimeout(timerRef.current);
    onChange('');
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.icon} aria-hidden="true">🔍</span>
      <input
        type="search"
        className={styles.input}
        placeholder="Search products…"
        value={localValue}
        onChange={handleChange}
        aria-label="Search products"
      />
      {localValue && (
        <button className={styles.clearBtn} onClick={handleClear} aria-label="Clear search">
          ✕
        </button>
      )}
    </div>
  );
}
