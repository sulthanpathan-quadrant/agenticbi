// import { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Loader2, Folder, ArrowLeft } from "lucide-react";
 
 
// import {
//   getS3Buckets,
//   getS3Objects,
//   S3Credentials,
//   getAzureContainers,
//   getAzureBlobs,
//   AzureCredentials,
//   getOneLakeWorkspaces,
//   getOneLakeLakehouses,
//   getOneLakeFolderContents,
//   OneLakeCredentials,
//   navigateBack,
//   getOneLakeTables,
//   getDatabricksCatalogs,
//   getDatabricksSchemas,
//   getDatabricksTables,
//   DatabricksCredentials,
//   getSnowflakeDatabases,
//   getSnowflakeSchemas,
//   getSnowflakeTables,
//   SnowflakeCredentials
// } from "@/components/api/api";
 
// import { toast } from "@/hooks/use-toast";
 
// interface FileOption {
//   id: string;
//   name: string;
//   size: string;
//   rows: string;
// }

// interface FilePickerDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   sourceName: string;
//   files: FileOption[];
//   onSelect: (
//     files: FileOption[],
//     credentials?: S3Credentials | AzureCredentials | OneLakeCredentials | DatabricksCredentials | SnowflakeCredentials
//   ) => void;
//   s3Credentials?: S3Credentials | null;
//   azureCredentials?: AzureCredentials | null;
//   oneLakeCredentials?: OneLakeCredentials | null;
//   deltaCredentials?: OneLakeCredentials | null;
//   databricksCredentials?: DatabricksCredentials | null;
//   snowflakeCredentials?: SnowflakeCredentials | null;
//   isS3?: boolean;
//   isAzure?: boolean;
//   isOneLake?: boolean;
//   isDelta?: boolean;
//   isDatabricks?: boolean;
//   isSnowflake?: boolean;
// }
 
 
// export function FilePickerDialog({
//   open,
//   onOpenChange,
//   sourceName,
//   files,
//   onSelect,
//   s3Credentials,
//   azureCredentials,
//   oneLakeCredentials,
//   deltaCredentials,
//   databricksCredentials,
//   snowflakeCredentials,
//   isS3 = false,
//   isAzure = false,
//   isOneLake = false,
//   isDelta = false,
//   isDatabricks = false,
//   isSnowflake = false
// }: FilePickerDialogProps) {
 
//   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
 
//   const [containers, setContainers] = useState<string[]>([]);
//   const [currentContainer, setCurrentContainer] = useState<string | null>(null);
//   const [objects, setObjects] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
 
//   const [lakehouses, setLakehouses] = useState<string[]>([]);
//   const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null);
//   const [currentLakehouse, setCurrentLakehouse] = useState<string | null>(null);
//   const [currentPath, setCurrentPath] = useState<string>("Files");
//   const [folders, setFolders] = useState<string[]>([]);
//   const [tables, setTables] = useState<any[]>([]);
//   const [catalogs, setCatalogs] = useState<string[]>([]);
//   const [schemas, setSchemas] = useState<string[]>([]);
//   const [currentCatalog, setCurrentCatalog] = useState<string | null>(null);
//   const [currentSchema, setCurrentSchema] = useState<string | null>(null);
//   const [databricksTables, setDatabricksTables] = useState<string[]>([]);
//   const [snowflakeDatabases, setSnowflakeDatabases] = useState<string[]>([]);
//   const [snowflakeSchemas, setSnowflakeSchemas] = useState<string[]>([]);
//   const [currentDatabase, setCurrentDatabase] = useState<string | null>(null);
//   const [currentSnowflakeSchema, setCurrentSnowflakeSchema] = useState<string | null>(null);
//   const [snowflakeTables, setSnowflakeTables] = useState<string[]>([]);
 
 
//   useEffect(() => {
//   if (!open) return;
 
//   if (isS3 && s3Credentials) loadS3Buckets();
//   else if (isAzure && azureCredentials) loadAzureContainers();
//   else if (isOneLake && oneLakeCredentials) loadOneLakeWorkspaces();
//   else if (isDelta && deltaCredentials) loadDeltaWorkspaces();
//   else if (isDatabricks && databricksCredentials) loadDatabricksCatalogs();
//   else if (isSnowflake && snowflakeCredentials) loadSnowflakeDatabases();
// }, [open]);
 
//   const loadS3Buckets = async () => {
//     if (!s3Credentials) return;
   
//     setIsLoading(true);
//     try {
//       const bucketList = await getS3Buckets(s3Credentials);
//       setContainers(bucketList);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Buckets", description: error.message, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadAzureContainers = async () => {
//     if (!azureCredentials) return;
 
//     setIsLoading(true);
//     try {
//       const containerList = await getAzureContainers(azureCredentials);
//       setContainers(containerList);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Containers", description: error.message, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadS3Objects = async (bucketName: string) => {
//     if (!s3Credentials) return;
   
//     setIsLoading(true);
//     setCurrentContainer(bucketName);
 
//     try {
//       const response = await getS3Objects(bucketName, s3Credentials);
//       setObjects(response.files || []);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Files", description: error.message, variant: "destructive" });
//       setCurrentContainer(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadAzureBlobs = async (containerName: string) => {
//     if (!azureCredentials) return;
 
//     setIsLoading(true);
//     setCurrentContainer(containerName);
 
//     try {
//       const response = await getAzureBlobs(containerName, azureCredentials);
//       setObjects(Array.isArray(response) ? response : response.files || []);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Blobs", description: error.message, variant: "destructive" });
//       setCurrentContainer(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadOneLakeWorkspaces = async () => {
//     if (!oneLakeCredentials) return;
 
//     setIsLoading(true);
//     try {
//       const list = await getOneLakeWorkspaces(oneLakeCredentials);
//       setContainers(list);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Workspaces", description: error.message, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadOneLakeLakehouses = async (workspaceName: string) => {
//     if (!oneLakeCredentials) return;
 
//     setIsLoading(true);
//     setCurrentWorkspace(workspaceName);
 
