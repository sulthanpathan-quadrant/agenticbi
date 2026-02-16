// import { useState, useEffect } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import {
//   ArrowLeft,
//   Calendar,
//   Clock,
//   Code2,
//   Edit,
//   Eye,
//   Loader2,
//   Play,
//   Plus,
//   Settings2,
//   Trash,
//   X,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast, useToast } from "@/hooks/use-toast";
// import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
// import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
// import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// interface Column {
//   name: string;
//   table: string;
//   type: string;
// }

// interface BuiltDataset {
//   name: string;
//   columns: Column[];
//   sampleRows: Record<string, any>[];
// }

// export default function ETLOutput() {
//   const navigate = useNavigate();
//   const { dismiss } = useToast();

//   const [builtDataset, setBuiltDataset] = useState<BuiltDataset | null>(null);
//   const [fullPreviewData, setFullPreviewData] = useState<Record<string, any>[]>([]);
//   const [showFullPreview, setShowFullPreview] = useState(false);
//   const [isPreviewLoading, setIsPreviewLoading] = useState(false);

//   // Business rules
//   const [rules, setRules] = useState<any[]>([]);
//   const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
//   const [showValidationDialog, setShowValidationDialog] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [showCompleteDialog, setShowCompleteDialog] = useState(false);
//   const [editingRule, setEditingRule] = useState<number | null>(null);
//   const [jobInfo, setJobInfo] = useState<{ correlation_id?: string; databricks_run_id?: string; message?: string } | null>(null);

//   // Schedule dialog
//   const [showScheduleDialog, setShowScheduleDialog] = useState(false);
//   const [triggerType, setTriggerType] = useState<"schedule" | "file">("schedule");
//   const [frequency, setFrequency] = useState("");
//   const [time, setTime] = useState("");
//   const [jobName, setJobName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const [workflowStep, setWorkflowStep] = useState<"preview" | "business-rules">("preview");

//   const closeToastButton = (
//     <button
//       onClick={() => dismiss()}
//       className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
//       aria-label="Close toast"
//     >
//       <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
//     </button>
//   );

//   // Fetch dataset on mount
//   useEffect(() => {
//     const userId = localStorage.getItem("selected_user_id");
//     const jobId = localStorage.getItem("selected_job_id");
//     const datasetName = localStorage.getItem("selected_dataset_name");

//     if (!userId || !jobId || !datasetName) {
//       toast({
//         title: "Missing Information",
//         description: "User ID, Job ID or Dataset name not found",
//         variant: "destructive",
//         action: closeToastButton,
//       });
//       return;
//     }

//     const fetchData = async () => {
//       setIsPreviewLoading(true);
//       try {
//         // Columns
//         const columnsRes = await fetch(
//           `https://20.81.213.147/dataset-list-columns?user_id=${userId}&job_id=${jobId}&filename=${datasetName}`,
//           { headers: { accept: "application/json" } }
//         );
//         if (!columnsRes.ok) throw new Error("Columns fetch failed");
//         const columnsData = await columnsRes.json();
//         const columns = columnsData.columns?.map((c: { name: string; type: string }) => ({
//           name: c.name,
//           type: c.type,
//           table: datasetName,
//         })) ?? [];

//         // Preview
//         const previewRes = await fetch(
//           `https://20.81.213.147/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${encodeURIComponent(datasetName)}`,
//           { headers: { accept: "application/json" } }
//         );
//         if (!previewRes.ok) throw new Error("Preview fetch failed");
//         const previewJson = await previewRes.json();
//         const rows = previewJson.preview_rows ?? previewJson.rows ?? previewJson ?? [];

//         setBuiltDataset({
//           name: datasetName,
//           columns,
//           sampleRows: Array.isArray(rows) ? rows : [],
//         });
//         setFullPreviewData(Array.isArray(rows) ? rows : []);
//       } catch (err: any) {
//         console.error(err);
//         toast({
//           title: "Load Error",
//           description: err.message || "Failed to load dataset",
//           variant: "destructive",
//           action: closeToastButton,
//         });
//       } finally {
//         setIsPreviewLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (showFullPreview && builtDataset) {
//       setFullPreviewData(builtDataset.sampleRows);
//     }
//   }, [showFullPreview, builtDataset]);

