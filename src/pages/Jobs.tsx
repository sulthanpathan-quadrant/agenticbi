import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TableIcon,
  Plus,
  Search,
  Calendar,
  Play,
  Eye,
  Edit,
  Database,
  User,
  GitBranch,
  LogOut,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

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
  sourceFilePath?: string;
  destinationFilePath?: string;
  description?: string;
}

const Jobs = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userName = user?.name || user?.email?.split("@")[0] || "User";

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    // Load jobs from localStorage
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      setJobs(JSON.parse(savedJobs));
    } else {
      // Sample data
      const sampleJobs: Job[] = [
        {
          id: "1",
          name: "testjob",
          category: "Unknown",
          createdAt: "Dec 3, 2025 - 11:09 AM",
          lastRun: "Dec 3, 2025 - 5:40 AM",
          status: "Completed",
          steps: { dqRules: "skipped", ner: "skipped", businessLogic: "executed", dataTransformations: "executed" },
          sourceFilePath: "ingestion-01/Book.csv",
          destinationFilePath: "s3://agntic-bl/Book.csv",
        },
        {
          id: "2",
          name: "testjob2",
          category: "Unknown",
          createdAt: "Nov 12, 2025 - 3:02 PM",
          lastRun: "Dec 2, 2025 - 9:33 AM",
          status: "PENDING",
          steps: { dqRules: "executed", ner: "skipped", businessLogic: "skipped", dataTransformations: "executed" },
        },
        {
          id: "3",
          name: "Vertis retail test",
          category: "Unknown",
          createdAt: "Nov 7, 2025 - 10:23 PM",
          lastRun: "Dec 2, 2025 - 4:54 PM",
          status: "PENDING",
          steps: { dqRules: "skipped", ner: "executed", businessLogic: "executed", dataTransformations: "skipped" },
        },
        {
          id: "4",
          name: "veritas06",
          category: "Unknown",
          createdAt: "Nov 7, 2025 - 10:06 PM",
          lastRun: "Dec 3, 2025 - 11:13 AM",
          status: "Created",
          steps: { dqRules: "executed", ner: "executed", businessLogic: "skipped", dataTransformations: "executed" },
        },
        {
          id: "5",
          name: "veritas0",
          category: "Unknown",
          createdAt: "Nov 7, 2025 - 10:00 PM",
          lastRun: "Dec 2, 2025 - 4:29 PM",
          status: "PENDING",
          steps: { dqRules: "skipped", ner: "skipped", businessLogic: "executed", dataTransformations: "executed" },
        },
        {
          id: "6",
          name: "VeritasJob02",
          category: "Glue",
          createdAt: "Nov 7, 2025 - 6:42 PM",
          lastRun: "Dec 2, 2025 - 1:16 PM",
          status: "PENDING",
          steps: { dqRules: "executed", ner: "skipped", businessLogic: "executed", dataTransformations: "skipped" },
        },
        {
          id: "7",
          name: "VeritasJob01",
          category: "Glue",
          createdAt: "Nov 7, 2025 - 6:36 PM",
          lastRun: "Dec 3, 2025 - 1:08 AM",
          status: "PENDING",
          steps: { dqRules: "skipped", ner: "executed", businessLogic: "skipped", dataTransformations: "executed" },
        },
      ];
      setJobs(sampleJobs);
      localStorage.setItem("jobs", JSON.stringify(sampleJobs));
    }
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    const matchesStatus = statusFilter === "All" || job.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const jobsByCategory = [
    { name: "Unknown", value: jobs.filter((j) => j.category === "Unknown").length, color: "#3b82f6" },
    { name: "Glue", value: jobs.filter((j) => j.category === "Glue").length, color: "#10b981" },
  ];

  const jobsByStatus = [
    { name: "PENDING", value: jobs.filter((j) => j.status === "PENDING").length, color: "#f97316" },
    { name: "Completed", value: jobs.filter((j) => j.status === "Completed").length, color: "#10b981" },
    { name: "Created", value: jobs.filter((j) => j.status === "Created").length, color: "#6b7280" },
  ];

  const hourlyData = Array.from({ length: 8 }, (_, i) => ({
    time: `${String(i * 3).padStart(2, "0")}:00`,
    jobs: 0,
  }));

  const runJob = (jobId: string) => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobId
        ? { ...job, status: "Running" as const, lastRun: new Date().toLocaleString() }
        : job
    );
    setJobs(updatedJobs);
    localStorage.setItem("jobs", JSON.stringify(updatedJobs));
    toast.success("Job started successfully");
    
    setTimeout(() => {
      const completedJobs = updatedJobs.map((job) =>
        job.id === jobId ? { ...job, status: "Completed" as const } : job
      );
      setJobs(completedJobs);
      localStorage.setItem("jobs", JSON.stringify(completedJobs));
      toast.success("Job completed successfully");
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
                  Welcome, <span className="text-primary">{userName}</span>
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

              {/* Theme Toggle - uses next-themes */}
              {/* <ThemeToggle />

             
              <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full hover:bg-muted transition"
    >
      <User className="h-4 w-2" />
    </Button>
  </DropdownMenuTrigger>

  <DropdownMenuContent 
    align="end" 
    className="w-[10%] rounded-xl border border-border bg-card shadow-lg"
  >
    <DropdownMenuItem
      onClick={handleLogout}
      className="cursor-pointer text-foreground hover:bg-muted hover:text-primary rounded-lg transition"
    >
      <LogOut className="mr-2 h-4 w-2" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
 */}
   
     <div className="flex items-center gap-3">
                <ThemeToggle />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-muted rounded-full"
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
        {viewMode === "chart" ? (
          <>
            {/* Chart View Header */}
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

            {/* Charts */}
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
                  Glue Jobs Created by Hour - Dec 03, 2025 (Total Glue Jobs: {jobs.filter((j) => j.category === "Glue").length})
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
                    <Line type="monotone" dataKey="jobs" name="Glue Jobs" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </>
        ) : (
          <>
            {/* Table View Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">All Jobs ({filteredJobs.length})</h2>
                <p className="text-muted-foreground">View and manage your jobs</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => setViewMode("chart")}>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Chart View
                </Button>
                <Button onClick={() => navigate("/workflow/data-ingestion")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-6">
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
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 w-40"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 w-40"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                    <SelectItem value="Glue">Glue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("all");
                  setStatusFilter("All");
                  setStartDate("");
                  setEndDate("");
                }}>
                  Clear
                </Button>
                <div className="flex items-center gap-1 border rounded-lg p-1">
                  {["All", "Completed", "Running", "Failed"].map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                    >
                      {status}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Jobs Table */}
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-medium text-muted-foreground">Job Name</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Category</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Created At</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Last Run</th>
                      <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                      <th className="text-center p-4 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="p-4 font-medium">{job.name}</td>
                        <td className="p-4 text-muted-foreground">{job.category}</td>
                        <td className="p-4 text-muted-foreground">{job.createdAt}</td>
                        <td className="p-4 text-muted-foreground">{job.lastRun}</td>
                        <td className="p-4">{getStatusBadge(job.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              size="icon"
                              className="bg-primary hover:bg-primary/90 h-8 w-8"
                              onClick={() => runJob(job.id)}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => navigate(`/job-details/${job.id}`)}
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
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default Jobs;
