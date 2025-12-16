import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Search,
  Plus,
  Grid3X3,
  Settings,
  Edit,
} from "lucide-react";
import { toast } from "sonner";

interface Job {
  id: string;
  name: string;
  category: string;
  stages: number;
  steps: {
    dqRules: "skipped" | "executed";
    ner: "skipped" | "executed";
    businessLogic: "skipped" | "executed";
    dataTransformations: "skipped" | "executed";
  };
}

interface CanvasJob extends Job {
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

const CreatePipeline = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  const canvasRef = useRef<HTMLDivElement>(null);

  const [pipelineName, setPipelineName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [availableJobs, setAvailableJobs] = useState<Job[]>([]);
  const [canvasJobs, setCanvasJobs] = useState<CanvasJob[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [draggingJob, setDraggingJob] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      const jobs = JSON.parse(savedJobs);
      setAvailableJobs(
        jobs.map((j: any) => ({
          id: j.id,
          name: j.name,
          category: j.category || "SCHEDULE",
          stages: 4,
          steps: j.steps || {
            dqRules: "skipped",
            ner: "skipped",
            businessLogic: "skipped",
            dataTransformations: "skipped",
          },
        }))
      );
    } else {
      const sampleJobs: Job[] = [
        { id: "1", name: "testjob", category: "SCHEDULE", stages: 4, steps: { dqRules: "skipped", ner: "skipped", businessLogic: "executed", dataTransformations: "executed" } },
        { id: "2", name: "VeritasJob02", category: "SCHEDULE", stages: 4, steps: { dqRules: "executed", ner: "skipped", businessLogic: "skipped", dataTransformations: "skipped" } },
      ];
      setAvailableJobs(sampleJobs);
    }

    if (isEditing) {
      const savedPipelines = localStorage.getItem("pipelines");
      if (savedPipelines) {
        const pipelines = JSON.parse(savedPipelines);
        const pipeline = pipelines.find((p: any) => p.id === id);
        if (pipeline) {
          setPipelineName(pipeline.name);
          if (pipeline.connections) {
            setConnections(pipeline.connections);
          }
        }
      }
    }
  }, [id, isEditing]);

  useEffect(() => {
    if (isEditing && availableJobs.length > 0) {
      const savedPipelines = localStorage.getItem("pipelines");
      if (savedPipelines) {
        const pipelines = JSON.parse(savedPipelines);
        const pipeline = pipelines.find((p: any) => p.id === id);
        if (pipeline) {
          const jobsOnCanvas: CanvasJob[] = pipeline.jobs.map((jobName: string, index: number) => {
            const job = availableJobs.find((j) => j.name === jobName);
            return {
              id: job?.id || `job-${index}`,
              name: jobName,
              category: job?.category || "SCHEDULE",
              stages: 4,
              steps: job?.steps || { dqRules: "skipped", ner: "skipped", businessLogic: "skipped", dataTransformations: "skipped" },
              x: 60 + (index % 2) * 400,
              y: 60 + Math.floor(index / 2) * 300,
            };
          });
          setCanvasJobs(jobsOnCanvas);
        }
      }
    }
  }, [isEditing, availableJobs, id]);

  const filteredJobs = availableJobs.filter((job) =>
    job.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const snapPosition = (value: number) => {
    if (!snapToGrid) return value;
    const gridSize = 20;
    return Math.round(value / gridSize) * gridSize;
  };

  const addJobToCanvas = (job: Job) => {
    if (canvasJobs.find((j) => j.id === job.id)) {
      toast.error("Job already added to canvas");
      return;
    }
    const newCanvasJob: CanvasJob = {
      ...job,
      x: snapPosition(60 + (canvasJobs.length % 2) * 400),
      y: snapPosition(60 + Math.floor(canvasJobs.length / 2) * 300),
    };
    setCanvasJobs([...canvasJobs, newCanvasJob]);
  };

  const removeJobFromCanvas = (jobId: string) => {
    setCanvasJobs(canvasJobs.filter((j) => j.id !== jobId));
    setConnections(connections.filter((c) => c.from !== jobId && c.to !== jobId));
  };

  const clearCanvas = () => {
    setCanvasJobs([]);
    setConnections([]);
  };

  const handleMouseDown = (e: React.MouseEvent, jobId: string) => {
    const job = canvasJobs.find((j) => j.id === jobId);
    if (!job) return;
    
    setDraggingJob(jobId);
    setDragOffset({
      x: e.clientX - job.x,
      y: e.clientY - job.y,
    });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!draggingJob || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newX = snapPosition(e.clientX - canvasRect.left - dragOffset.x + canvasRef.current.scrollLeft);
    const newY = snapPosition(e.clientY - canvasRect.top - dragOffset.y + canvasRef.current.scrollTop);
    
    setCanvasJobs((prev) =>
      prev.map((j) =>
        j.id === draggingJob
          ? { ...j, x: Math.max(0, newX), y: Math.max(0, newY) }
          : j
      )
    );
  }, [draggingJob, dragOffset, snapToGrid]);

  const handleMouseUp = useCallback(() => {
    setDraggingJob(null);
  }, []);

  useEffect(() => {
    if (draggingJob) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [draggingJob, handleMouseMove, handleMouseUp]);

  const handleConnectionStart = (jobId: string, side: "left" | "right") => {
    if (connectingFrom === null) {
      setConnectingFrom(jobId);
    } else if (connectingFrom !== jobId) {
      const existingConnection = connections.find(
        (c) => (c.from === connectingFrom && c.to === jobId) || (c.from === jobId && c.to === connectingFrom)
      );
      if (!existingConnection) {
        setConnections([...connections, { from: connectingFrom, to: jobId }]);
      }
      setConnectingFrom(null);
    } else {
      setConnectingFrom(null);
    }
  };

  const savePipeline = () => {
    if (!pipelineName.trim()) {
      toast.error("Please enter a pipeline name");
      return;
    }
    if (canvasJobs.length === 0) {
      toast.error("Please add at least one job to the pipeline");
      return;
    }

    const savedPipelines = localStorage.getItem("pipelines");
    const pipelines = savedPipelines ? JSON.parse(savedPipelines) : [];

    if (isEditing) {
      const updatedPipelines = pipelines.map((p: any) =>
        p.id === id
          ? { ...p, name: pipelineName, jobs: canvasJobs.map((j) => j.name), connections }
          : p
      );
      localStorage.setItem("pipelines", JSON.stringify(updatedPipelines));
      toast.success("Pipeline updated successfully");
    } else {
      const newPipeline = {
        id: `pipeline-${Date.now()}`,
        name: pipelineName,
        jobs: canvasJobs.map((j) => j.name),
        connections,
        createdAt: new Date().toISOString(),
        status: "Completed",
      };
      localStorage.setItem("pipelines", JSON.stringify([...pipelines, newPipeline]));
      toast.success("Pipeline created successfully");
    }

    navigate("/pipelines");
  };

  const getStepStatus = (status: "skipped" | "executed") => {
    return status === "executed" ? (
      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/30">executed</Badge>
    ) : (
      <Badge variant="outline" className="text-xs">skipped</Badge>
    );
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between bg-background">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-lg">{isEditing ? "Edit Pipeline" : "New Pipeline"}</h2>
          <Input
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            placeholder="Enter pipeline name"
            className="w-56 bg-muted/30 border-border"
          />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg">
            <Grid3X3 className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Snap to Grid</span>
            <Switch checked={snapToGrid} onCheckedChange={setSnapToGrid} />
          </div>
          <Button variant="ghost" onClick={clearCanvas}>
            Clear Canvas
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate("/pipelines")}>
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Available Jobs Sidebar */}
        <div className="w-72 border-r border-border p-4 overflow-y-auto bg-background">
          <h3 className="font-semibold mb-4">Available Jobs ({filteredJobs.length})</h3>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="space-y-2">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-primary"
                onClick={() => addJobToCanvas(job)}
              >
                <p className="font-medium text-sm">{job.name}</p>
                <p className="text-xs text-muted-foreground">{job.category}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {job.stages} stages
                </Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 relative overflow-hidden bg-[#f8f9fb] dark:bg-[#1a1d21]">
          <div className="absolute top-4 left-4 text-sm font-medium text-foreground z-10">
            Pipeline Canvas
          </div>
          <div className="absolute top-4 right-4 text-sm text-muted-foreground flex items-center gap-1 z-10">
            <Plus className="w-4 h-4" /> Click jobs from sidebar to add, click blue dots to connect
          </div>

          {/* Light Grid Pattern */}
          <div
            ref={canvasRef}
            className="absolute inset-0 overflow-auto"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(220 13% 91% / 0.8) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(220 13% 91% / 0.8) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          >
            {/* SVG for connections */}
            <svg className="absolute inset-0 pointer-events-none" style={{ minWidth: "2000px", minHeight: "1200px" }}>
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 10 3.5, 0 7"
                    fill="hsl(220, 13%, 69%)"
                  />
                </marker>
              </defs>
              {connections.map((conn, index) => {
                const fromJob = canvasJobs.find((j) => j.id === conn.from);
                const toJob = canvasJobs.find((j) => j.id === conn.to);
                if (!fromJob || !toJob) return null;

                const cardWidth = 260;
                const cardHeight = 200;
                
                const startX = fromJob.x + cardWidth;
                const startY = fromJob.y + cardHeight / 2;
                const endX = toJob.x;
                const endY = toJob.y + cardHeight / 2;
                
                // Orthogonal (right-angle) path calculation
                const midX = startX + (endX - startX) / 2;
                
                return (
                  <path
                    key={`connection-${index}`}
                    d={`M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`}
                    stroke="hsl(220, 13%, 69%)"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </svg>

            {/* Canvas Jobs */}
            <div className="relative p-8" style={{ minHeight: "1200px", minWidth: "2000px" }}>
              {canvasJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`job-card absolute w-[260px] bg-background shadow-md cursor-move select-none ${
                    connectingFrom === job.id ? "border-2 border-blue-400 ring-2 ring-blue-200/50" : "border border-blue-300/50"
                  }`}
                  style={{ left: job.x, top: job.y }}
                  onMouseDown={(e) => handleMouseDown(e, job.id)}
                >
                  {/* Left connection dot */}
                  <div
                    className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:scale-125 transition-transform z-50 shadow-md"
                    style={{ pointerEvents: 'auto' }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleConnectionStart(job.id, "left"); }}
                  />
                  
                  {/* Right connection dot */}
                  <div
                    className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white cursor-pointer hover:scale-125 transition-transform z-50 shadow-md"
                    style={{ pointerEvents: 'auto' }}
                    onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleConnectionStart(job.id, "right"); }}
                  />

                  <div className="p-3 border-b border-border flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sm">{job.name}</span>
                      <p className="text-xs text-muted-foreground">{job.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}>
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7"
                        onClick={(e) => { e.stopPropagation(); removeJobFromCanvas(job.id); }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    <Badge variant="secondary" className="text-xs mb-3">
                      3 stages
                    </Badge>
                    <div className="text-xs font-medium text-muted-foreground mb-2">STAGES</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-xs">
                          <Settings className="w-3 h-3 text-muted-foreground" /> rules
                        </span>
                        {getStepStatus(job.steps.dqRules)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-xs">
                          <Settings className="w-3 h-3 text-muted-foreground" /> ner
                        </span>
                        {getStepStatus(job.steps.ner)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2 text-xs">
                          <Settings className="w-3 h-3 text-muted-foreground" /> businessLogic
                        </span>
                        {getStepStatus(job.steps.businessLogic)}
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-3 pt-2 border-t border-border">
                      <span>In: <span className="text-foreground">data</span></span>
                      <span>Out: <span className="text-foreground">data</span></span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border p-4 flex justify-end gap-3 bg-background">
        <Button variant="outline" onClick={() => navigate("/pipelines")}>
          Cancel
        </Button>
        <Button onClick={savePipeline}>
          {isEditing ? "Update Pipeline" : "Save Pipeline"}
        </Button>
      </div>
    </div>
  );
};

export default CreatePipeline;
