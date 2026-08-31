// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   BarChart3,
//   Table as TableIcon,
//   Plus,
//   Search,
//   Calendar,
//   Play,
//   Eye,
//   Edit,
//   Database,
//   LogOut,
//   GitBranch,
//   Loader2,
//   X,
//   Settings,
//   Clock,
//   Sparkles,
// } from "lucide-react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { toast } from "sonner";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import Header from "@/components/layout/Header-main";
// interface ApiJob {
//   job_id: string;
//   job_name: string;
//   created_at: string;
// }

// interface DetailedJobResponse {
//   user_id: string;
//   job_id: string;
//   job_name: string;
//   created_at: string;
//   overall_job_status: string | null;
//   overall_last_job_run: string | null;
//   schedule: {
//     frequency?: string;
//     time_utc?: string;
//     scheduled_at?: string;
//   } | null;
//   datasource_paths: string[];
//   dq_enabled: boolean;
//   ner_enabled: boolean;
//   business_logic_enabled: boolean;
//   business_logic_rules?: Record<string, string>;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   createdAt: string;
//   lastRun: string;
//   status: "Completed" | "PENDING" | "Created" | "Running" | "Failed";
//   steps: {
//     dqRules: "skipped" | "executed";
//     ner: "skipped" | "executed";
//     businessLogic: "skipped" | "executed";
//     dataTransformations: "skipped" | "executed";
//   };
// }

// const API_BASE = "https://api.veriton.ai/api/service2";

// const Jobs = () => {
//   const navigate = useNavigate();
//   const [viewMode, setViewMode] = useState<"chart" | "table">("table");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedJob, setSelectedJob] = useState<DetailedJobResponse | null>(
//     null,
//   );
//   const [showJobModal, setShowJobModal] = useState(false);
//   const [modalLoading, setModalLoading] = useState(false);
//   const [autoMLLoading, setAutoMLLoading] = useState(false);

//   const storedUser = localStorage.getItem("user");
//   const user = storedUser ? JSON.parse(storedUser) : null;
//   const userName = user?.name || user?.email?.split("@")[0] || "User";
//   const userId = user?.id || user?.user_id;

//   // Reusable X close button for all toasts (Sonner style)
//   const closeToastButton = (
//     <button
//       onClick={() => toast.dismiss()}
//       className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
//       aria-label="Close toast"
//     >
//       <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
//     </button>
//   );


//   // Load persisted job statuses from localStorage on mount
//   useEffect(() => {
//     const persistedStatuses = localStorage.getItem("jobStatuses");
//     if (persistedStatuses) {
//       try {
//         const parsed = JSON.parse(persistedStatuses);
//         setJobs((prevJobs) =>
//           prevJobs.map((job) => {
//             const persisted = parsed[job.id];
//             if (persisted) {
//               return {
//                 ...job,
//                 status: persisted.status,
//                 lastRun: persisted.lastRun || job.lastRun,
//               };
//             }
//             return job;
//           }),
//         );
//       } catch (e) {
//         console.error("Failed to parse persisted job statuses", e);
//       }
//     }
//   }, []);

//   const handleLogout = () => {
//     localStorage.clear();
//     // localStorage.removeItem("user");
//     // localStorage.removeItem("token");
//     // localStorage.removeItem("jobStatuses");
//     toast.success("Logged out successfully", {
//       action: closeToastButton,
//     });
//     navigate("/", { replace: true });
//   };

