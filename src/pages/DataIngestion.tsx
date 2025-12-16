// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Database, Cloud, Snowflake, FileText, FolderOpen, X, FileSpreadsheet, Table, Upload, ArrowLeft, Settings, Lock } from "lucide-react";
// import { FilePickerDialog } from "@/components/FilePickerDialog";
// import { SchemaPreviewDialog } from "@/components/SchemaPreviewDialog";
// import { DatabaseConnectionDialog } from "@/components/DatabaseConnectionDialog";
// import { SourceCredentialDialog } from "@/components/SourceCredentialDialog";
// import { toast } from "sonner";

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
//   { id: "delta", name: "Delta Tables", description: "Delta Lake", icon: Table, requiresCredentials: true },
//   { id: "local", name: "Local files", description: "Upload", icon: Upload, requiresCredentials: false },
// ];

// const sourceFiles: Record<string, Array<{ id: string; name: string; size: string; rows: string }>> = {
//   s3: [
//     { id: "s3-1", name: "customer_data_q1_2024.csv", size: "2.4 MB", rows: "15,302 rows" },
//     { id: "s3-2", name: "customer_data_partitioned.parquet", size: "256 MB", rows: "~25M rows" },
//   ],
//   azure: [
//     { id: "azure-1", name: "product_catalog_2024.json", size: "12 MB", rows: "540,000 rows" },
//     { id: "azure-2", name: "orders_snapshot_march.csv", size: "9 MB", rows: "132,000 rows" },
//   ],
//   snowflake: [
//     { id: "snowflake-1", name: "dbo.customers", size: "51.2 MB", rows: "1,204,891 rows" },
//     { id: "snowflake-2", name: "fact_sales", size: "78 MB", rows: "3,540,220 rows" },
//   ],
//   sap: [
//     { id: "sap-1", name: "sap_material_master.csv", size: "33 MB", rows: "802,330 rows" },
//     { id: "sap-2", name: "sap_inventory_view.csv", size: "18 MB", rows: "402,110 rows" },
//   ],
//   databases: [
//     { id: "db-1", name: "dbo.users", size: "5.4 MB", rows: "104,500 rows" },
//     { id: "db-2", name: "dbo.transactions", size: "127 MB", rows: "8,240,000 rows" },
//   ],
//   onelake: [
//     { id: "onelake-1", name: "workspace1/lakehouse1/sales_data.parquet", size: "45 MB", rows: "650,000 rows" },
//     { id: "onelake-2", name: "workspace2/lakehouse2/customer_360.csv", size: "28 MB", rows: "350,000 rows" },
//   ],
//   delta: [
//     { id: "delta-1", name: "workspace1/lakehouse1/transactions", size: "120 MB", rows: "2,500,000 rows" },
//     { id: "delta-2", name: "workspace2/lakehouse2/orders", size: "85 MB", rows: "1,800,000 rows" },
//   ],
//   local: [],
// };

// export default function DataIngestion() {
//   const navigate = useNavigate();
//   const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([
//     {
//       id: "1",
//       name: "sales_q1_2024.csv",
//       source: "Local File",
//       size: "2.4 MB",
//       rows: "15,302 rows",
//       icon: "file"
//     },
//     {
//       id: "2",
//       name: "dbo.customers",
//       source: "Snowflake",
//       size: "51.2 MB",
//       rows: "1,204,891 rows",
//       icon: "table"
//     },
//     {
//       id: "3",
//       name: "customer_data_partitioned.parquet",
//       source: "S3 Storage",
//       size: "256 MB",
//       rows: "~25M rows",
//       icon: "folder"
//     }
//   ]);

//   const [filePickerOpen, setFilePickerOpen] = useState(false);
//   const [currentSource, setCurrentSource] = useState<string>("");
//   const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
//   const [previewFileName, setPreviewFileName] = useState("");
//   const [databaseDialogOpen, setDatabaseDialogOpen] = useState(false);
//   const [credentialDialogOpen, setCredentialDialogOpen] = useState(false);
//   const [pendingSourceId, setPendingSourceId] = useState<string>("");
//   const [sourcesEnabled, setSourcesEnabled] = useState(false);

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
//     if (!sourcesEnabled) {
//       toast.error("Please click Configure to enable sources first");
//       return;
//     }

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
//       // Show credential dialog first
//       setPendingSourceId(sourceId);
//       setCredentialDialogOpen(true);
//     } else {
//       setCurrentSource(sourceId);
//       setFilePickerOpen(true);
//     }
//   };

