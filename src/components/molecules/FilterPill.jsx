import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const FilterPill = ({ label, isActive, onClick, onRemove, showRemove = false }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`filter-pill inline-flex items-center space-x-2 ${
        isActive ? "active" : ""
      }`}
    >
      <span>{label}</span>
      {showRemove && isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors duration-200"
        >
          <ApperIcon name="X" className="w-3 h-3" />
        </button>
      )}
    </motion.button>
  );
};

export default FilterPill;