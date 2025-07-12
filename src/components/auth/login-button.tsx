import { LogIn } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

type LoginButtonProps = {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
};

export function LoginButton({ className, size = "default", variant = "default" }: LoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    }
    catch (error) {
      console.error("Login failed:", error);
      toast.error("Login failed. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className={className}
      size={size}
      variant={variant}
    >
      {isLoading
        ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          )
        : (
            <>
              <LogIn className="w-4 h-4 mr-2" />
              Continue with Google
            </>
          )}
    </Button>
  );
}
