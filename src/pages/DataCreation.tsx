import { useState, useEffect } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Plus, Trash2, Save, Table as TableIcon, ChevronDown, ChevronUp, History, LayoutGrid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
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

export default function DataCreation() {
  const navigate = useNavigate();
  const [customTableName, setCustomTableName] = useState("custom_dataset");
  const [customColumns, setCustomColumns] = useState<Column[]>([]);
  const [draggedColumn, setDraggedColumn] = useState<Column | null>(null);
  const [collapsedTables, setCollapsedTables] = useState<Record<string, boolean>>({});
  const [savedTables, setSavedTables] = useState<CustomTable[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("customCreatedTables");
    if (stored) {
      setSavedTables(JSON.parse(stored));
    }
  }, []);

  // Sample table data from Data Preview
  const tables = {
    fact_sales: {
      type: "FACT",
      columns: [
        { name: "sale_id", type: "INTEGER" },
        { name: "customer_id", type: "INTEGER" },
        { name: "product_id", type: "INTEGER" },
        { name: "region_id", type: "INTEGER" },
        { name: "sale_amount", type: "DECIMAL" },
        { name: "sale_date", type: "DATE" },
      ],
    },
    dim_customer: {
      type: "DIM",
      columns: [
        { name: "customer_id", type: "INTEGER" },
        { name: "name", type: "VARCHAR" },
        { name: "email", type: "VARCHAR" },
        { name: "city", type: "VARCHAR" },
        { name: "country", type: "VARCHAR" },
      ],
    },
    dim_product: {
      type: "DIM",
      columns: [
        { name: "product_id", type: "INTEGER" },
        { name: "name", type: "VARCHAR" },
        { name: "category", type: "VARCHAR" },
        { name: "price", type: "DECIMAL" },
        { name: "stock", type: "INTEGER" },
      ],
    },
    dim_region: {
      type: "DIM",
      columns: [
        { name: "region_id", type: "INTEGER" },
        { name: "country", type: "VARCHAR" },
        { name: "state", type: "VARCHAR" },
        { name: "region_name", type: "VARCHAR" },
      ],
    },
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
      const exists = customColumns.some(
        (col) => col.name === draggedColumn.name && col.table === draggedColumn.table
      );
      if (!exists) {
        setCustomColumns([...customColumns, draggedColumn]);
        toast({
          title: "Column Added",
          description: `${draggedColumn.name} from ${draggedColumn.table} added to custom dataset`,
          duration: 1000,
        });
      }
    }
    setDraggedColumn(null);
  };

  const handleRemoveColumn = (index: number) => {
    setCustomColumns(customColumns.filter((_, i) => i !== index));
  };

  const handleAddColumn = (column: Column) => {
    const exists = customColumns.some(
      (col) => col.name === column.name && col.table === column.table
    );
    if (!exists) {
      setCustomColumns([...customColumns, column]);
      toast({
        title: "Column Added",
        description: `${column.name} from ${column.table} added to custom dataset`,
        duration: 1000,
      });
    }
  };

  const toggleTableCollapse = (tableName: string) => {
    setCollapsedTables((prev) => ({
      ...prev,
      [tableName]: !prev[tableName],
    }));
  };

  const handleSaveCustomTable = () => {
    if (customColumns.length === 0) {
      toast({
        title: "No Columns Selected",
        description: "Please add at least one column to your custom dataset",
        variant: "destructive",
      });
      return;
    }

    const newTable: CustomTable = {
      name: customTableName,
      columns: customColumns,
      createdAt: new Date().toLocaleDateString(),
    };

    const updatedTables = [...savedTables, newTable];
    setSavedTables(updatedTables);
    localStorage.setItem("customCreatedTables", JSON.stringify(updatedTables));

    toast({
      title: "Dataset Created Successfully",
      description: `${customTableName} has been created with ${customColumns.length} columns`,
    });

    setCustomTableName("custom_dataset");
    setCustomColumns([]);
  };

  const handleDeleteSavedTable = (index: number) => {
    const updatedTables = savedTables.filter((_, i) => i !== index);
    setSavedTables(updatedTables);
    localStorage.setItem("customCreatedTables", JSON.stringify(updatedTables));
    
    toast({
      title: "Dataset Deleted",
      description: "Custom dataset has been removed",
    });
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Create Dataset</h1>
            <p className="text-muted-foreground">
              Build your custom dataset by selecting columns
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            History
            {savedTables.length > 0 && (
              <Badge variant="secondary" className="ml-1 bg-primary text-primary-foreground rounded-full h-5 w-5 p-0 flex items-center justify-center text-xs">
                {savedTables.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-[350px,1fr] gap-6">
          {/* Left Side - Available Tables */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TableIcon className="h-5 w-5" />
              Available Tables
            </h2>

            <ScrollArea className="h-[calc(100vh-150px)] pr-2">
              <div className="space-y-3">
                {Object.entries(tables).map(([tableName, tableData]) => (
                  <div key={tableName} className="border border-border rounded-lg bg-card/50 overflow-hidden">
                    {/* Table Header */}
                    <div 
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30 transition-colors border-b border-border"
                      onClick={() => toggleTableCollapse(tableName)}
                    >
                      <div className="flex items-center gap-2">
                        <TableIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">{tableName}</span>
                        {collapsedTables[tableName] ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <Badge
                        className={`text-xs font-semibold ${
                          tableData.type === "FACT" 
                            ? "bg-orange-500 text-white border-orange-500" 
                            : "bg-purple-500 text-white border-purple-500"
                        }`}
                      >
                        {tableData.type}
                      </Badge>
                    </div>

                    {/* Columns - No extra padding/spacing */}
                    {!collapsedTables[tableName] && (
                      <div>
                        {tableData.columns.map((column) => (
                          <div
                            key={column.name}
                            draggable
                            onDragStart={() =>
                              handleDragStart({ ...column, table: tableName })
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
                                handleAddColumn({ ...column, table: tableName });
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

          {/* Right Side - Custom Dataset Builder */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Your Custom Dataset
            </h2>

            {/* Dataset Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Dataset Name</label>
              <Input
                value={customTableName}
                onChange={(e) => setCustomTableName(e.target.value)}
                placeholder="Enter dataset name"
                className="bg-card border-border"
              />
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border border-dashed border-border rounded-lg bg-card/50 min-h-[350px] flex flex-col"
            >
              {customColumns.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <LayoutGrid className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Drop columns here
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drag from left or click plus
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-2">
                  {customColumns.map((column, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
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
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSaveCustomTable}
              disabled={customColumns.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Custom Dataset
            </Button>
          </div>
        </div>

        {/* Saved Datasets Section */}
        {(showHistory || savedTables.length > 0) && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-3 mb-4">
              <TableIcon className="h-5 w-5 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Your Saved Custom Datasets</h3>
              {savedTables.length > 0 && (
                <Badge variant="secondary" className="rounded-full">
                  {savedTables.length}
                </Badge>
              )}
            </div>
            
            {savedTables.length === 0 ? (
              <p className="text-muted-foreground">No saved datasets yet.</p>
            ) : (
              <div className="space-y-3">
                {savedTables.map((table, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TableIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">{table.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {table.columns.length} columns • {table.createdAt}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSavedTable(index)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/workflow/data-preview")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Data Preview
          </Button>
          <Button onClick={() => navigate("/workflow/data-quality")} className="bg-primary hover:bg-primary/90">
            Next: Data Quality
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
