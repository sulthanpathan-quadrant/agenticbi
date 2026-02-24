// import { useState, useEffect, useRef } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Database, Edit, Save, ArrowLeft, Loader2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import StarSchemaDiagram from '@/components/StarSchemaDiagram';

// export default function DataModeling() {
//   const navigate = useNavigate();

//   const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [modelingData, setModelingData] = useState<any>(null);
//   const [loadingData, setLoadingData] = useState(true);
//   const [schemaData, setSchemaData] = useState<any[]>([]);
//   const [originalSchemaData, setOriginalSchemaData] = useState<any[]>([]); // backup for cancel
//   const [loadingSchema, setLoadingSchema] = useState(false);

//   const schemaSectionRef = useRef<HTMLDivElement>(null);

//   const userId = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}").id
//     : null;
//   const jobId = localStorage.getItem("current_job_id");

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

//   // Load modeling data from localStorage
//   useEffect(() => {
//     const storedData = localStorage.getItem("modeling_data");

//     if (storedData) {
//       try {
//         const parsed = JSON.parse(storedData);
//         setModelingData(parsed);

//         if (parsed.model?.fact_table) {
//           setSelectedSchema(parsed.model.fact_table);
//         }
//       } catch (error) {
//         console.error("Error parsing modeling data:", error);
//         toast.error("Failed to load modeling data", {
//           duration: 1000,
//           action: closeToastButton
//         });
//       }
//     } else {
//       toast.warning("Please ingest the data", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       // setTimeout(() => navigate("/workflow/landing-zone"), 2000);
//     }

//     setLoadingData(false);
//   }, [navigate]);

//   const handleSchemaClick = async (tableName: string) => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       return;
//     }

//     setSelectedSchema(tableName);
//     setLoadingSchema(true);
//     setSchemaData([]);
//     setOriginalSchemaData([]); // clear backup
//     setIsEditing(false); // reset edit mode when changing table

//     const isFactTable = modelingData?.tables?.find(
//       (t: any) => t.table_name === tableName && t.table_type === "FACT"
//     );

//     if (isFactTable && !tableName.includes('.csv')) {
//       try {
//         const formattedData = isFactTable.columns.map((col: any) => ({
//           columnName: col.name,
//           dataType: col.data_type.toUpperCase(),
//           example: "",
//           key: col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : "",
//         }));

//         setSchemaData(formattedData);
//         setOriginalSchemaData(formattedData); // backup
//       } catch (error) {
//         console.error("Error loading fact table:", error);
//         toast.error("Failed to load fact table details", {
//           duration: 1000,
//           action: closeToastButton
//         });
//       } finally {
//         setLoadingSchema(false);
//       }
//     } else {
//       try {
//         const fileNameWithExtension = tableName.endsWith('.csv')
//           ? tableName
//           : `${tableName}.csv`;

//         const response = await fetch(
//           `https://api.veriton.ai/api/service2/api/debug/view-schema/${userId}/${jobId}/${fileNameWithExtension}`,
//           {
//             method: "GET",
//             headers: { "Accept": "application/json" },
//           }
//         );

//         if (!response.ok) {
//           const errorText = await response.text();
//           throw new Error(`Failed to fetch schema: ${errorText}`);
//         }

//         const schemaDetails = await response.json();

//         const formattedData = schemaDetails.columns.map((col: any) => ({
//           columnName: col.column_name,
//           dataType: col.data_type.toUpperCase(),
//           example: col.example || "",
//           key: col.is_potential_key ? "PK" : col.key.toUpperCase() || "",
//         }));

//         setSchemaData(formattedData);
//         setOriginalSchemaData(formattedData); // backup
//       } catch (error: any) {
//         console.error("Error fetching schema:", error);
//         toast.error(error.message || "Failed to load schema details", {
//           duration: 1000,
//           action: closeToastButton
//         });

//         const fallbackTable = modelingData?.tables?.find(
//           (t: any) => t.table_name === tableName
//         );