//     try {
//       const list = await getOneLakeLakehouses(workspaceName, oneLakeCredentials);
//       setLakehouses(list);
//     } catch (error: any) {
//       toast({ title: "Failed to Load Lakehouses", description: error.message, variant: "destructive" });
//       setCurrentWorkspace(null);
//     } finally {
//       setIsLoading(false);
//     }
//   };
 
//   const loadDeltaWorkspaces = async () => {
//   if (!deltaCredentials) return;
 
//   setIsLoading(true);
//   try {
//     const list = await getOneLakeWorkspaces(deltaCredentials);
//     setContainers(list);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Workspaces", description: error.message, variant: "destructive" });
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadDeltaLakehouses = async (workspaceName: string) => {
//   if (!deltaCredentials) return;
 
//   setIsLoading(true);
//   setCurrentWorkspace(workspaceName);
 
//   try {
//     const list = await getOneLakeLakehouses(workspaceName, deltaCredentials);
//     setLakehouses(list);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Lakehouses", description: error.message, variant: "destructive" });
//     setCurrentWorkspace(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadDeltaTables = async (lakehouseName: string) => {
//   if (!deltaCredentials || !currentWorkspace) return;
 
//   setIsLoading(true);
//   setCurrentLakehouse(lakehouseName);
 
//   try {
//     const response = await getOneLakeTables(
//       currentWorkspace,
//       lakehouseName,
//       deltaCredentials
//     );
//     setTables(response.tables || []);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Delta Tables", description: error.message, variant: "destructive" });
//     setCurrentLakehouse(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
//   const handleNavigateBack = async () => {
//     if (!oneLakeCredentials || !currentWorkspace || !currentLakehouse) return;
 
//     setIsLoading(true);
 
//     try {
//       const response = await navigateBack(
//         currentWorkspace,
//         currentLakehouse,
//         currentPath,
//         oneLakeCredentials
//       );
 
//       setCurrentPath(response.current_path);
//       setFolders(response.folders || []);
//       setObjects(response.files || []);
 
//     } catch (error: any) {
//       toast({ title: "Navigation Error", description: error.message, variant: "destructive" });
//     } finally {
//       setIsLoading(false);
//     }
//   };
// const loadDatabricksCatalogs = async () => {
//   if (!databricksCredentials) return;
 
//   setIsLoading(true);
//   try {
//     const catalogList = await getDatabricksCatalogs(databricksCredentials);
//     setCatalogs(catalogList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Catalogs", description: error.message, variant: "destructive" });
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadDatabricksSchemas = async (catalogName: string) => {
//   if (!databricksCredentials) return;
 
//   setIsLoading(true);
//   setCurrentCatalog(catalogName);
 
//   try {
//     const schemaList = await getDatabricksSchemas(catalogName, databricksCredentials);
//     setSchemas(schemaList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Schemas", description: error.message, variant: "destructive" });
//     setCurrentCatalog(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadDatabricksTablesList = async (schemaName: string) => {
//   if (!databricksCredentials || !currentCatalog) return;
 
//   setIsLoading(true);
//   setCurrentSchema(schemaName);
 
//   try {
//     const tableList = await getDatabricksTables(
//       currentCatalog,
//       schemaName,
//       databricksCredentials
//     );
//     setDatabricksTables(tableList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Tables", description: error.message, variant: "destructive" });
//     setCurrentSchema(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadOneLakeFolderContents = async (lakehouseName: string, path: string = "Files") => {
//   if (!oneLakeCredentials || !currentWorkspace) return;
 
//   setIsLoading(true);
//   setCurrentLakehouse(lakehouseName);
//   setCurrentPath(path);
 
//   try {
//     const response = await getOneLakeFolderContents(
//       currentWorkspace,      
//       lakehouseName,      
//       { ...oneLakeCredentials, path }
//     );
 
//     setFolders(response.folders || []);
//     setObjects(response.files || []);
//   } catch (error: any) {
//     toast({
//       title: "Failed to Load Folder Contents",
//       description: error.message,
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };
 
 
//   const handleFolderClick = (folderName: string) => {
//   const nextPath = currentPath ? `${currentPath}/${folderName}` : folderName;
//   loadOneLakeFolderContents(currentLakehouse!, nextPath);
// };
 
// const loadSnowflakeDatabases = async () => {
//   if (!snowflakeCredentials) return;
 
//   setIsLoading(true);
//   try {
//     const dbList = await getSnowflakeDatabases(snowflakeCredentials);
//     setSnowflakeDatabases(dbList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Databases", description: error.message, variant: "destructive" });
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadSnowflakeSchemas = async (databaseName: string) => {
//   if (!snowflakeCredentials) return;
 
//   setIsLoading(true);
//   setCurrentDatabase(databaseName);
 
//   try {
//     const schemaList = await getSnowflakeSchemas(databaseName, snowflakeCredentials);
//     setSnowflakeSchemas(schemaList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Schemas", description: error.message, variant: "destructive" });
//     setCurrentDatabase(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
 
// const loadSnowflakeTablesList = async (schemaName: string) => {
//   if (!snowflakeCredentials || !currentDatabase) return;
 
//   setIsLoading(true);
//   setCurrentSnowflakeSchema(schemaName);
 
//   try {
//     const tableList = await getSnowflakeTables(
//       currentDatabase,
//       schemaName,
//       snowflakeCredentials
//     );
//         console.log("Snowflake tables loaded:", tableList); // ADD THIS
 
//     setSnowflakeTables(tableList);
//   } catch (error: any) {
//     toast({ title: "Failed to Load Tables", description: error.message, variant: "destructive" });
//     setCurrentSnowflakeSchema(null);
//   } finally {
//     setIsLoading(false);
//   }
// };
 
 
//   const toggleFile = (fileId: string) => {
//     setSelectedFiles(prev =>
//       prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
//     );
//   };
 
//   const displayFiles =
//   (isS3 ||
//     isAzure ||
//     isOneLake ||
//     isDelta ||
//     isDatabricks ||
//     isSnowflake) &&
//   (currentContainer ||
//     currentLakehouse ||
//     currentSchema ||
//     currentSnowflakeSchema)
//     ? (() => {
//         console.log(
//           "isSnowflake:",
//           isSnowflake,
//           "snowflakeTables:",
//           snowflakeTables
//         );
 
//         if (isDelta) {
//           return tables.map((table) => {
//             const tableName =
//               table.name ||
//               table.displayName ||
//               Object.values(table)[0] ||
//               "Unknown Table";
 
//             const tableType = table.type || "Delta Table";
 
//             return {
//               id: tableName,
//               name: tableName,
//               size: tableType,
//               rows: "Table",
//             };
//           });
//         }
 
//         if (isDatabricks) {
//           return databricksTables.map((table) => ({
//             id: table,
//             name: table,
//             size: "Databricks Table",
//             rows: "Table",
//           }));
//         }
 
//         if (isSnowflake) {
//           return snowflakeTables.map((table) => ({
//             id: table,
//             name: table,
//             size: "Snowflake Table",
//             rows: "Table",
//           }));
//         }
 
//         // Default object storage (S3 / Azure / OneLake)
//         return objects.map((obj) => {
//           const id =
//             typeof obj === "string" ? obj : obj.key || obj.name;
 
//           const size =
//             typeof obj === "string"
//               ? "Unknown"
//               : `${(obj.size / 1024 / 1024).toFixed(2)} MB`;
 
//           return {
//             id,
//             name: id,
//             size,
//             rows: "Unknown",
//           };
//         });
//       })()
//     : files;

// const handleConfirm = () => {
//   if (isS3 || isAzure || isOneLake || isDelta || isDatabricks || isSnowflake) {
//     // const selected = displayFiles
//     //   .filter(f => selectedFiles.includes(f.id))
//     //   .map(file => ({
//     //     id: file.id,
//     //     name: file.name,
//     //     size: file.size,
//     //     rows: file.rows
//     //   }));
//     const selected = displayFiles
//   .filter(f => selectedFiles.includes(f.id))
//   .map(file => {
//     let fullPath = file.name;

//     if (isS3 && currentContainer) {
//       fullPath = `${currentContainer}/${file.name}`;
//     } else if (isAzure && currentContainer) {
//       fullPath = `${currentContainer}/${file.name}`;
//     } else if (isOneLake && currentWorkspace && currentLakehouse && currentPath) {
//       // fullPath = `${currentPath.replace("Files", "").replace(/^\//, "")}/${file.name}`.replace(/^\//, '');
//         fullPath = `${currentPath}/${file.name}`;
//       if (fullPath.startsWith('/')) fullPath = fullPath.slice(1);
//     } else if (isDatabricks && currentCatalog && currentSchema) {
//       // fullPath = `${currentCatalog}/${currentSchema}/${file.name}`;
//       fullPath = file.name;
//     } else if (isSnowflake && currentDatabase && currentSnowflakeSchema) {
//       fullPath = `${currentDatabase}/${currentSnowflakeSchema}/${file.name}`;
//     }

//     return {
//       id: file.id,
//       name: file.name,
//       fullPath, // This is critical
//       size: file.size,
//       rows: file.rows,
//     };
//   });
 
//     // Pass credentials + files back
//     // onSelect(
//     //   selected,
//     //   isS3 ? s3Credentials :
//     //   isAzure ? azureCredentials :
//     //   isOneLake ? oneLakeCredentials :
//     //   isDelta ? deltaCredentials :
//     //   isDatabricks ? databricksCredentials :
//     //   isSnowflake ? snowflakeCredentials : undefined
//     // );

//     onSelect(
//   selected,
//   isS3 ? { ...s3Credentials, bucket_name: currentContainer } :
//   isAzure ? { ...azureCredentials, container_name: currentContainer } :
//   isOneLake ? { ...oneLakeCredentials, workspace_name: currentWorkspace, lakehouse_name: currentLakehouse } :
//   isDatabricks ? { ...databricksCredentials, catalog: currentCatalog, schema: currentSchema } :
//   isSnowflake ? { ...snowflakeCredentials, database: currentDatabase, schema: currentSnowflakeSchema } :
//   undefined as any
// );

//   } else {
//     onSelect(files.filter(f => selectedFiles.includes(f.id)));
//   }
 
//   resetAndClose();
// };
 
//  const resetAndClose = () => {
//   setSelectedFiles([]);
//   setCurrentContainer(null);
//   setCurrentWorkspace(null);
//   setCurrentLakehouse(null);
//   setCurrentPath("Files");
//   setFolders([]);
//   setObjects([]);
//   setTables([]);
//   setCatalogs([]);
//   setSchemas([]);
//   setCurrentCatalog(null);
//   setCurrentSchema(null);
//   setDatabricksTables([]);
//   setSnowflakeDatabases([]);
//   setSnowflakeSchemas([]);
//   setCurrentDatabase(null);
//   setCurrentSnowflakeSchema(null);
//   setSnowflakeTables([]);
//   onOpenChange(false);
// };
 
// const handleBack = () => {
//   if ((isOneLake || isDelta) && currentLakehouse) {
//     setCurrentLakehouse(null);
//     setCurrentPath("Files");
//     setFolders([]);
//     setTables([]);
//   } else if (isDatabricks && currentSchema) {  // ADD THIS
//     setCurrentSchema(null);
//     setDatabricksTables([]);
//   } else if (isDatabricks && currentCatalog) {  // ADD THIS
//     setCurrentCatalog(null);
//     setSchemas([]);
//   }
//   else if (isSnowflake && currentSnowflakeSchema) {
//     setCurrentSnowflakeSchema(null);
//     setSnowflakeTables([]);
//   } else if (isSnowflake && currentDatabase) {
//     setCurrentDatabase(null);
//     setSnowflakeSchemas([]);
//   }
//   else {
//     setCurrentContainer(null);
//     setCurrentWorkspace(null);
//     setObjects([]);
//   }
//   setSelectedFiles([]);
// };
 
 
//   const handleClose = resetAndClose;
 
// // Databricks - Catalog Selection
//   if (isDatabricks && !currentCatalog) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Select Catalog - Databricks</DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {catalogs.map(catalog => (
//                   <div
//                     key={catalog}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadDatabricksSchemas(catalog)}
//                   >
//                     <Folder className="h-5 w-5 text-blue-500" />
//                     <p className="font-medium">{catalog}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
//   // Databricks - Schema Selection
//   if (isDatabricks && currentCatalog && !currentSchema) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={handleBack}>
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 Select Schema in {currentCatalog}
//               </div>
//             </DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {schemas.map(schema => (
//                   <div
//                     key={schema}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadDatabricksTablesList(schema)}
//                   >
//                     <Folder className="h-5 w-5 text-green-500" />
//                     <p className="font-medium">{schema}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
 
//   if (isOneLake && !currentWorkspace) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Select Workspace from {sourceName}</DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {containers.map(workspace => (
//                   <div
//                     key={workspace}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadOneLakeLakehouses(workspace)}
//                   >
//                     <Folder className="h-5 w-5 text-blue-500" />
//                     <p className="font-medium">{workspace}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
//   if (isOneLake && currentWorkspace && !currentLakehouse) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={handleBack}>
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 Select Lakehouse in {currentWorkspace}
//               </div>
//             </DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {lakehouses.map(lakehouse => (
//                   <div
//                     key={lakehouse}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadOneLakeFolderContents(lakehouse)}
//                   >
//                     <Folder className="h-5 w-5 text-green-500" />
//                     <p className="font-medium">{lakehouse}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
//   if ((isS3 || isAzure) && !currentContainer) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Select {isS3 ? "Bucket" : "Container"} from {sourceName}</DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {containers.map(container => (
//                   <div
//                     key={container}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => isS3 ? loadS3Objects(container) : loadAzureBlobs(container)}
//                   >
//                     <Folder className="h-5 w-5 text-blue-500" />
//                     <p className="font-medium">{container}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
//   // Snowflake - Database Selection
//   if (isSnowflake && !currentDatabase) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>Select Database - Snowflake</DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {snowflakeDatabases.map(database => (
//                   <div
//                     key={database}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadSnowflakeSchemas(database)}
//                   >
//                     <Folder className="h-5 w-5 text-blue-500" />
//                     <p className="font-medium">{database}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
//   // Snowflake - Schema Selection
//   if (isSnowflake && currentDatabase && !currentSnowflakeSchema) {
//     return (
//       <Dialog open={open} onOpenChange={handleClose}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={handleBack}>
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 Select Schema in {currentDatabase}
//               </div>
//             </DialogTitle>
//           </DialogHeader>
 
//           {isLoading ? (
//             <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//           ) : (
//             <ScrollArea className="max-h-96">
//               <div className="space-y-2 pr-4">
//                 {snowflakeSchemas.map(schema => (
//                   <div
//                     key={schema}
//                     className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                     onClick={() => loadSnowflakeTablesList(schema)}
//                   >
//                     <Folder className="h-5 w-5 text-green-500" />
//                     <p className="font-medium">{schema}</p>
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           )}
 
