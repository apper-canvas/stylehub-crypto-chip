import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = [
    {
      name: "Women",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop",
      path: "/category/women"
    },
    {
      name: "Men",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      path: "/category/men"
    },
    {
      name: "Kids",
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop",
      path: "/category/kids"
    },
    {
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      path: "/category/footwear"
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
      path: "/category/accessories"
    }
  ];

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [trending, newItems] = await Promise.all([
        productService.getTrending(8),
        productService.getNewArrivals(8)
      ]);
      
      setTrendingProducts(trending);
      setNewArrivals(newItems);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] bg-gradient-to-r from-primary/90 to-pink-500/90 flex items-center justify-center text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-pink-500/80" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
              Perfect Style
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Curated fashion for every occasion. Shop the latest trends and timeless classics.
          </p>
          <Link
            to="/category/women"
            className="inline-flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
          >
            <span>Shop Now</span>
            <ApperIcon name="ArrowRight" className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-secondary mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our carefully curated collections designed for every style and occasion.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -8 }}
              >
                <Link
                  to={category.path}
                  className="group block relative overflow-hidden rounded-lg"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Explore Collection
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-4">
                Trending Now
              </h2>
              <p className="text-gray-600">
                Discover what's popular this season
              </p>
            </div>
            <Link
              to="/category/women"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Link>
          </motion.div>

          <ProductGrid
            products={trendingProducts}
            loading={loading}
            error={error}
            onRetry={loadHomeData}
            emptyMessage="No trending products available"
            emptyDescription="Check back later for the latest trends"
          />
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-4">
                New Arrivals
              </h2>
              <p className="text-gray-600">
                Fresh styles just landed
              </p>
            </div>
            <Link
              to="/category/women"
              className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 font-medium"
            >
              <span>View All</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Link>
          </motion.div>

          <ProductGrid
            products={newArrivals}
            loading={loading}
            error={error}
            onRetry={loadHomeData}
            emptyMessage="No new arrivals available"
            emptyDescription="Check back soon for the latest additions"
          />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              Stay in the Loop
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Get the latest updates on new arrivals, exclusive offers, and fashion trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg text-secondary focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;