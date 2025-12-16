// import { ReactNode } from "react";
// import { WorkflowSidebar } from "./WorkflowSidebar";

// interface WorkflowLayoutProps {
//   children: ReactNode;
// }

// export function WorkflowLayout({ children }: WorkflowLayoutProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       <WorkflowSidebar />
//       <main className="ml-60 min-h-screen">
//         {children}
//       </main>
//     </div>
//   );
// }


import { ReactNode } from "react";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { useLocation } from "react-router-dom";

interface WorkflowLayoutProps {
  children: ReactNode;
}

export function WorkflowLayout({ children }: WorkflowLayoutProps) {
  const location = useLocation();

  // All routes where sidebar must NOT display
  const fullscreenRoutes = [
    "/workflow/etl-output",
    "/workflow/powerbi-dashboard",
    "/workflow/automl-dashboard",
  ];

  // Check if current route matches any fullscreen screen
  const hideSidebar = fullscreenRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar visible only when NOT in full-screen mode */}
      {!hideSidebar && <WorkflowSidebar />}

      {/* Main Content */}
      <main className={hideSidebar ? "w-full" : "ml-60 w-full"}>
        {children}
      </main>
    </div>
  );
}
