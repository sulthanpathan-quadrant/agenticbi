// import { useState, useEffect, useRef } from "react";
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
// import { Loader2 } from "lucide-react";
// import { S3Credentials, AzureCredentials, OneLakeCredentials, DatabricksCredentials, SnowflakeCredentials } from "@/components/api/api";
 
// interface SelectedItem {
//   id: string;
//   name: string;
//   source: string;
//   size: string;
//   rows: string;
//   icon: "file" | "table" | "folder";
//   sourceType: string;
//   fullPath: string;
// }
 
// interface UserDetails {
//   id: string;
//   email: string;
//   name: string;
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
 
// export default function DataIngestion() {
//   const navigate = useNavigate();
 
//   // Ref for the Selected Items section
//   const selectedItemsRef = useRef<HTMLDivElement>(null);
 
//   const [isIngesting, setIsIngesting] = useState(false);
//   const [userId, setUserId] = useState<string>("");
//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
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
 
//   // Reusable X close button for all toasts (Sonner style)
//   const closeToastButton = (
//     <button
//       onClick={() => toast.dismiss()}
//       className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
//       aria-label="Close toast"
//     >
//       <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
//     </button>
//   );
 
//   // Auto-scroll effect when selectedItems changes
//   useEffect(() => {
//     if (selectedItems.length > 0 && selectedItemsRef.current) {
//       // Small delay to ensure DOM has updated
//       setTimeout(() => {
//         // Find the scrollable parent (the <main> element with overflow-y-auto)
//         const scrollableParent = selectedItemsRef.current?.closest('main');
       
//         if (scrollableParent && selectedItemsRef.current) {
//           // Get the position of the selected items section relative to the scrollable container
//           const elementTop = selectedItemsRef.current.offsetTop;
//           const parentTop = scrollableParent.scrollTop;
//           const parentHeight = scrollableParent.clientHeight;
         
//           // Calculate the target scroll position (with some offset for better UX)
//           const targetScroll = elementTop - 80; // 80px offset from top
         
//           // Smooth scroll to the target position
//           scrollableParent.scrollTo({
//             top: targetScroll,
//             behavior: 'smooth'
//           });
//         }
//       }, 150);
//     }
//   }, [selectedItems.length]);
 
//   // Load user_id and restore selected items from localStorage on mount
//   useEffect(() => {
//     const userData = localStorage.getItem("user");
//     if (userData) {
//       try {
//         const user: UserDetails = JSON.parse(userData);
//         setUserId(user.id || "unknown-user");
//       } catch (err) {
//         console.error("Failed to parse user data:", err);
//         setUserId("unknown-user");
//       }
//     } else {
//       toast.error("No user logged in.", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       setUserId("unknown-user");
//     }
 
//     const saved = localStorage.getItem("ingestion_sources");
//     if (saved) {
//       try {
//         const parsed = JSON.parse(saved);
//         if (Array.isArray(parsed) && parsed.length > 0) {
//           const restoredItems: SelectedItem[] = [];
//           parsed.forEach((entry: any, groupIndex: number) => {
//             const sourceType = entry.source_type || "unknown";
//             const sourceName = sources.find(s => s.id === sourceType)?.name || sourceType;
 
