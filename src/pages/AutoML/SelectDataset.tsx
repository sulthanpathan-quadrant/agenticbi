// import { useEffect, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Loader2, FileText, ChevronRight, ArrowLeft } from "lucide-react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Header from "@/components/layout/Header";
 
// interface Dataset {
//   filename: string;
//   date_modified: string;
// }
 
// interface DatasetResponse {
//   user_id: string;
//   job_id: string;
//   datasets: Dataset[];
//   count: number;
//   folder: string;
// }
 
// const SelectDataset = () => {
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [folderPath, setFolderPath] = useState<string>("");
 
//   const [downloading, setDownloading] = useState(false);
//   const [previewData, setPreviewData] = useState<any>(null);
//   const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
 
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   const mode: "compare" | "build" =
//     (location.state as any)?.mode === "compare" ? "compare" : "build";
 
//   /* ---------------- Fetch datasets ---------------- */
//   useEffect(() => {
//     const fetchDatasets = async () => {
//       try {
//         const userRaw = localStorage.getItem("user");
 
//         // 🔥 SUPPORT BOTH STORAGE KEYS
//         const jobId =
//           localStorage.getItem("current_job_id");
 
//         if (!userRaw || !jobId) {
//           throw new Error("Missing user or job");
//         }
 
//         const user = JSON.parse(userRaw);
 
//         // 🔥 SAFE USER ID EXTRACTION
//         const userId = user.user_id || user.id;
 
//         if (!userId) {
//           throw new Error("User ID not found");
//         }
 
//         const res = await fetch(
//           `https://api.veriton.ai/api/service2/list-datasets?user_id=${userId}&job_id=${jobId}`,
//           { headers: { accept: "application/json" } }
//         );
 
//         if (!res.ok) {
//           throw new Error(`Failed to fetch datasets (${res.status})`);
//         }
 
//         const data: DatasetResponse = await res.json();
//         setDatasets(data.datasets || []);
//         setFolderPath(data.folder || "");
//       } catch (e: any) {
//         console.error("Dataset fetch error:", e);
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchDatasets();
//   }, []);
 
// const handleSelectDataset = async (filename: string) => {
//   try {
//     setDownloading(true);
//     setError(null);
//     setSelectedFilename(filename);
 
//     /* ---------------- 1️⃣ Download CSV ---------------- */
//     const fullPath = `${folderPath}/${filename}.csv`;
 
//     const downloadUrl = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/agenticBI/lakehouses/newagenticBI/download-veritas?path=${encodeURIComponent(
//       fullPath
//     )}`;
 
//     const res = await fetch(downloadUrl);
//     if (!res.ok) throw new Error("Download failed");
 
//     const blob = await res.blob();
 
//     const file = new File([blob], `${filename}.csv`, {
//       type: "text/csv",
//     });
 
//     setSelectedFile(file);
 
//     /* ---------------- 2️⃣ Prepare user data ---------------- */
//     const userRaw = localStorage.getItem("user");
//     const jobId = localStorage.getItem("current_job_id");
//     const emailRaw = localStorage.getItem("aivolve_user");
 
//     if (!userRaw || !jobId || !emailRaw) {
//       throw new Error("Missing user/job/email");
//     }
 
//     const user = JSON.parse(userRaw);
//     const userId = user.user_id || user.id;
 
//     const parsedEmailUser = JSON.parse(emailRaw);
//     const userEmail = parsedEmailUser.email;
 
//     if (!userEmail) throw new Error("User email not found");
 
//     /* ---------------- 3️⃣ Run PREVIEW and UPLOAD in parallel ---------------- */
 
//     const previewPromise = fetch(
//       `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${filename}`,
//       { headers: { accept: "application/json" } }
//     );
 
//     const uploadPromise = (async () => {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("upload_file_path", "true");
//       formData.append("task", "classification");
//       formData.append("target", "string");
//       formData.append("user_email", userEmail);
 
//       const uploadRes = await fetch(
//         "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/build_ml_model",
//         {
//           method: "POST",
//           body: formData,
//         }
//       );
 