//           <div className="flex justify-end mt-4">
//             <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     );
//   }
 
//  return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {(isS3 || isAzure || isOneLake || isDatabricks || isSnowflake) ? (
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={handleBack}>
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 Select {isDatabricks || isSnowflake ? "Tables" : "Files"}
//               </div>
//             ) : (
//               `Select Files from ${sourceName}`
//             )}
//           </DialogTitle>
//         </DialogHeader>
 
//         {isLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//         ) : (
//           <ScrollArea className="max-h-96">
//             <div className="space-y-2 pr-4">
 
//               {/* ----------------------------- */}
//               {/* ⭐ OneLake folder navigation */}
//               {/* ----------------------------- */}
//               {isOneLake && folders.length > 0 && (
//                 <>
//                   {currentPath !== "Files" && (
//                     <div
//                       className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
//                       onClick={handleNavigateBack}
//                     >
//                       <ArrowLeft className="h-5 w-5 text-muted-foreground" />
//                       <p className="font-medium">..</p>
//                     </div>
//                   )}
 
//                   {folders.map((folder) => (
//                     <div
//                       key={folder}
//                       className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
//                       onClick={() => handleFolderClick(folder)}
//                     >
//                       <Folder className="h-5 w-5 text-yellow-500" />
//                       <p className="font-medium">{folder}</p>
//                     </div>
//                   ))}
 
