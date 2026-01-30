

 
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
  LogOut,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/ThemeToggle";
 
interface Pipeline {
  id: string;
  name: string;
  jobs: string[];               // job IDs
  createdAt: string;
  status: "Completed" | "PENDING" | "Running" | "Failed" | "CREATED";
  jobDetails?: Array<{ job_id: string; job_name: string }>; // ← new optional field
}
 
const API_BASE = "https://20.81.213.147";
 
const Pipelines = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [runningPipelines, setRunningPipelines] = useState<Set<string>>(new Set());
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
 
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : {};
  const userId = user?.id || user?.user_id;
 
  // Load pipelines from localStorage on mount (instant UI)
  useEffect(() => {
    const cached = localStorage.getItem("pipelines");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const cachedPipelines: Pipeline[] = parsed.map((p: { id: string; name: string }) => ({
          id: p.id,
          name: p.name,
          jobs: [],
          createdAt: "N/A",
          status: "CREATED",
        }));
        setPipelines(cachedPipelines);
      } catch (e) {
        console.warn("Failed to parse cached pipelines", e);
      }
    }
  }, []);
 
  // Fetch fresh pipelines list + update cache
  useEffect(() => {
    const fetchPipelines = async () => {
      setLoading(true);
      setError(null);
 
      try {
        const response = await fetch(`${API_BASE}/pipelines?user_id=${userId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
 
        if (!response.ok) throw new Error(`Failed to fetch pipelines: ${response.status}`);
 
        const data = await response.json();
 
        const mapped: Pipeline[] = (data.pipelines || []).map((p: any) => ({
          id: p.pipeline_id,
          name: p.name || "Unnamed Pipeline",
          jobs: p.job_ids || [],
          createdAt: p.created_at || "N/A",
          status: p.status || "CREATED",
        }));
 
        setPipelines(mapped);
 
        // Cache only id + name
        const toCache = mapped.map(p => ({ id: p.id, name: p.name }));
        localStorage.setItem("pipelines", JSON.stringify(toCache));
      } catch (err: any) {
        console.error("Pipelines fetch error:", err);
        setError(err.message || "Could not load pipelines");
        toast.error("Failed to load pipelines from server. Showing cached data.");
      } finally {
        setLoading(false);
      }
    };
 
    if (userId) fetchPipelines();
    else {
      setError("User ID not found. Please log in again.");
      setLoading(false);
    }
  }, [userId]);
 
  // Fetch detailed pipeline info (including real job names) when opening modal
  const fetchPipelineDetails = async (pipelineId: string) => {
    setModalLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/view-pipeline?user_id=${userId}&pipeline_id=${pipelineId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
 
      if (!res.ok) {
        throw new Error(`Failed to fetch pipeline details: ${res.status}`);
      }
 
      const data = await res.json();
 
      // Update the selected pipeline with real job details
      setSelectedPipeline(prev => ({
        ...prev!,
        jobDetails: data.jobs || [],
      }));
 
      // Optional: also update main list so next time modal opens faster
      setPipelines(prev =>
        prev.map(p =>
          p.id === pipelineId ? { ...p, jobDetails: data.jobs || [] } : p
        )
      );
    } catch (err) {
      console.error("Failed to load pipeline details:", err);
      toast.error("Could not load job names");
    } finally {
      setModalLoading(false);
    }
  };
 
  const viewPipelineJobs = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowJobsModal(true);
 
    // Only fetch if we don't already have job details
    if (!pipeline.jobDetails || pipeline.jobDetails.length === 0) {
      fetchPipelineDetails(pipeline.id);
    }
  };
 
  const filteredPipelines = pipelines.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
 
  const deletePipeline = async (pipelineId: string, pipelineName: string) => {
    if (!confirm(`Are you sure you want to delete pipeline "${pipelineName}"?`)) return;
 
    try {
      const url = `${API_BASE}/delete-pipeline?user_id=${userId}&pipeline_id=${pipelineId}`;
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Delete failed: ${response.status} - ${errorText}`);
      }
 
      const result = await response.json();
 
      if (result.status === "success") {
        toast.success(result.message || `Pipeline "${pipelineName}" deleted`);
        setPipelines(prev => prev.filter(p => p.id !== pipelineId));
 
        const cached = localStorage.getItem("pipelines");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const updated = parsed.filter((p: any) => p.id !== pipelineId);
            localStorage.setItem("pipelines", JSON.stringify(updated));
          } catch {}
        }
      } else {
        throw new Error(result.message || "Delete failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to delete pipeline");
    }
  };
 
  const runPipeline = async (pipelineId: string) => {
    if (runningPipelines.has(pipelineId)) {
      toast.info("Pipeline is already running");
      return;
    }
 
    setRunningPipelines(prev => new Set([...prev, pipelineId]));
 
    setPipelines(prev =>
      prev.map(p => p.id === pipelineId ? { ...p, status: "Running" } : p)
    );
 
    toast.info("Starting pipeline...");
 
    try {
      const res = await fetch(`${API_BASE}/run-pipeline`, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, pipeline_id: pipelineId }),
      });
 
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Run failed: ${res.status} - ${txt}`);
      }
 
      const result = await res.json();
 
      if (result.status === "SUCCESS") {
        toast.success(`Pipeline finished (${result.jobs_succeeded}/${result.jobs_total} jobs)`);
        setPipelines(prev =>
          prev.map(p => p.id === pipelineId ? { ...p, status: "Completed" } : p)
        );
      } else {
        throw new Error(result.message || "Execution failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to run pipeline");
      setPipelines(prev =>
        prev.map(p => p.id === pipelineId ? { ...p, status: "Failed" } : p)
      );
    } finally {
      setRunningPipelines(prev => {
        const next = new Set(prev);
        next.delete(pipelineId);
        return next;
      });
    }
  };
 
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: "bg-green-500/20 text-green-600 border-green-500/30",
      CREATED: "bg-purple-500/20 text-purple-600 border-purple-500/30",
      PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Failed: "bg-red-500/20 text-red-600 border-red-500/30",
    };
    return <Badge className={styles[status] || styles.Completed}>{status}</Badge>;
  };
 
  const userName = user?.name || user?.email?.split("@")[0] || "User";
 
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("pipelines");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header – unchanged */}
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
                  Welcome, <span className="text-primary">{userName}</span>
                </p>
              </div>
            </div>
 
            {/* <nav className="flex items-center gap-6">
              <button onClick={() => navigate("/jobs")}
               className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <BarChart3 className="w-4 h-4" /> Jobs
              </button>
              <button onClick={() => navigate("/pipelines")} className=
              "flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1">
               
              
              <GitBranch className="w-4 h-4" /> Pipelines
              </button>
              <ThemeToggle />
              <Button variant="ghost" size="icon" onClick={handleLogout} className="hover:bg-muted rounded-full" title="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </nav> */}



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
                className= "flex items-center gap-2 text-primary font-medium border-b-2 border-primary pb-1">
               
             
             
                <GitBranch className="w-4 h-4" />
                Pipelines
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
 
      <main className="container mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              All Pipelines {loading ? "" : `(${filteredPipelines.length})`}
            </h2>
            <p className="text-muted-foreground">View and manage your pipelines</p>
          </div>
 
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 min-w-[220px] sm:min-w-[280px] md:min-w-[340px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search pipelines..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            <Button onClick={() => navigate("/create-pipeline")} className="whitespace-nowrap">
              Create Pipeline
            </Button>
          </div>
        </div>
 
        {loading && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Loading pipelines...</p>
          </Card>
        )}
 
        {error && !loading && (
          <Card className="p-6 border-destructive">
            <p className="text-destructive">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        )}
 
        {!loading && !error && (
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
                  {filteredPipelines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-muted-foreground">
                        No pipelines found
                      </td>
                    </tr>
                  ) : (
                    filteredPipelines.map(pipeline => (
                      <tr
                        key={pipeline.id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="p-4 font-medium">{pipeline.name}</td>
                        <td className="p-4">
                          <Badge variant="secondary" className="rounded-full">
                            {pipeline.jobs.length}
                          </Badge>
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(pipeline.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">{getStatusBadge(pipeline.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              className={`h-8 w-8 ${runningPipelines.has(pipeline.id) ? "bg-yellow-600 hover:bg-yellow-700" : "bg-primary hover:bg-primary/90"}`}
                              onClick={() => runPipeline(pipeline.id)}
                              disabled={runningPipelines.has(pipeline.id)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => viewPipelineJobs(pipeline)}
                              onOpenChange={setShowJobModal}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => navigate(`/edit-pipeline/${pipeline.id}`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => deletePipeline(pipeline.id, pipeline.name)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </main>
 
      {/* Jobs Modal */}
     {/* Jobs Modal */}
{showJobsModal && selectedPipeline && (
  <div
    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={() => setShowJobsModal(false)} // 👈 click outside closes modal
  >
    <Card
      className="w-full max-w-md bg-background border border-border"
      onClick={(e) => e.stopPropagation()} // 👈 prevent close when clicking inside
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">
              {selectedPipeline.name} – Jobs
            </h3>
            <p className="text-sm text-muted-foreground">
              View all jobs in this pipeline
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowJobsModal(false)} // ❌ still works
          >
            <span className="text-xl">×</span>
          </Button>
        </div>

        {modalLoading ? (
          <p className="text-center text-muted-foreground py-8">
            Loading job details...
          </p>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {!selectedPipeline.jobDetails ||
            selectedPipeline.jobDetails.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                No jobs found in this pipeline
              </p>
            ) : (
              selectedPipeline.jobDetails.map((job, index) => (
                <Card
                  key={job.job_id}
                  className="p-4 flex items-center justify-between border-l-4 border-l-primary"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">
                        {job.job_name || " "}
                      </p>
                      <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                        ID: {job.job_id}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Status: Created
                      </p>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setShowJobsModal(false);
                      navigate(`/job-details/${job.job_id}`);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Card>
  </div>
)}

    </div>
  );
};
 
export default Pipelines;
 