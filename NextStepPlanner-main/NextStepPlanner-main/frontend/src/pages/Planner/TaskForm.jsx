import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ButtonLoader } from "../../components/ui/Loader";
import api from "../../api/axios";

export default function TaskForm({ task, onClose }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || "",
          dueDate: task.dueDate
            ? new Date(task.dueDate).toISOString().split("T")[0]
            : "",
          status: task.status,
        }
      : {
          title: "",
          description: "",
          dueDate: "",
          status: "pending",
        },
  });

  const taskMutation = useMutation({
    mutationFn: async (taskData) => {
      if (task) {
        const response = await api.put(`/tasks/${task._id}`, taskData);
        return response.data;
      } else {
        const response = await api.post("/tasks", taskData);
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success(
        task ? "Task updated successfully!" : "Task created successfully!"
      );
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to save task");
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await taskMutation.mutateAsync({
        title: data.title,
        description: data.description || "",
        dueDate: data.dueDate || undefined,
        status: data.status,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Title *
        </label>
        <Input
          {...register("title", {
            required: "Task title is required",
          })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:text-black"
          rows={3}
          {...register("description")}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Due Date
        </label>
        <Input type="date" {...register("dueDate")} />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Status
        </label>
        <select
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:text-black"
          {...register("status")}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex space-x-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <ButtonLoader text="Saving..." />
          ) : task ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
