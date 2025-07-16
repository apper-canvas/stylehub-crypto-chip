import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem("stylehub-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stylehub-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, size, color = null) => {
    const existingItem = cartItems.find(
      item => item.productId === product.Id && item.size === size && item.color === color
    );

    if (existingItem) {
      setCartItems(prev => 
        prev.map(item => 
          item.productId === product.Id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const newItem = {
        productId: product.Id,
        name: product.name,
        brand: product.brand,
        price: product.discountPrice || product.price,
        image: product.images[0],
        size,
        color,
        quantity: 1
      };
      setCartItems(prev => [...prev, newItem]);
    }

    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.productId === productId && item.size === size && item.color === color)
      )
    );
    toast.info("Item removed from cart");
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.productId === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info("Cart cleared");
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return {
    cartItems,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };
};