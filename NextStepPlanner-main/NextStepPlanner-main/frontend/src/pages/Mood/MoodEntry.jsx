import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ButtonLoader } from "../../components/ui/Loader";
import api from "../../api/axios";

export default function MoodEntry({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm();

  const addMoodMutation = useMutation({
    mutationFn: async (moodData) => {
      const response = await api.post("/mood", moodData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mood-history"]);
      queryClient.invalidateQueries(["mood-stats"]);
      queryClient.invalidateQueries(["today-mood"]);
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

  const moodEmojis = {
    1: "�", // Crying
    2: "�", // Sad
    3: "😔", // Pensive
    4: "😕", // Confused/Slightly disappointed
    5: "😐", // Neutral
    6: "🙂", // Slightly smiling
    7: "😊", // Smiling
    8: "😄", // Happy
    9: "😁", // Grinning
    10: "🤩", // Star-struck/Amazing
  };

  const moodLabels = {
    1: "Terrible",
    2: "Very Bad",
    3: "Bad",
    4: "Poor",
    5: "Okay",
    6: "Good",
    7: "Great",
    8: "Very Good",
    9: "Excellent",
    10: "Amazing",
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-4">
          How are you feeling today?
        </label>

        {/* Mood Scale */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((mood) => (
            <button
              key={mood}
              type="button"
              onClick={() => setSelectedMood(mood)}
              className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                selectedMood === mood
                  ? "border-primary bg-primary/10"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-2xl mb-1">{moodEmojis[mood]}</div>
              <div className="text-xs font-medium">{mood}</div>
              <div className="text-xs text-muted-foreground">
                {moodLabels[mood]}
              </div>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="text-center text-sm text-muted-foreground">
            Selected: {selectedMood}/10 - {moodLabels[selectedMood]}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Add a note (optional)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          rows={3}
          placeholder="What's contributing to your mood today?"
          {...register("note")}
        />
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
