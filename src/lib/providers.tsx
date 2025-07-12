import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";

import { Toaster } from "@/components/ui/sonner";
import { env } from "@/env";

import { AuthProvider } from "./auth-provider";
import { queryClient } from "./query-client";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
          />
          {/* Only show devtools in development */}
          {env.VITE_APP_ENV === "development" && (
            <ReactQueryDevtools
              initialIsOpen={false}
              position="bottom"
            />
          )}
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
