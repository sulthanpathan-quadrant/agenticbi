// import { useState, useEffect, useCallback, useRef } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Database, ArrowLeft, Loader2, X, RefreshCw, Link } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import StarSchemaDiagram from "@/components/StarSchemaDiagram";
// import {
//   getModelingData,
//   submitMaterializeJob,
//   getMaterializeStatus,
//   addRelationship,
//   deleteRelationship,
//   patchEntity,
//   RelationshipPayload,
//   EntityPatchPayload,
// } from "@/components/api/api";

// export default function DataModeling() {
//   const navigate = useNavigate();

//   const [modelingData, setModelingData] = useState<any>(null);
//   const [loadingData, setLoadingData] = useState(true);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const isCancelledRef = useRef(false);
//   const userId = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}").id
//     : null;
//   const jobId = localStorage.getItem("current_job_id");

//   const closeToastButton = (
//     <button
//       onClick={() => toast.dismiss()}
//       className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
//       aria-label="Close toast"
//     >
//       <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
//     </button>
//   );

//   // ── Fetch fresh modeling data from API ────────────────────────
//   const fetchModelingData = useCallback(async (showRefreshToast = false) => {
//     if (!userId || !jobId) return;
//     showRefreshToast ? setIsRefreshing(true) : setLoadingData(true);
//     try {
//       const data = await getModelingData(userId, jobId);
//       setModelingData(data);
//       if (showRefreshToast) {
//         toast.success("Data refreshed", { duration: 1500, action: closeToastButton });
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Failed to load modeling data", {
//         duration: 3000,
//         action: closeToastButton,
//       });
//     } finally {
//       setLoadingData(false);
//       setIsRefreshing(false);
//     }
//   }, [userId, jobId]);

//   useEffect(() => {
//     if (!userId || !jobId) {
//       toast.warning("Missing user or job information.", { duration: 2000, action: closeToastButton });
//       setLoadingData(false);
//       return;
//     }
//     fetchModelingData();
//   }, [fetchModelingData]);

//   useEffect(() => {
//     return () => {
//       isCancelledRef.current = true;
//     };
//   }, []);

//   // ── Delete relationship ───────────────────────────────────────
//   const handleDeleteRelationship = useCallback(async (relationshipId: string) => {
//     if (!userId || !jobId) return;
//     try {
//       await deleteRelationship(userId, jobId, relationshipId);
//       toast.success("Relationship deleted", { duration: 1500, action: closeToastButton });
//       await fetchModelingData();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to delete relationship", { duration: 3000, action: closeToastButton });
//     }
//   }, [userId, jobId, fetchModelingData]);

//   // ── Add relationship ──────────────────────────────────────────
//   const handleAddRelationship = useCallback(async (payload: RelationshipPayload) => {
//     if (!userId || !jobId) return;
//     try {
//       await addRelationship(userId, jobId, payload);
//       toast.success(`Relationship added: ${payload.from_table} → ${payload.to_table}`, {
//         duration: 2000,
//         action: closeToastButton,
//       });
//       await fetchModelingData();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to add relationship", { duration: 3000, action: closeToastButton });
//     }
//   }, [userId, jobId, fetchModelingData]);

//   // ── Edit entity ───────────────────────────────────────────────
//   const handleEditEntity = useCallback(async (
//     entityName: string,
//     payload: EntityPatchPayload
//   ) => {
//     if (!userId || !jobId) return;
//     try {
//       await patchEntity(userId, jobId, entityName, payload);
//       toast.success(`${entityName} updated`, { duration: 1500, action: closeToastButton });
//       await fetchModelingData();
//     } catch (error: any) {
//       toast.error(error.message || "Failed to update entity", { duration: 3000, action: closeToastButton });
//     }
//   }, [userId, jobId, fetchModelingData]);

//   // ── Materialize + navigate to Data Preview ────────────────────