//             if (sourceType === "s3" && Array.isArray(entry.s3path)) {
//               entry.s3path.forEach((path: string, idx: number) => {
//                 const name = path.split('/').pop() || path;
//                 restoredItems.push({
//                   id: `restored-s3-${groupIndex}-${idx}-${Date.now()}`,
//                   name,
//                   source: sourceName,
//                   size: "N/A",
//                   rows: "N/A",
//                   icon: "file",
//                   sourceType,
//                   fullPath: path
//                 });
//               });
//             }
//             else if (sourceType === "blob" && Array.isArray(entry.blobpath)) {
//               entry.blobpath.forEach((path: string, idx: number) => {
//                 const name = path.split('/').pop() || path;
//                 restoredItems.push({
//                   id: `restored-blob-${groupIndex}-${idx}-${Date.now()}`,
//                   name,
//                   source: sourceName,
//                   size: "N/A",
//                   rows: "N/A",
//                   icon: "file",
//                   sourceType,
//                   fullPath: path
//                 });
//               });
//             }
//             else if (sourceType === "onelake" && Array.isArray(entry.file_path)) {
//               entry.file_path.forEach((path: string, idx: number) => {
//                 const name = path.split('/').pop() || path;
//                 restoredItems.push({
//                   id: `restored-onelake-${groupIndex}-${idx}-${Date.now()}`,
//                   name,
//                   source: sourceName,
//                   size: "N/A",
//                   rows: "N/A",
//                   icon: "file",
//                   sourceType,
//                   fullPath: path
//                 });
//               });
//             }
//             else if (sourceType === "databricks" && Array.isArray(entry.table)) {
//               entry.table.forEach((tbl: string, idx: number) => {
//                 const name = tbl.split('.').pop() || tbl;
//                 restoredItems.push({
//                   id: `restored-databricks-${groupIndex}-${idx}-${Date.now()}`,
//                   name,
//                   source: sourceName,
//                   size: "N/A",
//                   rows: "N/A",
//                   icon: "table",
//                   sourceType,
//                   fullPath: tbl
//                 });
//               });
//             }
//             else if (sourceType === "sqlserver" && Array.isArray(entry.table)) {
//               entry.table.forEach((tbl: string, idx: number) => {
//                 const name = tbl.split('.').pop() || tbl;
//                 restoredItems.push({
//                   id: `restored-sql-${groupIndex}-${idx}-${Date.now()}`,
//                   name,
//                   source: sourceName || "SQL Server",
//                   size: "N/A",
//                   rows: "N/A",
//                   icon: "table",
//                   sourceType,
//                   fullPath: tbl
//                 });
//               });
//             }
//           });
//           setSelectedItems(restoredItems);
//         }
//       } catch (err) {
//         console.error("Failed to restore items:", err);
//       }
//     }
//   }, []);
 
//   const removeItem = (id: string) => {
//     setSelectedItems(prev => prev.filter(item => item.id !== id));
//   };
 
//   const getItemIcon = (iconType: "file" | "table" | "folder") => {
//     switch (iconType) {
//       case "file": return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
//       case "table": return <Table className="h-5 w-5 text-blue-500" />;
//       case "folder": return <FolderOpen className="h-5 w-5 text-yellow-500" />;
//       default: return <FileText className="h-5 w-5" />;
//     }
//   };
 
//   const saveSelectionToStorage = (
//     files: Array<{ name: string; fullPath: string }>,
//     credentials: any,
//     sourceType: string
//   ) => {
//     const existing = JSON.parse(localStorage.getItem("ingestion_sources") || "[]");
 
//     const paths = files.map(f => f.fullPath).filter(Boolean);
//     if (paths.length === 0) return;
 
//     let newEntry: any = {
//       destination_path: userId,
//     };
 
//     switch (sourceType) {
//       case "s3":
//         newEntry = {
//           ...newEntry,
//           source_type: "s3",
//           s3path: paths.map(p => p.startsWith("s3://") ? p : `s3://${p}`),
//           s3AccessKey: credentials?.aws_access_key_id || credentials?.accessKey || credentials?.s3AccessKey,
//           s3SecretKey: credentials?.aws_secret_access_key || credentials?.secretKey || credentials?.s3SecretKey,
//           s3ServiceUrl: credentials?.s3ServiceUrl || "https://s3.amazonaws.com"
//         };
//         break;
 
//       case "azure":
//         newEntry = {
//           ...newEntry,
//           source_type: "blob",
//           blobpath: paths,
//           blobAccountName: credentials?.accountName ||
//                           credentials?.connection_string?.match(/AccountName=([^;]+)/)?.[1] ||
//                           "agenticbistorage",
//           blobAccountKey: credentials?.accountKey ||
//                          credentials?.connection_string?.match(/AccountKey=([^;]+)/)?.[1]
//         };
//         break;
 
//       case "onelake":
//         newEntry = {
//           ...newEntry,
//           source_type: "onelake",
//           workspace_name: credentials?.workspace_name || "agenticBI",           // ← from credentials or default
//           lakehouse_name: credentials?.lakehouse_name || "newagenticBI",       // ← from credentials or default
//           copy_type: "file",                                                    // ← fixed as per payload
//           file_path: paths,                                                     // ← array of full paths
//           client_id: credentials?.client_id,
//           client_secret: credentials?.client_secret,
//           tenant_id: credentials?.tenant_id
//         };
//         break;
 
