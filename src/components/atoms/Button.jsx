import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    outline: "border-2 border-gray-300 hover:border-primary text-secondary hover:text-primary bg-white hover:bg-primary/5 transition-all duration-200",
  };

  const sizes = {
    sm: "py-2 px-4 text-sm",
    default: "py-3 px-6",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <button
      className={cn(
        "font-medium rounded-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;