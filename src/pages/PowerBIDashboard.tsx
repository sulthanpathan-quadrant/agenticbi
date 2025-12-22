// // src/pages/PowerBIDashboard.tsx
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { FileSelectionStep } from "@/components/dashboard/FileSelectionStep";
// import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
// import { BarChart3, ArrowLeft } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";

// export default function PowerBIDashboard() {
//   const navigate = useNavigate();
//   const [previewData, setPreviewData] = useState<{ file: any; query: string } | null>(null);

//   // ──────── DASHBOARD PREVIEW MODE ────────
//   if (previewData) {
//     return (
//       <WorkflowLayout>
//         <DashboardPreview
//           file={previewData.file}
//           query={previewData.query}
//           // This goes back to FileSelectionStep inside this page
//           onBack={() => setPreviewData(null)}
//         />
//       </WorkflowLayout>
//     );
//   }

//   // ──────── FILE SELECTION + QUERY MODE ────────
//   return (
//     <WorkflowLayout>
//       <div className="min-h-screen bg-background">
//         {/* Main Header */}
//         <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
//           <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
//             <div className="flex items-center gap-5">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
//                 <BarChart3 className="w-8 h-8 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold tracking-tight">
//                   Power BI Dashboard 
//                 </h1>
//                 {/* <p className="text-muted-foreground">
//                   Select data → Ask anything → Get instant dashboard
//                 </p> */}
//               </div>
//             </div>

//             {/* This button leaves the entire Power BI page */}
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => navigate("/workflow/path-selection")}
//             >
//               <ArrowLeft className="w-4 h-4 mr-2" />
//               Back to Path Selection
//             </Button>
//           </div>
//         </div>

//         {/* File Selection + Insight Input */}
//         <FileSelectionStep
//           onGenerate={(file, query) => setPreviewData({ file, query })}
//         />
//       </div>
//     </WorkflowLayout>
//   );
// }


 
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { FileSelectionStep } from "@/components/dashboard/FileSelectionStep";
import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
 
export default function PowerBIDashboard() {
  const navigate = useNavigate();
 
  // State to manage preview mode
  const [previewState, setPreviewState] = useState<{
    filePath: string;
    query: string;
    apiResponse: any;
  } | null>(null);
 
  // ──────── DASHBOARD PREVIEW MODE ────────
  if (previewState) {
    return (
      <WorkflowLayout>
        <DashboardPreview
          filePath={previewState.filePath}
          query={previewState.query}
          apiResponse={previewState.apiResponse}
          onBack={() => setPreviewState(null)}
        />
      </WorkflowLayout>
    );
  }
 
  // ──────── FILE SELECTION + QUERY MODE ────────
  return (
    <WorkflowLayout>
      <div className="min-h-screen bg-background">
        {/* Main Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Power BI Dashboard Generator
                </h1>
                <p className="text-muted-foreground mt-1">
                  Enter dataset path → Describe insights → Get instant dashboard
                </p>
              </div>
            </div>
 
            {/* Back to previous workflow step */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/workflow/path-selection")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Path Selection
            </Button>
          </div>
        </div>
 
        {/* File Path Input + Insight Query */}
        <FileSelectionStep
          onGenerate={(filePath: string, query: string, apiResponse: any) => {
            setPreviewState({
              filePath,
              query,
              apiResponse,
            });
          }}
        />
      </div>
    </WorkflowLayout>
  );
}
 
 