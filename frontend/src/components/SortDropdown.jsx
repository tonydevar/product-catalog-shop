import React from 'react';
import styles from './SortDropdown.module.css';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'name-asc', label: 'Name: A–Z' },
];

export default function SortDropdown({ value, onChange }) {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="sort-select" className={styles.label}>Sort by:</label>
      <select
        id="sort-select"
        className={styles.select}
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {SORT_OPTIONS.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
