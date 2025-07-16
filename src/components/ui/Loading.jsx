import { motion } from "framer-motion";

const Loading = ({ type = "products" }) => {
  const renderProductSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="card p-0 overflow-hidden">
          <div className="aspect-[3/4] bg-gray-200 shimmer"></div>
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 shimmer"></div>
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 rounded w-20 shimmer"></div>
              <div className="h-4 bg-gray-200 rounded w-16 shimmer"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderProductDetailSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-4">
        <div className="aspect-square bg-gray-200 rounded-lg shimmer"></div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="aspect-square bg-gray-200 rounded shimmer"></div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded shimmer"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 shimmer"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6 shimmer"></div>
        </div>
        <div className="h-12 bg-gray-200 rounded shimmer"></div>
        <div className="h-12 bg-gray-200 rounded shimmer"></div>
      </div>
    </div>
  );

  const renderCartSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg">
          <div className="w-20 h-20 bg-gray-200 rounded shimmer"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded shimmer"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 shimmer"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 shimmer"></div>
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded shimmer"></div>
        </div>
      ))}
    </div>
  );

  const skeletonComponents = {
    products: renderProductSkeleton,
    productDetail: renderProductDetailSkeleton,
    cart: renderCartSkeleton,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="animate-pulse"
    >
      {skeletonComponents[type] ? skeletonComponents[type]() : renderProductSkeleton()}
    </motion.div>
  );
};

export default Loading;