//                   {folders.length > 0 && displayFiles.length > 0 && (
//                     <div className="border-t my-2" />
//                   )}
//                 </>
//               )}
 
//               {/* ----------------------------- */}
//               {/* Existing file list rendering */}
//               {/* ----------------------------- */}
//               {displayFiles.map((file) => (
//                 <div
//                   key={file.id}
//                   className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
//                   onClick={() => toggleFile(file.id)}
//                 >
//                   <Checkbox
//                     checked={selectedFiles.includes(file.id)}
//                     onCheckedChange={() => toggleFile(file.id)}
//                   />
//                   <div className="flex-1">
//                     <p className="font-medium">{file.name}</p>
//                     <p className="text-sm text-muted-foreground">{file.size} • {file.rows}</p>
//                   </div>
//                 </div>
//               ))}
 
//             </div>
//           </ScrollArea>
//         )}
 
//         <div className="flex justify-end mt-4 gap-3">
//           <Button variant="outline" onClick={handleClose}>Cancel</Button>
//           <Button onClick={handleConfirm} disabled={selectedFiles.length === 0}>
//             Add {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
 
 import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Folder, ArrowLeft } from "lucide-react";
 
import {
  getS3Buckets,
  getS3Objects,
  S3Credentials,
  getAzureContainers,
  getAzureBlobs,
  AzureCredentials,
  getOneLakeWorkspaces,
  getOneLakeLakehouses,
  getOneLakeFolderContents,
  OneLakeCredentials,
  navigateBack,
  getOneLakeTables,
  getDatabricksCatalogs,
  getDatabricksSchemas,
  getDatabricksTables,
  DatabricksCredentials,
  getSnowflakeDatabases,
  getSnowflakeSchemas,
  getSnowflakeTables,
  SnowflakeCredentials
} from "@/components/api/api";
 
