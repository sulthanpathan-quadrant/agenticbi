// import { useState, useEffect } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Code2, ArrowLeft, Plus, Play, Edit, Trash, FileText, Merge, GitBranch, Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "@/hooks/use-toast";
// import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
// import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
// import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
// import { Dialog, DialogContent } from "@/components/ui/dialog";

// interface Column {
//   name: string;
//   table: string;
//   type: string;
// }

// interface CustomTable {
//   name: string;
//   columns: Column[];
//   createdAt: string;
// }

// interface MergedData {
//   tableName: string;
//   columns: Column[];
//   sampleRows: Record<string, string>[];
// }

// type WorkflowStep = "selection" | "merge-options" | "merged-preview" | "business-rules";

// export default function ETLOutput() {
//   const navigate = useNavigate();
//   const [customTables, setCustomTables] = useState<CustomTable[]>([]);
//   const [selectedTables, setSelectedTables] = useState<string[]>([]);
//   const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("selection");
//   const [mergeType, setMergeType] = useState<"merge" | "join" | null>(null);
//   const [mergedData, setMergedData] = useState<MergedData | null>(null);
//   const [mergedTableName, setMergedTableName] = useState("");
//   const [showFullPreview, setShowFullPreview] = useState(false);
  
//   // Business rules state
//   const [rules, setRules] = useState<any[]>([]);
//   const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
//   const [showValidationDialog, setShowValidationDialog] = useState(false);
//   const [validationProgress, setValidationProgress] = useState(0);
//   const [showCompleteDialog, setShowCompleteDialog] = useState(false);
//   const [editingRule, setEditingRule] = useState<number | null>(null);

//   useEffect(() => {
//     const stored = localStorage.getItem("customCreatedTables");
//     if (stored) {
//       const tables = JSON.parse(stored);
//       setCustomTables(tables);
//     } else {
//       // Add sample tables for demonstration
//       const sampleTables: CustomTable[] = [
//         {
//           name: "customer_orders",
//           columns: [
//             { name: "order_id", table: "fact_sales", type: "INT" },
//             { name: "customer_name", table: "dim_customer", type: "VARCHAR" },
//             { name: "order_date", table: "fact_sales", type: "DATE" },
//             { name: "amount", table: "fact_sales", type: "DECIMAL" }
//           ],
//           createdAt: new Date().toLocaleDateString()
//         },
//         {
//           name: "product_sales",
//           columns: [
//             { name: "product_id", table: "dim_product", type: "INT" },
//             { name: "product_name", table: "dim_product", type: "VARCHAR" },
//             { name: "category", table: "dim_product", type: "VARCHAR" },
//             { name: "total_sales", table: "fact_sales", type: "DECIMAL" }
//           ],
//           createdAt: new Date().toLocaleDateString()
//         },
//         {
//           name: "regional_analysis",
//           columns: [
//             { name: "region_id", table: "dim_region", type: "INT" },
//             { name: "country", table: "dim_region", type: "VARCHAR" },
//             { name: "revenue", table: "fact_sales", type: "DECIMAL" }
//           ],
//           createdAt: new Date().toLocaleDateString()
//         }
//       ];
//       setCustomTables(sampleTables);
//     }
//   }, []);

//   const toggleTableSelection = (tableName: string) => {
//     setSelectedTables((prev) =>
//       prev.includes(tableName)
//         ? prev.filter((t) => t !== tableName)
//         : [...prev, tableName]
//     );
//   };

//   const handleCreateJob = () => {
//     if (selectedTables.length === 0) return;
    
//     if (selectedTables.length === 1) {
//       // Single file - go directly to business rules
//       setMergeType(null);
//       setWorkflowStep("business-rules");
//     } else {
//       // Multiple files - show merge/join options
//       setWorkflowStep("merge-options");
//     }
//   };

//   const handleMergeJoinSelect = (type: "merge" | "join") => {
//     setMergeType(type);
//     const selectedTableNames = selectedTables.map(name => {
//       const table = customTables.find(t => t.name === name);
//       return table?.name || name;
//     });
//     const newMergedName = `${type}_${selectedTableNames.join("_")}`;
//     setMergedTableName(newMergedName);
    
//     // Combine columns from all selected tables
//     const allColumns: Column[] = [];
//     const selectedTablesData = getSelectedTablesData();
//     selectedTablesData.forEach(table => {
//       table.columns.forEach(col => {
//         if (!allColumns.find(c => c.name === col.name && c.table === col.table)) {
//           allColumns.push(col);
//         }
//       });
//     });
    
