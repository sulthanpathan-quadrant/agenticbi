// import { useState, useEffect, useRef } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, Database, Table as TableIcon, Loader2, ArrowRight } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { toast } from "sonner";

// interface TableSummary {
//   name: string;
//   type: "FACT" | "DIM";
//   columnsCount: number;
//   rowsCount: number;
// }

// interface TablePreview {
//   table_name: string;
//   table_type: "FACT" | "DIM";
//   total_rows: number;
//   total_columns: number;
//   showing_rows: number;
//   columns: string[];
//   data: string[][];
// }

// export default function DataPreview() {
//   const navigate = useNavigate();
//   const previewRef = useRef<HTMLDivElement>(null);

//   const [tables, setTables] = useState<TableSummary[]>([]);
//   const [selectedTable, setSelectedTable] = useState<string | null>(null);
//   const [preview, setPreview] = useState<TablePreview | null>(null);
//   const [loadingTables, setLoadingTables] = useState(true);
//   const [loadingPreview, setLoadingPreview] = useState(false);

//   const userId = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}").id
//     : null;
//   const jobId = localStorage.getItem("current_job_id");

//   // Define positions for up to 3 dimension tables
//   // Each position contains: container classes + line coordinates
//   const dimPositions = [
//     // Top-left
//     {
//       containerClass: "top-0 left-20",
//       lineX: "25%",
//       lineY: "15%",
//       textX: "30%",
//       textY: "28%",
//     },
//     // Top-right
//     {
//       containerClass: "top-0 right-20",
//       lineX: "75%",
//       lineY: "15%",
//       textX: "67%",
//       textY: "28%",
//     },
//     // Bottom center
//     {
//       containerClass: "bottom-0 left-1/2 -translate-x-1/2",
//       lineX: "50%",
//       lineY: "85%",
//       textX: "52%",
//       textY: "68%",
//     },
//   ];

//   // Fetch available tables
//   useEffect(() => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information", { duration: 1000 });
//       setLoadingTables(false);
//       return;
//     }

//     const fetchTables = async () => {
//       setLoadingTables(true);
//       try {
//         const res = await fetch(
//           `https://20.81.213.147/onelake/data-preview?user_id=${userId}&job_id=${jobId}`
//         );
//         if (!res.ok) throw new Error("Failed to load tables");
//         const data = await res.json();

//         const formatted: TableSummary[] = [];

//         if (data.fact_table?.name) {
//           formatted.push({
//             name: data.fact_table.name,
//             type: "FACT",
//             columnsCount: data.fact_table.columns || 0,
//             rowsCount: data.fact_table.rows || 0,
//           });
//         }

//         if (Array.isArray(data.dimension_tables)) {
//           data.dimension_tables.forEach((dim: any) => {
//             if (dim.name) {
//               formatted.push({
//                 name: dim.name,
//                 type: "DIM",
//                 columnsCount: dim.columns || 0,
//                 rowsCount: dim.rows || 0,
//               });
//             }
//           });
//         }

//         setTables(formatted);
//         if (formatted.length > 0) setSelectedTable(formatted[0].name);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load tables", { duration: 1000 });
//       } finally {
//         setLoadingTables(false);
//       }
//     };

//     fetchTables();
//   }, [userId, jobId]);

//   // Scroll to preview section whenever selectedTable changes (even during loading)
//   useEffect(() => {
//     if (selectedTable && previewRef.current) {
//       previewRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   }, [selectedTable]);

//   // Fetch preview data
//   useEffect(() => {
//     if (!selectedTable || !userId || !jobId) return;

//     const fetchPreview = async () => {
//       setLoadingPreview(true);
//       setPreview(null);
//       try {
//         const res = await fetch(
//           `https://20.81.213.147/onelake/select-table?user_id=${userId}&job_id=${jobId}&filename=${encodeURIComponent(selectedTable)}`
//         );
//         if (!res.ok) throw new Error("Failed to load preview");
//         const data = await res.json();
//         setPreview(data);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load table preview", { duration: 1000 });
//       } finally {
//         setLoadingPreview(false);
//       }
//     };

//     fetchPreview();
//   }, [selectedTable, userId, jobId]);

