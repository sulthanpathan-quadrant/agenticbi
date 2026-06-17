// import { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Input } from "@/components/ui/input";
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
// import {
//   Search,
//   Calendar as CalendarIcon,
//   Eye,
//   Navigation,
//   X,
//   Database,
//   LogOut,
//   BarChart3,
//   GitBranch,
//   Table as TableIcon,
//   Loader2,
//   Sparkles,
// } from "lucide-react";
// import { format } from "date-fns";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
// } from "@/components/ui/dialog";
 
// interface Dataset {
//   id: string;
//   jobName: string;
//   datasetName: string;
//   lastRun: string;
//   completedAt: string;
//   rows: number;
//   columns: number;
//   filePath: string;
//   isScheduled: boolean;
//   job_id?: string; // Must come from /datasets API response
// }
 
// interface PreviewData {
//   dataset: string;
//   user_id: string;
//   job_id: string;
//   total_rows: number;
//   total_columns: number;
//   columns: string[];
//   column_types: Record<string, string>;
//   preview_rows: Record<string, any>[];
//   preview_row_count: number;
// }
 
// const DatasetTab = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   const [datasetSearch, setDatasetSearch] = useState("");
//   const [datasetDateFilter, setDatasetDateFilter] = useState<Date | undefined>();
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   const [loading, setLoading] = useState(true);
 
//   const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
//   const [previewData, setPreviewData] = useState<PreviewData | null>(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [previewError, setPreviewError] = useState<string | null>(null);
 
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const userName = user?.name || user?.email?.split("@")[0] || "User";
//   const userId = user?.id || user?.user_id;
 
//   const handleLogout = () => {
//      localStorage.clear();
//     // localStorage.removeItem("user");
//     // localStorage.removeItem("token");
//     toast.success("Logged out successfully");
//     navigate("/", { replace: true });
//   };
 
//   // Fetch datasets list
//   useEffect(() => {
//     if (!userId) {
//       toast.error("User not found. Please login again.");
//       setLoading(false);
//       return;
//     }
 
//     const fetchDatasets = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://api.veriton.ai/api/service2/datasets?user_id=${userId}`
//         );
 
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
 
//         const data = await response.json();
 
//         const mapped = data.map((item: any, index: number) => ({
//           id: String(index + 1),
//           jobName: item.job_name || "Unnamed Job",
//           datasetName: item.dataset_name || "Unnamed Dataset",
//           lastRun: item.completed_at
//             ? new Date(item.completed_at).toLocaleString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//               })
//             : "—",
//           completedAt: item.completed_at,
//           rows: item.rows || 0,
//           columns: item.columns_count || 0,
//           filePath: item.file_path || "",
//           isScheduled: item.is_scheduled || false,
//           job_id: item.job_id, // ← Must be returned by your API
//         }));
 
//         setDatasets(mapped);
//       } catch (err) {
//         console.error("Failed to fetch datasets:", err);
//         toast.error("Failed to load datasets");
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchDatasets();
//   }, [userId]);
 
//   // Fetch preview when eye is clicked
//   useEffect(() => {
//     if (!previewDataset || !userId || !previewDataset.job_id) return;
 
//     const fetchPreview = async () => {
//       setPreviewLoading(true);
//       setPreviewError(null);
//       setPreviewData(null);
 
//       try {
//         const url = `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${previewDataset.job_id}&datasetname=${encodeURIComponent(previewDataset.datasetName)}`;
 
//         const response = await fetch(url);
 
//         if (!response.ok) {
//           throw new Error(`Preview failed: ${response.status}`);
//         }
 
//         const data: PreviewData = await response.json();
//         setPreviewData(data);
//       } catch (err: any) {
//         console.error("Preview fetch error:", err);
//         setPreviewError(err.message || "Failed to load preview");
//         toast.error("Could not load dataset preview");
//       } finally {
//         setPreviewLoading(false);
//       }
//     };
 
//     fetchPreview();
//   }, [previewDataset, userId]);
 
//   const filteredDatasets = datasets.filter((dataset) => {
//     const matchesSearch = dataset.datasetName
//       .toLowerCase()
//       .includes(datasetSearch.trim().toLowerCase());
 
//     let matchesDate = true;
//     if (datasetDateFilter) {
//       const lastRunDate = new Date(dataset.completedAt);
//       matchesDate =
//         lastRunDate.toDateString() === datasetDateFilter.toDateString();
//     }
 
//     return matchesSearch && matchesDate;
//   });
 
//   const clearDateFilter = () => {
//     setDatasetDateFilter(undefined);
//   };
 
//   // Handle Navigation button click → store user_id, job_id, dataset_name
//   const handleNavigateToPathSelection = (dataset: Dataset) => {
//     if (!dataset.job_id) {
//       toast.error("Missing job ID for this dataset");
//       return;
//     }
 
//     // Store the required values in localStorage
//     localStorage.setItem("selected_user_id", userId || "");
//     localStorage.setItem("selected_job_id", dataset.job_id);
//     localStorage.setItem("selected_dataset_name", dataset.datasetName);
 
//     // Optional: toast confirmation
//     toast.success(`Navigating with dataset: ${dataset.datasetName}`);
 
//     // Navigate to the path selection page
//     navigate("/PathSelection1");
//   };
 
//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-background">
//       {/* Header */}
//       <header className="border-b border-border backdrop-blur-md sticky top-0 z-20 bg-background/80">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Database className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h1 className="font-bold text-lg">Veritas</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Welcome, <span className="text-primary">{userName}</span>
//                 </p>
//               </div> */}