//   const handleNextToDataPreview = async () => {
//     if (isProcessing) return;
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information.", {
//         duration: 1000,
//         action: closeToastButton,
//       });
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const submitData = await submitMaterializeJob(userId, jobId);

//       if (!submitData.job_instance_id) {
//         throw new Error("No job_instance_id returned");
//       }

//       const maxAttempts = 60; // 10 minutes (10s interval)
//       let attempts = 0;

//       while (attempts < maxAttempts) {
//         if (isCancelledRef.current) {
//           setIsProcessing(false);
//           return;
//         }
//         attempts++;

//         const statusData = await getMaterializeStatus(
//           submitData.job_instance_id,
//           userId,
//           jobId
//         );

//         const s = statusData.fabric_status;

//         // ❌ Failed
//         if (s === "Failed" || s === "Error") {
//           const reason =
//             typeof statusData.error === "string"
//               ? statusData.error
//               : statusData.error?.message || "Unknown reason";

//           throw new Error(`Materialization failed: ${reason}`);
//         }

//         // ✅ Completed → verify preview API ready
//         // if (s === "Succeeded" || s === "Completed") {
//         //   const previewCheck = await fetch(
//         //     `https://api.veriton.ai/api/service2/api/preview/tables?user_id=${userId}&job_id=${jobId}`
//         //   );

//         //   if (previewCheck.ok) {
//         //     const previewData = await previewCheck.json();

//         //     if (previewData.tables?.length) {
//         //       setIsProcessing(false);
//         //       navigate("/workflow/data-preview");
//         //       return;
//         //     }
//         //   }
//         // }
//         if (s === "Succeeded" || s === "Completed") {
//           setIsProcessing(false);
//           navigate("/workflow/data-preview");
//           return;
//         }

//         // wait 10 seconds before next poll
//         await new Promise((res) => setTimeout(res, 10000));
//       }

//       throw new Error("Materialization timed out.");
//     } catch (error: any) {
//       setIsProcessing(false);

//       toast.error(error.message || "Materialization failed", {
//         duration: 4000,
//         action: closeToastButton,
//       });
//     }
//   };

//   return (
//     <WorkflowLayout>
//       <div className="p-8">

//         {/* Header */}
//         <div className="mb-6 flex items-start justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
//             <p className="text-muted-foreground">AI-generated star schema from your data sources</p>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => fetchModelingData(true)}
//             disabled={isRefreshing || loadingData}
//             className="gap-2 mt-1"
//           >
//             <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//         </div>

//         {/* Diagram */}
//         <div className="border border-border rounded-lg p-6 bg-card mb-4">
//           <div className="flex items-center mb-4">
//             <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
//               <Database className="h-5 w-5" />
//               Star Schema — {modelingData?.model?.type || "STAR_SCHEMA"}
//             </h2>
//             {modelingData && (
//               <div className="ml-auto flex gap-4 text-sm text-muted-foreground">
//                 <span><span className="font-medium text-foreground">{modelingData.summary?.total_tables ?? 0}</span> tables</span>
//                 <span><span className="font-medium text-foreground">{modelingData.summary?.total_relationships ?? 0}</span> relationships</span>
//               </div>
//             )}
//           </div>

//           {loadingData ? (
//             <div className="flex items-center justify-center h-96">
//               <Loader2 className="h-10 w-10 animate-spin text-primary" />
//             </div>
//           ) : modelingData ? (
//             <StarSchemaDiagram
//               modelingData={modelingData}
//               onDeleteRelationship={handleDeleteRelationship}
//               onAddRelationship={handleAddRelationship}
//               onEditEntity={handleEditEntity}
//             />
//           ) : (
//             <div className="flex items-center justify-center h-96 text-muted-foreground">
//               No modeling data available. Run processing first.
//             </div>
//           )}
//         </div>

