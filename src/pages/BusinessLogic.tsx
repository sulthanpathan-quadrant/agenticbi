import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Code, AlertTriangle, CheckCircle, Play, Plus, FileText, ArrowLeft, ArrowRight, SkipForward, Download, Edit, Trash } from "lucide-react";
import { AddBusinessRuleDialog } from "@/components/AddBusinessRuleDialog";
import { BusinessRuleValidationDialog } from "@/components/BusinessRuleValidationDialog";
import { BusinessRuleCompleteDialog } from "@/components/BusinessRuleCompleteDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

export default function BusinessLogic() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<string[]>(["Sales_Q3.csv"]);
  const [showAddRuleDialog, setShowAddRuleDialog] = useState(false);
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationProgress, setValidationProgress] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const [editingRule, setEditingRule] = useState<number | null>(null);

  // Load custom created tables from Data Creation
  const [files, setFiles] = useState<Array<{name: string; source: string; size: string; rows: string}>>([]);

  useEffect(() => {
    const customTables = localStorage.getItem("customCreatedTables");
    if (customTables) {
      const tables = JSON.parse(customTables);
      const customFiles = tables.map((table: any) => ({
        name: `${table.name}.csv`,
        source: "Data Creation",
        size: "N/A",
        rows: "N/A",
      }));
      setFiles(customFiles);
    }
  }, []);

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
    } else {
      setRules([...rules, { ...rule, status: "testing" }]);
    }
    setShowAddRuleDialog(false);
    toast({
      title: editingRule !== null ? "Rule Updated" : "Rule Added",
      description: `Business rule has been ${editingRule !== null ? 'updated' : 'added'} successfully`,
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

  const handleDownloadCSV = () => {
    const csvContent = [
      ["Rule Name", "Description", "Logic", "Status"],
      ...rules.map(rule => [rule.name, rule.description, rule.logic, rule.status])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "business_rules.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Downloaded",
      description: "Business rules exported to CSV",
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

  const stats = {
    activeRules: rules.filter((r) => r.status === "active").length,
    testing: rules.filter((r) => r.status === "testing").length,
    totalRules: rules.length,
    successRate: rules.length > 0 ? "N/A" : "N/A",
  };

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
            <Button variant="outline" onClick={handleRunAllRules} disabled={rules.length === 0}>
              <Play className="h-4 w-4 mr-2" />
              Run All Rules
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

        {/* File Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Select a file to apply rules</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Files ingested from your connected data sources.
          </p>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">File Name</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Size</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Rows</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.name}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => toggleFileSelection(file.name)}
                  >
                    <td className="p-4">
                      <Checkbox
                        checked={selectedFiles.includes(file.name)}
                        onCheckedChange={() => toggleFileSelection(file.name)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">{file.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{file.source}</td>
                    <td className="p-4 text-sm text-muted-foreground">{file.size}</td>
                    <td className="p-4 text-sm text-muted-foreground">{file.rows}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        progress={validationProgress}
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
