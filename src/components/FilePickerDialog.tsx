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
//   getOneLakeTables
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
//   onSelect: (files: FileOption[]) => void;
//   s3Credentials?: S3Credentials | null;
//   azureCredentials?: AzureCredentials | null;
//   oneLakeCredentials?: OneLakeCredentials | null;
//   deltaCredentials?: OneLakeCredentials | null;
//   isS3?: boolean;
//   isAzure?: boolean;
//   isOneLake?: boolean;
//   isDelta?: boolean;
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
//   isS3 = false,
//   isAzure = false,
//   isOneLake = false,
//   isDelta = false
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
 
  
//   useEffect(() => {
//   if (!open) return;

//   if (isS3 && s3Credentials) loadS3Buckets();
//   else if (isAzure && azureCredentials) loadAzureContainers();
//   else if (isOneLake && oneLakeCredentials) loadOneLakeWorkspaces();
//   else if (isDelta && deltaCredentials) loadDeltaWorkspaces();
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


//  const loadOneLakeFolderContents = async (lakehouseName: string, path: string = "Files") => {
//   if (!oneLakeCredentials) return;

//   setIsLoading(true);
//   setCurrentLakehouse(lakehouseName);
//   setCurrentPath(path);

//   try {
//     const response = await getOneLakeFolderContents(
//       lakehouseName,
//       path,
//       oneLakeCredentials
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


//   const toggleFile = (fileId: string) => {
//     setSelectedFiles(prev =>
//       prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
//     );
//   };

//   const displayFiles = (isS3 || isAzure || isOneLake || isDelta) && (currentContainer || currentLakehouse)
//   ? isDelta
//     ? tables.map((table) => {
//         const tableName = table.name || table.displayName || Object.values(table)[0] || "Unknown Table";
//         const tableType = table.type || "Delta Table";
//         return { 
//           id: tableName, 
//           name: tableName, 
//           size: tableType, 
//           rows: "Table" 
//         };
//       })
//     : objects.map((obj) => {
//         const id = typeof obj === "string" ? obj : obj.key || obj.name;
//         const size = typeof obj === "string" ? "Unknown" : `${(obj.size / 1024 / 1024).toFixed(2)} MB`;
//         return { id, name: id, size, rows: "Unknown" };
//       })
//   : files;

//   const handleConfirm = () => {
//   if (isS3 || isAzure || isOneLake || isDelta) {
//     const selected = displayFiles
//       .filter(f => selectedFiles.includes(f.id))
//       .map(file => {
//         let fullPath;
        
//         if (isDelta) {
//           fullPath = `delta://${currentWorkspace}/${currentLakehouse}/tables/${file.name}`;
//         } else if (isOneLake) {
//           fullPath = `onelake://${currentWorkspace}/${currentLakehouse}/${currentPath}/${file.name}`;
//         } else {
//           const prefix = isS3 ? "s3://" : "azure://";
//           fullPath = `${prefix}${currentContainer}/${file.name}`;
//         }

//         return { id: file.id, name: fullPath, size: file.size, rows: file.rows };
//       });

//     onSelect(selected);
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
//   onOpenChange(false);
// };

//   const handleBack = () => {
//   if ((isOneLake || isDelta) && currentLakehouse) {
//     setCurrentLakehouse(null);
//     setCurrentPath("Files");
//     setFolders([]);
//     setTables([]);
//   } else {
//     setCurrentContainer(null);
//     setCurrentWorkspace(null);
//     setObjects([]);
//   }
//   setSelectedFiles([]);
// };


//   const handleClose = resetAndClose;
//   // Delta Tables - Workspace Selection
// if (isDelta && !currentWorkspace) {
//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>Select Workspace - Delta Tables</DialogTitle>
//         </DialogHeader>

//         {isLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//         ) : (
//           <ScrollArea className="max-h-96">
//             <div className="space-y-2 pr-4">
//               {containers.map(workspace => (
//                 <div
//                   key={workspace}
//                   className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                   onClick={() => loadDeltaLakehouses(workspace)}
//                 >
//                   <Folder className="h-5 w-5 text-blue-500" />
//                   <p className="font-medium">{workspace}</p>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         )}

//         <div className="flex justify-end mt-4">
//           <Button variant="outline" onClick={handleClose}>Cancel</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Delta Tables - Lakehouse Selection
// if (isDelta && currentWorkspace && !currentLakehouse) {
//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             <div className="flex items-center gap-2">
//               <Button variant="ghost" size="icon" onClick={handleBack}>
//                 <ArrowLeft className="h-4 w-4" />
//               </Button>
//               Select Lakehouse in {currentWorkspace}
//             </div>
//           </DialogTitle>
//         </DialogHeader>

//         {isLoading ? (
//           <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
//         ) : (
//           <ScrollArea className="max-h-96">
//             <div className="space-y-2 pr-4">
//               {lakehouses.map(lakehouse => (
//                 <div
//                   key={lakehouse}
//                   className="flex items-center gap-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
//                   onClick={() => loadDeltaTables(lakehouse)}
//                 >
//                   <Folder className="h-5 w-5 text-green-500" />
//                   <p className="font-medium">{lakehouse}</p>
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>
//         )}

//         <div className="flex justify-end mt-4">
//           <Button variant="outline" onClick={handleClose}>Cancel</Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
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

