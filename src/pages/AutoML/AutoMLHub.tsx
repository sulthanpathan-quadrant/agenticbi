// import { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import {
//   prepareDataset,
//   PreparedDataset,
// } from "@/components/utils/preparedDataset";
// import Header from "@/components/layout/Header";
 
// export default function AutoMLHub() {
//   const location = useLocation();
//   const navigate = useNavigate();
 
//   const [prepared, setPrepared] = useState<PreparedDataset | null>(null);
//   const [loading, setLoading] = useState(true);
 
//   useEffect(() => {
//     const prepareData = async () => {
//       // First, check if passed via state (fresh navigation)
//       let datasetFromState = location.state
//         ?.preparedDataset as PreparedDataset | null;
 
//       if (datasetFromState) {
//         setPrepared(datasetFromState);
//         setLoading(false);
//         return;
//       }
 
//       // Fallback: re-prepare using stored identifiers
//       const userId = localStorage.getItem("selected_user_id") || "";
//       const jobId = localStorage.getItem("selected_job_id") || "";
//       const datasetName = localStorage.getItem("selected_dataset_name") || "";
//       const folderPath = localStorage.getItem("selected_folder_path") || ""; // Optional if you store it
 
//       if (!userId || !jobId || !datasetName) {
//         toast.error("No dataset selected. Please go back to datasets.");
//         navigate("/datasets");
//         return;
//       }
 
//       try {
//         const toastId = toast.loading("Preparing dataset for AutoML...");
//         const preparedData = await prepareDataset(
//           userId,
//           jobId,
//           datasetName,
//           folderPath,
//         );
 
//         if (!preparedData) {
//           toast.error("Failed to prepare dataset", { id: toastId });
//           navigate("/datasets");
//           return;
//         }
 
//         toast.success("Dataset ready!", { id: toastId });
//         setPrepared(preparedData);
 
//         // Optional: store prepared blobPath etc. if needed for further persistence
//       } catch (err: any) {
//         console.error(err);
//         toast.error("Preparation failed: " + (err.message || "Unknown error"));
//         navigate("/datasets");
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     prepareData();
//   }, [location.state, navigate]);
 
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }
 
//   if (!prepared) {
//     return (
//       <div className="p-6 max-w-7xl mx-auto">
//         <h1 className="text-3xl font-bold mb-4">No Dataset Loaded</h1>
//         <p className="text-muted-foreground mb-6">
//           Please select a dataset from the datasets tab.
//         </p>
//         <Button onClick={() => navigate("/datasets")}>
//           Go Back to Datasets
//         </Button>
//       </div>
//     );
//   }
 
//   const { name, total_rows, columns, rows } = prepared;
 
//   return (
//     <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
//       {/* Veriton Header */}
//       <Header />
 
//       <div className="flex-1 flex flex-col overflow-auto">
//         <main className="px-6 py-6">
//           <div className="max-w-7xl mx-auto w-full">
//             {/* ================= PAGE HEADER ================= */}
 
//             <div className="mb-8 flex items-start justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold text-foreground">AutoML</h1>
 
//                 <p className="text-muted-foreground mt-1">
//                   Dataset:
//                   <span className="text-foreground font-medium ml-1">
//                     {name}
//                   </span>
//                   <span className="mx-2">•</span>
//                   {total_rows.toLocaleString()} rows
//                   <span className="mx-2">•</span>
//                   {columns.length} columns
//                 </p>
//               </div>
 
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => navigate("/datasets")}
//               >
//                 Back to Dataset
//               </Button>
//             </div>
 
//             {/* ================= DATASET CARD ================= */}
 
//             <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
//               {/* CARD HEADER */}
 
//               <div className="px-6 py-4 border-b flex items-center justify-between">
//                 <h2 className="text-lg font-semibold">Dataset Preview</h2>
 