//   const factTable = tables.find(t => t.type === "FACT");

//   return (
//     <WorkflowLayout>
//       <div className="p-8">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-foreground mb-2">Data Preview</h1>
//           <p className="text-muted-foreground">
//             Preview table data from your modeled schema
//           </p>
//         </div>

//         {/* Tables Visualization */}
//         <div className="border border-border rounded-lg p-8 bg-card mb-6">
//           <div className="mb-6">
//             <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
//               <Database className="h-5 w-5" />
//               Available Tables
//             </h2>
//             <p className="text-sm text-muted-foreground mb-6">
//               Click on a table name to preview its data
//             </p>
//           </div>

//           {loadingTables ? (
//             <div className="flex justify-center items-center min-h-[400px]">
//               <Loader2 className="h-10 w-10 animate-spin" />
//             </div>
//           ) : (
//             <div className="relative min-h-[400px] flex items-center justify-center">
//               {/* Dynamic connection lines - only draw for existing DIM tables */}
//               <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
//                 {tables
//                   .filter(t => t.type === "DIM")
//                   .map((_, index) => {
//                     const pos = dimPositions[index % dimPositions.length];
//                     return (
//                       <g key={index}>
//                         <line
//                           x1="50%"
//                           y1="50%"
//                           x2={pos.lineX}
//                           y2={pos.lineY}
//                           stroke="hsl(var(--border))"
//                           strokeWidth="2"
//                           strokeDasharray="5,5"
//                         />
//                         <text
//                           x={pos.textX}
//                           y={pos.textY}
//                           fill="hsl(var(--muted-foreground))"
//                           fontSize="12"
//                         >
//                           1:N
//                         </text>
//                       </g>
//                     );
//                   })}
//               </svg>

//               {/* Fact Table - Center */}
//               {factTable && (
//                 <div className="flex flex-col items-center relative z-10">
//                   {/* <div
//                     className={`border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 w-64 cursor-pointer transition-all ${
//                       selectedTable === factTable.name ? "ring-2 ring-cyan-400 bg-cyan-950/50" : "hover:bg-cyan-950/40"
//                     }`}
//                     onClick={() => setSelectedTable(factTable.name)}
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-2">
//                         <TableIcon className="h-4 w-4" />
//                         <span className="text-sm font-semibold text-foreground">{factTable.name}</span>
//                       </div>
//                       <Badge className="text-xs bg-cyan-600">FACT</Badge>
//                     </div> */}
//                     {/* Fact table card */}
//                 <div
//                   className={`border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 
//                     w-64 cursor-pointer transition-all overflow-hidden
//                     ${selectedTable === factTable.name ? "ring-2 ring-cyan-400 bg-cyan-950/50" : "hover:bg-cyan-950/40"}`}
//                   onClick={() => setSelectedTable(factTable.name)}
//                 >
//                   <div className="flex items-center justify-between mb-3 min-w-0">
//                     <div className="flex items-center gap-2 min-w-0">
//                       <TableIcon className="h-4 w-4 flex-shrink-0" />
//                       <span className="text-sm font-semibold text-foreground truncate">
//                         {factTable.name}
//                       </span>
//                     </div>
//                     <Badge className="text-xs bg-cyan-600 flex-shrink-0">FACT</Badge>
//                   </div>

//                     <div className="text-xs text-muted-foreground space-y-1">
//                       <div className="flex justify-between">
//                         <span>Columns:</span>
//                         <span className="font-medium">{factTable.columnsCount}</span>
//                       </div>
//                       <div className="flex justify-between">
//                         <span>Rows:</span>
//                         <span className="font-medium">{factTable.rowsCount}</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Dynamic Dimension Tables */}
//               {tables
//                 .filter(t => t.type === "DIM")
//                 .map((table, index) => {
//                   const pos = dimPositions[index % dimPositions.length];

