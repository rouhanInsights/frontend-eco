"use client"; // Ensure it's a client component

import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // State to open/close cart drawer

  // Add product to cart
  const addToCart = (product, selectedOption, quantity) => {
    const newItem = {
      id: `${product.id}-${selectedOption.label}`, // Unique ID for different options
      name: product.title,
      image: product.image,
      option: selectedOption.label,
      price: selectedOption.price,
      quantity,
    };
  
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === newItem.id);
  
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, newItem];
      }
    });
  
    setIsCartOpen(true); // Open cart sidebar
  };
  
  // Remove item from cart
  const removeFromCart = (id, option) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id || item.option !== option));
  };

  // Close Cart Drawer
  const closeCart = () => setIsCartOpen(false);
  
  const adjustQuantity = (id, option, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.option === option
          ? { ...item, quantity: Math.max(1, newQuantity) } // Prevent quantity from being less than 1
          : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isCartOpen, setIsCartOpen, closeCart, adjustQuantity}}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use cart context
export const useCart = () => useContext(CartContext);