//         if (fallbackTable) {
//           const formattedData = fallbackTable.columns.map((col: any) => ({
//             columnName: col.name,
//             dataType: col.data_type.toUpperCase(),
//             example: "",
//             key: col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : "",
//           }));
//           setSchemaData(formattedData);
//           setOriginalSchemaData(formattedData);
//           toast.info("Showing cached schema data", {
//             duration: 1000,
//             action: closeToastButton
//           });
//         } else {
//           setSchemaData([]);
//           setOriginalSchemaData([]);
//         }
//       } finally {
//         setLoadingSchema(false);
//       }
//     }

//     setTimeout(() => {
//       if (schemaSectionRef.current) {
//         schemaSectionRef.current.scrollIntoView({
//           behavior: "smooth",
//           block: "start",
//         });
//       }
//     }, 150);
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//   };

//   const handleCancel = () => {
//     setSchemaData([...originalSchemaData]);
//     setIsEditing(false);
//     toast.info("Changes discarded", {
//       duration: 1200,
//       action: closeToastButton
//     });
//   };

//   const handleSave = async () => {
//     if (!userId || !jobId || !selectedSchema) {
//       toast.error("Missing required information", {
//         duration: 1000,
//         action: closeToastButton
//       });
//       return;
//     }

//     try {
//       toast.loading("Updating schema...", { id: "update-schema" });

//       const payload = {
//         columns: schemaData.map((row) => ({
//           column_name: row.columnName,
//           data_type: row.dataType.toLowerCase(),
//         })),
//       };

//       const fileNameWithExtension = selectedSchema.endsWith('.csv')
//         ? selectedSchema
//         : `${selectedSchema}.csv`;

//       const response = await fetch(
//         `https://api.veriton.ai/api/service2/api/schema/${userId}/${jobId}/${fileNameWithExtension}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             "Accept": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to update schema: ${errorText}`);
//       }

//       const result = await response.json();

//       if (result.data) {
//         localStorage.setItem("modeling_data", JSON.stringify(result.data));
//         setModelingData(result.data);
//       }

//       toast.dismiss("update-schema");
//       toast.success(`Schema updated! ${result.columns_updated || 0} column(s) modified`, {
//         duration: 2000,
//         action: closeToastButton
//       });

//       setOriginalSchemaData([...schemaData]);
//       setIsEditing(false);

//       await handleSchemaClick(selectedSchema);
//     } catch (error: any) {
//       toast.dismiss("update-schema");
//       console.error("Error updating schema:", error);
//       toast.error(error.message || "Failed to update schema", {
//         duration: 3000,
//         action: closeToastButton
//       });
//     }
//   };

//   const handleCellChange = (index: number, field: string, value: string) => {
//     const newData = [...schemaData];
//     newData[index] = { ...newData[index], [field]: value };
//     setSchemaData(newData);
//   };

//   const handleNextToDataPreview = async () => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information.", {
//         duration: 1000,
//         action: closeToastButton,
//       });
//       return;
//     }

//     setIsProcessing(true);

//     let pollingInterval: NodeJS.Timeout | null = null;

//     try {
//       // 1. Submit Spark job
//       const submitUrl = `https://api.veriton.ai/api/service2/fabric/run-spark-job?user_id=${userId}&job_id=${jobId}`;

//       const submitResponse = await fetch(submitUrl, {
//         method: "POST",
//         headers: { "Accept": "application/json" },
//       });

//       if (!submitResponse.ok) {
//         const errorText = await submitResponse.text().catch(() => "Unknown error");
//         throw new Error(`Failed to submit Spark job (${submitResponse.status}): ${errorText}`);
//       }

//       const submitData = await submitResponse.json();

//       if (!submitData.job_instance_id) {
//         throw new Error("No job_instance_id returned from server");
//       }

//       const jobInstanceId = submitData.job_instance_id;

//       // toast.success("Spark job submitted", {
//       //   description: `Instance ID: ${jobInstanceId.slice(0, 8)}...`,
//       //   action: closeToastButton,
//       // });

//       // 2. Start polling status
//       const statusUrl = `https://api.veriton.ai/api/service2/fabric/run-spark-job/status?job_instance_id=${jobInstanceId}`;

//       pollingInterval = setInterval(async () => {
//         try {
//           const statusResponse = await fetch(statusUrl, {
//             method: "GET",
//             headers: { "Accept": "application/json" },
//           });