//   // Job name from localStorage
//   useEffect(() => {
//     const etlJobName = localStorage.getItem("currentJobName");
//     const etlTableName = localStorage.getItem("etlTableName");
//     if (etlJobName) setJobName(etlJobName);
//     else if (etlTableName) setJobName(`Job_${etlTableName}`);
//   }, []);

//   const getUserId = () => localStorage.getItem("selected_user_id");

//   const scheduleJob = async () => {
//     if (triggerType === "schedule" && !frequency) {
//       toast({
//         variant: "destructive",
//         title: "Validation Error",
//         description: "Please select a frequency",
//         action: closeToastButton,
//       });
//       return;
//     }

//     const userId = getUserId();
//     if (!userId) {
//       toast({
//         variant: "destructive",
//         title: "Authentication Error",
//         description: "User ID not found",
//         action: closeToastButton,
//       });
//       return;
//     }

//     setLoading(true);

//     const jobId = localStorage.getItem("selected_job_id") || "";

//     const payload = {
//       job_id: jobId,
//       job_name: jobName || `Job_${new Date().toISOString().split("T")[0]}`,
//       schedule_details:
//         triggerType === "schedule" ? { frequency, time: time || "00:00" } : null,
//     };

//     try {
//       const url = `https://4.227.238.34/schedule-job?user_id=${userId}`;
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errText = await res.text();
//         throw new Error(errText || `HTTP ${res.status}`);
//       }

//       const data = await res.json();

//       if (data.message?.toLowerCase().includes("success")) {
//         toast({
//           title: "Success",
//           description: "Job scheduled successfully",
//           action: closeToastButton,
//         });

//         // Optional: save to local jobs list (your original logic can be pasted here)

//         localStorage.removeItem("currentJobName");
//         localStorage.removeItem("etlTableName");

//         setShowScheduleDialog(false);
//         navigate("/jobs");
//       } else {
//         throw new Error(data.message || "Scheduling failed");
//       }
//     } catch (err: any) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: err.message || "Failed to schedule job",
//         action: closeToastButton,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddRule = (rule: any) => {
//     if (editingRule !== null) {
//       const updated = [...rules];
//       updated[editingRule] = { ...rule, status: "testing" };
//       setRules(updated);
//       setEditingRule(null);
//     } else {
//       setRules([...rules, { ...rule, status: "testing" }]);
//     }
//     setShowAddRuleDialog(false);
//     toast({
//       title: editingRule !== null ? "Rule Updated" : "Rule Added",
//       description: `Business rule ${editingRule !== null ? "updated" : "added"} successfully`,
//       duration: 1400,
//       action: closeToastButton,
//     });
//   };

//   const handleEditRule = (index: number) => {
//     setEditingRule(index);
//     setShowAddRuleDialog(true);
//   };

//   const handleDeleteRule = (index: number) => {
//     setRules(rules.filter((_, i) => i !== index));
//     toast({
//       title: "Rule Deleted",
//       description: "Business rule has been removed",
//       duration: 1200,
//       action: closeToastButton,
//     });
//   };

//   const handleRunAllRules = async () => {
//     if (rules.length === 0 || !builtDataset?.name) {
//       toast({
//         title: "Cannot Run",
//         description: rules.length === 0 ? "No rules defined" : "No dataset loaded",
//         variant: "destructive",
//         action: closeToastButton,
//       });
//       return;
//     }

//     let filename = builtDataset.name;
//     if (!filename.toLowerCase().endsWith(".csv")) filename += ".csv";

//     const userId = localStorage.getItem("selected_user_id");
//     const jobId = localStorage.getItem("selected_job_id");
//     if (!userId || !jobId) return;

//     const blobPath = `${userId}/${jobId}/${filename}`;

//     const rulesPayload: Record<string, string> = {};
//     rules.forEach((r) => (rulesPayload[r.name] = r.logic));

