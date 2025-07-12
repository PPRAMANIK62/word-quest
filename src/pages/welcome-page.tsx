import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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

        {/* Language Selection */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Choose Your Language</CardTitle>
            <CardDescription>
              Start your journey with Spanish or German
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                asChild
                size="lg"
                className="h-16 text-lg bg-red-500 hover:bg-red-600"
              >
                <Link to="/dashboard?lang=spanish">
                  🇪🇸 Learn Spanish
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="h-16 text-lg bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Link to="/dashboard?lang=german">
                  🇩🇪 Learn German
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You can change languages anytime from your dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