//     // Generate sample merged data
//     const sampleRows: Record<string, string>[] = [];
//     for (let i = 0; i < 5; i++) {
//       const row: Record<string, string> = {};
//       allColumns.forEach(col => {
//         if (col.type.toLowerCase().includes('int') || col.type.toLowerCase().includes('number')) {
//           row[col.name] = String(Math.floor(Math.random() * 1000));
//         } else if (col.type.toLowerCase().includes('date')) {
//           row[col.name] = new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0];
//         } else {
//           row[col.name] = `Sample_${col.name}_${i + 1}`;
//         }
//       });
//       sampleRows.push(row);
//     }
    
//     setMergedData({
//       tableName: newMergedName,
//       columns: allColumns,
//       sampleRows
//     });
    
//     toast({
//       title: `${type === "merge" ? "Merge" : "Join"} Applied`,
//       description: `Tables have been ${type === "merge" ? "merged" : "joined"} successfully`,
//       duration: 2000,
//     });
    
//     // Move to merged preview step
//     setWorkflowStep("merged-preview");
//   };

//   const handleAddRule = (rule: any) => {
//     if (editingRule !== null) {
//       const updatedRules = [...rules];
//       updatedRules[editingRule] = { ...rule, status: "testing" };
//       setRules(updatedRules);
//       setEditingRule(null);
//     } else {
//       setRules([...rules, { ...rule, status: "testing" }]);
//     }
//     setShowAddRuleDialog(false);
//     toast({
//       title: editingRule !== null ? "Rule Updated" : "Rule Added",
//       description: `Business rule has been ${editingRule !== null ? 'updated' : 'added'} successfully`,
//       duration: 1000,
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
//       description: "Business rule has been deleted",
//       duration: 1000,
//     });
//   };

//   const handleRunAllRules = () => {
//     if (rules.length === 0) return;
    
//     setShowValidationDialog(true);
//     setValidationProgress(0);

//     const interval = setInterval(() => {
//       setValidationProgress((prev) => {
//         if (prev >= 100) {
//           clearInterval(interval);
//           setTimeout(() => {
//             setShowValidationDialog(false);
//             setShowCompleteDialog(true);
//           }, 500);
//           return 100;
//         }
//         return prev + 10;
//       });
//     }, 200);
//   };

//   const handleBack = () => {
//     if (workflowStep === "business-rules") {
//       if (selectedTables.length > 1) {
//         setWorkflowStep("merged-preview");
//       } else {
//         setWorkflowStep("selection");
//       }
//       setRules([]);
//     } else if (workflowStep === "merged-preview") {
//       setWorkflowStep("merge-options");
//       setMergedData(null);
//     } else if (workflowStep === "merge-options") {
//       setWorkflowStep("selection");
//       setMergeType(null);
//     }
//   };

//   const getSelectedTablesData = () => {
//     return customTables.filter(t => selectedTables.includes(t.name));
//   };

//   return (
//     <WorkflowLayout>
//       <div className="p-8">
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-foreground mb-2">
//               ETL Pipeline
//             </h1>
//             <p className="text-muted-foreground">
//               {workflowStep === "selection" && "Select tables to create an ETL job"}
//               {workflowStep === "merge-options" && "Choose how to combine your selected tables"}
//               {workflowStep === "merged-preview" && "Preview your merged data"}
//               {workflowStep === "business-rules" && "Apply business logic rules to your data"}
//             </p>
//           </div>
//           <Button onClick={() => navigate("/workflow/data-creation")}>
//             <Plus className="h-4 w-4 mr-2" />
//             Data Creation
//           </Button>
//         </div>

