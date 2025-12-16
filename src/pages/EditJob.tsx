import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, Plus, Settings, Clock, Filter, Database, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface JobStage {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
}

interface Job {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  lastRun: string;
  status: string;
  steps: {
    dqRules: "skipped" | "executed";
    ner: "skipped" | "executed";
    businessLogic: "skipped" | "executed";
    dataTransformations: "skipped" | "executed";
  };
  stages?: JobStage[];
}

const availableSteps = [
  { id: "dq", name: "DQ Rules", description: "Validate data quality rules...", color: "bg-blue-500", icon: Filter },
  { id: "ner", name: "NER", description: "Named Entity Recognition process...", color: "bg-orange-500", icon: Settings },
  { id: "bl", name: "Business Logic", description: "Apply business logic rules...", color: "bg-blue-500", icon: Settings },
];

const defaultStages: JobStage[] = [
  { id: "dq", name: "DQ Rules", type: "Validation", description: "Data quality validation rules", color: "bg-blue-500" },
  { id: "ner", name: "NER", type: "Processing", description: "Named Entity Recognition", color: "bg-orange-500" },
  { id: "bl", name: "Business Logic", type: "Logic", description: "Apply business logic rules", color: "bg-blue-500" },
];

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [jobName, setJobName] = useState("");
  const [stages, setStages] = useState<JobStage[]>(defaultStages);

  useEffect(() => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      const jobs = JSON.parse(savedJobs);
      const foundJob = jobs.find((j: Job) => j.id === id);
      if (foundJob) {
        setJobName(foundJob.name);
        if (foundJob.stages) {
          setStages(foundJob.stages);
        }
      }
    }
  }, [id]);

  const addStep = (step: typeof availableSteps[0]) => {
    const newStage: JobStage = {
      id: `${step.id}-${Date.now()}`,
      name: step.name,
      type: step.name,
      description: step.description,
      color: step.color,
    };
    setStages([...stages, newStage]);
  };

  const removeStage = (stageId: string) => {
    setStages(stages.filter((s) => s.id !== stageId));
  };

  const saveChanges = () => {
    const savedJobs = localStorage.getItem("jobs");
    if (savedJobs) {
      const jobs = JSON.parse(savedJobs);
      const updatedJobs = jobs.map((j: Job) =>
        j.id === id ? { ...j, name: jobName, stages } : j
      );
      localStorage.setItem("jobs", JSON.stringify(updatedJobs));
      toast.success("Job updated successfully");
      navigate("/jobs");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Edit Job: {jobName}</h2>
            <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Job Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Job Name *</label>
            <Input
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job name"
              className="bg-primary/5 border-primary/20"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Available Steps */}
            <div>
              <h3 className="font-semibold mb-4">Available Steps</h3>
              <div className="space-y-3">
                {availableSteps.map((step) => (
                  <Card
                    key={step.id}
                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-yellow-500"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => addStep(step)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Job Stage Pipeline */}
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
                <p className="text-sm text-muted-foreground">Click + to add stages • Click to configure</p>
              </div>
              <div className="space-y-3">
                {stages.map((stage) => (
                  <Card
                    key={stage.id}
                    className="p-4 flex items-center gap-3 border-l-4 border-l-primary"
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Database className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{stage.name}</p>
                        <Clock className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.type}</p>
                      <p className="text-xs text-muted-foreground">{stage.description}</p>
                    </div>
                    <Button size="icon" variant="ghost" onClick={() => removeStage(stage.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/jobs")}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EditJob;
