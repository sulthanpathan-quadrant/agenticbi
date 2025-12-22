// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Database, Cloud, Snowflake, FileText, FolderOpen, X, FileSpreadsheet, Table, Upload, ArrowLeft } from "lucide-react";
// import { FilePickerDialog } from "@/components/FilePickerDialog";
// import { SchemaPreviewDialog } from "@/components/SchemaPreviewDialog";
// import { DatabaseConnectionDialog } from "@/components/DatabaseConnectionDialog";
// import { SourceCredentialDialog } from "@/components/SourceCredentialDialog";
// import { toast } from "sonner";
// import { S3Credentials, AzureCredentials, OneLakeCredentials, DatabricksCredentials, SnowflakeCredentials} from "@/components/api/api";

// interface SelectedItem {
//   id: string;
//   name: string;
//   source: string;
//   size: string;
//   rows: string;
//   icon: "file" | "table" | "folder";
// }

// const sources = [
//   { id: "s3", name: "S3", description: "Cloud Storage", icon: Database, requiresCredentials: true },
//   { id: "azure", name: "Azure Blob", description: "Cloud Storage", icon: Cloud, requiresCredentials: true },
//   { id: "snowflake", name: "Snowflake", description: "Database", icon: Snowflake, requiresCredentials: true },
//   { id: "sap", name: "SAP", description: "Database", icon: Database, requiresCredentials: true },
//   { id: "databases", name: "Databases", description: "Generic SQL", icon: Database, requiresCredentials: false },
//   { id: "onelake", name: "OneLake", description: "Microsoft Fabric", icon: Database, requiresCredentials: true },
//   { id: "databricks", name: "Databricks", description: "Delta Lake", icon: Table, requiresCredentials: true },
//   { id: "local", name: "Local files", description: "Upload", icon: Upload, requiresCredentials: false },
// ];

// const sourceFiles: Record<string, Array<{ id: string; name: string; size: string; rows: string }>> = {
//   s3: [],
//   azure: [],
//   snowflake: [],
//   sap: [],
//   databases: [],
//   onelake: [],
//   delta: [],
//   local: [],
// };



// export default function DataIngestion() {
//   const navigate = useNavigate();

//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([ ]);

//   const [filePickerOpen, setFilePickerOpen] = useState(false);
//   const [currentSource, setCurrentSource] = useState<string>("");
//   const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
//   const [previewFileName, setPreviewFileName] = useState("");
//   const [databaseDialogOpen, setDatabaseDialogOpen] = useState(false);
//   const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
//   const [pendingSourceId, setPendingSourceId] = useState<string>("");
//   const [s3Credentials, setS3Credentials] = useState<S3Credentials | null>(null);
//   const [azureCredentials, setAzureCredentials] = useState<AzureCredentials | null>(null);
//   const [oneLakeCredentials, setOneLakeCredentials] = useState<OneLakeCredentials | null>(null);
//   const [databricksCredentials, setDatabricksCredentials] = useState<DatabricksCredentials | null>(null);
//   const [snowflakeCredentials, setSnowflakeCredentials] = useState<SnowflakeCredentials | null>(null);

//   const removeItem = (id: string) => {
//     setSelectedItems(selectedItems.filter(item => item.id !== id));
//   };

//   const getItemIcon = (iconType: string) => {
//     switch (iconType) {
//       case "file":
//         return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
//       case "table":
//         return <Table className="h-5 w-5 text-blue-500" />;
//       case "folder":
//         return <FolderOpen className="h-5 w-5 text-yellow-500" />;
//       default:
//         return <FileText className="h-5 w-5" />;
//     }
//   };

//   const handleProceed = () => {
//     navigate("/workflow/landing-zone");
//   };

//   const openFilePicker = (sourceId: string) => {
//     const source = sources.find(s => s.id === sourceId);