//       case "databricks":
//         newEntry = {
//           ...newEntry,
//           source_type: "databricks",
//           databricks_host: credentials?.host || credentials?.databricks_host,
//           warehouse_id: credentials?.warehouse_id,
//           access_token: credentials?.access_token,
//           catalog: credentials?.catalog || "agenticbi_adb",
//           schema: credentials?.schema || "default",
//           table: paths
//         };
//         break;
 
//       case "databases":
//         newEntry = {
//           ...newEntry,
//           source_type: "sqlserver",
//           server: credentials?.server || credentials?.host,
//           database: credentials?.database,
//           username: credentials?.username,
//           password: credentials?.password,
//           table: paths
//         };
//         break;
 
//       default:
//         console.warn(`Unsupported source type: ${sourceType}`);
//         return;
//     }
 
//     // Avoid exact duplicate entries
//     const isDuplicate = existing.some((e: any) =>
//       e.source_type === newEntry.source_type &&
//       JSON.stringify(e) === JSON.stringify(newEntry)
//     );
 
//     let updated = existing;
//     if (!isDuplicate) {
//       updated = [...existing, newEntry];
//     }
 
//     localStorage.setItem("ingestion_sources", JSON.stringify(updated));
//     toast.success(`Added ${paths.length} item(s) from ${sourceType}`, {
//       duration: 1400,
//       action: closeToastButton
//     });
//   };
 
//   const handleFileSelection = (
//     files: Array<{ id: string; name: string; size: string; rows: string; fullPath?: string }>,
//     credentials?: any
//   ) => {
//     if (credentials && currentSource && files.length > 0) {
//       saveSelectionToStorage(
//         files.map(f => ({
//           name: f.name,
//           fullPath: f.fullPath || f.name
//         })),
//         credentials,
//         currentSource
//       );
//     }
 
//     const newItems: SelectedItem[] = files.map(file => {
//       let icon: "file" | "table" | "folder" = "file";
//       if (["snowflake", "databricks", "databases"].includes(currentSource)) icon = "table";
 
//       return {
//         id: `${currentSource}-${file.id || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
//         name: file.name,
//         source: sources.find(s => s.id === currentSource)?.name || "Unknown",
//         size: file.size,
//         rows: file.rows,
//         icon,
//         sourceType: currentSource,
//         fullPath: file.fullPath || file.name
//       };
//     });
 
//     setSelectedItems(prev => [...prev, ...newItems]);
//   };
 
//   const handleProceed = async () => {
//     if (!userId || userId === "unknown-user") {
//       toast.error("User not authenticated. Please login again.", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       return;
//     }

//     const currentJobId = localStorage.getItem("current_job_id");

//     if (!currentJobId) {
//         toast.error("No job ID found.", {
//             duration: 1000,
//             action: closeToastButton
//         });
//         return;
//     }
 
//     const payloadStr = localStorage.getItem("ingestion_sources");
//     if (!payloadStr || JSON.parse(payloadStr).length === 0) {
//       toast.error("No files selected for ingestion", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       return;
//     }
 
//     try {
//       setIsIngesting(true);
 
//       const response = await fetch(
//         `https://api.veriton.ai/api/service1/ingest-now?user_id=${userId}&job_id=${currentJobId}`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: payloadStr
//         }
//       );
 
//       const responseData = await response.json();
 
//       if (!response.ok || !responseData.job_id) {
//         throw new Error(responseData.note || "Ingestion failed");
//       }
 
//       // localStorage.setItem("current_job_id", responseData.job_id);
//       localStorage.removeItem("ingestion_sources");
//       setSelectedItems([]);
 
//       toast.success("Ingestion started successfully", { action: closeToastButton });
//       navigate("/workflow/landing-zone");
//     } catch (error) {
//       console.error("Ingestion API error:", error);
//       toast.error("Pipeline trigger failed or server not reachable.", {
//         duration: 3000,
//         action: closeToastButton
//       });
//     } finally {
//       setIsIngesting(false);
//     }
//   };
 
