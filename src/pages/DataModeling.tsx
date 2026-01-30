// import { useState, useEffect, useRef } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Database, Edit, Network, Save, ArrowLeft, Loader2, X } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";

// export default function DataModeling() {
//   const navigate = useNavigate();

//   const [activeView, setActiveView] = useState<"star" | "er">("star");
//   const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);

//   const [modelingData, setModelingData] = useState<any>(null);
//   const [loadingData, setLoadingData] = useState(true);
//   const [schemaData, setSchemaData] = useState<any[]>([]);
//   const [originalSchemaData, setOriginalSchemaData] = useState<any[]>([]); // ← NEW: backup for cancel
//   const [loadingSchema, setLoadingSchema] = useState(false);

//   const schemaSectionRef = useRef<HTMLDivElement>(null);

//   const userId = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}").id
//     : null;
//   const jobId = localStorage.getItem("current_job_id");

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
//         toast.error("Failed to load modeling data", { duration: 1000 });
//       }
//     } else {
//       toast.warning("No modeling data found. Redirecting to landing zone...", { duration: 1000 });
//       setTimeout(() => navigate("/workflow/landing-zone"), 2000);
//     }

//     setLoadingData(false);
//   }, [navigate]);

//   const handleSchemaClick = async (tableName: string) => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information", { duration: 1000 });
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
//         toast.error("Failed to load fact table details", { duration: 1000 });
//       } finally {
//         setLoadingSchema(false);
//       }
//     } else {
//       try {
//         const fileNameWithExtension = tableName.endsWith('.csv')
//           ? tableName
//           : `${tableName}.csv`;

//         const response = await fetch(
//           `https://20.81.213.147/api/debug/view-schema/${userId}/${jobId}/${fileNameWithExtension}`,
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
//         toast.error(error.message || "Failed to load schema details", { duration: 1000 });

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
//           toast.info("Showing cached schema data", { duration: 1000 });
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
//     // Restore original data
//     setSchemaData([...originalSchemaData]);
//     setIsEditing(false);
//     toast.info("Changes discarded", { duration: 1200 });
//   };

//   const handleSave = async () => {
//     if (!userId || !jobId || !selectedSchema) {
//       toast.error("Missing required information", { duration: 1000 });
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
//         `https://20.81.213.147/api/schema/${userId}/${jobId}/${fileNameWithExtension}`,
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
//       toast.success(`Schema updated! ${result.columns_updated || 0} column(s) modified`, { duration: 2000 });

//       // Update original data after successful save
//       setOriginalSchemaData([...schemaData]);
//       setIsEditing(false);

//       // Optional: refresh display
//       await handleSchemaClick(selectedSchema);
//     } catch (error: any) {
//       toast.dismiss("update-schema");
//       console.error("Error updating schema:", error);
//       toast.error(error.message || "Failed to update schema", { duration: 3000 });
//     }
//   };

//   const handleCellChange = (index: number, field: string, value: string) => {
//     const newData = [...schemaData];
//     newData[index] = { ...newData[index], [field]: value };
//     setSchemaData(newData);
//   };

//   const handleNextToDataPreview = async () => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information.", { duration: 1000 });
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       const url = `https://20.81.213.147/fabric/run-spark-job?user_id=${userId}&job_id=${jobId}`;

//       const response = await fetch(url, {
//         method: "POST",
//         headers: { "Accept": "application/json" },
//       });

//       if (!response.ok) {
//         const errorText = await response.text().catch(() => "Unknown error");
//         throw new Error(`Spark job failed (${response.status}): ${errorText}`);
//       }

//       navigate("/workflow/data-preview");
//     } catch (error: any) {
//       console.error("Spark job error:", error);
//       toast.error(error.message || "Failed to run Spark job for data preview", { duration: 1000 });
//     } finally {
//       setIsProcessing(false);
//     }
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
//             AI-generated star schema & entity relationships from your data sources
//           </p>
//         </div>

