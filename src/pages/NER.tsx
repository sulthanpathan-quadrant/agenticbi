 
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { MapPin, RefreshCw, Smile, CheckCircle, XCircle, Loader2 } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "sonner";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { ArrowLeft, ArrowRight, Plus, Save, Table as TableIcon, ChevronDown, ChevronUp, History, LayoutGrid,SkipForward  } from "lucide-react";
 
// interface EntityMatch {
//   type: string;
//   Name: string;
//   "Resolved name": string;
//   Confidence: string;
// }
 
// interface Dataset {
//   filename: string;
//   last_modified: string;
// }
 
// function Stat({
//   label,
//   value,
//   icon,
// }: {
//   label: string;
//   value: number;
//   icon?: React.ReactNode;
// }) {
//   return (
//     <div className="border rounded-lg p-6 bg-card">
//       <div className="flex justify-between mb-2">
//         <span className="text-sm text-muted-foreground">{label}</span>
//         {icon}
//       </div>
//       <div className="text-3xl font-bold">{value}</div>
//     </div>
//   );
// }
 
// export default function NER() {
//   const navigate = useNavigate();
 
//   const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
//   const [nerResults, setNerResults] = useState(false);
//   const [entityMatches, setEntityMatches] = useState<EntityMatch[]>([]);
//   const [stats, setStats] = useState({ accepted: 0, rejected: 0, pending: 0 });
//   const [runningNER, setRunningNER] = useState(false);
 
//   const [datasets, setDatasets] = useState<Dataset[]>([]);
//   const [loadingDatasets, setLoadingDatasets] = useState(true);
 
//   const user = localStorage.getItem("user");
//   const userId = user ? JSON.parse(user).id : null;
//   const jobId = localStorage.getItem("current_job_id");
 
//   // Fetch available datasets
//   useEffect(() => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information. Please log in again.");
//       setLoadingDatasets(false);
//       return;
//     }
 
//     const fetchDatasets = async () => {
//       setLoadingDatasets(true);
//       try {
//         const url = `https://20.81.213.147/list-datasets?user_id=${userId}&job_id=${jobId}`;
 
//         const res = await fetch(url, {
//           headers: {
//             accept: "application/json",
//           },
//         });
 
//         if (!res.ok) {
//           throw new Error(`Failed to fetch datasets: ${res.status}`);
//         }
 
//         const data = await res.json();
 
//         if (data.datasets && Array.isArray(data.datasets)) {
//           setDatasets(data.datasets);
//           if (data.datasets.length > 0) {
//             setSelectedFiles([data.datasets[0].filename]); // Auto-select first
//           }
//         } else {
//           setDatasets([]);
//           toast.info(data.message || "No datasets available in this job");
//         }
//       } catch (err) {
//         console.error("Error fetching datasets:", err);
//         toast.error("Failed to load available datasets");
//       } finally {
//         setLoadingDatasets(false);
//       }
//     };
 
//     fetchDatasets();
//   }, [userId, jobId]);
 
//   const toggleFileSelection = (fileName: string) => {
//     setSelectedFiles((prev) =>
//       prev.includes(fileName)
//         ? prev.filter((f) => f !== fileName)
//         : [...prev, fileName]
//     );
//   };
 
//   const getBlobPath = (filename: string) => {
//     return `${userId}/${jobId}/${filename.endsWith(".csv") ? filename : `${filename}.csv`}`;
//   };
 
//   // New helper function: Update job options → set ner: true
//   const updateNEROption = async () => {
//     if (!userId || !jobId) {
//       console.warn("Cannot update NER option — missing userId or jobId");
//       return false;
//     }
 
//     const payload = {
//       user_id: userId,
//       job_id: jobId,
//       ner: true,
//     };
 
