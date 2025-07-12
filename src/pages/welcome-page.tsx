import { Navigate } from "react-router-dom";

import { LoginButton } from "@/components/auth/login-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/hooks/use-auth";

export function WelcomePage() {
  const { isAuthenticated, loading } = useAuth();

  // Redirect to dashboard if already authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
            Welcome to
            {" "}
            <span className="text-blue-600 dark:text-blue-400">WordQuest</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Embark on your language learning adventure with gamified lessons,
            interactive exercises, and proven learning techniques.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">
                🎯 Gamified Learning
              </CardTitle>
              <CardDescription>
                Earn points, unlock badges, and maintain streaks as you progress
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">
                🧠 Smart Reviews
              </CardTitle>
              <CardDescription>
                Spaced repetition system helps you remember what you've learned
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-300 transition-colors">
            <CardHeader>
              <CardTitle className="text-purple-600 dark:text-purple-400">
                🗣️ Native Audio
              </CardTitle>
              <CardDescription>
                Learn pronunciation with native speaker audio recordings
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Authentication & Language Selection */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Get Started with WordQuest</CardTitle>
            <CardDescription>
              Sign in with Google to start your language learning journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Google Sign In */}
            <div className="flex justify-center">
              <LoginButton size="lg" className="w-full max-w-sm" />
            </div>

            {/* Language Preview */}
            <div className="space-y-4">
              <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-300">
                Available Languages
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇪🇸</div>
                  <h3 className="font-semibold text-red-600 dark:text-red-400">Spanish</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Learn conversational Spanish
                  </p>
                </div>
                <div className="p-4 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
                  <div className="text-2xl mb-2">🇩🇪</div>
                  <h3 className="font-semibold text-yellow-600 dark:text-yellow-400">German</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Master German basics
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Choose your language after signing in
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
