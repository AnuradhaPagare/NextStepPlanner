import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ButtonLoader } from "../../components/ui/Loader";
import api from "../../api/axios";

export default function QuickMoodEntry({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const addMoodMutation = useMutation({
    mutationFn: async (moodData) => {
      const response = await api.post("/mood", moodData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["today-mood"]);
      queryClient.invalidateQueries(["mood-stats"]);
      toast.success("Mood recorded successfully!");
      onClose();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record mood");
    },
  });

  const onSubmit = async (data) => {
    if (!selectedMood) {
      toast.error("Please select a mood score");
      return;
    }

    setLoading(true);
    try {
      await addMoodMutation.mutateAsync({
        moodScore: selectedMood,
        note: data.note || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const moodButtons = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          How are you feeling? (1 = awful, 10 = amazing)
        </label>
        <div className="grid grid-cols-5 gap-2">
          {moodButtons.map((mood) => (
            <Button
              key={mood}
              type="button"
              variant={selectedMood === mood ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedMood(mood)}
              className="aspect-square"
            >
              {mood}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <Input placeholder="Note (optional)" {...register("note")} />
      </div>

      <div className="flex space-x-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? <ButtonLoader text="Recording Mood..." /> : "Record Mood"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
