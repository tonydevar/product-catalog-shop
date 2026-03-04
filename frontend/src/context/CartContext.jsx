import React, { createContext, useContext, useReducer, useState, useEffect } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart';

function loadCart() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'addItem': {
      const existing = state.find(item => item.id === action.payload.id);
      if (existing) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: action.payload.quantity || 1 }];
    }
    case 'removeItem':
      return state.filter(item => item.id !== action.payload);
    case 'updateQuantity':
      return state
        .map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter(item => item.quantity > 0);
    case 'clearCart':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function openPanel() { setIsPanelOpen(true); }
  function closePanel() { setIsPanelOpen(false); }
  function togglePanel() { setIsPanelOpen(v => !v); }

  return (
    <CartContext.Provider value={{
      items,
      dispatch,
      cartCount,
      cartTotal,
      isPanelOpen,
      openPanel,
      closePanel,
      togglePanel,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
