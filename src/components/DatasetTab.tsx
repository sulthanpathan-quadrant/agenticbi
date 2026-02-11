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
// } from "lucide-react";
// import { format } from "date-fns";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
 
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
//   job_id?: string; // ← Added: we need job_id from /datasets API
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
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
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
//           `https://20.81.213.147/datasets?user_id=${userId}`
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
//           job_id: item.job_id, // ← IMPORTANT: must come from your API
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
//         const url = `https://20.81.213.147/preview-dataset?user_id=${userId}&job_id=${previewDataset.job_id}&datasetname=${encodeURIComponent(previewDataset.datasetName)}`;
 
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
 
//   return (
//     <div className="h-screen flex flex-col overflow-hidden bg-background">
//       {/* Header */}
//       <header className="border-b border-border backdrop-blur-md sticky top-0 z-20 bg-background/80">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Database className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h1 className="font-bold text-lg">Veritas</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Welcome, <span className="text-primary">{userName}</span>
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
//                             disabled={!dataset.job_id} // Disable if no job_id
//                           >
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                         <TableCell className="text-center">
//                           <Button
//                             variant="ghost"
//                             size="icon"
//                             className="h-8 w-8"
//                             onClick={() => navigate("/workflow/path-selection")}
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
 
//       {/* Preview Modal – now dynamic from API with optimized scrolling */}
//       {previewDataset && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//           <Card className="w-full max-w-4xl max-h-[85vh] flex flex-col relative bg-background border-border">
//             {/* Fixed Header */}
//             <div className="sticky top-0 bg-background border-b border-border z-10 p-6 pb-4">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute top-4 right-4"
//                 onClick={() => {
//                   setPreviewDataset(null);
//                   setPreviewData(null);
//                   setPreviewError(null);
//                 }}
//               >
//                 <X className="h-5 w-5" />
//               </Button>
 
//               <h3 className="text-xl font-semibold mb-2 pr-10">
//                 Preview: {previewDataset.datasetName}
//               </h3>
//               {/* <p className="text-sm text-muted-foreground">
//                 Job ID: {previewDataset.job_id || "N/A"}
//               </p> */}
//             </div>
 
//             {/* Scrollable Content */}
//             <div className="flex-1 overflow-y-auto p-6 pt-4">
//               {previewLoading ? (
//                 <div className="flex flex-col items-center justify-center py-12">
//                   <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
//                   <p className="text-muted-foreground">Loading preview...</p>
//                 </div>
//               ) : previewError ? (
//                 <div className="text-center py-12 text-destructive">
//                   <p>Error: {previewError}</p>
//                   <p className="text-sm mt-2">Please try again or check your connection.</p>
//                 </div>
//               ) : previewData ? (
//                 <div className="space-y-6">
//                   {/* Summary */}
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <Card className="p-4 bg-muted/30">
//                       <p className="text-sm text-muted-foreground">Total Rows</p>
//                       <p className="text-2xl font-bold">{previewData.total_rows.toLocaleString()}</p>
//                     </Card>
//                     <Card className="p-4 bg-muted/30">
//                       <p className="text-sm text-muted-foreground">Total Columns</p>
//                       <p className="text-2xl font-bold">{previewData.total_columns}</p>
//                     </Card>
//                     <Card className="p-4 bg-muted/30">
//                       <p className="text-sm text-muted-foreground">Preview Rows</p>
//                       <p className="text-2xl font-bold">{previewData.preview_row_count}</p>
//                     </Card>
//                   </div>
 
//                   {/* Columns & Types */}
//                   <div>
//                     <h4 className="font-medium mb-3">Columns ({previewData.total_columns})</h4>
//                     <div className="border rounded-md overflow-hidden max-h-[200px] overflow-y-auto">
//                       <Table>
//                         <TableHeader className="sticky top-0 bg-muted/40 z-10">
//                           <TableRow>
//                             <TableHead>Column Name</TableHead>
//                             <TableHead>Data Type</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {previewData.columns.map((col) => (
//                             <TableRow key={col}>
//                               <TableCell className="font-medium">{col}</TableCell>
//                               <TableCell>{previewData.column_types[col] || "Unknown"}</TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
 
