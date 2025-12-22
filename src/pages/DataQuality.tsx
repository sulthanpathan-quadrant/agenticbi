// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Database, Edit, FileArchive, Trash2 } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ValidationProgressDialog } from "@/components/ValidationProgressDialog";
// import { ValidationCompleteDialog } from "@/components/ValidationCompleteDialog";
// import { AnalysisCompleteDialog } from "@/components/AnalysisCompleteDialog";
// import { QuickFixDialog } from "@/components/QuickFixDialog";
// import { toast } from "@/hooks/use-toast";

// export default function DataQuality() {
//   const navigate = useNavigate();
//   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
//   const [rulesGenerated, setRulesGenerated] = useState(false);
//   const [dataQualityRules, setDataQualityRules] = useState<Array<{name: string; type: string; condition: string}>>([]);
  
//   // Validation workflow state
//   const [validationProgress, setValidationProgress] = useState(0);
//   const [showValidationProgress, setShowValidationProgress] = useState(false);
//   const [showValidationComplete, setShowValidationComplete] = useState(false);
//   const [showAnalysisComplete, setShowAnalysisComplete] = useState(false);
//   const [showQuickFix, setShowQuickFix] = useState(false);
//   const [quickFixProgress, setQuickFixProgress] = useState(0);
//   const [quickFixComplete, setQuickFixComplete] = useState(false);
//   const [editingRuleIndex, setEditingRuleIndex] = useState<number | null>(null);
//   const [editedRule, setEditedRule] = useState<{name: string; type: string; condition: string} | null>(null);

//   // Load custom created tables from Data Creation
//   const [files, setFiles] = useState<Array<{name: string; source: string; icon: any}>>([]);

//   useEffect(() => {
//     const customTables = localStorage.getItem("customCreatedTables");
//     if (customTables) {
//       const tables = JSON.parse(customTables);
//       const customFiles = tables.map((table: any) => ({
//         name: `${table.name}.csv`,
//         source: "Data Creation",
//         icon: Database,
//       }));
//       setFiles(customFiles);
//     }
//   }, []);

//   const toggleFileSelection = (fileName: string) => {
//     setSelectedFiles((prev) =>
//       prev.includes(fileName)
//         ? prev.filter((f) => f !== fileName)
//         : [...prev, fileName]
//     );
//   };


//   const handleGenerateRules = () => {
//     if (selectedFiles.length === 0) {
//       toast({
//         title: "No file selected",
//         description: "Please select at least one file to generate rules",
//         variant: "destructive",
//         duration: 1000,
//       });
//       return;
//     }
    
//     const generatedRules = [
//       {
//         name: "id - not null",
//         type: "Completeness",
//         condition: "Column 'id' IS NOT NULL",
//       },
//       {
//         name: "email - not null",
//         type: "Completeness",
//         condition: "Column 'email' IS NOT NULL",
//       },
//       {
//         name: "email - valid email",
//         type: "Validity",
//         condition: "Column 'email' matches regex '^[\\w-\\.]+@...",
//       },
//       {
//         name: "customer_id - unique",
//         type: "Uniqueness",
//         condition: "Column 'customer_id' is unique",
//       },
//       {
//         name: "age - not null",
//         type: "Completeness",
//         condition: "Column 'age' IS NOT NULL",
//       },
//       {
//         name: "age - range check",
//         type: "Accuracy",
//         condition: "Column 'age' between 18 and 99",
//       },
//     ];
//     setDataQualityRules(generatedRules);
//     setRulesGenerated(true);
//     toast({
//       title: "DQ Rules Generated",
//       description: `Successfully generated ${generatedRules.length} data quality rules`,
//       duration: 1000,
//     });
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
//       toast({
//         title: "Rule Updated",
//         description: "Data quality rule has been saved",
//         duration: 1000,
//       });
//     }
//   };

//   const handleCancelEdit = () => {
//     setEditingRuleIndex(null);
//     setEditedRule(null);
//   };

//   const handleDeleteRule = (index: number) => {
//     const updatedRules = dataQualityRules.filter((_, i) => i !== index);
//     setDataQualityRules(updatedRules);
//     toast({
//       title: "Rule Deleted",
//       description: "Data quality rule has been removed",
//       duration: 1000,
//     });
//   };

