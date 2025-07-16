import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import FilterPill from "@/components/molecules/FilterPill";
import Button from "@/components/atoms/Button";

const FilterSidebar = ({ filters, onFiltersChange, isOpen, onClose }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);

  const brands = ["Zara", "H&M", "Levi's", "Nike", "Adidas", "Ralph Lauren", "The North Face", "Uniqlo"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "6", "7", "8", "9", "10", "11", "12"];
  const colors = ["Black", "White", "Gray", "Blue", "Red", "Green", "Pink", "Yellow", "Brown", "Purple"];

  useEffect(() => {
    if (filters) {
      setPriceRange(filters.priceRange || { min: 0, max: 10000 });
      setSelectedSizes(filters.sizes || []);
      setSelectedColors(filters.colors || []);
      setSelectedBrands(filters.brands || []);
    }
  }, [filters]);

  const handleApplyFilters = () => {
    const newFilters = {
      priceRange,
      sizes: selectedSizes,
      colors: selectedColors,
      brands: selectedBrands,
    };
    onFiltersChange(newFilters);
    onClose?.();
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: 10000 });
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    onFiltersChange({});
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium mb-3">Price Range</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                ₹{priceRange.min.toLocaleString()}
              </span>
              <span className="text-sm text-gray-600">
                ₹{priceRange.max.toLocaleString()}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer absolute top-0"
              />
            </div>
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-medium mb-3">Brands</h3>
          <div className="flex flex-wrap gap-2">
            {brands.map((brand) => (
              <FilterPill
                key={brand}
                label={brand}
                isActive={selectedBrands.includes(brand)}
                onClick={() => toggleBrand(brand)}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <h3 className="font-medium mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <FilterPill
                key={size}
                label={size}
                isActive={selectedSizes.includes(size)}
                onClick={() => toggleSize(size)}
              />
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <h3 className="font-medium mb-3">Colors</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <FilterPill
                key={color}
                label={color}
                isActive={selectedColors.includes(color)}
                onClick={() => toggleColor(color)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t space-y-2">
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={handleClearFilters} className="w-full">
          Clear All
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white border-r">
        {sidebarContent}
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 bg-black/50"
            onClick={onClose}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="w-80 h-full bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {sidebarContent}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FilterSidebar;