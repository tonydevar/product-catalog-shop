import React, { useState, useEffect, useCallback } from 'react';
import FilterSidebar from '../components/FilterSidebar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SortDropdown from '../components/SortDropdown.jsx';
import Pagination from '../components/Pagination.jsx';
import styles from './ProductListingPage.module.css';

const DEFAULT_FILTERS = {
  categories: [],
  minPrice: '',
  maxPrice: '',
};

const PAGE_LIMIT = 12;

export default function ProductListingPage({ search }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ products: [], total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.categories.length === 1) {
        params.set('category', filters.categories[0]);
      }
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      params.set('page', String(page));
      params.set('limit', String(PAGE_LIMIT));

      const res = await fetch(`/api/products?${params}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const json = await res.json();

      // If multiple categories selected, filter client-side from full fetch
      if (filters.categories.length > 1) {
        const filtered = json.products.filter(p =>
          filters.categories.includes(p.category)
        );
        setData({ ...json, products: filtered });
      } else {
        setData(json);
      }
    } catch {
      setData({ products: [], total: 0, page: 1, totalPages: 1 });
    } finally {
      setLoading(false);
    }
  }, [filters, sort, page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Reset to page 1 when filters/sort/search change
  useEffect(() => {
    setPage(1);
  }, [filters, sort, search]);

  function handleFiltersChange(newFilters) {
    setFilters({
      categories: newFilters.categories || [],
      minPrice: newFilters.minPrice !== undefined ? newFilters.minPrice : filters.minPrice,
      maxPrice: newFilters.maxPrice !== undefined ? newFilters.maxPrice : filters.maxPrice,
    });
    if (newFilters.page) setPage(newFilters.page);
  }

  function handleSortChange(val) {
    setSort(val);
    setPage(1);
  }

  return (
    <div className={styles.page}>
      {/* Mobile filter toggle */}
      <div className={styles.mobileBar}>
        <button
          className={styles.filterToggle}
          onClick={() => setSidebarOpen(v => !v)}
          aria-expanded={sidebarOpen}
          aria-controls="filter-sidebar"
        >
          {sidebarOpen ? '✕ Close Filters' : '⚡ Filters'}
        </button>
        <SortDropdown value={sort} onChange={handleSortChange} />
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <div
          id="filter-sidebar"
          className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}
        >
          <FilterSidebar filters={filters} onChange={handleFiltersChange} />
        </div>

        {/* Main content */}
        <main className={styles.main}>
          <div className={styles.toolbar}>
            <p className={styles.resultCount}>
              {loading ? 'Loading…' : `${data.total} product${data.total !== 1 ? 's' : ''} found`}
            </p>
            <div className={styles.desktopSort}>
              <SortDropdown value={sort} onChange={handleSortChange} />
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : data.products.length === 0 ? (
            <div className={styles.empty}>
              <p>No products match your filters.</p>
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setFilters(DEFAULT_FILTERS);
                  setSort('');
                  setPage(1);
                }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {data.products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onChange={setPage}
          />
        </main>
      </div>
    </div>
  );
}