//       if (!uploadRes.ok) throw new Error("Upload failed");
 
//       const uploadJson = await uploadRes.json();
 
//       if (!uploadJson.blob_path) {
//         throw new Error("Blob path not returned");
//       }
 
//       const blobPath = uploadJson.blob_path;
//       const analysisMetadata = uploadJson.analysis_metadata || null;
 
//       // 🔥 Fetch task_features immediately after upload
//       const targetsRes = await fetch(
//         `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/task_features?blob_path=${encodeURIComponent(
//           blobPath
//         )}&task=classification&user_email=${encodeURIComponent(userEmail)}`
//       );
 
//       if (!targetsRes.ok) throw new Error("Failed to fetch targets");
 
//       const targetsJson = await targetsRes.json();
 
//       return {
//         blobPath,
//         validTargets: targetsJson.features || [],
//         analysisMetadata,
//       };
//     })();
 
//     /* ---------------- 4️⃣ Wait for BOTH ---------------- */
 
//     const [previewRes, uploadResult] = await Promise.all([
//       previewPromise,
//       uploadPromise,
//     ]);
 
//     if (!previewRes.ok) throw new Error("Preview failed");
 
//     const preview = await previewRes.json();
 
//     /* ---------------- 5️⃣ Set EVERYTHING at once ---------------- */
 
//     setPreviewData({
//       columns: preview.columns,
//       rows: preview.preview_rows,
//       total_rows: preview.total_rows,
//       preview_rows: preview.preview_row_count,
//       blobPath: uploadResult.blobPath,
//       validTargets: uploadResult.validTargets,
//       analysisMetadata: uploadResult.analysisMetadata,
//     });
//   } catch (e: any) {
//     console.error("Dataset select error:", e);
//     setError(e.message);
//   } finally {
//     setDownloading(false);
//   }
// };
 
 
 
//   /* ---------------- Continue ---------------- */
//   const handleContinue = () => {
//     if (!selectedFile || !selectedFilename) return;
 
//     navigate(
//       mode === "compare"
//         ? "/workflow/automl/compare"
//         : "/workflow/automl/build-model",
//       {
//        state: {
//       dataset: {
//         file: selectedFile,
//         name: `${selectedFilename}.csv`,
//         blobPath: previewData.blobPath,
//         validTargets: previewData.validTargets,
//         analysisMetadata: previewData.analysisMetadata,
//           },
//         },
//       }
//     );
//   };
 
//   return (
//     <div className="min-h-screen bg-background">
//       <Header />
 
//       <main className="pt-20 px-10 pb-16 max-w-[1400px]">
//         <button
//           onClick={() => navigate("/workflow/automl")}
//           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Jobs
//         </button>
 
//         <h1 className="text-3xl font-semibold text-foreground mb-1">
//           Select Dataset
//         </h1>
//         <p className="text-muted-foreground text-base mb-8">
//           Choose a dataset to continue with{" "}
//           <span className="font-medium text-foreground">
//             {mode === "compare" ? "model comparison" : "model building"}
//           </span>
//         </p>
 
//         {loading && (
//           <div className="flex items-center gap-2 text-muted-foreground">
//             <Loader2 className="w-4 h-4 animate-spin" />
//             Loading datasets…
//           </div>
//         )}
 
//         {error && (
//           <div className="mb-6 text-sm text-destructive bg-destructive/10 border border-destructive/20 px-4 py-3 rounded-md">
//             {error}
//           </div>
//         )}
 
//         <div className="max-w-xl space-y-2">
//           {datasets.map((ds) => {
//             const isSelected = selectedFilename === ds.filename;
 
//             return (
//               <button
//                 key={ds.filename}
//                 onClick={() => handleSelectDataset(ds.filename)}
//                 disabled={downloading}
//                 className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-colors text-left
//                   ${
//                     isSelected
//                       ? "border-primary bg-primary/5"
//                       : "border-border bg-card hover:bg-muted/40"
//                   }`}
//               >
//                 <FileText
//                   className={`w-4 h-4 ${
//                     isSelected
//                       ? "text-primary"
//                       : "text-muted-foreground"
//                   }`}
//                 />
//                 <span className="text-base font-medium truncate">
//                   {ds.filename}
//                 </span>
 
