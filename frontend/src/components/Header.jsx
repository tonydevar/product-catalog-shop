import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import styles from './Header.module.css';

export default function Header({ search, onSearchChange }) {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  function handleSearchSubmit(e) {
    e.preventDefault();
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>
          🛍️ ShopCatalog
        </Link>

        <form className={styles.searchForm} onSubmit={handleSearchSubmit} role="search">
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search products…"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              aria-label="Search products"
            />
          </div>
        </form>

        <nav className={styles.nav}>
          <Link to="/cart" className={styles.cartLink} aria-label={`Cart, ${cartCount} items`}>
            <span className={styles.cartIcon}>🛒</span>
            {cartCount > 0 && (
              <span className={styles.badge} aria-hidden="true">{cartCount}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