//   const handleCredentialProceed = () => {
//     // After credentials validated, open file picker
//     setCurrentSource(pendingSourceId);
//     setFilePickerOpen(true);
//   };

//   const handleDatabaseConnect = (config: any) => {
//     const newItem: SelectedItem = {
//       id: `db-${Date.now()}`,
//       name: config.databaseName || "Connected Database",
//       source: config.dataSource,
//       size: "N/A",
//       rows: "N/A",
//       icon: "table"
//     };
//     setSelectedItems([...selectedItems, newItem]);
//   };

//   const handleFileSelection = (files: Array<{ id: string; name: string; size: string; rows: string }>) => {
//     const newItems: SelectedItem[] = files.map(file => ({
//       id: file.id,
//       name: file.name,
//       source: sources.find(s => s.id === currentSource)?.name || "Unknown",
//       size: file.size,
//       rows: file.rows,
//       icon: file.name.includes("dbo.") ? "table" : file.name.endsWith(".parquet") ? "folder" : "file"
//     }));
//     setSelectedItems([...selectedItems, ...newItems]);
//   };

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
//           <div className="flex gap-3">
//             <Button variant="outline" onClick={() => navigate("/jobs")}>
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back to Jobs
//             </Button>
//             <Button onClick={() => { setSourcesEnabled(true); toast.success("All sources enabled"); }}>
//               <Settings className="h-4 w-4 mr-2" />
//               Configure
//             </Button>
//           </div>
//         </div>

//         {/* Select a Source */}
//         <div className="mb-12">
//           <h2 className="text-xl font-semibold text-foreground mb-6">Select a Source</h2>
//           <div className="grid grid-cols-4 gap-4">
//             {sources.map((source) => {
//               const IconComponent = source.icon;
//               const isDisabled = !sourcesEnabled;
//               return (
//                 <Card
//                   key={source.id}
//                   className={`p-6 cursor-pointer transition-colors border border-border group relative ${
//                     isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent/30"
//                   }`}
//                   onClick={() => openFilePicker(source.id)}
//                 >
//                   {isDisabled && (
//                     <div className="absolute top-2 right-2">
//                       <Lock className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   )}
//                   <div className="flex flex-col items-center text-center space-y-3">
//                     <div className={`w-12 h-12 rounded-lg bg-card-hover border border-border flex items-center justify-center transition-colors ${
//                       !isDisabled ? "group-hover:border-primary" : ""
//                     }`}>
//                       <IconComponent className={`h-6 w-6 text-muted-foreground transition-colors ${
//                         !isDisabled ? "group-hover:text-primary" : ""
//                       }`} />
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
//                       <p className="font-medium text-foreground">{item.name}</p>
//                       <p className="text-sm text-muted-foreground">
//                         {item.source} • {item.size} • {item.rows}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <Button
//                       variant="link"
//                       className="text-primary hover:text-primary/80"
//                       onClick={() => openSchemaPreview(item.name)}
//                     >
//                       Preview Schema
//                     </Button>
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

//         {/* Source Credential Dialog */}
//         <SourceCredentialDialog
//           open={credentialDialogOpen}
//           onOpenChange={setCredentialDialogOpen}
//           sourceName={sources.find(s => s.id === pendingSourceId)?.name || ""}
//           onProceed={handleCredentialProceed}
//         />

//         {/* File Picker Dialog */}
//         <FilePickerDialog
//           open={filePickerOpen}
//           onOpenChange={setFilePickerOpen}
//           sourceName={sources.find(s => s.id === currentSource)?.name || ""}
//           files={sourceFiles[currentSource] || []}
//           onSelect={handleFileSelection}
//         />

//         {/* Schema Preview Dialog */}
//         <SchemaPreviewDialog
//           open={schemaPreviewOpen}
//           onOpenChange={setSchemaPreviewOpen}
//           fileName={previewFileName}
//         />