//         {customTables.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <div className="max-w-2xl text-center space-y-4">
//               <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
//                 <Code2 className="h-10 w-10 text-muted-foreground" />
//               </div>
//               <h2 className="text-2xl font-semibold text-foreground">
//                 No Tables Created Yet
//               </h2>
//               <p className="text-muted-foreground text-lg">
//                 Create custom tables in the Data Creation screen to see them here for ETL processing.
//               </p>
//               <Button 
//                 size="lg" 
//                 onClick={() => navigate("/workflow/data-creation")}
//                 className="mt-4"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Go to Data Creation
//               </Button>
//             </div>
//           </div>
//         ) : (
//           <>
//             {/* Step 1: Table Selection */}
//             {workflowStep === "selection" && (
//               <div className="space-y-6">
//                 <div className="border border-border rounded-lg overflow-hidden">
//                   <table className="w-full">
//                     <thead className="bg-muted/50 border-b border-border">
//                       <tr>
//                         <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
//                         <th className="text-left p-4 text-sm font-medium text-muted-foreground">Table Name</th>
//                         <th className="text-left p-4 text-sm font-medium text-muted-foreground">Columns</th>
//                         <th className="text-left p-4 text-sm font-medium text-muted-foreground">Created At</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {customTables.map((table) => (
//                         <tr
//                           key={table.name}
//                           className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
//                           onClick={() => toggleTableSelection(table.name)}
//                         >
//                           <td className="p-4">
//                             <Checkbox
//                               checked={selectedTables.includes(table.name)}
//                               onCheckedChange={() => toggleTableSelection(table.name)}
//                               onClick={(e) => e.stopPropagation()}
//                             />
//                           </td>
//                           <td className="p-4">
//                             <div className="flex items-center gap-2">
//                               <FileText className="h-5 w-5 text-primary" />
//                               <span className="font-medium text-foreground">{table.name}</span>
//                             </div>
//                           </td>
//                           <td className="p-4 text-sm text-muted-foreground">{table.columns.length} columns</td>
//                           <td className="p-4 text-sm text-muted-foreground">{table.createdAt}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {selectedTables.length > 0 && (
//                   <div className="flex justify-end">
//                     <Button onClick={handleCreateJob} size="lg">
//                       <Play className="h-4 w-4 mr-2" />
//                       Create Job ({selectedTables.length} table{selectedTables.length > 1 ? "s" : ""})
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Step 2: Merge/Join Options (only for multiple files) */}
//             {workflowStep === "merge-options" && (
//               <div className="space-y-6">
//                 <div className="bg-card border border-border rounded-lg p-6">
//                   <h3 className="text-lg font-semibold text-foreground mb-4">Selected Tables</h3>
//                   <div className="flex flex-wrap gap-2 mb-6">
//                     {getSelectedTablesData().map((table) => (
//                       <span key={table.name} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
//                         {table.name}
//                       </span>
//                     ))}
//                   </div>

//                   <h3 className="text-lg font-semibold text-foreground mb-4">Choose Operation</h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div
//                       className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
//                       onClick={() => handleMergeJoinSelect("merge")}
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                           <Merge className="h-6 w-6 text-primary" />
//                         </div>
//                         <div>
//                           <h4 className="text-lg font-semibold text-foreground">Merge</h4>
//                           <p className="text-sm text-muted-foreground">Combine rows from all tables</p>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         Append all rows from selected tables into a single unified table. Best for combining similar datasets.
//                       </p>
//                     </div>

//                     <div
//                       className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
//                       onClick={() => handleMergeJoinSelect("join")}
//                     >
//                       <div className="flex items-center gap-3 mb-3">
//                         <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
//                           <GitBranch className="h-6 w-6 text-primary" />
//                         </div>
//                         <div>
//                           <h4 className="text-lg font-semibold text-foreground">Join</h4>
//                           <p className="text-sm text-muted-foreground">Link tables by common columns</p>
//                         </div>
//                       </div>
//                       <p className="text-sm text-muted-foreground">
//                         Combine tables based on matching column values. Best for relating data across different entities.
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex justify-start">
//                   <Button variant="outline" onClick={handleBack}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back to Selection
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Step 3: Merged Data Preview */}
//             {workflowStep === "merged-preview" && mergedData && (
//               <div className="space-y-6">
//                 <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-foreground">
//                         <span className="font-semibold">Merged Table: </span>
//                         <span className="text-primary">{mergedData.tableName}</span>
//                       </p>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         {mergedData.columns.length} columns • {mergedData.sampleRows.length * 2} sample rows
//                       </p>
//                     </div>
//                     <Button variant="outline" onClick={() => setShowFullPreview(true)}>
//                       <Eye className="h-4 w-4 mr-2" />
//                       View Full Preview
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <Button variant="outline" onClick={handleBack}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                   <Button onClick={() => setWorkflowStep("business-rules")}>
//                     <Play className="h-4 w-4 mr-2" />
//                     Apply Business Rules
//                   </Button>
//                 </div>
//               </div>
//             )}

//             {/* Step 4: Business Rules */}
//             {workflowStep === "business-rules" && (
//               <div className="space-y-6">
//                 {/* Info Banner */}
//                 <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
//                   <p className="text-sm text-foreground">
//                     <span className="font-semibold">Working with: </span>
//                     {selectedTables.length === 1 
//                       ? selectedTables[0]
//                       : `${mergedTableName} (${mergeType} of ${selectedTables.join(", ")})`
//                     }
//                   </p>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3">
//                   <Button variant="outline" onClick={handleRunAllRules} disabled={rules.length === 0}>
//                     <Play className="h-4 w-4 mr-2" />
//                     Run All Rules
//                   </Button>
//                   <Button onClick={() => { setEditingRule(null); setShowAddRuleDialog(true); }}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     Add New Rule
//                   </Button>
//                 </div>

