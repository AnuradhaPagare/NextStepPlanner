import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Calendar, Timer, Smile } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import QuickAddTask from "./QuickAddTask";
import QuickMoodEntry from "./QuickMoodEntry";
import RevealOnScroll from "../../components/animations/RevealOnScroll";
import StaggerContainer from "../../components/animations/StaggerContainer";
import HoverCard from "../../components/animations/HoverCard";
import api from "../../api/axios";

export default function Dashboard() {
  const { user } = useAuth();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showMoodEntry, setShowMoodEntry] = useState(false);

  // Fetch today's tasks
  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks");
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

  // Fetch mood stats
  const { data: moodStats } = useQuery({
    queryKey: ["mood-stats"],
    queryFn: async () => {
      const response = await api.get("/mood/stats");
      return response.data;
    },
  });

  // Fetch today's mood
  const { data: todayMood } = useQuery({
    queryKey: ["today-mood"],
    queryFn: async () => {
      const response = await api.get("/mood/today");
      return response.data;
    },
  });

  const todayTasks = tasks.filter((task) => {
    const today = new Date();
    const taskDate = new Date(task.dueDate);
    return taskDate.toDateString() === today.toDateString();
  });

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <RevealOnScroll direction="up" delay={0.1}>
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your productivity today.
          </p>
        </div>
      </RevealOnScroll>

      {/* Stats Cards */}
      <StaggerContainer
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        staggerDelay={0.1}
      >
        <HoverCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Today's Tasks
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayTasks.length}</div>
              <p className="text-xs text-muted-foreground">
                {pendingTasks.length} pending tasks total
              </p>
            </CardContent>
          </Card>
        </HoverCard>

        <HoverCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pomodoros Today
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
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
                Today's Mood
              </CardTitle>
              <Smile className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayMood?.moodScore || "--"}/10
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {moodStats?.average || "--"}/10
              </p>
            </CardContent>
          </Card>
        </HoverCard>

        <HoverCard>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Week Focus Time
              </CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((pomodoroStats?.thisWeek?.totalMinutes || 0) / 60)}h
              </div>
              <p className="text-xs text-muted-foreground">
                {pomodoroStats?.thisWeek?.count || 0} sessions this week
              </p>
            </CardContent>
          </Card>
        </HoverCard>
      </StaggerContainer>

      {/* Quick Actions */}
      <RevealOnScroll direction="up" delay={0.3}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Add Task */}
          <HoverCard scale={1.01}>
            <Card>
              <CardHeader>
                <CardTitle>Quick Add Task</CardTitle>
                <CardDescription>
                  Add a new task to your planner
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showQuickAdd ? (
                  <QuickAddTask onClose={() => setShowQuickAdd(false)} />
                ) : (
                  <Button
                    onClick={() => setShowQuickAdd(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Task
                  </Button>
                )}
              </CardContent>
            </Card>
          </HoverCard>

          {/* Quick Mood Entry */}
          <HoverCard scale={1.01}>
            <Card>
              <CardHeader>
                <CardTitle>Mood Check-in</CardTitle>
                <CardDescription>How are you feeling today?</CardDescription>
              </CardHeader>
              <CardContent>
                {todayMood ? (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {todayMood.moodScore}/10
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Mood recorded for today
                    </p>
                    {todayMood.note && (
                      <p className="text-sm mt-2 italic">"{todayMood.note}"</p>
                    )}
                  </div>
                ) : showMoodEntry ? (
                  <QuickMoodEntry onClose={() => setShowMoodEntry(false)} />
                ) : (
                  <Button
                    onClick={() => setShowMoodEntry(true)}
                    className="w-full"
                    variant="outline"
                  >
                    <Smile className="mr-2 h-4 w-4" />
                    Record Today's Mood
                  </Button>
                )}
              </CardContent>
            </Card>
          </HoverCard>
        </div>
      </RevealOnScroll>

      {/* Today's Tasks */}
      <RevealOnScroll direction="up" delay={0.5}>
        <HoverCard scale={1.005}>
          <Card>
            <CardHeader>
              <CardTitle>Today's Tasks</CardTitle>
              <CardDescription>Tasks due today</CardDescription>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No tasks due today. Great job staying on top of things!
                </p>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map((task) => (
                    <div
                      key={task._id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : task.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {task.status}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </HoverCard>
      </RevealOnScroll>
    </div>
  );
}
