import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function ProgressPage() {
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "🎯",
      earned: true,
      earnedDate: "2024-01-15",
    },
    {
      id: 2,
      title: "Vocabulary Builder",
      description: "Learn 50 new words",
      icon: "📚",
      earned: true,
      earnedDate: "2024-01-20",
    },
    {
      id: 3,
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "🔥",
      earned: true,
      earnedDate: "2024-01-22",
    },
    {
      id: 4,
      title: "Century Club",
      description: "Learn 100 new words",
      icon: "💯",
      earned: false,
      progress: 89,
    },
    {
      id: 5,
      title: "Review Master",
      description: "Complete 50 review sessions",
      icon: "🎓",
      earned: false,
      progress: 23,
    },
    {
      id: 6,
      title: "Streak Legend",
      description: "Maintain a 30-day streak",
      icon: "⚡",
      earned: false,
      progress: 7,
    },
  ];

  const weeklyData = [
    { day: "Mon", lessons: 2, reviews: 1, points: 25 },
    { day: "Tue", lessons: 1, reviews: 2, points: 20 },
    { day: "Wed", lessons: 3, reviews: 1, points: 35 },
    { day: "Thu", lessons: 1, reviews: 3, points: 25 },
    { day: "Fri", lessons: 2, reviews: 2, points: 30 },
    { day: "Sat", lessons: 1, reviews: 1, points: 15 },
    { day: "Sun", lessons: 2, reviews: 2, points: 30 },
  ];

  const totalWeeklyPoints = weeklyData.reduce((sum, day) => sum + day.points, 0);

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
            <div className="text-3xl font-bold text-blue-600">1,250</div>
            <p className="text-xs text-gray-500">+180 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">7</div>
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
            <div className="text-3xl font-bold text-green-600">89</div>
            <p className="text-xs text-gray-500">11 to next milestone</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Lessons Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">12</div>
            <p className="text-xs text-gray-500">3 this week</p>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Beginner</h3>
                <p className="text-gray-600 dark:text-gray-400">Level 3</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              1,250 XP
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Intermediate</span>
              <span>1,250 / 2,000 XP</span>
            </div>
            <Progress value={62.5} className="h-3" />
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Earn 750 more XP to reach Intermediate level!
          </p>
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
            {weeklyData.map((day, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {day.day}
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3 space-y-1">
                  <div className="text-xs text-gray-500">Lessons: {day.lessons}</div>
                  <div className="text-xs text-gray-500">Reviews: {day.reviews}</div>
                  <div className="text-sm font-bold text-blue-600">{day.points} XP</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalWeeklyPoints} XP</div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.earned
                    ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                    : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`text-3xl ${achievement.earned ? "" : "grayscale opacity-50"}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1 space-y-2">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {achievement.description}
                    </p>
                    
                    {achievement.earned ? (
                      <Badge variant="secondary" className="text-xs">
                        ✅ Earned {achievement.earnedDate}
                      </Badge>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-1" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
