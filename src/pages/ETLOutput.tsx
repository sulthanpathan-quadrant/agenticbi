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
  Loader2,
  X,
  Clock,
  Upload,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast,useToast} from "@/hooks/use-toast";
import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface CustomTable {
  name: string;
  columns: Column[];
  createdAt: string;
}

interface BuiltDataset {
  name: string;
  columns: Column[];
  sampleRows: Record<string, any>[];
}

type WorkflowStep =
  | "selection"
  | "build-dataset"
  | "dataset-preview"
  | "action-choice"
  | "business-rules";

interface WorkflowSteps {
  dqRules: "skipped" | "executed";
  ner: "skipped" | "executed";
  businessLogic: "skipped" | "executed";
  dataTransformations: "skipped" | "executed";
}

const API_BASE = "https://api.veriton.ai/api/service1";

export default function ETLOutput() {
  const navigate = useNavigate();
  const { dismiss } = useToast();
  const [customTables, setCustomTables] = useState<CustomTable[]>([]);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [workflowStep, setWorkflowStep] = useState<WorkflowStep>("selection");

  // Build Dataset state
  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});
  const [customDatasetName, setCustomDatasetName] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<Column[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [builtDataset, setBuiltDataset] = useState<BuiltDataset | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [fullPreviewData, setFullPreviewData] = useState<Record<string, any>[]>([]);

  // Business rules state
  const [rules, setRules] = useState<any[]>([]);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validating, setValidating] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [jobInfo, setJobInfo] = useState<{ correlation_id?: string; databricks_run_id?: string; message?: string } | null>(null);

  // Schedule Job dialog state
  const [triggerType, setTriggerType] = useState<"schedule" | "file">("schedule");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [jobName, setJobName] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowSteps>({
    dqRules: "skipped",
    ner: "skipped",
    businessLogic: "skipped",
    dataTransformations: "skipped",
  });
  const [loading, setLoading] = useState(false);

  // Loading states
  const [isBuilding, setIsBuilding] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const user_id = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const job_id = localStorage.getItem("current_job_id");

  // Reusable X close button for all toasts
  // const closeToastButton = (
  //   <button
  //     onClick={() => toast.dismiss()}
  //     className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
  //     aria-label="Close toast"
  //   >
  //     <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
  //   </button>
  // );
   
  const closeToastButton = (
  <button
    onClick={() => dismiss()}
    className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
    aria-label="Close toast"
  >
    <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
  </button>
);


  useEffect(() => {
    const stored = localStorage.getItem("customCreatedTables");
    if (stored) {
      setCustomTables(JSON.parse(stored));
    } else {
      setCustomTables([]);
    }
  }, []);

  // Fetch columns for all custom tables
  useEffect(() => {
    const fetchAllColumns = async () => {
      const updatedTables = await Promise.all(
        customTables.map(async (table) => {
          if (table.columns.length > 0) return table;
          try {
            const response = await fetch(
              `https://api.veriton.ai/api/service2/dataset-list-columns?user_id=${user_id}&job_id=${job_id}&filename=${table.name}`,
              { headers: { accept: "application/json" } }
            );
            if (!response.ok) throw new Error(`Failed to fetch columns for ${table.name}`);
            const data = await response.json();
            const columns = data.columns?.map((c: { name: string; type: string }) => ({
              name: c.name,
              type: c.type,
              table: table.name,
            })) ?? [];
            return { ...table, columns };
          } catch (error) {
            console.error(`Error fetching columns for ${table.name}:`, error);
            return table;
          }
        })
      );
      setCustomTables(updatedTables);
    };

    if (customTables.length > 0) fetchAllColumns();
  }, [customTables.length, user_id, job_id]);

  // Fetch preview data
  const fetchPreviewData = async (datasetName: string) => {
    if (!datasetName) return;

    setIsPreviewLoading(true);
    try {
      const response = await fetch(
        `https://api.veriton.ai/api/service2/preview-dataset?user_id=${user_id}&job_id=${job_id}&datasetname=${datasetName}`,
        { headers: { accept: "application/json" } }
      );

      if (!response.ok) throw new Error("Preview failed");

      const json = await response.json();
      const rows = json.preview_rows ?? json.rows ?? json ?? [];
      setFullPreviewData(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Preview fetch error:", err);
      toast({
        title: "Preview Error",
        description: "Could not load dataset preview",
        variant: "destructive",
        action: closeToastButton,
      });
      setFullPreviewData([]);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  useEffect(() => {
    if (showFullPreview && builtDataset) {
      fetchPreviewData(builtDataset.name);
    }
  }, [showFullPreview, builtDataset]);

  // Load schedule job data from localStorage
  useEffect(() => {
    const etlJobName = localStorage.getItem("currentJobName");
    const etlTableName = localStorage.getItem("etlTableName");

    if (etlJobName) setJobName(etlJobName);
    else if (etlTableName) setJobName(`Job_${etlTableName}`);

    setWorkflowSteps({
      dqRules: localStorage.getItem("dqRulesStatus") === "executed" ? "executed" : "skipped",
      ner: localStorage.getItem("nerStatus") === "executed" ? "executed" : "skipped",
      businessLogic: localStorage.getItem("businessLogicStatus") === "executed" ? "executed" : "skipped",
      dataTransformations: "executed",
    });
  }, []);

  const getUserId = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      const user = JSON.parse(userStr);
      return user?.id || user?.user_id;
    } catch {
      return null;
    }
  };

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
        description: "User ID not found. Please log in.",
        action: closeToastButton,
      });
      return;
    }

    setLoading(true);

    const payload = {
      job_id: job_id,
      job_name: jobName || `Job_${new Date().toISOString().split("T")[0]}`,
      schedule_details:
        triggerType === "schedule"
          ? {
              frequency: frequency,
              time: time || "00:00",
            }
          : null,
    };

    try {
      const url = `${API_BASE}/schedule-job?user_id=${userId}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server responded with status ${response.status}`);
      }

      const data = await response.json();

      if (data.message?.toLowerCase().includes("success")) {
        toast({
          title: "Success",
          description: data.message || "Job scheduled successfully!",
          action: closeToastButton,
        });

        // Save to localStorage
        const savedJobs = localStorage.getItem("jobs");
        const jobs = savedJobs ? JSON.parse(savedJobs) : [];

        const newJob = {
          id: job_id,
          name: payload.job_name,
          category: "Unknown",
          createdAt: new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }),
          lastRun: "-",
          status: "Created" as const,
          steps: workflowSteps,
          sourceFilePath: "s3://ingestion-01/data.csv",
          destinationFilePath: "s3://output-bucket/data.csv",
          triggerType: triggerType === "schedule" ? "SCHEDULE" : "FILE_TRIGGER",
          scheduleDetails:
            triggerType === "schedule"
              ? `${frequency} at ${time || "00:00"}`
              : "On file upload",
        };

        localStorage.setItem("jobs", JSON.stringify([...jobs, newJob]));

        // Cleanup localStorage
        localStorage.removeItem("currentJobName");
        localStorage.removeItem("etlTableName");
        localStorage.removeItem("businessLogicStatus");
        localStorage.removeItem("dqRulesStatus");
        localStorage.removeItem("nerStatus");

        // Reset form fields
        setJobName("");
        setTriggerType("schedule");
        setFrequency("");
        setTime("");

        // Close dialog
        setShowScheduleDialog(false);

        // Navigate to jobs page
        navigate("/jobs");
      } else {
        throw new Error(data.message || "Scheduling failed");
      }
    } catch (err: any) {
      console.error("Schedule error:", err);
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

  const toggleTableSelection = (tableName: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableName) ? prev.filter((t) => t !== tableName) : [...prev, tableName]
    );
  };

  const handleCreateJob = () => {
    if (selectedTables.length === 0) return;
    setWorkflowStep("build-dataset");
  };

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
          action: closeToastButton,
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
        action: closeToastButton,
      });
    }
  };

  const handleRemoveColumn = (index: number) => {
    setSelectedColumns(selectedColumns.filter((_, i) => i !== index));
  };

  const handleSaveDataset = async () => {
    if (selectedColumns.length === 0) {
      toast({
        title: "No Columns Selected",
        description: "Please add at least one column to your dataset",
        variant: "destructive",
        action: closeToastButton,
      });
      return;
    }

    setIsBuilding(true);

    const groups: Record<string, string[]> = {};
    selectedColumns.forEach((col) => {
      if (!groups[col.table]) groups[col.table] = [];
      groups[col.table].push(col.name);
    });

    const selections = Object.entries(groups).map(([dataset_name, columns]) => ({
      dataset_name,
      columns,
    }));

    const payload = {
      user_id,
      job_id,
      microdataset_name: customDatasetName,
      selections,
    };

    try {
      const createResponse = await fetch("https://api.veriton.ai/api/service2/createmicrodataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(`Create failed: ${createResponse.status} - ${errorText}`);
      }

      try {
        const transferResponse = await fetch(
          `https://api.veriton.ai/api/service2/transferfromonelaketoblob?user_id=${user_id}&job_id=${job_id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!transferResponse.ok) {
          console.warn("Transfer failed, but dataset created");
          toast({
            title: "Transfer Started (Background)",
            description: "Dataset created, transfer may be processing...",
            action: closeToastButton,
          });
        } else {
          toast({
            title: "Transfer Started",
            description: "Moving data to blob storage...",
            duration: 3000,
            action: closeToastButton,
          });
        }
      } catch (transferErr) {
        console.error("Transfer error (non-blocking):", transferErr);
      }

      const previewResponse = await fetch(
        `https://api.veriton.ai/api/service2/preview-dataset?user_id=${user_id}&job_id=${job_id}&datasetname=${customDatasetName}`,
        { headers: { accept: "application/json" } }
      );

      if (!previewResponse.ok) throw new Error("Preview failed");

      const previewJson = await previewResponse.json();
      let sampleRows: Record<string, any>[] = [];
      if (Array.isArray(previewJson)) sampleRows = previewJson;
      else if (previewJson?.preview_rows) sampleRows = previewJson.preview_rows;
      else if (previewJson?.rows) sampleRows = previewJson.rows;

      setBuiltDataset({
        name: customDatasetName,
        columns: selectedColumns,
        sampleRows,
      });

      toast({
        title: "Dataset Built Successfully",
        description: `${customDatasetName} created • ${sampleRows.length} preview rows`,
        action: closeToastButton,
      });

      setWorkflowStep("dataset-preview");
    } catch (error) {
      console.error("Build dataset error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to build dataset",
        variant: "destructive",
        action: closeToastButton,
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handlePreviewSelectedTable = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Table Selected",
        description: "Please select at least one table first",
        variant: "destructive",
        action: closeToastButton,
      });
      return;
    }

    const tableName = selectedTables[0];
    setIsPreviewLoading(true);

    try {
      const response = await fetch(
        `https://api.veriton.ai/api/service2/preview-dataset?user_id=${user_id}&job_id=${job_id}&datasetname=${tableName}`,
        { headers: { accept: "application/json" } }
      );

      if (!response.ok) throw new Error("Preview failed");

      const json = await response.json();
      let sampleRows: Record<string, any>[] = [];
      if (Array.isArray(json)) sampleRows = json;
      else if (json?.preview_rows) sampleRows = json.preview_rows;
      else if (json?.rows) sampleRows = json.rows;

      const table = customTables.find(t => t.name === tableName);
      const columns = table?.columns || [];

      setBuiltDataset({
        name: tableName,
        columns,
        sampleRows,
      });

      setWorkflowStep("dataset-preview");
    } catch (err) {
      toast({
        title: "Preview Failed",
        description: "Could not load preview for selected table",
        variant: "destructive",
        action: closeToastButton,
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

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
      description: "Business rule has been deleted",
      duration: 1000,
      action: closeToastButton,
    });
  };

  const handleRunAllRules = async () => {
    if (rules.length === 0) {
      // toast.error("No rules to run", {
      //   action: closeToastButton,
      // });
      toast({
  title: "Error",
  description: "No rules to run",
  variant: "destructive",
  action: closeToastButton,
});

      return;
    }

    if (!builtDataset?.name) {
      // toast.error("No dataset selected for processing", {
      //   action: closeToastButton,
      // });
      toast({
  title: "Error",
  description: "No dataset selected for processing",
  variant: "destructive",
  action: closeToastButton,
});

      return;
    }

    let filename = builtDataset.name;
    if (!filename.toLowerCase().endsWith(".csv")) {
      filename += ".csv";
    }

    const blobPath = `${user_id}/${job_id}/${filename}`;

    const rulesPayload: Record<string, string> = {};
    rules.forEach((rule) => {
      rulesPayload[rule.name] = rule.logic;
    });

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
      const response = await fetch("https://api.veriton.ai/api/service2/api/v1/business-rules/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === "job_submitted") {
        setJobInfo({
          correlation_id: result.correlation_id,
          databricks_run_id: result.databricks_run_id,
          message: result.message,
        });
        // toast.success("Business rules processing job submitted successfully!", {
        //   action: closeToastButton,
        // });
         
        toast({
  title: "Success",
  description: "Business rules processing job submitted successfully!",
  action: closeToastButton,
});

      } else {
        throw new Error(result.message || "Unexpected response");
      }
    } catch (error: any) {
      // toast.error(error.message || "Failed to submit business rules job", {
      //   action: closeToastButton,
      // });
      toast({
  title: "Error",
  description: error.message || "Failed to submit business rules job",
  variant: "destructive",
  action: closeToastButton,
});

      setJobInfo(null);
    } finally {
      setValidating(false);
      setTimeout(() => {
        setShowValidationDialog(false);
        setShowCompleteDialog(true);
      }, 1200);
    }
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
              {workflowStep === "dataset-preview" && "Preview your dataset"}
              {workflowStep === "action-choice" && "Choose your next action"}
              {workflowStep === "business-rules" && "Apply business logic rules to your data"}
            </p>
          </div>
          {workflowStep === "selection" && (
            <Button onClick={() => navigate("/workflow/data-creation")}>
              <Plus className="h-4 w-4 mr-2" />
              Create Dataset
            </Button>
          )}
          {workflowStep === "build-dataset" && (
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  if (selectedTables.length > 0) {
                    handlePreviewSelectedTable();
                  } else {
                    toast({
                      title: "No Table Selected",
                      description: "Select a table first to preview",
                      variant: "destructive",
                      action: closeToastButton,
                    });
                  }
                }}
                disabled={isPreviewLoading}
              >
                {isPreviewLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Preview...
                  </>
                ) : (
                  <>
                    Next: Preview Selected Dataset
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {customTables.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="max-w-2xl text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Code2 className="h-10 w-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">No Tables Created Yet</h2>
              <p className="text-muted-foreground text-lg">
                Create custom tables in the Data Creation screen to see them here for ETL processing.
              </p>
              <Button size="lg" onClick={() => navigate("/workflow/data-creation")} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Go to Create Dataset
              </Button>
            </div>
            <div className="absolute bottom-6 left-16 xs:bottom-3 sm:bottom-6 sm:left-16">
              <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Path Selection
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Selection Step */}
            {workflowStep === "selection" && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">Select Data Source</h2>
                  <span className="text-sm text-muted-foreground">
                    {customTables.length} files available
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {customTables.map((table) => (
                    <div
                      key={table.name}
                      onClick={() => toggleTableSelection(table.name)}
                      className={`
                        relative rounded-xl border p-6 cursor-pointer transition-all
                        ${selectedTables.includes(table.name)
                          ? "border-cyan-500 bg-cyan-500/5"
                          : "border-border bg-card hover:border-cyan-500/50 hover:bg-muted/20"}
                      `}
                    >
                      <div className="absolute top-5 right-5">
                        <div
                          className={`
                            w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                            ${selectedTables.includes(table.name)
                              ? "border-cyan-500 bg-cyan-500"
                              : "border-muted-foreground"}
                          `}
                        >
                          {selectedTables.includes(table.name) && (
                            <div className="w-2 h-2 rounded-full bg-background" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                            p-3 rounded-lg
                            ${table.name.includes("marketing") ? "bg-amber-500/20" : "bg-cyan-500/20"}
                          `}
                        >
                          <FileText
                            className={`
                              h-6 w-6
                              ${table.name.includes("marketing") ? "text-amber-400" : "text-cyan-400"}
                            `}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{table.name}</h3>
                          {/* <p className="text-sm text-muted-foreground mt-1">{table.createdAt}</p> */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-6">
                  <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Path Selection
                  </Button>

                  {selectedTables.length > 0 && (
                    <Button onClick={handleCreateJob} size="lg">
                      <Play className="h-4 w-4 mr-2" />
                      Next: Build Dataset ({selectedTables.length})
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Build Dataset Step */}
            {workflowStep === "build-dataset" && (
              <div className="space-y-6">
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

                <div className="grid grid-cols-[350px,1fr] gap-6">
                  {/* Left: Available Columns */}
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
                            {!collapsedTables[table.name] && (
                              <div>
                                {table.columns.map((column) => (
                                  <div
                                    key={`${table.name}-${column.name}`}
                                    draggable
                                    onDragStart={() => handleDragStart({ ...column, table: table.name })}
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
                    <div>
                      <div className="top-20 flex mt-20">
                        <Button variant="outline" onClick={handleBack}>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Back
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Right: Your Custom Dataset */}
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Your Custom Dataset
                    </h2>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Dataset Name</label>
                      <Input
                        value={customDatasetName}
                        onChange={(e) => setCustomDatasetName(e.target.value)}
                        placeholder="Enter dataset name"
                        className="bg-card border-border"
                      />
                    </div>

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

                    <div className="flex justify-between">
                      <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                          variant="default"
                          size="lg"
                          className="bg-purple-600 hover:bg-purple-700 text-white flex-1"
                          disabled={selectedColumns.length === 0 || isBuilding}
                          onClick={handleSaveDataset}
                        >
                          {isBuilding ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Custom Dataset
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dataset Preview Step */}
            {workflowStep === "dataset-preview" && (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-foreground">
                        <span className="font-semibold">Dataset: </span>
                        <span className="text-primary text-lg">
                          {builtDataset ? builtDataset.name : (selectedTables[0] || "No dataset selected")}
                        </span>
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {builtDataset?.columns.length || 0} columns •{" "}
                        {fullPreviewData.length} preview rows
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setShowFullPreview(true)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Preview
                    </Button>
                  </div>
                </div>

                {isPreviewLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : fullPreviewData.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    {/* No preview data available */}
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden">
                    {/* Preview table content remains unchanged */}
                  </div>
                )}

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

            {/* Action Choice Step */}
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
                  <div
                    className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setShowScheduleDialog(true)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Schedule Job</h4>
                        <p className="text-sm text-muted-foreground">Run this ETL job on a schedule</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Set up automated runs for your dataset. Choose frequency and timing.
                    </p>
                  </div>

                  <div
                    className="border border-border rounded-lg p-6 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
                    onClick={() => setWorkflowStep("business-rules")}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Settings2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Apply Business Rules</h4>
                        <p className="text-sm text-muted-foreground">Add validation & logic</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Define business rules to validate and transform your data.
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

            {/* Business Rules Step */}
            {workflowStep === "business-rules" && (
              <div className="space-y-6">
                <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm text-foreground">
                    <span className="font-semibold">Working with: </span>
                    <span className="text-primary">{builtDataset?.name}</span>
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
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run All Rules
                      </>
                    )}
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
                        <div key={index} className="border border-border rounded-lg p-4 bg-background">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-foreground">{rule.name}</h3>
                              <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-500/10 text-yellow-500">
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
                          <div className="bg-muted/50 rounded-lg p-3">
                            <pre className="text-sm text-foreground font-mono">{rule.logic}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-start">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            )}
          </>
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

        {/* Full Preview Dialog */}
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
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold">Schedule Job</DialogTitle>
              <p className="text-muted-foreground mt-1">
                Configure how and when your job should run.
              </p>
            </DialogHeader>

            <div className="space-y-6">
              {/* Job Name */}
              <div className="space-y-2">
                <Label>Job Name</Label>
                <Input
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  placeholder="Enter job name"
                  className="bg-muted/40 rounded-lg"
                />
              </div>

              {/* Trigger Type */}
              <div className="mb-6 space-y-3">
                <Label>Trigger Type</Label>
                <RadioGroup
                  value={triggerType}
                  onValueChange={(value) => setTriggerType(value as "schedule" | "file")}
                  className="grid grid-cols-1 gap-3"
                >
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition">
                    <RadioGroupItem value="schedule" id="schedule" />
                    <Label htmlFor="schedule" className="flex items-center gap-2 cursor-pointer">
                      <Clock className="w-4 h-4" /> Time-based Schedule
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Schedule Fields */}
              {triggerType === "schedule" && (
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select value={frequency} onValueChange={setFrequency}>
                      <SelectTrigger className="rounded-lg bg-muted/40">
                        <SelectValue placeholder="Select" />
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
                    <div className="relative">
                      <Input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="rounded-lg bg-muted/40 pr-10"
                      />
                      <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  variant="outline"
                  className="flex-1 rounded-lg"
                  onClick={() => setShowScheduleDialog(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  className="flex-1 rounded-lg"
                  onClick={scheduleJob}
                  disabled={loading}
                >
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