//         {/* Toggle Buttons */}
//         <div className="mb-6 flex gap-6">
//           <button
//             className={`
//               flex items-center px-4 py-2 rounded-md text-sm font-medium
//               transition-all duration-200 border-2
//               ${activeView === "star"
//                 ? "border-primary text-primary bg-white"
//                 : "border-border text-foreground bg-white"}
//               hover:bg-primary hover:text-white hover:border-primary
//               active:bg-white active:text-primary active:border-primary
//               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
//             `}
//             onClick={() => setActiveView("star")}
//           >
//             <Database className="mr-2 h-4 w-4" />
//             schema
//           </button>
//           <button
//             className={`
//               flex items-center px-4 py-2 rounded-md text-sm font-medium
//               transition-all duration-200 border-2
//               ${activeView === "er"
//                 ? "border-primary text-primary bg-white"
//                 : "border-border text-foreground bg-white"}
//               hover:bg-primary hover:text-white hover:border-primary
//               active:bg-white active:text-primary active:border-primary
//               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30
//             `}
//             onClick={() => setActiveView("er")}
//           >
//             <Network className="mr-2 h-4 w-4" />
//             ER Graph
//           </button>
//         </div>

//         {/* Star Schema View */}
//         {activeView === "star" && modelingData && (
//           <div className="border border-border rounded-lg p-8 bg-card mb-6 min-h-[300px]">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
//                 <Database className="h-5 w-5" />
//                 Star Schema - {modelingData.model?.type || "Star"}
//               </h2>
//             </div>

//             {loadingData ? (
//               <div className="flex items-center justify-center h-[450px]">
//                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
//               </div>
//             ) : (
//               <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
//                 {/* Fact Table(s) in Center */}
//                 {modelingData.tables
//                   ?.filter((t: any) => t.table_type === "FACT")
//                   .map((factTable: any) => (
//                     <div
//                       key={factTable.table_name}
//                       className="border-2 border-cyan-500 mt-20 rounded-lg p-5 bg-cyan-950/30 w-64 z-10 cursor-pointer hover:bg-cyan-950/40 transition-colors shadow-lg"
//                       onClick={() => handleSchemaClick(factTable.table_name)}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <span className="text-sm font-semibold text-foreground">
//                           {factTable.table_name}
//                         </span>
//                         <Badge className="text-xs bg-cyan-600">FACT</Badge>
//                       </div>
//                       <div className="text-xs text-muted-foreground space-y-1 max-h-72 overflow-y-auto">
//                         {factTable.columns.map((col: any) => (
//                           <div key={col.name}>
//                             {col.name} {col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : ""}
//                           </div>
//                         ))}
//                         {factTable.column_count > factTable.columns.length && (
//                           <div className="text-xs text-muted-foreground/70 italic">
//                             +{factTable.column_count - factTable.columns.length} more
//                           </div>
//                         )}
//                         <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
//                           {factTable.row_count?.toLocaleString() || 0} rows
//                         </div>
//                       </div>
//                     </div>
//                   ))}

//                 {/* Dimension Tables Around */}
//                 {modelingData.tables
//                   ?.filter((t: any) => t.table_type === "DIM")
//                   .map((dimTable: any, index: number) => {
//                     const positions = [
//                       "top-4 left-12",
//                       "top-4 right-12",
//                       "bottom-4 left-1/2 -translate-x-1/2",
//                       "top-1/2 -translate-y-1/2 left-4",
//                       "top-1/2 -translate-y-1/2 right-4",
//                       "bottom-12 left-12",
//                       "bottom-12 right-12",
//                     ];

//                     return (
//                       <div
//                         key={dimTable.table_name}
//                         className={`absolute ${positions[index % positions.length]}
//                          border border-blue-500 rounded-lg p-3 sm:p-4 bg-card/90
//                           backdrop-blur w-48 sm:w-56 lg:w-64 cursor-pointer 
//                           hover:bg-card transition-all shadow-md max-h-64 sm:max-h-80`}