//                   return (
//                     <div
//                       key={table.name}
//                       className={`absolute z-10 ${pos.containerClass}`}
//                     >
//                       {/* <div
//                         className={`border border-blue-500 rounded-lg p-4 bg-card/50 w-56 cursor-pointer transition-all ${
//                           selectedTable === table.name ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"
//                         }`}
//                         onClick={() => setSelectedTable(table.name)}
//                       >
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-2">
//                             <TableIcon className="h-4 w-4" />
//                             <span className="text-sm font-semibold text-foreground">{table.name}</span>
//                           </div>
//                           <Badge variant="outline" className="text-xs">DIM</Badge>
//                         </div> */}
                       
//                        <div
//                       className={`border border-blue-500 rounded-lg p-4 bg-card/50 
//                         w-56 cursor-pointer transition-all overflow-hidden
//                         ${selectedTable === table.name ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"}`}
//                       onClick={() => setSelectedTable(table.name)}
//                     >
//                       <div className="flex items-center justify-between mb-3 min-w-0">
//                         <div className="flex items-center gap-2 min-w-0">
//                           <TableIcon className="h-4 w-4 flex-shrink-0" />
//                           <span className="text-sm font-semibold text-foreground truncate">
//                             {table.name}
//                           </span>
//                         </div>
//                         <Badge variant="outline" className="text-xs flex-shrink-0">DIM</Badge>
//                       </div>

//                         <div className="text-xs text-muted-foreground space-y-1">
//                           <div className="flex justify-between">
//                             <span>Columns:</span>
//                             <span className="font-medium">{table.columnsCount}</span>
//                           </div>
//                           <div className="flex justify-between">
//                             <span>Rows:</span>
//                             <span className="font-medium">{table.rowsCount}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           )}
//         </div>

//         {/* Preview Section - scrolls into view on selection */}
//         <div ref={previewRef} className="border border-border rounded-lg p-6 bg-card mb-6">
//           {selectedTable ? (
//             <>
//               {/* <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                   <TableIcon className="h-5 w-5" />
//                   {selectedTable} - Data Preview
//                 </h3>
//                 <Badge variant="outline" className="text-xs">
//                   {preview?.table_type || "DIM"}
//                 </Badge>
//               </div> */}

//               <div className="flex items-center justify-between mb-4 min-w-0">
//               <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 min-w-0">
//                 <TableIcon className="h-5 w-5 flex-shrink-0" />
//                 <span className="truncate">
//                   {selectedTable} - Data Preview
//                 </span>
//               </h3>
//               <Badge variant="outline" className="text-xs flex-shrink-0">
//                 {preview?.table_type || "DIM"}
//               </Badge>
//             </div>

//               <div className="flex gap-6 mb-4 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Total Rows:</span>{" "}
//                   <span className="font-semibold text-foreground">
//                     {preview?.total_rows?.toLocaleString() ?? "N/A"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Columns:</span>{" "}
//                   <span className="font-semibold text-foreground">
//                     {preview?.total_columns ?? "N/A"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Showing:</span>{" "}
//                   <span className="font-semibold text-foreground">First 5 rows</span>
//                 </div>
//               </div>

