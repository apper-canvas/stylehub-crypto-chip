import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import Badge from "@/components/atoms/Badge";

const ProductCard = ({ product }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const discountPercentage = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.Id);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.sizes.length > 0) {
      addToCart(product, product.sizes[0]);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group relative"
    >
      <Link to={`/product/${product.Id}`}>
        <div className="card overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            
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
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistClick}
              className="absolute top-2 right-2 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all duration-200 hover:bg-white"
            >
              <ApperIcon 
                name={isInWishlist(product.Id) ? "Heart" : "Heart"} 
                className={`w-4 h-4 transition-colors duration-200 ${
                  isInWishlist(product.Id) 
                    ? "text-primary fill-current" 
                    : "text-gray-600 hover:text-primary"
                }`}
              />
            </motion.button>
            
            {/* Quick Add Button - Shows on Hover */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              onClick={handleQuickAdd}
              className="absolute bottom-2 left-2 right-2 btn-primary text-sm py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
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
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;