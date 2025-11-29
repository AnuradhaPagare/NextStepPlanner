import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Smile, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import MoodEntry from "./MoodEntry";
import MoodCalendar from "../../components/MoodCalendar";
import api from "../../api/axios";

export default function Mood() {
  const [showEntry, setShowEntry] = useState(false);
  const queryClient = useQueryClient();

  const { data: moodHistory = [] } = useQuery({
    queryKey: ["mood-history"],
    queryFn: async () => {
      const response = await api.get("/mood/history?limit=30");
      return response.data;
    },
  });

  const { data: moodStats } = useQuery({
    queryKey: ["mood-stats"],
    queryFn: async () => {
      const response = await api.get("/mood/stats");
      return response.data;
    },
  });

  const { data: todayMood } = useQuery({
    queryKey: ["today-mood"],
    queryFn: async () => {
      const response = await api.get("/mood/today");
      return response.data;
    },
  });

  const getMoodEmoji = (score) => {
    // Enhanced emoji mapping for better visual representation
    const emojiMap = {
      1: "😭", // Crying
      2: "�", // Sad
      3: "😔", // Pensive
      4: "😕", // Confused/Slightly disappointed
      5: "😐", // Neutral
      6: "🙂", // Slightly smiling
      7: "�", // Smiling
      8: "😄", // Happy
      9: "😁", // Grinning
      10: "🤩", // Star-struck/Amazing
    };
    return emojiMap[score] || "�";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mood Tracker</h1>
          <p className="text-muted-foreground mt-2">
            Track your daily mood and emotions with our enhanced calendar view
          </p>
        </div>
        {!todayMood && (
          <Button onClick={() => setShowEntry(true)}>
            <Smile className="mr-2 h-4 w-4" />
            Log Today's Mood
          </Button>
        )}
      </div>

      {/* Mood Entry Form */}
      {showEntry && (
        <Card>
          <CardHeader>
            <CardTitle>How are you feeling today?</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodEntry onClose={() => setShowEntry(false)} />
          </CardContent>
        </Card>
      )}

      {/* Enhanced Mood Calendar */}
      <MoodCalendar />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {todayMood ? `${todayMood.moodScore}/10` : "--"}
            </div>
            <p className="text-xs text-muted-foreground">Today's Mood</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {moodStats?.average || "--"}/10
            </div>
            <p className="text-xs text-muted-foreground">Average Mood</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {moodStats?.recentAverage || "--"}/10
            </div>
            <p className="text-xs text-muted-foreground">7-Day Average</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{moodStats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">Total Entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Mood */}
      {todayMood && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smile className="h-5 w-5" />
              <span>Today's Mood</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-6xl">
                {getMoodEmoji(todayMood.moodScore)}
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {todayMood.moodScore}/10
                </div>
                {todayMood.note && (
                  <p className="text-muted-foreground mt-2 italic">
                    "{todayMood.note}"
                  </p>
                )}
                <p className="text-sm text-muted-foreground mt-1">
                  Recorded at{" "}
                  {new Date(todayMood.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Recent Entries</span>
          </CardTitle>
          <CardDescription>Your latest mood check-ins</CardDescription>
        </CardHeader>
        <CardContent>
          {moodHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No mood entries yet.</p>
              <Button
                onClick={() => setShowEntry(true)}
                className="mt-4"
                variant="outline"
              >
                <Smile className="mr-2 h-4 w-4" />
                Record Your First Mood
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {moodHistory.slice(0, 10).map((mood) => (
                <div
                  key={mood._id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getMoodEmoji(mood.moodScore)}
                    </div>
                    <div>
                      <div className="font-medium">{mood.moodScore}/10</div>
                      {mood.note && (
                        <p className="text-sm text-muted-foreground italic">
                          "{mood.note}"
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(mood.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
