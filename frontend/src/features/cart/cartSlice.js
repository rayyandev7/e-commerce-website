import { createSlice } from "@reduxjs/toolkit";

const cartFromStorage = (() => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
})();

const persist = (items) =>
  localStorage.setItem("cart", JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: cartFromStorage, // [{ productId, name, price, imageUrl, stock, quantity }]
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(
        (i) => i.productId === item.productId
      );
      if (existing) {
        existing.quantity = Math.min(
          existing.quantity + (item.quantity || 1),
          item.stock || existing.stock
        );
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
      persist(state.items);
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.stock));
      }
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (i) => i.productId !== action.payload
      );
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.quantity, 0);
export const selectCartTotal = (state) =>
  state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export default cartSlice.reducer;
