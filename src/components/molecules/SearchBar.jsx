import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import { productService } from "@/services/api/productService";

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("stylehub-recent-searches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      const timeoutId = setTimeout(async () => {
        setIsLoading(true);
        try {
          const results = await productService.search(query);
          setSuggestions(results.slice(0, 5));
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("stylehub-recent-searches", JSON.stringify(updated));
      
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setQuery("");
      setIsOpen(false);
      onClose?.();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("stylehub-recent-searches");
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <ApperIcon 
          name="Search" 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <Input
          type="text"
          placeholder="Search for products, brands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-xl border mt-1 z-50 max-h-80 overflow-y-auto"
          >
            {isLoading && (
              <div className="p-4 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {query.length > 2 && suggestions.length > 0 && (
              <div className="border-b">
                <div className="px-4 py-2 text-sm font-medium text-gray-700">
                  Products
                </div>
                {suggestions.map((product) => (
                  <button
                    key={product.Id}
                    onClick={() => handleSearch(product.name)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.brand}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {query.length <= 2 && recentSearches.length > 0 && (
              <div>
                <div className="px-4 py-2 text-sm font-medium text-gray-700 flex items-center justify-between">
                  Recent Searches
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-primary hover:text-primary/80"
                  >
                    Clear All
                  </button>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                  >
                    <ApperIcon name="Clock" className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            )}

            {query.length > 2 && suggestions.length === 0 && !isLoading && (
              <div className="p-4 text-center text-gray-500">
                No products found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;