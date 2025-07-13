import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/use-auth";
import { useLanguages, useLessons, useUserProfile } from "@/lib/queries";

export function LessonsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Query hooks for real data
  const { data: languages } = useLanguages();
  const { data: userProfile } = useUserProfile(user?.id);

  // Determine selected language: URL param > user profile > first available language
  const urlLanguage = searchParams.get("lang");
  const userSelectedLanguage = userProfile?.selected_language;
  const selectedLanguage = urlLanguage || userSelectedLanguage || languages?.[0]?.code || "";

  const selectedLanguageData = languages?.find(lang =>
    lang.code === selectedLanguage || lang.name.toLowerCase() === selectedLanguage,
  );

  const { data: lessons, isLoading: lessonsLoading, error: lessonsError } = useLessons(
    selectedLanguageData?.id,
    user?.id,
  );

  // Show error if lessons failed to load
  if (lessonsError) {
    console.error("Failed to load lessons:", lessonsError);
  }

  const handleLessonAction = (lessonId: string, lessonTitle: string, action: "start" | "continue" | "review") => {
    const actionMessages = {
      start: `Starting "${lessonTitle}" lesson...`,
      continue: `Continuing "${lessonTitle}" lesson...`,
      review: `Reviewing "${lessonTitle}" lesson...`,
    };

    toast.info(actionMessages[action]);
    // Navigate to lesson detail page
    navigate(`/lessons/${lessonId}`);
  };

  // Calculate stats from real data
  const completedLessons = lessons?.filter(lesson => lesson.isCompleted).length || 0;
  const totalLessons = lessons?.length || 0;
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalWords = lessons?.reduce((sum, lesson) => sum + (lesson.vocabularyCount || 0), 0) || 0;

  const getDifficultyInfo = (difficultyLevel: number | null) => {
    // Map difficulty level numbers to strings and colors
    if (difficultyLevel === null || difficultyLevel <= 1) {
      return {
        label: "Beginner",
        color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: "🌱",
      };
    }
    else if (difficultyLevel <= 3) {
      return {
        label: "Intermediate",
        color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: "⭐",
      };
    }
    else {
      return {
        label: "Advanced",
        color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: "🔥",
      };
    }
  };

  const getLessonIcon = (lesson: any) => {
    // Generate icon based on lesson title or use difficulty-based icon
    const title = lesson.title?.toLowerCase() || "";
    if (title.includes("greeting") || title.includes("hello"))
      return "👋";
    if (title.includes("number") || title.includes("count"))
      return "🔢";
    if (title.includes("food") || title.includes("drink"))
      return "🍽️";
    if (title.includes("family"))
      return "👨‍👩‍👧‍👦";
    if (title.includes("color"))
      return "🎨";
    if (title.includes("time") || title.includes("calendar"))
      return "⏰";

    // Fallback to difficulty-based icon
    return getDifficultyInfo(lesson.difficulty_level).icon;
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
          {lessonsLoading
            ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium animate-pulse">Loading...</span>
                    <span className="text-sm text-gray-500 animate-pulse">-- of -- lessons completed</span>
                  </div>
                  <Progress value={0} className="h-2 animate-pulse" />
                </div>
              )
            : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-500">
                      {completedLessons}
                      {" "}
                      of
                      {" "}
                      {totalLessons}
                      {" "}
                      lessons completed
                    </span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Beginner</span>
                    <span>Intermediate</span>
                    <span>Advanced</span>
                  </div>
                </>
              )}
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessonsLoading
          ? (
        // Loading skeleton
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </CardContent>
                </Card>
              ))
            )
          : lessons && lessons.length > 0
            ? (
                lessons.map((lesson, index) => {
                  const isLocked = index > 0 && !lessons[index - 1]?.isCompleted;
                  return (
                    <Card
                      key={lesson.id}
                      className={`relative transition-all duration-200 ${
                        isLocked
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:shadow-lg hover:scale-105 cursor-pointer"
                      }`}
                    >
                      {isLocked && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary" className="text-xs">
                            🔒 Locked
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="text-3xl mb-2">{getLessonIcon(lesson)}</div>
                          <Badge className={getDifficultyInfo(lesson.difficulty_level).color}>
                            {getDifficultyInfo(lesson.difficulty_level).label}
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
                            {lesson.vocabularyCount || 0}
                            {" "}
                            words
                          </span>
                          <span className="text-gray-600 dark:text-gray-400">
                            {lesson.progress || 0}
                            % complete
                          </span>
                        </div>

                        <Progress value={lesson.progress || 0} className="h-2" />

                        <div className="pt-2">
                          {lesson.isCompleted
                            ? (
                                <Button
                                  onClick={() => handleLessonAction(lesson.id, lesson.title, "review")}
                                  variant="outline"
                                  className="w-full"
                                >
                                  ✅ Review Lesson
                                </Button>
                              )
                            : isLocked
                              ? (
                                  <Button disabled className="w-full">
                                    🔒 Complete previous lessons
                                  </Button>
                                )
                              : (lesson.progress || 0) > 0
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
                  );
                })
              )
            : (
                <div className="col-span-full text-center py-12">
                  {lessonsError
                    ? (
                        <div className="space-y-2">
                          <p className="text-red-500 dark:text-red-400">
                            Failed to load lessons. Please try refreshing the page.
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Error:
                            {" "}
                            {lessonsError.message}
                          </p>
                        </div>
                      )
                    : !selectedLanguageData
                        ? (
                            <p className="text-gray-500 dark:text-gray-400">
                              Please select a language to view lessons.
                            </p>
                          )
                        : (
                            <p className="text-gray-500 dark:text-gray-400">
                              No lessons available for
                              {" "}
                              {selectedLanguageData.name}
                              .
                            </p>
                          )}
                </div>
              )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-green-600">
            {lessonsLoading ? "--" : completedLessons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-blue-600">
            {lessonsLoading ? "--" : lessons?.filter(lesson => (lesson.progress || 0) > 0 && !lesson.isCompleted).length || 0}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {lessonsLoading ? "--" : totalLessons - completedLessons}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
        </Card>
        <Card className="text-center p-4">
          <div className="text-2xl font-bold text-gray-600">
            {lessonsLoading ? "--" : totalWords}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Words</div>
        </Card>
      </div>
    </div>
  );
}
