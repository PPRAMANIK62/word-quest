import { BookOpen, Home, RotateCcw, TrendingUp } from "lucide-react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { UserMenu } from "@/components/auth/user-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Layout() {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/";

  // Don't show navigation on welcome page
  if (isWelcomePage) {
    return <Outlet />;
  }

  const navItems = [
    {
      to: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      to: "/lessons",
      icon: BookOpen,
      label: "Lessons",
    },
    {
      to: "/review",
      icon: RotateCcw,
      label: "Review",
    },
    {
      to: "/progress",
      icon: TrendingUp,
      label: "Progress",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                WordQuest
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Theme Toggle and User Menu */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex flex-col items-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <ProtectedRoute>
          <Outlet />
        </ProtectedRoute>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                WordQuest - Learn languages with gamification
              </span>
            </div>

            <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/about" className="hover:text-gray-900 dark:hover:text-white">
                About
              </Link>
              <Link to="/help" className="hover:text-gray-900 dark:hover:text-white">
                Help
              </Link>
              <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
