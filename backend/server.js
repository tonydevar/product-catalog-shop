const express = require('express');
const cors = require('cors');
const products = require('./data/products.json');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// GET /api/categories
app.get('/api/categories', (req, res) => {
  res.json({ categories: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports'] });
});

// GET /api/products
app.get('/api/products', (req, res) => {
  const { category, minPrice, maxPrice, search, sort, page = '1', limit = '12' } = req.query;

  let filtered = [...products];

  // Category filter (case-insensitive)
  if (category) {
    const cat = category.toLowerCase();
    filtered = filtered.filter(p => p.category.toLowerCase() === cat);
  }

  // Price range filter
  if (minPrice !== undefined) {
    const min = parseFloat(minPrice);
    if (!isNaN(min)) {
      filtered = filtered.filter(p => p.price >= min);
    }
  }
  if (maxPrice !== undefined) {
    const max = parseFloat(maxPrice);
    if (!isNaN(max)) {
      filtered = filtered.filter(p => p.price <= max);
    }
  }

  // Search filter (case-insensitive substring on name and description)
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  // Sorting
  if (sort) {
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, parseInt(limit, 10) || 12);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  res.json({
    products: paginated,
    total,
    page: pageNum,
    totalPages,
  });
});

// GET /api/products/:id
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({ product, related });
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items must be an array' });
  }

  const result = items.map(({ productId, quantity }) => {
    const product = products.find(p => p.id === productId);
    if (!product) {
      return { productId, quantity, available: false };
    }
    return {
      ...product,
      quantity,
      available: product.stock > 0,
    };
  });

  res.json({ items: result });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