//   useEffect(() => {
//     const fetchJobs = async () => {
//       if (!userId) {
//         toast.error("User ID not found in localStorage", {
//           action: closeToastButton,
//         });
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const response = await fetch(
//           `https://api.veriton.ai/api/service1/get-all-jobs?user_id=${userId}`,
//         );
//         if (!response.ok) {
//           throw new Error(`Failed to fetch jobs: ${response.status}`);
//         }

//         const data = await response.json();

//         let mappedJobs: Job[] = data.jobs.map((item: ApiJob) => ({
//           id: item.job_id,
//           name: item.job_name || "Unnamed Job",
//           category: "Unknown",
//           createdAt: new Date(item.created_at).toLocaleString("en-US", {
//             month: "short",
//             day: "numeric",
//             year: "numeric",
//             hour: "numeric",
//             minute: "2-digit",
//             hour12: true,
//           }),
//           lastRun: "—",
//           status: "Created" as const,
//           steps: {
//             dqRules: "skipped",
//             ner: "skipped",
//             businessLogic: "skipped",
//             dataTransformations: "skipped",
//           },
//         }));

//         // Merge persisted statuses
//         const persistedStatusesStr = localStorage.getItem("jobStatuses");
//         if (persistedStatusesStr) {
//           try {
//             const persisted = JSON.parse(persistedStatusesStr);
//             mappedJobs = mappedJobs.map((job) => {
//               const persistedJob = persisted[job.id];
//               if (persistedJob) {
//                 return {
//                   ...job,
//                   status: persistedJob.status,
//                   lastRun: persistedJob.lastRun || job.lastRun,
//                 };
//               }
//               return job;
//             });
//           } catch (e) {
//             console.error("Failed to parse persisted statuses", e);
//           }
//         }

//         setJobs(mappedJobs);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//         toast.error("Failed to load jobs", {
//           action: closeToastButton,
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobs();
//   }, [userId]);

//   useEffect(() => {
//     if (jobs.length > 0) {
//       const statusMap: Record<string, { status: string; lastRun: string }> = {};
//       jobs.forEach((job) => {
//         statusMap[job.id] = {
//           status: job.status,
//           lastRun: job.lastRun,
//         };
//       });
//       localStorage.setItem("jobStatuses", JSON.stringify(statusMap));
//     }
//   }, [jobs]);

//   const filteredJobs = jobs.filter((job) => {
//     const matchesSearch = job.name
//       .toLowerCase()
//       .includes(searchQuery.toLowerCase());
//     const matchesCategory =
//       categoryFilter === "all" || job.category === categoryFilter;
//     const matchesStatus = statusFilter === "All" || job.status === statusFilter;
//     const jobDate = new Date(job.createdAt);
//     const afterStart = !startDate || jobDate >= new Date(startDate);
//     const beforeEnd = !endDate || jobDate <= new Date(endDate);
//     return (
//       matchesSearch &&
//       matchesCategory &&
//       matchesStatus &&
//       afterStart &&
//       beforeEnd
//     );
//   });

//   const jobsByCategory = [
//     {
//       name: "Unknown",
//       value: jobs.filter((j) => j.category === "Unknown").length,
//       color: "#3b82f6",
//     },
//     {
//       name: "Glue",
//       value: jobs.filter((j) => j.category === "Glue").length,
//       color: "#10b981",
//     },
//   ];

//   const jobsByStatus = [
//     {
//       name: "PENDING",
//       value: jobs.filter((j) => j.status === "PENDING").length,
//       color: "#f97316",
//     },
//     {
//       name: "Completed",
//       value: jobs.filter((j) => j.status === "Completed").length,
//       color: "#10b981",
//     },
//     {
//       name: "Created",
//       value: jobs.filter((j) => j.status === "Created").length,
//       color: "#6b7280",
//     },
//   ];

//   const hourlyData = Array.from({ length: 8 }, (_, i) => ({
//     time: `${String(i * 3).padStart(2, "0")}:00`,
//     jobs: 0,
//   }));

//   const runJob = (jobId: string) => {
//     setJobs((prevJobs) =>
//       prevJobs.map((job) =>
//         job.id === jobId
//           ? {
//               ...job,
//               status: "Running" as const,
//               lastRun: new Date().toLocaleString(),
//             }
//           : job,
//       ),
//     );
//     toast.success("Job started successfully", {
//       action: closeToastButton,
//     });

//     setTimeout(() => {
//       setJobs((prevJobs) =>
//         prevJobs.map((job) =>
//           job.id === jobId
//             ? {
//                 ...job,
//                 status: "Completed" as const,
//                 lastRun: new Date().toLocaleString(),
//               }
//             : job,
//         ),
//       );
//       toast.success("Job completed successfully", {
//         action: closeToastButton,
//       });
//     }, 3000);
//   };

//   const getStatusBadge = (status: string) => {
//     const styles: Record<string, string> = {
//       Completed: "bg-green-500/20 text-green-600 border-green-500/30",
//       PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
//       Created: "bg-gray-500/20 text-gray-600 border-gray-500/30",
//       Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
//       Failed: "bg-red-500/20 text-red-600 border-red-500/30",
//     };
//     return <Badge className={styles[status] || styles.Created}>{status}</Badge>;
//   };

//   const getStepBadge = (status: "skipped" | "executed") => {
//     if (status === "executed") {
//       return (
//         <Badge className="bg-primary/20 text-primary border-primary/30">
//           executed
//         </Badge>
//       );
//     }
//     return <Badge variant="secondary">skipped</Badge>;
//   };

//   const openJobDetails = async (job: Job) => {
//     if (!userId) {
//       toast.error("User ID not found. Please login again.", {
//         action: closeToastButton,
//       });
//       return;
//     }

//     setModalLoading(true);
//     setShowJobModal(true);
//     setSelectedJob(null);

//     try {
//       const response = await fetch(
//         `${API_BASE}/view-job?user_id=${userId}&job_id=${job.id}`,
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to fetch job details: ${response.status}`);
//       }

//       const data: DetailedJobResponse = await response.json();
//       setSelectedJob(data);
//     } catch (error) {
//       console.error("Error fetching job details:", error);
//       toast.error("Failed to load job details", {
//         action: closeToastButton,
//       });
//       setSelectedJob(null);
//     } finally {
//       setModalLoading(false);
//     }
//   };

//   const getS3Path = (paths: any[] = []) => {
//     return (
//       paths.find(
//         (path) => typeof path === "string" && path.startsWith("s3://"),
//       ) || "N/A"
//     );
//   };

//   const formatSchedule = (schedule: DetailedJobResponse["schedule"]) => {
//     if (!schedule) return "N/A";
//     const parts = [];
//     if (schedule.frequency) parts.push(`Frequency: ${schedule.frequency}`);
//     if (schedule.time_utc) parts.push(`Time (UTC): ${schedule.time_utc}`);
//     if (schedule.scheduled_at) {
//       const date = new Date(schedule.scheduled_at);
//       parts.push(
//         `Scheduled: ${date.toLocaleString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//           hour: "numeric",
//           minute: "2-digit",
//           hour12: true,
//         })}`,
//       );
//     }
//     return parts.join(" • ") || "N/A";
//   };

//   return (
//     <div className=" h-screen flex flex-col overflow-hidden">
//       {/* Header */}
//       <header className="border-b border-border backdrop-blur sticky">
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

//             <div className="flex items-center gap-3 md:gap-4">
//               {/* Logo */}
//               <a href="/" className="flex-shrink-0">
//                 <img
//                   src="/logo2.png"
//                   alt="Veriton"
//                   className="
//                     h-10               /* mobile base size */
//                     sm:h-10
//                     md:h-9 lg:h-10    /* larger on desktop */
//                     w-auto
//                     object-contain
//                     drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
//                     transition-transform duration-200
//                     hover:scale-105
//                   "
//                 />
//               </a>

//               {/* Welcome text – side by side */}
//               <div className="flex flex-col">
//                 <p className="text-sm md:text-base text-muted-foreground">
//                   Welcome,{" "}
//                   <span className="text-primary font-medium">
//                     {userName || "User"}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             <nav className="flex items-center gap-6">
//               <button
//                 onClick={() => navigate("/jobs")}
//                 className="flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1"
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
//                 onClick={() => navigate("/datasets")} // or any route you prefer
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <TableIcon className="w-4 h-4" />{" "}
//                 {/* Perfect icon for datasets */}
//                 Datasets
//               </button>

//               <button
//                 onClick={() => {
//                   // Optional: double-check (but usually not needed)
//                   if (!localStorage.getItem("aivolve_user")) {
//                     toast.info("Preparing Auto AI/ML...", { duration: 2000 });
//                   }
//                   navigate("/workflow/automl/jobs1");
//                   // or window.location.href = "/workflow/automl" if you still prefer hard redirect
//                 }}
//                 className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
//               >
//                 <Sparkles className="w-4 h-4" />
//                 Auto AI/ML
//               </button>

//               <div className="flex items-center gap-3">
//                 <ThemeToggle />

//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={handleLogout}
//                   className="hover:bg-primary rounded-full"
//                   title="Logout"
//                 >
//                   <LogOut className="h-4 w-4" />
//                 </Button>
//               </div>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-8 flex-1 overflow-y-auto">
//         {viewMode === "chart" ? (
//           <>
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-2xl font-bold">Your Jobs at a Glance</h2>
//                 <p className="text-muted-foreground">
//                   Track jobs by status, category, and time with ease.
//                 </p>
//               </div>
//               <Button variant="outline" onClick={() => setViewMode("table")}>
//                 <TableIcon className="w-4 h-4 mr-2" />
//                 Table View
//               </Button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <Card className="p-6">
//                 <h3 className="font-semibold mb-4">Jobs by Category</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={jobsByCategory}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={5}
//                         dataKey="value"
//                       >
//                         {jobsByCategory.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </Card>

//               <Card className="p-6">
//                 <h3 className="font-semibold mb-4">Job Status Distribution</h3>
//                 <div className="h-64">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={jobsByStatus}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={5}
//                         dataKey="value"
//                       >
//                         {jobsByStatus.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </Card>
//             </div>

//             <Card className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold">
//                   Glue Jobs Created by Hour (Total Glue Jobs:{" "}
//                   {jobs.filter((j) => j.category === "Glue").length})
//                 </h3>
//                 <Select defaultValue="daily">
//                   <SelectTrigger className="w-40">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily (by Hour)</SelectItem>
//                     <SelectItem value="weekly">Weekly</SelectItem>
//                     <SelectItem value="monthly">Monthly</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="h-64">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={hourlyData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line
//                       type="monotone"
//                       dataKey="jobs"
//                       name="Glue Jobs"
//                       stroke="#3b82f6"
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </Card>
//           </>
//         ) : (
//           <>
//             <div className="flex items-center justify-between mb-8">
//               <div>
//                 <h2 className="text-2xl font-bold">
//                   All Jobs ({filteredJobs.length})
//                 </h2>
//                 <p className="text-muted-foreground">
//                   View and manage your jobs
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 {/* <Button variant="outline" onClick={() => setViewMode("chart")}>
//                   <BarChart3 className="w-4 h-4 mr-2" />
//                   Chart View
//                 </Button> */}
//                 {/* <Button onClick={() => navigate("/workflow/data-ingestion")}>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create Job
//                 </Button> */}
//                 <Button
//                   onClick={() => {
//                     // Modern browsers support crypto.randomUUID()
//                     const newJobId = crypto.randomUUID().replace(/-/g, "");

//                     localStorage.setItem("current_job_id", newJobId);

//                     navigate("/workflow/data-ingestion");
//                   }}
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Create Job
//                 </Button>
//               </div>
//             </div>

//             <div className="p-4 mb-6">
//               <div className="flex flex-wrap items-center gap-4">
//                 <div className="relative flex-1 min-w-[200px]">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                   <Input
//                     placeholder="Search jobs..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10"
//                   />
//                 </div>

//                 <div className="flex flex-col sm:flex-row gap-4">
//                   <div className="relative w-40">
//                     <Input
//                       type="date"
//                       value={startDate}
//                       onChange={(e) => setStartDate(e.target.value)}
//                       className="w-full text-center peer"
//                       placeholder=" "
//                     />
//                     <label
//                       className="
//             absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
//             bg-background transition-all peer-placeholder-shown:top-1/2
//             peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
//             peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
//           "
//                     >
//                       Start Date
//                     </label>
//                   </div>

//                   <div className="relative w-40">
//                     <Input
//                       type="date"
//                       value={endDate}
//                       onChange={(e) => setEndDate(e.target.value)}
//                       className="w-full text-center peer"
//                       placeholder=" "
//                     />
//                     <label
//                       className="
//             absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
//             bg-background transition-all peer-placeholder-shown:top-1/2
//             peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
//             peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
//           "
//                     >
//                       End Date
//                     </label>
//                   </div>

//                   {/* Status dropdown with floating label */}
//                   <div className="relative w-40">
//                     <Select
//                       value={statusFilter}
//                       onValueChange={setStatusFilter}
//                     >
//                       <SelectTrigger
//                         className="
//               w-full text-center peer
//               [&>span]:text-muted-foreground/70
//               peer-placeholder-shown:text-muted-foreground/70
//               focus-within:text-foreground
//             "
//                       >
//                         <SelectValue placeholder=" " />
//                       </SelectTrigger>
//                       <label
//                         className="
//               absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
//               bg-background transition-all peer-placeholder-shown:top-1/2
//               peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
//               peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
//             "
//                       >
//                         Status
//                       </label>
//                       <SelectContent>
//                         <SelectItem className="hover:bg-primary/30" value="All">
//                           All Statuses
//                         </SelectItem>
//                         <SelectItem
//                           className="hover:bg-primary/30"
//                           value="Created"
//                         >
//                           Created
//                         </SelectItem>
//                         <SelectItem
//                           className="hover:bg-primary/30"
//                           value="Running"
//                         >
//                           Running
//                         </SelectItem>
//                         <SelectItem
//                           className="hover:bg-primary/30"
//                           value="Completed"
//                         >
//                           Completed
//                         </SelectItem>
//                         <SelectItem
//                           className="hover:bg-primary/30"
//                           value="Failed"
//                         >
//                           Failed
//                         </SelectItem>
//                         <SelectItem
//                           className="hover:bg-primary/30"
//                           value="PENDING"
//                         >
//                           Pending
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <Button
//                   variant="ghost"
//                   onClick={() => {
//                     setSearchQuery("");
//                     setCategoryFilter("all");
//                     setStatusFilter("All");
//                     setStartDate("");
//                     setEndDate("");
//                   }}
//                   className="border border-border"
//                 >
//                   Clear
//                 </Button>
//               </div>
//             </div>

//             <Card className="min-h-[300px] flex flex-col">
//               {loading ? (
//                 <div className="flex-1 flex items-center justify-center py-12">
//                   <div className="flex flex-col items-center gap-3">
//                     <Loader2 className="h-10 w-10 animate-spin text-primary" />
//                     <p className="text-muted-foreground">
//                       Loading your jobs...
//                     </p>
//                   </div>
//                 </div>
//               ) : filteredJobs.length === 0 ? (
//                 <div className="flex-1 py-12 text-center text-muted-foreground">
//                   No jobs found matching your filters
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto flex-1">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b border-border">
//                         <th className="text-left p-4 font-medium text-muted-foreground">
//                           Job Name
//                         </th>
//                         <th className="text-left p-4 font-medium text-muted-foreground">
//                           Created At
//                         </th>
//                         <th className="text-left p-4 font-medium text-muted-foreground">
//                           Last Run
//                         </th>
//                         <th className="text-left p-4 font-medium text-muted-foreground">
//                           Status
//                         </th>
//                         <th className="text-center p-4 font-medium text-muted-foreground">
//                           Actions
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredJobs.map((job) => (
//                         <tr
//                           key={job.id}
//                           className="border-b border-border last:border-0 hover:bg-muted/30"
//                         >
//                           <td className="p-4 font-medium">{job.name}</td>
//                           <td className="p-4 text-muted-foreground">
//                             {job.createdAt}
//                           </td>
//                           <td className="p-4 text-muted-foreground">
//                             {job.lastRun}
//                           </td>
//                           <td className="p-4">{getStatusBadge(job.status)}</td>
//                           <td className="p-4">
//                             <div className="flex items-center justify-center gap-2">
//                               <Button
//                                 size="icon"
//                                 className="bg-primary hover:bg-primary/90 h-8 w-8"
//                                 onClick={() => runJob(job.id)}
//                                 disabled={
//                                   job.status === "Running" ||
//                                   job.status === "Completed"
//                                 }
//                               >
//                                 <Play className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 className="h-8 w-8"
//                                 onClick={() => openJobDetails(job)}
//                               >
//                                 <Eye className="w-4 h-4" />
//                               </Button>
//                               <Button
//                                 size="icon"
//                                 variant="ghost"
//                                 className="h-8 w-8"
//                                 onClick={() =>
//                                   navigate(`/edit-job/${job.id}`, {
//                                     state: {
//                                       business_logic_rules:
//                                         selectedJob?.business_logic_rules || {},
//                                     },
//                                   })
//                                 }
//                               >
//                                 <Edit className="w-4 h-4" />
//                               </Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//             </Card>
//           </>
//         )}
//       </main>

//       {/* Job Details Modal */}
//       <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
//         <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-6">
//           <DialogHeader className="flex flex-row items-center justify-between pb-4 ">
//             <DialogTitle className="text-2xl font-bold">
//               Job Details - {selectedJob?.job_name || "Loading..."}
//             </DialogTitle>
//             <DialogClose asChild>
//               <Button variant="ghost" size="icon">
//                 <X className="h-5 w-5" />
//               </Button>
//             </DialogClose>
//           </DialogHeader>

//           {modalLoading ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//               <p className="text-muted-foreground">Loading job details...</p>
//             </div>
//           ) : selectedJob ? (
//             <>
//               <div className="grid grid-cols-2 gap-4 mb-6">
//                 <Card className="p-4 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Settings className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Job Name</p>
//                     <p className="font-medium">
//                       {selectedJob.job_name || "N/A"}
//                     </p>
//                   </div>
//                 </Card>
//                 <Card className="p-4 flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Database className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <p className="text-sm text-muted-foreground">Data Source</p>
//                     <p className="font-medium">
//                       {getS3Path(selectedJob.datasource_paths)}
//                     </p>
//                   </div>
//                 </Card>
//               </div>

//               <Card className="p-6 mb-6">
//                 <div className="grid grid-cols-2 gap-8">
//                   <div>
//                     <h4 className="font-semibold mb-4">Job Information</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Job Name:
//                         </p>
//                         <p className="font-medium">
//                           {selectedJob.job_name || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Created At:
//                         </p>
//                         <p className="font-medium">
//                           {new Date(selectedJob.created_at).toLocaleString(
//                             "en-US",
//                             {
//                               month: "short",
//                               day: "numeric",
//                               year: "numeric",
//                               hour: "numeric",
//                               minute: "2-digit",
//                               hour12: true,
//                             },
//                           )}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Data Source:
//                         </p>
//                         <p className="font-medium">
//                           {getS3Path(selectedJob.datasource_paths)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div>
//                     <h4 className="font-semibold mb-4">Execution Details</h4>
//                     <div className="space-y-3">
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Overall Status:
//                         </p>
//                         <Badge variant="outline">
//                           {selectedJob.overall_job_status || "N/A"}
//                         </Badge>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Last Run:
//                         </p>
//                         <p className="font-medium">
//                           {selectedJob.overall_last_job_run
//                             ? new Date(
//                                 selectedJob.overall_last_job_run,
//                               ).toLocaleString("en-US", {
//                                 month: "short",
//                                 day: "numeric",
//                                 year: "numeric",
//                                 hour: "numeric",
//                                 minute: "2-digit",
//                                 hour12: true,
//                               })
//                             : "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-sm text-muted-foreground">
//                           Schedule:
//                         </p>
//                         <p className="font-medium">
//                           {formatSchedule(selectedJob.schedule)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </Card>

//               <h3 className="text-lg font-semibold mb-4">Job Stages (3)</h3>
//               <div className="grid grid-cols-3 gap-4 mb-6">
//                 <Card className="p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Settings className="w-4 h-4 text-primary" />
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm font-medium">Stage 1</span>
//                       <Clock className="w-3 h-3 text-muted-foreground" />
//                     </div>
//                   </div>
//                   <p className="font-medium mb-2">DQ Rules</p>
//                   {getStepBadge(
//                     selectedJob.dq_enabled ? "executed" : "skipped",
//                   )}
//                 </Card>

//                 <Card className="p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
//                       <Settings className="w-4 h-4 text-orange-500" />
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm font-medium">Stage 2</span>
//                       <Clock className="w-3 h-3 text-muted-foreground" />
//                     </div>
//                   </div>
//                   <p className="font-medium mb-2">NER</p>
//                   {getStepBadge(
//                     selectedJob.ner_enabled ? "executed" : "skipped",
//                   )}
//                 </Card>

//                 <Card className="p-4">
//                   <div className="flex items-center gap-2 mb-2">
//                     <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                       <Settings className="w-4 h-4 text-primary" />
//                     </div>
//                     <div className="flex items-center gap-1">
//                       <span className="text-sm font-medium">Stage 3</span>
//                       <Clock className="w-3 h-3 text-muted-foreground" />
//                     </div>
//                   </div>
//                   <p className="font-medium mb-2">Business Logic</p>
//                   {getStepBadge(
//                     selectedJob.business_logic_enabled ? "executed" : "skipped",
//                   )}
//                 </Card>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-12 text-muted-foreground">
//               No job details available
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default Jobs;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  Table as TableIcon,
  Plus,
  Search,
  Play,
  Eye,
  Edit,
  Database,
  LogOut,
  GitBranch,
  Loader2,
  X,
  Settings,
  Clock,
  Sparkles,
  Network,
  Key,
  Link2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  FileText,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";

interface ApiJob {
  job_id: string;
  job_name: string;
  created_at: string;
}

// ---------- view-job response types ----------

interface IngestionItem {
  source_type: string;
  destination_path?: string;
  s3path?: string[];
  s3ServiceUrl?: string;
  blobpath?: string[];
  snowflake_table?: string[];
  table?: string[];
  container_name?: string;
  file_path?: string[];
  sap_host?: string;
  sap_port?: number;
  sap_username?: string;
  sap_schema?: string;
  sap_tables?: string[];
  [key: string]: unknown;
}

interface IngestionTableResult {
  table: string;
  success: boolean;
  rows: number;
  size_mb: number;
  blob_url: string | null;
  error: string | null;
}

interface IngestionResult {
  source: string;
  effective_destination: string;
  status: string;
  response: {
    message?: string;
    results?: IngestionTableResult[];
  };
}

interface JobSchedule {
  frequency?: string;
  time_utc?: string;
  scheduled_at?: string;
  active?: boolean;
}

interface JobCore {
  job_id: string;
  created_at: string;
  status: string;
  sources: string[];
  items: IngestionItem[];
  results: IngestionResult[];
  post_processing?: {
    blob_to_onelake_transfer?: {
      triggered: boolean;
      attempted_at?: string;
      status?: string;
      response?: {
        files_transferred?: number;
        onelake_paths?: string[];
      };
    };
  };
  completed_at?: string;
  job_name: string;
  schedule?: JobSchedule | null;
}

interface DatasetColumnMapping {
  source_name: string;
  source_type: string;
  columns: string[];
}

interface CreateDataset {
  job_id: string;
  custom_table_name: string;
  request_body: {
    column_mappings: DatasetColumnMapping[];
    join_type: string;
  };
  file_path: string;
  rows: number;
  columns: string[];
  timestamp: string;
}

interface ViewJobResponse {
  user_id: string;
  job_id: string;
  job: JobCore;
  pipelines: unknown[];
  create_datasets: CreateDataset[];
  dq_enabled: boolean;
  ner_enabled: boolean;
  business_logic_enabled: boolean;
}

// ---------- get_schema_metadata response types ----------

interface SchemaColumn {
  name: string;
  data_type: string;
  null_percentage: number;
  distinct_count: number;
  is_primary_key: boolean;
  is_surrogate: boolean;
  is_foreign_key: boolean;
  display_label: string;
  tooltip: string;
}

interface SchemaForeignKey {
  column: string;
  references_table: string;
  references_column: string | null;
}

interface SchemaTable {
  table_name: string;
  table_type: "SOURCE" | "FACT" | "DIM" | string;
  derived_from?: string;
  is_normalized?: boolean;
  row_count: number;
  column_count: number;
  null_percentage: number;
  primary_keys: string[];
  surrogate_keys: string[];
  foreign_keys: SchemaForeignKey[];
  columns: SchemaColumn[];
}

interface SchemaRelationship {
  from_table: string;
  from_column: string;
  to_table: string;
  to_column: string | null;
  relationship_type: string;
  description?: string;
  confidence?: number | null;
}

interface SchemaSummary {
  total_tables: number;
  fact_tables: string[];
  dimension_tables: string[];
  physical_source_tables: string[];
  total_relationships: number;
  total_rows: number;
}

interface SchemaMetadataResponse {
  user_id: string;
  job_id: string;
  analysis_timestamp: string;
  model: {
    type: string;
    fact_table: string;
    dimension_tables: string[];
  };
  tables: SchemaTable[];
  relationships: SchemaRelationship[];
  summary: SchemaSummary;
  observations: string[];
}

interface PreviewDatasetResponse {
  dataset: string;
  user_id: string;
  job_id: string;
  total_rows: number;
  total_columns: number;
  columns: string[];
  column_types: Record<string, string>;
  preview_rows: Record<string, unknown>[];
  preview_row_count: number;
}

interface Job {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  lastRun: string;
  status: "Completed" | "PENDING" | "Created" | "Running" | "Failed";
  steps: {
    dqRules: "skipped" | "executed";
    ner: "skipped" | "executed";
    businessLogic: "skipped" | "executed";
    dataTransformations: "skipped" | "executed";
  };
}

const API_BASE = "https://api.veriton.ai/api/service2";

const Jobs = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedJob, setSelectedJob] = useState<ViewJobResponse | null>(null);
  const [selectedSchema, setSelectedSchema] =
    useState<SchemaMetadataResponse | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [schemaLoading, setSchemaLoading] = useState(false);
  const [schemaError, setSchemaError] = useState(false);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>(
    {},
  );
  const [previewOpenFor, setPreviewOpenFor] = useState<Record<string, boolean>>(
    {},
  );
  const [previewData, setPreviewData] = useState<
    Record<string, PreviewDatasetResponse>
  >({});
  const [previewLoading, setPreviewLoading] = useState<Record<string, boolean>>(
    {},
  );

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userId = user?.id || user?.user_id;

  // Reusable X close button for all toasts (Sonner style)
  const closeToastButton = (
    <button
      onClick={() => toast.dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // Load persisted job statuses from localStorage on mount
  useEffect(() => {
    const persistedStatuses = localStorage.getItem("jobStatuses");
    if (persistedStatuses) {
      try {
        const parsed = JSON.parse(persistedStatuses);
        setJobs((prevJobs) =>
          prevJobs.map((job) => {
            const persisted = parsed[job.id];
            if (persisted) {
              return {
                ...job,
                status: persisted.status,
                lastRun: persisted.lastRun || job.lastRun,
              };
            }
            return job;
          }),
        );
      } catch (e) {
        console.error("Failed to parse persisted job statuses", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully", {
      action: closeToastButton,
    });
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!userId) {
        toast.error("User ID not found in localStorage", {
          action: closeToastButton,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://api.veriton.ai/api/service1/get-all-jobs?user_id=${userId}`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();

        let mappedJobs: Job[] = data.jobs.map((item: ApiJob) => ({
          id: item.job_id,
          name: item.job_name || "Unnamed Job",
          category: "Unknown",
          createdAt: new Date(item.created_at).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          lastRun: "—",
          status: "Created" as const,
          steps: {
            dqRules: "skipped",
            ner: "skipped",
            businessLogic: "skipped",
            dataTransformations: "skipped",
          },
        }));

        // Merge persisted statuses
        const persistedStatusesStr = localStorage.getItem("jobStatuses");
        if (persistedStatusesStr) {
          try {
            const persisted = JSON.parse(persistedStatusesStr);
            mappedJobs = mappedJobs.map((job) => {
              const persistedJob = persisted[job.id];
              if (persistedJob) {
                return {
                  ...job,
                  status: persistedJob.status,
                  lastRun: persistedJob.lastRun || job.lastRun,
                };
              }
              return job;
            });
          } catch (e) {
            console.error("Failed to parse persisted statuses", e);
          }
        }

        setJobs(mappedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs", {
          action: closeToastButton,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId]);

  useEffect(() => {
    if (jobs.length > 0) {
      const statusMap: Record<string, { status: string; lastRun: string }> = {};
      jobs.forEach((job) => {
        statusMap[job.id] = {
          status: job.status,
          lastRun: job.lastRun,
        };
      });
      localStorage.setItem("jobStatuses", JSON.stringify(statusMap));
    }
  }, [jobs]);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || job.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    const jobDate = new Date(job.createdAt);
    const afterStart = !startDate || jobDate >= new Date(startDate);
    const beforeEnd = !endDate || jobDate <= new Date(endDate);
    return (
      matchesSearch &&
      matchesCategory &&
      matchesStatus &&
      afterStart &&
      beforeEnd
    );
  });

  const jobsByCategory = [
    {
      name: "Unknown",
      value: jobs.filter((j) => j.category === "Unknown").length,
      color: "#3b82f6",
    },
    {
      name: "Glue",
      value: jobs.filter((j) => j.category === "Glue").length,
      color: "#10b981",
    },
  ];

  const jobsByStatus = [
    {
      name: "PENDING",
      value: jobs.filter((j) => j.status === "PENDING").length,
      color: "#f97316",
    },
    {
      name: "Completed",
      value: jobs.filter((j) => j.status === "Completed").length,
      color: "#10b981",
    },
    {
      name: "Created",
      value: jobs.filter((j) => j.status === "Created").length,
      color: "#6b7280",
    },
  ];

  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    time: `${String(i * 3).padStart(2, "0")}:00`,
    jobs: 0,
  }));

  const runJob = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: "Running" as const,
              lastRun: new Date().toLocaleString(),
            }
          : job,
      ),
    );
    toast.success("Job started successfully", {
      action: closeToastButton,
    });

    setTimeout(() => {
      setJobs((prevJobs) =>
        prevJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: "Completed" as const,
                lastRun: new Date().toLocaleString(),
              }
            : job,
        ),
      );
      toast.success("Job completed successfully", {
        action: closeToastButton,
      });
    }, 3000);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: "bg-green-500/20 text-green-600 border-green-500/30",
      PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Created: "bg-gray-500/20 text-gray-600 border-gray-500/30",
      Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Failed: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return <Badge className={styles[status] || styles.Created}>{status}</Badge>;
  };

  const getStepBadge = (status: "skipped" | "executed") => {
    if (status === "executed") {
      return (
        <Badge className="bg-primary/20 text-primary border-primary/30">
          executed
        </Badge>
      );
    }
    return <Badge variant="secondary">skipped</Badge>;
  };

  const openJobDetails = async (job: Job) => {
    if (!userId) {
      toast.error("User ID not found. Please login again.", {
        action: closeToastButton,
      });
      return;
    }

    setModalLoading(true);
    setSchemaLoading(true);
    setSchemaError(false);
    setShowJobModal(true);
    setSelectedJob(null);
    setSelectedSchema(null);
    setExpandedTables({});
    setPreviewOpenFor({});
    setPreviewData({});
    setPreviewLoading({});

    const viewJobPromise = fetch(
      `${API_BASE}/view-job?user_id=${userId}&job_id=${job.id}`,
    ).then((res) => {
      if (!res.ok) throw new Error(`Failed to fetch job details: ${res.status}`);
      return res.json() as Promise<ViewJobResponse>;
    });

    const schemaPromise = fetch(
      `${API_BASE}/get_schema_metadata/${userId}?job_id=${job.id}`,
    ).then((res) => {
      if (!res.ok)
        throw new Error(`Failed to fetch schema metadata: ${res.status}`);
      return res.json() as Promise<SchemaMetadataResponse>;
    });

    const [viewJobResult, schemaResult] = await Promise.allSettled([
      viewJobPromise,
      schemaPromise,
    ]);

    if (viewJobResult.status === "fulfilled") {
      setSelectedJob(viewJobResult.value);
    } else {
      console.error("Error fetching job details:", viewJobResult.reason);
      toast.error("Failed to load job details", {
        action: closeToastButton,
      });
    }
    setModalLoading(false);

    if (schemaResult.status === "fulfilled") {
      setSelectedSchema(schemaResult.value);
    } else {
      console.error("Error fetching schema metadata:", schemaResult.reason);
      setSchemaError(true);
    }
    setSchemaLoading(false);
  };

  const toggleTableExpand = (key: string) => {
    setExpandedTables((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "N/A";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatSchedule = (schedule?: JobSchedule | null) => {
    if (!schedule) return "N/A";
    const parts: string[] = [];
    if (schedule.frequency) parts.push(`Frequency: ${schedule.frequency}`);
    if (schedule.time_utc) parts.push(`Time (UTC): ${schedule.time_utc}`);
    if (schedule.scheduled_at)
      parts.push(`Scheduled: ${formatDate(schedule.scheduled_at)}`);
    if (typeof schedule.active === "boolean")
      parts.push(schedule.active ? "Active" : "Inactive");
    return parts.join(" • ") || "N/A";
  };

  // Looks up the SOURCE-type schema entry for an ingested table so we can show its columns
  const getSourceTableColumns = (tableName: string): SchemaColumn[] | null => {
    if (!selectedSchema) return null;
    const match = selectedSchema.tables?.find(
      (t) =>
        t.table_type === "SOURCE" &&
        t.table_name.toLowerCase() === tableName.toLowerCase(),
    );
    return match ? match.columns : null;
  };

  // Dataset column-mapping source names come back prefixed with internal ids
  // (e.g. "{user_id}_{internal_id}_fact_table") — strip those down to the plain table name.
  const cleanSourceName = (sourceName: string): string => {
    if (!sourceName) return sourceName;
    let name = sourceName;
    if (userId && name.startsWith(`${userId}_`)) {
      name = name.slice(userId.length + 1);
    }
    name = name.replace(/^([0-9a-fA-F]{8,}(-[0-9a-fA-F]{4,}){0,4}_)+/, "");
    return name || sourceName;
  };

  // "Built from" groups: prefer the explicit column_mappings from the API. If that's
  // missing/empty (some jobs don't return it), fall back to inferring groups from the
  // dataset's own column name prefixes (e.g. "employee_role" -> "Employee").
  const getBuiltFromGroups = (
    ds: CreateDataset,
  ): { label: string; columns: string[] }[] => {
    const mappings = ds.request_body?.column_mappings;
    if (mappings && mappings.length > 0) {
      return mappings.map((cm) => ({
        label: cleanSourceName(cm.source_name),
        columns: cm.columns,
      }));
    }

    if (!ds.columns || ds.columns.length === 0) return [];

    const groups: Record<string, string[]> = {};
    const coreLabel = "Fact table";
    ds.columns.forEach((col) => {
      const underscoreIdx = col.indexOf("_");
      if (underscoreIdx > 0) {
        const prefix = col.slice(0, underscoreIdx);
        const label = prefix.charAt(0).toUpperCase() + prefix.slice(1);
        (groups[label] ||= []).push(col);
      } else {
        (groups[coreLabel] ||= []).push(col);
      }
    });

    // Keep the fact/core columns first, then alphabetical
    return Object.entries(groups)
      .sort(([a], [b]) => {
        if (a === coreLabel) return -1;
        if (b === coreLabel) return 1;
        return a.localeCompare(b);
      })
      .map(([label, columns]) => ({ label, columns }));
  };

  const togglePreview = async (datasetName: string) => {
    const isOpen = previewOpenFor[datasetName];
    setPreviewOpenFor((prev) => ({ ...prev, [datasetName]: !isOpen }));

    if (isOpen || previewData[datasetName] || !userId || !selectedJob) return;

    setPreviewLoading((prev) => ({ ...prev, [datasetName]: true }));
    try {
      const res = await fetch(
        `${API_BASE}/preview-dataset?user_id=${userId}&job_id=${selectedJob.job_id}&datasetname=${encodeURIComponent(datasetName)}`,
      );
      if (!res.ok) throw new Error(`Failed to fetch preview: ${res.status}`);
      const data: PreviewDatasetResponse = await res.json();
      setPreviewData((prev) => ({ ...prev, [datasetName]: data }));
    } catch (error) {
      console.error("Error fetching dataset preview:", error);
      toast.error("Failed to load dataset preview", {
        action: closeToastButton,
      });
    } finally {
      setPreviewLoading((prev) => ({ ...prev, [datasetName]: false }));
    }
  };

  const StepHeader = ({
    number,
    title,
    icon: Icon,
    subtitle,
  }: {
    number: number;
    title: string;
    icon: React.ElementType;
    subtitle?: string;
  }) => (
    <div className="flex items-center gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary flex-shrink-0">
        {number}
      </div>
      <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      <div>
        <h3 className="text-lg font-semibold leading-tight">{title}</h3>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );

  const renderSchemaTableCard = (table: SchemaTable, index: number) => {
    const key = `${table.table_name}-${table.table_type}-${index}`;
    const expanded = !!expandedTables[key];
    const typeStyles: Record<string, string> = {
      SOURCE: "bg-gray-500/20 text-gray-600 border-gray-500/30",
      FACT: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      DIM: "bg-purple-500/20 text-purple-600 border-purple-500/30",
    };

    return (
      <Card key={key} className="p-4">
        <button
          className="w-full flex items-center justify-between gap-3 text-left"
          onClick={() => toggleTableExpand(key)}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Badge className={typeStyles[table.table_type] || typeStyles.SOURCE}>
              {table.table_type}
            </Badge>
            <span className="font-medium truncate">{table.table_name}</span>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0 text-sm text-muted-foreground">
            <span>{table.row_count.toLocaleString()} rows</span>
            <span>{table.column_count} cols</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>
        </button>

        {expanded && (
          <div className="mt-4 border-t border-border pt-4">
            {table.derived_from && table.derived_from !== table.table_name && (
              <p className="text-xs text-muted-foreground mb-3">
                Derived from{" "}
                <span className="font-medium">{table.derived_from}</span>
              </p>
            )}
            <div className="max-h-56 overflow-y-auto space-y-1.5">
              {table.columns.map((col) => (
                <div
                  key={col.name}
                  className="flex items-center justify-between gap-2 text-sm py-1"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{col.display_label}</span>
                    {col.is_primary_key && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        <Key className="w-2.5 h-2.5 mr-1" />
                        PK
                      </Badge>
                    )}
                    {col.is_foreign_key && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        <Link2 className="w-2.5 h-2.5 mr-1" />
                        FK
                      </Badge>
                    )}
                    {col.is_surrogate && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        AI ✨
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {col.data_type}
                    {col.null_percentage > 0 && ` • ${col.null_percentage}% null`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className=" h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border backdrop-blur sticky">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              {/* Logo */}
              <a href="/" className="flex-shrink-0">
                <img
                  src="/logo2.png"
                  alt="Veriton"
                  className="
                    h-10               /* mobile base size */
                    sm:h-10
                    md:h-9 lg:h-10    /* larger on desktop */
                    w-auto
                    object-contain
                    drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
                    transition-transform duration-200
                    hover:scale-105
                  "
                />
              </a>

              {/* Welcome text – side by side */}
              <div className="flex flex-col">
                <p className="text-sm md:text-base text-muted-foreground">
                  Welcome,{" "}
                  <span className="text-primary font-medium">
                    {userName || "User"}
                  </span>
                </p>
              </div>
            </div>

            <nav className="flex items-center gap-6">
              <button
                onClick={() => navigate("/jobs")}
                className="flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1"
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
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <TableIcon className="w-4 h-4" />
                Datasets
              </button>

              <button
                onClick={() => {
                  if (!localStorage.getItem("aivolve_user")) {
                    toast.info("Preparing Auto AI/ML...", { duration: 2000 });
                  }
                  navigate("/workflow/automl/jobs1");
                }}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Auto AI/ML
              </button>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-primary rounded-full"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1 overflow-y-auto">
        {viewMode === "chart" ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">Your Jobs at a Glance</h2>
                <p className="text-muted-foreground">
                  Track jobs by status, category, and time with ease.
                </p>
              </div>
              <Button variant="outline" onClick={() => setViewMode("table")}>
                <TableIcon className="w-4 h-4 mr-2" />
                Table View
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Jobs by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobsByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {jobsByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Job Status Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={jobsByStatus}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {jobsByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">
                  Glue Jobs Created by Hour (Total Glue Jobs:{" "}
                  {jobs.filter((j) => j.category === "Glue").length})
                </h3>
                <Select defaultValue="daily">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily (by Hour)</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="jobs"
                      name="Glue Jobs"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  All Jobs ({filteredJobs.length})
                </h2>
                <p className="text-muted-foreground">
                  View and manage your jobs
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => {
                    const newJobId = crypto.randomUUID().replace(/-/g, "");
                    localStorage.setItem("current_job_id", newJobId);
                    navigate("/workflow/data-ingestion");
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </div>

            <div className="p-4 mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-40">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-center peer"
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
                      Start Date
                    </label>
                  </div>

                  <div className="relative w-40">
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-center peer"
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
                      End Date
                    </label>
                  </div>

                  {/* Status dropdown with floating label */}
                  <div className="relative w-40">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger
                        className="
              w-full text-center peer
              [&>span]:text-muted-foreground/70
              peer-placeholder-shown:text-muted-foreground/70
              focus-within:text-foreground
            "
                      >
                        <SelectValue placeholder=" " />
                      </SelectTrigger>
                      <label
                        className="
              absolute left-2 -top-2.5 px-1 text-xs font-medium text-muted-foreground
              bg-background transition-all peer-placeholder-shown:top-1/2
              peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground/70
              peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-foreground
            "
                      >
                        Status
                      </label>
                      <SelectContent>
                        <SelectItem className="hover:bg-primary/30" value="All">
                          All Statuses
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-primary/30"
                          value="Created"
                        >
                          Created
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-primary/30"
                          value="Running"
                        >
                          Running
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-primary/30"
                          value="Completed"
                        >
                          Completed
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-primary/30"
                          value="Failed"
                        >
                          Failed
                        </SelectItem>
                        <SelectItem
                          className="hover:bg-primary/30"
                          value="PENDING"
                        >
                          Pending
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStatusFilter("All");
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="border border-border"
                >
                  Clear
                </Button>
              </div>
            </div>

            <Card className="min-h-[300px] flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                      Loading your jobs...
                    </p>
                  </div>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="flex-1 py-12 text-center text-muted-foreground">
                  No jobs found matching your filters
                </div>
              ) : (
                <div className="overflow-x-auto flex-1">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Job Name
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Created At
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Last Run
                        </th>
                        <th className="text-left p-4 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-center p-4 font-medium text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => (
                        <tr
                          key={job.id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="p-4 font-medium">{job.name}</td>
                          <td className="p-4 text-muted-foreground">
                            {job.createdAt}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {job.lastRun}
                          </td>
                          <td className="p-4">{getStatusBadge(job.status)}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <Button
                                size="icon"
                                className="bg-primary hover:bg-primary/90 h-8 w-8"
                                onClick={() => runJob(job.id)}
                                disabled={
                                  job.status === "Running" ||
                                  job.status === "Completed"
                                }
                              >
                                <Play className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => openJobDetails(job)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => navigate(`/edit-job/${job.id}`)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </>
        )}
      </main>

      {/* Job Details Modal */}
      <Dialog open={showJobModal} onOpenChange={setShowJobModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6">
          <DialogHeader className="flex flex-row items-center justify-between pb-4">
            <DialogTitle className="text-2xl font-bold">
              Job Details - {selectedJob?.job.job_name || "Loading..."}
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DialogClose>
          </DialogHeader>

          {modalLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading job details...</p>
            </div>
          ) : selectedJob ? (
            <div className="space-y-8 min-w-0">
              {/* Overview cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Job Name</p>
                    <p className="font-medium truncate">
                      {selectedJob.job.job_name || "N/A"}
                    </p>
                  </div>
                </Card>
                <Card className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Database className="w-5 h-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-muted-foreground">Source(s)</p>
                    <p className="font-medium truncate">
                      {selectedJob.job.sources?.join(", ") || "N/A"}
                    </p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Job Information</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Created At:
                        </p>
                        <p className="font-medium">
                          {formatDate(selectedJob.job.created_at)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Schedule:
                        </p>
                        <p className="font-medium">
                          {formatSchedule(selectedJob.job.schedule)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Execution Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Overall Status:
                        </p>
                        <Badge variant="outline">
                          {selectedJob.job.status || "N/A"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Completed At:
                        </p>
                        <p className="font-medium">
                          {formatDate(selectedJob.job.completed_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* STEP 1: Data Ingestion */}
              <div>
                <StepHeader
                  number={1}
                  title="Data Ingestion"
                  icon={Database}
                  subtitle="Sources connected and tables pulled into the pipeline"
                />
                <div className="space-y-4">
                  {selectedJob.job.results?.map((result, ridx) => {
                    const isChatbotSource =
                      result.source?.toLowerCase() === "chatbot";
                    const tableCount = result.response?.results?.length || 0;

                    if (isChatbotSource || tableCount === 0) {
                      return (
                        <Card key={ridx} className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-primary/20 text-primary border-primary/30 capitalize">
                              {result.source}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              This dataset was created directly through the
                              chatbot, without a separate ingestion step.
                            </span>
                          </div>
                        </Card>
                      );
                    }

                    return (
                      <Card key={ridx} className="p-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-primary/20 text-primary border-primary/30 capitalize">
                            {result.source}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {tableCount} table
                            {tableCount !== 1 ? "s" : ""} ingested
                          </span>
                        </div>

                        <div className="space-y-2">
                          {result.response?.results?.map((t) => {
                            const key = `ingest-${ridx}-${t.table}`;
                            const expanded = !!expandedTables[key];
                            const columns = getSourceTableColumns(t.table);
                            return (
                              <div
                                key={t.table}
                                className="border border-border rounded-md"
                              >
                                <button
                                  className="w-full flex items-center justify-between gap-3 p-3 text-left"
                                  onClick={() => toggleTableExpand(key)}
                              >
                                <span className="font-medium truncate">
                                  {t.table}
                                </span>
                                <div className="flex items-center gap-4 flex-shrink-0 text-sm text-muted-foreground">
                                  <span>{t.rows.toLocaleString()} rows</span>
                                  <span>{t.size_mb} MB</span>
                                  {t.success ? (
                                    <span className="inline-flex items-center gap-1 text-green-600">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      Success
                                    </span>
                                  ) : (
                                    <span
                                      className="inline-flex items-center gap-1 text-red-600"
                                      title={t.error || ""}
                                    >
                                      <XCircle className="w-3.5 h-3.5" />
                                      Failed
                                    </span>
                                  )}
                                  {expanded ? (
                                    <ChevronUp className="w-4 h-4" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4" />
                                  )}
                                </div>
                              </button>

                              {expanded && (
                                <div className="px-3 pb-3 border-t border-border pt-3">
                                  {columns ? (
                                    <div className="max-h-56 overflow-y-auto space-y-1.5">
                                      {columns.map((col) => (
                                        <div
                                          key={col.name}
                                          className="flex items-center justify-between gap-2 text-sm py-1"
                                        >
                                          <div className="flex items-center gap-2 min-w-0">
                                            <span className="truncate">
                                              {col.display_label}
                                            </span>
                                            {col.is_primary_key && (
                                              <Badge
                                                variant="outline"
                                                className="text-[10px] px-1.5 py-0"
                                              >
                                                <Key className="w-2.5 h-2.5 mr-1" />
                                                PK
                                              </Badge>
                                            )}
                                            {col.is_foreign_key && (
                                              <Badge
                                                variant="outline"
                                                className="text-[10px] px-1.5 py-0"
                                              >
                                                <Link2 className="w-2.5 h-2.5 mr-1" />
                                                FK
                                              </Badge>
                                            )}
                                          </div>
                                          <span className="text-xs text-muted-foreground flex-shrink-0">
                                            {col.data_type}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">
                                      {schemaLoading
                                        ? "Loading columns..."
                                        : "Column details not available."}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                    );
                  })}

                  {(!selectedJob.job.results ||
                    selectedJob.job.results.length === 0) && (
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-primary/20 text-primary border-primary/30">
                          Chatbot
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          This dataset was created directly through the
                          chatbot, without a separate ingestion step.
                        </span>
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* STEP 2: Data Modeling */}
              <div>
                <StepHeader
                  number={2}
                  title="Data Modeling"
                  icon={Network}
                  subtitle="How the ingested tables were structured and related"
                />
                {schemaLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground py-6">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading data model...
                  </div>
                ) : schemaError || !selectedSchema ? (
                  <p className="text-sm text-muted-foreground">
                    Data modeling results are not available for this job.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <Card className="p-4">
                      <div className="flex flex-wrap items-center gap-4">
                        <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                          {selectedSchema.model?.type?.replace(/_/g, " ")}
                        </Badge>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Fact table:
                          </span>
                          <span className="font-medium">
                            {selectedSchema.model?.fact_table}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">
                            Dimensions:
                          </span>
                          <span className="font-medium">
                            {selectedSchema.model?.dimension_tables?.join(", ")}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                        <div>
                          <p className="text-2xl font-semibold">
                            {selectedSchema.summary?.total_tables}
                          </p>
                          <p className="text-xs text-muted-foreground">Tables</p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">
                            {selectedSchema.summary?.total_relationships}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Relationships
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold">
                            {selectedSchema.summary?.total_rows?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Total Rows
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="space-y-2">
                      {selectedSchema.tables
                        ?.filter((table) => table.table_type !== "SOURCE")
                        .map((table, idx) => renderSchemaTableCard(table, idx))}
                      {selectedSchema.tables?.filter(
                        (table) => table.table_type !== "SOURCE",
                      ).length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          No fact or dimension tables were generated for this
                          job.
                        </p>
                      )}
                    </div>

                    {selectedSchema.relationships?.length > 0 && (
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-3">
                          Relationships
                        </p>
                        <div className="space-y-2">
                          {selectedSchema.relationships.map((rel, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm flex-wrap"
                            >
                              <span className="font-medium">
                                {rel.from_table}.{rel.from_column}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                              <span className="font-medium">
                                {rel.to_table}
                                {rel.to_column ? `.${rel.to_column}` : ""}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {rel.relationship_type}
                              </Badge>
                              {rel.description && (
                                <span className="text-muted-foreground text-xs">
                                  {rel.description}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </div>

              {/* STEP 3: Dataset Created */}
              <div>
                <StepHeader
                  number={3}
                  title="Dataset Created"
                  icon={FileText}
                  subtitle="Final dataset assembled from the modeled tables"
                />
                <div className="space-y-4">
                  {selectedJob.create_datasets?.map((ds, idx) => (
                    <Card key={idx} className="p-4 min-w-0">
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <TableIcon className="w-4 h-4 text-primary" />
                          <span className="font-medium">
                            {ds.custom_table_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{ds.rows.toLocaleString()} rows</span>
                          <span>{ds.columns.length} columns</span>
                          <Badge variant="outline">
                            {ds.request_body?.join_type} join
                          </Badge>
                        </div>
                      </div>

                      {getBuiltFromGroups(ds).length > 0 && (
                        <>
                          <p className="text-xs text-muted-foreground mb-2">
                            Built from:
                          </p>
                          <div className="space-y-2 mb-4">
                            {getBuiltFromGroups(ds).map((group, gIdx) => (
                              <div
                                key={gIdx}
                                className="text-sm border-l-2 border-primary/30 pl-3"
                              >
                                <p className="font-medium truncate">
                                  {group.label}
                                </p>
                                <p className="text-muted-foreground text-xs">
                                  {group.columns.join(", ")}
                                </p>
                              </div>
                            ))}
                          </div>
                        </>
                      )}

                      <div className="pt-3 border-t border-border min-w-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePreview(ds.custom_table_name)}
                        >
                          {previewOpenFor[ds.custom_table_name] ? (
                            <>
                              <ChevronUp className="w-4 h-4 mr-2" />
                              Hide Preview
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Preview Data
                            </>
                          )}
                        </Button>

                        {previewOpenFor[ds.custom_table_name] && (
                          <div className="mt-3">
                            {previewLoading[ds.custom_table_name] ? (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading preview...
                              </div>
                            ) : previewData[ds.custom_table_name] ? (
                              <div className="border border-border rounded-md max-h-80 overflow-auto w-full min-w-0">
                                <table className="text-xs border-collapse">
                                  <thead>
                                    <tr>
                                      {previewData[
                                        ds.custom_table_name
                                      ].columns.map((col) => (
                                        <th
                                          key={col}
                                          className="text-left px-3 py-2 font-medium whitespace-nowrap bg-background border-b border-border sticky top-0 z-10"
                                        >
                                          {col}
                                          <span className="block text-muted-foreground font-normal">
                                            {
                                              previewData[ds.custom_table_name]
                                                .column_types[col]
                                            }
                                          </span>
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {previewData[
                                      ds.custom_table_name
                                    ].preview_rows.map((row, rIdx) => (
                                      <tr
                                        key={rIdx}
                                        className="border-b border-border last:border-0"
                                      >
                                        {previewData[
                                          ds.custom_table_name
                                        ].columns.map((col) => (
                                          <td
                                            key={col}
                                            className="px-3 py-2 whitespace-nowrap bg-background"
                                          >
                                            {row[col] === null ||
                                            row[col] === undefined ? (
                                              <span className="text-muted-foreground">
                                                —
                                              </span>
                                            ) : (
                                              String(row[col])
                                            )}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No preview available.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}

                  {(!selectedJob.create_datasets ||
                    selectedJob.create_datasets.length === 0) && (
                    <p className="text-sm text-muted-foreground">
                      No dataset has been created for this job yet.
                    </p>
                  )}
                </div>
              </div>

              {/* STEP 4: Processing Rules */}
              <div>
                <StepHeader
                  number={4}
                  title="Processing Rules"
                  icon={Settings}
                  subtitle="Data quality, entity recognition, and business logic"
                />
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">DQ Rules</span>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                    {getStepBadge(
                      selectedJob.dq_enabled ? "executed" : "skipped",
                    )}
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-orange-500" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">NER</span>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                    {getStepBadge(
                      selectedJob.ner_enabled ? "executed" : "skipped",
                    )}
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium">
                          Business Logic
                        </span>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    </div>
                    {getStepBadge(
                      selectedJob.business_logic_enabled
                        ? "executed"
                        : "skipped",
                    )}
                  </Card>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No job details available
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Jobs;
