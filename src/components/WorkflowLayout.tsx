// import { ReactNode } from "react";
// import { WorkflowSidebar } from "./WorkflowSidebar";
// import { useLocation } from "react-router-dom";

// interface WorkflowLayoutProps {
//   children: ReactNode;
// }

// export function WorkflowLayout({ children }: WorkflowLayoutProps) {
//   const location = useLocation();

//   // All routes where sidebar must NOT display
//   const fullscreenRoutes = [
//     "/workflow/etl-output",
//     "/workflow/powerbi-dashboard",
//     "/workflow/automl-dashboard",
//   ];

//   // Check if current route matches any fullscreen screen
//   const hideSidebar = fullscreenRoutes.includes(location.pathname);

//   return (
//     <div className="min-h-screen bg-background flex">
//       {/* Sidebar visible only when NOT in full-screen mode */}
//       {!hideSidebar && <WorkflowSidebar />}

//       {/* Main Content */}
//       <main className={hideSidebar ? "w-full" : "ml-60 w-full"}>
//         {children}
//       </main>
//     </div>
//   );
// }
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { WorkflowSidebar } from "./WorkflowSidebar";
import { WorkflowHeader } from "./WorkFlowHeader";

interface WorkflowLayoutProps {
  children: ReactNode;
}

export function WorkflowLayout({ children }: WorkflowLayoutProps) {
  const location = useLocation();

  const fullscreenRoutes = [
    "/workflow/etl-output",
    "/workflow/powerbi-dashboard",
    "/workflow/automl-dashboard",
  ];

  const hideSidebar = fullscreenRoutes.includes(location.pathname);

  return (
    <div className="h-screen bg-background overflow-hidden">
      
      {/* Sticky Header */}
      <WorkflowHeader />

      {/* Content BELOW header */}
      <div className="flex h-[calc(100vh-4rem)]">
        
        {!hideSidebar && <WorkflowSidebar />}

        {/* Scrollable page content */}
        <main
          className={`overflow-y-auto px-6  w-full ${
            hideSidebar ? "ml-0" : "ml-60"
          }`}
        >
          {children}
        </main>

      </div>
    </div>
  );
}