//                         onClick={() => handleSchemaClick(dimTable.table_name)}
//                       >
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-semibold text-foreground">
//                             {dimTable.table_name}
//                           </span>
//                           <Badge variant="outline" className="text-xs">DIM</Badge>
//                         </div>
//                         <div className="text-xs text-muted-foreground space-y-1 max-h-60 overflow-y-auto">
//                           {dimTable.columns.map((col: any) => (
//                             <div key={col.name}>
//                               {col.name} {col.is_primary_key ? "PK" : ""}
//                             </div>
//                           ))}
//                           {dimTable.column_count > dimTable.columns.length && (
//                             <div className="text-xs text-muted-foreground/70 italic">
//                               +{dimTable.column_count - dimTable.columns.length} more
//                             </div>
//                           )}
//                           <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
//                             {dimTable.row_count?.toLocaleString() || 0} rows
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}

//                 {/* Relationship Lines */}
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
//                   {modelingData.relationships?.map((rel: any, idx: number) => {
//                     const linePositions = [
//                       { x2: "28%", y2: "18%", textX: "35%", textY: "25%" },
//                       { x2: "72%", y2: "18%", textX: "65%", textY: "25%" },
//                       { x2: "50%", y2: "82%", textX: "52%", textY: "75%" },
//                     ];
//                     const pos = linePositions[idx % linePositions.length] || linePositions[0];

//                     return (
//                       <g key={idx}>
//                         <line
//                           x1="50%" y1="50%"
//                           x2={pos.x2} y2={pos.y2}
//                           stroke="hsl(var(--primary))"
//                           strokeWidth="2"
//                           strokeDasharray="6,4"
//                         />
//                         <text
//                           x={pos.textX}
//                           y={pos.textY}
//                           fill="hsl(var(--primary))"
//                           fontSize="11"
//                           fontWeight="600"
//                           textAnchor="middle"
//                         >
//                           {rel.relationship_type || "1:N"}
//                         </text>
//                       </g>
//                     );
//                   })}
//                 </svg>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ER Diagram View */}
//         {activeView === "er" && modelingData && (
//           <div className="border border-border rounded-lg p-8 bg-card mb-6 min-h-[200px]">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
//                 <Network className="h-5 w-5" />
//                 Entity Relationship Graph
//               </h2>
//             </div>

//             {loadingData ? (
//               <div className="flex items-center justify-center h-[450px]">
//                 <Loader2 className="h-10 w-10 animate-spin text-primary" />
//               </div>
//             ) : (
//               <div className="relative h-[450px] flex items-center justify-center overflow-hidden">
//                 {/* Center: Fact Table(s) */}
//                 {modelingData.tables
//                   ?.filter((t: any) => t.table_type === "FACT")
//                   .map((factTable: any) => (
//                     <div
//                       key={factTable.table_name}
//                       className="border-2 border-cyan-500 mt-20 rounded-lg p-3 bg-cyan-950/30 w-64 z-10 cursor-pointer hover:bg-cyan-950/40 transition-colors"
//                       onClick={() => handleSchemaClick(factTable.table_name)}
//                     >
//                       <div className="text-sm font-semibold text-foreground mb-1">
//                         {factTable.table_name}
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         {factTable.column_count} columns
//                       </div>
//                       <div className="text-xs text-muted-foreground">
//                         {factTable.row_count?.toLocaleString() || 0} rows
//                       </div>
//                       <div className="text-xs text-cyan-400 mt-1">
//                         Null: {factTable.null_percentage || 0}%
//                       </div>
//                     </div>
//                   ))}

//                 {/* Around: Dimension Tables */}
//                 {modelingData.tables
//                   ?.filter((t: any) => t.table_type === "DIM")
//                   .map((dimTable: any, index: number) => {
//                     const positions = [
//                       "top-12 left-12",
//                       "top-12 right-12",
//                       "bottom-12 left-1/2 -translate-x-1/2",
//                       "bottom-20 left-24",
//                       "bottom-20 right-24",
//                       "top-1/2 -translate-y-1/2 left-12",
//                       "top-1/2 -translate-y-1/2 right-12",
//                     ];

