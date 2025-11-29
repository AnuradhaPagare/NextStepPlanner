import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import api from "../api/axios";

const PomodoroContext = createContext();

export const usePomodoro = () => {
  const context = useContext(PomodoroContext);
  if (!context) {
    throw new Error("usePomodoro must be used within a PomodoroProvider");
  }
  return context;
};

export const PomodoroProvider = ({ children }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState("work"); // 'work', 'short-break', 'long-break'
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [stats, setStats] = useState(null);
  const [pomodoroHistory, setPomodoroHistory] = useState([]);

  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreak: 5,
    longBreak: 15,
    autoStartBreaks: false,
    notifications: true,
  });

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  // Load initial data
  useEffect(() => {
    // Only load settings from localStorage initially
    loadSettings();

    // Load API data after a delay to avoid blocking initialization
    const timeoutId = setTimeout(() => {
      loadSessions();
      loadStats();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  // Update time when session type or settings change
  useEffect(() => {
    if (!isRunning && !activeSessionId) {
      const duration = getDuration(sessionType);
      setTimeLeft(duration * 60);
    }
  }, [sessionType, settings, isRunning, activeSessionId]);

  const getDuration = (type) => {
    switch (type) {
      case "work":
        return settings.workDuration;
      case "short-break":
        return settings.shortBreak;
      case "long-break":
        return settings.longBreak;
      default:
        return settings.workDuration;
    }
  };

  const loadSessions = async () => {
    try {
      const response = await api.get("/pomodoro/sessions");
      setSessions(response.data);
      setPomodoroHistory(response.data);
    } catch (error) {
      console.error("Error loading sessions:", error);
      // Fallback to localStorage for offline functionality
      const localSessions = JSON.parse(
        localStorage.getItem("pomodoroSessions") || "[]"
      );
      setSessions(localSessions);
      setPomodoroHistory(localSessions);
    }
  };

  const loadStats = async () => {
    try {
      const response = await api.get("/pomodoro/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
      // Calculate stats from local sessions
      const localSessions = JSON.parse(
        localStorage.getItem("pomodoroSessions") || "[]"
      );
      const calculatedStats = calculateStats(localSessions);
      setStats(calculatedStats);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("pomodoroSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const calculateStats = (sessionData) => {
    const today = new Date().toDateString();
    const thisWeek = getWeekStart(new Date());

    const todaySessions = sessionData.filter(
      (s) => new Date(s.startTime).toDateString() === today && s.completed
    );

    const weekSessions = sessionData.filter(
      (s) => new Date(s.startTime) >= thisWeek && s.completed
    );

    const totalSessions = sessionData.filter((s) => s.completed);

    return {
      today: {
        count: todaySessions.length,
        totalMinutes: todaySessions.reduce((acc, s) => acc + s.duration, 0),
      },
      week: {
        count: weekSessions.length,
        totalMinutes: weekSessions.reduce((acc, s) => acc + s.duration, 0),
      },
      total: {
        count: totalSessions.length,
        totalMinutes: totalSessions.reduce((acc, s) => acc + s.duration, 0),
      },
    };
  };

  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  };

  const startTimer = async () => {
    try {
      const response = await api.post("/pomodoro/sessions", {
        type: sessionType,
        duration: getDuration(sessionType),
      });
      setActiveSessionId(response.data._id);
      setIsRunning(true);
    } catch (error) {
      console.error("Error starting session:", error);
      // Fallback to local functionality
      const newSession = {
        _id: Date.now().toString(),
        type: sessionType,
        duration: getDuration(sessionType),
        startTime: new Date().toISOString(),
        completed: false,
      };
      setActiveSessionId(newSession._id);
      setIsRunning(true);

      // Save to localStorage
      const localSessions = JSON.parse(
        localStorage.getItem("pomodoroSessions") || "[]"
      );
      localSessions.unshift(newSession);
      localStorage.setItem("pomodoroSessions", JSON.stringify(localSessions));
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const stopTimer = async () => {
    try {
      if (activeSessionId) {
        await api.patch(`/pomodoro/sessions/${activeSessionId}`, {
          completed: false,
          endTime: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error stopping session:", error);
      // Update localStorage
      const localSessions = JSON.parse(
        localStorage.getItem("pomodoroSessions") || "[]"
      );
      const sessionIndex = localSessions.findIndex(
        (s) => s._id === activeSessionId
      );
      if (sessionIndex !== -1) {
        localSessions[sessionIndex].completed = false;
        localSessions[sessionIndex].endTime = new Date().toISOString();
        localStorage.setItem("pomodoroSessions", JSON.stringify(localSessions));
      }
    }

    setIsRunning(false);
    setActiveSessionId(null);
    setTimeLeft(getDuration(sessionType) * 60);
    await loadSessions();
    await loadStats();
  };

  const handleSessionComplete = async () => {
    try {
      if (activeSessionId) {
        await api.patch(`/pomodoro/sessions/${activeSessionId}`, {
          completed: true,
          endTime: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error completing session:", error);
      // Update localStorage
      const localSessions = JSON.parse(
        localStorage.getItem("pomodoroSessions") || "[]"
      );
      const sessionIndex = localSessions.findIndex(
        (s) => s._id === activeSessionId
      );
      if (sessionIndex !== -1) {
        localSessions[sessionIndex].completed = true;
        localSessions[sessionIndex].endTime = new Date().toISOString();
        localStorage.setItem("pomodoroSessions", JSON.stringify(localSessions));
      }
    }

    setIsRunning(false);
    setActiveSessionId(null);

    // Play notification sound
    if (settings.notifications && audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.log("Audio play failed:", e));
    }

    // Auto-start break if enabled
    if (settings.autoStartBreaks) {
      if (sessionType === "work") {
        // Logic for determining short vs long break could go here
        setSessionType("short-break");
      } else {
        setSessionType("work");
      }
      setTimeout(startTimer, 1000);
    } else {
      // Suggest next session type
      if (sessionType === "work") {
        setSessionType("short-break");
      } else {
        setSessionType("work");
      }
      setTimeLeft(
        getDuration(sessionType === "work" ? "short-break" : "work") * 60
      );
    }

    await loadSessions();
    await loadStats();
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem("pomodoroSettings", JSON.stringify(newSettings));
  };

  const value = {
    timeLeft,
    isRunning,
    sessionType,
    sessions,
    activeSessionId,
    stats,
    pomodoroHistory,
    settings,
    startTimer,
    pauseTimer,
    stopTimer,
    setSessionType,
    updateSettings,
    getDuration,
  };

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  );
};

export default PomodoroContext;