//                 <div className="flex gap-2">
//                   <Button
//                     size="sm"
//                     onClick={() =>
//                       navigate("/workflow/automl/build-model", {
//                         state: { preparedDataset: prepared },
//                       })
//                     }
//                   >
//                     Build Model
//                   </Button>
 
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={() =>
//                       navigate("/workflow/automl/compare", {
//                         state: { preparedDataset: prepared },
//                       })
//                     }
//                   >
//                     Compare
//                   </Button>
//                 </div>
//               </div>
 
//               {/* TABLE */}
 
//               <div className="overflow-x-auto max-h-[500px]">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted">
//                       {columns.map((col) => (
//                         <TableHead key={col}>{col}</TableHead>
//                       ))}
//                     </TableRow>
//                   </TableHeader>
 
//                   <TableBody>
//                     {rows.slice(0, 20).map((row, i) => (
//                       <TableRow key={i} className="hover:bg-muted/40">
//                         {columns.map((col) => (
//                           <TableCell key={col}>{row[col] ?? "—"}</TableCell>
//                         ))}
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
 
//               {rows.length === 0 && (
//                 <div className="p-10 text-center text-muted-foreground">
//                   No preview available
//                 </div>
//               )}
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
 
 

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";

export default function AutoMLHub() {
  const location = useLocation();
  const navigate = useNavigate();

  const [previewPrepared, setPreviewPrepared] = useState<any>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadPreview = async () => {
      setIsLoadingPreview(true);
      setErrorMessage(null);

      // Rare case: data passed via navigation state
      if (location.state?.preparedDataset) {
        setPreviewPrepared(location.state.preparedDataset);
        setIsLoadingPreview(false);
        return;
      }

      const userId = localStorage.getItem("selected_user_id") || "";
      const jobId = localStorage.getItem("selected_job_id") || "";
      const datasetNameRaw = localStorage.getItem("selected_dataset_name") || "";

      if (!userId || !jobId || !datasetNameRaw) {
        setErrorMessage("No dataset selected. Redirecting to datasets...");
        toast.error("No dataset selected");
        setTimeout(() => navigate("/datasets"), 1800);
        return;
      }

      try {
        const toastId = toast.loading("Loading dataset preview...");

        const datasetName = datasetNameRaw.replace(/\.csv$/i, "");
        const previewUrl =
          `https://api.veriton.ai/api/service2/preview-dataset?` +
          `user_id=${userId}&job_id=${jobId}&datasetname=${encodeURIComponent(datasetName)}`;

        const res = await fetch(previewUrl);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Preview failed: ${res.status} - ${errorText}`);
        }

        const previewJson = await res.json();

        const previewData = {
          name: datasetNameRaw, // keep original name with extension if present
          total_rows: previewJson.total_rows || 0,
          columns: previewJson.columns || [],
          rows: previewJson.preview_rows || [],
          preview_rows:
            previewJson.preview_row_count ||
            previewJson.preview_rows?.length ||
            0,
        };

        setPreviewPrepared(previewData);
        toast.success("Preview loaded", { id: toastId });
      } catch (err: any) {
        console.error("Preview load failed:", err);
        const msg = err.message?.includes("404")
          ? "Dataset preview not found on server"
          : "Failed to load dataset preview";
        setErrorMessage(msg);
        toast.error(msg);
      } finally {
        setIsLoadingPreview(false);
      }
    };

    loadPreview();
  }, [location.state, navigate]);

  const proceedTo = (targetPath: string) => {
    const userId = localStorage.getItem("selected_user_id") || "";
    const jobId = localStorage.getItem("selected_job_id") || "";
    const datasetName =
      previewPrepared?.name ||
      localStorage.getItem("selected_dataset_name") ||
      "";

    if (!userId || !jobId || !datasetName) {
      toast.error("Missing dataset information");
      return;
    }

    let filename = datasetName;
    if (!filename.toLowerCase().endsWith(".csv")) {
      filename += ".csv";
    }

    const constructedFilePath = `Files/Datasets/${userId}/${jobId}/${filename}`;

    navigate(targetPath, {
      state: {
        filePath: constructedFilePath,
        datasetName: datasetName,
        origin: "automlhub",
      },
    });
  };

  const canProceed = !!previewPrepared && !isLoadingPreview && !errorMessage;

  // ────────────────────────────────────────────────
  // Render
  // ────────────────────────────────────────────────

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      <Header />

      <div className="flex-1 flex flex-col overflow-auto">
        <main className="px-6 py-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* Always visible header area */}
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">AutoML</h1>
                <p className="text-muted-foreground mt-1">
                  Dataset:{" "}
                  <span className="text-foreground font-medium ml-1">
                    {previewPrepared?.name ||
                      localStorage.getItem("selected_dataset_name") ||
                      "Loading..."}
                  </span>
                  {previewPrepared && (
                    <>
                      <span className="mx-2">•</span>
                      {previewPrepared.total_rows.toLocaleString()} rows
                      <span className="mx-2">•</span>
                      {previewPrepared.columns.length} columns
                    </>
                  )}
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/datasets")}
              >
                Back to Datasets
              </Button>
            </div>

            {/* Preview Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dataset Preview</h2>

                <div className="flex gap-3">
                  <Button
                    size="sm"
                    disabled={!canProceed}
                    onClick={() => proceedTo("/workflow/automl/build-model")}
                  >
                    {isLoadingPreview ? "Loading..." : "Build Model"}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!canProceed}
                    onClick={() => proceedTo("/workflow/automl/compare")}
                  >
                    {isLoadingPreview ? "Loading..." : "Compare"}
                  </Button>
                </div>
              </div>

              {/* Preview content area */}
              {errorMessage ? (
                <div className="p-10 text-center">
                  <p className="text-destructive text-lg mb-4">{errorMessage}</p>
                  <Button onClick={() => navigate("/datasets")}>
                    Return to Datasets
                  </Button>
                </div>
              ) : isLoadingPreview ? (
                <div className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-6">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-muted-foreground text-lg">
                    Loading dataset preview...
                  </p>
                </div>
              ) : !previewPrepared || previewPrepared.rows.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground min-h-[300px] flex flex-col items-center justify-center gap-4">
                  <p>No preview data available</p>
                  <Button variant="outline" onClick={() => navigate("/datasets")}>
                    Select another dataset
                  </Button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto max-h-[500px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted sticky top-0">
                          {previewPrepared.columns.map((col: string) => (
                            <TableHead key={col} className="font-medium">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {previewPrepared.rows.slice(0, 20).map((row: any, i: number) => (
                          <TableRow key={i} className="hover:bg-muted/40">
                            {previewPrepared.columns.map((col: string) => (
                              <TableCell key={col}>
                                {row[col] != null ? String(row[col]) : "—"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="px-6 py-3 border-t text-sm text-muted-foreground bg-muted/30">
                    Showing first {Math.min(20, previewPrepared.rows.length)} of{" "}
                    {previewPrepared.preview_rows || previewPrepared.total_rows} rows
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}