//                 <div className="ml-auto flex items-center gap-2">
//                   {downloading && isSelected && (
//                     <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
//                   )}
//                   <ChevronRight className="w-4 h-4 text-muted-foreground" />
//                 </div>
//               </button>
//             );
//           })}
//         </div>
 
//         {previewData && (
//           <div className="mt-12 w-full">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <h2 className="text-xl font-semibold text-foreground">
//                   Dataset Preview
//                 </h2>
//                 <p className="text-muted-foreground text-sm">
//                   Showing {previewData.preview_rows} of{" "}
//                   {previewData.total_rows} rows
//                 </p>
//               </div>
 
//               <Button onClick={handleContinue}>Continue</Button>
//             </div>
 
//             <div className="border border-border rounded-xl bg-card">
//               <table className="w-full text-sm">
//                 <thead className="bg-muted">
//                   <tr>
//                     {previewData.columns.map((c: string) => (
//                       <th
//                         key={c}
//                         className="px-4 py-3 text-left font-semibold text-foreground border-b border-border"
//                       >
//                         {c}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-border">
//                   {previewData.rows.map((row: any, i: number) => (
//                     <tr key={i} className="hover:bg-muted/30">
//                       {previewData.columns.map((c: string) => (
//                         <td key={c} className="px-4 py-3">
//                           {row[c] ?? "-"}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };
 
// export default SelectDataset;
 
 import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import { prepareDataset } from "@/components/utils/preparedDataset"; // ← NEW: import shared utility
import { toast } from "sonner";
 
interface Dataset {
  filename: string;
  date_modified: string;
}
 
interface DatasetResponse {
  user_id: string;
  job_id: string;
  datasets: Dataset[];
  count: number;
  folder: string;
}
 