//               <div className="flex items-center gap-3 md:gap-4">
//             {/* Logo */}
//             <a href="/" className="flex-shrink-0">
//               <img
//                 src="/logo2.png"
//                 alt="Veriton"
//                 className="
//                   h-10               /* mobile base size */
//                   sm:h-10
//                   md:h-9 lg:h-10    /* larger on desktop */
//                   w-auto
//                   object-contain
//                   drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
//                   transition-transform duration-200
//                   hover:scale-105
//                 "
//               />
//             </a>

//             {/* Welcome text – side by side */}
//             <div className="flex flex-col">
//               <p className="text-sm md:text-base text-muted-foreground">
//                 Welcome, <span className="text-primary font-medium">{userName || "User"}</span>
//               </p>
//             </div>
//           </div>
//             <nav className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate("/jobs")}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 Jobs
//               </button>
 
//               <button
//                 onClick={() => navigate("/pipelines")}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <GitBranch className="w-4 h-4" />
//                 Pipelines
//               </button>
 
//               <button
//                 onClick={() => navigate("/datasets")}
//                 className={`flex items-center gap-2 font-medium pb-1 transition-all ${
//                   location.pathname === "/datasets"
//                     ? "text-primary border-b-2 border-primary"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <TableIcon className="w-4 h-4" />
//                 Datasets
//               </button>

//                <button
//                 onClick={() => navigate("/workflow/automl/jobs1")}  // or any route you prefer
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <Sparkles className="w-4 h-4" />   {/* Perfect icon for datasets */}
//                 AutoML
//               </button>
 
//               <div className="flex items-center gap-3">
//                 <ThemeToggle />
 
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleLogout}
//                   className="hover:bg-accent rounded-full"
//                   title="Logout"
//                 >
//                   <LogOut className="h-4 w-4" />
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>
 
//       {/* Main content */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="container mx-auto px-6 py-8 max-w-7xl">
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold tracking-tight">
//                   All Datasets ({filteredDatasets.length})
//                 </h2>
//                 <p className="text-muted-foreground">
//                   View and manage your processed datasets
//                 </p>
//               </div>
//             </div>
 
//             {/* Filters */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
//               {/* Search */}
//               <div className="relative w-full sm:w-80 lg:w-96">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
//                 <Input
//                   placeholder="Search dataset name..."
//                   value={datasetSearch}
//                   onChange={(e) => setDatasetSearch(e.target.value)}
//                   className="pl-10 pr-10 bg-background border-input focus:border-primary/60 focus:ring-primary/20 transition-colors h-10"
//                 />
//                 {datasetSearch && (
//                   <button
//                     onClick={() => setDatasetSearch("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
//                     aria-label="Clear search"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
 
//               {/* Date filter with clear button */}
//               <div className="relative w-40">
//                 <Input
//                   type="date"
//                   value={
//                     datasetDateFilter ? format(datasetDateFilter, "yyyy-MM-dd") : ""
//                   }
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       setDatasetDateFilter(new Date(e.target.value));
//                     } else {
//                       setDatasetDateFilter(undefined);
//                     }
//                   }}
//                   className="w-full text-center peer pr-10"
//                   placeholder=" "
//                 />
//                 <label
//                   className="
//                     absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
//                     bg-background transition-all peer-placeholder-shown:top-1/2
//                     peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
//                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
//                   "
//                 >
//                   filter by date
//                 </label>
 
//                 {datasetDateFilter && (
//                   <button
//                     onClick={clearDateFilter}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
//                     aria-label="Clear date filter"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
 
//               {/* Clear all filters */}
//               {(datasetSearch || datasetDateFilter) && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setDatasetSearch("");
//                     setDatasetDateFilter(undefined);
//                   }}
//                   className="h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
//                 >
//                   Clear all
//                 </Button>
//               )}
//             </div>
 
//             {/* Table */}
//             <Card className="border border-border overflow-hidden">
//               {loading ? (
//                 <div className="py-12 text-center text-muted-foreground">
//                   Loading datasets...
//                 </div>
//               ) : filteredDatasets.length === 0 ? (
//                 <div className="py-12 text-center text-muted-foreground">
//                   No datasets found
//                 </div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted/40 hover:bg-muted/40">
//                       <TableHead className="font-medium">Job Name</TableHead>
//                       <TableHead className="font-medium">Dataset Name</TableHead>
//                       <TableHead className="font-medium">Last Run</TableHead>
//                       <TableHead className="font-medium w-20 text-center">Preview</TableHead>
//                       <TableHead className="font-medium w-20 text-center">Path</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredDatasets.map((dataset) => (
//                       <TableRow key={dataset.id} className="hover:bg-muted/60 transition-colors">
//                         <TableCell className="font-medium">{dataset.jobName}</TableCell>
//                         <TableCell>{dataset.datasetName}</TableCell>
//                         <TableCell className="text-muted-foreground">{dataset.lastRun}</TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => setPreviewDataset(dataset)}
//                             disabled={!dataset.job_id}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => handleNavigateToPathSelection(dataset)}
//                           >
//                             <Navigation className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </Card>
//           </div>
//         </div>
//       </main>
 
