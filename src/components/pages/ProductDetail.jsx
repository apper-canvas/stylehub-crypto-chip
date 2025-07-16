import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productData, relatedData] = await Promise.all([
        productService.getById(id),
        productService.getRelated(id, 4)
      ]);
      
      setProduct(productData);
      setRelatedProducts(relatedData);
      
      // Set default selections
      if (productData.sizes.length > 0) {
        setSelectedSize(productData.sizes[0]);
      }
      if (productData.colors.length > 0) {
        setSelectedColor(productData.colors[0]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert("Please select a size");
      return;
    }
    
    addToCart(product, selectedSize, selectedColor);
  };

  const discountPercentage = product?.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="productDetail" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadProduct} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-primary">
              Home
            </Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <Link 
              to={`/category/${product.category.toLowerCase()}`}
              className="text-gray-500 hover:text-primary"
            >
              {product.category}
            </Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-400" />
            <span className="text-secondary">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-white rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </motion.div>
            
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImage === index ? "border-primary" : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">{product.brand}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  {product.discountPrice ? (
                    <>
                      <span className="text-3xl font-bold text-secondary">
                        ₹{product.discountPrice.toLocaleString()}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-secondary">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <Badge variant="primary">
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Star" className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <ApperIcon name="Truck" className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">Free Delivery</span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors.length > 0 && (
              <div>
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all duration-200 ${
                        selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 hover:border-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors duration-200"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </button>
                <span className="font-medium text-lg w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors duration-200"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} className="flex-1">
                <ApperIcon name="ShoppingCart" className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="secondary"
                onClick={() => toggleWishlist(product.Id)}
                className="flex-shrink-0"
              >
                <ApperIcon 
                  name={isInWishlist(product.Id) ? "Heart" : "Heart"} 
                  className={`w-5 h-5 ${isInWishlist(product.Id) ? "fill-current" : ""}`}
                />
              </Button>
            </div>

            {/* Product Details */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-3">Product Details</h3>
              <div className="space-y-2 text-gray-600">
                <p>Category: {product.category}</p>
                <p>Brand: {product.brand}</p>
                <p>Available Colors: {product.colors.join(", ")}</p>
                <p>Available Sizes: {product.sizes.join(", ")}</p>
                <p>Product ID: {product.Id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-secondary mb-8">
              You might also like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.Id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;