//   const openFilePicker = (sourceId: string) => {
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
//             icon: "file",
//             sourceType: "local",
//             fullPath: file.name
//           }));
//           setSelectedItems(prev => [...prev, ...newItems]);
//         }
//       };
//       input.click();
//     } else if (sourceId === "databases") {
//       setDatabaseDialogOpen(true);
//     } else {
//       const source = sources.find(s => s.id === sourceId);
//       if (source?.requiresCredentials) {
//         setPendingSourceId(sourceId);
//         setCredentialDialogOpen(true);
//       } else {
//         setCurrentSource(sourceId);
//         setFilePickerOpen(true);
//       }
//     }
//   };
 
//   const handleCredentialProceed = (credentials: any) => {
//     if (pendingSourceId === "s3") setS3Credentials(credentials as S3Credentials);
//     else if (pendingSourceId === "azure") setAzureCredentials(credentials as AzureCredentials);
//     else if (pendingSourceId === "onelake") setOneLakeCredentials(credentials as OneLakeCredentials);
//     else if (pendingSourceId === "databricks") setDatabricksCredentials(credentials as DatabricksCredentials);
//     else if (pendingSourceId === "snowflake") setSnowflakeCredentials(credentials as SnowflakeCredentials);
 
//     setCurrentSource(pendingSourceId);
//     setFilePickerOpen(true);
//   };
 
//   const handleDatabaseConnect = (config: {
//     server: string;
//     database: string;
//     username: string;
//     password: string;
//     selectedTables: string[];
//   }) => {
//     const newItems: SelectedItem[] = config.selectedTables.map(table => ({
//       id: `db-${config.database}-${table}-${Date.now()}`,
//       name: table.split('.').pop() || table,
//       source: "SQL Server",
//       size: "N/A",
//       rows: "N/A",
//       icon: "table",
//       sourceType: "databases",
//       fullPath: table
//     }));
 
//     setSelectedItems(prev => [...prev, ...newItems]);
 
//     saveSelectionToStorage(
//       config.selectedTables.map(table => ({
//         name: table,
//         fullPath: table
//       })),
//       {
//         server: config.server,
//         database: config.database,
//         username: config.username,
//         password: config.password,
//       },
//       "databases"
//     );
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
//         <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2" ref={selectedItemsRef}>
//           <h2 className="text-xl font-semibold text-foreground mb-6 sticky top-0 bg-background z-10 pb-4">Selected Items</h2>
//           <div className="space-y-3">
//             {selectedItems.length === 0 ? (
//               <p className="text-muted-foreground text-center py-8">No items selected yet</p>
//             ) : (
//               selectedItems.map((item) => (
//                 <Card key={item.id} className="p-4 border border-border hover:border-primary/50 transition-colors">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4 flex-1">
//                       {getItemIcon(item.icon)}
//                       <div className="flex-1">
//                         <p className="font-medium text-foreground">{item.name}</p>
//                         <p className="text-sm text-muted-foreground">{item.source}</p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => removeItem(item.id)}
//                       className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </Card>
//               ))
//             )}
//           </div>
//         </div>
 
//         {/* Action Button */}
//         <div className="flex justify-end mt-3">
//           <Button
//             onClick={handleProceed}
//             size="lg"
//             className="px-8 flex items-center gap-2"
//             disabled={selectedItems.length === 0 || !userId || isIngesting}
//           >
//             {isIngesting && <Loader2 className="h-4 w-4 animate-spin" />}
//             {isIngesting ? "Ingesting..." : "Ingest / Proceed"}
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
//           files={[]}
//           onSelect={handleFileSelection}
//           s3Credentials={s3Credentials}
//           isS3={currentSource === "s3"}
//           azureCredentials={azureCredentials}
//           isAzure={currentSource === "azure"}
//           oneLakeCredentials={oneLakeCredentials}
//           isOneLake={currentSource === "onelake"}
//           databricksCredentials={databricksCredentials}
//           isDatabricks={currentSource === "databricks"}
//           snowflakeCredentials={snowflakeCredentials}
//           isSnowflake={currentSource === "snowflake"}
//         />
//         <SchemaPreviewDialog open={schemaPreviewOpen} onOpenChange={setSchemaPreviewOpen} fileName={previewFileName} />
//         <DatabaseConnectionDialog open={databaseDialogOpen} onOpenChange={setDatabaseDialogOpen} onConnect={handleDatabaseConnect} />
//       </div>
//     </WorkflowLayout>
//   );
// }