//   const handleRunValidation = () => {
//     setValidationProgress(0);
//     setShowValidationProgress(true);
//   };

//   useEffect(() => {
//     if (showValidationProgress && validationProgress < 100) {
//       const timer = setTimeout(() => {
//         setValidationProgress((prev) => Math.min(prev + 10, 100));
//       }, 300);
//       return () => clearTimeout(timer);
//     } else if (showValidationProgress && validationProgress === 100) {
//       setTimeout(() => {
//         setShowValidationProgress(false);
//         setShowValidationComplete(true);
//       }, 500);
//     }
//   }, [showValidationProgress, validationProgress]);

//   useEffect(() => {
//     if (showQuickFix && !quickFixComplete && quickFixProgress < 100) {
//       const timer = setTimeout(() => {
//         setQuickFixProgress((prev) => Math.min(prev + 12, 100));
//       }, 300);
//       return () => clearTimeout(timer);
//     } else if (showQuickFix && quickFixProgress === 100 && !quickFixComplete) {
//       setTimeout(() => {
//         setQuickFixComplete(true);
//       }, 500);
//     }
//   }, [showQuickFix, quickFixProgress, quickFixComplete]);

//   const handleAnalyzeFailures = () => {
//     setShowValidationComplete(false);
//     setShowAnalysisComplete(true);
//   };

//   const handleQuickFix = () => {
//     setShowAnalysisComplete(false);
//     setQuickFixProgress(0);
//     setQuickFixComplete(false);
//     setShowQuickFix(true);
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
//               <Button onClick={handleGenerateRules}>Generate DQ Rules</Button>
//             </div>

//             <div className="border border-border rounded-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-muted/50 border-b border-border">
//                   <tr>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">File Name</th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {files.map((file) => {
//                     const Icon = file.icon;
//                     const isSelected = selectedFiles.includes(file.name);
//                     return (
//                       <tr
//                         key={file.name}
//                         onClick={() => toggleFileSelection(file.name)}
//                         className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
//                       >
//                         <td className="p-4">
//                           <Checkbox
//                             checked={isSelected}
//                             onCheckedChange={() => toggleFileSelection(file.name)}
//                           />
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center gap-3">
//                             <Icon className="h-5 w-5 text-primary" />
//                             <span className="font-medium text-foreground">{file.name}</span>
//                           </div>
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">{file.source}</td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Smart Rule Proposal Section - Only show when rules are generated */}
//         {rulesGenerated && (
//           <div className="border border-border rounded-lg p-6 bg-card mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-lg font-semibold text-foreground">
//                 Smart Rule Proposal
//               </h2>
//               <Button onClick={handleRunValidation}>
//                 Run DQ Validation
//               </Button>
//             </div>