//     const payload = {
//       blob_path: blobPath,
//       rules: rulesPayload,
//       mode: "auto",
//       overwrite_source: false,
//       output_blob_path: `processed/${builtDataset.name.replace(/\.csv$/i, "")}_filtered.csv`,
//     };

//     setValidating(true);
//     setShowValidationDialog(true);
//     setJobInfo(null);

//     try {
//       const res = await fetch("https://20.81.213.147/api/v1/business-rules/process", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Accept: "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) throw new Error(`API error: ${res.status}`);

//       const result = await res.json();

//       if (result.status === "job_submitted") {
//         setJobInfo({
//           correlation_id: result.correlation_id,
//           databricks_run_id: result.databricks_run_id,
//           message: result.message,
//         });
//         toast({
//           title: "Job Submitted",
//           description: "Business rules processing started",
//           action: closeToastButton,
//         });
//       } else {
//         throw new Error(result.message || "Unexpected response");
//       }
//     } catch (err: any) {
//       toast({
//         title: "Submission Failed",
//         description: err.message || "Could not start business rules job",
//         variant: "destructive",
//         action: closeToastButton,
//       });
//     } finally {
//       setValidating(false);
//       setTimeout(() => {
//         setShowValidationDialog(false);
//         setShowCompleteDialog(true);
//       }, 1400);
//     }
//   };

//   const handleBack = () => {
//     setWorkflowStep("preview");
//     // Optionally clear rules if desired: setRules([]);
//   };

//   return (
//     <WorkflowLayout>
//       <div className="p-6 md:p-8">
//         {/* Header + top-right buttons */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold">ETL Pipeline</h1>
//             <p className="text-muted-foreground mt-1">
//               {workflowStep === "preview" && "Preview your dataset"}
//               {workflowStep === "business-rules" && "Apply business logic rules"}
//             </p>
//           </div>

//           {workflowStep === "preview" && (
//             <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
//               <Button
//                 onClick={() => setWorkflowStep("business-rules")}
//                 className="bg-primary hover:bg-primary/90 min-w-[180px]"
//               >
//                 <Settings2 className="mr-2 h-4 w-4" />
//                 Apply Business Logic
//               </Button>
//               <Button
//                 variant="outline"
//                 onClick={() => setShowScheduleDialog(true)}
//                 className="min-w-[150px]"
//               >
//                 <Calendar className="mr-2 h-4 w-4" />
//                 Schedule Job
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Preview view */}
//         {workflowStep === "preview" && (
//           <div className="space-y-6">
//             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <p className="text-lg">
//                     <span className="font-semibold">Dataset:</span>{" "}
//                     <span className="text-primary font-medium">
//                       {builtDataset?.name || "Not loaded"}
//                     </span>
//                   </p>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {builtDataset?.columns.length || 0} columns •{" "}
//                     {builtDataset?.sampleRows.length || 0} preview rows
//                   </p>
//                 </div>
//                 <Button variant="outline" onClick={() => setShowFullPreview(true)}>
//                   <Eye className="mr-2 h-4 w-4" />
//                   Full Preview
//                 </Button>
//               </div>
//             </div>

