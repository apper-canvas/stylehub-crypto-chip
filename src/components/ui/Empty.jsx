import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found", 
  description = "Try adjusting your search or filters",
  actionText = "Browse Products",
  onAction,
  icon = "Package"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="w-10 h-10 text-primary" />
      </div>
      
      <h3 className="text-xl font-semibold text-secondary mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <ApperIcon name="ArrowRight" className="w-4 h-4" />
          <span>{actionText}</span>
        </button>
      )}
    </motion.div>
  );
};

export default Empty;