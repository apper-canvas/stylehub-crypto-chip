import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import ProductQuantity from "@/components/molecules/ProductQuantity";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const handleCheckout = () => {
    toast.success("Order placed successfully! Thank you for shopping with us.", {
      position: "top-center",
      autoClose: 3000,
    });
    clearCart();
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Empty
            title="Your cart is empty"
            description="Add some products to your cart to continue shopping"
            icon="ShoppingCart"
            actionText="Start Shopping"
            onAction={() => window.location.href = "/"}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-secondary">Shopping Cart</h1>
          <p className="text-gray-600">
            {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          {/* Cart Items */}
          <div className="divide-y divide-gray-200">
            {cartItems.map((item) => (
              <motion.div
                key={`${item.productId}-${item.size}-${item.color}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.productId}`}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg hover:opacity-80 transition-opacity duration-200"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/product/${item.productId}`}
                      className="text-lg font-medium text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600 mb-2">{item.brand}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <ProductQuantity
                      quantity={item.quantity}
                      onIncrease={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
                      onDecrease={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
                    />
                    
                    <div className="text-right min-w-[100px]">
                      <p className="text-lg font-semibold text-secondary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        ₹{item.price.toLocaleString()} each
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="border-t bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium text-secondary">
                Subtotal ({getTotalItems()} items)
              </span>
              <span className="text-2xl font-bold text-secondary">
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-green-600 font-medium">
                <ApperIcon name="Truck" className="w-5 h-5 inline mr-2" />
                Free Delivery
              </span>
              <button
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 font-medium transition-colors duration-200"
              >
                Clear Cart
              </button>
            </div>

            <div className="flex space-x-4">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
              <Button onClick={handleCheckout} className="flex-1">
                <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ApperIcon name="Truck" className="w-8 h-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-medium text-secondary mb-1">Free Delivery</h3>
            <p className="text-sm text-gray-600">On orders above ₹999</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ApperIcon name="RotateCcw" className="w-8 h-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-medium text-secondary mb-1">Easy Returns</h3>
            <p className="text-sm text-gray-600">30 days return policy</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <ApperIcon name="Shield" className="w-8 h-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-medium text-secondary mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;