//             {isPreviewLoading ? (
//               <div className="flex justify-center py-20">
//                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
//               </div>
//             ) : !builtDataset || builtDataset.sampleRows.length === 0 ? (
//               <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl">
//                 No preview data available
//               </div>
//             ) : (
//               <div className="border rounded-xl overflow-hidden">
//                 <div className="overflow-x-auto max-h-[520px]">
//                   <table className="w-full min-w-max">
//                     <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm z-10">
//                       <tr>
//                         {builtDataset.columns.map((col) => (
//                           <th
//                             key={col.name}
//                             className="text-left px-5 py-3 text-sm font-medium border-b whitespace-nowrap"
//                           >
//                             {col.name}
//                             <div className="text-xs text-muted-foreground mt-0.5">({col.type})</div>
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {builtDataset.sampleRows.map((row, idx) => (
//                         <tr
//                           key={idx}
//                           className="border-b last:border-0 hover:bg-muted/40 transition-colors"
//                         >
//                           {builtDataset.columns.map((col) => (
//                             <td
//                               key={col.name}
//                               className="px-5 py-3 text-sm whitespace-nowrap"
//                             >
//                               {String(row[col.name] ?? "—")}
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Business Rules view */}
//         {workflowStep === "business-rules" && (
//           <div className="space-y-6">
//             <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
//               <p className="text-sm">
//                 <span className="font-semibold">Working with:</span>{" "}
//                 <span className="text-primary">{builtDataset?.name || "—"}</span>
//               </p>
//             </div>

//             <div className="flex justify-end gap-3">
//               <Button
//                 variant="outline"
//                 onClick={handleRunAllRules}
//                 disabled={rules.length === 0 || validating}
//               >
//                 {validating ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Submitting...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="mr-2 h-4 w-4" />
//                     Run All Rules
//                   </>
//                 )}
//               </Button>
//               <Button onClick={() => setShowAddRuleDialog(true)}>
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add New Rule
//               </Button>
//             </div>

//             <div className="border rounded-lg p-6 bg-card">
//               {rules.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
//                   <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
//                   <h3 className="text-lg font-semibold mb-2">No Business Rules Yet</h3>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Click "Add New Rule" to get started
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {rules.map((rule, index) => (
//                     <div key={index} className="border rounded-lg p-4 bg-background">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           <h3 className="text-lg font-semibold">{rule.name}</h3>
//                           <span className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-600">
//                             {rule.status}
//                           </span>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button variant="outline" size="sm" onClick={() => handleEditRule(index)}>
//                             <Edit className="h-4 w-4 mr-2" />
//                             Edit
//                           </Button>
//                           <Button variant="outline" size="sm" onClick={() => handleDeleteRule(index)}>
//                             <Trash className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
//                       <div className="bg-muted/50 rounded p-3 font-mono text-sm">
//                         <pre className="whitespace-pre-wrap">{rule.logic}</pre>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-start">
//               <Button variant="outline" onClick={handleBack}>
//                 <ArrowLeft className="mr-2 h-4 w-4" />
//                 Back to Preview
//               </Button>
//             </div>
//           </div>
//         )}

//         {/* ─── Dialogs ─── */}
//         <AddBusinessRuleDialog
//           open={showAddRuleDialog}
//           onOpenChange={(open) => {
//             setShowAddRuleDialog(open);
//             if (!open) setEditingRule(null);
//           }}
//           onAddRule={handleAddRule}
//           initialRule={editingRule !== null ? rules[editingRule] : undefined}
//         />

//         <BusinessRuleValidationDialog
//           open={showValidationDialog}
//           onOpenChange={setShowValidationDialog}
//           rulesCount={rules.length}
//         />

//         <BusinessRuleCompleteDialog
//           open={showCompleteDialog}
//           onOpenChange={setShowCompleteDialog}
//           onContinue={() => {
//             localStorage.setItem("businessLogicStatus", "executed");
//             localStorage.setItem("etlTableName", builtDataset?.name || "");
//             setShowCompleteDialog(false);
//             setShowScheduleDialog(true);
//           }}
//           jobInfo={jobInfo}
//           isETLFlow={true}
//         />

//         {/* Full Preview Dialog */}
//         <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
//           <DialogContent className="max-w-6xl max-h-[85vh] flex flex-col">
//             <div className="flex items-center justify-between mb-4">
//               <div>
//                 <DialogTitle className="text-2xl">Full Data Preview</DialogTitle>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   {builtDataset?.name} • {builtDataset?.columns.length || 0} columns ×{" "}
//                   {fullPreviewData.length} rows
//                 </p>
//               </div>
//               <Button variant="ghost" size="icon" onClick={() => setShowFullPreview(false)}>
//                 <X className="h-5 w-5" />
//               </Button>
//             </div>
//             <div className="flex-1 overflow-auto border rounded-lg">
//               <table className="w-full">
//                 <thead className="sticky top-0 bg-muted z-10">
//                   <tr>
//                     {builtDataset?.columns.map((col) => (
//                       <th
//                         key={col.name}
//                         className="text-left px-4 py-3 text-sm font-medium border-b whitespace-nowrap"
//                       >
//                         {col.name}
//                         <div className="text-xs text-muted-foreground">({col.table})</div>
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {fullPreviewData.map((row, idx) => (
//                     <tr key={idx} className="border-b last:border-0 hover:bg-muted/30">
//                       {builtDataset?.columns.map((col) => (
//                         <td key={col.name} className="px-4 py-3 text-sm whitespace-nowrap">
//                           {String(row[col.name] ?? "—")}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </DialogContent>
//         </Dialog>

//         {/* Schedule Job Dialog */}
//         <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
//           <DialogContent className="sm:max-w-xl">
//             <DialogHeader className="mb-6">
//               <DialogTitle className="text-2xl">Schedule Job</DialogTitle>
//               <p className="text-muted-foreground mt-1">Configure when and how this job should run.</p>
//             </DialogHeader>

//             <div className="space-y-6">
//               <div className="space-y-2">
//                 <Label>Job Name</Label>
//                 <Input
//                   value={jobName}
//                   onChange={(e) => setJobName(e.target.value)}
//                   placeholder="My ETL Job"
//                 />
//               </div>

//               <div className="space-y-3">
//                 <Label>Trigger Type</Label>
//                 <RadioGroup
//                   value={triggerType}
//                   onValueChange={(v) => setTriggerType(v as "schedule" | "file")}
//                   className="grid gap-3"
//                 >
//                   <div className="flex items-center space-x-3 border p-3 rounded-lg">
//                     <RadioGroupItem value="schedule" id="schedule" />
//                     <Label htmlFor="schedule" className="cursor-pointer flex items-center gap-2">
//                       <Clock className="h-4 w-4" /> Time-based Schedule
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {triggerType === "schedule" && (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label>Frequency</Label>
//                     <Select value={frequency} onValueChange={setFrequency}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select frequency" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="daily">Daily</SelectItem>
//                         <SelectItem value="weekly">Weekly</SelectItem>
//                         <SelectItem value="monthly">Monthly</SelectItem>
//                         <SelectItem value="hourly">Hourly</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Time</Label>
//                     <Input
//                       type="time"
//                       value={time}
//                       onChange={(e) => setTime(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="flex gap-4 pt-4">
//                 <Button
//                   variant="outline"
//                   className="flex-1"
//                   onClick={() => setShowScheduleDialog(false)}
//                   disabled={loading}
//                 >
//                   Cancel
//                 </Button>
//                 <Button className="flex-1" onClick={scheduleJob} disabled={loading}>
//                   {loading ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Scheduling...
//                     </>
//                   ) : (
//                     "Schedule Job"
//                   )}
//                 </Button>
//               </div>
//             </div>
//           </DialogContent>
//         </Dialog>
//       </div>
//     </WorkflowLayout>
//   );
// }

import { useState, useEffect } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Code2,
  Edit,
  Eye,
  Loader2,
  Play,
  Plus,
  Settings2,
  Trash,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast, useToast } from "@/hooks/use-toast";
import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Column {
  name: string;
  table: string;
  type: string;
}

interface BuiltDataset {
  name: string;
  columns: Column[];
  sampleRows: Record<string, any>[];
}

export default function ETLOutput() {
  const navigate = useNavigate();
  const { dismiss } = useToast();

  const [builtDataset, setBuiltDataset] = useState<BuiltDataset | null>(null);
  const [fullPreviewData, setFullPreviewData] = useState<Record<string, any>[]>([]);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Business rules
  const [rules, setRules] = useState<any[]>([]);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [jobInfo, setJobInfo] = useState<{ correlation_id?: string; databricks_run_id?: string; message?: string } | null>(null);

  // Schedule dialog
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [triggerType, setTriggerType] = useState<"schedule" | "file">("schedule");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [jobName, setJobName] = useState("");
  const [loading, setLoading] = useState(false);

  const [workflowStep, setWorkflowStep] = useState<"preview" | "business-rules">("preview");

  const closeToastButton = (
    <button
      onClick={() => dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // Fetch dataset columns + preview rows (only used for full preview)
  useEffect(() => {
    const userId = localStorage.getItem("selected_user_id");
    const jobId = localStorage.getItem("selected_job_id");
    const datasetName = localStorage.getItem("selected_dataset_name");

    if (!userId || !jobId || !datasetName) {
      toast({
        title: "Missing Information",
        description: "User ID, Job ID or Dataset name not found",
        variant: "destructive",
        action: closeToastButton,
      });
      return;
    }

    const fetchData = async () => {
      setIsPreviewLoading(true);
      try {
        // Columns
        const columnsRes = await fetch(
          `https://api.veriton.ai/api/service2/dataset-list-columns?user_id=${userId}&job_id=${jobId}&filename=${datasetName}`,
          { headers: { accept: "application/json" } }
        );
        if (!columnsRes.ok) throw new Error("Columns fetch failed");
        const columnsData = await columnsRes.json();
        const columns = columnsData.columns?.map((c: { name: string; type: string }) => ({
          name: c.name,
          type: c.type,
          table: datasetName,
        })) ?? [];

        // Preview rows (for full preview dialog)
        const previewRes = await fetch(
          `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${jobId}&datasetname=${encodeURIComponent(datasetName)}`,
          { headers: { accept: "application/json" } }
        );
        if (!previewRes.ok) throw new Error("Preview fetch failed");
        const previewJson = await previewRes.json();
        const rows = previewJson.preview_rows ?? previewJson.rows ?? previewJson ?? [];

        const sampleRows = Array.isArray(rows) ? rows : [];

        setBuiltDataset({
          name: datasetName,
          columns,
          sampleRows,
        });
        setFullPreviewData(sampleRows);
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Load Error",
          description: err.message || "Failed to load dataset information",
          variant: "destructive",
          action: closeToastButton,
        });
      } finally {
        setIsPreviewLoading(false);
      }
    };

    fetchData();
  }, []);

  // Job name from localStorage
  useEffect(() => {
    const etlJobName = localStorage.getItem("currentJobName");
    const etlTableName = localStorage.getItem("etlTableName");
    if (etlJobName) setJobName(etlJobName);
    else if (etlTableName) setJobName(`Job_${etlTableName}`);
  }, []);

  const getUserId = () => localStorage.getItem("selected_user_id");

  const scheduleJob = async () => {
    if (triggerType === "schedule" && !frequency) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please select a frequency",
        action: closeToastButton,
      });
      return;
    }

    const userId = getUserId();
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "User ID not found",
        action: closeToastButton,
      });
      return;
    }

    setLoading(true);

    const jobId = localStorage.getItem("selected_job_id") || "";

    const payload = {
      job_id: jobId,
      job_name: jobName || `Job_${new Date().toISOString().split("T")[0]}`,
      schedule_details:
        triggerType === "schedule" ? { frequency, time: time || "00:00" } : null,
    };

    try {
      const url = `https://api.veriton.ai/api/service1/schedule-job?user_id=${userId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || `HTTP ${res.status}`);
      }

      const data = await res.json();

      if (data.message?.toLowerCase().includes("success")) {
        toast({
          title: "Success",
          description: "Job scheduled successfully",
          action: closeToastButton,
        });

        localStorage.removeItem("currentJobName");
        localStorage.removeItem("etlTableName");

        setShowScheduleDialog(false);
        navigate("/jobs");
      } else {
        throw new Error(data.message || "Scheduling failed");
      }
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to schedule job",
        action: closeToastButton,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddRule = (rule: any) => {
    if (editingRule !== null) {
      const updated = [...rules];
      updated[editingRule] = { ...rule, status: "testing" };
      setRules(updated);
      setEditingRule(null);
    } else {
      setRules([...rules, { ...rule, status: "testing" }]);
    }
    setShowAddRuleDialog(false);
    toast({
      title: editingRule !== null ? "Rule Updated" : "Rule Added",
      description: `Business rule ${editingRule !== null ? "updated" : "added"} successfully`,
      duration: 1400,
      action: closeToastButton,
    });
  };

  const handleEditRule = (index: number) => {
    setEditingRule(index);
    setShowAddRuleDialog(true);
  };

  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
    toast({
      title: "Rule Deleted",
      description: "Business rule has been removed",
      duration: 1200,
      action: closeToastButton,
    });
  };

  const handleRunAllRules = async () => {
    if (rules.length === 0 || !builtDataset?.name) {
      toast({
        title: "Cannot Run",
        description: rules.length === 0 ? "No rules defined" : "No dataset loaded",
        variant: "destructive",
        action: closeToastButton,
      });
      return;
    }

    let filename = builtDataset.name;
    if (!filename.toLowerCase().endsWith(".csv")) filename += ".csv";

    const userId = localStorage.getItem("selected_user_id");
    const jobId = localStorage.getItem("selected_job_id");
    if (!userId || !jobId) return;

    const blobPath = `${userId}/${jobId}/${filename}`;

    const rulesPayload: Record<string, string> = {};
    rules.forEach((r) => (rulesPayload[r.name] = r.logic));

    const payload = {
      blob_path: blobPath,
      rules: rulesPayload,
      mode: "auto",
      overwrite_source: false,
      output_blob_path: `processed/${builtDataset.name.replace(/\.csv$/i, "")}_filtered.csv`,
    };

    setValidating(true);
    setShowValidationDialog(true);
    setJobInfo(null);

    try {
      const res = await fetch("https://api.veriton.ai/api/service2/api/v1/business-rules/process", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const result = await res.json();

      if (result.status === "job_submitted") {
        setJobInfo({
          correlation_id: result.correlation_id,
          databricks_run_id: result.databricks_run_id,
          message: result.message,
        });
        toast({
          title: "Job Submitted",
          description: "Business rules processing started",
          action: closeToastButton,
        });
      } else {
        throw new Error(result.message || "Unexpected response");
      }
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Could not start business rules job",
        variant: "destructive",
        action: closeToastButton,
      });
    } finally {
      setValidating(false);
      setTimeout(() => {
        setShowValidationDialog(false);
        setShowCompleteDialog(true);
      }, 1400);
    }
  };

  const handleBack = () => {
    setWorkflowStep("preview");
  };

  return (
    <WorkflowLayout>
      <div className="p-6 md:p-8">
        {/* Header + top-right buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">ETL Pipeline</h1>
            <p className="text-muted-foreground mt-1">
              {workflowStep === "preview" && "Review your dataset"}
              {workflowStep === "business-rules" && "Apply business logic rules"}
            </p>
          </div>

          {workflowStep === "preview" && (
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Button
                onClick={() => setWorkflowStep("business-rules")}
                className="bg-primary hover:bg-primary/90 min-w-[180px]"
              >
                <Settings2 className="mr-2 h-4 w-4" />
                Apply Business Logic
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowScheduleDialog(true)}
                className="min-w-[150px]"
              >
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Job
              </Button>
            </div>
          )}
        </div>

        {/* Preview step – info panel + full preview button */}
        {workflowStep === "preview" && (
          <div className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-lg">
                    <span className="font-semibold">Dataset:</span>{" "}
                    <span className="text-primary font-medium">
                      {builtDataset?.name || "Not loaded"}
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {builtDataset?.columns.length || 0} columns •{" "}
                    {builtDataset?.sampleRows.length || 0} rows available
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFullPreview(true)}
                  disabled={isPreviewLoading || !builtDataset || fullPreviewData.length === 0}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Full Preview
                </Button>
              </div>
            </div>

            {isPreviewLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : !builtDataset ? (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-card/50">
                Loading dataset information...
              </div>
            ) : (
              <div className="text-center py-16 text-muted-foreground border border-dashed rounded-xl bg-card/50">
                <p className="text-lg font-medium mb-2">Dataset is ready</p>
                <p className="text-sm mb-6">
                  Use "View Full Preview" to inspect the data before applying rules or scheduling.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Business Rules view */}
        {workflowStep === "business-rules" && (
          <div className="space-y-6">
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
              <p className="text-sm">
                <span className="font-semibold">Working with:</span>{" "}
                <span className="text-primary">{builtDataset?.name || "—"}</span>
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleRunAllRules}
                disabled={rules.length === 0 || validating}
              >
                {validating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Run All Rules
                  </>
                )}
              </Button>
              <Button onClick={() => setShowAddRuleDialog(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Rule
              </Button>
            </div>

            <div className="border rounded-lg p-6 bg-card">
              {rules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
                  <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Business Rules Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click "Add New Rule" to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {rules.map((rule, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-background">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold">{rule.name}</h3>
                          <span className="px-2 py-1 text-xs rounded bg-yellow-500/10 text-yellow-600">
                            {rule.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditRule(index)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteRule(index)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                      <div className="bg-muted/50 rounded p-3 font-mono text-sm">
                        <pre className="whitespace-pre-wrap">{rule.logic}</pre>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-start">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Preview
              </Button>
            </div>
          </div>
        )}

        {/* Dialogs */}
        <AddBusinessRuleDialog
          open={showAddRuleDialog}
          onOpenChange={(open) => {
            setShowAddRuleDialog(open);
            if (!open) setEditingRule(null);
          }}
          onAddRule={handleAddRule}
          initialRule={editingRule !== null ? rules[editingRule] : undefined}
        />

        <BusinessRuleValidationDialog
          open={showValidationDialog}
          onOpenChange={setShowValidationDialog}
          rulesCount={rules.length}
        />

        <BusinessRuleCompleteDialog
          open={showCompleteDialog}
          onOpenChange={setShowCompleteDialog}
          onContinue={() => {
            localStorage.setItem("businessLogicStatus", "executed");
            localStorage.setItem("etlTableName", builtDataset?.name || "");
            setShowCompleteDialog(false);
            setShowScheduleDialog(true);
          }}
          jobInfo={jobInfo}
          isETLFlow={true}
        /> 
        
        <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
          <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="mb-4 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
                <p className="text-muted-foreground mt-1">
                  Table: <span className="text-primary">{builtDataset?.name}</span> •{" "}
                  {builtDataset?.columns.length} columns × {fullPreviewData.length} rows
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowFullPreview(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto border border-border rounded-lg">
              <table className="w-full">
                <thead className="sticky top-0 bg-primary/100 text-white">
                  <tr>
                    {builtDataset?.columns.map((col) => (
                      <th
                        key={`preview-${col.name}`}
                        className="text-left p-4 text-sm font-medium whitespace-nowrap border-b border-border"
                      >
                        <div>{col.name}</div>
                        <div className="text-xs opacity-80">({col.table})</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fullPreviewData.map((row, idx) => (
                    <tr
                      key={`preview-row-${idx}`}
                      className="border-b border-border last:border-0 hover:bg-muted/50"
                    >
                      {builtDataset?.columns.map((col) => (
                        <td
                          key={`preview-${col.name}-${idx}`}
                          className="p-4 text-sm text-foreground whitespace-nowrap"
                        >
                          {String(row[col.name] ?? "-")}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {fullPreviewData.length === 0 && (
                    <tr>
                      <td colSpan={builtDataset?.columns.length ?? 1} className="p-8 text-center text-muted-foreground">
                        No data available for preview
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schedule Job Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">Schedule Job</DialogTitle>
              <p className="text-muted-foreground mt-1">Configure when and how this job should run.</p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Job Name</Label>
                <Input
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="My ETL Job"
                />
              </div>

              <div className="space-y-3">
                <Label>Trigger Type</Label>
                <RadioGroup
                  value={triggerType}
                  onValueChange={(v) => setTriggerType(v as "schedule" | "file")}
                  className="grid gap-3"
                >
                  <div className="flex items-center space-x-3 border p-3 rounded-lg">
                    <RadioGroupItem value="schedule" id="schedule" />
                    <Label htmlFor="schedule" className="cursor-pointer flex items-center gap-2">
                      <Clock className="h-4 w-4" /> Time-based Schedule
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {triggerType === "schedule" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        {/* <SelectItem value="hourly">Hourly</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time</Label>
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowScheduleDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button className="flex-1" onClick={scheduleJob} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Job"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </WorkflowLayout>
  );
}