//   return (
//     <Dialog open={open} onOpenChange={handleClose}>
//       <DialogContent className="max-w-2xl">
//         <DialogHeader>
//           <DialogTitle>
//             {(isS3 || isAzure || isOneLake) ? (
//               <div className="flex items-center gap-2">
//                 <Button variant="ghost" size="icon" onClick={handleBack}>
//                   <ArrowLeft className="h-4 w-4" />
//                 </Button>
//                 Select Files
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
  getOneLakeTables
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
  onSelect: (files: FileOption[]) => void;
  s3Credentials?: S3Credentials | null;
  azureCredentials?: AzureCredentials | null;
  oneLakeCredentials?: OneLakeCredentials | null;
  deltaCredentials?: OneLakeCredentials | null;
  isS3?: boolean;
  isAzure?: boolean;
  isOneLake?: boolean;
  isDelta?: boolean;
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
  isS3 = false,
  isAzure = false,
  isOneLake = false,
  isDelta = false
}: FilePickerDialogProps) {

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  
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
 
  
  useEffect(() => {
  if (!open) return;

  if (isS3 && s3Credentials) loadS3Buckets();
  else if (isAzure && azureCredentials) loadAzureContainers();
  else if (isOneLake && oneLakeCredentials) loadOneLakeWorkspaces();
  else if (isDelta && deltaCredentials) loadDeltaWorkspaces();
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

  const loadS3Objects = async (bucketName: string) => {
    if (!s3Credentials) return;
    
    setIsLoading(true);
    setCurrentContainer(bucketName);

    try {
      const response = await getS3Objects(bucketName, s3Credentials);
      setObjects(response.files || []);
    } catch (error: any) {
      toast({ title: "Failed to Load Files", description: error.message, variant: "destructive" });
      setCurrentContainer(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAzureBlobs = async (containerName: string) => {
    if (!azureCredentials) return;

    setIsLoading(true);
    setCurrentContainer(containerName);

    try {
      const response = await getAzureBlobs(containerName, azureCredentials);
      setObjects(Array.isArray(response) ? response : response.files || []);
    } catch (error: any) {
      toast({ title: "Failed to Load Blobs", description: error.message, variant: "destructive" });
      setCurrentContainer(null);
    } finally {
      setIsLoading(false);
    }
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


  const toggleFile = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const displayFiles = (isS3 || isAzure || isOneLake || isDelta) && (currentContainer || currentLakehouse)
  ? isDelta
    ? tables.map((table) => {
        const tableName = table.name || table.displayName || Object.values(table)[0] || "Unknown Table";
        const tableType = table.type || "Delta Table";
        return { 
          id: tableName, 
          name: tableName, 
          size: tableType, 
          rows: "Table" 
        };
      })
    : objects.map((obj) => {
        const id = typeof obj === "string" ? obj : obj.key || obj.name;
        const size = typeof obj === "string" ? "Unknown" : `${(obj.size / 1024 / 1024).toFixed(2)} MB`;
        return { id, name: id, size, rows: "Unknown" };
      })
  : files;

  const handleConfirm = () => {
  if (isS3 || isAzure || isOneLake || isDelta) {
    const selected = displayFiles
      .filter(f => selectedFiles.includes(f.id))
      .map(file => {
        let fullPath;
        
        if (isDelta) {
          fullPath = `delta://${currentWorkspace}/${currentLakehouse}/tables/${file.name}`;
          // fullPath=`${file.name}`;
        } else if (isOneLake) {
          fullPath = `onelake://${currentWorkspace}/${currentLakehouse}/${currentPath}/${file.name}`;
          // fullPath=file.name;
        } else {
          const prefix = isS3 ? "s3://" : "azure://";
          fullPath = `${prefix}${currentContainer}/${file.name}`;
            // fullPath=file.name;
        }

        return { id: file.id, name: fullPath, size: file.size, rows: file.rows };
      });

    onSelect(selected);
  } else {
    onSelect(files.filter(f => selectedFiles.includes(f.id)));
  }

  resetAndClose();
};

 const resetAndClose = () => {
  setSelectedFiles([]);
  setCurrentContainer(null);
  setCurrentWorkspace(null);
  setCurrentLakehouse(null);
  setCurrentPath("Files");
  setFolders([]);
  setObjects([]);
  setTables([]);
  onOpenChange(false);
};

  const handleBack = () => {
  if ((isOneLake || isDelta) && currentLakehouse) {
    setCurrentLakehouse(null);
    setCurrentPath("Files");
    setFolders([]);
    setTables([]);
  } else {
    setCurrentContainer(null);
    setCurrentWorkspace(null);
    setObjects([]);
  }
  setSelectedFiles([]);
};


  const handleClose = resetAndClose;
  // Delta Tables - Workspace Selection
if (isDelta && !currentWorkspace) {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Workspace - Delta Tables</DialogTitle>
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
                  onClick={() => loadDeltaLakehouses(workspace)}
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

// Delta Tables - Lakehouse Selection
if (isDelta && currentWorkspace && !currentLakehouse) {
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
                  onClick={() => loadDeltaTables(lakehouse)}
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {(isS3 || isAzure || isOneLake) ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                Select Files
              </div>
            ) : (
              `Select Files from ${sourceName}`
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
          <ScrollArea className="max-h-96">
            <div className="space-y-2 pr-4">

              {/* ----------------------------- */}
              {/* ⭐ OneLake folder navigation */}
              {/* ----------------------------- */}
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

              {/* ----------------------------- */}
              {/* Existing file list rendering */}
              {/* ----------------------------- */}
              {displayFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => toggleFile(file.id)}
                >
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onCheckedChange={() => toggleFile(file.id)}
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