//     if (sourceId === "local") {
//       const input = document.createElement("input");
//       input.type = "file";
//       input.multiple = true;
//       input.accept = ".csv,.xlsx,.json,.parquet";
//       input.onchange = (e) => {
//         const files = (e.target as HTMLInputElement).files;
//         if (files) {
//           const newItems: SelectedItem[] = Array.from(files).map((file, idx) => ({
//             id: `local-${Date.now()}-${idx}`,
//             name: file.name,
//             source: "Local File",
//             size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
//             rows: "Calculating...",
//             icon: "file"
//           }));
//           setSelectedItems([...selectedItems, ...newItems]);
//         }
//       };
//       input.click();
//     } else if (sourceId === "databases") {
//       setDatabaseDialogOpen(true);
//     } else if (source?.requiresCredentials) {
//       setPendingSourceId(sourceId);
//       setCredentialDialogOpen(true);
//     } else {
//       setCurrentSource(sourceId);
//       setFilePickerOpen(true);
//     }
//   };
//   const handleCredentialProceed = (credentials: S3Credentials | AzureCredentials | OneLakeCredentials | DatabricksCredentials | SnowflakeCredentials) => {
//     if (pendingSourceId === "s3") {
//       setS3Credentials(credentials as S3Credentials);
//     } else if (pendingSourceId === "azure") {
//       setAzureCredentials(credentials as AzureCredentials);
//     } else if (pendingSourceId === "onelake") {
//       setOneLakeCredentials(credentials as OneLakeCredentials);
//     } else if (pendingSourceId === "databricks") {
//       setDatabricksCredentials(credentials as DatabricksCredentials);
//     }
//     else if (pendingSourceId === "snowflake") {  // ADD
//       setSnowflakeCredentials(credentials as SnowflakeCredentials);
//     }
//     setCurrentSource(pendingSourceId);
//     setFilePickerOpen(true);
//   };

//    const handleDatabaseConnect = (config: {
//       server: string;
//       database: string;
//       username: string;
//       selectedTables: string[];
//     }) => {
//       const newItems: SelectedItem[] = config.selectedTables.map((table) => ({
//         id: `db-${config.database}-${table}`,
//         name: table,
//         source: "Database",
//         size: "N/A",
//         rows: "N/A",
//         icon: "table",
//       }));

//       setSelectedItems((prev) => [...prev, ...newItems]);
//     };

//  const handleFileSelection = (files: Array<{ id: string; name: string; size: string; rows: string }>) => {
//   const newItems: SelectedItem[] = files.map(file => {
//     let icon: "file" | "table" | "folder" = "file";
    
//     // Determine icon based on source type and file characteristics
//     if (currentSource === "snowflake" || currentSource === "databricks") {
//       icon = "table";
//     } else if (currentSource === "databases" || file.name.includes("dbo.")) {
//       icon = "table";
//     } else if (file.name.endsWith(".parquet")) {
//       icon = "folder";
//     } else if (file.rows === "Table" || file.size.includes("Table")) {
//       icon = "table";
//     }
    
//     return {
//       id: file.id,
//       name: file.name,
//       source: sources.find(s => s.id === currentSource)?.name || "Unknown",
//       size: file.size,
//       rows: file.rows,
//       icon: icon
//     };
//   });
//   setSelectedItems([...selectedItems, ...newItems]);
// };

//   const openSchemaPreview = (fileName: string) => {
//     setPreviewFileName(fileName);
//     setSchemaPreviewOpen(true);
//   };

//   return (
//     <WorkflowLayout>
//       <div className="p-8 max-w-7xl">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground mb-2">Data Ingestion</h1>
//             <p className="text-muted-foreground">
//               Connect to your sources and select the files or tables you want to process.
//             </p>
//           </div>
//           <Button variant="outline" onClick={() => navigate("/jobs")}>
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Jobs
//           </Button>
//         </div>

//         {/* Select a Source */}
//         <div className="mb-12">
//           <h2 className="text-xl font-semibold text-foreground mb-6">Select a Source</h2>
//           <div className="grid grid-cols-4 gap-4">
//             {sources.map((source) => {
//               const IconComponent = source.icon;
//               return (
//                 <Card
//                   key={source.id}
//                   className="p-6 cursor-pointer transition-colors border border-border hover:bg-accent/30 group"
//                   onClick={() => openFilePicker(source.id)}
//                 >
//                   <div className="flex flex-col items-center text-center space-y-3">
//                     <div className="w-12 h-12 rounded-lg bg-card-hover border border-border flex items-center justify-center group-hover:border-primary transition-colors">
//                       <IconComponent className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
//                     </div>
//                     <div>
//                       <p className="font-medium text-foreground text-sm">{source.name}</p>
//                       <p className="text-xs text-muted-foreground">{source.description}</p>
//                     </div>
//                   </div>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         {/* Selected Items */}
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-foreground mb-6">Selected Items</h2>
//           <div className="space-y-3">
//             {selectedItems.map((item) => (
//               <Card key={item.id} className="p-4 border border-border hover:border-primary/50 transition-colors">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-4 flex-1">
//                     {getItemIcon(item.icon)}
//                     <div className="flex-1">
//                       <p className="font-medium text-foreground">{item.name.split('/').pop()}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {item.source}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeItem(item.id)}
//                       className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Action Button */}
//         <div className="flex justify-end">
//           <Button
//             onClick={handleProceed}
//             size="lg"
//             className="px-8"
//           >
//             Ingest / Proceed
//           </Button>
//         </div>

