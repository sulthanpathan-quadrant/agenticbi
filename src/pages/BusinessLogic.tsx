import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import {
  Code,
  AlertTriangle,
  CheckCircle,
  Play,
  Plus,
  FileText,
  ArrowLeft,
  ArrowRight,
  SkipForward,
  Download,
  Edit,
  Trash,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
 
interface Rule {
  name: string;
  description: string;
  logic: string;
  status: string;
}
 
interface ValidationResult {
  passed_rules: number;
  failed_rules: number;
  details: Record<string, { passed_count: number; failed_count: number }>;
}
 
interface Dataset {
  filename: string;
  last_modified: string;
}
 
export default function BusinessLogic() {
  const navigate = useNavigate();
 
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [validating, setValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
 
  // Dynamic datasets from API
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);
 
  // Get dynamic userId and jobId from localStorage
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const jobId = localStorage.getItem("current_job_id");
 
  // Fetch available datasets on mount
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information. Please log in again.");
      setLoadingDatasets(false);
      return;
    }
 
    const fetchDatasets = async () => {
      setLoadingDatasets(true);
      try {
        const url = `https://20.81.213.147/list-datasets?user_id=${userId}&job_id=${jobId}`;
 
        const res = await fetch(url, {
          headers: {
            accept: "application/json",
          },
        });
 
        if (!res.ok) {
          throw new Error(`Failed to load datasets: ${res.status}`);
        }
 
        const data = await res.json();
 
        if (data.datasets && Array.isArray(data.datasets)) {
          setDatasets(data.datasets);
        } else {
          setDatasets([]);
          toast.info(data.message || "No datasets available");
        }
      } catch (err) {
        console.error("Error fetching datasets:", err);
        toast.error("Could not load available datasets");
      } finally {
        setLoadingDatasets(false);
      }
    };
 
    fetchDatasets();
  }, [userId, jobId]);
 
  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };
 
  const handleAddRule = (rule: any) => {
    if (editingRule !== null) {
      const updatedRules = [...rules];
      updatedRules[editingRule] = { ...rule, status: "testing" };
      setRules(updatedRules);
      setEditingRule(null);
      toast.success("Rule Updated Successfully");
    } else {
      setRules([...rules, { ...rule, status: "testing" }]);
      toast.success("Rule Added Successfully");
    }
    setShowAddRuleDialog(false);
  };
 
  const handleEditRule = (index: number) => {
    setEditingRule(index);
    setShowAddRuleDialog(true);
  };
 
  const handleDeleteRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
    toast.success("Rule Deleted Successfully");
  };
 
  const handleDownloadCSV = () => {
    const csvContent = [
      ["Rule Name", "Description", "Logic", "Status"],
      ...rules.map((rule) => [rule.name, rule.description, rule.logic, rule.status]),
    ]
      .map((row) => row.join(","))
      .join("\n");
 
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business_rules.csv";
    a.click();
    window.URL.revokeObjectURL(url);
 
    toast.success("Business rules exported to CSV");
  };
 
  const handleRunAllRules = async () => {
    if (rules.length === 0) {
      toast.error("No rules to run");
      return;
    }
 
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }
 
    const selectedFile = selectedFiles[0]; // backend expects filename (no .csv needed?)
 
    setValidating(true);
    setShowValidationDialog(true);
    setValidationResult(null);
 
    const rulesPayload: Record<string, string> = {};
    rules.forEach((rule, index) => {
      rulesPayload[`rule${index + 1}`] = rule.description;
    });
 
    const payload = {
      input_type: "azure",
      azure_blob_path: selectedFile,
      rules: rulesPayload,
    };
 
    try {
      const response = await fetch("https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/invoke-bl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
 
      const result = await response.json();
 
      if (response.ok && result.body) {
        const body = result.body;
        setValidationResult({
          passed_rules: body.passed_rules || 0,
          failed_rules: body.failed_rules || 0,
          details: body.details || {},
        });
        toast.success("Business rules validation completed!");
      } else {
        throw new Error(result.detail || "Validation failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to run business rules");
      setValidationResult(null);
    } finally {
      setValidating(false);
      setTimeout(() => {
        setShowValidationDialog(false);
        setShowCompleteDialog(true);
      }, 1000);
    }
  };
 
  const stats = {
    activeRules: rules.filter((r) => r.status === "active").length,
    testing: rules.filter((r) => r.status === "testing").length,
    totalRules: rules.length,
    successRate: validationResult
      ? `${Math.round(
          (validationResult.passed_rules /
            (validationResult.passed_rules + validationResult.failed_rules || 1)) *
            100
        )}%`
      : "N/A",
  };
 
  const canRunRules = rules.length > 0 && selectedFiles.length > 0;
 
  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Business Logic Rules
            </h1>
            <p className="text-muted-foreground">
              Define and manage custom business rules for data processing and validation
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadCSV} disabled={rules.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleRunAllRules}
              disabled={!canRunRules || validating}
            >
              {validating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run All Rules
                </>
              )}
            </Button>
            <Button onClick={() => { setEditingRule(null); setShowAddRuleDialog(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Rule
            </Button>
          </div>
        </div>
 
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Rules</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.activeRules}</div>
          </div>
 
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Testing</span>
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.testing}</div>
          </div>
 
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Rules</span>
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.totalRules}</div>
          </div>
 
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Success Rate</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.successRate}</div>
          </div>
        </div>
 
        {/* File Selection – now dynamic */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">
              Select a file to apply rules
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Datasets available from your current job/ingestion.
          </p>
 
          <div className="border border-border rounded-lg overflow-hidden min-h-[200px]">
            {loadingDatasets ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading available datasets...</p>
              </div>
            ) : datasets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No datasets available
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Complete previous steps or check job configuration
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b border-border">
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="font-medium">File Name</TableHead>
                    <TableHead className="font-medium">Last Modified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasets.map((file) => {
                    const isSelected = selectedFiles.includes(file.filename);
                    return (
                      <TableRow
                        key={file.filename}
                        className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => toggleFileSelection(file.filename)}
                      >
                        <TableCell>
                          <Checkbox checked={isSelected} />
                        </TableCell>
                        <TableCell className="font-medium">{file.filename}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {file.last_modified}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
 
        {/* Rules List */}
        <div className="border border-border rounded-lg p-6 bg-card mb-6">
          {rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-lg">
              <Code className="h-12 w-12 text-muted-foreground mb-4" />
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
 
        {/* Bottom Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/workflow/ner")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip
            </Button>
            <Button onClick={() => navigate("/workflow/path-selection")}>
              Continue to Path Selection
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
 
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
        progress={validating ? 75 : 100}
        rulesCount={rules.length}
      />
 
      <BusinessRuleCompleteDialog
        open={showCompleteDialog}
        onOpenChange={setShowCompleteDialog}
        onContinue={() => navigate("/workflow/path-selection")}
      />
    </WorkflowLayout>
  );
}
 