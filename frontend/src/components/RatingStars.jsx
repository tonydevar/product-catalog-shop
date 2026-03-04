import React from 'react';

export default function RatingStars({ rating, reviewCount }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const fill = Math.min(1, Math.max(0, rating - (i - 1)));
    stars.push(
      <span
        key={i}
        style={{
          color: fill >= 0.5 ? 'var(--color-star)' : '#d1d5db',
          fontSize: '1rem',
        }}
      >
        ★
      </span>
    );
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {stars}
      {reviewCount !== undefined && (
        <span style={{ marginLeft: '4px', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          ({reviewCount.toLocaleString()})
        </span>
      )}
    </span>
  );
}
