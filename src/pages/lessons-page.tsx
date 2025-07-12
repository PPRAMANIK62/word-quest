import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function LessonsPage() {
  const handleLessonAction = (lessonId: number, lessonTitle: string, action: "start" | "continue" | "review") => {
    const actionMessages = {
      start: `Starting "${lessonTitle}" lesson...`,
      continue: `Continuing "${lessonTitle}" lesson...`,
      review: `Reviewing "${lessonTitle}" lesson...`,
    };

    toast.info(actionMessages[action]);
    // Navigate to lesson (placeholder for now)
    setTimeout(() => {
      toast.success(`Lesson "${lessonTitle}" loaded successfully!`);
    }, 1000);
  };

  const lessons = [
    {
      id: 1,
      title: "Basic Greetings",
      description: "Learn how to say hello, goodbye, and introduce yourself",
      difficulty: "Beginner",
      progress: 100,
      completed: true,
      words: 15,
      icon: "👋",
    },
    {
      id: 2,
      title: "Numbers 1-20",
      description: "Master counting from one to twenty",
      difficulty: "Beginner",
      progress: 100,
      completed: true,
      words: 20,
      icon: "🔢",
    },
    {
      id: 3,
      title: "Food & Drinks",
      description: "Essential vocabulary for restaurants and grocery shopping",
      difficulty: "Beginner",
      progress: 75,
      completed: false,
      words: 25,
      icon: "🍽️",
    },
    {
      id: 4,
      title: "Family Members",
      description: "Learn to talk about your family and relationships",
      difficulty: "Beginner",
      progress: 0,
      completed: false,
      words: 18,
      icon: "👨‍👩‍👧‍👦",
    },
    {
      id: 5,
      title: "Colors & Shapes",
      description: "Describe objects using colors and basic shapes",
      difficulty: "Beginner",
      progress: 0,
      completed: false,
      words: 22,
      icon: "🎨",
    },
    {
      id: 6,
      title: "Time & Calendar",
      description: "Tell time, days of the week, and months",
      difficulty: "Intermediate",
      progress: 0,
      completed: false,
      words: 30,
      icon: "⏰",
      locked: true,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Lessons
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Choose a lesson to continue your learning journey
        </p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            Track your completion across all lessons
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-gray-500">3 of 6 lessons completed</span>
          </div>
          <Progress value={50} className="h-2" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map(lesson => (
          <Card
            key={lesson.id}
            className={`relative transition-all duration-200 ${
              lesson.locked
                ? "opacity-60 cursor-not-allowed"
                : "hover:shadow-lg hover:scale-105 cursor-pointer"
            }`}
          >
            {lesson.locked && (
              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="text-xs">
                  🔒 Locked
                </Badge>
              </div>
            )}

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="text-3xl mb-2">{lesson.icon}</div>
                <Badge className={getDifficultyColor(lesson.difficulty)}>
                  {lesson.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg">{lesson.title}</CardTitle>
              <CardDescription className="text-sm">
                {lesson.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {lesson.words}
                  {" "}
                  words
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {lesson.progress}
                  % complete
                </span>
              </div>

              <Progress value={lesson.progress} className="h-2" />

              <div className="pt-2">
                {lesson.completed
                  ? (
                      <Button
                        onClick={() => handleLessonAction(lesson.id, lesson.title, "review")}
                        variant="outline"
                        className="w-full"
                      >
                        ✅ Review Lesson
                      </Button>
                    )
                  : lesson.locked
                    ? (
                        <Button disabled className="w-full">
                          🔒 Complete previous lessons
                        </Button>
                      )
                    : lesson.progress > 0
                      ? (
                          <Button
                            onClick={() => handleLessonAction(lesson.id, lesson.title, "continue")}
                            className="w-full"
                          >
                            ▶️ Continue Lesson
                          </Button>
                        )
                      : (
                          <Button
                            onClick={() => handleLessonAction(lesson.id, lesson.title, "start")}
                            className="w-full"
                          >
                            🚀 Start Lesson
                          </Button>
                        )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">3</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">1</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-yellow-600">2</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-600">100</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
        </Card>
      </div>
    </div>
  );
}