//                 {/* Rules List */}
//                 <div className="border border-border rounded-lg p-6 bg-card">
//                   {rules.length === 0 ? (
//                     <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
//                       <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
//                       <h3 className="text-lg font-semibold text-foreground mb-2">
//                         No Business Rules Added Yet
//                       </h3>
//                       <p className="text-sm text-muted-foreground mb-4">
//                         Click '+ Add New Rule' to create your first business logic rule.
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="space-y-4">
//                       {rules.map((rule, index) => (
//                         <div
//                           key={index}
//                           className="border border-border rounded-lg p-4 bg-background"
//                         >
//                           <div className="flex items-start justify-between mb-3">
//                             <div className="flex items-center gap-3">
//                               <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
//                               <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500">
//                                 {rule.status}
//                               </span>
//                             </div>
//                             <div className="flex gap-2">
//                               <Button variant="outline" size="sm" onClick={() => handleEditRule(index)}>
//                                 <Edit className="h-4 w-4 mr-2" />
//                                 Edit
//                               </Button>
//                               <Button variant="outline" size="sm" onClick={() => handleDeleteRule(index)}>
//                                 <Trash className="h-4 w-4" />
//                               </Button>
//                             </div>
//                           </div>
//                           <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
//                           <div className="bg-muted/50 rounded-lg p-3">
//                             <pre className="text-sm text-foreground font-mono">{rule.logic}</pre>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex justify-start">
//                   <Button variant="outline" onClick={handleBack}>
//                     <ArrowLeft className="h-4 w-4 mr-2" />
//                     Back
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </>
//         )}

//         {/* Bottom Navigation */}
//         {workflowStep === "selection" && (
//           <div className="flex justify-start items-center mt-8">
//             <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
//               <ArrowLeft className="mr-2 h-4 w-4" />
//               Back to Path Selection
//             </Button>
//           </div>
//         )}
//       </div>

//       <AddBusinessRuleDialog
//         open={showAddRuleDialog}
//         onOpenChange={(open) => {
//           setShowAddRuleDialog(open);
//           if (!open) setEditingRule(null);
//         }}
//         onAddRule={handleAddRule}
//         initialRule={editingRule !== null ? rules[editingRule] : undefined}
//       />

//       <BusinessRuleValidationDialog
//         open={showValidationDialog}
//         onOpenChange={setShowValidationDialog}
//         progress={validationProgress}
//         rulesCount={rules.length}
//       />

//       <BusinessRuleCompleteDialog
//         open={showCompleteDialog}
//         onOpenChange={setShowCompleteDialog}
//         onContinue={() => {
//           // Store business logic status
//           localStorage.setItem("businessLogicStatus", "executed");
//           // Store merged/selected table info for job
//           localStorage.setItem("etlTableName", selectedTables.length === 1 
//             ? selectedTables[0] 
//             : mergedTableName
//           );
//           setShowCompleteDialog(false);
//         }}
//         isETLFlow={true}
//       />

//       {/* Full Data Preview Modal */}
//       <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
//         <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
//           <div className="mb-4">
//             <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
//             <p className="text-muted-foreground mt-1">
//               Table: <span className="text-primary">{mergedData?.tableName}</span> • {mergedData?.columns.length} columns × {(mergedData?.sampleRows.length || 0) * 2} rows
//             </p>
//           </div>
          