//         {/* Dialogs */}
//         <SourceCredentialDialog
//           open={credentialDialogOpen}
//           onOpenChange={setCredentialDialogOpen}
//           sourceName={sources.find(s => s.id === pendingSourceId)?.name || ""}
//           sourceId={pendingSourceId}
//           onProceed={handleCredentialProceed}
//         />

//         <FilePickerDialog
//           open={filePickerOpen}
//           onOpenChange={setFilePickerOpen}
//           sourceName={sources.find(s => s.id === currentSource)?.name || ""}
//           files={sourceFiles[currentSource] || []}
//           onSelect={handleFileSelection}
//           s3Credentials={s3Credentials}
//           isS3={currentSource === "s3"}
//           azureCredentials={azureCredentials}
//           oneLakeCredentials={oneLakeCredentials}
//           databricksCredentials={databricksCredentials}
//           snowflakeCredentials={snowflakeCredentials}
//           isAzure={currentSource === "azure"}
//           isOneLake={currentSource === "onelake"}
//           isDatabricks={currentSource === "databricks"}
//           isSnowflake={currentSource === "snowflake"}

//         />

//         <SchemaPreviewDialog
//           open={schemaPreviewOpen}
//           onOpenChange={setSchemaPreviewOpen}
//           fileName={previewFileName}
//         />

//         <DatabaseConnectionDialog
//           open={databaseDialogOpen}
//           onOpenChange={setDatabaseDialogOpen}
//           onConnect={handleDatabaseConnect}
//         />
//       </div>
//     </WorkflowLayout>
//   );
// }

 
import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { S3Credentials, AzureCredentials, OneLakeCredentials, DatabricksCredentials, SnowflakeCredentials } from "@/components/api/api";
 
interface SelectedItem {
  id: string;
  name: string;
  source: string;
  size: string;
  rows: string;
  icon: "file" | "table" | "folder";
  sourceType: string;
  fullPath: string;
}
 
