import { ChevronDown, Languages, LogOut } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

export function UserMenu() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentLanguage = searchParams.get("lang") || "spanish";

  const languages = {
    spanish: { flag: "🇪🇸", name: "Spanish" },
    german: { flag: "🇩🇪", name: "German" },
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
    }
    catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Failed to sign out. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (language: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("lang", language);
    setSearchParams(newParams);
    const languageName = languages[language as keyof typeof languages]?.name || language;
    toast.success(`Switched to ${languageName}!`);
  };

  if (!user) {
    return null;
  }

  // Get user initials
  const getInitials = () => {
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user.email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-10 px-3">
          {/* User Avatar with Language Indicator */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              {user.user_metadata?.avatar_url
                ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.full_name || user.email}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )
                : (
                    <span className="text-white font-medium text-sm">
                      {getInitials()}
                    </span>
                  )}
            </div>
            {/* Language Flag Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-xs border border-gray-200 dark:border-gray-600">
              {languages[currentLanguage as keyof typeof languages]?.flag}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.user_metadata?.full_name || user.email?.split("@")[0]}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Language
        </DropdownMenuLabel>

        {Object.entries(languages).map(([key, lang]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => handleLanguageChange(key)}
            className="cursor-pointer"
          >
            <Languages className="w-4 h-4 mr-2" />
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
            {currentLanguage === key && <span className="ml-auto text-xs">✓</span>}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading
            ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              )
            : (
                <LogOut className="w-4 h-4 mr-2" />
              )}
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
