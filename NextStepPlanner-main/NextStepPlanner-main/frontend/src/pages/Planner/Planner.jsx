import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SectionLoader } from "../../components/ui/Loader";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import TaskForm from "./TaskForm";
import RevealOnScroll from "../../components/animations/RevealOnScroll";
import StaggerContainer from "../../components/animations/StaggerContainer";
import HoverCard from "../../components/animations/HoverCard";
import api from "../../api/axios";

export default function Planner() {
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await api.get("/tasks");
      return response.data;
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      await api.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ taskId, status }) => {
      const response = await api.put(`/tasks/${taskId}`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task status updated!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update task");
    },
  });

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    return task.status === filter;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    updateTaskStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  if (isLoading) {
    return <SectionLoader text="Loading your tasks..." height="h-64" />;
  }

  return (
    <div className="space-y-6">
      <RevealOnScroll direction="up" delay={0.1}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Task Planner</h1>
            <p className="text-muted-foreground mt-2">
              Manage your tasks and stay organized
            </p>
          </div>
          <Button
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </RevealOnScroll>

      {/* Task Form Modal */}
      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingTask ? "Edit Task" : "Add New Task"}</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskForm
              task={editingTask}
              onClose={() => {
                setShowForm(false);
                setEditingTask(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Filter Buttons */}
      <div className="flex space-x-2">
        {["all", "pending", "in-progress", "completed"].map((status) => (
          <Button
            key={status}
            variant={filter === status ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(status)}
          >
            {status === "all"
              ? "All Tasks"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tasks.length}</div>
            <p className="text-xs text-muted-foreground">Total Tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {tasks.filter((t) => t.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === "in-progress").length}
            </div>
            <p className="text-xs text-muted-foreground">In Progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <RevealOnScroll direction="up" delay={0.4}>
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              {filteredTasks.length} {filter === "all" ? "" : filter} task(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No tasks found.</p>
                <Button
                  onClick={() => {
                    setEditingTask(null);
                    setShowForm(true);
                  }}
                  className="mt-4"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Task
                </Button>
              </div>
            ) : (
              <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                {filteredTasks.map((task) => (
                  <HoverCard key={task._id} scale={1.01}>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          {getStatusIcon(task.status)}
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            {task.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                              {task.dueDate && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Status change buttons */}
                        {task.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusChange(
                                task._id,
                                task.status === "pending"
                                  ? "in-progress"
                                  : "completed"
                              )
                            }
                          >
                            {task.status === "pending" ? "Start" : "Complete"}
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(task._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </HoverCard>
                ))}
              </StaggerContainer>
            )}
          </CardContent>
        </Card>
      </RevealOnScroll>
    </div>
  );
}