import { toast } from "@/hooks/use-toast";
 
interface FileOption {
  id: string;
  name: string;
  size: string;
  rows: string;
}
 
interface FilePickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceName: string;
  files: FileOption[];
  onSelect: (
    files: FileOption[],
    credentials?: S3Credentials | AzureCredentials | OneLakeCredentials | DatabricksCredentials | SnowflakeCredentials
  ) => void;
  s3Credentials?: S3Credentials | null;
  azureCredentials?: AzureCredentials | null;
  oneLakeCredentials?: OneLakeCredentials | null;
  deltaCredentials?: OneLakeCredentials | null;
  databricksCredentials?: DatabricksCredentials | null;
  snowflakeCredentials?: SnowflakeCredentials | null;
  isS3?: boolean;
  isAzure?: boolean;
  isOneLake?: boolean;
  isDelta?: boolean;
  isDatabricks?: boolean;
  isSnowflake?: boolean;
}
 
export function FilePickerDialog({
  open,
  onOpenChange,
  sourceName,
  files,
  onSelect,
  s3Credentials,
  azureCredentials,
  oneLakeCredentials,
  deltaCredentials,
  databricksCredentials,
  snowflakeCredentials,
  isS3 = false,
  isAzure = false,
  isOneLake = false,
  isDelta = false,
  isDatabricks = false,
  isSnowflake = false
}: FilePickerDialogProps) {
 
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
 
  // S3 folder navigation states
  const [currentPrefix, setCurrentPrefix] = useState<string>("");
  const [s3Folders, setS3Folders] = useState<string[]>([]);
  const [s3Files, setS3Files] = useState<string[]>([]);
 
  const [containers, setContainers] = useState<string[]>([]);
  const [currentContainer, setCurrentContainer] = useState<string | null>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
 
  const [lakehouses, setLakehouses] = useState<string[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<string | null>(null);
  const [currentLakehouse, setCurrentLakehouse] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<string>("Files");
  const [folders, setFolders] = useState<string[]>([]);
  const [tables, setTables] = useState<any[]>([]);
  const [catalogs, setCatalogs] = useState<string[]>([]);
  const [schemas, setSchemas] = useState<string[]>([]);
  const [currentCatalog, setCurrentCatalog] = useState<string | null>(null);
  const [currentSchema, setCurrentSchema] = useState<string | null>(null);
  const [databricksTables, setDatabricksTables] = useState<string[]>([]);
  const [snowflakeDatabases, setSnowflakeDatabases] = useState<string[]>([]);
  const [snowflakeSchemas, setSnowflakeSchemas] = useState<string[]>([]);
  const [currentDatabase, setCurrentDatabase] = useState<string | null>(null);
  const [currentSnowflakeSchema, setCurrentSnowflakeSchema] = useState<string | null>(null);
  const [snowflakeTables, setSnowflakeTables] = useState<string[]>([]);
 
  useEffect(() => {
    if (!open) return;
 
    if (isS3 && s3Credentials) loadS3Buckets();
    else if (isAzure && azureCredentials) loadAzureContainers();
    else if (isOneLake && oneLakeCredentials) loadOneLakeWorkspaces();
    else if (isDelta && deltaCredentials) loadDeltaWorkspaces();
    else if (isDatabricks && databricksCredentials) loadDatabricksCatalogs();
    else if (isSnowflake && snowflakeCredentials) loadSnowflakeDatabases();
  }, [open]);
 
  const loadS3Buckets = async () => {
    if (!s3Credentials) return;
 
    setIsLoading(true);
    try {
      const bucketList = await getS3Buckets(s3Credentials);
      setContainers(bucketList);
    } catch (error: any) {
      toast({ title: "Failed to Load Buckets", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadS3Objects = async (bucketName: string, prefix: string = "") => {
    if (!s3Credentials) return;
 
    setIsLoading(true);
    setCurrentContainer(bucketName);
    setCurrentPrefix(prefix);
 
    try {
      const response = await getS3Objects(bucketName, { ...s3Credentials, prefix });
      const cleanFolders = (response.folders || []).filter(
        (f: string) => f && f !== "/" && f.trim() !== "" && f.trim() !== prefix
      );
      setS3Folders(cleanFolders);
      setS3Files(response.files || []);
    } catch (error: any) {
      toast({ title: "Failed to Load Objects", description: error.message, variant: "destructive" });
      setCurrentContainer(null);
      setCurrentPrefix("");
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleS3FolderClick = (folder: string) => {
    const newPrefix = folder.endsWith("/") ? folder : `${folder}/`;
    loadS3Objects(currentContainer!, newPrefix);
  };
 
  const handleS3Back = () => {
    if (!currentPrefix) {
      setCurrentContainer(null);
      setCurrentPrefix("");
      setS3Folders([]);
      setS3Files([]);
    } else {
      const withoutTrailing = currentPrefix.replace(/\/$/, "");
      const parts = withoutTrailing.split("/");
      parts.pop();
      const parentPrefix = parts.length ? `${parts.join("/")}/` : "";
      loadS3Objects(currentContainer!, parentPrefix);
    }
    setSelectedFiles([]);
  };
 
  const loadAzureContainers = async () => {
    if (!azureCredentials) return;
 
    setIsLoading(true);
    try {
      const containerList = await getAzureContainers(azureCredentials);
      setContainers(containerList);
    } catch (error: any) {
      toast({ title: "Failed to Load Containers", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const [azurePrefix, setAzurePrefix] = useState<string>("");
  const [azureFolders, setAzureFolders] = useState<string[]>([]);
  const [azureFiles, setAzureFiles] = useState<string[]>([]);
 
  const loadAzureBlobs = async (containerName: string, prefix: string = "") => {
    if (!azureCredentials) return;
 
    setIsLoading(true);
    setCurrentContainer(containerName);
    setAzurePrefix(prefix);
 
    try {
      const response = await getAzureBlobs(containerName, {
        ...azureCredentials,
        prefix,
      });
      setAzureFolders(response.folders || []);
      setAzureFiles(response.files || []);
    } catch (error: any) {
      toast({ title: "Failed to Load Blobs", description: error.message, variant: "destructive" });
      setCurrentContainer(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleAzureFolderClick = (folderName: string) => {
    const newPrefix = `${azurePrefix}${folderName}/`;
    loadAzureBlobs(currentContainer!, newPrefix);
  };
 
  const handleAzureBack = () => {
    if (!currentContainer) return;
    if (!azurePrefix) {
      setCurrentContainer(null);
      setAzurePrefix("");
      setAzureFolders([]);
      setAzureFiles([]);
    } else {
      const withoutTrailing = azurePrefix.replace(/\/$/, "");
      const parts = withoutTrailing.split("/");
      parts.pop();
      const parentPrefix = parts.length ? `${parts.join("/")}/` : "";
      loadAzureBlobs(currentContainer, parentPrefix);
    }
    setSelectedFiles([]);
  };
 
  const loadOneLakeWorkspaces = async () => {
    if (!oneLakeCredentials) return;
 
    setIsLoading(true);
    try {
      const list = await getOneLakeWorkspaces(oneLakeCredentials);
      setContainers(list);
    } catch (error: any) {
      toast({ title: "Failed to Load Workspaces", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadOneLakeLakehouses = async (workspaceName: string) => {
    if (!oneLakeCredentials) return;
 
    setIsLoading(true);
    setCurrentWorkspace(workspaceName);
 
    try {
      const list = await getOneLakeLakehouses(workspaceName, oneLakeCredentials);
      setLakehouses(list);
    } catch (error: any) {
      toast({ title: "Failed to Load Lakehouses", description: error.message, variant: "destructive" });
      setCurrentWorkspace(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDeltaWorkspaces = async () => {
    if (!deltaCredentials) return;
 
    setIsLoading(true);
    try {
      const list = await getOneLakeWorkspaces(deltaCredentials);
      setContainers(list);
    } catch (error: any) {
      toast({ title: "Failed to Load Workspaces", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDeltaLakehouses = async (workspaceName: string) => {
    if (!deltaCredentials) return;
 
    setIsLoading(true);
    setCurrentWorkspace(workspaceName);
 
    try {
      const list = await getOneLakeLakehouses(workspaceName, deltaCredentials);
      setLakehouses(list);
    } catch (error: any) {
      toast({ title: "Failed to Load Lakehouses", description: error.message, variant: "destructive" });
      setCurrentWorkspace(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDeltaTables = async (lakehouseName: string) => {
    if (!deltaCredentials || !currentWorkspace) return;
 
    setIsLoading(true);
    setCurrentLakehouse(lakehouseName);
 
    try {
      const response = await getOneLakeTables(
        currentWorkspace,
        lakehouseName,
        deltaCredentials
      );
      setTables(response.tables || []);
    } catch (error: any) {
      toast({ title: "Failed to Load Delta Tables", description: error.message, variant: "destructive" });
      setCurrentLakehouse(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleNavigateBack = async () => {
    if (!oneLakeCredentials || !currentWorkspace || !currentLakehouse) return;
 
    setIsLoading(true);
 
    try {
      const response = await navigateBack(
        currentWorkspace,
        currentLakehouse,
        currentPath,
        oneLakeCredentials
      );
 
      setCurrentPath(response.current_path);
      setFolders(response.folders || []);
      setObjects(response.files || []);
    } catch (error: any) {
      toast({ title: "Navigation Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDatabricksCatalogs = async () => {
    if (!databricksCredentials) return;
 
    setIsLoading(true);
    try {
      const catalogList = await getDatabricksCatalogs(databricksCredentials);
      setCatalogs(catalogList);
    } catch (error: any) {
      toast({ title: "Failed to Load Catalogs", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDatabricksSchemas = async (catalogName: string) => {
    if (!databricksCredentials) return;
 
    setIsLoading(true);
    setCurrentCatalog(catalogName);
 
    try {
      const schemaList = await getDatabricksSchemas(catalogName, databricksCredentials);
      setSchemas(schemaList);
    } catch (error: any) {
      toast({ title: "Failed to Load Schemas", description: error.message, variant: "destructive" });
      setCurrentCatalog(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadDatabricksTablesList = async (schemaName: string) => {
    if (!databricksCredentials || !currentCatalog) return;
 
    setIsLoading(true);
    setCurrentSchema(schemaName);
 
    try {
      const tableList = await getDatabricksTables(
        currentCatalog,
        schemaName,
        databricksCredentials
      );
      setDatabricksTables(tableList);
    } catch (error: any) {
      toast({ title: "Failed to Load Tables", description: error.message, variant: "destructive" });
      setCurrentSchema(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadOneLakeFolderContents = async (lakehouseName: string, path: string = "Files") => {
    if (!oneLakeCredentials || !currentWorkspace) return;
 
    setIsLoading(true);
    setCurrentLakehouse(lakehouseName);
    setCurrentPath(path);
 
    try {
      const response = await getOneLakeFolderContents(
        currentWorkspace,
        lakehouseName,
        { ...oneLakeCredentials, path }
      );
 
      setFolders(response.folders || []);
      setObjects(response.files || []);
    } catch (error: any) {
      toast({
        title: "Failed to Load Folder Contents",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
 
  const handleFolderClick = (folderName: string) => {
    const nextPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    loadOneLakeFolderContents(currentLakehouse!, nextPath);
  };
 
  const loadSnowflakeDatabases = async () => {
    if (!snowflakeCredentials) return;
 
    setIsLoading(true);
    try {
      const dbList = await getSnowflakeDatabases(snowflakeCredentials);
      setSnowflakeDatabases(dbList);
    } catch (error: any) {
      toast({ title: "Failed to Load Databases", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadSnowflakeSchemas = async (databaseName: string) => {
    if (!snowflakeCredentials) return;
 
    setIsLoading(true);
    setCurrentDatabase(databaseName);
 
    try {
      const schemaList = await getSnowflakeSchemas(databaseName, snowflakeCredentials);
      setSnowflakeSchemas(schemaList);
    } catch (error: any) {
      toast({ title: "Failed to Load Schemas", description: error.message, variant: "destructive" });
      setCurrentDatabase(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const loadSnowflakeTablesList = async (schemaName: string) => {
    if (!snowflakeCredentials || !currentDatabase) return;
 
    setIsLoading(true);
    setCurrentSnowflakeSchema(schemaName);
 
    try {
      const tableList = await getSnowflakeTables(
        currentDatabase,
        schemaName,
        snowflakeCredentials
      );
      setSnowflakeTables(tableList);
    } catch (error: any) {
      toast({ title: "Failed to Load Tables", description: error.message, variant: "destructive" });
      setCurrentSnowflakeSchema(null);
    } finally {
      setIsLoading(false);
    }
  };
 
  const toggleFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };
 
  const displayFiles =
    (isS3 ||
      isAzure ||
      isOneLake ||
      isDelta ||
      isDatabricks ||
      isSnowflake) &&
    (currentContainer ||
      currentLakehouse ||
      currentSchema ||
      currentSnowflakeSchema)
      ? (() => {
          if (isDelta) {
            return tables.map((table) => {
              const tableName =
                table.name ||
                table.displayName ||
                Object.values(table)[0] ||
                "Unknown Table";
 
              const tableType = table.type || "Delta Table";
 
              return {
                id: tableName,
                name: tableName,
                size: tableType,
                rows: "Table",
              };
            });
          }
 
          if (isDatabricks) {
            return databricksTables.map((table) => ({
              id: table,
              name: table,
              size: "Databricks Table",
              rows: "Table",
            }));
          }
 
          if (isSnowflake) {
            return snowflakeTables.map((table) => ({
              id: table,
              name: table,
              size: "Snowflake Table",
              rows: "Table",
            }));
          }
 
          if (isS3 && currentContainer) {
            return s3Files.map((name) => ({
              id: name,
              name,
              size: "Unknown",
              rows: "Unknown",
            }));
          }
 
          if (isAzure && currentContainer) {
            return azureFiles.map((fullPath) => {
              const parts = fullPath.split("/");
              const fileName = parts[parts.length - 1] || fullPath;
              return {
                id: fullPath,
                name: fileName,
                size: "Unknown",
                rows: "Unknown",
              };
            });
          }
 
          return objects.map((obj) => {
            const id =
              typeof obj === "string" ? obj : obj.key || obj.name;
 
            const size =
              typeof obj === "string"
                ? "Unknown"
                : `${(obj.size / 1024 / 1024).toFixed(2)} MB`;
 
            return {
              id,
              name: id,
              size,
              rows: "Unknown",
            };
          });
        })()
      : files;
 
  const handleConfirm = () => {
    if (isS3 || isAzure || isOneLake || isDelta || isDatabricks || isSnowflake) {
      const selected = displayFiles
        .filter(f => selectedFiles.includes(f.id))
        .map(file => {
          let fullPath = file.id;
 
          if (isS3 && currentContainer) {
            fullPath = `${currentContainer}/${currentPrefix}${file.name}`.replace(/\/+/g, "/");
          } else if (isAzure && currentContainer) {
            fullPath = file.id;
          } else if (isOneLake && currentWorkspace && currentLakehouse && currentPath) {
            fullPath = `${currentPath}/${file.name}`;
            if (fullPath.startsWith('/')) fullPath = fullPath.slice(1);
          } else if (isDatabricks && currentCatalog && currentSchema) {
            fullPath = file.name;
          } else if (isSnowflake && currentDatabase && currentSnowflakeSchema) {
            fullPath = `${currentDatabase}/${currentSnowflakeSchema}/${file.name}`;
          }
 
          return {
            id: file.id,
            name: file.name,
            fullPath,
            size: file.size,
            rows: file.rows,
          };
        });
 
      onSelect(
        selected,
        isS3 ? { ...s3Credentials, bucket_name: currentContainer } :
        isAzure ? { ...azureCredentials, container_name: currentContainer } :
        isOneLake ? { ...oneLakeCredentials, workspace_name: currentWorkspace, lakehouse_name: currentLakehouse } :
        isDatabricks ? { ...databricksCredentials, catalog: currentCatalog, schema: currentSchema } :
        isSnowflake ? { ...snowflakeCredentials, database: currentDatabase, schema: currentSnowflakeSchema } :
        undefined as any
      );
    } else {
      onSelect(files.filter(f => selectedFiles.includes(f.id)));
    }
 
    resetAndClose();
  };
 
  const resetAndClose = () => {
    setSelectedFiles([]);
    setCurrentContainer(null);
    setCurrentPrefix("");
    setS3Folders([]);
    setS3Files([]);
    setAzurePrefix("");
    setAzureFolders([]);
    setAzureFiles([]);
    setCurrentWorkspace(null);
    setCurrentLakehouse(null);
    setCurrentPath("Files");
    setFolders([]);
    setObjects([]);
    setTables([]);
    setCatalogs([]);
    setSchemas([]);
    setCurrentCatalog(null);
    setCurrentSchema(null);
    setDatabricksTables([]);
    setSnowflakeDatabases([]);
    setSnowflakeSchemas([]);
    setCurrentDatabase(null);
    setCurrentSnowflakeSchema(null);
    setSnowflakeTables([]);
    onOpenChange(false);
  };
 
  const handleBack = () => {
    if (isS3) {
      handleS3Back();
      return;
    }
 
    if (isAzure) {
      handleAzureBack();
      return;
    }
 
    if ((isOneLake || isDelta) && currentLakehouse) {
      setCurrentLakehouse(null);
      setCurrentPath("Files");
      setFolders([]);
      setTables([]);
    } else if (isDatabricks && currentSchema) {
      setCurrentSchema(null);
      setDatabricksTables([]);
    } else if (isDatabricks && currentCatalog) {
      setCurrentCatalog(null);
      setSchemas([]);
    }
    else if (isSnowflake && currentSnowflakeSchema) {
      setCurrentSnowflakeSchema(null);
      setSnowflakeTables([]);
    } else if (isSnowflake && currentDatabase) {
      setCurrentDatabase(null);
      setSnowflakeSchemas([]);
    }
    else {
      setCurrentContainer(null);
      setCurrentWorkspace(null);
      setObjects([]);
    }
    setSelectedFiles([]);
  };
 
  const handleClose = resetAndClose;
 
  // ─── Early returns for hierarchical views ────────────────────────────────
  if (isDatabricks && !currentCatalog) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Catalog - Databricks</DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {catalogs.map(catalog => (
                  <div
                    key={catalog}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadDatabricksSchemas(catalog)}
                  >
                    <Folder className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">{catalog}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if (isDatabricks && currentCatalog && !currentSchema) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Schema in {currentCatalog}
              </div>
            </DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {schemas.map(schema => (
                  <div
                    key={schema}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadDatabricksTablesList(schema)}
                  >
                    <Folder className="h-5 w-5 text-green-500" />
                    <p className="font-medium">{schema}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if (isOneLake && !currentWorkspace) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Workspace from {sourceName}</DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {containers.map(workspace => (
                  <div
                    key={workspace}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadOneLakeLakehouses(workspace)}
                  >
                    <Folder className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">{workspace}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if (isOneLake && currentWorkspace && !currentLakehouse) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Lakehouse in {currentWorkspace}
              </div>
            </DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {lakehouses.map(lakehouse => (
                  <div
                    key={lakehouse}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadOneLakeFolderContents(lakehouse)}
                  >
                    <Folder className="h-5 w-5 text-green-500" />
                    <p className="font-medium">{lakehouse}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if ((isS3 || isAzure) && !currentContainer) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select {isS3 ? "Bucket" : "Container"} from {sourceName}</DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {containers.map(container => (
                  <div
                    key={container}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => isS3 ? loadS3Objects(container) : loadAzureBlobs(container)}
                  >
                    <Folder className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">{container}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if (isSnowflake && !currentDatabase) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Database - Snowflake</DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {snowflakeDatabases.map(database => (
                  <div
                    key={database}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadSnowflakeSchemas(database)}
                  >
                    <Folder className="h-5 w-5 text-blue-500" />
                    <p className="font-medium">{database}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  if (isSnowflake && currentDatabase && !currentSnowflakeSchema) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Schema in {currentDatabase}
              </div>
            </DialogTitle>
          </DialogHeader>
 
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : (
            <ScrollArea className="max-h-96">
              <div className="space-y-2 pr-4">
                {snowflakeSchemas.map(schema => (
                  <div
                    key={schema}
                    className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => loadSnowflakeTablesList(schema)}
                  >
                    <Folder className="h-5 w-5 text-green-500" />
                    <p className="font-medium">{schema}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
 
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
 
  // ─── Main content ────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {(isS3 || isAzure || isOneLake || isDatabricks || isSnowflake) ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select {isDatabricks || isSnowflake ? "Tables" : "Files"}
              </div>
            ) : (
              `Select Files from ${sourceName}`
            )}
          </DialogTitle>
        </DialogHeader>
 
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-4">
 
              {/* S3 Folders */}
              {isS3 && currentContainer && (
                <>
                  {s3Folders.map((folder) => {
                    const segments = folder.replace(/\/$/, "").split("/");
                    const folderLabel = segments[segments.length - 1] || folder;
 
                    return (
                      <div
                        key={folder}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => handleS3FolderClick(folder)}
                      >
                        <Folder className="h-5 w-5 text-yellow-500" />
                        <p className="font-medium">{folderLabel}</p>
                      </div>
                    );
                  })}
 
                  {s3Folders.length > 0 && s3Files.length > 0 && (
                    <div className="border-t my-2" />
                  )}
                </>
              )}
 
              {/* Azure Blob Folders */}
              {isAzure && currentContainer && azureFolders.length > 0 && (
                <>
                  {azureFolders.map((folder) => (
                    <div
                      key={folder}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => handleAzureFolderClick(folder)}
                    >
                      <Folder className="h-5 w-5 text-yellow-500" />
                      <p className="font-medium">{folder}</p>
                    </div>
                  ))}
 
                  {azureFolders.length > 0 && azureFiles.length > 0 && (
                    <div className="border-t my-2" />
                  )}
                </>
              )}
 
              {/* OneLake folder navigation */}
              {isOneLake && folders.length > 0 && (
                <>
                  {currentPath !== "Files" && (
                    <div
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={handleNavigateBack}
                    >
                      <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                      <p className="font-medium">..</p>
                    </div>
                  )}
 
                  {folders.map((folder) => (
                    <div
                      key={folder}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                      onClick={() => handleFolderClick(folder)}
                    >
                      <Folder className="h-5 w-5 text-yellow-500" />
                      <p className="font-medium">{folder}</p>
                    </div>
                  ))}
 
                  {folders.length > 0 && displayFiles.length > 0 && (
                    <div className="border-t my-2" />
                  )}
                </>
              )}
 
              {/* Files list – square checkboxes */}
              {displayFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => toggleFile(file.id)}
                >
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => toggleFile(file.id)}
                    className="rounded border border-gray-400 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{file.size} • {file.rows}</p>
                  </div>
                </div>
              ))}
 
            </div>
          </ScrollArea>
        )}
 
        <div className="flex justify-end mt-4 gap-3">
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={selectedFiles.length === 0}>
            Add {selectedFiles.length} File{selectedFiles.length !== 1 ? "s" : ""}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
 