interface UserDetails {
  id: string;
  email: string;
  name: string;
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
 
export default function DataIngestion() {
  const navigate = useNavigate();

 const [isIngesting, setIsIngesting] = useState(false);

  const [userId, setUserId] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
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
 
  // Load user_id and restore selected items from localStorage on mount
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user: UserDetails = JSON.parse(userData);
        setUserId(user.id || "unknown-user");
      } catch (err) {
        console.error("Failed to parse user data:", err);
        setUserId("unknown-user");
      }
    } else {
      toast.error("No user logged in.",{ duration: 1000 });
      setUserId("unknown-user");
    }
 
    const saved = localStorage.getItem("ingestion_sources");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restoredItems: SelectedItem[] = parsed.map((entry: any, index: number) => {
            const sourceType = entry.source_type || "unknown";
            const sourceName = sources.find(s => s.id === sourceType)?.name || sourceType;
 
            let fullPath = "";
            let name = "Unknown File/Table";
 
            if (sourceType === "s3") fullPath = entry.s3path || "";
            else if (sourceType === "blob") fullPath = entry.blobpath || "";
            else if (sourceType === "onelake") fullPath = entry.file_path || "";
            else if (sourceType === "databricks") fullPath = `${entry.catalog}/${entry.schema}/${entry.table}`;
            else if (sourceType === "snowflake") fullPath = `${entry.snowflakeDatabase}/${entry.snowflake_schema}/${entry.snowflake_table}`;
 
            name = fullPath.split("/").pop() || fullPath || "Unknown";
 
            return {
              id: `restored-${index}-${Date.now()}`,
              name,
              source: sourceName,
              size: "N/A",
              rows: "N/A",
              icon: ["snowflake", "databricks", "sqlserver"].includes(sourceType) ? "table" : "file",
              sourceType,
              fullPath
            };
          });
          setSelectedItems(restoredItems);
        }
      } catch (err) {
        console.error("Failed to restore items:", err);
      }
    }
  }, []);
 
  const removeItem = (id: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };
 
  const getItemIcon = (iconType: "file" | "table" | "folder") => {
    switch (iconType) {
      case "file": return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "table": return <Table className="h-5 w-5 text-blue-500" />;
      case "folder": return <FolderOpen className="h-5 w-5 text-yellow-500" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getPipelineWaitTime = () => {
  const uniqueSources = new Set(
    selectedItems.map(item => item.sourceType)
  );
  return uniqueSources.size * 30 * 1000; // 30 sec per datasource
};

 
  const saveSelectionToStorage = (files: any[], credentials: any, sourceType: string) => {
    const existing = JSON.parse(localStorage.getItem("ingestion_sources") || "[]");
 
    const newEntries = files.map(file => {
      const base = { destination_path: userId };
 
      switch (sourceType) {
        case "s3":
          return {
            ...base,
            source_type: "s3",
            // s3path:file.name ,
            s3path:`s3://${file.fullPath}` ,
            s3AccessKey: credentials?.aws_access_key_id,
            s3SecretKey: credentials?.aws_secret_access_key,
            s3ServiceUrl: "https://s3.amazonaws.com"
          };
 
        case "azure":
          return {
            ...base,
            source_type: "blob",
            // blobpath: file.name,
            blobpath: file.fullPath ,
            blobAccountName: credentials?.connection_string?.match(/AccountName=([^;]+)/)?.[1],
            blobAccountKey: credentials?.connection_string?.match(/AccountKey=([^;]+)/)?.[1]
          };
 
        case "onelake":
          return {
            ...base,
            source_type: "onelake",
            // workspace_name: file.name.split("/")[0] || "",
            // lakehouse_name: file.name.split("/")[1] || "",
            workspace_name: credentials?.workspace_name,    // ← important fix
          lakehouse_name: credentials?.lakehouse_name,
            copy_type: "file",
            // file_path: file.name,
             file_path: `Files/${file.fullPath}` ,
            table_name: "anytable",
            client_id: credentials?.client_id,
            client_secret: credentials?.client_secret,
            tenant_id: credentials?.tenant_id
          };
 
        case "databricks":
          return {
            ...base,
            source_type: "databricks",
            databricks_host: credentials?.host,
            warehouse_id: credentials?.warehouse_id,
            access_token: credentials?.access_token,
            // catalog: file.name.split("/")[0] || "",
            // schema: file.name.split("/")[1] || "",
            // table: file.name.split("/")[2] || ""
            catalog: credentials?.catalog,                  // ← important fix
          schema: credentials?.schema,                    // ← important fix
          table: file.fullPath
          };
 
        case "snowflake":
          return {
            ...base,
            source_type: "snowflake",
            // snowflake_schema: file.name.split("/")[1] || "",
            // snowflake_table: file.name.split("/")[2] || "",
            snowflake_schema: credentials?.schema,          // ← important fix
          snowflake_table: file.fullPath,
            snowflakeAccount: credentials?.account_identifier,
            // snowflakeDatabase: file.name.split("/")[0] || "",
            snowflakeDatabase: credentials?.database,
            snowflakeWarehouse: credentials?.warehouse,
            snowflakeUser: credentials?.username,
            snowflakePassword: credentials?.password
          };
 
        default:
          return null;
      }
    }).filter(Boolean);
 
    const updated = [...existing, ...newEntries];
    localStorage.setItem("ingestion_sources", JSON.stringify(updated));
    toast.success(`${files.length} item(s) added and saved!`,{ duration: 1000 });
  };
 
  const handleFileSelection = (
    files: Array<{ id: string; name: string; size: string; rows: string ; fullPath?: string}>,
    credentials?: any
  ) => {
    if (credentials && currentSource && files.length > 0) {
      saveSelectionToStorage(files, credentials, currentSource);
    }
 
    const newItems: SelectedItem[] = files.map(file => {
      let icon: "file" | "table" | "folder" = "file";
      if (["snowflake", "databricks", "databases"].includes(currentSource)) icon = "table";
 
      return {
        id: `${currentSource}-${file.id}-${Date.now()}`,
        name: file.name,
        source: sources.find(s => s.id === currentSource)?.name || "Unknown",
        size: file.size,
        rows: file.rows,
        icon,
        sourceType: currentSource,
        // fullPath: file.name
        fullPath: file.fullPath || file.name
      };
    });
 
    setSelectedItems(prev => [...prev, ...newItems]);
  };
 
const handleProceed = async () => {
  if (!userId || userId === "unknown-user") {
    toast.error("User not authenticated. Please login again.", { duration: 1000 });
    return;
  }

  const payload = localStorage.getItem("ingestion_sources");

  if (!payload || JSON.parse(payload).length === 0) {
    toast.error("No files selected for ingestion", { duration: 1000 });
    return;
  }

  try {
    setIsIngesting(true); // 🔒 lock button

    const response = await fetch(
      `https://4.227.238.34/ingest-now?user_id=${userId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload
      }
    );

    const responseData = await response.json();

    if (!response.ok || !responseData.job_id) {
      throw new Error(responseData.note || "Ingestion failed");
    }

    // ✅ Save job id
    localStorage.setItem("current_job_id", responseData.job_id);

    // ✅ Clear ingestion selection
    localStorage.removeItem("ingestion_sources");
    setSelectedItems([]);

    toast.success("Ingestion started successfully");

    // ✅ IMMEDIATE navigation
    navigate("/workflow/landing-zone");

  } catch (error) {
    console.error("Ingestion API error:", error);
    toast.error("Pipeline trigger failed or server not reachable.", { duration:3000 });
  } finally {
    setIsIngesting(false); // 🔓 unlock button
  }
};


  const openFilePicker = (sourceId: string) => {
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
            icon: "file",
            sourceType: "local",
            fullPath: file.name
          }));
          setSelectedItems(prev => [...prev, ...newItems]);
        }
      };
      input.click();
    } else if (sourceId === "databases") {
      setDatabaseDialogOpen(true);
    } else {
      const source = sources.find(s => s.id === sourceId);
      if (source?.requiresCredentials) {
        setPendingSourceId(sourceId);
        setCredentialDialogOpen(true);
      } else {
        setCurrentSource(sourceId);
        setFilePickerOpen(true);
      }
    }
  };
 
  const handleCredentialProceed = (credentials: any) => {
    if (pendingSourceId === "s3") setS3Credentials(credentials as S3Credentials);
    else if (pendingSourceId === "azure") setAzureCredentials(credentials as AzureCredentials);
    else if (pendingSourceId === "onelake") setOneLakeCredentials(credentials as OneLakeCredentials);
    else if (pendingSourceId === "databricks") setDatabricksCredentials(credentials as DatabricksCredentials);
    else if (pendingSourceId === "snowflake") setSnowflakeCredentials(credentials as SnowflakeCredentials);
 
    setCurrentSource(pendingSourceId);
    setFilePickerOpen(true);
  };
 
  const handleDatabaseConnect = (config: { server: string; database: string; username: string; selectedTables: string[] }) => {
    const newItems: SelectedItem[] = config.selectedTables.map(table => ({
      id: `db-${config.database}-${table}`,
      name: table,
      source: "Database",
      size: "N/A",
      rows: "N/A",
      icon: "table",
      sourceType: "databases",
      fullPath: `${config.database}/${table}`
    }));
    setSelectedItems(prev => [...prev, ...newItems]);
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
            {selectedItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No items selected yet</p>
            ) : (
              selectedItems.map((item) => (
                <Card key={item.id} className="p-4 border border-border hover:border-primary/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {getItemIcon(item.icon)}
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name.split('/').pop()}</p>
                        <p className="text-sm text-muted-foreground">{item.source}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
 
        {/* Action Button */}
        <div className="flex justify-end">
          {/* <Button onClick={handleProceed} size="lg" className="px-8" disabled={selectedItems.length === 0 || !userId}>
            Ingest / Proceed
          </Button> */}
         <Button
            onClick={handleProceed}
            size="lg"
            className="px-8 flex items-center gap-2"
            disabled={selectedItems.length === 0 || !userId || isIngesting}
          >
            {isIngesting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isIngesting ? "Ingesting..." : "Ingest / Proceed"}
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
          files={[]}
          onSelect={handleFileSelection}
          s3Credentials={s3Credentials}
          isS3={currentSource === "s3"}
          azureCredentials={azureCredentials}
          isAzure={currentSource === "azure"}
          oneLakeCredentials={oneLakeCredentials}
          isOneLake={currentSource === "onelake"}
          databricksCredentials={databricksCredentials}
          isDatabricks={currentSource === "databricks"}
          snowflakeCredentials={snowflakeCredentials}
          isSnowflake={currentSource === "snowflake"}
        />
 
        <SchemaPreviewDialog open={schemaPreviewOpen} onOpenChange={setSchemaPreviewOpen} fileName={previewFileName} />
        <DatabaseConnectionDialog open={databaseDialogOpen} onOpenChange={setDatabaseDialogOpen} onConnect={handleDatabaseConnect} />
      </div>
    </WorkflowLayout>
  );
}
 