const SelectDataset = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<string>("");
  const [downloading, setDownloading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedFilename, setSelectedFilename] = useState<string | null>(null);
 
  const navigate = useNavigate();
  const location = useLocation();
 
  const mode: "compare" | "build" =
    (location.state as any)?.mode === "compare" ? "compare" : "build";
 
  /* ---------------- Fetch datasets ---------------- */
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const userRaw = localStorage.getItem("user");
        const jobId = localStorage.getItem("current_job_id");
 
        if (!userRaw || !jobId) {
          throw new Error("Missing user or job information");
        }
 
        const user = JSON.parse(userRaw);
        const userId = user.user_id || user.id;
 
        if (!userId) {
          throw new Error("User ID not found");
        }
 
        const res = await fetch(
          `https://api.veriton.ai/api/service2/list-datasets?user_id=${userId}&job_id=${jobId}`,
          { headers: { accept: "application/json" } }
        );
 
        if (!res.ok) {
          throw new Error(`Failed to fetch datasets (${res.status})`);
        }
 
        const data: DatasetResponse = await res.json();
        setDatasets(data.datasets || []);
        setFolderPath(data.folder || "Files"); // ← fallback to Files
      } catch (e: any) {
        console.error("Dataset fetch error:", e);
        setError(e.message || "Failed to load datasets");
        toast.error("Could not load dataset list");
      } finally {
        setLoading(false);
      }
    };
 
    fetchDatasets();
  }, []);
 
  /* ---------------- Select & Prepare Dataset ---------------- */
  const handleSelectDataset = async (filename: string) => {
    setDownloading(true);
    setError(null);
    setSelectedFilename(filename);
    setPreviewData(null);
 
    try {
      // Get required IDs
      const userRaw = localStorage.getItem("user");
      const jobId = localStorage.getItem("current_job_id");
      const user = userRaw ? JSON.parse(userRaw) : null;
      const userId = user?.user_id || user?.id;
 
      if (!userId || !jobId) {
        throw new Error("Missing user or job ID");
      }
 
      // Use shared prepareDataset utility
      const prepared = await prepareDataset(userId, jobId, filename, folderPath);
 
      if (!prepared) {
        throw new Error("Dataset preparation failed");
      }
 
      // Success: show preview and enable continue
      setPreviewData({
        columns: prepared.columns,
        rows: prepared.rows,
        total_rows: prepared.total_rows,
        preview_rows: prepared.preview_rows,
        blobPath: prepared.blobPath,
        validTargets: prepared.validTargets,
        analysisMetadata: prepared.analysisMetadata,
      });
 
      // Store the prepared file temporarily if needed (for continue)
      // You can also pass it directly in state on continue
      localStorage.setItem("temp_prepared_dataset", JSON.stringify({
        name: prepared.name,
        blobPath: prepared.blobPath,
        validTargets: prepared.validTargets,
        analysisMetadata: prepared.analysisMetadata,
        // Note: We don't store the File object – it's too big
      }));
 
    } catch (err: any) {
      console.error("Dataset preparation error:", err);
      setError(err.message || "Failed to prepare dataset");
      toast.error("Preparation failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };
 
  /* ---------------- Continue to Build/Compare ---------------- */
  const handleContinue = () => {
    if (!selectedFilename || !previewData) return;
 
    // Retrieve prepared data (you could also store File in state if small)
    const preparedInfo = {
      file: null, // File can't be stored easily – re-download if needed in next page
      name: `${selectedFilename}.csv`,
      blobPath: previewData.blobPath,
      validTargets: previewData.validTargets,
      analysisMetadata: previewData.analysisMetadata,
      columns: previewData.columns,
      rows: previewData.rows,
      total_rows: previewData.total_rows,
      preview_rows: previewData.preview_rows,
    };
 
    navigate(
      mode === "compare"
        ? "/workflow/automl/compare"
        : "/workflow/automl/build-model",
      {
        state: {
          dataset: preparedInfo,
        },
      }
    );
  };
 
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 px-10 pb-16 max-w-[1400px] mx-auto">
        <button
          onClick={() => navigate("/workflow/automl")}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>
 
        <h1 className="text-3xl font-semibold text-foreground mb-1">
          Select Dataset
        </h1>
        <p className="text-muted-foreground text-base mb-8">
          Choose a dataset to continue with{" "}
          <span className="font-medium text-foreground">
            {mode === "compare" ? "model comparison" : "model building"}
          </span>
        </p>
 
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground my-8">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading available datasets…
          </div>
        )}
 
        {error && (
          <div className="mb-8 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}
 
        {!loading && !error && datasets.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No datasets found in this job.
          </div>
        )}
 
        <div className="grid gap-3 max-w-2xl">
          {datasets.map((ds) => {
            const isSelected = selectedFilename === ds.filename;
            return (
              <button
                key={ds.filename}
                onClick={() => handleSelectDataset(ds.filename)}
                disabled={downloading}
                className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all text-left
                  ${isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"}
                  ${downloading ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex items-center gap-4">
                  <FileText className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <div className="font-medium">{ds.filename}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Modified: {ds.date_modified}
                    </div>
                  </div>
                </div>
 
                <div className="flex items-center gap-3">
                  {downloading && isSelected && (
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  )}
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            );
          })}
        </div>
 
        {previewData && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Preview: {selectedFilename}
                </h2>
                <p className="text-muted-foreground mt-1">
                  Showing {previewData.preview_rows} of {previewData.total_rows} rows
                </p>
              </div>
              <Button
                onClick={handleContinue}
                size="lg"
              >
                Continue to {mode === "compare" ? "Compare" : "Build"}
              </Button>
            </div>
 
            <div className="border border-border rounded-xl overflow-hidden bg-card shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      {previewData.columns.map((col: string) => (
                        <th
                          key={col}
                          className="px-6 py-4 text-left font-medium text-foreground border-b"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {previewData.rows.map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-muted/50 transition-colors">
                        {previewData.columns.map((col: string) => (
                          <td key={col} className="px-6 py-4">
                            {row[col] ?? "—"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
 
export default SelectDataset;
 