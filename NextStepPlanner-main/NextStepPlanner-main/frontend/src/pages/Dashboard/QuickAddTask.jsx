import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ButtonLoader } from "../../components/ui/Loader";
import api from "../../api/axios";

export default function QuickAddTask({ onClose }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const addTaskMutation = useMutation({
    mutationFn: async (taskData) => {
      const response = await api.post("/tasks", taskData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task added successfully!");
      reset();
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add task");
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await addTaskMutation.mutateAsync({
        title: data.title,
        description: data.description || "",
        dueDate: data.dueDate || undefined,
        status: "pending",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Task title"
          {...register("title", {
            required: "Task title is required",
          })}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Description (optional)"
          {...register("description")}
        />
      </div>

      <div>
        <Input type="date" {...register("dueDate")} />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <ButtonLoader text="Adding Task..." /> : "Add Task"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
