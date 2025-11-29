import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const DigitalTimer = ({
  timeRemaining,
  totalTime,
  isRunning = false,
  className = "",
}) => {
  const [displayTime, setDisplayTime] = useState("00:00");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mins = Math.floor(timeRemaining / 60);
    const secs = timeRemaining % 60;
    setDisplayTime(
      `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    );

    const percentage = ((totalTime - timeRemaining) / totalTime) * 100;
    setProgress(percentage);
  }, [timeRemaining, totalTime]);

  return (
    <div className={`relative p-6 ${className}`}>
      {/* Background */}
      <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted rounded-t-xl overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>

        {/* Digital Display */}
        <div className="text-center">
          {/* Time Display */}
          <motion.div
            className="text-4xl md:text-5xl font-mono font-bold text-foreground mb-2"
            animate={
              isRunning
                ? {
                    textShadow: [
                      "0 0 5px rgba(59, 130, 246, 0.5)",
                      "0 0 10px rgba(59, 130, 246, 0.8)",
                      "0 0 5px rgba(59, 130, 246, 0.5)",
                    ],
                  }
                : {}
            }
            transition={{
              duration: 2,
              repeat: isRunning ? Infinity : 0,
              ease: "easeInOut",
            }}
          >
            {displayTime}
          </motion.div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center space-x-2 mb-3">
            <motion.div
              className={`w-3 h-3 rounded-full ${
                isRunning ? "bg-green-500" : "bg-red-500"
              }`}
              animate={
                isRunning
                  ? {
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: isRunning ? Infinity : 0,
                ease: "easeInOut",
              }}
            />
            <span className="text-sm text-muted-foreground">
              {isRunning ? "Running" : "Paused"}
            </span>
          </div>

          {/* Progress Text */}
          <div className="text-sm text-muted-foreground">
            {Math.round(progress)}% Complete
          </div>

          {/* Session Info */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Total: {Math.floor(totalTime / 60)}:
              {(totalTime % 60).toString().padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalTimer;
