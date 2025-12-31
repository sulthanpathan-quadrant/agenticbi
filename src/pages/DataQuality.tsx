// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Database, Edit, Trash2, Loader2 } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ValidationProgressDialog } from "@/components/ValidationProgressDialog";
// import { ValidationCompleteDialog } from "@/components/ValidationCompleteDialog";
// import { AnalysisCompleteDialog } from "@/components/AnalysisCompleteDialog";
// import { QuickFixDialog } from "@/components/QuickFixDialog";
// import { toast } from "sonner";
 
// interface DQRule {
//   name: string;
//   type: string;
//   condition: string;
// }
 
// interface ValidationResult {
//   rules_passed: number;
//   rules_failed: number;
//   issues: Record<string, any>;
//   proposed_solutions: Record<string, string>;
// }
 
// interface FixResult {
//   success: boolean;
//   message: string;
// }
 
// interface DatasetFile {
//   filename: string;
//   last_modified: string;
// }
 
// export default function DataQuality() {
//   const navigate = useNavigate();
 
//   const [files, setFiles] = useState<DatasetFile[]>([]);
//   const [selectedFile, setSelectedFile] = useState<string | null>(null);
//   const [rulesGenerated, setRulesGenerated] = useState(false);
//   const [dataQualityRules, setDataQualityRules] = useState<DQRule[]>([]);
//   const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
//   const [fixResult, setFixResult] = useState<FixResult | null>(null);
 
//   // Workflow states
//   const [validationProgress, setValidationProgress] = useState(0);
//   const [showValidationProgress, setShowValidationProgress] = useState(false);
//   const [showValidationComplete, setShowValidationComplete] = useState(false);
//   const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
//   const [showQuickFix, setShowQuickFix] = useState(false);
//   const [quickFixProgress, setQuickFixProgress] = useState(0);
//   const [quickFixComplete, setQuickFixComplete] = useState(false);
 
//   const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
//   const [editedRule, setEditedRule] = useState<DQRule | null>(null);
//   const [generating, setGenerating] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [fixing, setFixing] = useState(false);
//   const [loadingFiles, setLoadingFiles] = useState(true);
 
//   const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : null;
//   const jobId = localStorage.getItem("current_job_id");
 
//   // Fetch ingested datasets from API
//   useEffect(() => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information");
//       setLoadingFiles(false);
//       return;
//     }
 
//     const fetchDatasets = async () => {
//       setLoadingFiles(true);
//       try {
//         const response = await fetch(
//           `http://20.81.213.147:8000/list-datasets?user_id=${userId}&job_id=${jobId}`,
//           {
//             headers: { accept: "application/json" },
//           }
//         );
 
//         if (!response.ok) throw new Error("Failed to fetch datasets");
 
//         const result = await response.json();
 
//         if (result.datasets && Array.isArray(result.datasets)) {
//           setFiles(result.datasets);
//           if (result.datasets.length > 0) {
//             setSelectedFile(result.datasets[0].filename); // Auto-select first file
//           }
//         } else {
//           setFiles([]);
//           toast.info("No datasets found for this job");
//         }
//       } catch (error) {
//         console.error("Error fetching datasets:", error);
//         toast.error("Failed to load ingested files");
//         setFiles([]);
//       } finally {
//         setLoadingFiles(false);
//       }
//     };
 
//     fetchDatasets();
//   }, [userId, jobId]);
 
//   const handleGenerateRules = async () => {
//     if (!selectedFile) {
//       toast.error("Please select a file first");
//       return;
//     }
 
//     setGenerating(true);
 
//     const payload = {
//       input_type: "azure",
//       azure_blob_path: selectedFile.endsWith(".csv") ? selectedFile : `${selectedFile}.csv`,
//     };
 
//     try {
//       const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run-dq-rules-generation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
 
//       const result = await response.json();
 
//       if (response.ok && result.success && result.lambda_response?.body?.file) {
//         const rules = result.lambda_response.body.file.map((r: any) => ({
//           name: r.rule,
//           type: r.severity,
//           condition: r.description,
//         }));
//         setDataQualityRules(rules);
//         setRulesGenerated(true);
//         toast.success(`Successfully generated ${rules.length} DQ rules`);
//       } else {
//         throw new Error(result.message || "Failed to generate rules");
//       }
//     } catch (error: any) {
//       toast.error("Failed to generate DQ rules");
//       console.error(error);
//     } finally {
//       setGenerating(false);
//     }
//   };
 