//               <div className="border border-border rounded-lg overflow-hidden">
//                 <Table>
//                   <TableHeader>
//                     <TableRow className="bg-muted/50">
//                       {preview?.columns.map((col) => (
//                         <TableHead key={col} className="font-medium">
//                           {col}
//                         </TableHead>
//                       )) || (
//                         <>
//                           <TableHead>customer_id</TableHead>
//                           <TableHead>name</TableHead>
//                           <TableHead>email</TableHead>
//                           <TableHead>city</TableHead>
//                           <TableHead>country</TableHead>
//                         </>
//                       )}
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {loadingPreview ? (
//                       <TableRow>
//                         <TableCell colSpan={preview?.columns.length || 5} className="text-center py-8">
//                           <Loader2 className="h-6 w-6 animate-spin mx-auto" />
//                         </TableCell>
//                       </TableRow>
//                     ) : preview && preview.data.length > 0 ? (
//                       preview.data.map((row, idx) => (
//                         <TableRow key={idx}>
//                           {row.map((cell, cellIdx) => (
//                             <TableCell key={cellIdx}>{cell || "—"}</TableCell>
//                           ))}
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={preview?.columns.length || 5} className="text-center py-8 text-muted-foreground">
//                           No data available
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-12 text-muted-foreground">
//               Select a table to view preview
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between items-center">
//           <Button variant="outline" onClick={() => navigate("/workflow/data-modeling")}>
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Button>
//           <Button onClick={() => navigate("/workflow/data-creation")}>
//             Next: Data Creation
//             <ArrowRight className="ml-2 h-4 w-4" />
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
import { ArrowLeft, Database, Table as TableIcon, Loader2, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface TableSummary {
  name: string;
  type: "FACT" | "DIM";
  columnsCount: number;
  rowsCount: number;
}

interface TablePreview {
  table_name: string;
  table_type: "FACT" | "DIM";
  total_rows: number;
  total_columns: number;
  showing_rows: number;
  columns: string[];
  data: string[][];
}

export default function DataPreview() {
  const navigate = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const [tables, setTables] = useState<TableSummary[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [preview, setPreview] = useState<TablePreview | null>(null);
  const [loadingTables, setLoadingTables] = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const jobId = localStorage.getItem("current_job_id");

  // Reusable close button for all toasts
  const closeToastButton = (
    <button
      onClick={() => toast.dismiss()}
      className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
      aria-label="Close toast"
    >
      <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
    </button>
  );

  // Define positions for up to 3 dimension tables
  const dimPositions = [
    { containerClass: "top-0 left-20", lineX: "25%", lineY: "15%", textX: "30%", textY: "28%" },
    { containerClass: "top-0 right-20", lineX: "75%", lineY: "15%", textX: "67%", textY: "28%" },
    { containerClass: "bottom-0 left-1/2 -translate-x-1/2", lineX: "50%", lineY: "85%", textX: "52%", textY: "68%" },
  ];

  // Fetch available tables
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information", {
        duration: 3000,
        action: closeToastButton,
      });
      setLoadingTables(false);
      return;
    }

    const fetchTables = async () => {
      setLoadingTables(true);
      try {
        const res = await fetch(
          `https://api.veriton.ai/api/service2/onelake/data-preview?user_id=${userId}&job_id=${jobId}`
        );
        if (!res.ok) throw new Error("Failed to load tables");
        const data = await res.json();

        const formatted: TableSummary[] = [];

        if (data.fact_table?.name) {
          formatted.push({
            name: data.fact_table.name,
            type: "FACT",
            columnsCount: data.fact_table.columns || 0,
            rowsCount: data.fact_table.rows || 0,
          });
        }

        if (Array.isArray(data.dimension_tables)) {
          data.dimension_tables.forEach((dim: any) => {
            if (dim.name) {
              formatted.push({
                name: dim.name,
                type: "DIM",
                columnsCount: dim.columns || 0,
                rowsCount: dim.rows || 0,
              });
            }
          });
        }

        setTables(formatted);
        if (formatted.length > 0) setSelectedTable(formatted[0].name);
      } catch (err: any) {
        toast.error(err.message || "Failed to load tables", {
          duration: 4000,
          action: closeToastButton,
        });
      } finally {
        setLoadingTables(false);
      }
    };

    fetchTables();
  }, [userId, jobId]);

  // Scroll to preview section when selectedTable changes
  useEffect(() => {
    if (selectedTable && previewRef.current) {
      previewRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedTable]);

  // Fetch preview data
  useEffect(() => {
    if (!selectedTable || !userId || !jobId) return;

    const fetchPreview = async () => {
      setLoadingPreview(true);
      setPreview(null);
      try {
        const res = await fetch(
          `https://api.veriton.ai/api/service2/onelake/select-table?user_id=${userId}&job_id=${jobId}&filename=${encodeURIComponent(selectedTable)}`
        );
        if (!res.ok) throw new Error("Failed to load preview");
        const data = await res.json();
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load table preview", {
          duration: 4000,
          action: closeToastButton,
        });
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [selectedTable, userId, jobId]);

  const factTable = tables.find(t => t.type === "FACT");

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Preview</h1>
          <p className="text-muted-foreground">
            Preview table data from your modeled schema
          </p>
        </div>

        {/* Tables Visualization */}
        <div className="border border-border rounded-lg p-8 bg-card mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
              <Database className="h-5 w-5" />
              Available Tables
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Click on a table name to preview its data
            </p>
          </div>

          {loadingTables ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <div className="relative min-h-[400px] flex items-center justify-center">
              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
                {tables
                  .filter(t => t.type === "DIM")
                  .map((_, index) => {
                    const pos = dimPositions[index % dimPositions.length];
                    return (
                      <g key={index}>
                        <line
                          x1="50%"
                          y1="50%"
                          x2={pos.lineX}
                          y2={pos.lineY}
                          stroke="hsl(var(--border))"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                        />
                        <text
                          x={pos.textX}
                          y={pos.textY}
                          fill="hsl(var(--muted-foreground))"
                          fontSize="12"
                        >
                          1:N
                        </text>
                      </g>
                    );
                  })}
              </svg>

              {/* Fact Table */}
              {factTable && (
                <div
                  className={`border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 
                    w-64 cursor-pointer transition-all overflow-hidden z-10
                    ${selectedTable === factTable.name ? "ring-2 ring-cyan-400 bg-cyan-950/50" : "hover:bg-cyan-950/40"}`}
                  onClick={() => setSelectedTable(factTable.name)}
                >
                  <div className="flex items-center justify-between mb-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <TableIcon className="h-4 w-4 flex-shrink-0" />
                      <span className="text-sm font-semibold text-foreground truncate">
                        {factTable.name}
                      </span>
                    </div>
                    <Badge className="text-xs bg-cyan-600 flex-shrink-0">FACT</Badge>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Columns:</span>
                      <span className="font-medium">{factTable.columnsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rows:</span>
                      <span className="font-medium">{factTable.rowsCount}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dimension Tables */}
              {tables
                .filter(t => t.type === "DIM")
                .map((table, index) => {
                  const pos = dimPositions[index % dimPositions.length];
                  return (
                    <div
                      key={table.name}
                      className={`absolute z-10 ${pos.containerClass}`}
                    >
                      <div
                        className={`border border-blue-500 rounded-lg p-4 bg-card/50 
                          w-56 cursor-pointer transition-all overflow-hidden
                          ${selectedTable === table.name ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"}`}
                        onClick={() => setSelectedTable(table.name)}
                      >
                        <div className="flex items-center justify-between mb-3 min-w-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <TableIcon className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm font-semibold text-foreground truncate">
                              {table.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs flex-shrink-0">DIM</Badge>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Columns:</span>
                            <span className="font-medium">{table.columnsCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rows:</span>
                            <span className="font-medium">{table.rowsCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div ref={previewRef} className="border border-border rounded-lg p-6 bg-card mb-6">
          {selectedTable ? (
            <>
              <div className="flex items-center justify-between mb-4 min-w-0">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 min-w-0">
                  <TableIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">
                    {selectedTable} - Data Preview
                  </span>
                </h3>
                <Badge variant="outline" className="text-xs flex-shrink-0">
                  {preview?.table_type || "DIM"}
                </Badge>
              </div>

              <div className="flex gap-6 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Rows:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {preview?.total_rows?.toLocaleString() ?? "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Columns:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {preview?.total_columns ?? "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Showing:</span>{" "}
                  <span className="font-semibold text-foreground">First 5 rows</span>
                </div>
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      {preview?.columns.map((col) => (
                        <TableHead key={col} className="font-medium">
                          {col}
                        </TableHead>
                      )) || (
                        <>
                          <TableHead>customer_id</TableHead>
                          <TableHead>name</TableHead>
                          <TableHead>email</TableHead>
                          <TableHead>city</TableHead>
                          <TableHead>country</TableHead>
                        </>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loadingPreview ? (
                      <TableRow>
                        <TableCell colSpan={preview?.columns.length || 5} className="text-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : preview && preview.data.length > 0 ? (
                      preview.data.map((row, idx) => (
                        <TableRow key={idx}>
                          {row.map((cell, cellIdx) => (
                            <TableCell key={cellIdx}>{cell || "—"}</TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={preview?.columns.length || 5} className="text-center py-8 text-muted-foreground">
                          No data available
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Select a table to view preview
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/workflow/data-modeling")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate("/workflow/data-creation")}>
            Next: Data Creation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}