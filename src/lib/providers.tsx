import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";

import { AuthProvider } from "./auth-provider";
import { queryClient } from "./query-client";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="system"
        />
        {/* Only show devtools in development */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools
            initialIsOpen={false}
            position="bottom-right"
          />
        )}
      </AuthProvider>
    </QueryClientProvider>
  );
}