//   // Run DQ Validation
//   const handleRunValidation = async () => {
//     if (dataQualityRules.length === 0) return;
 
//     setValidating(true);
//     setValidationProgress(0);
//     setShowValidationProgress(true);
//     setValidationResult(null);
 
//     const payload = {
//       input_type: "azure",
//       azure_blob_path: selectedFile?.endsWith(".csv") ? selectedFile : `${selectedFile}.csv`,
//       rules: dataQualityRules.map(r => ({
//         rule: r.name,
//         description: r.condition,
//         severity: r.type,
//       })),
//     };
 
//     try {
//       const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_validation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
 
//       const result = await response.json();
 
//       if (response.ok) {
//         setValidationResult(result);
//         toast.success("Validation completed");
//       } else {
//         throw new Error("Validation failed");
//       }
//     } catch (error: any) {
//       toast.error("Validation failed");
//     } finally {
//       setValidating(false);
//       setTimeout(() => {
//         setShowValidationProgress(false);
//         setShowValidationComplete(true);
//       }, 1000);
//     }
//   };
 
//   // Quick Fix (unchanged except blob path)
//   const handleQuickFix = async () => {
//     if (!validationResult || validationResult.rules_failed === 0) {
//       toast.info("No issues to fix");
//       return;
//     }
 
//     setFixing(true);
//     setQuickFixProgress(0);
//     setShowQuickFix(true);
//     setFixResult(null);
 
//     const failedRules = Object.entries(validationResult.issues || {}).map(([column, data]: [string, any]) => ({
//       column,
//       rule: data.rule,
//       reason_for_failure: data.reason_for_failure,
//     }));
 
//     const payload = {
//       input_type: "azure",
//       azure_blob_path: selectedFile?.endsWith(".csv") ? selectedFile : `${selectedFile}.csv`,
//       rules: failedRules,
//       proposed_solutions: validationResult.proposed_solutions || {},
//     };
 
//     try {
//       const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_fixing", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
 
//       const result = await response.json();
 
//       if (response.ok && result.success) {
//         setFixResult(result);
//         toast.success(result.message || "Data fixed successfully");
//       } else {
//         throw new Error(result.message || "Fix failed");
//       }
//     } catch (error: any) {
//       toast.error("Quick fix failed");
//     } finally {
//       setFixing(false);
//       setTimeout(() => setQuickFixComplete(true), 1000);
//     }
//   };
 
//   const toggleFileSelection = (filename: string) => {
//     setSelectedFile(filename);
//   };
 
//   const handleEditRule = (index: number) => {
//     const rule = dataQualityRules[index];
//     setEditingRuleIndex(index);
//     setEditedRule({ ...rule });
//   };
 
//   const handleSaveRule = (index: number) => {
//     if (editedRule) {
//       const updatedRules = [...dataQualityRules];
//       updatedRules[index] = editedRule;
//       setDataQualityRules(updatedRules);
//       setEditingRuleIndex(null);
//       setEditedRule(null);
//       toast.success("Rule updated");
//     }
//   };
 
//   const handleCancelEdit = () => {
//     setEditingRuleIndex(null);
//     setEditedRule(null);
//   };
 
//   const handleDeleteRule = (index: number) => {
//     setDataQualityRules(prev => prev.filter((_, i) => i !== index));
//     toast.success("Rule deleted");
//   };
 
//   const handleAnalyzeFailures = () => {
//     setShowValidationComplete(false);
//     setShowAnalysisComplete(true);
//   };
 
//   const handleQuickFixContinue = () => {
//     setShowQuickFix(false);
//     navigate("/workflow/ner");
//   };
 
//   const handleProceedToNER = () => {
//     setShowValidationComplete(false);
//     navigate("/workflow/ner");
//   };
 
//   return (
//     <WorkflowLayout>
//       <div className="p-8">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-foreground mb-2">Data Quality Rules</h1>
//         </div>
 
//         {/* Select a File Section - Only show when rules not generated */}
//         {!rulesGenerated && (
//           <div className="border border-border rounded-lg p-6 bg-card mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-foreground">Select a file</h2>
//               <Button onClick={handleGenerateRules} disabled={!selectedFile || generating}>
//                 {generating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   "Generate DQ Rules"
//                 )}
//               </Button>
//             </div>
 