//           if (!statusResponse.ok) {
//             console.warn(`Status check failed (${statusResponse.status})`);
//             return; // continue polling
//           }

//           const statusData = await statusResponse.json();

//           // Handle both possible status locations
//           const jobStatus = statusData?.status || statusData?.details?.status;

//           if (jobStatus === "Completed") {
//             if (pollingInterval) clearInterval(pollingInterval);
//             pollingInterval = null;

//             // toast.success("Data processing completed", {
//             //   description: "Ready for preview",
//             //   action: closeToastButton,
//             // });

//             navigate("/workflow/data-preview");
//           } else if (["Failed", "Error"].includes(jobStatus || "")) {
//             if (pollingInterval) clearInterval(pollingInterval);
//             pollingInterval = null;

//             const reason = statusData?.details?.failureReason || "Unknown reason";
//             throw new Error(`Spark job failed: ${reason}`);
//           }
//           // else → still running / pending → keep polling
//         } catch (pollError) {
//           console.error("Polling error:", pollError);
//           // continue polling unless critical failure
//         }
//       }, 6000); // check every 3 seconds

//     } catch (error: any) {
//       console.error("Spark job submission / processing error:", error);

//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//       }

//       toast.error(error.message || "Failed to start or complete data processing", {
//         duration: 1000,
//         action: closeToastButton,
//       });

//       setIsProcessing(false);
//     }

//     // Cleanup polling on unmount
//     return () => {
//       if (pollingInterval) {
//         clearInterval(pollingInterval);
//       }
//     };
//   };

//   const detailedSchema = modelingData?.tables?.find(
//     (t: any) => t.table_name === selectedSchema
//   );

//   return (
//     <WorkflowLayout>
//       <div className="p-8">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
//           <p className="text-muted-foreground">
//             AI-generated star schema from your data sources
//           </p>
//         </div>

//         {/* Star Schema View */}
//         {modelingData && (
//           <div className="border border-border rounded-lg p-6 bg-card mb-6">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
//                 <Database className="h-5 w-5" />
//                 Star Schema - {modelingData.model?.type || "STAR_SCHEMA"}
//               </h2>
//             </div>

//             {loadingData ? (
//               <div className="flex items-center justify-center h-96">
//                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
//               </div>
//             ) : (
//               <StarSchemaDiagram
//                 modelingData={modelingData}
//                 onTableClick={handleSchemaClick}
//               />
//             )}
//           </div>
//         )}

//         {/* Schema Details Section */}
//         <div ref={schemaSectionRef} className="border border-border rounded-lg p-6 bg-card mb-6 scroll-mt-8">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               {selectedSchema ? `${selectedSchema} - Schema Details` : "Schema Details"}
//             </h3>

//             <div className="flex gap-2">
//               {!isEditing ? (
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handleEdit}
//                   disabled={detailedSchema?.table_type === "FACT" || !selectedSchema}
//                 >
//                   <Edit className="mr-2 h-4 w-4" />
//                   Edit
//                 </Button>
//               ) : (
//                 <>
//                   <Button variant="default" size="sm" onClick={handleSave}>
//                     <Save className="mr-2 h-4 w-4" />
//                     Save
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={handleCancel}>
//                     <X className="mr-2 h-4 w-4" />
//                     Cancel
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>

//           {loadingSchema ? (
//             <div className="flex items-center justify-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : detailedSchema && selectedSchema ? (
//             <>
//               <div className="flex flex-wrap gap-6 mb-6 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Rows:</span>
//                   <span className="ml-2 font-semibold text-foreground">
//                     {detailedSchema.row_count?.toLocaleString() || "0"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Columns:</span>
//                   <span className="ml-2 font-semibold text-foreground">
//                     {detailedSchema.column_count || detailedSchema.columns.length}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Type:</span>
//                   <span className="ml-2 font-semibold text-foreground capitalize">
//                     {detailedSchema.table_type || "Unknown"}
//                   </span>
//                 </div>
//               </div>