//         {/* Database Connection Dialog */}
//         <DatabaseConnectionDialog
//           open={databaseDialogOpen}
//           onOpenChange={setDatabaseDialogOpen}
//           onConnect={handleDatabaseConnect}
//         />
//       </div>
//     </WorkflowLayout>
//   );
// }

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
import { S3Credentials, AzureCredentials, OneLakeCredentials } from "@/components/api/api";

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
  { id: "delta", name: "Delta Tables", description: "Delta Lake", icon: Table, requiresCredentials: true },
  { id: "local", name: "Local files", description: "Upload", icon: Upload, requiresCredentials: false },
];

const sourceFiles: Record<string, Array<{ id: string; name: string; size: string; rows: string }>> = {
  s3: [],
  azure: [],
  snowflake: [
    // { id: "snowflake-1", name: "dbo.customers", size: "51.2 MB", rows: "1,204,891 rows" },
    // { id: "snowflake-2", name: "fact_sales", size: "78 MB", rows: "3,540,220 rows" },
  ],
  sap: [
    // { id: "sap-1", name: "sap_material_master.csv", size: "33 MB", rows: "802,330 rows" },
    // { id: "sap-2", name: "sap_inventory_view.csv", size: "18 MB", rows: "402,110 rows" },
  ],
  databases: [
    // { id: "db-1", name: "dbo.users", size: "5.4 MB", rows: "104,500 rows" },
    // { id: "db-2", name: "dbo.transactions", size: "127 MB", rows: "8,240,000 rows" },
  ],
  onelake: [],
  delta: [
    // { id: "delta-1", name: "workspace1/lakehouse1/transactions", size: "120 MB", rows: "2,500,000 rows" },
    // { id: "delta-2", name: "workspace2/lakehouse2/orders", size: "85 MB", rows: "1,800,000 rows" },
  ],
  local: [],
};



export default function DataIngestion() {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([
    // {
    //   id: "1",
    //   name: "sales_q1_2024.csv",
    //   source: "Local File",
    //   size: "2.4 MB",
    //   rows: "15,302 rows",
    //   icon: "file"
    // },
    // {
    //   id: "2",
    //   name: "dbo.customers",
    //   source: "Snowflake",
    //   size: "51.2 MB",
    //   rows: "1,204,891 rows",
    //   icon: "table"
    // },
    // {
    //   id: "3",
    //   name: "customer_data_partitioned.parquet",
    //   source: "S3 Storage",
    //   size: "256 MB",
    //   rows: "~25M rows",
    //   icon: "folder"
    // }
  ]);

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
  const [deltaCredentials, setDeltaCredentials] = useState<OneLakeCredentials | null>(null);

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
  const handleCredentialProceed = (credentials: S3Credentials | AzureCredentials | OneLakeCredentials) => {
    if (pendingSourceId === "s3") {
      setS3Credentials(credentials as S3Credentials);
    } else if (pendingSourceId === "azure") {
      setAzureCredentials(credentials as AzureCredentials);
    } else if (pendingSourceId === "onelake") {
      setOneLakeCredentials(credentials as OneLakeCredentials);
    } else if (pendingSourceId === "delta") {
      setDeltaCredentials(credentials as OneLakeCredentials);
    }
    setCurrentSource(pendingSourceId);
    setFilePickerOpen(true);
  };

  const handleDatabaseConnect = (config: any) => {
    const newItem: SelectedItem = {
      id: `db-${Date.now()}`,
      name: config.databaseName || "Connected Database",
      source: config.dataSource,
      size: "N/A",
      rows: "N/A",
      icon: "table"
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleFileSelection = (files: Array<{ id: string; name: string; size: string; rows: string }>) => {
    const newItems: SelectedItem[] = files.map(file => ({
      id: file.id,
      name: file.name,
      source: sources.find(s => s.id === currentSource)?.name || "Unknown",
      size: file.size,
      rows: file.rows,
      icon: file.name.includes("dbo.") ? "table" : file.name.endsWith(".parquet") ? "folder" : "file"
    }));
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
                    {/* <Button
                      variant="link"
                      className="text-primary hover:text-primary/80"
                      onClick={() => openSchemaPreview(item.name)}
                    >
                      Preview Schema
                    </Button> */}
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
          deltaCredentials={deltaCredentials}
          isAzure={currentSource === "azure"}
          isOneLake={currentSource === "onelake"}
          isDelta={currentSource === "delta"}
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