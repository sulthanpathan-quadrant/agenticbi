import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Cloud, Snowflake, FileText, FolderOpen, X, FileSpreadsheet, Table, Upload, ArrowLeft } from "lucide-react";
import { FilePickerDialog } from "@/components/FilePickerDialog";
import { SchemaPreviewDialog } from "@/components/SchemaPreviewDialog";
import { DatabaseConnectionDialog } from "@/components/DatabaseConnectionDialog";
import { SourceCredentialDialog } from "@/components/SourceCredentialDialog";
import { toast } from "sonner";
import { S3Credentials, AzureCredentials, OneLakeCredentials, DatabricksCredentials, SnowflakeCredentials} from "@/components/api/api";

interface SelectedItem {
  id: string;
  name: string;
  source: string;
  size: string;
  rows: string;
  icon: "file" | "table" | "folder";
}

const sources = [
  { id: "s3", name: "S3", description: "Cloud Storage", icon: Database, requiresCredentials: true },
  { id: "azure", name: "Azure Blob", description: "Cloud Storage", icon: Cloud, requiresCredentials: true },
  { id: "snowflake", name: "Snowflake", description: "Database", icon: Snowflake, requiresCredentials: true },
  { id: "sap", name: "SAP", description: "Database", icon: Database, requiresCredentials: true },
  { id: "databases", name: "Databases", description: "Generic SQL", icon: Database, requiresCredentials: false },
  { id: "onelake", name: "OneLake", description: "Microsoft Fabric", icon: Database, requiresCredentials: true },
  { id: "databricks", name: "Databricks", description: "Delta Lake", icon: Table, requiresCredentials: true },
  { id: "local", name: "Local files", description: "Upload", icon: Upload, requiresCredentials: false },
];

const sourceFiles: Record<string, Array<{ id: string; name: string; size: string; rows: string }>> = {
  s3: [],
  azure: [],
  snowflake: [],
  sap: [],
  databases: [],
  onelake: [],
  delta: [],
  local: [],
};



