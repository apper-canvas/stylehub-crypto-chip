import { motion } from "framer-motion";
import ProductCard from "@/components/molecules/ProductCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const ProductGrid = ({ 
  products, 
  loading, 
  error, 
  onRetry, 
  emptyMessage = "No products found",
  emptyDescription = "Try adjusting your search or filters"
}) => {
  if (loading) {
    return <Loading type="products" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!products || products.length === 0) {
    return (
      <Empty
        title={emptyMessage}
        description={emptyDescription}
        icon="Package"
        actionText="Browse All Products"
        onAction={() => window.location.href = "/"}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {products.map((product, index) => (
        <motion.div
          key={product.Id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
        >
          <ProductCard product={product} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductGrid;