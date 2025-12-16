// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Card } from "@/components/ui/card";
// import {
//   Search,
//   Play,
//   Eye,
//   Edit,
//   Trash2,
//   Database,
//   GitBranch,
//   Moon,
//   Sun,
//   User,
//   BarChart3,
// } from "lucide-react";
// import { toast } from "sonner";

// interface Pipeline {
//   id: string;
//   name: string;
//   jobs: string[];
//   createdAt: string;
//   status: "Completed" | "PENDING" | "Running" | "Failed";
// }

// const Pipelines = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [pipelines, setPipelines] = useState<Pipeline[]>([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [showJobsModal, setShowJobsModal] = useState(false);
//   const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);

//   useEffect(() => {
//     const savedPipelines = localStorage.getItem("pipelines");
//     if (savedPipelines) {
//       setPipelines(JSON.parse(savedPipelines));
//     } else {
//       const samplePipelines: Pipeline[] = [
//         { id: "1", name: "pipeline8", jobs: ["testjob", "VeritasJob02"], createdAt: "2025-12-03T05:41:39.445963", status: "Completed" },
//         { id: "2", name: "Veritaspipeline03", jobs: ["veritas0", "testjob2"], createdAt: "2025-11-12T09:20:42.468629", status: "Completed" },
//         { id: "3", name: "Veritaspipeline01", jobs: ["VeritasJob01", "veritas06"], createdAt: "2025-11-07T13:14:55.897880", status: "Completed" },
//         { id: "4", name: "Demo pipeline", jobs: ["Vertis retail test", "VeritasJob02"], createdAt: "2025-11-07T17:53:38.478915", status: "Completed" },
//       ];
//       setPipelines(samplePipelines);
//       localStorage.setItem("pipelines", JSON.stringify(samplePipelines));
//     }
//   }, []);

//   const filteredPipelines = pipelines.filter((pipeline) =>
//     pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const runPipeline = (pipelineId: string) => {
//     const updatedPipelines = pipelines.map((p) =>
//       p.id === pipelineId ? { ...p, status: "Running" as const } : p
//     );
//     setPipelines(updatedPipelines);
//     localStorage.setItem("pipelines", JSON.stringify(updatedPipelines));
//     toast.success("Pipeline started successfully");

//     setTimeout(() => {
//       const completedPipelines = updatedPipelines.map((p) =>
//         p.id === pipelineId ? { ...p, status: "Completed" as const } : p
//       );
//       setPipelines(completedPipelines);
//       localStorage.setItem("pipelines", JSON.stringify(completedPipelines));
//       toast.success("Pipeline completed successfully");
//     }, 3000);
//   };

//   const deletePipeline = (pipelineId: string) => {
//     const updatedPipelines = pipelines.filter((p) => p.id !== pipelineId);
//     setPipelines(updatedPipelines);
//     localStorage.setItem("pipelines", JSON.stringify(updatedPipelines));
//     toast.success("Pipeline deleted successfully");
//   };

//   const viewPipelineJobs = (pipeline: Pipeline) => {
//     setSelectedPipeline(pipeline);
//     setShowJobsModal(true);
//   };

//   const getStatusBadge = (status: string) => {
//     const styles: Record<string, string> = {
//       Completed: "bg-green-500/20 text-green-600 border-green-500/30",
//       PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
//       Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
//       Failed: "bg-red-500/20 text-red-600 border-red-500/30",
//     };
//     return <Badge className={styles[status] || styles.Completed}>{status}</Badge>;
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//                 <Database className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h1 className="font-bold text-lg">Veritas</h1>
//                 <p className="text-sm text-muted-foreground">
//                   Welcome, <span className="text-primary">Demo User</span>
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
//                 className="flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1"
//               >
//                 <GitBranch className="w-4 h-4" />
//                 Pipelines
//               </button>
//               <button
//                 onClick={() => setIsDarkMode(!isDarkMode)}
//                 className="p-2 hover:bg-muted rounded-full transition-colors"
//               >
//                 {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
//               </button>
//               <button className="p-2 hover:bg-muted rounded-full transition-colors">
//                 <User className="w-4 h-4" />
//               </button>
//             </nav>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h2 className="text-2xl font-bold">All Pipelines ({filteredPipelines.length})</h2>
//             <p className="text-muted-foreground">View and manage your pipelines</p>
//           </div>
//           <Button onClick={() => navigate("/create-pipeline")}>Create Pipeline</Button>
//         </div>

//         {/* Search */}
//         <Card className="p-4 mb-6">
//           <div className="relative max-w-md">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//             <Input
//               placeholder="Search pipelines..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//             />
//           </div>
//         </Card>

//         {/* Pipelines Table */}
//         <Card>
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-border">
//                   <th className="text-left p-4 font-medium text-muted-foreground">Pipeline Name</th>
//                   <th className="text-left p-4 font-medium text-muted-foreground">Jobs</th>
//                   <th className="text-left p-4 font-medium text-muted-foreground">Created At</th>
//                   <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
//                   <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredPipelines.map((pipeline) => (
//                   <tr key={pipeline.id} className="border-b border-border last:border-0 hover:bg-muted/30">
//                     <td className="p-4 font-medium">{pipeline.name}</td>
//                     <td className="p-4">
//                       <Badge variant="secondary" className="rounded-full">
//                         {pipeline.jobs.length}
//                       </Badge>
//                     </td>
//                     <td className="p-4 text-muted-foreground">{pipeline.createdAt}</td>
//                     <td className="p-4">{getStatusBadge(pipeline.status)}</td>
//                     <td className="p-4">
//                       <div className="flex items-center justify-center gap-2">
//                         <Button
//                           size="icon"
//                           className="bg-primary hover:bg-primary/90 h-8 w-8"
//                           onClick={() => runPipeline(pipeline.id)}
//                         >
//                           <Play className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-8 w-8"
//                           onClick={() => viewPipelineJobs(pipeline)}
//                         >
//                           <Eye className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-8 w-8"
//                           onClick={() => navigate(`/edit-pipeline/${pipeline.id}`)}
//                         >
//                           <Edit className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           size="icon"
//                           variant="ghost"
//                           className="h-8 w-8 text-destructive hover:text-destructive"
//                           onClick={() => deletePipeline(pipeline.id)}
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </main>

//       {/* Pipeline Jobs Modal */}
//       {showJobsModal && selectedPipeline && (
//         <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <Card className="w-full max-w-md bg-background border border-border">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h3 className="font-semibold">{selectedPipeline.name} - Jobs</h3>
//                   <p className="text-sm text-muted-foreground">View all jobs in this pipeline</p>
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => setShowJobsModal(false)}>
//                   <span className="text-xl">×</span>
//                 </Button>
//               </div>
//               <div className="space-y-3">
//                 {selectedPipeline.jobs.map((jobName, index) => (
//                   <Card key={index} className="p-4 flex items-center justify-between border-l-4 border-l-primary">
//                     <div className="flex items-center gap-3">
//                       <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
//                         {index + 1}
//                       </div>
//                       <div>
//                         <p className="font-medium">{jobName}</p>
//                         <p className="text-sm text-muted-foreground">Status: COMPLETED</p>
//                       </div>
//                     </div>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => {
//                         setShowJobsModal(false);
//                         const savedJobs = localStorage.getItem("jobs");
//                         if (savedJobs) {
//                           const jobs = JSON.parse(savedJobs);
//                           const job = jobs.find((j: any) => j.name === jobName);
//                           if (job) {
//                             navigate(`/job-details/${job.id}`);
//                           }
//                         }
//                       }}
//                     >
//                       <Eye className="w-4 h-4" />
//                     </Button>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Pipelines;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Search,
  Play,
  Eye,
  Edit,
  Trash2,
  Database,
  GitBranch,
  User,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle"; // Make sure this path is correct!
 
interface Pipeline {
  id: string;
  name: string;
  jobs: string[];
  createdAt: string;
  status: "Completed" | "PENDING" | "Running" | "Failed";
}
 
const Pipelines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
 
  useEffect(() => {
    const savedPipelines = localStorage.getItem("pipelines");
    if (savedPipelines) {
      setPipelines(JSON.parse(savedPipelines));
    } else {
      const samplePipelines: Pipeline[] = [
        { id: "1", name: "pipeline8", jobs: ["testjob", "VeritasJob02"], createdAt: "2025-12-03T05:41:39.445963", status: "Completed" },
        { id: "2", name: "Veritaspipeline03", jobs: ["veritas0", "testjob2"], createdAt: "2025-11-12T09:20:42.468629", status: "Completed" },
        { id: "3", name: "Veritaspipeline01", jobs: ["VeritasJob01", "veritas06"], createdAt: "2025-11-07T13:14:55.897880", status: "Completed" },
        { id: "4", name: "Demo pipeline", jobs: ["Vertis retail test", "VeritasJob02"], createdAt: "2025-11-07T17:53:38.478915", status: "Completed" },
      ];
      setPipelines(samplePipelines);
      localStorage.setItem("pipelines", JSON.stringify(samplePipelines));
    }
  }, []);
 
  const filteredPipelines = pipelines.filter((pipeline) =>
    pipeline.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const runPipeline = (pipelineId: string) => {
    const updatedPipelines = pipelines.map((p) =>
      p.id === pipelineId ? { ...p, status: "Running" as const } : p
    );
    setPipelines(updatedPipelines);
    localStorage.setItem("pipelines", JSON.stringify(updatedPipelines));
    toast.success("Pipeline started successfully");
 
    setTimeout(() => {
      const completedPipelines = updatedPipelines.map((p) =>
        p.id === pipelineId ? { ...p, status: "Completed" as const } : p
      );
      setPipelines(completedPipelines);
      localStorage.setItem("pipelines", JSON.stringify(completedPipelines));
      toast.success("Pipeline completed successfully");
    }, 3000);
  };
 
  const deletePipeline = (pipelineId: string) => {
    const updatedPipelines = pipelines.filter((p) => p.id !== pipelineId);
    setPipelines(updatedPipelines);
    localStorage.setItem("pipelines", JSON.stringify(updatedPipelines));
    toast.success("Pipeline deleted successfully");
  };
 
  const viewPipelineJobs = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowJobsModal(true);
  };
 
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: "bg-green-500/20 text-green-600 border-green-500/30",
      PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Failed: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return <Badge className={styles[status] || styles.Completed}>{status}</Badge>;
  };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-bold text-lg">Veritas</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, <span className="text-primary">Demo User</span>
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
                className="flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1"
              >
                <GitBranch className="w-4 h-4" />
                Pipelines
              </button>
 
              <ThemeToggle /> {/* Safe toggle - switches to light/dark */}
 
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <User className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </header>
 
      <main className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">All Pipelines ({filteredPipelines.length})</h2>
            <p className="text-muted-foreground">View and manage your pipelines</p>
          </div>
          <Button onClick={() => navigate("/create-pipeline")}>Create Pipeline</Button>
        </div>
 
        <Card className="p-4 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search pipelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>
 
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-medium text-muted-foreground">Pipeline Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Jobs</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Created At</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPipelines.map((pipeline) => (
                  <tr key={pipeline.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="p-4 font-medium">{pipeline.name}</td>
                    <td className="p-4">
                      <Badge variant="secondary" className="rounded-full">
                        {pipeline.jobs.length}
                      </Badge>
                    </td>
                    <td className="p-4 text-muted-foreground">{pipeline.createdAt}</td>
                    <td className="p-4">{getStatusBadge(pipeline.status)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button size="icon" className="bg-primary hover:bg-primary/90 h-8 w-8" onClick={() => runPipeline(pipeline.id)}>
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => viewPipelineJobs(pipeline)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => navigate(`/edit-pipeline/${pipeline.id}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deletePipeline(pipeline.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
 
      {showJobsModal && selectedPipeline && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background border border-border">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{selectedPipeline.name} - Jobs</h3>
                  <p className="text-sm text-muted-foreground">View all jobs in this pipeline</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowJobsModal(false)}>
                  <span className="text-xl">×</span>
                </Button>
              </div>
              <div className="space-y-3">
                {selectedPipeline.jobs.map((jobName, index) => (
                  <Card key={index} className="p-4 flex items-center justify-between border-l-4 border-l-primary">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{jobName}</p>
                        <p className="text-sm text-muted-foreground">Status: COMPLETED</p>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setShowJobsModal(false);
                        const savedJobs = localStorage.getItem("jobs");
                        if (savedJobs) {
                          const jobs = JSON.parse(savedJobs);
                          const job = jobs.find((j: any) => j.name === jobName);
                          if (job) {
                            navigate(`/job-details/${job.id}`);
                          }
                        }
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
 
export default Pipelines;