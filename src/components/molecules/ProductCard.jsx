import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ImageIcon, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

export default function ProductCard({ product, index = 0 }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  
const isWishlisted = isInWishlist(product.Id)
  const maxRetries = 2
  
  const handleAddToCart = () => {
    addToCart(product)
  }
  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.Id)
    } else {
      addToWishlist(product)
    }
  }

  const handleImageError = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      setImageError(false)
      // Trigger retry by changing the image src slightly
      setTimeout(() => {
        setImageLoaded(false)
      }, 100)
    } else {
      setImageError(true)
    }
  }

  const handleImageLoad = () => {
    setImageLoaded(true)
    setImageError(false)
  }

  const getImageSrc = () => {
    if (!product.images || product.images.length === 0) return null
    const baseUrl = product.images[0]
    // Add cache busting parameter on retry
    return retryCount > 0 ? `${baseUrl}&retry=${retryCount}` : baseUrl
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

const currentPrice = product.discountPrice || product.price
  const originalPrice = product.discountPrice ? product.price : null
  const imageSrc = getImageSrc()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.Id}`} className="block">
        <div className="card overflow-hidden">
<div className="relative aspect-[3/4] overflow-hidden">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gray-200 shimmer" />
            )}
            
            {imageSrc && !imageError ? (
              <img
                src={imageSrc}
                alt={product.name}
                className={cn(
                  "w-full h-full object-cover transition-all duration-300 group-hover:scale-105",
                  !imageLoaded && "opacity-0"
                )}
                onLoad={handleImageLoad}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Image not available</p>
                </div>
              </div>
            )}
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge 
                variant="primary" 
                className="absolute top-2 left-2 z-10"
              >
                {discountPercentage}% OFF
              </Badge>
            )}
            
            {/* Wishlist Button */}
            <motion.button
              onClick={handleWishlistToggle}
              className={cn(
                "absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200",
                isWishlisted ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart className={cn("w-5 h-5", isWishlisted && "fill-current")} />
            </motion.button>
            
            {/* Quick Add Button */}
            <motion.button
              onClick={handleAddToCart}
              className="absolute bottom-2 left-2 right-2 btn-primary text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Quick Add
            </motion.button>
          </div>
          <div className="p-4">
            <h3 className="font-medium text-secondary mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {product.discountPrice ? (
                  <>
                    <span className="font-semibold text-secondary">
                      ₹{product.discountPrice.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span className="font-semibold text-secondary">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <ApperIcon name="Star" className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviewCount})
                </span>
              </div>
            </div>
            
{/* Size indicators */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {product.sizes.slice(0, 4).map((size, index) => (
                  <span
                    key={size}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-xs text-gray-500">
                    +{product.sizes.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
</div>
      </Link>
    </motion.div>
  );
}