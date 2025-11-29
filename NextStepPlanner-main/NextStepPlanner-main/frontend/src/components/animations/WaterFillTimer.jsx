import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const WaterFillTimer = ({
  timeRemaining,
  totalTime,
  isRunning = false,
  size = 120,
  className = "",
}) => {
  const [fillPercentage, setFillPercentage] = useState(0);

  useEffect(() => {
    const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
    setFillPercentage(percentage);
  }, [timeRemaining, totalTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Container Circle */}
      <div
        className="relative border-4 border-primary/20 rounded-full overflow-hidden bg-background"
        style={{ width: size, height: size }}
      >
        {/* Water Fill */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300"
          initial={{ height: "0%" }}
          animate={{
            height: `${fillPercentage}%`,
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />

        {/* Water Wave Effect */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-200 opacity-60"
          initial={{ height: "0%" }}
          animate={{
            height: `${Math.max(0, fillPercentage - 5)}%`,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
            repeat: isRunning ? Infinity : 0,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
        />

        {/* Border Circle */}
        <div
          className="absolute inset-0 border-4 border-primary rounded-full"
          style={{ width: size, height: size }}
        />

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-foreground drop-shadow-lg">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-xs text-muted-foreground drop-shadow-sm">
              {Math.round(fillPercentage)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterFillTimer;
