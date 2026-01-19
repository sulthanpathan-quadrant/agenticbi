// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { X, Plus, Settings, Clock, Filter, Database, GripVertical } from "lucide-react";
// import { toast } from "sonner";

// interface JobStage {
//   id: string;
//   name: string;
//   type: string;
//   description: string;
//   color: string;
// }

// interface Job {
//   id: string;
//   name: string;
//   category: string;
//   createdAt: string;
//   lastRun: string;
//   status: string;
//   steps: {
//     dqRules: "skipped" | "executed";
//     ner: "skipped" | "executed";
//     businessLogic: "skipped" | "executed";
//     dataTransformations: "skipped" | "executed";
//   };
//   stages?: JobStage[];
// }

// const availableSteps = [
//   { id: "dq", name: "DQ Rules", description: "Validate data quality rules...", color: "bg-blue-500", icon: Filter },
//   { id: "ner", name: "NER", description: "Named Entity Recognition process...", color: "bg-orange-500", icon: Settings },
//   { id: "bl", name: "Business Logic", description: "Apply business logic rules...", color: "bg-blue-500", icon: Settings },
// ];

// const defaultStages: JobStage[] = [
//   { id: "dq", name: "DQ Rules", type: "Validation", description: "Data quality validation rules", color: "bg-blue-500" },
//   { id: "ner", name: "NER", type: "Processing", description: "Named Entity Recognition", color: "bg-orange-500" },
//   { id: "bl", name: "Business Logic", type: "Logic", description: "Apply business logic rules", color: "bg-blue-500" },
// ];

// const EditJob = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   const [jobName, setJobName] = useState("");
//   const [stages, setStages] = useState<JobStage[]>(defaultStages);

//   useEffect(() => {
//     const savedJobs = localStorage.getItem("jobs");
//     if (savedJobs) {
//       const jobs = JSON.parse(savedJobs);
//       const foundJob = jobs.find((j: Job) => j.id === id);
//       if (foundJob) {
//         setJobName(foundJob.name);
//         if (foundJob.stages) {
//           setStages(foundJob.stages);
//         }
//       }
//     }
//   }, [id]);

//   const addStep = (step: typeof availableSteps[0]) => {
//     const newStage: JobStage = {
//       id: `${step.id}-${Date.now()}`,
//       name: step.name,
//       type: step.name,
//       description: step.description,
//       color: step.color,
//     };
//     setStages([...stages, newStage]);
//   };

//   const removeStage = (stageId: string) => {
//     setStages(stages.filter((s) => s.id !== stageId));
//   };

//   const saveChanges = () => {
//     const savedJobs = localStorage.getItem("jobs");
//     if (savedJobs) {
//       const jobs = JSON.parse(savedJobs);
//       const updatedJobs = jobs.map((j: Job) =>
//         j.id === id ? { ...j, name: jobName, stages } : j
//       );
//       localStorage.setItem("jobs", JSON.stringify(updatedJobs));
//       toast.success("Job updated successfully");
//       navigate("/jobs");
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//       <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background border border-border">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold">Edit Job: {jobName}</h2>
//             <Button variant="ghost" size="icon" onClick={() => navigate("/jobs")}>
//               <X className="w-5 h-5" />
//             </Button>
//           </div>

//           {/* Job Name */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium mb-2">Job Name *</label>
//             <Input
//               value={jobName}
//               onChange={(e) => setJobName(e.target.value)}
//               placeholder="Enter job name"
//               className="bg-primary/5 border-primary/20"
//             />
//           </div>

//           <div className="grid grid-cols-3 gap-6">
//             {/* Available Steps */}
//             <div>
//               <h3 className="font-semibold mb-4">Available Steps</h3>
//               <div className="space-y-3">
//                 {availableSteps.map((step) => (
//                   <Card
//                     key={step.id}
//                     className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-yellow-500"
//                   >
//                     <GripVertical className="w-4 h-4 text-muted-foreground" />
//                     <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center`}>
//                       <step.icon className="w-4 h-4 text-white" />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-medium text-sm">{step.name}</p>
//                       <p className="text-xs text-muted-foreground truncate">{step.description}</p>
//                     </div>
//                     <Button size="icon" variant="ghost" onClick={() => addStep(step)}>
//                       <Plus className="w-4 h-4" />
//                     </Button>
//                   </Card>
//                 ))}
//               </div>
//             </div>