//         {/* Legend */}
//         <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-6 px-1">
//           <div className="flex items-center gap-1.5">
//             <div className="w-3 h-3 rounded border-2 border-cyan-500 bg-cyan-950/30" />
//             <span>Fact Table</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <div className="w-3 h-3 rounded border border-blue-500 bg-card" />
//             <span>Dimension Table</span>
//           </div>
//           <span className="text-muted-foreground/60 ml-2">
//             Click node to edit columns · Click <Link className="h-3 w-3 inline-block text-muted-foreground" /> on node to link tables · Click edge to delete
//           </span>
//         </div>

//         {/* Bottom Actions */}
//         <div className="flex justify-between items-center mt-4">
//           <Button variant="outline" onClick={() => navigate("/workflow/landing-zone")}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//           <Button
//             onClick={handleNextToDataPreview}
//             disabled={isProcessing || loadingData || !modelingData}
//             className="gap-2 min-w-[220px]"
//           >
//             {isProcessing ? (
//               <><Loader2 className="h-4 w-4 animate-spin" />Materializing Tables...</>
//             ) : (
//               "Next to Data Preview"
//             )}
//           </Button>
//         </div>
//       </div>
//     </WorkflowLayout>
//   );
// }
import { useState, useEffect, useCallback, useRef } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Database, ArrowLeft, Loader2, X, RefreshCw, Link } from "lucide-react";
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
  const [loadingData, setLoadingData] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isCancelledRef = useRef(false);
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

  useEffect(() => {
    isCancelledRef.current = false;  // ADD this line
    return () => {
      isCancelledRef.current = true;
    };
  }, []);

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
    if (isProcessing) return;
    if (!userId || !jobId) {
      toast.error("Missing user or job information.", {
        duration: 1000,
        action: closeToastButton,
      });
      return;
    }

    setIsProcessing(true);
    const loadingToastId = toast.info("Materialization started, please wait...", { duration: 500 });

    try {
      const submitData = await submitMaterializeJob(userId, jobId);



      if (!submitData.job_instance_id) {
        throw new Error("No job_instance_id returned");
      }

      const maxAttempts = 60; // 10 minutes (10s interval)
      let attempts = 0;

      while (attempts < maxAttempts) {
        if (isCancelledRef.current) {
          setIsProcessing(false);
          return;
        }
        attempts++;

        const statusData = await getMaterializeStatus(
          submitData.job_instance_id,
          userId,
          jobId
        );

        const s = statusData.fabric_status;

        // ❌ Failed
        if (s === "Failed" || s === "Error") {
          const reason =
            typeof statusData.error === "string"
              ? statusData.error
              : statusData.error?.message || "Unknown reason";

          throw new Error(`Materialization failed: ${reason}`);
        }

        // ✅ Completed → verify preview API ready
        if (s === "Succeeded" || s === "Completed") {
          toast.dismiss(loadingToastId);
          setIsProcessing(false);

          if (!statusData.ready_for_preview) {
            const failedList = statusData.failed_tables?.join(", ") || "unknown";
            toast.error(`Materialization completed but some tables failed: ${failedList}`, {
              duration: 3000,
              action: closeToastButton,
            });
            return; // ← stay on current page
          }

          navigate("/workflow/data-preview");
          return;
        }
        // wait 10 seconds before next poll
        await new Promise((res) => setTimeout(res, 10000));
      }

      throw new Error("Materialization timed out.");
    } catch (error: any) {
      toast.dismiss(loadingToastId);
      setIsProcessing(false);
      toast.error(error.message || "Materialization failed", {
        duration: 4000,
        action: closeToastButton,
      });
    }
  };

  return (
    <WorkflowLayout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
            <p className="text-muted-foreground">AI-generated schema from your data sources</p>
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
              Schema — {modelingData?.model?.type || "STAR_SCHEMA"}
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
            Click node to edit columns · Click <Link className="h-3 w-3 inline-block text-muted-foreground" /> on node to link tables · Click edge to delete
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