//       {/* Preview Modal – unchanged from your version */}
//       {previewDataset && (
//   <Dialog 
//     open={!!previewDataset} 
//     onOpenChange={() => {
//       setPreviewDataset(null);
//       setPreviewData(null);
//       setPreviewError(null);
//     }}
//   >
//     <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
//       {/* Header area — very close to ETLOutput */}
//       <div className="mb-4 flex justify-between items-center px-6 pt-6">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
//           <p className="text-muted-foreground mt-1">
//             Table: <span className="text-primary">{previewDataset.datasetName}</span> •{" "}
//             {previewData 
//               ? `${previewData.total_columns} columns × ${previewData.total_rows} rows` 
//               : previewLoading ? "loading..." : "—"}
//           </p>
//         </div>
//         <Button 
//           variant="ghost" 
//           size="icon" 
//           onClick={() => {
//             setPreviewDataset(null);
//             setPreviewData(null);
//             setPreviewError(null);
//           }}
//         >
//           <X className="h-5 w-5" />
//         </Button>
//       </div>

//       {/* Main content area */}
//       <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
//         {previewLoading ? (
//           <div className="flex-1 flex items-center justify-center">
//             <Loader2 className="h-10 w-10 animate-spin text-primary" />
//           </div>
//         ) : previewError ? (
//           <div className="flex-1 flex items-center justify-center text-destructive text-center">
//             <div className="max-w-md">
//               <p className="font-medium text-lg mb-3">Failed to load preview</p>
//               <p className="text-sm">{previewError}</p>
//             </div>
//           </div>
//         ) : previewData ? (
//           <div className="flex-1 overflow-auto border border-border rounded-lg">
//             <table className="w-full min-w-max">
//               <thead className="sticky top-0 bg-primary text-white">
//                 <tr>
//                   {previewData.columns.map((col) => (
//                     <th
//                       key={col}
//                       className="text-left p-4 text-sm font-medium whitespace-nowrap border-b border-primary/30"
//                     >
//                       <div>{col}</div>
//                       <div className="text-xs opacity-80 mt-0.5">
//                         {previewData.column_types[col] || "?"}
//                       </div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {previewData.preview_rows.map((row, rowIdx) => (
//                   <tr
//                     key={rowIdx}
//                     className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
//                   >
//                     {previewData.columns.map((col) => (
//                       <td
//                         key={col}
//                         className="p-4 text-sm text-foreground whitespace-nowrap"
//                       >
//                         {row[col] != null ? String(row[col]) : "-"}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}

//                 {previewData.preview_rows.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={previewData.columns.length || 1}
//                       className="p-10 text-center text-muted-foreground"
//                     >
//                       No preview data available
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-muted-foreground">
//             Waiting for data...
//           </div>
//         )}
//       </div>
//     </DialogContent>
//   </Dialog>
// )}

//     </div>
//   );
// };
 
// export default DatasetTab;
 
// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Input } from "@/components/ui/input";
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
// import {
//   Search,
//   Calendar as CalendarIcon,
//   Eye,
//   Navigation,
//   X,
//   Database,
//   LogOut,
//   BarChart3,
//   GitBranch,
//   Table as TableIcon,
//   Loader2,
//   Sparkles,
//   Upload,
// } from "lucide-react";
// import { format } from "date-fns";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogContent,
// } from "@/components/ui/dialog";
 
// interface Dataset {
//   id: string;
//   jobName: string;
//   datasetName: string;
//   lastRun: string;
//   completedAt: string;
//   rows: number;
//   columns: number;
//   filePath: string;
//   isScheduled: boolean;
//   job_id?: string; // Must come from /datasets API response
// }
 
// interface PreviewData {
//   dataset: string;
//   user_id: string;
//   job_id: string;
//   total_rows: number;
//   total_columns: number;
//   columns: string[];
//   column_types: Record<string, string>;
//   preview_rows: Record<string, any>[];
//   preview_row_count: number;
// }
 
// const DatasetTab = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
 
//   const [datasetSearch, setDatasetSearch] = useState("");
//   const [datasetDateFilter, setDatasetDateFilter] = useState<Date | undefined>();
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   const [loading, setLoading] = useState(true);
 
//   const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
//   const [previewData, setPreviewData] = useState<PreviewData | null>(null);
//   const [previewLoading, setPreviewLoading] = useState(false);
//   const [previewError, setPreviewError] = useState<string | null>(null);

//   // Upload state
//   const [uploading, setUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
 
//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const userName = user?.name || user?.email?.split("@")[0] || "User";
//   const userId = user?.id || user?.user_id;
 
//   const handleLogout = () => {
//      localStorage.clear();
//     toast.success("Logged out successfully");
//     navigate("/", { replace: true });
//   };

//   // Handle file upload
//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

// const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   if (!userId) {
//     toast.error("User not found. Please login again.");
//     return;
//   }

//   const allowedTypes = [
//     "text/csv",
//     "application/vnd.ms-excel",
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     "application/json",
//     "text/plain",
//   ];

//   if (!allowedTypes.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls|json|txt)$/i)) {
//     toast.error("Unsupported file type. Please upload CSV, Excel, JSON, or TXT files.");
//     e.target.value = "";
//     return;
//   }

//   try {
//     setUploading(true);

//     const formData = new FormData();
//     formData.append("user_id", userId);
//     formData.append("dataset", file);   // ← Changed from "file" to "dataset"

//     const response = await fetch(
//       "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/datasets/upload/nojob_id",
//       {
//         method: "POST",
//         body: formData,
//       }
//     );

//     if (!response.ok) {
//       throw new Error(`Upload failed: ${response.status}`);
//     }

//     const result = await response.json();
//     toast.success(`"${file.name}" uploaded successfully!`);

//     // Refresh datasets list after successful upload
//     const refreshResponse = await fetch(
//       `https://api.veriton.ai/api/service2/datasets?user_id=${userId}`
//     );