//             {loadingFiles ? (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//               </div>
//             ) : files.length === 0 ? (
//               <div className="text-center py-8 text-muted-foreground">
//                 No datasets found. Please ingest files first.
//               </div>
//             ) : (
//               <div className="border border-border rounded-lg overflow-hidden">
//                 <table className="w-full">
//                   <thead className="bg-muted/50 border-b border-border">
//                     <tr>
//                       <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
//                       <th className="text-left p-4 text-sm font-medium text-muted-foreground">File Name</th>
//                       <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Modified</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {files.map((file) => (
//                       <tr
//                         key={file.filename}
//                         onClick={() => toggleFileSelection(file.filename)}
//                         className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${
//                           selectedFile === file.filename ? "bg-primary/10" : ""
//                         }`}
//                       >
//                         <td className="p-4">
//                           <Checkbox
//                             checked={selectedFile === file.filename}
//                             onCheckedChange={() => toggleFileSelection(file.filename)}
//                           />
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Database className="h-5 w-5 text-primary" />
//                             <span className="font-medium text-foreground">{file.filename}</span>
//                           </div>
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">
//                           {new Date(file.last_modified).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         )}
 
//         {/* Smart Rule Proposal Section */}
//         {rulesGenerated && (
//           <div className="border border-border rounded-lg p-6 bg-card mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-foreground">Smart Rule Proposal</h2>
//               <Button onClick={handleRunValidation} disabled={validating}>
//                 {validating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                     Running...
//                   </>
//                 ) : (
//                   "Run DQ Validation"
//                 )}
//               </Button>
//             </div>
 
//             <div className="border border-border rounded-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-muted/50 border-b border-border">
//                   <tr>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">RULE NAME</th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">TYPE</th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">CONDITION</th>
//                     <th className="text-right p-4 text-sm font-medium text-muted-foreground">ACTIONS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataQualityRules.map((rule, index) => {
//                     const isEditing = editingRuleIndex === index;
//                     const displayRule = isEditing && editedRule ? editedRule : rule;
 
//                     return (
//                       <tr key={index} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
//                         <td className="p-4 text-sm font-medium text-foreground">
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={displayRule.name}
//                               onChange={(e) => setEditedRule({ ...displayRule, name: e.target.value })}
//                               className="w-full bg-background border border-border rounded px-2 py-1"
//                             />
//                           ) : (
//                             displayRule.name
//                           )}
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={displayRule.type}
//                               onChange={(e) => setEditedRule({ ...displayRule, type: e.target.value })}
//                               className="w-full bg-background border border-border rounded px-2 py-1"
//                             />
//                           ) : (
//                             displayRule.type
//                           )}
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={displayRule.condition}
//                               onChange={(e) => setEditedRule({ ...displayRule, condition: e.target.value })}
//                               className="w-full bg-background border border-border rounded px-2 py-1"
//                             />
//                           ) : (
//                             displayRule.condition
//                           )}
//                         </td>
//                         <td className="p-4 text-right">
//                           <div className="flex justify-end gap-2">
//                             {isEditing ? (
//                               <>
//                                 <Button variant="outline" size="sm" className="h-8" onClick={() => handleSaveRule(index)}>
//                                   Save
//                                 </Button>
//                                 <Button variant="ghost" size="sm" className="h-8" onClick={handleCancelEdit}>
//                                   Cancel
//                                 </Button>
//                               </>
//                             ) : (
//                               <>
//                                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditRule(index)}>
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteRule(index)}>
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
 
//         {/* Bottom Action Buttons */}
//         {rulesGenerated && (
//           <div className="flex justify-between gap-3">
//             <div className="flex gap-3">
//               <Button variant="outline" onClick={() => navigate("/workflow/data-modeling")}>
//                 Back
//               </Button>
//               <Button variant="outline" onClick={() => navigate("/workflow/ner")}>
//                 Skip
//               </Button>
//             </div>
//             <div className="flex gap-3">
//               <Button variant="outline">Save Rules</Button>
//               <Button onClick={() => navigate("/workflow/ner")}>Apply & Continue</Button>
//             </div>
//           </div>
//         )}
//       </div>
 
