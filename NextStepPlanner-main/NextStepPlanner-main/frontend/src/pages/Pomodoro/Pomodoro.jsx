import React, { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Play,
  Pause,
  Square,
  Settings,
  Timer,
  Coffee,
  Clock,
  TrendingUp,
  Calendar,
  Target,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { usePomodoro } from "@/contexts/PomodoroContext";
import RevealOnScroll from "@/components/animations/RevealOnScroll";
import StaggerContainer from "@/components/animations/StaggerContainer";
import HoverCard from "@/components/animations/HoverCard";
import api from "@/api/axios";

const Pomodoro = () => {
  const {
    timeLeft,
    isRunning,
    sessionType,
    sessions,
    startTimer,
    pauseTimer,
    stopTimer,
    setSessionType,
    settings,
    updateSettings,
    stats,
    pomodoroHistory,
    activeSessionId,
  } = usePomodoro();

  // Timer style state
  const [timerStyle, setTimerStyle] = useState("classic");
  const [showSettings, setShowSettings] = useState(false);

  const queryClient = useQueryClient();

  // Fetch pomodoro sessions
  const { data: recentSessions = [] } = useQuery({
    queryKey: ["pomodoro-sessions"],
    queryFn: async () => {
      const response = await api.get("/pomodoro/sessions");
      return response.data;
    },
  });

  // Fetch pomodoro stats
  const { data: pomodoroStats } = useQuery({
    queryKey: ["pomodoro-stats"],
    queryFn: async () => {
      const response = await api.get("/pomodoro/stats");
      return response.data;
    },
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    startTimer();
    toast.success(
      `${sessionType === "work" ? "Work" : "Break"} session started!`
    );
  };

  const handlePause = () => {
    pauseTimer();
    toast("Session paused");
  };

  const handleStop = () => {
    stopTimer();
    toast("Session stopped");
  };

  const handleTypeChange = (type) => {
    if (!isRunning && !activeSessionId) {
      setSessionType(type);
    }
  };

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

  const getProgress = () => {
    const totalTime = getDuration(sessionType) * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionTypeInfo = (type) => {
    switch (type) {
      case "work":
        return { label: "Work Session", icon: Timer, color: "bg-red-500" };
      case "short-break":
        return { label: "Short Break", icon: Coffee, color: "bg-green-500" };
      case "long-break":
        return { label: "Long Break", icon: Clock, color: "bg-blue-500" };
      default:
        return { label: "Work Session", icon: Timer, color: "bg-red-500" };
    }
  };

  return (
    <div className="space-y-6">
      <RevealOnScroll direction="up" delay={0.1}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Pomodoro Timer
            </h1>
            <p className="text-muted-foreground mt-2">
              Boost your productivity with focused work sessions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </RevealOnScroll>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Session Card */}
          <RevealOnScroll direction="up" delay={0.2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        getSessionTypeInfo(sessionType).color
                      }`}
                    />
                    <CardTitle className="text-xl">
                      {getSessionTypeInfo(sessionType).label}
                    </CardTitle>
                  </div>
                  <Badge variant={isRunning ? "default" : "secondary"}>
                    {isRunning
                      ? "Running"
                      : activeSessionId
                      ? "Paused"
                      : "Ready"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="text-center space-y-4">
                  <div className="text-6xl font-mono font-bold text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <Progress value={getProgress()} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(getProgress())}% completed
                  </p>
                </div>

                {/* Session Type Selector */}
                <Tabs value={sessionType} onValueChange={handleTypeChange}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="work"
                      disabled={isRunning || activeSessionId}
                      className="flex items-center space-x-2"
                    >
                      <Timer className="h-4 w-4" />
                      <span>Work</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="short-break"
                      disabled={isRunning || activeSessionId}
                      className="flex items-center space-x-2"
                    >
                      <Coffee className="h-4 w-4" />
                      <span>Short Break</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="long-break"
                      disabled={isRunning || activeSessionId}
                      className="flex items-center space-x-2"
                    >
                      <Clock className="h-4 w-4" />
                      <span>Long Break</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* Control Buttons */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={isRunning ? handlePause : handleStart}
                    size="lg"
                    className="px-8"
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        {activeSessionId ? "Resume" : "Start"}
                      </>
                    )}
                  </Button>
                  {(isRunning || activeSessionId) && (
                    <Button
                      onClick={handleStop}
                      variant="outline"
                      size="lg"
                      className="px-8"
                    >
                      <Square className="mr-2 h-5 w-5" />
                      Stop
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </RevealOnScroll>

          {/* Stats Overview */}
          <RevealOnScroll direction="up" delay={0.3}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <HoverCard>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Today's Sessions
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pomodoroStats?.today?.count || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pomodoroStats?.today?.totalMinutes || 0} minutes focused
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>

              <HoverCard>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      This Week
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pomodoroStats?.week?.count || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(
                        (pomodoroStats?.week?.totalMinutes || 0) / 60
                      )}
                      h total
                    </p>
                  </CardContent>
                </Card>
              </HoverCard>

              <HoverCard>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Sessions
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {pomodoroStats?.total?.count || 0}
                    </div>
                    <p className="text-xs text-muted-foreground">All time</p>
                  </CardContent>
                </Card>
              </HoverCard>
            </div>
          </RevealOnScroll>
        </div>

        {/* Settings & History Sidebar */}
        <div className="space-y-6">
          {/* Settings Card */}
          {showSettings && (
            <RevealOnScroll direction="up" delay={0.4}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="mr-2 h-5 w-5" />
                    Timer Settings
                  </CardTitle>
                  <CardDescription>
                    Customize your pomodoro session durations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">
                        Work Duration
                      </label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[settings.workDuration]}
                          onValueChange={([value]) =>
                            updateSettings({ ...settings, workDuration: value })
                          }
                          max={60}
                          min={5}
                          step={5}
                          className="flex-1"
                          disabled={isRunning || activeSessionId}
                        />
                        <span className="text-sm w-12 text-muted-foreground">
                          {settings.workDuration}m
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Short Break</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[settings.shortBreak]}
                          onValueChange={([value]) =>
                            updateSettings({ ...settings, shortBreak: value })
                          }
                          max={15}
                          min={1}
                          step={1}
                          className="flex-1"
                          disabled={isRunning || activeSessionId}
                        />
                        <span className="text-sm w-12 text-muted-foreground">
                          {settings.shortBreak}m
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Long Break</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <Slider
                          value={[settings.longBreak]}
                          onValueChange={([value]) =>
                            updateSettings({ ...settings, longBreak: value })
                          }
                          max={60}
                          min={5}
                          step={5}
                          className="flex-1"
                          disabled={isRunning || activeSessionId}
                        />
                        <span className="text-sm w-12 text-muted-foreground">
                          {settings.longBreak}m
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Auto-start breaks
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Automatically start break sessions
                        </p>
                      </div>
                      <Switch
                        checked={settings.autoStartBreaks}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            autoStartBreaks: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium">
                          Notifications
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Sound alerts when sessions end
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications}
                        onCheckedChange={(checked) =>
                          updateSettings({
                            ...settings,
                            notifications: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </RevealOnScroll>
          )}

          {/* Recent Sessions */}
          <RevealOnScroll direction="up" delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Recent Sessions
                </CardTitle>
                <CardDescription>Your latest pomodoro sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Timer className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      No sessions yet. Start your first pomodoro!
                    </p>
                  </div>
                ) : (
                  <StaggerContainer className="space-y-3">
                    {recentSessions.slice(0, 5).map((session, index) => {
                      const sessionInfo = getSessionTypeInfo(session.type);
                      return (
                        <HoverCard key={session._id || index}>
                          <div className="flex items-center space-x-3 p-3 border rounded-lg bg-background">
                            <div
                              className={`w-2 h-2 rounded-full ${sessionInfo.color}`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {sessionInfo.label}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  session.startTime
                                ).toLocaleDateString()}{" "}
                                at{" "}
                                {new Date(
                                  session.startTime
                                ).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="flex flex-col items-end">
                              <Badge
                                variant={
                                  session.completed ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {session.completed ? "Completed" : "Stopped"}
                              </Badge>
                              <span className="text-xs text-muted-foreground mt-1">
                                {session.duration}m
                              </span>
                            </div>
                          </div>
                        </HoverCard>
                      );
                    })}
                  </StaggerContainer>
                )}
              </CardContent>
            </Card>
          </RevealOnScroll>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