//     if (refreshResponse.ok) {
//       const data = await refreshResponse.json();
//       const mapped = data.map((item: any, index: number) => ({
//         id: String(index + 1),
//         jobName: item.job_name || "Unnamed Job",
//         datasetName: item.dataset_name || "Unnamed Dataset",
//         lastRun: item.completed_at
//           ? new Date(item.completed_at).toLocaleString("en-US", {
//               month: "short",
//               day: "numeric",
//               year: "numeric",
//               hour: "numeric",
//               minute: "2-digit",
//               hour12: true,
//             })
//           : "—",
//         completedAt: item.completed_at,
//         rows: item.rows || 0,
//         columns: item.columns_count || 0,
//         filePath: item.file_path || "",
//         isScheduled: item.is_scheduled || false,
//         job_id: item.job_id,
//       }));
//       setDatasets(mapped);
//     }
//   } catch (err: any) {
//     console.error("Upload error:", err);
//     toast.error(err.message || "Failed to upload dataset");
//   } finally {
//     setUploading(false);
//     e.target.value = "";
//   }
// };

 
//   // Fetch datasets list
//   useEffect(() => {
//     if (!userId) {
//       toast.error("User not found. Please login again.");
//       setLoading(false);
//       return;
//     }
 
//     const fetchDatasets = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://api.veriton.ai/api/service2/datasets?user_id=${userId}`
//         );
 
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
 
//         const data = await response.json();
 
//         const mapped = data.map((item: any, index: number) => ({
//           id: String(index + 1),
//           jobName: item.job_name || "Unnamed Job",
//           datasetName: item.dataset_name || "Unnamed Dataset",
//           lastRun: item.completed_at
//             ? new Date(item.completed_at).toLocaleString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//                 hour: "numeric",
//                 minute: "2-digit",
//                 hour12: true,
//               })
//             : "—",
//           completedAt: item.completed_at,
//           rows: item.rows || 0,
//           columns: item.columns_count || 0,
//           filePath: item.file_path || "",
//           isScheduled: item.is_scheduled || false,
//           job_id: item.job_id,
//         }));
 
//         setDatasets(mapped);
//       } catch (err) {
//         console.error("Failed to fetch datasets:", err);
//         toast.error("Failed to load datasets");
//       } finally {
//         setLoading(false);
//       }
//     };
 
//     fetchDatasets();
//   }, [userId]);
 
//   // Fetch preview when eye is clicked
//   useEffect(() => {
//     if (!previewDataset || !userId || !previewDataset.job_id) return;
 
//     const fetchPreview = async () => {
//       setPreviewLoading(true);
//       setPreviewError(null);
//       setPreviewData(null);
 
//       try {
//         const url = `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${previewDataset.job_id}&datasetname=${encodeURIComponent(previewDataset.datasetName)}`;
 
//         const response = await fetch(url);
 
//         if (!response.ok) {
//           throw new Error(`Preview failed: ${response.status}`);
//         }
 
//         const data: PreviewData = await response.json();
//         setPreviewData(data);
//       } catch (err: any) {
//         console.error("Preview fetch error:", err);
//         setPreviewError(err.message || "Failed to load preview");
//         toast.error("Could not load dataset preview");
//       } finally {
//         setPreviewLoading(false);
//       }
//     };
 
//     fetchPreview();
//   }, [previewDataset, userId]);
 
//   const filteredDatasets = datasets.filter((dataset) => {
//     const matchesSearch = dataset.datasetName
//       .toLowerCase()
//       .includes(datasetSearch.trim().toLowerCase());
 
//     let matchesDate = true;
//     if (datasetDateFilter) {
//       const lastRunDate = new Date(dataset.completedAt);
//       matchesDate =
//         lastRunDate.toDateString() === datasetDateFilter.toDateString();
//     }
 
//     return matchesSearch && matchesDate;
//   });
 
//   const clearDateFilter = () => {
//     setDatasetDateFilter(undefined);
//   };
 
//   const handleNavigateToPathSelection = (dataset: Dataset) => {
//     if (!dataset.job_id) {
//       toast.error("Missing job ID for this dataset");
//       return;
//     }
 
//     localStorage.setItem("selected_user_id", userId || "");
//     localStorage.setItem("selected_job_id", dataset.job_id);
//     localStorage.setItem("selected_dataset_name", dataset.datasetName);
 
//     toast.success(`Navigating with dataset: ${dataset.datasetName}`);
//     navigate("/PathSelection1");
//   };
 
//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-background">
//       {/* Header */}
//       <header className="border-b border-border backdrop-blur-md sticky top-0 z-20 bg-background/80">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3 md:gap-4">
//               {/* Logo */}
//               <a href="/" className="flex-shrink-0">
//                 <img
//                   src="/logo2.png"
//                   alt="Veriton"
//                   className="
//                     h-10
//                     sm:h-10
//                     md:h-9 lg:h-10
//                     w-auto
//                     object-contain
//                     drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
//                     transition-transform duration-200
//                     hover:scale-105
//                   "
//                 />
//               </a>

//               <div className="flex flex-col">
//                 <p className="text-sm md:text-base text-muted-foreground">
//                   Welcome, <span className="text-primary font-medium">{userName || "User"}</span>
//                 </p>
//               </div>
//             </div>

//             <nav className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate("/jobs")}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 Jobs
//               </button>
 
//               <button
//                 onClick={() => navigate("/pipelines")}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <GitBranch className="w-4 h-4" />
//                 Pipelines
//               </button>
 
