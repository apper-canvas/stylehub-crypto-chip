import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export const useWishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("stylehub-wishlist");
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stylehub-wishlist", JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (productId) => {
    if (!wishlistItems.includes(productId)) {
      setWishlistItems(prev => [...prev, productId]);
      toast.success("Added to wishlist!", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(id => id !== productId));
    toast.info("Removed from wishlist");
  };

  const toggleWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  return {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist
  };
};