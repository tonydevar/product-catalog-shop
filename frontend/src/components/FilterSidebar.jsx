import React from 'react';
import styles from './FilterSidebar.module.css';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'];

export default function FilterSidebar({ filters, onChange }) {
  function handleCategoryChange(cat) {
    const current = filters.categories || [];
    const next = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    onChange({ ...filters, categories: next, page: 1 });
  }

  function handlePriceChange(field, value) {
    onChange({ ...filters, [field]: value, page: 1 });
  }

  function handleReset() {
    onChange({ categories: [], minPrice: '', maxPrice: '', page: 1 });
  }

  const hasActive =
    (filters.categories && filters.categories.length > 0) ||
    filters.minPrice ||
    filters.maxPrice;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filters</h2>
        {hasActive && (
          <button className={styles.resetBtn} onClick={handleReset}>
            Reset
          </button>
        )}
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Category</h3>
        {CATEGORIES.map(cat => (
          <label key={cat} className={styles.checkLabel}>
            <input
              type="checkbox"
              checked={(filters.categories || []).includes(cat)}
              onChange={() => handleCategoryChange(cat)}
            />
            {cat}
          </label>
        ))}
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Price Range</h3>
        <div className={styles.priceRow}>
          <input
            type="number"
            placeholder="Min"
            min="0"
            value={filters.minPrice || ''}
            onChange={e => handlePriceChange('minPrice', e.target.value)}
            className={styles.priceInput}
            aria-label="Minimum price"
          />
          <span className={styles.priceSep}>–</span>
          <input
            type="number"
            placeholder="Max"
            min="0"
            value={filters.maxPrice || ''}
            onChange={e => handlePriceChange('maxPrice', e.target.value)}
            className={styles.priceInput}
            aria-label="Maximum price"
          />
        </div>
      </section>
    </aside>
  );
}
