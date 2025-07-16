import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const ProductQuantity = ({ quantity, onIncrease, onDecrease, min = 1, max = 10 }) => {
  return (
    <div className="flex items-center space-x-3">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDecrease}
        disabled={quantity <= min}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
      >
        <ApperIcon name="Minus" className="w-4 h-4" />
      </motion.button>
      
      <span className="font-medium text-secondary min-w-[2rem] text-center">
        {quantity}
      </span>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onIncrease}
        disabled={quantity >= max}
        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-gray-100 flex items-center justify-center transition-colors duration-200"
      >
        <ApperIcon name="Plus" className="w-4 h-4" />
      </motion.button>
    </div>
  );
};

export default ProductQuantity;