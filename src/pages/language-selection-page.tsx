import { CheckCircle, Globe, Loader2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { useLanguages, useUpdateSelectedLanguage, useUserProfile } from "@/lib/queries";

export function LanguageSelectionPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");

  // Fetch available languages
  const { data: languages, isLoading: languagesLoading } = useLanguages();

  // Get user profile to check if they already have a language selected
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(user?.id);

  // Mutation for updating selected language
  const updateLanguage = useUpdateSelectedLanguage();

  // Redirect to welcome page if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Redirect to dashboard if user already has a language selected
  if (!profileLoading && userProfile?.selected_language) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLanguageSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleStartLearning = async () => {
    if (!selectedLanguage || !user)
      return;

    try {
      await updateLanguage.mutateAsync({
        userId: user.id,
        languageCode: selectedLanguage,
      });

      // Navigate to dashboard after successful language selection
      navigate("/dashboard");
    }
    catch (error) {
      console.error("Error saving language selection:", error);
    }
  };

  const isLoading = languagesLoading || profileLoading || updateLanguage.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <Globe className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Choose Your Language
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select the language you'd like to learn and start your WordQuest journey!
          </p>
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong>
              {" "}
              This is a one-time selection. Once you choose your language, you'll focus entirely on mastering it. Choose carefully!
            </p>
          </div>
        </div>

        {/* Language Selection Cards */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Available Languages</CardTitle>
            <CardDescription>
              Choose from our carefully crafted language courses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading
              ? (
                  // Loading skeleton
                  <div className="grid md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg animate-pulse">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                )
              : languages && languages.length > 0
                ? (
                    <div className="grid md:grid-cols-2 gap-6">
                      {languages.map(language => (
                        <div
                          key={language.id}
                          className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            selectedLanguage === language.code
                              ? "border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-400"
                              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                          }`}
                          onClick={() => handleLanguageSelect(language.code)}
                        >
                          {/* Selection indicator */}
                          {selectedLanguage === language.code && (
                            <div className="absolute top-4 right-4">
                              <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                          )}

                          {/* Language flag */}
                          <div className="text-6xl mb-4 text-center">
                            {language.flag_emoji || "🌍"}
                          </div>

                          {/* Language info */}
                          <div className="text-center space-y-2">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {language.name}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {language.native_name}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-500">
                              Learn
                              {" "}
                              {language.name}
                              {" "}
                              with interactive lessons and games
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>No languages available at the moment.</p>
                      <p className="text-sm">Please check back later!</p>
                    </div>
                  )}

            {/* Start Learning Button */}
            <div className="pt-6">
              <Button
                onClick={handleStartLearning}
                disabled={!selectedLanguage || updateLanguage.isPending}
                size="lg"
                className="w-full max-w-md mx-auto"
              >
                {updateLanguage.isPending
                  ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    )
                  : (
                      "Start Learning"
                    )}
              </Button>

              {selectedLanguage && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Ready to start your focused learning journey with
                  {" "}
                  {languages?.find(lang => lang.code === selectedLanguage)?.name}
                  !
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
