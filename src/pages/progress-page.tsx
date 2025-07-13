import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useUserBadgeProgress, useUserStats, useWeeklyActivity } from "@/lib/queries";

export function ProgressPage() {
  const { user } = useAuth();

  // Query hooks for real data
  const { data: userStats, isLoading: statsLoading } = useUserStats(user?.id);
  const { data: badgeProgress, isLoading: badgesLoading } = useUserBadgeProgress(user?.id);
  const { data: weeklyData, isLoading: weeklyLoading } = useWeeklyActivity(user?.id);

  const totalWeeklyPoints = weeklyData?.reduce((sum, day) => sum + day.points, 0) || 0;

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your Progress
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your learning journey and celebrate achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading
              ? (
                  <div className="text-3xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-3xl font-bold text-blue-600">{userStats?.totalPoints?.toLocaleString() || 0}</div>
                )}
            <p className="text-xs text-gray-500">
              +
              {totalWeeklyPoints}
              {" "}
              this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading
              ? (
                  <div className="text-3xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-3xl font-bold text-orange-600">{userStats?.currentStreak || 0}</div>
                )}
            <p className="text-xs text-gray-500">days in a row</p>
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
                  <div className="text-3xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-3xl font-bold text-green-600">{userStats?.vocabularyLearned || 0}</div>
                )}
            <p className="text-xs text-gray-500">
              {100 - (userStats?.vocabularyLearned || 0)}
              {" "}
              to next milestone
            </p>
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
                  <div className="text-3xl font-bold animate-pulse">--</div>
                )
              : (
                  <div className="text-3xl font-bold text-purple-600">{userStats?.completedLessons || 0}</div>
                )}
            <p className="text-xs text-gray-500">Keep learning!</p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Level Progress</CardTitle>
          <CardDescription>
            Your current level and progress to the next milestone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {statsLoading
            ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                      <div className="space-y-2">
                        <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="w-16 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                    <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                </div>
              )
            : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🌟</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">
                          {(userStats?.totalPoints || 0) < 1000
                            ? "Beginner"
                            : (userStats?.totalPoints || 0) < 5000 ? "Intermediate" : "Advanced"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          Level
                          {" "}
                          {Math.floor((userStats?.totalPoints || 0) / 500) + 1}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {userStats?.totalPoints?.toLocaleString() || 0}
                      {" "}
                      XP
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress to next level</span>
                      <span>
                        {userStats?.totalPoints || 0}
                        {" "}
                        /
                        {Math.ceil(((userStats?.totalPoints || 0) + 500) / 500) * 500}
                        {" "}
                        XP
                      </span>
                    </div>
                    <Progress
                      value={((userStats?.totalPoints || 0) % 500) / 500 * 100}
                      className="h-3"
                    />
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Earn
                    {" "}
                    {Math.ceil(((userStats?.totalPoints || 0) + 500) / 500) * 500 - (userStats?.totalPoints || 0)}
                    {" "}
                    more XP to reach the next level!
                  </p>
                </>
              )}
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle>This Week's Activity</CardTitle>
          <CardDescription>
            Your daily learning activity for the past 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4 mb-6">
            {weeklyLoading
              ? (
            // Loading skeleton
                  Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="text-center space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                      </div>
                    </div>
                  ))
                )
              : weeklyData && weeklyData.length > 0
                ? (
                    weeklyData.map((day, index) => (
                      <div key={index} className="text-center space-y-2">
                        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {day.day}
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                          <div className="text-xs text-gray-500">
                            Lessons:
                            {day.lessons}
                          </div>
                          <div className="text-xs text-gray-500">
                            Reviews:
                            {day.reviews}
                          </div>
                          <div className="text-sm font-bold text-blue-600">
                            {day.points}
                            {" "}
                            XP
                          </div>
                        </div>
                      </div>
                    ))
                  )
                : (
                    <div className="col-span-7 text-center text-gray-500 dark:text-gray-400 py-8">
                      No activity data available for the past week.
                      <br />
                      Start learning to see your progress here!
                    </div>
                  )}
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {totalWeeklyPoints}
              {" "}
              XP
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total this week</div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>
            Badges you've earned and goals to work towards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {badgesLoading
            ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="flex-1 space-y-2">
                          <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="w-1/2 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            : badgeProgress?.badges && badgeProgress.badges.length > 0
              ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {badgeProgress.badges.map(badge => (
                      <div
                        key={badge.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          badge.isEarned
                            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                            : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`text-3xl ${badge.isEarned ? "" : "grayscale opacity-50"}`}>
                            {badge.icon || "🏆"}
                          </div>
                          <div className="flex-1 space-y-2">
                            <h4 className="font-semibold">{badge.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {badge.description}
                            </p>

                            {badge.isEarned
                              ? (
                                  <Badge variant="secondary" className="text-xs">
                                    ✅ Earned
                                    {badge.earnedAt && ` ${new Date(badge.earnedAt).toLocaleDateString()}`}
                                  </Badge>
                                )
                              : (
                                  <Badge variant="outline" className="text-xs">
                                    🎯 In Progress
                                  </Badge>
                                )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No achievements available yet. Start learning to earn your first badges!
                    </p>
                  </div>
                )}

          {badgeProgress && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Achievement Progress</span>
                <span className="text-sm text-gray-500">
                  {badgeProgress.earnedBadges}
                  {" "}
                  of
                  {badgeProgress.totalBadges}
                  {" "}
                  earned
                </span>
              </div>
              <Progress value={badgeProgress.progressPercentage} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Study Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Study Insights</CardTitle>
          <CardDescription>
            Personalized tips based on your learning patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-xl">💡</span>
              <div>
                <h4 className="font-medium">Great consistency!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You've been studying every day this week. Keep up the excellent work!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-xl">📈</span>
              <div>
                <h4 className="font-medium">Review more often</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You have 12 words due for review. Regular reviews help with long-term retention.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <span className="text-xl">🎯</span>
              <div>
                <h4 className="font-medium">Almost there!</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're just 11 words away from the Century Club achievement. You can do it!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
