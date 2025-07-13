import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useLanguages, useRecentActivity, useUserProgress, useUserStats } from "@/lib/queries";

export function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const showLanguageSelection = !searchParams.get("lang");

  // Query hooks for real data
  const { data: languages, isLoading: languagesLoading } = useLanguages();
  const { data: userStats, isLoading: statsLoading } = useUserStats(user?.id);
  const { data: recentActivity, isLoading: activityLoading } = useRecentActivity(user?.id);

  // Get selected language from URL or use first available language
  const urlLanguage = searchParams.get("lang");
  const selectedLanguage = urlLanguage || (languages?.[0]?.code || languages?.[0]?.name.toLowerCase() || "");

  // Find the selected language ID from the database
  const selectedLanguageData = languages?.find((lang) => {
    if (urlLanguage) {
      // If language is from URL, match exactly
      return lang.code === urlLanguage || lang.name.toLowerCase() === urlLanguage;
    }
    else {
      // If no URL language, use the first available language
      return languages?.[0] ? lang.id === languages[0].id : false;
    }
  });
  const { data: userProgress, isLoading: progressLoading } = useUserProgress(
    user?.id,
    selectedLanguageData?.id,
  );

  // Auto-set default language if none is selected and languages are loaded
  useEffect(() => {
    if (!urlLanguage && languages && languages.length > 0 && !languagesLoading) {
      const newParams = new URLSearchParams(searchParams);
      // Use the first available language from database
      const defaultLanguage = languages[0];
      const langCode = defaultLanguage.code || defaultLanguage.name.toLowerCase();
      newParams.set("lang", langCode);
      setSearchParams(newParams, { replace: true });
    }
  }, [urlLanguage, languages, languagesLoading, searchParams, setSearchParams]);

  // Use real language data from database
  const config = selectedLanguageData
    ? {
        flag: selectedLanguageData.flag_emoji || "🌍",
        name: selectedLanguageData.name,
        color: "bg-blue-500",
      }
    : languagesLoading
      ? {
          flag: "⏳",
          name: "Loading...",
          color: "bg-gray-500",
        }
      : languages && languages.length > 0
        ? {
            flag: languages[0].flag_emoji || "🌍",
            name: languages[0].name,
            color: "bg-blue-500",
          }
        : {
            flag: "🌍",
            name: "No Languages",
            color: "bg-gray-500",
          };

  const handleLanguageSelect = (language: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lang", language);
    setSearchParams(newParams);
    const selectedLang = languages?.find(lang =>
      lang.code === language || lang.name.toLowerCase() === language,
    );
    const languageName = selectedLang?.name || language;
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
            {languagesLoading
              ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                  </div>
                )
              : languages && languages.length > 0
                ? (
                    <div className="grid md:grid-cols-2 gap-4">
                      {languages.map(language => (
                        <Button
                          key={language.id}
                          onClick={() => handleLanguageSelect(language.code)}
                          size="lg"
                          className="h-20 text-lg bg-blue-500 hover:bg-blue-600 flex flex-col gap-2"
                        >
                          <span className="text-2xl">{language.flag_emoji || "🌍"}</span>
                          <span>
                            Learn
                            {" "}
                            {language.name}
                          </span>
                        </Button>
                      ))}
                    </div>
                  )
                : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No languages available at the moment.</p>
                      <p className="text-sm">Please check back later or contact support.</p>
                    </div>
                  )}
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
        <Badge
          variant="secondary"
          className={`text-lg p-2 ${languagesLoading ? "animate-pulse" : ""}`}
        >
          <span className="mr-2">{config.flag}</span>
          <span>{config.name}</span>
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
            {statsLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold">
                    {userStats?.currentStreak || 0}
                    {" "}
                    days
                  </div>
                )}
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
            {statsLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold">{userStats?.totalPoints?.toLocaleString() || 0}</div>
                )}
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
            {statsLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold">{userStats?.vocabularyLearned || 0}</div>
                )}
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
            {statsLoading
              ? (
                  <div className="text-2xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-2xl font-bold">{userStats?.completedLessons || 0}</div>
                )}
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
          {progressLoading
            ? (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="animate-pulse">Loading...</span>
                    <span className="animate-pulse">--%</span>
                  </div>
                  <Progress value={0} className="h-2 animate-pulse" />
                </div>
              )
            : userProgress
              ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>
                        {userProgress.overallProgress}
                        %
                      </span>
                    </div>
                    <Progress value={userProgress.overallProgress} className="h-2" />
                  </div>
                )
              : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ready to start</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                )}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {progressLoading
              ? (
                  "Loading progress..."
                )
              : userProgress
                ? (
                    `${userProgress.completedLessons} of ${userProgress.totalLessons} lessons completed`
                  )
                : (
                    "Start your first lesson to begin tracking progress!"
                  )}
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
            {activityLoading
              ? (
                  // Loading skeleton
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                      </div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
                    </div>
                  ))
                )
              : recentActivity && recentActivity.length > 0
                ? (
                    recentActivity.map((activity) => {
                      const timeAgo = new Date(activity.timestamp).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      });

                      const colorClasses = {
                        green: "bg-green-500",
                        blue: "bg-blue-500",
                        purple: "bg-purple-500",
                        red: "bg-red-500",
                        yellow: "bg-yellow-500",
                      };

                      return (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${colorClasses[activity.color as keyof typeof colorClasses] || "bg-gray-500"}`}></div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                <span>{activity.icon}</span>
                                <span>{activity.title}</span>
                              </div>
                              {activity.subtitle && (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {activity.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{timeAgo}</span>
                        </div>
                      );
                    })
                  )
                : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>No recent activity yet.</p>
                      <p className="text-sm">Start learning to see your progress here!</p>
                    </div>
                  )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