export default function DataIngestion() {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([ ]);

  const [filePickerOpen, setFilePickerOpen] = useState(false);
  const [currentSource, setCurrentSource] = useState<string>("");
  const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
  const [previewFileName, setPreviewFileName] = useState("");
  const [databaseDialogOpen, setDatabaseDialogOpen] = useState(false);
  const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [pendingSourceId, setPendingSourceId] = useState<string>("");
  const [s3Credentials, setS3Credentials] = useState<S3Credentials | null>(null);
  const [azureCredentials, setAzureCredentials] = useState<AzureCredentials | null>(null);
  const [oneLakeCredentials, setOneLakeCredentials] = useState<OneLakeCredentials | null>(null);
  const [databricksCredentials, setDatabricksCredentials] = useState<DatabricksCredentials | null>(null);
  const [snowflakeCredentials, setSnowflakeCredentials] = useState<SnowflakeCredentials | null>(null);

  const removeItem = (id: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== id));
  };

  const getItemIcon = (iconType: string) => {
    switch (iconType) {
      case "file":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "table":
        return <Table className="h-5 w-5 text-blue-500" />;
      case "folder":
        return <FolderOpen className="h-5 w-5 text-yellow-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const handleProceed = () => {
    navigate("/workflow/landing-zone");
  };

  const openFilePicker = (sourceId: string) => {
    const source = sources.find(s => s.id === sourceId);

    if (sourceId === "local") {
      const input = document.createElement("input");
      input.type = "file";
      input.multiple = true;
      input.accept = ".csv,.xlsx,.json,.parquet";
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        if (files) {
          const newItems: SelectedItem[] = Array.from(files).map((file, idx) => ({
            id: `local-${Date.now()}-${idx}`,
            name: file.name,
            source: "Local File",
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            rows: "Calculating...",
            icon: "file"
          }));
          setSelectedItems([...selectedItems, ...newItems]);
        }
      };
      input.click();
    } else if (sourceId === "databases") {
      setDatabaseDialogOpen(true);
    } else if (source?.requiresCredentials) {
      setPendingSourceId(sourceId);
      setCredentialDialogOpen(true);
    } else {
      setCurrentSource(sourceId);
      setFilePickerOpen(true);
    }
  };
  const handleCredentialProceed = (credentials: S3Credentials | AzureCredentials | OneLakeCredentials | DatabricksCredentials | SnowflakeCredentials) => {
    if (pendingSourceId === "s3") {
      setS3Credentials(credentials as S3Credentials);
    } else if (pendingSourceId === "azure") {
      setAzureCredentials(credentials as AzureCredentials);
    } else if (pendingSourceId === "onelake") {
      setOneLakeCredentials(credentials as OneLakeCredentials);
    } else if (pendingSourceId === "databricks") {
      setDatabricksCredentials(credentials as DatabricksCredentials);
    }
    else if (pendingSourceId === "snowflake") {  // ADD
      setSnowflakeCredentials(credentials as SnowflakeCredentials);
    }
    setCurrentSource(pendingSourceId);
    setFilePickerOpen(true);
  };

   const handleDatabaseConnect = (config: {
      server: string;
      database: string;
      username: string;
      selectedTables: string[];
    }) => {
      const newItems: SelectedItem[] = config.selectedTables.map((table) => ({
        id: `db-${config.database}-${table}`,
        name: table,
        source: "Database",
        size: "N/A",
        rows: "N/A",
        icon: "table",
      }));

      setSelectedItems((prev) => [...prev, ...newItems]);
    };

 const handleFileSelection = (files: Array<{ id: string; name: string; size: string; rows: string }>) => {
  const newItems: SelectedItem[] = files.map(file => {
    let icon: "file" | "table" | "folder" = "file";
    
    // Determine icon based on source type and file characteristics
    if (currentSource === "snowflake" || currentSource === "databricks") {
      icon = "table";
    } else if (currentSource === "databases" || file.name.includes("dbo.")) {
      icon = "table";
    } else if (file.name.endsWith(".parquet")) {
      icon = "folder";
    } else if (file.rows === "Table" || file.size.includes("Table")) {
      icon = "table";
    }
    
    return {
      id: file.id,
      name: file.name,
      source: sources.find(s => s.id === currentSource)?.name || "Unknown",
      size: file.size,
      rows: file.rows,
      icon: icon
    };
  });
  setSelectedItems([...selectedItems, ...newItems]);
};

  const openSchemaPreview = (fileName: string) => {
    setPreviewFileName(fileName);
    setSchemaPreviewOpen(true);
  };

  return (
    <WorkflowLayout>
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Data Ingestion</h1>
            <p className="text-muted-foreground">
              Connect to your sources and select the files or tables you want to process.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </div>

        {/* Select a Source */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">Select a Source</h2>
          <div className="grid grid-cols-4 gap-4">
            {sources.map((source) => {
              const IconComponent = source.icon;
              return (
                <Card
                  key={source.id}
                  className="p-6 cursor-pointer transition-colors border border-border hover:bg-accent/30 group"
                  onClick={() => openFilePicker(source.id)}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-12 h-12 rounded-lg bg-card-hover border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                      <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{source.name}</p>
                      <p className="text-xs text-muted-foreground">{source.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Selected Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-6">Selected Items</h2>
          <div className="space-y-3">
            {selectedItems.map((item) => (
              <Card key={item.id} className="p-4 border border-border hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {getItemIcon(item.icon)}
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item.name.split('/').pop()}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.source}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleProceed}
            size="lg"
            className="px-8"
          >
            Ingest / Proceed
          </Button>
        </div>

        {/* Dialogs */}
        <SourceCredentialDialog
          open={credentialDialogOpen}
          onOpenChange={setCredentialDialogOpen}
          sourceName={sources.find(s => s.id === pendingSourceId)?.name || ""}
          sourceId={pendingSourceId}
          onProceed={handleCredentialProceed}
        />

        <FilePickerDialog
          open={filePickerOpen}
          onOpenChange={setFilePickerOpen}
          sourceName={sources.find(s => s.id === currentSource)?.name || ""}
          files={sourceFiles[currentSource] || []}
          onSelect={handleFileSelection}
          s3Credentials={s3Credentials}
          isS3={currentSource === "s3"}
          azureCredentials={azureCredentials}
          oneLakeCredentials={oneLakeCredentials}
          databricksCredentials={databricksCredentials}
          snowflakeCredentials={snowflakeCredentials}
          isAzure={currentSource === "azure"}
          isOneLake={currentSource === "onelake"}
          isDatabricks={currentSource === "databricks"}
          isSnowflake={currentSource === "snowflake"}

        />

        <SchemaPreviewDialog
          open={schemaPreviewOpen}
          onOpenChange={setSchemaPreviewOpen}
          fileName={previewFileName}
        />

        <DatabaseConnectionDialog
          open={databaseDialogOpen}
          onOpenChange={setDatabaseDialogOpen}
          onConnect={handleDatabaseConnect}
        />
      </div>
    </WorkflowLayout>
  );
}
