import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useWishlist } from "@/hooks/useWishlist";
import { productService } from "@/services/api/productService";
import ProductGrid from "@/components/organisms/ProductGrid";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWishlistProducts();
  }, [wishlistItems]);

  const loadWishlistProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (wishlistItems.length === 0) {
        setProducts([]);
        return;
      }

      const allProducts = await productService.getAll();
      const wishlistProducts = allProducts.filter(product => 
        wishlistItems.includes(product.Id)
      );
      
      setProducts(wishlistProducts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loading type="products" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Error message={error} onRetry={loadWishlistProducts} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary">My Wishlist</h1>
          <p className="text-gray-600">
            {products.length} {products.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {products.length === 0 ? (
          <Empty
            title="Your wishlist is empty"
            description="Save items you love by clicking the heart icon on any product"
            icon="Heart"
            actionText="Start Shopping"
            onAction={() => window.location.href = "/"}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProductGrid
              products={products}
              loading={false}
              error={null}
              emptyMessage="Your wishlist is empty"
              emptyDescription="Add some products to your wishlist to see them here"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;