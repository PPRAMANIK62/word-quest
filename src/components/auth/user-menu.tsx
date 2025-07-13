import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useLanguages, useUserProfile } from "@/lib/queries";

export function UserMenu() {
  const [isLoading, setIsLoading] = useState(false);
  const { user, signOut } = useAuth();

  // Get user profile and languages from database
  const { data: userProfile } = useUserProfile(user?.id);
  const { data: languages } = useLanguages();

  // Find the currently selected language for display purposes only
  const selectedLanguage = languages?.find(
    lang => lang.code === userProfile?.selected_language,
  );

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
        <Button variant="ghost" className="flex items-center gap-3 h-11 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          {/* User Avatar with Language Indicator */}
          <div className="relative">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={user.user_metadata?.avatar_url}
                alt={user.user_metadata?.full_name || user.email || "User"}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-sm font-semibold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            {/* Language Flag Indicator */}
            <div
              key={selectedLanguage?.code || "default"}
              className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white dark:bg-gray-900 flex items-center justify-center text-sm border-2 border-white dark:border-gray-900 shadow-sm"
            >
              {selectedLanguage?.flag_emoji || "🌍"}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
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
