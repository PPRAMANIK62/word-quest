import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const selectedLanguage = searchParams.get("lang") || "spanish";
  const showLanguageSelection = !searchParams.get("lang");

  // Auto-set default language if none is selected
  useEffect(() => {
    if (!searchParams.get("lang")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("lang", "spanish");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const languageConfig = {
    spanish: {
      flag: "🇪🇸",
      name: "Spanish",
      color: "bg-red-500",
    },
    german: {
      flag: "🇩🇪",
      name: "German",
      color: "bg-yellow-500",
    },
  };

  const config = languageConfig[selectedLanguage as keyof typeof languageConfig] || languageConfig.spanish;

  const handleLanguageSelect = (language: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lang", language);
    setSearchParams(newParams);
    const languageName = languageConfig[language as keyof typeof languageConfig]?.name || language;
    toast.success(`Great choice! You're now learning ${languageName}.`);
  };

  const handleStartLesson = () => {
    toast.info("Starting your next lesson...");
    navigate("/lessons");
  };

  const handleStartReview = () => {
    toast.info("Loading your review session...");
    navigate("/review");
  };

  const handleViewProgress = () => {
    toast.info("Loading your progress stats...");
    navigate("/progress");
  };

  // Show language selection if no language is selected
  if (showLanguageSelection || !selectedLanguage) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Welcome to WordQuest,
              {" "}
              {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
              !
            </CardTitle>
            <CardDescription>
              Choose your language to start your learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleLanguageSelect("spanish")}
                size="lg"
                className="h-20 text-lg bg-red-500 hover:bg-red-600 flex flex-col gap-2"
              >
                <span className="text-2xl">🇪🇸</span>
                <span>Learn Spanish</span>
              </Button>
              <Button
                onClick={() => handleLanguageSelect("german")}
                size="lg"
                className="h-20 text-lg bg-yellow-500 hover:bg-yellow-600 text-black flex flex-col gap-2"
              >
                <span className="text-2xl">🇩🇪</span>
                <span>Learn German</span>
              </Button>
            </div>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              You can change languages anytime from your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Continue your
            {" "}
            {config.name}
            {" "}
            learning journey
          </p>
        </div>
        <Badge variant="secondary" className="text-lg p-2">
          {config.flag}
          {" "}
          {config.name}
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-gray-500">🔥 Keep it up!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-gray-500">⭐ Great progress!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Words Learned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-gray-500">📚 Building vocabulary</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Lessons Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">🎯 On track!</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Current Progress</CardTitle>
          <CardDescription>
            Your learning journey in
            {" "}
            {config.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Beginner Level</span>
              <span>68%</span>
            </div>
            <Progress value={68} className="h-2" />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Complete 3 more lessons to reach Intermediate level!
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📖 Continue Learning
            </CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartLesson} className="w-full">
              Start Lesson
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔄 Review Words
            </CardTitle>
            <CardDescription>
              Practice with flashcards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleStartReview} variant="outline" className="w-full">
              Start Review
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 View Progress
            </CardTitle>
            <CardDescription>
              See detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleViewProgress} variant="outline" className="w-full">
              View Stats
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest learning sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium">Completed: Food & Drinks</span>
              </div>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Reviewed: Basic Greetings</span>
              </div>
              <span className="text-sm text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="font-medium">Earned: Vocabulary Master badge</span>
              </div>
              <span className="text-sm text-gray-500">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
