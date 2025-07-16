import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import ProductGrid from "@/components/organisms/ProductGrid";
import FilterSidebar from "@/components/organisms/FilterSidebar";
import { productService } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";

const CategoryBrowse = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Customer Rating" },
    { value: "newest", label: "Newest First" },
  ];

  useEffect(() => {
    loadCategoryProducts();
  }, [category]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [products, filters, sortBy]);

  const loadCategoryProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productService.getByCategory(category);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...products];

    // Apply filters
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter(p => filters.brands.includes(p.brand));
    }

    if (filters.sizes && filters.sizes.length > 0) {
      filtered = filtered.filter(p => 
        filters.sizes.some(size => p.sizes.includes(size))
      );
    }

    if (filters.colors && filters.colors.length > 0) {
      filtered = filtered.filter(p => 
        filters.colors.some(color => p.colors.includes(color))
      );
    }

    if (filters.priceRange) {
      filtered = filtered.filter(p => {
        const price = p.discountPrice || p.price;
        return price >= filters.priceRange.min && price <= filters.priceRange.max;
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
        break;
      case "price-high":
        filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => b.Id - a.Id);
        break;
      default:
        // Featured - keep original order
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key] && (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                {categoryName}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg bg-white text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Filter Toggle - Mobile */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 border rounded-lg bg-white text-secondary hover:bg-gray-50 transition-colors duration-200"
              >
                <ApperIcon name="Filter" className="w-4 h-4" />
                <span>Filter</span>
                {hasActiveFilters && (
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={handleFiltersChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters */}
            {hasActiveFilters && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-white rounded-lg border"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-secondary">Active Filters</h3>
                  <button
                    onClick={() => setFilters({})}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {filters.brands && filters.brands.map(brand => (
                    <span
                      key={brand}
                      className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{brand}</span>
                      <button
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          brands: prev.brands.filter(b => b !== brand)
                        }))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.sizes && filters.sizes.map(size => (
                    <span
                      key={size}
                      className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{size}</span>
                      <button
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          sizes: prev.sizes.filter(s => s !== size)
                        }))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.colors && filters.colors.map(color => (
                    <span
                      key={color}
                      className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      <span>{color}</span>
                      <button
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          colors: prev.colors.filter(c => c !== color)
                        }))}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {filters.priceRange && (
                    <span className="inline-flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                      <span>₹{filters.priceRange.min} - ₹{filters.priceRange.max}</span>
                      <button
                        onClick={() => setFilters(prev => {
                          const { priceRange, ...rest } = prev;
                          return rest;
                        })}
                        className="hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <ApperIcon name="X" className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              </motion.div>
            )}

            {/* Products Grid */}
            <ProductGrid
              products={filteredProducts}
              loading={loading}
              error={error}
              onRetry={loadCategoryProducts}
              emptyMessage={`No ${categoryName.toLowerCase()} products found`}
              emptyDescription="Try adjusting your filters or browse other categories"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryBrowse;