import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const RevealOnScroll = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  distance = 50,
  className = "",
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true, // Only animate once when it comes into view
    amount: 0.1, // Trigger when 10% of the element is visible
  });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
      x:
        direction === "left" ? distance : direction === "right" ? -distance : 0,
      scale: direction === "scale" ? 0.8 : 1,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default RevealOnScroll;
