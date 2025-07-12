import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Layout } from "@/components/layout";
import { DashboardPage } from "@/pages/dashboard-page";
import { LessonsPage } from "@/pages/lessons-page";
import { ProgressPage } from "@/pages/progress-page";
import { ReviewPage } from "@/pages/review-page";
import { WelcomePage } from "@/pages/welcome-page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <WelcomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "lessons",
        element: <LessonsPage />,
      },
      {
        path: "review",
        element: <ReviewPage />,
      },
      {
        path: "progress",
        element: <ProgressPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