//       {/* Dialogs */}
//       <ValidationProgressDialog
//         open={showValidationProgress}
//         onOpenChange={setShowValidationProgress}
//         progress={validationProgress}
//         rulesCount={dataQualityRules.length}
//       />
 
//       <ValidationCompleteDialog
//         open={showValidationComplete}
//         onOpenChange={setShowValidationComplete}
//         onAnalyzeFailures={handleAnalyzeFailures}
//         onProceedToNER={handleProceedToNER}
//         passed={validationResult?.rules_passed ?? 0}
//         failed={validationResult?.rules_failed ?? 0}
//       />
 
//       <AnalysisCompleteDialog
//         open={showAnalysisComplete}
//         onOpenChange={setShowAnalysisComplete}
//         onQuickFix={handleQuickFix}
//         validationResult={validationResult}
//       />
 
//       <QuickFixDialog
//         open={showQuickFix}
//         onOpenChange={setShowQuickFix}
//         progress={quickFixProgress}
//         isComplete={quickFixComplete}
//         onContinue={handleQuickFixContinue}
//         fixMessage={fixResult?.message}
//       />
//     </WorkflowLayout>
//   );
// }
 


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Database, Edit, Trash2, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ValidationProgressDialog } from "@/components/ValidationProgressDialog";
import { ValidationCompleteDialog } from "@/components/ValidationCompleteDialog";
import { AnalysisCompleteDialog } from "@/components/AnalysisCompleteDialog";
import { QuickFixDialog } from "@/components/QuickFixDialog";
import { toast } from "sonner";
 
interface DQRule {
  name: string;
  type: string;
  condition: string;
}
 
interface ValidationResult {
  rules_passed: number;
  rules_failed: number;
  issues: Record<string, any>;
  proposed_solutions: Record<string, string>;
}
 
interface FixResult {
  success: boolean;
  message: string;
}
 
interface DatasetFile {
  filename: string;
  last_modified: string;
}
 