//               <button
//                 onClick={() => navigate("/datasets")}
//                 className={`flex items-center gap-2 font-medium pb-1 transition-all ${
//                   location.pathname === "/datasets"
//                     ? "text-primary border-b-2 border-primary"
//                     : "text-muted-foreground hover:text-foreground"
//                 }`}
//               >
//                 <TableIcon className="w-4 h-4" />
//                 Datasets
//               </button>

//               <button
//                 onClick={() => navigate("/workflow/automl/jobs1")}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <Sparkles className="w-4 h-4" />
//                 AutoML
//               </button>
 
//               <div className="flex items-center gap-3">
//                 <ThemeToggle />
 
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleLogout}
//                   className="hover:bg-accent rounded-full"
//                   title="Logout"
//                 >
//                   <LogOut className="h-4 w-4" />
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>
 
//       {/* Main content */}
//       <main className="flex-1 overflow-y-auto">
//         <div className="container mx-auto px-6 py-8 max-w-7xl">
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl font-bold tracking-tight">
//                   All Datasets ({filteredDatasets.length})
//                 </h2>
//                 <p className="text-muted-foreground">
//                   View and manage your processed datasets
//                 </p>
//               </div>
//             </div>
 
//             {/* Filters row — Upload button pinned to the right */}
//             <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
//               {/* Search */}
//               <div className="relative w-full sm:w-80 lg:w-96">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
//                 <Input
//                   placeholder="Search dataset name..."
//                   value={datasetSearch}
//                   onChange={(e) => setDatasetSearch(e.target.value)}
//                   className="pl-10 pr-10 bg-background border-input focus:border-primary/60 focus:ring-primary/20 transition-colors h-10"
//                 />
//                 {datasetSearch && (
//                   <button
//                     onClick={() => setDatasetSearch("")}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
//                     aria-label="Clear search"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
 
//               {/* Date filter */}
//               <div className="relative w-40">
//                 <Input
//                   type="date"
//                   value={
//                     datasetDateFilter ? format(datasetDateFilter, "yyyy-MM-dd") : ""
//                   }
//                   onChange={(e) => {
//                     if (e.target.value) {
//                       setDatasetDateFilter(new Date(e.target.value));
//                     } else {
//                       setDatasetDateFilter(undefined);
//                     }
//                   }}
//                   className="w-full text-center peer pr-10"
//                   placeholder=" "
//                 />
//                 <label
//                   className="
//                     absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
//                     bg-background transition-all peer-placeholder-shown:top-1/2
//                     peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
//                     peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
//                   "
//                 >
//                   filter by date
//                 </label>
 
//                 {datasetDateFilter && (
//                   <button
//                     onClick={clearDateFilter}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
//                     aria-label="Clear date filter"
//                   >
//                     <X className="h-4 w-4" />
//                   </button>
//                 )}
//               </div>
 
//               {/* Clear all filters */}
//               {(datasetSearch || datasetDateFilter) && (
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => {
//                     setDatasetSearch("");
//                     setDatasetDateFilter(undefined);
//                   }}
//                   className="h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
//                 >
//                   Clear all
//                 </Button>
//               )}

//               {/* Spacer pushes Upload to the far right */}
//               <div className="flex-1" />

//               {/* Hidden file input */}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept=".csv,.xlsx,.xls,.json,.txt"
//                 className="hidden"
//                 onChange={handleFileChange}
//               />

//               {/* Upload button */}
//               <Button
//                 onClick={handleUploadClick}
//                 disabled={uploading}
//                 className="h-10 gap-2 px-4"
//               >
//                 {uploading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   <Upload className="h-4 w-4" />
//                 )}
//                 {uploading ? "Uploading..." : "Upload Dataset"}
//               </Button>
//             </div>
 
//             {/* Table */}
//             <Card className="border border-border overflow-hidden">
//               {loading ? (
//                 <div className="py-12 text-center text-muted-foreground">
//                   Loading datasets...
//                 </div>
//               ) : filteredDatasets.length === 0 ? (
//                 <div className="py-12 text-center text-muted-foreground">
//                   No datasets found
//                 </div>
//               ) : (
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted/40 hover:bg-muted/40">
//                       <TableHead className="font-medium">Job Name</TableHead>
//                       <TableHead className="font-medium">Dataset Name</TableHead>
//                       <TableHead className="font-medium">Last Run</TableHead>
//                       <TableHead className="font-medium w-20 text-center">Preview</TableHead>
//                       <TableHead className="font-medium w-20 text-center">Path</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {filteredDatasets.map((dataset) => (
//                       <TableRow key={dataset.id} className="hover:bg-muted/60 transition-colors">
//                         <TableCell className="font-medium">{dataset.jobName}</TableCell>
//                         <TableCell>{dataset.datasetName}</TableCell>
//                         <TableCell className="text-muted-foreground">{dataset.lastRun}</TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => setPreviewDataset(dataset)}
//                             disabled={!dataset.job_id}
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => handleNavigateToPathSelection(dataset)}
//                           >
//                             <Navigation className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               )}
//             </Card>
//           </div>
//         </div>
//       </main>
 