//               <div className="border border-border rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Column Name</TableHead>
//                       <TableHead>Data Type</TableHead>
//                       <TableHead>Example</TableHead>
//                       <TableHead>Key</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {schemaData.map((row, index) => (
//                       <TableRow key={index}>
//                         <TableCell>
//                           <span className="font-medium">{row.columnName}</span>
//                         </TableCell>
//                         <TableCell>
//                           {isEditing ? (
//                             <Input
//                               value={row.dataType}
//                               onChange={(e) => handleCellChange(index, "dataType", e.target.value)}
//                               className="h-8"
//                             />
//                           ) : (
//                             row.dataType
//                           )}
//                         </TableCell>
//                         <TableCell className="text-muted-foreground font-mono text-xs">
//                           {row.example || "—"}
//                         </TableCell>
//                         <TableCell>
//                           {row.key && <Badge variant="secondary" className="text-xs">{row.key}</Badge>}
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                   </TableBody>
//                 </Table>
//               </div>
//             </>
//           ) : (
//             <p className="text-center text-muted-foreground py-10">
//               Select a table from the graph to view its schema details
//             </p>
//           )}
//         </div>

//         {/* Bottom Actions */}
//         <div className="flex justify-between items-center mt-8">
//           <Button variant="outline" onClick={() => navigate("/workflow/landing-zone")}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>

//           <Button
//             onClick={handleNextToDataPreview}
//             disabled={isProcessing}
//             className="gap-2 min-w-[220px]"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Processing Data...
//               </>
//             ) : (
//               "Next to Data Preview"
//             )}
//           </Button>
//         </div>
//       </div>
//     </WorkflowLayout>
//   );
// }

import { useState, useEffect, useCallback } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Database, ArrowLeft, Loader2, X, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import StarSchemaDiagram from "@/components/StarSchemaDiagram";
import {
  getModelingData,
  submitMaterializeJob,
  getMaterializeStatus,
  addRelationship,
  deleteRelationship,
  patchEntity,
  RelationshipPayload,
  EntityPatchPayload,
} from "@/components/api/api";