export default function DataQuality() {
  const navigate = useNavigate();
 
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set()); // ← Changed to Set for multiple selection
  const [rulesGenerated, setRulesGenerated] = useState(false);
  const [dataQualityRules, setDataQualityRules] = useState<DQRule[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
 
  const [validationProgress, setValidationProgress] = useState(0);
  const [showValidationProgress, setShowValidationProgress] = useState(false);
  const [showValidationComplete, setShowValidationComplete] = useState(false);
  const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
  const [showQuickFix, setShowQuickFix] = useState(false);
  const [quickFixProgress, setQuickFixProgress] = useState(0);
  const [quickFixComplete, setQuickFixComplete] = useState(false);
 
  const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
  const [editedRule, setEditedRule] = useState<DQRule | null>(null);
  const [generating, setGenerating] = useState(false);
  const [validating, setValidating] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [loadingFiles, setLoadingFiles] = useState(true);
 
  const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : null;
  const jobId = localStorage.getItem("current_job_id");
 
  // Fetch ingested datasets
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information");
      setLoadingFiles(false);
      return;
    }
 
    const fetchDatasets = async () => {
      setLoadingFiles(true);
      try {
        const response = await fetch(
          `http://20.81.213.147:8000/list-datasets?user_id=${userId}&job_id=${jobId}`,
          { headers: { accept: "application/json" } }
        );
 
        if (!response.ok) throw new Error("Failed to fetch datasets");
 
        const result = await response.json();
 
        if (result.datasets && Array.isArray(result.datasets)) {
          setFiles(result.datasets);
          // Removed auto-selection of first file
        } else {
          setFiles([]);
          toast.info("No datasets found for this job");
        }
      } catch (error) {
        console.error("Error fetching datasets:", error);
        toast.error("Failed to load ingested files");
        setFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };
 
    fetchDatasets();
  }, [userId, jobId]);
 
  // Helper to get selected files paths
  const getSelectedBlobPaths = () => {
    return Array.from(selectedFiles).map((filename) => {
      const name = filename.endsWith(".csv") ? filename : `${filename}.csv`;
      return `${userId}/${jobId}/${name}`;
    });
  };
 
  const handleGenerateRules = async () => {
    if (selectedFiles.size === 0) {
      toast.error("Please select at least one file");
      return;
    }
 
    setGenerating(true);
 
    const blobPaths = getSelectedBlobPaths();
    console.log("Generating rules for files:", blobPaths);
 
    // Currently using the first selected file - you can modify this later to support multiple
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPaths[0], // ← using first selected file (can be extended later)
    };
 
    try {
      const response = await fetch(
        "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run-dq-rules-generation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
 
      const result = await response.json();
 
      if (response.ok && result.success && result.lambda_response?.body?.file) {
        const rules = result.lambda_response.body.file.map((r: any) => ({
          name: r.rule,
          type: r.severity,
          condition: r.description,
        }));
        setDataQualityRules(rules);
        setRulesGenerated(true);
        toast.success(`Successfully generated ${rules.length} DQ rules`);
      } else {
        throw new Error(result.message || "Failed to generate rules");
      }
    } catch (error: any) {
      toast.error("Failed to generate DQ rules");
      console.error(error);
    } finally {
      setGenerating(false);
    }
  };
 
  // Run DQ Validation
  const handleRunValidation = async () => {
    if (dataQualityRules.length === 0) return;
 
    setValidating(true);
    setValidationProgress(0);
    setShowValidationProgress(true);
    setValidationResult(null);
 
    const blobPaths = getSelectedBlobPaths();
    console.log("Validating files:", blobPaths);
 
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPaths[0], // ← same as above - using first file for now
      rules: dataQualityRules.map((r) => ({
        rule: r.name,
        description: r.condition,
        severity: r.type,
      })),
    };
 
    try {
      const response = await fetch(
        "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_validation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
 
      const result = await response.json();
 
      if (response.ok) {
        setValidationResult(result);
        toast.success("Validation completed");
      } else {
        throw new Error("Validation failed");
      }
    } catch (error: any) {
      toast.error("Validation failed");
    } finally {
      setValidating(false);
      setTimeout(() => {
        setShowValidationProgress(false);
        setShowValidationComplete(true);
      }, 1000);
    }
  };
 
  // Quick Fix (kept as is - uses same blob path logic)
  const handleQuickFix = async () => {
    if (!validationResult || validationResult.rules_failed === 0) {
      toast.info("No issues to fix");
      return;
    }
 
    setFixing(true);
    setQuickFixProgress(0);
    setShowQuickFix(true);
    setFixResult(null);
 
    const failedRules = Object.entries(validationResult.issues || {}).map(([column, data]: [string, any]) => ({
      column,
      rule: data.rule,
      reason_for_failure: data.reason_for_failure,
    }));
 
    const blobPaths = getSelectedBlobPaths();
 
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPaths[0], // ← using first selected file
      rules: failedRules,
      proposed_solutions: validationResult.proposed_solutions || {},
    };
 
    try {
      const response = await fetch(
        "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_fixing",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
 
      const result = await response.json();
 
      if (response.ok && result.success) {
        setFixResult(result);
        toast.success(result.message || "Data fixed successfully");
      }
    } catch (error: any) {
      // silent fail or toast if you prefer
    } finally {
      setFixing(false);
      setTimeout(() => setQuickFixComplete(true), 1000);
    }
  };
 
  const toggleFileSelection = (filename: string) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(filename)) {
        newSet.delete(filename);
      } else {
        newSet.add(filename);
      }
      return newSet;
    });
  };
 
  const handleEditRule = (index: number) => {
    const rule = dataQualityRules[index];
    setEditingRuleIndex(index);
    setEditedRule({ ...rule });
  };
 
  const handleSaveRule = (index: number) => {
    if (editedRule) {
      const updatedRules = [...dataQualityRules];
      updatedRules[index] = editedRule;
      setDataQualityRules(updatedRules);
      setEditingRuleIndex(null);
      setEditedRule(null);
      toast.success("Rule updated");
    }
  };
 
  const handleCancelEdit = () => {
    setEditingRuleIndex(null);
    setEditedRule(null);
  };
 
  const handleDeleteRule = (index: number) => {
    setDataQualityRules((prev) => prev.filter((_, i) => i !== index));
    toast.success("Rule deleted");
  };
 
  const handleAnalyzeFailures = () => {
    setShowValidationComplete(false);
    setShowAnalysisComplete(true);
  };
 
  const handleQuickFixContinue = () => {
    setShowQuickFix(false);
    navigate("/workflow/ner");
  };
 
  const handleProceedToNER = () => {
    setShowValidationComplete(false);
    navigate("/workflow/ner");
  };
 
  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Quality Rules</h1>
        </div>
 
        {/* Select Files Section - MULTIPLE SELECTION */}
        {!rulesGenerated && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Select files</h2>
              <Button
                onClick={handleGenerateRules}
                disabled={selectedFiles.size === 0 || generating}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate DQ Rules"
                )}
              </Button>
            </div>
 
            {loadingFiles ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : files.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No datasets found. Please ingest files first.
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">File Name</th>
                      <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Modified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr
                        key={file.filename}
                        onClick={() => toggleFileSelection(file.filename)}
                        className={`border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer ${
                          selectedFiles.has(file.filename) ? "bg-primary/10" : ""
                        }`}
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedFiles.has(file.filename)}
                            onCheckedChange={() => toggleFileSelection(file.filename)}
                            onClick={(e) => e.stopPropagation()} // prevent row click when clicking checkbox
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Database className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{file.filename}</span>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {new Date(file.last_modified).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
 
            {selectedFiles.size > 0 && (
              <div className="mt-3 text-sm text-muted-foreground">
                {selectedFiles.size} file{selectedFiles.size !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
        )}
 
        {/* Smart Rule Proposal Section */}
        {rulesGenerated && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Smart Rule Proposal
              </h2>
              <Button onClick={handleRunValidation} disabled={validating}>
                {validating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  "Run DQ Validation"
                )}
              </Button>
            </div>
 
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      RULE NAME
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      TYPE
                    </th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                      CONDITION
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataQualityRules.map((rule, index) => {
                    const isEditing = editingRuleIndex === index;
                    const displayRule = isEditing && editedRule ? editedRule : rule;
 
                    return (
                      <tr
                        key={index}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4 text-sm font-medium text-foreground">
                          {isEditing ? (
                            <input
                              type="text"
                              value={displayRule.name}
                              onChange={(e) => setEditedRule({ ...displayRule, name: e.target.value })}
                              className="w-full bg-background border border-border rounded px-2 py-1"
                            />
                          ) : (
                            displayRule.name
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {isEditing ? (
                            <input
                              type="text"
                              value={displayRule.type}
                              onChange={(e) => setEditedRule({ ...displayRule, type: e.target.value })}
                              className="w-full bg-background border border-border rounded px-2 py-1"
                            />
                          ) : (
                            displayRule.type
                          )}
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {isEditing ? (
                            <input
                              type="text"
                              value={displayRule.condition}
                              onChange={(e) => setEditedRule({ ...displayRule, condition: e.target.value })}
                              className="w-full bg-background border border-border rounded px-2 py-1"
                            />
                          ) : (
                            displayRule.condition
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8"
                                  onClick={() => handleSaveRule(index)}
                                >
                                  Save
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditRule(index)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDeleteRule(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
 
        {/* Bottom Action Buttons */}
        {rulesGenerated && (
          <div className="flex justify-between gap-3">
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/workflow/data-modeling")}>
                Back
              </Button>
              <Button variant="outline" onClick={() => navigate("/workflow/ner")}>
                Skip
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Save Rules</Button>
              <Button onClick={() => navigate("/workflow/ner")}>Apply & Continue</Button>
            </div>
          </div>
        )}
      </div>
 
      {/* Dialogs */}
      <ValidationProgressDialog
        open={showValidationProgress}
        onOpenChange={setShowValidationProgress}
        progress={validationProgress}
        rulesCount={dataQualityRules.length}
      />
 
      <ValidationCompleteDialog
        open={showValidationComplete}
        onOpenChange={setShowValidationComplete}
        onAnalyzeFailures={handleAnalyzeFailures}
        onProceedToNER={handleProceedToNER}
        passed={validationResult?.rules_passed ?? 0}
        failed={validationResult?.rules_failed ?? 0}
      />
 
      <AnalysisCompleteDialog
        open={showAnalysisComplete}
        onOpenChange={setShowAnalysisComplete}
        onQuickFix={handleQuickFix}
        validationResult={validationResult}
      />
 
      <QuickFixDialog
        open={showQuickFix}
        onOpenChange={setShowQuickFix}
        progress={quickFixProgress}
        isComplete={quickFixComplete}
        onContinue={handleQuickFixContinue}
        fixMessage={fixResult?.message}
      />
    </WorkflowLayout>
  );
}
 