import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, Cloud, Snowflake, FileText, FolderOpen, X, FileSpreadsheet, Table, Upload } from "lucide-react";
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

  const selectedItemsRef = useRef<HTMLDivElement>(null);

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

  // Reusable X close button for all toasts
  const closeToastButton = (
    <button
      onClick={() => toast.dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // Auto-scroll to selected items section when items are added
  useEffect(() => {
    if (selectedItems.length > 0 && selectedItemsRef.current) {
      setTimeout(() => {
        const scrollableParent = selectedItemsRef.current?.closest('main');
        if (scrollableParent && selectedItemsRef.current) {
          const elementTop = selectedItemsRef.current.offsetTop;
          const targetScroll = elementTop - 80;
          scrollableParent.scrollTo({
            top: targetScroll,
            behavior: 'smooth'
          });
        }
      }, 150);
    }
  }, [selectedItems.length]);

  // Load user & restore selected items from localStorage
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
      toast.error("No user logged in.", { duration: 1000, action: closeToastButton });
      setUserId("unknown-user");
    }

    const saved = localStorage.getItem("ingestion_sources");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const restoredItems: SelectedItem[] = [];
          parsed.forEach((entry: any, groupIndex: number) => {
            const sourceType = entry.source_type || "unknown";
            const sourceName = sources.find(s => s.id === sourceType)?.name || sourceType;

            if (sourceType === "s3" && Array.isArray(entry.s3path)) {
              entry.s3path.forEach((path: string, idx: number) => {
                const name = path.split('/').pop() || path;
                restoredItems.push({
                  id: `restored-s3-${groupIndex}-${idx}-${Date.now()}`,
                  name,
                  source: sourceName,
                  size: "N/A",
                  rows: "N/A",
                  icon: "file",
                  sourceType,
                  fullPath: path
                });
              });
            }
            else if (sourceType === "blob" && Array.isArray(entry.blobpath)) {
              entry.blobpath.forEach((path: string, idx: number) => {
                const name = path.split('/').pop() || path;
                restoredItems.push({
                  id: `restored-blob-${groupIndex}-${idx}-${Date.now()}`,
                  name,
                  source: sourceName,
                  size: "N/A",
                  rows: "N/A",
                  icon: "file",
                  sourceType,
                  fullPath: path
                });
              });
            }
            else if (sourceType === "onelake" && Array.isArray(entry.file_path)) {
              entry.file_path.forEach((path: string, idx: number) => {
                const name = path.split('/').pop() || path;
                restoredItems.push({
                  id: `restored-onelake-${groupIndex}-${idx}-${Date.now()}`,
                  name,
                  source: sourceName,
                  size: "N/A",
                  rows: "N/A",
                  icon: "file",
                  sourceType,
                  fullPath: path
                });
              });
            }
            else if (sourceType === "databricks" && Array.isArray(entry.table)) {
              entry.table.forEach((tbl: string, idx: number) => {
                const name = tbl.split('.').pop() || tbl;
                restoredItems.push({
                  id: `restored-databricks-${groupIndex}-${idx}-${Date.now()}`,
                  name,
                  source: sourceName,
                  size: "N/A",
                  rows: "N/A",
                  icon: "table",
                  sourceType,
                  fullPath: tbl
                });
              });
            }
            else if (sourceType === "sqlserver" && Array.isArray(entry.table)) {
              entry.table.forEach((tbl: string, idx: number) => {
                const name = tbl.split('.').pop() || tbl;
                restoredItems.push({
                  id: `restored-sql-${groupIndex}-${idx}-${Date.now()}`,
                  name,
                  source: sourceName || "SQL Server",
                  size: "N/A",
                  rows: "N/A",
                  icon: "table",
                  sourceType,
                  fullPath: tbl
                });
              });
            }
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

  const saveSelectionToStorage = (
    files: Array<{ name: string; fullPath: string }>,
    credentials: any,
    sourceType: string
  ) => {
    const existing = JSON.parse(localStorage.getItem("ingestion_sources") || "[]");

    const paths = files.map(f => f.fullPath).filter(Boolean);
    if (paths.length === 0) return;

    let newEntry: any = {
      destination_path: userId,
    };

    switch (sourceType) {
      case "s3":
        newEntry = {
          ...newEntry,
          source_type: "s3",
          s3path: paths.map(p => p.startsWith("s3://") ? p : `s3://${p}`),
          s3AccessKey: credentials?.aws_access_key_id || credentials?.accessKey || credentials?.s3AccessKey,
          s3SecretKey: credentials?.aws_secret_access_key || credentials?.secretKey || credentials?.s3SecretKey,
          s3ServiceUrl: credentials?.s3ServiceUrl || "https://s3.amazonaws.com"
        };
        break;

      case "azure":
        newEntry = {
          ...newEntry,
          source_type: "blob",
          blobpath: paths,
          blobAccountName: credentials?.accountName ||
                          credentials?.connection_string?.match(/AccountName=([^;]+)/)?.[1] ||
                          "agenticbistorage",
          blobAccountKey: credentials?.accountKey ||
                         credentials?.connection_string?.match(/AccountKey=([^;]+)/)?.[1]
        };
        break;

      case "onelake":
        newEntry = {
          ...newEntry,
          source_type: "onelake",
          workspace_name: credentials?.workspace_name || "agenticBI",
          lakehouse_name: credentials?.lakehouse_name || "newagenticBI",
          copy_type: "file",
          file_path: paths,
          client_id: credentials?.client_id,
          client_secret: credentials?.client_secret,
          tenant_id: credentials?.tenant_id
        };
        break;

      case "databricks":
        newEntry = {
          ...newEntry,
          source_type: "databricks",
          databricks_host: credentials?.host || credentials?.databricks_host,
          warehouse_id: credentials?.warehouse_id,
          access_token: credentials?.access_token,
          catalog: credentials?.catalog || "agenticbi_adb",
          schema: credentials?.schema || "default",
          table: paths
        };
        break;

      case "databases":
        newEntry = {
          ...newEntry,
          source_type: "sqlserver",
          server: credentials?.server || credentials?.host,
          database: credentials?.database,
          username: credentials?.username,
          password: credentials?.password,
          table: paths
        };
        break;

      default:
        console.warn(`Unsupported source type: ${sourceType}`);
        return;
    }

    const isDuplicate = existing.some((e: any) =>
      e.source_type === newEntry.source_type &&
      JSON.stringify(e) === JSON.stringify(newEntry)
    );

    let updated = existing;
    if (!isDuplicate) {
      updated = [...existing, newEntry];
    }

    localStorage.setItem("ingestion_sources", JSON.stringify(updated));
    toast.success(`Added ${paths.length} item(s) from ${sourceType}`, {
      duration: 1000,
      action: closeToastButton
    });
  };

  const handleFileSelection = (
    files: Array<{ id: string; name: string; size: string; rows: string; fullPath?: string }>,
    credentials?: any
  ) => {
    if (credentials && currentSource && files.length > 0) {
      saveSelectionToStorage(
        files.map(f => ({
          name: f.name,
          fullPath: f.fullPath || f.name
        })),
        credentials,
        currentSource
      );
    }

    const newItems: SelectedItem[] = files.map(file => {
      let icon: "file" | "table" | "folder" = "file";
      if (["snowflake", "databricks", "databases"].includes(currentSource)) icon = "table";

      return {
        id: `${currentSource}-${file.id || Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name: file.name,
        source: sources.find(s => s.id === currentSource)?.name || "Unknown",
        size: file.size,
        rows: file.rows,
        icon,
        sourceType: currentSource,
        fullPath: file.fullPath || file.name
      };
    });

    setSelectedItems(prev => [...prev, ...newItems]);
  };

  const handleProceed = async () => {
    if (!userId || userId === "unknown-user") {
      toast.error("User not authenticated. Please login again.", {
        duration: 1000,
        action: closeToastButton
      });
      return;
    }

    const currentJobId = localStorage.getItem("current_job_id");
    if (!currentJobId) {
      toast.error("No job ID found. Please create a job first.", {
        duration: 1000,
        action: closeToastButton
      });
      return;
    }

    const payloadStr = localStorage.getItem("ingestion_sources");
    if (!payloadStr || JSON.parse(payloadStr).length === 0) {
      toast.error("No files selected for ingestion", {
        duration: 1000,
        action: closeToastButton
      });
      return;
    }

    setIsIngesting(true);
    let pollingInterval: NodeJS.Timeout | null = null;

    try {
      // 1. Trigger ingestion
      const ingestUrl = `https://api.veriton.ai/api/service1/ingest-now?user_id=${userId}&job_id=${currentJobId}`;

      const ingestResponse = await fetch(ingestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payloadStr
      });

      const ingestData = await ingestResponse.json();

      if (!ingestResponse.ok) {
        throw new Error(ingestData.note || ingestData.message || "Ingestion request failed");
      }

      // toast.success("Ingestion job started", {
      //   description: `Job ID: ${currentJobId.slice(0, 8)}...`,
      //   action: closeToastButton
      // });

      // 2. Poll status
      const statusUrl = `https://api.veriton.ai/api/service1/ingest-now/status/${currentJobId}?user_id=${userId}`;

      pollingInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(statusUrl, {
            method: "GET",
            headers: { "Accept": "application/json" }
          });

          if (!statusRes.ok) {
            console.warn(`Status check failed: ${statusRes.status}`);
            return;
          }

          const statusData = await statusRes.json();
          const jobStatus = statusData?.status?.toLowerCase();

          if (jobStatus === "completed") {
            clearInterval(pollingInterval!);
            pollingInterval = null;

            localStorage.removeItem("ingestion_sources");
            setSelectedItems([]);

            toast.success("Ingestion completed successfully", {
              // description: "Files transferred to landing zone",
              action: closeToastButton
            });

            navigate("/workflow/landing-zone");
          }
          else if (["failed", "error"].includes(jobStatus)) {
            clearInterval(pollingInterval!);
            pollingInterval = null;

            const reason = statusData?.results?.[0]?.response?.message || "Unknown error";
            throw new Error(`Ingestion failed: ${reason}`);
          }
          // else → still in progress → continue polling

        } catch (pollErr) {
          console.error("Polling error:", pollErr);
          // continue polling
        }
      }, 10000); // check every 4 seconds

    } catch (err: any) {
      console.error("Ingestion error:", err);

      if (pollingInterval) clearInterval(pollingInterval);

      toast.error(err.message || "Failed to complete ingestion process", {
        duration: 2000,
        action: closeToastButton
      });
    } finally {
      // Keep button disabled during polling
      // Navigation happens inside polling success block
    }

    // Cleanup on unmount
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
    };
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

  const handleDatabaseConnect = (config: {
    server: string;
    database: string;
    username: string;
    password: string;
    selectedTables: string[];
  }) => {
    const newItems: SelectedItem[] = config.selectedTables.map(table => ({
      id: `db-${config.database}-${table}-${Date.now()}`,
      name: table.split('.').pop() || table,
      source: "SQL Server",
      size: "N/A",
      rows: "N/A",
      icon: "table",
      sourceType: "databases",
      fullPath: table
    }));

    setSelectedItems(prev => [...prev, ...newItems]);

    saveSelectionToStorage(
      config.selectedTables.map(table => ({
        name: table,
        fullPath: table
      })),
      {
        server: config.server,
        database: config.database,
        username: config.username,
        password: config.password,
      },
      "databases"
    );
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
        <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2" ref={selectedItemsRef}>
          <h2 className="text-xl font-semibold text-foreground mb-6 sticky top-0 bg-background z-10 pb-4">Selected Items</h2>
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
                        <p className="font-medium text-foreground">{item.name}</p>
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
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleProceed}
            size="lg"
            className="px-10 flex items-center gap-2 min-w-[220px]"
            disabled={selectedItems.length === 0 || !userId || isIngesting}
          >
            {isIngesting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing Ingestion...
              </>
            ) : (
              "Ingest / Proceed"
            )}
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