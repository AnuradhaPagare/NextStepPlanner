import { motion } from "framer-motion";
import { CheckCircle, Clock, Coffee, Pause } from "lucide-react";

const PomodoroSessionHistory = ({ sessions = [], className = "" }) => {
  const getSessionIcon = (session) => {
    if (session.completed) {
      return session.type === "work" ? (
        <CheckCircle className="w-4 h-4 text-green-500" />
      ) : (
        <Coffee className="w-4 h-4 text-blue-500" />
      );
    } else {
      return <Pause className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSessionColor = (session) => {
    if (!session.completed) return "bg-muted border-muted-foreground/20";

    switch (session.type) {
      case "work":
        return "bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700";
      case "short-break":
        return "bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700";
      case "long-break":
        return "bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "work":
        return "Work";
      case "short-break":
        return "Short Break";
      case "long-break":
        return "Long Break";
      default:
        return "Session";
    }
  };

  const formatDuration = (minutes) => {
    return `${minutes}m`;
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <h4 className="text-sm font-medium text-foreground mb-4">
        Today's Sessions
      </h4>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No sessions completed yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id || index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.3,
                ease: "easeOut",
              }}
              className={`relative p-3 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${getSessionColor(
                session
              )}`}
            >
              {/* Session Icon */}
              <div className="flex items-center justify-between mb-2">
                {getSessionIcon(session)}
                <span className="text-xs text-muted-foreground">
                  {formatDuration(session.duration)}
                </span>
              </div>

              {/* Session Type */}
              <div className="text-xs font-medium text-foreground mb-1">
                {getTypeLabel(session.type)}
              </div>

              {/* Time */}
              <div className="text-xs text-muted-foreground">
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Completion indicator */}
              {session.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background"
                />
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {sessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sessions.length * 0.1 + 0.3 }}
          className="mt-6 p-4 bg-muted/50 rounded-lg"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-foreground">
                {
                  sessions.filter((s) => s.completed && s.type === "work")
                    .length
                }
              </div>
              <div className="text-xs text-muted-foreground">Work Sessions</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {
                  sessions.filter(
                    (s) => s.completed && s.type.includes("break")
                  ).length
                }
              </div>
              <div className="text-xs text-muted-foreground">Breaks</div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">
                {sessions
                  .filter((s) => s.completed)
                  .reduce((acc, s) => acc + s.duration, 0)}
                m
              </div>
              <div className="text-xs text-muted-foreground">Total Time</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroSessionHistory;