//                     return (
//                       <div
//                         key={dimTable.table_name}
//                         className={`absolute ${positions[index % positions.length]}
//                          border border-blue-500 rounded-lg p-3 sm:p-4 bg-card/90
//                           backdrop-blur w-48 sm:w-56 lg:w-64 cursor-pointer 
//                           hover:bg-card transition-all shadow-md max-h-64 sm:max-h-80`}
                          
                       
//                         onClick={() => handleSchemaClick(dimTable.table_name)}
//                       >
//                         <div className="text-sm font-semibold text-foreground mb-1">
//                           {dimTable.table_name}
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           {dimTable.column_count} columns
//                         </div>
//                         <div className="text-xs text-muted-foreground">
//                           {dimTable.row_count?.toLocaleString() || 0} rows
//                         </div>
//                         <div className="text-xs text-purple-400 mt-1">
//                           Null: {dimTable.null_percentage || 0}%
//                         </div>
//                       </div>
//                     );
//                   })}

//                 {/* Relationship Lines */}
//                 <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
//                   {modelingData.relationships?.map((rel: any, idx: number) => {
//                     const lineConfigs = [
//                       { x1: "50%", y1: "50%", x2: "20%", y2: "25%", textX: "32%", textY: "35%" },
//                       { x1: "50%", y1: "50%", x2: "80%", y2: "25%", textX: "62%", textY: "35%" },
//                       { x1: "50%", y1: "50%", x2: "50%", y2: "75%", textX: "52%", textY: "65%" },
//                       { x1: "50%", y1: "50%", x2: "28%", y2: "75%", textX: "35%", textY: "65%" },
//                       { x1: "50%", y1: "50%", x2: "72%", y2: "75%", textX: "65%", textY: "65%" },
//                       { x1: "50%", y1: "50%", x2: "15%", y2: "50%", textX: "28%", textY: "48%" },
//                       { x1: "50%", y1: "50%", x2: "85%", y2: "50%", textX: "72%", textY: "48%" },
//                     ];

//                     const config = lineConfigs[idx % lineConfigs.length];

//                     return (
//                       <g key={idx}>
//                         <line
//                           x1={config.x1}
//                           y1={config.y1}
//                           x2={config.x2}
//                           y2={config.y2}
//                           stroke="hsl(var(--primary))"
//                           strokeWidth="2"
//                         />
//                         <text
//                           x={config.textX}
//                           y={config.textY}
//                           fill="hsl(var(--muted-foreground))"
//                           fontSize="10"
//                           fontWeight="500"
//                         >
//                           {rel.relationship_type} ({rel.from_column})
//                         </text>
//                       </g>
//                     );
//                   })}

//                   {modelingData.relationships
//                     ?.filter((rel: any) => rel.from_table_role === "DIM" && rel.to_table_role === "DIM")
//                     .map((rel: any, idx: number) => {
//                       const secondaryConfigs = [
//                         { x1: "28%", y1: "75%", x2: "20%", y2: "30%", textX: "20%", textY: "55%" },
//                         { x1: "72%", y1: "75%", x2: "80%", y2: "30%", textX: "78%", textY: "55%" },
//                       ];

//                       const config = secondaryConfigs[idx % secondaryConfigs.length];

//                       return (
//                         <g key={`secondary-${idx}`}>
//                           <line
//                             x1={config.x1}
//                             y1={config.y1}
//                             x2={config.x2}
//                             y2={config.y2}
//                             stroke="hsl(var(--muted-foreground))"
//                             strokeWidth="1.5"
//                             opacity="0.6"
//                           />
//                           <text
//                             x={config.textX}
//                             y={config.textY}
//                             fill="hsl(var(--muted-foreground))"
//                             fontSize="10"
//                           >
//                             {rel.relationship_type}
//                           </text>
//                         </g>
//                       );
//                     })}
//                 </svg>
//               </div>
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
//             className="gap-2"
//           >
//             {isProcessing ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Processing...
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





  
import { useState, useEffect, useRef } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Edit, Save, ArrowLeft, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import StarSchemaDiagram from '@/components/StarSchemaDiagram';
 