//       {/* Preview Modal */}
//       {previewDataset && (
//         <Dialog
//           open={!!previewDataset}
//           onOpenChange={() => {
//             setPreviewDataset(null);
//             setPreviewData(null);
//             setPreviewError(null);
//           }}
//         >
//           <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
//             <div className="mb-4 flex justify-between items-center px-6 pt-6">
//               <div>
//                 <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
//                 <p className="text-muted-foreground mt-1">
//                   Table: <span className="text-primary">{previewDataset.datasetName}</span> •{" "}
//                   {previewData
//                     ? `${previewData.total_columns} columns × ${previewData.total_rows} rows`
//                     : previewLoading ? "loading..." : "—"}
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => {
//                   setPreviewDataset(null);
//                   setPreviewData(null);
//                   setPreviewError(null);
//                 }}
//               >
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>

//             <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
//               {previewLoading ? (
//                 <div className="flex-1 flex items-center justify-center">
//                   <Loader2 className="h-10 w-10 animate-spin text-primary" />
//                 </div>
//               ) : previewError ? (
//                 <div className="flex-1 flex items-center justify-center text-destructive text-center">
//                   <div className="max-w-md">
//                     <p className="font-medium text-lg mb-3">Failed to load preview</p>
//                     <p className="text-sm">{previewError}</p>
//                   </div>
//                 </div>
//               ) : previewData ? (
//                 <div className="flex-1 overflow-auto border border-border rounded-lg">
//                   <table className="w-full min-w-max">
//                     <thead className="sticky top-0 bg-primary text-white">
//                       <tr>
//                         {previewData.columns.map((col) => (
//                           <th
//                             key={col}
//                             className="text-left p-4 text-sm font-medium whitespace-nowrap border-b border-primary/30"
//                           >
//                             <div>{col}</div>
//                             <div className="text-xs opacity-80 mt-0.5">
//                               {previewData.column_types[col] || "?"}
//                             </div>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {previewData.preview_rows.map((row, rowIdx) => (
//                         <tr
//                           key={rowIdx}
//                           className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0"
//                         >
//                           {previewData.columns.map((col) => (
//                             <td
//                               key={col}
//                               className="p-4 text-sm text-foreground whitespace-nowrap"
//                             >
//                               {row[col] != null ? String(row[col]) : "-"}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}

//                       {previewData.preview_rows.length === 0 && (
//                         <tr>
//                           <td
//                             colSpan={previewData.columns.length || 1}
//                             className="p-10 text-center text-muted-foreground"
//                           >
//                             No preview data available
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="flex-1 flex items-center justify-center text-muted-foreground">
//                   Waiting for data...
//                 </div>
//               )}
//             </div>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
// };
 
// export default DatasetTab;


import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  Calendar as CalendarIcon,
  Eye,
  Navigation,
  X,
  Database,
  LogOut,
  BarChart3,
  GitBranch,
  Table as TableIcon,
  Loader2,
  Sparkles,
  Upload,
  FileSpreadsheet,
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Dataset {
  id: string;
  jobName: string;
  datasetName: string;
  lastRun: string;
  completedAt: string;
  rows: number;
  columns: number;
  filePath: string;
  isScheduled: boolean;
  job_id?: string;
}

interface PreviewData {
  dataset: string;
  user_id: string;
  job_id: string;
  total_rows: number;
  total_columns: number;
  columns: string[];
  column_types: Record<string, string>;
  preview_rows: Record<string, any>[];
  preview_row_count: number;
}

// Sheet selection state — holds the pending upload info when API returns
// status: "sheet_selection_required"
interface PendingSheetUpload {
  job_id: string;
  file_name: string;
  sheets: string[];
  file: File;
}

const UPLOAD_URL =
  "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/datasets/upload/nojob_id";
const DATASETS_URL = "https://api.veriton.ai/api/service2/datasets";
 
const DatasetTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [datasetSearch, setDatasetSearch] = useState("");
  const [datasetDateFilter, setDatasetDateFilter] = useState<Date | undefined>();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  const [previewDataset, setPreviewDataset] = useState<Dataset | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sheet selection state
  const [pendingSheetUpload, setPendingSheetUpload] = useState<PendingSheetUpload | null>(null);
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [sheetUploading, setSheetUploading] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userId = user?.id || user?.user_id;

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  // ── Fetch / refresh datasets list ──────────────────────────────────────────
  const refreshDatasets = async () => {
    if (!userId) return;
    try {
      const res = await fetch(`${DATASETS_URL}?user_id=${userId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setDatasets(mapDatasets(data));
    } catch (err) {
      console.error("Failed to refresh datasets:", err);
    }
  };

  const mapDatasets = (data: any[]): Dataset[] =>
    data.map((item: any, index: number) => ({
      id: String(index + 1),
      jobName: item.job_name || "Unnamed Job",
      datasetName: item.dataset_name || "Unnamed Dataset",
      lastRun: item.completed_at
        ? new Date(item.completed_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "—",
      completedAt: item.completed_at,
      rows: item.rows || 0,
      columns: item.columns_count || 0,
      filePath: item.file_path || "",
      isScheduled: item.is_scheduled || false,
      job_id: item.job_id,
    }));

  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please login again.");
      setLoading(false);
      return;
    }
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${DATASETS_URL}?user_id=${userId}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setDatasets(mapDatasets(data));
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
        toast.error("Failed to load datasets");
      } finally {
        setLoading(false);
      }
    };
    fetchDatasets();
  }, [userId]);

  // ── Preview ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!previewDataset || !userId || !previewDataset.job_id) return;
    const fetchPreview = async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      setPreviewData(null);
      try {
        const url = `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${previewDataset.job_id}&datasetname=${encodeURIComponent(previewDataset.datasetName)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Preview failed: ${res.status}`);
        setPreviewData(await res.json());
      } catch (err: any) {
        setPreviewError(err.message || "Failed to load preview");
        toast.error("Could not load dataset preview");
      } finally {
        setPreviewLoading(false);
      }
    };
    fetchPreview();
  }, [previewDataset, userId]);

  // ── File upload ─────────────────────────────────────────────────────────────
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset so same file can be re-selected

    if (!userId) {
      toast.error("User not found. Please login again.");
      return;
    }

    const allowed = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/json",
      "text/plain",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(csv|xlsx|xls|json|txt)$/i)) {
      toast.error("Unsupported file type. Please upload CSV, Excel, JSON, or TXT files.");
      return;
    }

    await uploadFile(file, undefined);
  };

  /**
   * Core upload function.
   * Pass `sheetName` when re-uploading after sheet selection.
   */
  const uploadFile = async (file: File, sheetName: string | undefined) => {
    try {
      if (sheetName) {
        setSheetUploading(true);
      } else {
        setUploading(true);
      }

      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("dataset", file);
      if (sheetName) {
        formData.append("sheet_name", sheetName);
      }

      const res = await fetch(UPLOAD_URL, { method: "POST", body: formData });

      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

      const result = await res.json();

      // ── Multi-sheet Excel detected ──────────────────────────────────────
      if (result.status === "sheet_selection_required") {
        setPendingSheetUpload({
          job_id: result.job_id,
          file_name: result.file_name,
          sheets: result.sheets || [],
          file,
        });
        setSelectedSheet(result.sheets?.[0] || "");
        // Don't close uploading yet — wait for user selection
        setUploading(false);
        return;
      }

      // ── Success ─────────────────────────────────────────────────────────
      toast.success(`"${file.name}" uploaded successfully!`);

      // Close sheet dialog if open
      if (sheetName) {
        setPendingSheetUpload(null);
        setSelectedSheet("");
      }

      await refreshDatasets();
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err.message || "Failed to upload dataset");
    } finally {
      setUploading(false);
      setSheetUploading(false);
    }
  };

  // Called when user confirms sheet selection
  const handleSheetConfirm = async () => {
    if (!pendingSheetUpload || !selectedSheet) return;
    await uploadFile(pendingSheetUpload.file, selectedSheet);
  };

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filteredDatasets = datasets.filter((d) => {
    const matchesSearch = d.datasetName
      .toLowerCase()
      .includes(datasetSearch.trim().toLowerCase());
    let matchesDate = true;
    if (datasetDateFilter) {
      const date = new Date(d.completedAt);
      matchesDate = date.toDateString() === datasetDateFilter.toDateString();
    }
    return matchesSearch && matchesDate;
  });

  const handleNavigateToPathSelection = (dataset: Dataset) => {
    if (!dataset.job_id) {
      toast.error("Missing job ID for this dataset");
      return;
    }
    localStorage.setItem("selected_user_id", userId || "");
    localStorage.setItem("selected_job_id", dataset.job_id);
    localStorage.setItem("selected_dataset_name", dataset.datasetName);
    toast.success(`Navigating with dataset: ${dataset.datasetName}`);
    navigate("/PathSelection1");
  };

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">

      {/* ── Header ── */}
      <header className="border-b border-border backdrop-blur-md sticky top-0 z-20 bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <a href="/" className="flex-shrink-0">
                <img
                  src="/logo2.png"
                  alt="Veriton"
                  className="h-10 sm:h-10 md:h-9 lg:h-10 w-auto object-contain drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)] transition-transform duration-200 hover:scale-105"
                />
              </a>
              <div className="flex flex-col">
                <p className="text-sm md:text-base text-muted-foreground">
                  Welcome,{" "}
                  <span className="text-primary font-medium">{userName || "User"}</span>
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <button onClick={() => navigate("/jobs")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <BarChart3 className="w-4 h-4" /> Jobs
              </button>
              <button onClick={() => navigate("/pipelines")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <GitBranch className="w-4 h-4" /> Pipelines
              </button>
              <button
                onClick={() => navigate("/datasets")}
                className={`flex items-center gap-2 font-medium pb-1 transition-all ${
                  location.pathname === "/datasets"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="w-4 h-4" /> Datasets
              </button>
              <button onClick={() => navigate("/workflow/automl/jobs1")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Sparkles className="w-4 h-4" /> AutoML
              </button>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-accent rounded-full" title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="space-y-6">

            {/* Title */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  All Datasets ({filteredDatasets.length})
                </h2>
                <p className="text-muted-foreground">View and manage your processed datasets</p>
              </div>
            </div>

            {/* Filters + Upload */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 flex-wrap">
              {/* Search */}
              <div className="relative w-full sm:w-80 lg:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search dataset name..."
                  value={datasetSearch}
                  onChange={(e) => setDatasetSearch(e.target.value)}
                  className="pl-10 pr-10 bg-background border-input focus:border-primary/60 focus:ring-primary/20 transition-colors h-10"
                />
                {datasetSearch && (
                  <button onClick={() => setDatasetSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Date filter */}
              <div className="relative w-40">
                <Input
                  type="date"
                  value={datasetDateFilter ? format(datasetDateFilter, "yyyy-MM-dd") : ""}
                  onChange={(e) => setDatasetDateFilter(e.target.value ? new Date(e.target.value) : undefined)}
                  className="w-full text-center peer pr-10"
                />
                <label className="absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground bg-background transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground">
                  filter by date
                </label>
                {datasetDateFilter && (
                  <button onClick={() => setDatasetDateFilter(undefined)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {(datasetSearch || datasetDateFilter) && (
                <Button variant="ghost" size="sm" onClick={() => { setDatasetSearch(""); setDatasetDateFilter(undefined); }} className="h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-accent">
                  Clear all
                </Button>
              )}

              <div className="flex-1" />

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls,.json,.txt"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Upload button */}
              <Button onClick={handleUploadClick} disabled={uploading} className="h-10 gap-2 px-4">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {uploading ? "Uploading..." : "Upload Dataset"}
              </Button>
            </div>

            {/* Table */}
            <Card className="border border-border overflow-hidden">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">Loading datasets...</div>
              ) : filteredDatasets.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">No datasets found</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="font-medium">Job Name</TableHead>
                      <TableHead className="font-medium">Dataset Name</TableHead>
                      <TableHead className="font-medium">Last Run</TableHead>
                      <TableHead className="font-medium w-20 text-center">Preview</TableHead>
                      <TableHead className="font-medium w-20 text-center">Path</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDatasets.map((dataset) => (
                      <TableRow key={dataset.id} className="hover:bg-muted/60 transition-colors">
                        <TableCell className="font-medium">{dataset.jobName}</TableCell>
                        <TableCell>{dataset.datasetName}</TableCell>
                        <TableCell className="text-muted-foreground">{dataset.lastRun}</TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setPreviewDataset(dataset)} disabled={!dataset.job_id}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleNavigateToPathSelection(dataset)}>
                            <Navigation className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* ── Sheet Selection Dialog ── */}
      {pendingSheetUpload && (
        <Dialog open={!!pendingSheetUpload} onOpenChange={() => { setPendingSheetUpload(null); setSelectedSheet(""); }}>
          <DialogContent className="max-w-md overflow-hidden p-0">

            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-border">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))" }}>
                  <FileSpreadsheet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">Select a Sheet</h2>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[260px]">
                    {pendingSheetUpload.file_name}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                This workbook has <span className="font-semibold text-foreground">{pendingSheetUpload.sheets.length} sheets</span>. Choose which one to upload.
              </p>
            </div>

            {/* Sheet list */}
            <div className="px-4 py-3 max-h-72 overflow-y-auto">
              <div className="space-y-1.5">
                {pendingSheetUpload.sheets.map((sheet, i) => {
                  const isSelected = selectedSheet === sheet;
                  return (
                    <button
                      key={sheet}
                      onClick={() => setSelectedSheet(sheet)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-left"
                      style={{
                        border: isSelected ? "2px solid hsl(267 84% 60%)" : "1.5px solid hsl(var(--border))",
                        background: isSelected ? "linear-gradient(135deg, hsl(267 84% 60% / 0.12), hsl(220 90% 60% / 0.07))" : "hsl(var(--card))",
                        boxShadow: isSelected ? "0 0 0 3px hsl(267 84% 60% / 0.15)" : "none",
                      }}
                    >
                      {/* Radio dot */}
                      <div style={{
                        width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                        border: isSelected ? "2px solid hsl(267 84% 60%)" : "2px solid hsl(var(--border))",
                        background: isSelected ? "hsl(267 84% 60%)" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.15s ease",
                      }}>
                        {isSelected && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                      </div>

                      {/* Sheet name */}
                      <span
                        className="flex-1 font-medium truncate"
                        style={{ color: isSelected ? "hsl(267 84% 55%)" : "hsl(var(--foreground))" }}
                      >
                        {sheet}
                      </span>

                      {/* Sheet number badge */}
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        Sheet {i + 1}
                      </span>

                      {isSelected && (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: "hsl(267 84% 60%)" }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer buttons */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => { setPendingSheetUpload(null); setSelectedSheet(""); }}
                className="text-muted-foreground"
                disabled={sheetUploading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSheetConfirm}
                disabled={!selectedSheet || sheetUploading}
                className="gap-2 px-5"
                style={{ background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))" }}
              >
                {sheetUploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Uploading…</>
                ) : (
                  <><Upload className="h-4 w-4" /> Upload "{selectedSheet}"</>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── Dataset Preview Modal ── */}
      {previewDataset && (
        <Dialog open={!!previewDataset} onOpenChange={() => { setPreviewDataset(null); setPreviewData(null); setPreviewError(null); }}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-between items-center px-6 pt-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
                <p className="text-muted-foreground mt-1">
                  Table: <span className="text-primary">{previewDataset.datasetName}</span> •{" "}
                  {previewData
                    ? `${previewData.total_columns} columns × ${previewData.total_rows} rows`
                    : previewLoading ? "loading..." : "—"}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { setPreviewDataset(null); setPreviewData(null); setPreviewError(null); }}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
              {previewLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : previewError ? (
                <div className="flex-1 flex items-center justify-center text-destructive text-center">
                  <div className="max-w-md">
                    <p className="font-medium text-lg mb-3">Failed to load preview</p>
                    <p className="text-sm">{previewError}</p>
                  </div>
                </div>
              ) : previewData ? (
                <div className="flex-1 overflow-auto border border-border rounded-lg">
                  <table className="w-full min-w-max">
                    <thead className="sticky top-0 bg-primary text-white">
                      <tr>
                        {previewData.columns.map((col) => (
                          <th key={col} className="text-left p-4 text-sm font-medium whitespace-nowrap border-b border-primary/30">
                            <div>{col}</div>
                            <div className="text-xs opacity-80 mt-0.5">{previewData.column_types[col] || "?"}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.preview_rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-border hover:bg-muted/50 transition-colors last:border-b-0">
                          {previewData.columns.map((col) => (
                            <td key={col} className="p-4 text-sm text-foreground whitespace-nowrap">
                              {row[col] != null ? String(row[col]) : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {previewData.preview_rows.length === 0 && (
                        <tr>
                          <td colSpan={previewData.columns.length || 1} className="p-10 text-center text-muted-foreground">
                            No preview data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Waiting for data...
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DatasetTab;