//           <div className="flex-1 overflow-auto border border-border rounded-lg">
//             <table className="w-full">
//               <thead className="bg-muted/50 sticky top-0">
//                 <tr>
//                   {mergedData?.columns.map((col) => (
//                     <th key={`preview-${col.table}-${col.name}`} className="text-left p-4 text-sm font-medium text-muted-foreground whitespace-nowrap border-b border-border">
//                       <div>{col.name}</div>
//                       <div className="text-xs text-muted-foreground/60">({col.table})</div>
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {mergedData?.sampleRows.map((row, idx) => (
//                   <tr key={`preview-row-${idx}`} className="border-b border-border last:border-0 hover:bg-muted/30">
//                     {mergedData?.columns.map((col) => (
//                       <td key={`preview-${col.table}-${col.name}-${idx}`} className="p-4 text-sm text-foreground whitespace-nowrap">
//                         {row[col.name]}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-end mt-4">
//             <Button onClick={() => setShowFullPreview(false)}>
//               Close Preview
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </WorkflowLayout>
//   );
// }

import { useState, useEffect } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Code2,
  ArrowLeft,
  Plus,
  Play,
  Edit,
  Trash,
  Trash2,
  FileText,
  Eye,
  Table as TableIcon,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Save,
  Calendar,
  Settings2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
// import { ScheduleJobDialog } from "@/pages/ScheduleJobDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Column {
  name: string;
  table: string;
  type: string;
}

interface CustomTable {
  name: string;
  columns: Column[];
  createdAt: string;
}

interface BuiltDataset {
  name: string;
  columns: Column[];
  sampleRows: Record<string, string>[];
}

type WorkflowStep =
  | "selection"
  | "build-dataset"
  | "dataset-preview"
  | "action-choice"
  | "business-rules";

export default function ETLOutput() {
  const navigate = useNavigate();
  const [customTables, setCustomTables] = useState<CustomTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("selection");

  // Build Dataset state
  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});
  const [customDatasetName, setCustomDatasetName] = useState("etl_dataset");
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [builtDataset, setBuiltDataset] = useState<BuiltDataset | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);

  // Business rules state
  const [rules, setRules] = useState<any[]>([]);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<number | null>(null);

  // Schedule dialog
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("customCreatedTables");
    if (stored) {
      const tables = JSON.parse(stored);
      setCustomTables(tables);
    } else {
      // Sample tables for demonstration
      const sampleTables: CustomTable[] = [
        {
          name: "customer_orders",
          columns: [
            { name: "order_id", table: "fact_sales", type: "INT" },
            { name: "customer_name", table: "dim_customer", type: "VARCHAR" },
            { name: "order_date", table: "fact_sales", type: "DATE" },
            { name: "amount", table: "fact_sales", type: "DECIMAL" },
          ],
          createdAt: new Date().toLocaleDateString(),
        },
        {
          name: "product_sales",
          columns: [
            { name: "product_id", table: "dim_product", type: "INT" },
            { name: "product_name", table: "dim_product", type: "VARCHAR" },
            { name: "category", table: "dim_product", type: "VARCHAR" },
            { name: "total_sales", table: "fact_sales", type: "DECIMAL" },
          ],
          createdAt: new Date().toLocaleDateString(),
        },
        {
          name: "regional_analysis",
          columns: [
            { name: "region_id", table: "dim_region", type: "INT" },
            { name: "country", table: "dim_region", type: "VARCHAR" },
            { name: "revenue", table: "fact_sales", type: "DECIMAL" },
          ],
          createdAt: new Date().toLocaleDateString(),
        },
      ];
      setCustomTables(sampleTables);
    }
  }, []);

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName)
        ? prev.filter((t) => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleCreateJob = () => {
    if (selectedTables.length === 0) return;
    setWorkflowStep("build-dataset");
  };

  // Build Dataset functions
  const getSelectedTablesData = () => {
    return customTables.filter((t) => selectedTables.includes(t.name));
  };

  const toggleTableCollapse = (tableName: string) => {
    setCollapsedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const handleDragStart = (column: Column) => {
    setDraggedColumn(column);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedColumn) {
      const exists = selectedColumns.some(
        (col) => col.name === draggedColumn.name && col.table === draggedColumn.table
      );
      if (!exists) {
        setSelectedColumns([...selectedColumns, draggedColumn]);
        toast({
          title: "Column Added",
          description: `${draggedColumn.name} from ${draggedColumn.table} added`,
          duration: 1000,
        });
      }
    }
    setDraggedColumn(null);
  };

  const handleAddColumn = (column: Column) => {
    const exists = selectedColumns.some(
      (col) => col.name === column.name && col.table === column.table
    );
    if (!exists) {
      setSelectedColumns([...selectedColumns, column]);
      toast({
        title: "Column Added",
        description: `${column.name} added to dataset`,
        duration: 1000,
      });
    }
  };

  const handleRemoveColumn = (index: number) => {
    setSelectedColumns(selectedColumns.filter((_, i) => i !== index));
  };

  const handleSaveDataset = () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No Columns Selected",
        description: "Please add at least one column to your dataset",
        variant: "destructive",
      });
      return;
    }

    // Generate sample rows
    const sampleRows: Record<string, string>[] = [];
    for (let i = 0; i < 10; i++) {
      const row: Record<string, string> = {};
      selectedColumns.forEach((col) => {
        if (col.type.toLowerCase().includes("int") || col.type.toLowerCase().includes("number")) {
          row[col.name] = String(Math.floor(Math.random() * 1000));
        } else if (col.type.toLowerCase().includes("date")) {
          row[col.name] = new Date(Date.now() - Math.random() * 10000000000)
            .toISOString()
            .split("T")[0];
        } else if (col.type.toLowerCase().includes("decimal")) {
          row[col.name] = (Math.random() * 10000).toFixed(2);
        } else {
          row[col.name] = `Sample_${col.name}_${i + 1}`;
        }
      });
      sampleRows.push(row);
    }

    setBuiltDataset({
      name: customDatasetName,
      columns: selectedColumns,
      sampleRows,
    });

    toast({
      title: "Dataset Built Successfully",
      description: `${customDatasetName} created with ${selectedColumns.length} columns`,
    });

    setWorkflowStep("dataset-preview");
  };

  // Business Rules functions
  const handleAddRule = (rule: any) => {
    if (editingRule !== null) {
      const updatedRules = [...rules];
      updatedRules[editingRule] = { ...rule, status: "testing" };
      setRules(updatedRules);
      setEditingRule(null);
    } else {
      setRules([...rules, { ...rule, status: "testing" }]);
    }
    setShowAddRuleDialog(false);
    toast({
      title: editingRule !== null ? "Rule Updated" : "Rule Added",
      description: `Business rule has been ${editingRule !== null ? "updated" : "added"} successfully`,
      duration: 1000,
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
      description: "Business rule has been deleted",
      duration: 1000,
    });
  };

  const handleRunAllRules = () => {
    if (rules.length === 0) return;

    setShowValidationDialog(true);
    setValidationProgress(0);

    const interval = setInterval(() => {
      setValidationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowValidationDialog(false);
            setShowCompleteDialog(true);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleBack = () => {
    if (workflowStep === "business-rules") {
      setWorkflowStep("action-choice");
      setRules([]);
    } else if (workflowStep === "action-choice") {
      setWorkflowStep("dataset-preview");
    } else if (workflowStep === "dataset-preview") {
      setWorkflowStep("build-dataset");
      setBuiltDataset(null);
    } else if (workflowStep === "build-dataset") {
      setWorkflowStep("selection");
      setSelectedColumns([]);
      setCustomDatasetName("etl_dataset");
    }
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">ETL Pipeline</h1>
            <p className="text-muted-foreground">
              {workflowStep === "selection" && "Select datasets to create an ETL job"}
              {workflowStep === "build-dataset" && "Build your custom dataset by selecting columns"}
              {workflowStep === "dataset-preview" && "Preview your built dataset"}
              {workflowStep === "action-choice" && "Choose your next action"}
              {workflowStep === "business-rules" && "Apply business logic rules to your data"}
            </p>
          </div>
          <Button onClick={() => navigate("/workflow/data-creation")}>
            <Plus className="h-4 w-4 mr-2" />
            Creat Dataset
          </Button>
        </div>

        {customTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-2xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">No Tables Created Yet</h2>
              <p className="text-muted-foreground text-lg">
                Create custom tables in the Data Creation screen to see them here for ETL
                processing.
              </p>
              <Button size="lg" onClick={() => navigate("/workflow/data-creation")} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Go to Create Dataset
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Table Selection
            {workflowStep === "selection" && (
              <div className="space-y-6">
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Table Name
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Columns
                        </th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                          Created At
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {customTables.map((table) => (
                        <tr
                          key={table.name}
                          className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                          onClick={() => toggleTableSelection(table.name)}
                        >
                          <td className="p-4">
                            <Checkbox
                              checked={selectedTables.includes(table.name)}
                              onCheckedChange={() => toggleTableSelection(table.name)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-primary" />
                              <span className="font-medium text-foreground">{table.name}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">
                            {table.columns.length} columns
                          </td>
                          <td className="p-4 text-sm text-muted-foreground">{table.createdAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedTables.length > 0 && (
                  <div className="flex justify-end">
                    <Button onClick={handleCreateJob} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Create Job ({selectedTables.length} table
                      {selectedTables.length > 1 ? "s" : ""})
                    </Button>
                  </div>
                )}
              </div>
            )}
 */}
{workflowStep === "selection" && (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-foreground">Select Data Source</h2>
      <span className="text-sm text-muted-foreground">
        {customTables.length} files available
      </span>
    </div>

    {/* Card Grid – Exact Screenshot Style */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {customTables.map((table) => (
        <div
          key={table.name}
          onClick={() => toggleTableSelection(table.name)}
          className={`
            relative rounded-xl border p-6 cursor-pointer transition-all
            ${selectedTables.includes(table.name)
              ? "border-cyan-500 bg-cyan-500/5"
              : "border-border bg-card hover:border-cyan-500/50 hover:bg-muted/20"
            }
          `}
        >
          {/* Radio Button – Top Right (exactly like your screenshot) */}
          <div className="absolute top-5 right-5">
            <div
              className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedTables.includes(table.name)
                  ? "border-cyan-500 bg-cyan-500"
                  : "border-muted-foreground"
                }
              `}
            >
              {selectedTables.includes(table.name) && (
                <div className="w-2 h-2 rounded-full bg-background" />
              )}
            </div>
          </div>

          {/* Icon + Name */}
          <div className="flex items-center gap-4">
            <div
              className={`
                p-3 rounded-lg
                ${table.name.includes("marketing")
                  ? "bg-amber-500/20"
                  : "bg-cyan-500/20"
                }
              `}
            >
              <FileText
                className={`
                  h-6 w-6
                  ${table.name.includes("marketing")
                    ? "text-amber-400"
                    : "text-cyan-400"
                  }
                `}
              />
            </div>

            <div>
              <h3 className="font-medium text-foreground">
                {table.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {table.createdAt}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Create Job Button */}
    {selectedTables.length > 0 && (
      <div className="flex justify-end pt-6">
        <Button onClick={handleCreateJob} size="lg">
          <Play className="h-4 w-4 mr-2" />
          Create Job ({selectedTables.length} file{selectedTables.length > 1 ? "s" : ""})
        </Button>
      </div>
    )}
  </div>
)}

            {/* Step 2: Build Dataset */}
{workflowStep === "build-dataset" && (
  <div className="space-y-6">
    {/* Selected Tables Info */}
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
      <p className="text-sm text-foreground">
        <span className="font-semibold">Building from: </span>
        {selectedTables.map((name, i) => (
          <span key={name}>
            <span className="text-primary">{name}</span>
            {i < selectedTables.length - 1 && ", "}
          </span>
        ))}
      </p>
    </div>

    {/* Two Column Layout - Same as DataCreation.tsx */}
    <div className="grid grid-cols-[350px,1fr] gap-6">
      {/* Left: Available Columns (Exact UI from DataCreation.tsx) */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <TableIcon className="h-5 w-5" />
          Available Columns
        </h2>

        <ScrollArea className="h-[calc(100vh-150px)] pr-2 rounded-lg bg-card/50">
          <div className="space-y-3 p-4">
            {getSelectedTablesData().map((table) => (
              <div
                key={table.name}
                className="border border-border rounded-lg bg-background overflow-hidden shadow-sm"
              >
                {/* Table Header */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
                  onClick={() => toggleTableCollapse(table.name)}
                >
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{table.name}</span>
                    {collapsedTables[table.name] ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {table.columns.length} cols
                  </Badge>
                </div>

                {/* Columns List */}
                {!collapsedTables[table.name] && (
                  <div>
                    {table.columns.map((column) => (
                      <div
                        key={`${table.name}-${column.name}`}
                        draggable
                        onDragStart={() =>
                          handleDragStart({ ...column, table: table.name })
                        }
                        className="flex items-center justify-between px-4 py-2 cursor-move hover:bg-muted/50 transition-colors group border-b border-border/30 last:border-b-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-foreground">
                            {column.name}
                          </span>
                          <span className="text-xs text-muted-foreground px-2 py-0.5 bg-muted rounded">
                            {column.type}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddColumn({ ...column, table: table.name });
                          }}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right: Your Custom Dataset */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Your Custom Dataset
        </h2>

        {/* Dataset Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Dataset Name</label>
          <Input
            value={customDatasetName}
            onChange={(e) => setCustomDatasetName(e.target.value)}
            placeholder="Enter dataset name"
            className="bg-card border-border"
          />
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg bg-card/50 min-h-[400px] flex flex-col overflow-hidden"
        >
          <ScrollArea className="flex-1 p-4">
            {selectedColumns.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center p-8">
                <LayoutGrid className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drop columns here
                </h3>
                <p className="text-sm text-muted-foreground">
                  Drag from left or click the plus button
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedColumns.map((column, index) => (
                  <div
                    key={`selected-${column.table}-${column.name}-${index}`}
                    className="flex items-center justify-between p-3 bg-background rounded-lg border border-border shadow-sm hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground">
                        {column.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {column.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        from {column.table}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveColumn(index)}
                      className="h-8 w-8 p-0 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Save Button */}
        <Button
          className="w-full"
          onClick={handleSaveDataset}
          disabled={selectedColumns.length === 0}
        >
          <Save className="h-4 w-4 mr-2" />
          Build Dataset
        </Button>
      </div>
    </div>

    {/* Back Button */}
    <div className="flex justify-start pt-6">
      <Button variant="outline" onClick={handleBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Selection
      </Button>
    </div>
  </div>
)}
            {/* Step 3: Dataset Preview */}
            {workflowStep === "dataset-preview" && builtDataset && (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">
                        <span className="font-semibold">Dataset: </span>
                        <span className="text-primary text-lg">{builtDataset.name}</span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {builtDataset.columns.length} columns •{" "}
                        {builtDataset.sampleRows.length} sample rows
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowFullPreview(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Preview
                    </Button>
                  </div>
                </div>

                {/* Quick Preview Table */}
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          {builtDataset.columns.slice(0, 5).map((col) => (
                            <th
                              key={`quick-${col.table}-${col.name}`}
                              className="text-left p-4 text-sm font-medium text-muted-foreground whitespace-nowrap border-b border-border"
                            >
                              {col.name}
                            </th>
                          ))}
                          {builtDataset.columns.length > 5 && (
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground border-b border-border">
                              ...
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {builtDataset.sampleRows.slice(0, 3).map((row, idx) => (
                          <tr
                            key={`quick-row-${idx}`}
                            className="border-b border-border last:border-0 hover:bg-muted/30"
                          >
                            {builtDataset.columns.slice(0, 5).map((col) => (
                              <td
                                key={`quick-${col.table}-${col.name}-${idx}`}
                                className="p-4 text-sm text-foreground whitespace-nowrap"
                              >
                                {row[col.name]}
                              </td>
                            ))}
                            {builtDataset.columns.length > 5 && (
                              <td className="p-4 text-sm text-muted-foreground">...</td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={() => setWorkflowStep("action-choice")}>
                    Continue
                    <Play className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4: Action Choice */}
            {workflowStep === "action-choice" && builtDataset && (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Working with: </span>
                    <span className="text-primary">{builtDataset.name}</span>
                    <span className="text-muted-foreground ml-2">
                      ({builtDataset.columns.length} columns)
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Schedule Job Card */}
                  <div
                    className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                    // onClick={() => setShowScheduleDialog(true)}
                    onClick={() => {
    // // Set context in localStorage, similar to business rule flow
    // localStorage.setItem("etlTableName", builtDataset?.name || "etl_dataset");
    // localStorage.setItem("currentJobName", builtDataset?.name || "ETL Job");
    // localStorage.setItem("dqRulesStatus", "skipped"); // Match business rule flow defaults
    // localStorage.setItem("nerStatus", "skipped");
    // localStorage.setItem("businessLogicStatus", "skipped");
    navigate("/schedule-job"); // Navigate to full page
  }}
>

                  
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Schedule Job</h4>
                        <p className="text-sm text-muted-foreground">
                          Run this ETL job on a schedule
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set up automated runs for your dataset. Choose frequency and timing for
                      regular data processing.
                    </p>
                  </div>

                  {/* Apply Business Rules Card */}
                  <div
                    className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setWorkflowStep("business-rules")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">
                          Apply Business Rules
                        </h4>
                        <p className="text-sm text-muted-foreground">Add validation & logic</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Define business rules to validate and transform your data before processing.
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Preview
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5: Business Rules */}
            {workflowStep === "business-rules" && (
              <div className="space-y-6">
                {/* Info Banner */}
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Working with: </span>
                    <span className="text-primary">{builtDataset?.name}</span>
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleRunAllRules} disabled={rules.length === 0}>
                    <Play className="h-4 w-4 mr-2" />
                    Run All Rules
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingRule(null);
                      setShowAddRuleDialog(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Rule
                  </Button>
                </div>

                {/* Rules List */}
                <div className="border border-border rounded-lg p-6 bg-card">
                  {rules.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
                      <Code2 className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        No Business Rules Added Yet
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Click '+ Add New Rule' to create your first business logic rule.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {rules.map((rule, index) => (
                        <div
                          key={index}
                          className="border border-border rounded-lg p-4 bg-background"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500">
                                {rule.status}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditRule(index)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteRule(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{rule.description}</p>
                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-sm text-foreground font-mono">{rule.logic}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  {/* {rules.length > 0 && (
                    <Button onClick={() => setShowScheduleDialog(true)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Job
                    </Button>
                  )} */}
                </div>
              </div>
            )}
          </>
        )}

        {/* Bottom Navigation */}
        {workflowStep === "selection" && (
          <div className="flex justify-start items-center mt-8">
            <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Path Selection
            </Button>
          </div>
        )}
      </div>

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
        progress={validationProgress}
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
        isETLFlow={true}
      />

      {/* <ScheduleJobDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        datasetName={builtDataset?.name || ""}
        onSchedule={() => {
          localStorage.setItem("etlJobScheduled", "true");
          toast({
            title: "Success",
            description: "Your ETL pipeline has been scheduled successfully!",
          });
        }}
      /> */}

      {/* Full Data Preview Modal */}
      <Dialog open={showFullPreview} onOpenChange={setShowFullPreview}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-foreground">Full Data Preview</h2>
            <p className="text-muted-foreground mt-1">
              Table: <span className="text-primary">{builtDataset?.name}</span> •{" "}
              {builtDataset?.columns.length} columns × {builtDataset?.sampleRows.length} rows
            </p>
          </div>

          <div className="flex-1 overflow-auto border border-border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted/50 sticky top-0">
                <tr>
                  {builtDataset?.columns.map((col) => (
                    <th
                      key={`preview-${col.table}-${col.name}`}
                      className="text-left p-4 text-sm font-medium text-muted-foreground whitespace-nowrap border-b border-border"
                    >
                      <div>{col.name}</div>
                      <div className="text-xs text-muted-foreground/60">({col.table})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {builtDataset?.sampleRows.map((row, idx) => (
                  <tr
                    key={`preview-row-${idx}`}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    {builtDataset?.columns.map((col) => (
                      <td
                        key={`preview-${col.table}-${col.name}-${idx}`}
                        className="p-4 text-sm text-foreground whitespace-nowrap"
                      >
                        {row[col.name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowFullPreview(false)}>Close Preview</Button>
          </div>
        </DialogContent>
      </Dialog>
    </WorkflowLayout>
  );
}

