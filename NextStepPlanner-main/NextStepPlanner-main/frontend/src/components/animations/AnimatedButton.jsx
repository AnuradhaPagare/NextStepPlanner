import { motion } from "framer-motion";
import { Button } from "../ui/button";

const AnimatedButton = ({
  children,
  className = "",
  onClick,
  variant = "default",
  size = "default",
  disabled = false,
  ...props
}) => {
  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : {}}
      whileTap={!disabled ? "tap" : {}}
    >
      <Button
        className={className}
        onClick={onClick}
        variant={variant}
        size={size}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
