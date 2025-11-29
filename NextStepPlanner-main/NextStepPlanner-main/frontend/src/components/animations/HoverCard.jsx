import { motion } from "framer-motion";

const HoverCard = ({
  children,
  scale = 1.02,
  className = "",
  whileHover,
  whileTap,
}) => {
  const defaultHover = {
    scale,
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  };

  const defaultTap = {
    scale: 0.98,
    transition: {
      duration: 0.1,
    },
  };

  return (
    <motion.div
      className={className}
      whileHover={whileHover || defaultHover}
      whileTap={whileTap || defaultTap}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default HoverCard;
