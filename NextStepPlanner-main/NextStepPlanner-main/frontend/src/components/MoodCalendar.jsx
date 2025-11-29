import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Plus, Smile } from "lucide-react";
import toast from "react-hot-toast";
import { ButtonLoader } from "./ui/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import api from "../api/axios";

export default function MoodCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const queryClient = useQueryClient();

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  // Fetch mood data for current month
  const { data: monthMoods = [] } = useQuery({
    queryKey: ["mood-month", currentYear, currentMonth],
    queryFn: async () => {
      const response = await api.get(
        `/mood/month/${currentYear}/${currentMonth}`
      );
      return response.data;
    },
  });

  const addMoodMutation = useMutation({
    mutationFn: async (moodData) => {
      const response = await api.post("/mood", moodData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["mood-month"]);
      queryClient.invalidateQueries(["mood-stats"]);
      queryClient.invalidateQueries(["today-mood"]);
      toast.success("Mood recorded successfully!");
      setShowMoodEntry(false);
      setSelectedDate(null);
      setSelectedMood(null);
      setNote("");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record mood");
    },
  });

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const existingMood = monthMoods.find(
      (mood) => new Date(mood.date).toDateString() === date.toDateString()
    );
    if (existingMood) {
      // Show existing mood details
      return;
    }
    setShowMoodEntry(true);
  };

  const handleSubmitMood = async () => {
    if (!selectedMood || !selectedDate) {
      toast.error("Please select a mood score");
      return;
    }

    await addMoodMutation.mutateAsync({
      moodScore: selectedMood,
      note: note || "",
      date: selectedDate.toISOString(),
    });
  };

  const getMoodColor = (score) => {
    if (score >= 9) return "bg-green-500 text-white"; // Excellent
    if (score >= 7) return "bg-green-400 text-white"; // Very good
    if (score >= 5) return "bg-yellow-400 text-black"; // Good/Neutral
    if (score >= 3) return "bg-orange-500 text-white"; // Low
    return "bg-red-500 text-white"; // Very low
  };

  const getMoodEmoji = (score) => {
    // More expressive emoji mapping for better visual representation
    const emojiMap = {
      1: "😭", // Crying
      2: "�", // Sad
      3: "😔", // Pensive
      4: "😕", // Confused/Slightly disappointed
      5: "😐", // Neutral
      6: "🙂", // Slightly smiling
      7: "😊", // Smiling
      8: "�", // Happy
      9: "😁", // Grinning
      10: "🤩", // Star-struck/Amazing
    };
    return emojiMap[score] || "�";
  };

  // Generate calendar grid
  const generateCalendarGrid = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const moodData = monthMoods.find(
        (mood) => new Date(mood.date).toDateString() === date.toDateString()
      );

      days.push({
        date,
        day,
        mood: moodData,
        isToday: date.toDateString() === new Date().toDateString(),
        isCurrentMonth: true,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarGrid();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const moodButtons = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Mood Calendar</CardTitle>
            <CardDescription>
              Track your daily mood and view patterns over time
            </CardDescription>
          </div>
          <Button onClick={handleTodayClick} variant="outline" size="sm">
            Today
          </Button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between pt-4">
          <Button onClick={handlePreviousMonth} variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <Button onClick={handleNextMonth} variant="outline" size="sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {/* Day headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground p-2"
            >
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {calendarDays.map((dayData, index) => (
            <div key={index} className="aspect-square relative">
              {dayData && (
                <div className="w-full h-full relative group">
                  <button
                    onClick={() => handleDateClick(dayData.date)}
                    className={`w-full h-full rounded-lg border-2 transition-all hover:scale-105 flex flex-col items-center justify-center text-sm font-medium relative ${
                      dayData.isToday
                        ? "border-primary border-4"
                        : "border-border hover:border-primary/50"
                    } ${
                      dayData.mood
                        ? `${getMoodColor(dayData.mood.moodScore)} shadow-md`
                        : "bg-background hover:bg-muted/50"
                    }`}
                  >
                    {/* Day number */}
                    <span
                      className={`text-xs font-bold ${
                        dayData.isToday
                          ? "text-primary"
                          : dayData.mood
                          ? "inherit"
                          : "text-foreground"
                      }`}
                    >
                      {dayData.day}
                    </span>

                    {/* Mood emoji - larger and centered */}
                    {dayData.mood && (
                      <div className="text-xl leading-none mt-1 drop-shadow-sm">
                        {getMoodEmoji(dayData.mood.moodScore)}
                      </div>
                    )}

                    {/* Add mood indicator for empty days */}
                    {!dayData.mood && (
                      <Plus className="h-4 w-4 opacity-0 group-hover:opacity-50 transition-opacity mt-1 text-muted-foreground" />
                    )}

                    {/* Today indicator */}
                    {dayData.isToday && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></div>
                    )}
                  </button>

                  {/* Enhanced hover tooltip */}
                  {dayData.mood && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 min-w-48 max-w-64">
                        <div className="text-center">
                          {/* Large emoji */}
                          <div className="text-3xl mb-2">
                            {getMoodEmoji(dayData.mood.moodScore)}
                          </div>

                          {/* Mood score */}
                          <div className="font-semibold text-foreground mb-1">
                            Mood: {dayData.mood.moodScore}/10
                          </div>

                          {/* Date */}
                          <div className="text-xs text-muted-foreground mb-2">
                            {dayData.date.toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>

                          {/* Note/Description */}
                          {dayData.mood.note && (
                            <div className="text-sm text-foreground italic border-t pt-2 mt-2">
                              "{dayData.mood.note}"
                            </div>
                          )}

                          {!dayData.mood.note && (
                            <div className="text-xs text-muted-foreground italic">
                              No description added
                            </div>
                          )}
                        </div>

                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="border-4 border-transparent border-t-border"></div>
                          <div className="border-4 border-transparent border-t-popover -mt-1"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tooltip for empty days */}
                  {!dayData.mood && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                      <div className="bg-popover border border-border rounded-lg shadow-lg p-2 whitespace-nowrap">
                        <div className="text-sm text-foreground">
                          Click to add mood for{" "}
                          {dayData.date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>

                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                          <div className="border-4 border-transparent border-t-border"></div>
                          <div className="border-4 border-transparent border-t-popover -mt-1"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Simple Legend */}
        <div className="border-t pt-4 space-y-3">
          <div className="text-center text-sm font-medium text-foreground mb-3">
            Mood Color Legend
          </div>

          {/* Color coding legend only */}
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <span>1-2 (Very Low)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>3-4 (Low)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <span>5-6 (Neutral)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <span>7-8 (Good)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span>9-10 (Excellent)</span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground pt-2">
            Click on any date to view mood details or add a new mood entry
          </div>
        </div>

        {/* Mood Entry Dialog */}
        <Dialog open={showMoodEntry} onOpenChange={setShowMoodEntry}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Mood</DialogTitle>
              <DialogDescription>
                How were you feeling on {selectedDate?.toLocaleDateString()}?
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-3">
                  How were you feeling? (Select your mood)
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {moodButtons.map((mood) => (
                    <Button
                      key={mood}
                      type="button"
                      variant={selectedMood === mood ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood)}
                      className="h-16 flex flex-col items-center justify-center space-y-1 relative"
                    >
                      <div className="text-lg">{getMoodEmoji(mood)}</div>
                      <div className="text-xs font-medium">{mood}</div>
                      {selectedMood === mood && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"></div>
                      )}
                    </Button>
                  ))}
                </div>

                {/* Show selected mood description */}
                {selectedMood && (
                  <div className="mt-3 p-3 bg-muted rounded-lg text-center">
                    <div className="text-2xl mb-2">
                      {getMoodEmoji(selectedMood)}
                    </div>
                    <div className="text-sm font-medium">
                      Selected: {selectedMood}/10
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Note (optional)
                </label>
                <Textarea
                  placeholder="What contributed to your mood today?"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={handleSubmitMood}
                  disabled={!selectedMood || addMoodMutation.isPending}
                  className="flex-1"
                >
                  {addMoodMutation.isPending ? (
                    <ButtonLoader text="Recording Mood..." />
                  ) : (
                    "Record Mood"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMoodEntry(false);
                    setSelectedDate(null);
                    setSelectedMood(null);
                    setNote("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