//     try {
//       const response = await fetch("https://20.81.213.147/set-job-options", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });
 
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to set ner option: ${response.status} - ${errorText}`);
//       }
 
//       const result = await response.json();
 
//       if (result.status === "success") {
//         console.log("Successfully set ner: true in job options");
//         return true;
//       } else {
//         throw new Error(result.message || "Failed to update NER flag");
//       }
//     } catch (err) {
//       console.error("Error setting ner=true:", err);
//       // We don't block the flow if this fails
//       // toast.warning("Could not update NER job option");
//       return false;
//     }
//   };
 
//   const handleRunNER = async () => {
//     if (selectedFiles.length === 0) {
//       toast.error("Please select at least one dataset to process");
//       return;
//     }
 
//     if (selectedFiles.length > 1) {
//       toast.warning("Processing only the first selected file for now");
//     }
 
//     setRunningNER(true);
 
//     // 1. First update the job option (set ner: true)
//     await updateNEROption();
 
//     // 2. Then proceed with actual NER processing
//     const selectedFilename = selectedFiles[0];
//     const blobPath = getBlobPath(selectedFilename);
//     console.log("Running NER with blob path:", blobPath);
 
//     try {
//       const res = await fetch(

//         // "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/resolve_entities",

//         "https://20.81.213.147/resolve_entities",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             accept: "application/json",
//           },
//           body: JSON.stringify({
//             input_type: "azure",
//             azure_blob_path: blobPath,
//           }),
//         }
//       );
 
//       if (!res.ok) {
//         throw new Error(`NER request failed: ${res.status}`);
//       }
 
//       const json = await res.json();
//       const resolutions: EntityMatch[] = json.resolutions || [];
 
//       setEntityMatches(resolutions);
//       setStats({
//         accepted: 0,
//         rejected: 0,
//         pending: resolutions.length,
//       });
 
//       setNerResults(true);
 
//       if (resolutions.length > 0) {
//         toast.success(`Found ${resolutions.length} entities`);
//       } else {
//         toast.info("No entities found in the selected file");
//       }
//     } catch (err) {
//       console.error("NER error:", err);
//       toast.error("Failed to run Named Entity Resolution");
//     } finally {
//       setRunningNER(false);
//     }
//   };
 
//   const handleChooseAll = async () => {
//     if (selectedFiles.length === 0) {
//       toast.error("No file selected");
//       return;
//     }
 
//     const selectedFilename = selectedFiles[0];
//     const blobPath = getBlobPath(selectedFilename);
 
//     try {
//       const res = await fetch(

//         // "https://ingestq-backend-954554516.ap-south-1.elb.amazonaws.com/chooseapply",
//           "https://20.81.213.147/chooseapply",

//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             accept: "application/json",
//           },
//           body: JSON.stringify({
//             input_type: "azure",
//             chosen: entityMatches,
//             azure_blob_path: blobPath,
//           }),
//         }
//       );
 
//       if (!res.ok) throw new Error("Apply failed");
 
//       const json = await res.json();
 
//       toast.success("All entities applied successfully");
//       toast.success(json.message || "Resolutions applied");
 
//       setStats({
//         accepted: entityMatches.length,
//         rejected: 0,
//         pending: 0,
//       });
//     } catch (err) {
//       console.error("Choose all error:", err);
//       toast.error("Failed to apply resolutions");
//     }
//   };
 
//   return (
//     <WorkflowLayout>
//       <div className="p-8">
//         {/* Header */}
//         <div className="flex justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-bold mb-2">Named Entity Resolution</h1>
//             <p className="text-muted-foreground">
//               Review and resolve entity matches in your dataset
//             </p>
//           </div>
//           <Button
//             onClick={handleRunNER}
//             disabled={runningNER || loadingDatasets || datasets.length === 0}
//           >
//             {runningNER ? (
//               <>
//                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                 Running NER...
//               </>
//             ) : (
//               <>
//                 <RefreshCw className="h-4 w-4 mr-2" />
//                 Run NER
//               </>
//             )}
//           </Button>
//         </div>
 
//         {/* Stats */}
//         {nerResults && (
//           <div className="grid grid-cols-4 gap-4 mb-6">
//             <Stat label="Total Matches" value={entityMatches.length} />
//             <Stat
//               label="Pending"
//               value={stats.pending}
//               icon={<Smile className="h-5 w-5 text-yellow-500" />}
//             />
//             <Stat
//               label="Accepted"
//               value={stats.accepted}
//               icon={<CheckCircle className="h-5 w-5 text-green-500" />}
//             />
//             <Stat
//               label="Rejected"
//               value={stats.rejected}
//               icon={<XCircle className="h-5 w-5 text-red-500" />}
//             />
//           </div>
//         )}
 
//         {/* Datasets List */}
//         <div className="border rounded-lg overflow-hidden bg-card mb-6">
//           {loadingDatasets ? (
//             <div className="flex flex-col items-center justify-center py-12">
//               <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//               <p className="text-muted-foreground">Loading available datasets...</p>
//             </div>
//           ) : datasets.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               No datasets found for this job
//             </div>
//           ) : (
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-muted/50 border-b border-border">
//                   <TableHead className="w-12"></TableHead>
//                   <TableHead className="font-medium">File Name</TableHead>
//                   <TableHead className="font-medium">Last Modified</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {datasets.map((file) => {
//                   const isSelected = selectedFiles.includes(file.filename);
//                   return (
//                     <TableRow
//                       key={file.filename}
//                       className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border last:border-0"
//                       onClick={() => toggleFileSelection(file.filename)}
//                     >
//                       <TableCell>
//                         <Checkbox
//                           checked={isSelected}
//                           onCheckedChange={() => toggleFileSelection(file.filename)}
//                         />
//                       </TableCell>
//                       <TableCell className="font-medium">{file.filename}</TableCell>
//                       <TableCell className="text-sm text-muted-foreground">
//                         {new Date(file.last_modified).toLocaleString()}
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           )}
//         </div>
 
//         {/* Entity Matches */}
//         {nerResults && (
//           <div className="border rounded-lg p-6 bg-card mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Entity Matches</h2>
//               {entityMatches.length > 0 && (
//                 <Button variant="outline" onClick={handleChooseAll}>
//                   Choose All Entities
//                 </Button>
//               )}
//             </div>
 
//             {entityMatches.length === 0 ? (
//               <p className="text-muted-foreground text-center py-8">
//                 No entities detected in the selected dataset
//               </p>
//             ) : (
//               <div className="space-y-4">
//                 {entityMatches.map((entity, index) => (
//                   <div key={index} className="border rounded-lg p-4 bg-card/50">
//                     <div className="flex items-center gap-4 flex-wrap">
//                       <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
//                       <Badge variant="secondary">{entity.type}</Badge>
//                       <span className="font-medium">{entity.Name}</span>
//                       <span className="text-primary">→</span>
//                       <span className="font-medium">{entity["Resolved name"]}</span>
//                       <span className="text-sm text-muted-foreground ml-auto">
//                         Confidence: {entity.Confidence}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}
 
//         {/* Bottom Navigation */}
//         <div className="flex justify-between">
//           <Button variant="outline" onClick={() => navigate("/workflow/data-quality")}>
//             Back to Data Quality
//           </Button>
//           <Button
//             onClick={() => navigate("/workflow/business-logic")}
//             disabled={stats.pending > 0}
//           >
//             <SkipForward className="h-4 w-4" />
//             Skip
//           </Button>
//         </div>
//       </div>
//     </WorkflowLayout>
//   );
// }
 


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, Smile, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, ArrowRight, Plus, Save, Table as TableIcon, ChevronDown, ChevronUp, History, LayoutGrid, SkipForward } from "lucide-react";

interface EntityMatch {
  type: string;
  Name: string;
  "Resolved name": string;
  Confidence: string;
}

interface Dataset {
  filename: string;
  last_modified: string;
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon?: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-muted-foreground">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

export default function NER() {
  const navigate = useNavigate();

  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [nerResults, setNerResults] = useState(false);
  const [entityMatches, setEntityMatches] = useState<EntityMatch[]>([]);
  const [stats, setStats] = useState({ accepted: 0, rejected: 0, pending: 0 });
  const [runningNER, setRunningNER] = useState(false);

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  const user = localStorage.getItem("user");
  const userId = user ? JSON.parse(user).id : null;
  const jobId = localStorage.getItem("current_job_id");

  // Reusable close button for all toasts (Sonner style)
  const closeToastButton = (
    <button
      onClick={() => toast.dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // Fetch available datasets
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information. Please log in again.", {
        duration: 3000,
        action: closeToastButton,
      });
      setLoadingDatasets(false);
      return;
    }

    const fetchDatasets = async () => {
      setLoadingDatasets(true);
      try {
        const url = `https://api.veriton.ai/api/service2/list-datasets?user_id=${userId}&job_id=${jobId}`;

        const res = await fetch(url, {
          headers: {
            accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch datasets: ${res.status}`);
        }

        const data = await res.json();

        if (data.datasets && Array.isArray(data.datasets)) {
          setDatasets(data.datasets);
          if (data.datasets.length > 0) {
            setSelectedFiles([data.datasets[0].filename]); // Auto-select first
          }
        } else {
          setDatasets([]);
          toast.info(data.message || "No datasets available in this job", {
            duration: 3000,
            action: closeToastButton,
          });
        }
      } catch (err) {
        console.error("Error fetching datasets:", err);
        toast.error("Failed to load available datasets", {
          duration: 4000,
          action: closeToastButton,
        });
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

  const getBlobPath = (filename: string) => {
    return `${userId}/${jobId}/${filename.endsWith(".csv") ? filename : `${filename}.csv`}`;
  };

  // Update job options → set ner: true
  const updateNEROption = async () => {
    if (!userId || !jobId) {
      console.warn("Cannot update NER option — missing userId or jobId");
      return false;
    }

    const payload = {
      user_id: userId,
      job_id: jobId,
      ner: true,
    };

    try {
      const response = await fetch("https://api.veriton.ai/api/service2/set-job-options", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to set ner option: ${response.status} - ${errorText}`);
      }

      const result = await response.json();

      if (result.status === "success") {
        console.log("Successfully set ner: true in job options");
        return true;
      } else {
        throw new Error(result.message || "Failed to update NER flag");
      }
    } catch (err) {
      console.error("Error setting ner=true:", err);
      return false;
    }
  };

  const handleRunNER = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one dataset to process", {
        duration: 3000,
        action: closeToastButton,
      });
      return;
    }

    if (selectedFiles.length > 1) {
      toast.warning("Processing only the first selected file for now", {
        duration: 3000,
        action: closeToastButton,
      });
    }

    setRunningNER(true);

    // 1. Update job option (set ner: true)
    await updateNEROption();

    // 2. Run NER processing
    const selectedFilename = selectedFiles[0];
    const blobPath = getBlobPath(selectedFilename);
    console.log("Running NER with blob path:", blobPath);

    try {
      const res = await fetch("https://api.veriton.ai/api/service2/resolve_entities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          input_type: "azure",
          azure_blob_path: blobPath,
        }),
      });

      if (!res.ok) {
        throw new Error(`NER request failed: ${res.status}`);
      }

      const json = await res.json();
      const resolutions: EntityMatch[] = json.resolutions || [];

      setEntityMatches(resolutions);
      setStats({
        accepted: 0,
        rejected: 0,
        pending: resolutions.length,
      });

      setNerResults(true);

      if (resolutions.length > 0) {
        toast.success(`Found ${resolutions.length} entities`, {
          duration: 3000,
          action: closeToastButton,
        });
      } else {
        toast.info("No entities found in the selected file", {
          duration: 3000,
          action: closeToastButton,
        });
      }
    } catch (err) {
      console.error("NER error:", err);
      toast.error("Failed to run Named Entity Resolution", {
        duration: 4000,
        action: closeToastButton,
      });
    } finally {
      setRunningNER(false);
    }
  };

  const handleChooseAll = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No file selected", {
        duration: 3000,
        action: closeToastButton,
      });
      return;
    }

    const selectedFilename = selectedFiles[0];
    const blobPath = getBlobPath(selectedFilename);

    try {
      const res = await fetch("https://api.veriton.ai/api/service2/chooseapply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          input_type: "azure",
          chosen: entityMatches,
          azure_blob_path: blobPath,
        }),
      });

      if (!res.ok) throw new Error("Apply failed");

      const json = await res.json();

      toast.success("All entities applied successfully", {
        duration: 3000,
        action: closeToastButton,
      });
      toast.success(json.message || "Resolutions applied", {
        duration: 3000,
        action: closeToastButton,
      });

      setStats({
        accepted: entityMatches.length,
        rejected: 0,
        pending: 0,
      });
    } catch (err) {
      console.error("Choose all error:", err);
      toast.error("Failed to apply resolutions", {
        duration: 4000,
        action: closeToastButton,
      });
    }
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Named Entity Resolution</h1>
            <p className="text-muted-foreground">
              Review and resolve entity matches in your dataset
            </p>
          </div>
          <Button
            onClick={handleRunNER}
            disabled={runningNER || loadingDatasets || datasets.length === 0}
          >
            {runningNER ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running NER...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Run NER
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        {nerResults && (
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Stat label="Total Matches" value={entityMatches.length} />
            <Stat
              label="Pending"
              value={stats.pending}
              icon={<Smile className="h-5 w-5 text-yellow-500" />}
            />
            <Stat
              label="Accepted"
              value={stats.accepted}
              icon={<CheckCircle className="h-5 w-5 text-green-500" />}
            />
            <Stat
              label="Rejected"
              value={stats.rejected}
              icon={<XCircle className="h-5 w-5 text-red-500" />}
            />
          </div>
        )}

        {/* Datasets List */}
        <div className="border rounded-lg overflow-hidden bg-card mb-6">
          {loadingDatasets ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading available datasets...</p>
            </div>
          ) : datasets.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No datasets found for this job
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
                      className="cursor-pointer hover:bg-muted/30 transition-colors border-b border-border last:border-0"
                      onClick={() => toggleFileSelection(file.filename)}
                    >
                      <TableCell>
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleFileSelection(file.filename)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{file.filename}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(file.last_modified).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Entity Matches */}
        {nerResults && (
          <div className="border rounded-lg p-6 bg-card mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Entity Matches</h2>
              {entityMatches.length > 0 && (
                <Button variant="outline" onClick={handleChooseAll}>
                  Choose All Entities
                </Button>
              )}
            </div>

            {entityMatches.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No entities detected in the selected dataset
              </p>
            ) : (
              <div className="space-y-4">
                {entityMatches.map((entity, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-card/50">
                    <div className="flex items-center gap-4 flex-wrap">
                      <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                      <Badge variant="secondary">{entity.type}</Badge>
                      <span className="font-medium">{entity.Name}</span>
                      <span className="text-primary">→</span>
                      <span className="font-medium">{entity["Resolved name"]}</span>
                      <span className="text-sm text-muted-foreground ml-auto">
                        Confidence: {entity.Confidence}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/workflow/data-quality")}>
            Back to Data Quality
          </Button>
          <Button
            onClick={() => navigate("/workflow/business-logic")}
            disabled={stats.pending > 0}
          >
            <SkipForward className="h-4 w-4" />
            Skip
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}