export default function DataModeling() {
  const navigate = useNavigate();

  const [modelingData, setModelingData] = useState<any>(null);
  const [loadingData, setLoadingData]   = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const jobId = localStorage.getItem("current_job_id");

  const closeToastButton = (
    <button
      onClick={() => toast.dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // ── Fetch fresh modeling data from API ────────────────────────
  const fetchModelingData = useCallback(async (showRefreshToast = false) => {
    if (!userId || !jobId) return;
    showRefreshToast ? setIsRefreshing(true) : setLoadingData(true);
    try {
      const data = await getModelingData(userId, jobId);
      setModelingData(data);
      if (showRefreshToast) {
        toast.success("Data refreshed", { duration: 1500, action: closeToastButton });
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to load modeling data", {
        duration: 3000,
        action: closeToastButton,
      });
    } finally {
      setLoadingData(false);
      setIsRefreshing(false);
    }
  }, [userId, jobId]);

  useEffect(() => {
    if (!userId || !jobId) {
      toast.warning("Missing user or job information.", { duration: 2000, action: closeToastButton });
      setLoadingData(false);
      return;
    }
    fetchModelingData();
  }, [fetchModelingData]);

  // ── Delete relationship ───────────────────────────────────────
  const handleDeleteRelationship = useCallback(async (relationshipId: string) => {
    if (!userId || !jobId) return;
    try {
      await deleteRelationship(userId, jobId, relationshipId);
      toast.success("Relationship deleted", { duration: 1500, action: closeToastButton });
      await fetchModelingData();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete relationship", { duration: 3000, action: closeToastButton });
    }
  }, [userId, jobId, fetchModelingData]);

  // ── Add relationship ──────────────────────────────────────────
  const handleAddRelationship = useCallback(async (payload: RelationshipPayload) => {
    if (!userId || !jobId) return;
    try {
      await addRelationship(userId, jobId, payload);
      toast.success(`Relationship added: ${payload.from_table} → ${payload.to_table}`, {
        duration: 2000,
        action: closeToastButton,
      });
      await fetchModelingData();
    } catch (error: any) {
      toast.error(error.message || "Failed to add relationship", { duration: 3000, action: closeToastButton });
    }
  }, [userId, jobId, fetchModelingData]);

  // ── Edit entity ───────────────────────────────────────────────
  const handleEditEntity = useCallback(async (
    entityName: string,
    payload: EntityPatchPayload
  ) => {
    if (!userId || !jobId) return;
    try {
      await patchEntity(userId, jobId, entityName, payload);
      toast.success(`${entityName} updated`, { duration: 1500, action: closeToastButton });
      await fetchModelingData();
    } catch (error: any) {
      toast.error(error.message || "Failed to update entity", { duration: 3000, action: closeToastButton });
    }
  }, [userId, jobId, fetchModelingData]);

  // ── Materialize + navigate to Data Preview ────────────────────
  const handleNextToDataPreview = async () => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information.", { duration: 1000, action: closeToastButton });
      return;
    }

    setIsProcessing(true);
    let pollingInterval: NodeJS.Timeout | null = null;

    try {
      const submitData = await submitMaterializeJob(userId, jobId);

      if (!submitData.job_instance_id) throw new Error("No job_instance_id returned");

      pollingInterval = setInterval(async () => {
        try {
          const statusData = await getMaterializeStatus(submitData.job_instance_id, userId, jobId);
          const s = statusData.fabric_status;

          if (s === "Succeeded" || s === "Completed") {
            if (pollingInterval) clearInterval(pollingInterval);
            if (statusData.table_prefix) localStorage.setItem("table_prefix", statusData.table_prefix);
            if (statusData.materialized_tables?.length) {
              localStorage.setItem("materialized_tables", JSON.stringify(statusData.materialized_tables));
            }
            setIsProcessing(false);
            navigate("/workflow/data-preview");

          } else if (s === "Failed" || s === "Error") {
            if (pollingInterval) clearInterval(pollingInterval);
            const reason = typeof statusData.error === "string"
              ? statusData.error
              : statusData.error?.message || "Unknown reason";
            throw new Error(`Materialization failed: ${reason}`);
          }
        } catch (pollError: any) {
          if (pollingInterval) clearInterval(pollingInterval);
          pollingInterval = null;
          setIsProcessing(false);
          toast.error(pollError.message || "Error during materialization", { duration: 3000, action: closeToastButton });
        }
      }, 10000);

    } catch (error: any) {
      if (pollingInterval) clearInterval(pollingInterval);
      setIsProcessing(false);
      toast.error(error.message || "Failed to start materialization", { duration: 3000, action: closeToastButton });
    }
  };

  return (
    <WorkflowLayout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
            <p className="text-muted-foreground">AI-generated star schema from your data sources</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchModelingData(true)}
            disabled={isRefreshing || loadingData}
            className="gap-2 mt-1"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Diagram */}
        <div className="border border-border rounded-lg p-6 bg-card mb-4">
          <div className="flex items-center mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Database className="h-5 w-5" />
              Star Schema — {modelingData?.model?.type || "STAR_SCHEMA"}
            </h2>
            {modelingData && (
              <div className="ml-auto flex gap-4 text-sm text-muted-foreground">
                <span><span className="font-medium text-foreground">{modelingData.summary?.total_tables ?? 0}</span> tables</span>
                <span><span className="font-medium text-foreground">{modelingData.summary?.total_relationships ?? 0}</span> relationships</span>
              </div>
            )}
          </div>

          {loadingData ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : modelingData ? (
            <StarSchemaDiagram
              modelingData={modelingData}
              onDeleteRelationship={handleDeleteRelationship}
              onAddRelationship={handleAddRelationship}
              onEditEntity={handleEditEntity}
            />
          ) : (
            <div className="flex items-center justify-center h-96 text-muted-foreground">
              No modeling data available. Run processing first.
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-6 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border-2 border-cyan-500 bg-cyan-950/30" />
            <span>Fact Table</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded border border-blue-500 bg-card" />
            <span>Dimension Table</span>
          </div>
          <span className="text-muted-foreground/60 ml-2">
            Click node to edit columns · Click edge to delete · Drag between nodes to add relationship
          </span>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" onClick={() => navigate("/workflow/landing-zone")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={handleNextToDataPreview}
            disabled={isProcessing || loadingData || !modelingData}
            className="gap-2 min-w-[220px]"
          >
            {isProcessing ? (
              <><Loader2 className="h-4 w-4 animate-spin" />Materializing Tables...</>
            ) : (
              "Next to Data Preview"
            )}
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}