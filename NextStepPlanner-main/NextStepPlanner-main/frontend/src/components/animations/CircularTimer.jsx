import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const CircularTimer = ({
  timeRemaining,
  totalTime,
  isRunning = false,
  size = 120,
  strokeWidth = 8,
  className = "",
}) => {
  const [progress, setProgress] = useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
    setProgress(percentage);
  }, [timeRemaining, totalTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted opacity-20"
        />

        {/* Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-primary transition-colors duration-300"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* Pulse effect when running */}
        {isRunning && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius + 4}
            stroke="currentColor"
            strokeWidth={2}
            fill="transparent"
            className="text-primary opacity-30"
            animate={{
              r: [radius + 4, radius + 8, radius + 4],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-foreground">
            {formatTime(timeRemaining)}
          </div>
          <div className="text-xs text-muted-foreground">
            {Math.round(progress)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircularTimer;
