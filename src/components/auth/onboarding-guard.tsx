import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { useUserProfile } from "@/lib/queries";

type OnboardingGuardProps = {
  children: React.ReactNode;
};

/**
 * OnboardingGuard component that ensures users complete the onboarding flow
 * before accessing protected pages. It checks if the user has selected a language
 * and redirects them to the language selection page if they haven't.
 */
export function OnboardingGuard({ children }: OnboardingGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const { data: userProfile, isLoading: profileLoading } = useUserProfile(user?.id);

  // Don't render anything while loading
  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to welcome page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Skip onboarding check for certain routes
  const skipOnboardingRoutes = [
    "/onboarding/language-selection",
    "/", // welcome page
  ];

  const shouldSkipOnboarding = skipOnboardingRoutes.includes(location.pathname,
  );

  // If user hasn't selected a language and we're not on a skip route, redirect to language selection
  if (!shouldSkipOnboarding && userProfile && !userProfile.selected_language) {
    return <Navigate to="/onboarding/language-selection" replace />;
  }

  // If user has selected a language and is on language selection page, redirect to dashboard
  if (location.pathname === "/onboarding/language-selection" && userProfile?.selected_language) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