export default function DataModeling() {
  const navigate = useNavigate();
 
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
 
  const [modelingData, setModelingData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [schemaData, setSchemaData] = useState<any[]>([]);
  const [originalSchemaData, setOriginalSchemaData] = useState<any[]>([]); // backup for cancel
  const [loadingSchema, setLoadingSchema] = useState(false);
 
  const schemaSectionRef = useRef<HTMLDivElement>(null);
 
  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const jobId = localStorage.getItem("current_job_id");
 
  // Load modeling data from localStorage
  useEffect(() => {
    const storedData = localStorage.getItem("modeling_data");
 
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setModelingData(parsed);
 
        if (parsed.model?.fact_table) {
          setSelectedSchema(parsed.model.fact_table);
        }
      } catch (error) {
        console.error("Error parsing modeling data:", error);
        toast.error("Failed to load modeling data", { duration: 1000 });
      }
    } else {
      toast.warning("No modeling data found. Redirecting to landing zone...", { duration: 1000 });
      setTimeout(() => navigate("/workflow/landing-zone"), 2000);
    }
 
    setLoadingData(false);
  }, [navigate]);
 
  const handleSchemaClick = async (tableName: string) => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information", { duration: 1000 });
      return;
    }
 
    setSelectedSchema(tableName);
    setLoadingSchema(true);
    setSchemaData([]);
    setOriginalSchemaData([]); // clear backup
    setIsEditing(false); // reset edit mode when changing table
 
    const isFactTable = modelingData?.tables?.find(
      (t: any) => t.table_name === tableName && t.table_type === "FACT"
    );
 
    if (isFactTable && !tableName.includes('.csv')) {
      try {
        const formattedData = isFactTable.columns.map((col: any) => ({
          columnName: col.name,
          dataType: col.data_type.toUpperCase(),
          example: "",
          key: col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : "",
        }));
 
        setSchemaData(formattedData);
        setOriginalSchemaData(formattedData); // backup
      } catch (error) {
        console.error("Error loading fact table:", error);
        toast.error("Failed to load fact table details", { duration: 1000 });
      } finally {
        setLoadingSchema(false);
      }
    } else {
      try {
        const fileNameWithExtension = tableName.endsWith('.csv')
          ? tableName
          : `${tableName}.csv`;
 
        const response = await fetch(
          `https://20.81.213.147/api/debug/view-schema/${userId}/${jobId}/${fileNameWithExtension}`,
          {
            method: "GET",
            headers: { "Accept": "application/json" },
          }
        );
 
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch schema: ${errorText}`);
        }
 
        const schemaDetails = await response.json();
 
        const formattedData = schemaDetails.columns.map((col: any) => ({
          columnName: col.column_name,
          dataType: col.data_type.toUpperCase(),
          example: col.example || "",
          key: col.is_potential_key ? "PK" : col.key.toUpperCase() || "",
        }));
 
        setSchemaData(formattedData);
        setOriginalSchemaData(formattedData); // backup
      } catch (error: any) {
        console.error("Error fetching schema:", error);
        toast.error(error.message || "Failed to load schema details", { duration: 1000 });
 
        const fallbackTable = modelingData?.tables?.find(
          (t: any) => t.table_name === tableName
        );
 
        if (fallbackTable) {
          const formattedData = fallbackTable.columns.map((col: any) => ({
            columnName: col.name,
            dataType: col.data_type.toUpperCase(),
            example: "",
            key: col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : "",
          }));
          setSchemaData(formattedData);
          setOriginalSchemaData(formattedData);
          toast.info("Showing cached schema data", { duration: 1000 });
        } else {
          setSchemaData([]);
          setOriginalSchemaData([]);
        }
      } finally {
        setLoadingSchema(false);
      }
    }
 
    setTimeout(() => {
      if (schemaSectionRef.current) {
        schemaSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  };
 
  const handleEdit = () => {
    setIsEditing(true);
  };
 
  const handleCancel = () => {
    setSchemaData([...originalSchemaData]);
    setIsEditing(false);
    toast.info("Changes discarded", { duration: 1200 });
  };
 
  const handleSave = async () => {
    if (!userId || !jobId || !selectedSchema) {
      toast.error("Missing required information", { duration: 1000 });
      return;
    }
 
    try {
      toast.loading("Updating schema...", { id: "update-schema" });
 
      const payload = {
        columns: schemaData.map((row) => ({
          column_name: row.columnName,
          data_type: row.dataType.toLowerCase(),
        })),
      };
 
      const fileNameWithExtension = selectedSchema.endsWith('.csv')
        ? selectedSchema
        : `${selectedSchema}.csv`;
 
      const response = await fetch(
        `https://20.81.213.147/api/schema/${userId}/${jobId}/${fileNameWithExtension}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );
 
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update schema: ${errorText}`);
      }
 
      const result = await response.json();
 
      if (result.data) {
        localStorage.setItem("modeling_data", JSON.stringify(result.data));
        setModelingData(result.data);
      }
 
      toast.dismiss("update-schema");
      toast.success(`Schema updated! ${result.columns_updated || 0} column(s) modified`, { duration: 2000 });
 
      setOriginalSchemaData([...schemaData]);
      setIsEditing(false);
 
      await handleSchemaClick(selectedSchema);
    } catch (error: any) {
      toast.dismiss("update-schema");
      console.error("Error updating schema:", error);
      toast.error(error.message || "Failed to update schema", { duration: 3000 });
    }
  };
 
  const handleCellChange = (index: number, field: string, value: string) => {
    const newData = [...schemaData];
    newData[index] = { ...newData[index], [field]: value };
    setSchemaData(newData);
  };
 
  const handleNextToDataPreview = async () => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information.", { duration: 1000 });
      return;
    }
 
    setIsProcessing(true);
 
    try {
      const url = `https://20.81.213.147/fabric/run-spark-job?user_id=${userId}&job_id=${jobId}`;
 
      const response = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json" },
      });
 
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(`Spark job failed (${response.status}): ${errorText}`);
      }
 
      navigate("/workflow/data-preview");
    } catch (error: any) {
      console.error("Spark job error:", error);
      toast.error(error.message || "Failed to run Spark job for data preview", { duration: 1000 });
    } finally {
      setIsProcessing(false);
    }
  };
 
  const detailedSchema = modelingData?.tables?.find(
    (t: any) => t.table_name === selectedSchema
  );
 
  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
          <p className="text-muted-foreground">
            AI-generated star schema from your data sources
          </p>
        </div>
 
        {/* Star Schema View - now always visible (no toggle) */}
        {modelingData && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Database className="h-5 w-5" />
                Star Schema - {modelingData.model?.type || "STAR_SCHEMA"}
              </h2>
            </div>
 
            {loadingData ? (
              <div className="flex items-center justify-center h-96">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : (
              <StarSchemaDiagram
                modelingData={modelingData}
                onTableClick={handleSchemaClick}
              />
            )}
          </div>
        )}
 
        {/* Schema Details Section */}
        <div ref={schemaSectionRef} className="border border-border rounded-lg p-6 bg-card mb-6 scroll-mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Database className="h-5 w-5" />
              {selectedSchema ? `${selectedSchema} - Schema Details` : "Schema Details"}
            </h3>
 
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={detailedSchema?.table_type === "FACT" || !selectedSchema}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <>
                  <Button variant="default" size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
 
          {loadingSchema ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : detailedSchema && selectedSchema ? (
            <>
              <div className="flex flex-wrap gap-6 mb-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Rows:</span>
                  <span className="ml-2 font-semibold text-foreground">
                    {detailedSchema.row_count?.toLocaleString() || "0"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Columns:</span>
                  <span className="ml-2 font-semibold text-foreground">
                    {detailedSchema.column_count || detailedSchema.columns.length}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <span className="ml-2 font-semibold text-foreground capitalize">
                    {detailedSchema.table_type || "Unknown"}
                  </span>
                </div>
              </div>
 
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Column Name</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Example</TableHead>
                      <TableHead>Key</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {schemaData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span className="font-medium">{row.columnName}</span>
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={row.dataType}
                              onChange={(e) => handleCellChange(index, "dataType", e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            row.dataType
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground font-mono text-xs">
                          {row.example || "—"}
                        </TableCell>
                        <TableCell>
                          {row.key && <Badge variant="secondary" className="text-xs">{row.key}</Badge>}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-10">
              Select a table from the graph to view its schema details
            </p>
          )}
        </div>
 
        {/* Bottom Actions */}
        <div className="flex justify-between items-center mt-8">
          <Button variant="outline" onClick={() => navigate("/workflow/landing-zone")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
 
          <Button
            onClick={handleNextToDataPreview}
            disabled={isProcessing}
            className="gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Next to Data Preview"
            )}
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
 