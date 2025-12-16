import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { X, Settings, Clock, Database, GitBranch, Moon, Sun, User, ArrowLeft } from "lucide-react";

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
  pipelineName?: string;
  connectedJobs?: number;
  triggerType?: string;
  email?: string;
  scheduleDetails?: string;
  folderName?: string;
  businessRules?: Array<{ name: string; description: string }>;
}

const JobDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      const jobs = JSON.parse(savedJobs);
      const foundJob = jobs.find((j: Job) => j.id === id);
      if (foundJob) {
        setJob({
          ...foundJob,
          pipelineName: foundJob.pipelineName || "pipeline8",
          connectedJobs: foundJob.connectedJobs || 0,
          triggerType: foundJob.triggerType || "SCHEDULE",
          email: foundJob.email || "Demouser01@gmail.com",
          scheduleDetails: foundJob.scheduleDetails || "daily at 22:00",
          folderName: foundJob.folderName || "N/A",
          sourceFilePath: foundJob.sourceFilePath || "s3://ingestion-01/Book.csv",
          destinationFilePath: foundJob.destinationFilePath || "s3://agntic-bl/Book.csv",
          businessRules: foundJob.businessRules || [{ name: "rule1", description: "price should be 0" }],
        });
      }
    }
  }, [id]);

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Completed: "bg-green-500/20 text-green-600 border-green-500/30",
      PENDING: "bg-orange-500/20 text-orange-600 border-orange-500/30",
      Created: "bg-gray-500/20 text-gray-600 border-gray-500/30",
      Running: "bg-blue-500/20 text-blue-600 border-blue-500/30",
      Failed: "bg-red-500/20 text-red-600 border-red-500/30",
      COMPLETED: "bg-green-500/20 text-green-600 border-green-500/30",
    };
    return <Badge className={styles[status] || styles.Created}>{status}</Badge>;
  };

  const getStepBadge = (status: "skipped" | "executed") => {
    if (status === "executed") {
      return <Badge className="bg-primary/20 text-primary border-primary/30">executed</Badge>;
    }
    return <Badge variant="secondary">skipped</Badge>;
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
                <Database className="w-4 h-4" />
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
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <User className="w-4 h-4" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate("/jobs")} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Button>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Job Details - {job.name}</h2>
          <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <h3 className="text-lg font-semibold mb-4">Job Overview</h3>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pipeline Name</p>
              <p className="font-medium">{job.pipelineName}</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Number of Connected Jobs</p>
              <p className="font-medium">{job.connectedJobs}</p>
            </div>
          </Card>
        </div>

        {/* Job Information & Execution Details */}
        <Card className="p-6 mb-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Job Information</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Job Name:</p>
                  <p className="font-medium">{job.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category:</p>
                  <p className="font-medium">{job.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description:</p>
                  <p className="font-medium">{job.description || "No description available"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Glue Job Name:</p>
                  <p className="font-medium">N/A</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Source:</p>
                  <p className="font-medium">{job.sourceFilePath}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data Destination:</p>
                  <p className="font-medium">{job.destinationFilePath}</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Execution Details</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Status:</p>
                  {getStatusBadge(job.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trigger Type:</p>
                  <p className="font-medium">{job.triggerType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email:</p>
                  <p className="font-medium">{job.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Schedule Details:</p>
                  <p className="font-medium">{job.scheduleDetails}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Folder Name:</p>
                  <p className="font-medium">{job.folderName}</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Job Stages */}
        <h3 className="text-lg font-semibold mb-4">Job Stages (3)</h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Stage 1</span>
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <p className="font-medium mb-2">DQ Rules</p>
            {getStepBadge(job.steps.dqRules)}
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Stage 2</span>
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <p className="font-medium mb-2">NER</p>
            {getStepBadge(job.steps.ner)}
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">Stage 3</span>
                <Clock className="w-3 h-3 text-muted-foreground" />
              </div>
            </div>
            <p className="font-medium mb-2">Business Logic</p>
            {getStepBadge(job.steps.businessLogic)}
          </Card>
        </div>

        {/* Business Logic Rules */}
        <h3 className="text-lg font-semibold mb-4">Business Logic Rules</h3>
        <div className="space-y-3">
          {job.businessRules?.map((rule, index) => (
            <Card key={index} className="p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-muted-foreground">{rule.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