//             {/* Job Stage Pipeline */}
//             <div className="col-span-2">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
//                 <p className="text-sm text-muted-foreground">Click + to add stages • Click to configure</p>
//               </div>
//               <div className="space-y-3">
//                 {stages.map((stage) => (
//                   <Card
//                     key={stage.id}
//                     className="p-4 flex items-center gap-3 border-l-4 border-l-primary"
//                   >
//                     <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
//                     <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
//                       <Database className="w-5 h-5 text-primary" />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <p className="font-medium">{stage.name}</p>
//                         <Clock className="w-3 h-3 text-muted-foreground" />
//                       </div>
//                       <p className="text-sm text-muted-foreground">{stage.type}</p>
//                       <p className="text-xs text-muted-foreground">{stage.description}</p>
//                     </div>
//                     <Button size="icon" variant="ghost" onClick={() => removeStage(stage.id)}>
//                       <X className="w-4 h-4" />
//                     </Button>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
//             <Button variant="outline" onClick={() => navigate("/jobs")}>
//               Cancel
//             </Button>
//             <Button onClick={saveChanges}>Save Changes</Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default EditJob;

  
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { X, Plus, Settings, Clock, Filter, Database, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
 
const API_BASE = "https://20.81.213.147";
 
interface JobStage {
  id: string;
  name: string;
  type: string;
  description: string;
  color: string;
}
 
interface DetailedJobResponse {
  user_id: string;
  job_id: string;
  job_name: string;
  created_at: string;
  overall_job_status: string | null;
  overall_last_job_run: string | null;
  schedule: string | null;
  datasource_paths: string[];
  dq_enabled: boolean;
  ner_enabled: boolean;
  business_logic_enabled: boolean;
  business_logic_rules?: Record<string, string>;
}
 
const availableStepsBase = [
  { id: "dq", name: "DQ Rules", description: "Validate data quality rules...", color: "bg-blue-500", icon: Filter },
  { id: "ner", name: "NER", description: "Named Entity Recognition process...", color: "bg-orange-500", icon: Settings },
  { id: "bl", name: "Business Logic", description: "Apply business logic rules...", color: "bg-blue-500", icon: Settings },
];
 
const EditJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: jobId } = useParams<{ id: string }>();
  const [jobName, setJobName] = useState("");
  const [stages, setStages] = useState<JobStage[]>([]);
  const [availableSteps, setAvailableSteps] = useState<typeof availableStepsBase>(availableStepsBase);
  const [jobConfig, setJobConfig] = useState<DetailedJobResponse | null>(null);
  const [localRules, setLocalRules] = useState<Record<string, string>>({});
 
  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [popupLoading, setPopupLoading] = useState(false);
 
  // Add Rule dialog states
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [newRuleDesc, setNewRuleDesc] = useState("");
  const [newRuleLogic, setNewRuleLogic] = useState("");
 
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userId = user?.id || user?.user_id;
 
  // Receive rules from Jobs.tsx via navigation state
  useEffect(() => {
    if (location.state?.business_logic_rules) {
      setLocalRules(location.state.business_logic_rules);
    }
  }, [location.state]);
 
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("User or Job ID missing");
      return;
    }
 
    const fetchJobConfig = async () => {
      try {
        const response = await fetch(`${API_BASE}/view-job?user_id=${userId}&job_id=${jobId}`);
        if (!response.ok) throw new Error("Failed to fetch job config");
 
        const data = await response.json();
        setJobConfig(data);
        setJobName(data.job_name || "Unnamed Job");
 
        // Initialize localRules from API if not already set
        if (data.business_logic_rules && Object.keys(localRules).length === 0) {
          setLocalRules(data.business_logic_rules);
        }
 
        const newAvailable = [];
        const newStages = [];
 
        availableStepsBase.forEach((step) => {
          const enabledKey =
            step.id === "dq" ? "dq_enabled" :
            step.id === "ner" ? "ner_enabled" :
            "business_logic_enabled";
 
          if (data[enabledKey]) {
            newStages.push({
              id: step.id,
              name: step.name,
              type: step.name,
              description: step.description,
              color: step.color,
            });
          } else {
            newAvailable.push(step);
          }
        });
 
        setStages(newStages);
        setAvailableSteps(newAvailable);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load job configuration");
        setJobConfig(null);
      }
    };
 
    fetchJobConfig();
  }, [userId, jobId]);
 
  const addStep = (step: typeof availableStepsBase[0]) => {
    const newStage = {
      id: step.id,
      name: step.name,
      type: step.name,
      description: step.description,
      color: step.color,
    };
    setStages([...stages, newStage]);
    setAvailableSteps(availableSteps.filter(s => s.id !== step.id));
  };
 
  const removeStage = (stageId: string) => {
    const removed = stages.find(s => s.id === stageId);
    setStages(stages.filter(s => s.id !== stageId));
    if (removed) {
      const original = availableStepsBase.find(s => s.id === removed.id);
      if (original) setAvailableSteps([...availableSteps, original]);
    }
  };
 
  const openStageConfig = async (stageId: string) => {
    setSelectedStage(stageId);
    setPopupLoading(true);
    setShowConfigPopup(true);
 
    if (userId && jobId) {
      try {
        const res = await fetch(`${API_BASE}/view-job?user_id=${userId}&job_id=${jobId}`);
        if (res.ok) {
          const fresh = await res.json();
          setJobConfig(fresh);
          if (fresh.business_logic_rules) {
            setLocalRules(prev => ({ ...prev, ...fresh.business_logic_rules }));
          }
        }
      } catch (err) {
        console.warn("Popup refresh failed");
      }
    }
 
    setPopupLoading(false);
  };
 
  const closeStageConfig = () => {
    setShowConfigPopup(false);
    setSelectedStage(null);
  };
 
  // Add new rule
  const handleAddRule = () => {
    if (!newRuleName.trim() || !newRuleLogic.trim()) {
      return toast.error("Rule name and business logic are required");
    }
 
    const updatedRules = {
      ...localRules,
      [newRuleName.trim()]: newRuleLogic.trim(),
    };
 
    setLocalRules(updatedRules);
    setShowAddRuleDialog(false);
    setNewRuleName("");
    setNewRuleDesc("");
    setNewRuleLogic("");
    toast.success("Rule added — save changes to apply permanently");
  };
 
  // Delete rule
  const handleDeleteRule = (ruleKey: string) => {
    const updatedRules = { ...localRules };
    delete updatedRules[ruleKey];
    setLocalRules(updatedRules);
    toast.success(`Rule "${ruleKey}" deleted — save changes to apply`);
  };
 
  const saveChanges = async () => {
    if (!userId || !jobId) return toast.error("User/Job ID missing");
 
    const payload = {
      user_id: userId,
      job_id: jobId,
      dq: stages.some(s => s.id === "dq"),
      ner: stages.some(s => s.id === "ner"),
      business_logic: stages.some(s => s.id === "bl"),
      rules: localRules, // send current rules (after add/delete)
    };
 
    try {
      const res = await fetch(`${API_BASE}/edit-job-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
 
      if (!res.ok) throw new Error("Update failed");
 
      const data = await res.json();
      if (data.status === "success") {
        toast.success("Job updated successfully");
 
        const saved = localStorage.getItem("jobs");
        if (saved) {
          const jobs = JSON.parse(saved);
          const updated = jobs.map((j: any) =>
            j.id === jobId ? { ...j, name: jobName, stages } : j
          );
          localStorage.setItem("jobs", JSON.stringify(updated));
        }
 
        navigate("/jobs");
      } else {
        throw new Error(data.message || "Unknown error");
      }
    } catch (err) {
      toast.error("Failed to save changes");
      console.error(err);
    }
  };
 
  const renderStagePopup = () => {
    if (!selectedStage || !jobConfig) return null;
 
    const titleMap = {
      dq: "DQ Rules",
      ner: "NER",
      bl: "Business Logic",
    };
 
    const iconMap = {
      dq: <Filter className="w-5 h-5" />,
      ner: <Settings className="w-5 h-5" />,
      bl: <Settings className="w-5 h-5" />,
    };
 
    const enabledKey =
      selectedStage === "dq" ? "dq_enabled" :
      selectedStage === "ner" ? "ner_enabled" :
      "business_logic_enabled";
 
    const isEnabled = !!jobConfig[enabledKey];
 
    return (
      <Dialog open={showConfigPopup} onOpenChange={setShowConfigPopup}>
        <DialogContent className="max-w-3xl bg-gradient-to-b from-slate-950 to-slate-900 border-slate-700 text-white">
          <DialogHeader className="border-b border-slate-700 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                {iconMap[selectedStage]}
              </div>
              <DialogTitle className="text-2xl font-bold">
                Configure Stage: {titleMap[selectedStage]}
              </DialogTitle>
            </div>
            <p className="text-slate-400 mt-1">
              Adjust the settings for the {titleMap[selectedStage]} stage in your job pipeline.
            </p>
          </DialogHeader>
 
          {popupLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-slate-400">Loading latest configuration...</p>
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {/* Stage Overview */}
              <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
                <h3 className="font-semibold mb-4 text-lg">Stage Overview</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-400">Stage Type</p>
                    <p className="font-medium mt-1">{titleMap[selectedStage]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Current Status</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4 text-yellow-400" />
                      <Badge variant="outline" className="bg-yellow-950/30 text-yellow-400 border-yellow-600/50">
                        {isEnabled ? "enabled" : "disabled"}
                      </Badge>
                    </div>
                  </div>
                </div>
                <p className="text-slate-300 mt-4">
                  {isEnabled
                    ? `This stage is currently enabled and will run as part of the pipeline.`
                    : `This stage is disabled. Enable it to include in job execution.`}
                </p>
              </div>
 
              {/* Stage-specific content */}
              <div className="bg-slate-900/60 border border-slate-700 rounded-lg p-5">
                {selectedStage === "dq" && (
                  <>
                    <h3 className="font-semibold mb-4 text-lg">Data Quality Rules</h3>
                    <div className="bg-slate-800/50 border border-slate-600 rounded p-6 text-center text-slate-300">
                      {isEnabled
                        ? "Data Quality validation is active. Rules will be applied during execution."
                        : "DQ Rules are currently disabled."}
                    </div>
                  </>
                )}
 
                {selectedStage === "ner" && (
                  <>
                    <h3 className="font-semibold mb-4 text-lg">Named Entity Recognition (NER)</h3>
                    <div className="bg-slate-800/50 border border-slate-600 rounded p-6 text-center text-slate-300">
                      {isEnabled
                        ? "NER processing is enabled. Entities will be extracted from the data."
                        : "NER stage is currently disabled."}
                    </div>
                  </>
                )}
 
                {selectedStage === "bl" && (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-lg">Business Logic Rules</h3>
                      <Button size="sm" className="gap-1" onClick={() => setShowAddRuleDialog(true)}>
                        <Plus className="w-4 h-4" /> Add Rule
                      </Button>
                    </div>
 
                    <div className="space-y-3">
                      {Object.keys(localRules).length > 0 ? (
                        Object.entries(localRules).map(([key, value], index) => (
                          <Card key={index} className="bg-slate-800 border-slate-700 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{key}</p>
                                <p className="text-sm text-slate-400 mt-1">{value}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteRule(key)}  // ← Delete functionality here
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          </Card>
                        ))
                      ) : (
                        <div className="bg-slate-800/50 border border-slate-600 rounded p-6 text-center text-slate-400">
                          No business logic rules have been defined yet.
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
 
          <DialogFooter className="border-t border-slate-700 pt-4">
            <div className="flex w-full justify-between items-center">
              <Button variant="outline" onClick={closeStageConfig}>
                ← Back to Pipeline
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={closeStageConfig}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={saveChanges}>
                  Save Configuration
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
 
        {/* Add New Rule Dialog */}
        <Dialog open={showAddRuleDialog} onOpenChange={setShowAddRuleDialog}>
          <DialogContent className="sm:max-w-[500px] bg-slate-950 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle>Add New Business Rule</DialogTitle>
              <DialogDescription className="text-slate-400">
                Enter details for the new business rule.
              </DialogDescription>
            </DialogHeader>
 
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Enter rule name (e.g., rule3, validation_rule)"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
 
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newRuleDesc}
                  onChange={(e) => setNewRuleDesc(e.target.value)}
                  placeholder="Describe what this rule does"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
 
              <div className="grid gap-2">
                <Label htmlFor="logic">Business Logic</Label>
                <Input
                  id="logic"
                  value={newRuleLogic}
                  onChange={(e) => setNewRuleLogic(e.target.value)}
                  placeholder="Enter the business logic (e.g., validate_column_not_null, check_date_format)"
                  className="bg-slate-900 border-slate-700"
                />
              </div>
            </div>
 
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddRuleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddRule} className="bg-blue-600 hover:bg-blue-700">
                Add Rule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Dialog>
    );
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
            <div>
              <h3 className="font-semibold mb-4">Available Steps</h3>
              <div className="space-y-3">
                {availableSteps.map((step) => (
                  <Card
                    key={step.id}
                    className="p-3 flex items-center gap-3 cursor-pointer hover:bg-muted/50 transition-colors border-l-4 border-l-yellow-500"
                    onClick={() => openStageConfig(step.id)}
                  >
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                    <div className={`w-8 h-8 rounded-lg ${step.color} flex items-center justify-center`}>
                      <step.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{step.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{step.description}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        addStep(step);
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
 
            <div className="col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Job Stage Pipeline ({stages.length} stages)</h3>
                <p className="text-sm text-muted-foreground">Click + to add stages • Click to configure</p>
              </div>
              <div className="space-y-3">
                {stages.map((stage) => (
                  <Card
                    key={stage.id}
                    className="p-4 flex items-center gap-3 border-l-4 border-l-primary cursor-pointer hover:bg-muted/50"
                    onClick={() => openStageConfig(stage.id)}
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
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeStage(stage.id);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
 
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={() => navigate("/jobs")}>
              Cancel
            </Button>
            <Button onClick={saveChanges}>Save Changes</Button>
          </div>
        </div>
      </Card>
 
      {renderStagePopup()}
    </div>
  );
};
 
export default EditJob;
 