//                   {/* Preview Rows */}
//                   <div>
//                     <h4 className="font-medium mb-3">Preview Data (first {previewData.preview_row_count} rows)</h4>
//                     <div className="border rounded-md overflow-auto max-h-[300px]">
//                       <Table>
//                         <TableHeader className="sticky top-0 bg-muted/40 z-10">
//                           <TableRow>
//                             {previewData.columns.map((col) => (
//                               <TableHead key={col} className="whitespace-nowrap">
//                                 {col}
//                               </TableHead>
//                             ))}
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {previewData.preview_rows.map((row, idx) => (
//                             <TableRow key={idx}>
//                               {previewData.columns.map((col) => (
//                                 <TableCell key={col} className="whitespace-nowrap">
//                                   {row[col] ?? "-"}
//                                 </TableCell>
//                               ))}
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-center py-12 text-muted-foreground">
//                   No preview data available
//                 </div>
//               )}
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };
 
// export default DatasetTab;
 
 
import { useState, useEffect } from "react";
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
} from "lucide-react";
import { format } from "date-fns";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
 
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
  job_id?: string; // Must come from /datasets API response
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
 
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userId = user?.id || user?.user_id;
 
  const handleLogout = () => {
     localStorage.clear();
    // localStorage.removeItem("user");
    // localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };
 
  // Fetch datasets list
  useEffect(() => {
    if (!userId) {
      toast.error("User not found. Please login again.");
      setLoading(false);
      return;
    }
 
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://api.veriton.ai/api/service2/datasets?user_id=${userId}`
        );
 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        const data = await response.json();
 
        const mapped = data.map((item: any, index: number) => ({
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
          job_id: item.job_id, // ← Must be returned by your API
        }));
 
        setDatasets(mapped);
      } catch (err) {
        console.error("Failed to fetch datasets:", err);
        toast.error("Failed to load datasets");
      } finally {
        setLoading(false);
      }
    };
 
    fetchDatasets();
  }, [userId]);
 
  // Fetch preview when eye is clicked
  useEffect(() => {
    if (!previewDataset || !userId || !previewDataset.job_id) return;
 
    const fetchPreview = async () => {
      setPreviewLoading(true);
      setPreviewError(null);
      setPreviewData(null);
 
      try {
        const url = `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${previewDataset.job_id}&datasetname=${encodeURIComponent(previewDataset.datasetName)}`;
 
        const response = await fetch(url);
 
        if (!response.ok) {
          throw new Error(`Preview failed: ${response.status}`);
        }
 
        const data: PreviewData = await response.json();
        setPreviewData(data);
      } catch (err: any) {
        console.error("Preview fetch error:", err);
        setPreviewError(err.message || "Failed to load preview");
        toast.error("Could not load dataset preview");
      } finally {
        setPreviewLoading(false);
      }
    };
 
    fetchPreview();
  }, [previewDataset, userId]);
 
  const filteredDatasets = datasets.filter((dataset) => {
    const matchesSearch = dataset.datasetName
      .toLowerCase()
      .includes(datasetSearch.trim().toLowerCase());
 
    let matchesDate = true;
    if (datasetDateFilter) {
      const lastRunDate = new Date(dataset.completedAt);
      matchesDate =
        lastRunDate.toDateString() === datasetDateFilter.toDateString();
    }
 
    return matchesSearch && matchesDate;
  });
 
  const clearDateFilter = () => {
    setDatasetDateFilter(undefined);
  };
 
  // Handle Navigation button click → store user_id, job_id, dataset_name
  const handleNavigateToPathSelection = (dataset: Dataset) => {
    if (!dataset.job_id) {
      toast.error("Missing job ID for this dataset");
      return;
    }
 
    // Store the required values in localStorage
    localStorage.setItem("selected_user_id", userId || "");
    localStorage.setItem("selected_job_id", dataset.job_id);
    localStorage.setItem("selected_dataset_name", dataset.datasetName);
 
    // Optional: toast confirmation
    toast.success(`Navigating with dataset: ${dataset.datasetName}`);
 
    // Navigate to the path selection page
    navigate("/PathSelection1");
  };
 
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-md sticky top-0 z-20 bg-background/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Veritas</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, <span className="text-primary">{userName}</span>
                </p>
              </div>
            </div>
 
            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <BarChart3 className="w-4 h-4" />
                Jobs
              </button>
 
              <button
                onClick={() => navigate("/pipelines")}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Pipelines
              </button>
 
              <button
                onClick={() => navigate("/datasets")}
                className={`flex items-center gap-2 font-medium pb-1 transition-all ${
                  location.pathname === "/datasets"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <TableIcon className="w-4 h-4" />
                Datasets
              </button>
 
              <div className="flex items-center gap-3">
                <ThemeToggle />
 
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-accent rounded-full"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>
 
      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">
                  All Datasets ({filteredDatasets.length})
                </h2>
                <p className="text-muted-foreground">
                  View and manage your processed datasets
                </p>
              </div>
            </div>
 
            {/* Filters */}
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
                  <button
                    onClick={() => setDatasetSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
 
              {/* Date filter with clear button */}
              <div className="relative w-40">
                <Input
                  type="date"
                  value={
                    datasetDateFilter ? format(datasetDateFilter, "yyyy-MM-dd") : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setDatasetDateFilter(new Date(e.target.value));
                    } else {
                      setDatasetDateFilter(undefined);
                    }
                  }}
                  className="w-full text-center peer pr-10"
                  placeholder=" "
                />
                <label
                  className="
                    absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
                    bg-background transition-all peer-placeholder-shown:top-1/2
                    peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
                    peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
                  "
                >
                  filter by date
                </label>
 
                {datasetDateFilter && (
                  <button
                    onClick={clearDateFilter}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label="Clear date filter"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
 
              {/* Clear all filters */}
              {(datasetSearch || datasetDateFilter) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDatasetSearch("");
                    setDatasetDateFilter(undefined);
                  }}
                  className="h-10 px-3 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  Clear all
                </Button>
              )}
            </div>
 
            {/* Table */}
            <Card className="border border-border overflow-hidden">
              {loading ? (
                <div className="py-12 text-center text-muted-foreground">
                  Loading datasets...
                </div>
              ) : filteredDatasets.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No datasets found
                </div>
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setPreviewDataset(dataset)}
                            disabled={!dataset.job_id}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleNavigateToPathSelection(dataset)}
                          >
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
 
      {/* Preview Modal – unchanged from your version */}
      {previewDataset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-5xl relative bg-background border-border">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setPreviewDataset(null)}
            >
              <X className="h-5 w-5" />
            </Button>
 
            <div className="p-6 pt-14">
              <h3 className="text-xl font-semibold mb-6">
                Preview: {previewDataset.datasetName}
              </h3>
 
              <div className="border border-border rounded-lg overflow-hidden max-h-[65vh] overflow-y-auto">
                <div className="p-4 text-muted-foreground">
                  Rows: {previewDataset.rows} • Columns: {previewDataset.columns}
                  <br />
                  Path: {previewDataset.filePath}
                  <br />
                  Scheduled: {previewDataset.isScheduled ? "Yes" : "No"}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
 
export default DatasetTab;
 