//             {/* Rules Table */}
//             <div className="border border-border rounded-lg overflow-hidden">
//               <table className="w-full">
//                 <thead className="bg-muted/50 border-b border-border">
//                   <tr>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                       RULE NAME
//                     </th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                       TYPE
//                     </th>
//                     <th className="text-left p-4 text-sm font-medium text-muted-foreground">
//                       CONDITION
//                     </th>
//                     <th className="text-right p-4 text-sm font-medium text-muted-foreground">
//                       ACTIONS
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {dataQualityRules.map((rule, index) => {
//                     const isEditing = editingRuleIndex === index;
//                     const displayRule = isEditing && editedRule ? editedRule : rule;
                    
//                     return (
//                       <tr
//                         key={index}
//                         className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
//                       >
//                         <td className="p-4 text-sm font-medium text-foreground">
//                           {isEditing ? (
//                             <input
//                               type="text"
//                               value={displayRule.name}
//                               onChange={(e) => setEditedRule({ ...displayRule, name: e.target.value })}
//                               className="w-full bg-background border border-border rounded px-2 py-1"
//                             />
//                           ) : (
//                             rule.name
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
//                             rule.type
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
//                             rule.condition
//                           )}
//                         </td>
//                         <td className="p-4 text-right">
//                           <div className="flex justify-end gap-2">
//                             {isEditing ? (
//                               <>
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm"
//                                   className="h-8"
//                                   onClick={() => handleSaveRule(index)}
//                                 >
//                                   Save
//                                 </Button>
//                                 <Button 
//                                   variant="ghost" 
//                                   size="sm"
//                                   className="h-8"
//                                   onClick={handleCancelEdit}
//                                 >
//                                   Cancel
//                                 </Button>
//                               </>
//                             ) : (
//                               <>
//                                 <Button 
//                                   variant="ghost" 
//                                   size="icon" 
//                                   className="h-8 w-8"
//                                   onClick={() => handleEditRule(index)}
//                                 >
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button 
//                                   variant="ghost" 
//                                   size="icon" 
//                                   className="h-8 w-8"
//                                   onClick={() => handleDeleteRule(index)}
//                                 >
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

//       {/* Validation Dialogs */}
//       <ValidationProgressDialog
//         open={showValidationProgress}
//         onOpenChange={setShowValidationProgress}
//         progress={validationProgress}
//       />

//       <ValidationCompleteDialog
//         open={showValidationComplete}
//         onOpenChange={setShowValidationComplete}
//         onAnalyzeFailures={handleAnalyzeFailures}
//         onProceedToNER={handleProceedToNER}
//       />

//       <AnalysisCompleteDialog
//         open={showAnalysisComplete}
//         onOpenChange={setShowAnalysisComplete}
//         onQuickFix={handleQuickFix}
//       />

//       <QuickFixDialog
//         open={showQuickFix}
//         onOpenChange={setShowQuickFix}
//         progress={quickFixProgress}
//         isComplete={quickFixComplete}
//         onContinue={handleQuickFixContinue}
//       />
//     </WorkflowLayout>
//   );
// }

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit, Trash2, Loader2 } from "lucide-react";
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
 
export default function DataQuality() {
  const navigate = useNavigate();
 
  const [blobPath, setBlobPath] = useState("powerbikpi/Forcast Template.csv");
  const [rulesGenerated, setRulesGenerated] = useState(false);
  const [dataQualityRules, setDataQualityRules] = useState<DQRule[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [fixResult, setFixResult] = useState<FixResult | null>(null);
 
  // Workflow states
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
 
  // Generate DQ Rules
  const handleGenerateRules = async () => {
    if (!blobPath.trim()) {
      toast.error("Please enter a valid blob path");
      return;
    }
 
    setGenerating(true);
 
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPath.trim(),
    };
 
    try {
      const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run-dq-rules-generation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
 
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
      toast.error("Failed to generate DQ rules. Please check the blob path.");
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
 
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPath.trim(),
      rules: dataQualityRules.map(r => ({
        rule: r.name,
        description: r.condition,
        severity: r.type,
      })),
    };
 
    try {
      const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
 
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
 
  // Quick Fix
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
 
    const payload = {
      input_type: "azure",
      azure_blob_path: blobPath.trim(),
      rules: failedRules,
      proposed_solutions: validationResult.proposed_solutions || {},
    };
 
    try {
      const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/run_dq_fixing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
 
      const result = await response.json();
 
      if (response.ok && result.success) {
        setFixResult(result);
        toast.success(result.message || "Data fixed successfully");
      } else {
        throw new Error(result.message || "Fix failed");
      }
    } catch (error: any) {
      toast.error("Quick fix failed");
    } finally {
      setFixing(false);
      setTimeout(() => setQuickFixComplete(true), 1000);
    }
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
    setDataQualityRules(prev => prev.filter((_, i) => i !== index));
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
 
        {/* Azure Blob Path Input */}
        {!rulesGenerated && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-end gap-4">
              <div className="flex-1">
                <Label htmlFor="blob-path" className="text-lg font-semibold">
                  Enter Azure Blob Path
                </Label>
                <Input
                  id="blob-path"
                  value={blobPath}
                  onChange={(e) => setBlobPath(e.target.value)}
                  placeholder="e.g., powerbikpi/Forcast Template.csv"
                  className="mt-3 text-lg"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Full path to your file in Azure Blob Storage
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleGenerateRules}
                disabled={generating || !blobPath.trim()}
              >
                {generating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate DQ Rules"
                )}
              </Button>
            </div>
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
 