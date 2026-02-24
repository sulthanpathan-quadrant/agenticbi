// import { useState, useEffect, useRef } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { ArrowLeft, Database, Table as TableIcon, Loader2, ArrowRight, X } from "lucide-react";
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

//   // Reusable close button for all toasts
//   const closeToastButton = (
//     <button
//       onClick={() => toast.dismiss()}
//       className="absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 transition-colors"
//       aria-label="Close toast"
//     >
//       <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
//     </button>
//   );

//   // Fetch available tables
//   useEffect(() => {
//     if (!userId || !jobId) {
//       toast.error("Missing user or job information", {
//         duration: 3000,
//         action: closeToastButton,
//       });
//       setLoadingTables(false);
//       return;
//     }

//     const fetchTables = async () => {
//       setLoadingTables(true);
//       try {
//         const res = await fetch(
//           `https://api.veriton.ai/api/service2/onelake/data-preview?user_id=${userId}&job_id=${jobId}`
//         );
//         if (!res.ok) throw new Error("Please ingest the data");
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
//         toast.error(err.message || "Failed to load tables", {
//           duration: 4000,
//           action: closeToastButton,
//         });
//       } finally {
//         setLoadingTables(false);
//       }
//     };

//     fetchTables();
//   }, [userId, jobId]);

//   // Scroll to preview section when selectedTable changes
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
//           `https://api.veriton.ai/api/service2/onelake/select-table?user_id=${userId}&job_id=${jobId}&filename=${encodeURIComponent(selectedTable)}`
//         );
//         if (!res.ok) throw new Error("Failed to load preview");
//         const data = await res.json();
//         setPreview(data);
//       } catch (err: any) {
//         toast.error(err.message || "Failed to load table preview", {
//           duration: 4000,
//           action: closeToastButton,
//         });
//       } finally {
//         setLoadingPreview(false);
//       }
//     };

//     fetchPreview();
//   }, [selectedTable, userId, jobId]);

//   const factTable = tables.find(t => t.type === "FACT");
//   const dimTables = tables.filter(t => t.type === "DIM");

//   // Split DIM tables: first half above FACT, second half below FACT
//   const topDimTables = dimTables.slice(0, Math.ceil(dimTables.length / 2));
//   const bottomDimTables = dimTables.slice(Math.ceil(dimTables.length / 2));

//   const TableCard = ({
//     table,
//     isFact = false,
//   }: {
//     table: TableSummary;
//     isFact?: boolean;
//   }) => (
//     <div
//       className={`
//         rounded-lg p-4 cursor-pointer transition-all overflow-hidden
//         ${isFact
//           ? `border-2 border-cyan-500 bg-cyan-950/30 w-64
//              ${selectedTable === table.name ? "ring-2 ring-cyan-400 bg-cyan-950/50" : "hover:bg-cyan-950/40"}`
//           : `border border-blue-500 bg-card/50 w-56
//              ${selectedTable === table.name ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"}`
//         }
//       `}
//       onClick={() => setSelectedTable(table.name)}
//     >
//       <div className="flex items-center justify-between mb-3 min-w-0">
//         <div className="flex items-center gap-2 min-w-0">
//           <TableIcon className="h-4 w-4 flex-shrink-0" />
//           <span className="text-sm font-semibold text-foreground truncate">
//             {table.name}
//           </span>
//         </div>
//         {isFact ? (
//           <Badge className="text-xs bg-cyan-600 flex-shrink-0">FACT</Badge>
//         ) : (
//           <Badge variant="outline" className="text-xs flex-shrink-0">DIM</Badge>
//         )}
//       </div>
//       <div className="text-xs text-muted-foreground space-y-1">
//         <div className="flex justify-between">
//           <span>Columns:</span>
//           <span className="font-medium">{table.columnsCount}</span>
//         </div>
//         <div className="flex justify-between">
//           <span>Rows:</span>
//           <span className="font-medium">{table.rowsCount}</span>
//         </div>
//       </div>
//     </div>
//   );

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
//           ) : tables.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               No tables available. Please do data ingestion first.
//             </div>
//           ) : (
//             <div className="flex flex-col items-center gap-0">

//               {/* Top DIM tables row — above FACT */}
//               {topDimTables.length > 0 && (
//                 <div className="flex flex-wrap justify-center gap-6">
//                   {topDimTables.map((table) => (
//                     <div key={table.name} className="flex flex-col items-center">
//                       <TableCard table={table} />
//                       {/* Connector line downward to FACT */}
//                       <div className="flex flex-col items-center">
//                         <div className="h-5 border-l-2 border-dashed border-border" />
//                         <span className="text-xs text-muted-foreground leading-none py-0.5">1:N</span>
//                         <div className="h-5 border-l-2 border-dashed border-border" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* FACT table in center */}
//               {factTable && (
//                 <TableCard table={factTable} isFact />
//               )}

//               {/* Bottom DIM tables row — below FACT */}
//               {bottomDimTables.length > 0 && (
//                 <div className="flex flex-wrap justify-center gap-6">
//                   {bottomDimTables.map((table) => (
//                     <div key={table.name} className="flex flex-col items-center">
//                       {/* Connector line upward from FACT */}
//                       <div className="flex flex-col items-center">
//                         <div className="h-5 border-l-2 border-dashed border-border" />
//                         <span className="text-xs text-muted-foreground leading-none py-0.5">1:N</span>
//                         <div className="h-5 border-l-2 border-dashed border-border" />
//                       </div>
//                       <TableCard table={table} />
//                     </div>
//                   ))}
//                 </div>
//               )}

//             </div>
//           )}
//         </div>

//         {/* Preview Section */}
//         <div ref={previewRef} className="border border-border rounded-lg p-6 bg-card mb-6">
//           {selectedTable ? (
//             <>
//               <div className="flex items-center justify-between mb-4 min-w-0">
//                 <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 min-w-0">
//                   <TableIcon className="h-5 w-5 flex-shrink-0" />
//                   <span className="truncate">
//                     {selectedTable} - Data Preview
//                   </span>
//                 </h3>
//                 <Badge variant="outline" className="text-xs flex-shrink-0">
//                   {preview?.table_type || "DIM"}
//                 </Badge>
//               </div>

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

import { useState, useEffect, useRef, useMemo } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Table as TableIcon, Loader2, ArrowRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
  Handle,
  NodeProps,
  ReactFlowProvider,
  getStraightPath,
  BaseEdge,
  EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const MODELING_API = "https://api.veriton.ai/api/service2";

// ── Types ─────────────────────────────────────────────────────
interface TableSummary {
  table_name:   string;
  entity_name:  string;
  table_type:   "FACT" | "DIM";
  row_count:    number;
  column_count: number;
  columns?:     string[];
}

interface TablePreview {
  table_name:   string;
  entity_name:  string;
  table_type:   "FACT" | "DIM";
  row_count:    number;
  column_count: number;
  columns:      string[];
  data:         Record<string, any>[];
}

interface Relationship {
  relationship_id:   string;
  from_table:        string;
  from_column:       string;
  to_table:          string;
  to_column:         string;
  relationship_type: string;
}

// ── Read-only Fact Node ───────────────────────────────────────
function FactNode({ data }: NodeProps) {
  const { label, columns = [], row_count = 0, onClick } = data as {
    label: string;
    columns: string[];
    row_count: number;
    onClick: () => void;

  };

  return (
    <div onClick = {onClick} className="border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 w-56 shadow-md relative cursor-pointer hover:ring-2 hover:ring-cyan-400 transition">
      <Handle type="target" position={Position.Left}  className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground truncate">{label}</span>
        <span className="text-[10px] bg-cyan-600 text-white rounded px-1.5 py-0.5 ml-1 shrink-0">FACT</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5 max-h-40 overflow-y-auto">
        {columns.map((col, i) => (
          <div key={i} className="px-1 py-0.5 truncate">{col}</div>
        ))}
        <div className="text-[10px] text-muted-foreground/60 mt-1 pt-1 border-t border-border">
          {Number(row_count).toLocaleString()} rows
        </div>
      </div>
    </div>
  );
}

// ── Read-only Dim Node ────────────────────────────────────────
function DimNode({ data }: NodeProps) {
  const { label, columns = [], row_count = 0, onClick } = data as {
    label: string;
    columns: string[];
    row_count: number;
    onClick: () => void;
  };

  return (
<div
  onClick={onClick}
  className="border border-blue-500 rounded-lg p-4 bg-card/90 w-48 shadow-md relative cursor-pointer hover:ring-2 hover:ring-blue-400 transition"
>      <Handle type="target" position={Position.Left}  className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground truncate">{label}</span>
        <span className="text-[10px] border border-blue-400 text-blue-400 rounded px-1.5 py-0.5 ml-1 shrink-0">DIM</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5 max-h-36 overflow-y-auto">
        {columns.map((col, i) => (
          <div key={i} className="px-1 py-0.5 truncate">{col}</div>
        ))}
        <div className="text-[10px] text-muted-foreground/60 mt-1 pt-1 border-t border-border">
          {Number(row_count).toLocaleString()} rows
        </div>
      </div>
    </div>
  );
}

// ── Simple labeled edge ───────────────────────────────────────
function LabeledEdge({ sourceX, sourceY, targetX, targetY, label, id }: EdgeProps) {
  const [path, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge id={id} path={path} style={{ stroke: "hsl(var(--primary))", strokeWidth: 2, strokeDasharray: "6 4" }} />
      <foreignObject x={labelX - 16} y={labelY - 10} width={32} height={20}>
        <div className="flex items-center justify-center">
          <span className="text-[9px] font-semibold bg-background border border-border rounded px-1 text-foreground">
            {String(label || "M:1")}
          </span>
        </div>
      </foreignObject>
    </>
  );
}

const nodeTypes = { fact: FactNode, dim: DimNode };
const edgeTypes = { labeled: LabeledEdge };

// ── Main Component ────────────────────────────────────────────
export default function DataPreview() {
  const navigate   = useNavigate();
  const previewRef = useRef<HTMLDivElement>(null);

  const [tables, setTables]                 = useState<TableSummary[]>([]);
  const [relationships, setRelationships]   = useState<Relationship[]>([]);
  const [selectedTable, setSelectedTable]   = useState<string | null>(null);
  const [preview, setPreview]               = useState<TablePreview | null>(null);
  const [loadingTables, setLoadingTables]   = useState(true);
  const [loadingPreview, setLoadingPreview] = useState(false);

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

  // ── Fetch tables + relationships on mount ─────────────────────
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information", { duration: 3000, action: closeToastButton });
      setLoadingTables(false);
      return;
    }

    const fetchAll = async () => {
      setLoadingTables(true);
      try {
        // Both fetches in parallel
        const [tablesRes, relsRes] = await Promise.all([
          fetch(`${MODELING_API}/api/preview/tables?user_id=${userId}&job_id=${jobId}`),
          fetch(`${MODELING_API}/api/relationships/${userId}/${jobId}`)
        ]);

        if (!tablesRes.ok) throw new Error("Preview metadata not found. Run materialization first.");
        const tablesData = await tablesRes.json();
        const allTables: TableSummary[] = tablesData.tables || [];
        setTables(allTables);

        if (relsRes.ok) {
          const relsData = await relsRes.json();
          setRelationships(relsData.relationships || []);
        }

        // Auto-select fact table first
        const fact = allTables.find(t => t.table_type === "FACT");
        if (fact) setSelectedTable(fact.table_name);
        else if (allTables.length > 0) setSelectedTable(allTables[0].table_name);

      } catch (err: any) {
        toast.error(err.message || "Failed to load tables", { duration: 4000, action: closeToastButton });
      } finally {
        setLoadingTables(false);
      }
    };

    fetchAll();
  }, [userId, jobId]);

  // ── Scroll to preview when table selected ────────────────────
  useEffect(() => {
    if (selectedTable && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedTable]);

  // ── Fetch individual table preview ───────────────────────────
  useEffect(() => {
    if (!selectedTable || !userId || !jobId) return;

    const fetchPreview = async () => {
      setLoadingPreview(true);
      setPreview(null);
      try {
        const res = await fetch(
          `${MODELING_API}/api/preview/table?user_id=${userId}&job_id=${jobId}&table_name=${encodeURIComponent(selectedTable)}`
        );
        if (!res.ok) throw new Error("Preview not found for this table.");
        const data: TablePreview = await res.json();
        setPreview(data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load table preview", { duration: 4000, action: closeToastButton });
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchPreview();
  }, [selectedTable, userId, jobId]);

  // ── Build ReactFlow nodes from materialized tables ────────────
  const nodes = useMemo<Node[]>(() => {
    const factTable = tables.find(t => t.table_type === "FACT");
    const dimTables = tables.filter(t => t.table_type === "DIM");

    if (!factTable) return [];

    const radius    = Math.max(360, dimTables.length * 50);
    const angleStep = (2 * Math.PI) / Math.max(1, dimTables.length);

    const factNode: Node = {
      id:   factTable.entity_name,
      type: "fact",
      position: { x: 0, y: 0 },
      data: {
        label:     factTable.entity_name,
        columns:   factTable.columns || [],
        row_count: factTable.row_count,
        onClick: () => setSelectedTable(factTable.table_name),
      },
    };

    const dimNodes: Node[] = dimTables.map((t, i) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        id:   t.entity_name,
        type: "dim",
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: {
          label:     t.entity_name,
          columns:   t.columns || [],
          row_count: t.row_count,
          onClick: () => setSelectedTable(t.table_name),

        },
      };
    });

    return [factNode, ...dimNodes];
}, [tables, setSelectedTable]);

  // ── Build ReactFlow edges from relationships ──────────────────
  // Only include edges where both from_table and to_table exist
  // in materialized tables (by entity_name)
  const materializedEntityNames = useMemo(
    () => new Set(tables.map(t => t.entity_name)),
    [tables]
  );

  const edges = useMemo<Edge[]>(() => {
    return relationships
      .filter(rel =>
        materializedEntityNames.has(rel.from_table) &&
        materializedEntityNames.has(rel.to_table)
      )
      .map(rel => ({
        id:     rel.relationship_id,
        source: rel.from_table,
        target: rel.to_table,
        type:   "labeled",
        label:  rel.relationship_type || "M:1",
      }));
  }, [relationships, materializedEntityNames]);

  const factTable = tables.find(t => t.table_type === "FACT");
  const dimTables = tables.filter(t => t.table_type === "DIM");

  return (
    <WorkflowLayout>
      <div className="p-8">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Preview</h1>
          <p className="text-muted-foreground">Preview materialized table data from your schema</p>
        </div>

        {/* ER Diagram — read only */}
        <div className="border border-border rounded-lg p-6 bg-card mb-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
            <Database className="h-5 w-5" />
            Schema Overview
          </h2>

          {loadingTables ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ReactFlowProvider>
              <div className="h-[500px] w-full rounded-lg border border-border overflow-hidden">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  fitView
                  fitViewOptions={{ padding: 0.25, minZoom: 0.3, maxZoom: 1.1, duration: 800 }}
                  minZoom={0.2}
                  maxZoom={1.6}
                  panOnDrag
                  zoomOnScroll
                  nodesDraggable={false}
                  nodesConnectable={false}
                  elementsSelectable
                  proOptions={{ hideAttribution: true }}
                >
                  <Background gap={24} size={1.5} />
                  <Controls showZoom showFitView showInteractive={false} position="bottom-left" />
                </ReactFlow>
              </div>
            </ReactFlowProvider>
          )}
        </div>

        {/* Table Grid */}
        

        {/* Preview Section */}
        <div ref={previewRef} className="border border-border rounded-lg p-6 bg-card mb-6">
          {selectedTable ? (
            <>
              <div className="flex items-center justify-between mb-4 min-w-0">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 min-w-0">
                  <TableIcon className="h-5 w-5 shrink-0" />
                  <span className="truncate">
                    {preview?.entity_name || selectedTable} — Data Preview
                  </span>
                </h3>
                <Badge variant="outline" className="text-xs shrink-0">
                  {preview?.table_type || "—"}
                </Badge>
              </div>

              <div className="flex gap-6 mb-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Rows:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {preview?.row_count?.toLocaleString() ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Columns:</span>{" "}
                  <span className="font-semibold text-foreground">
                    {preview?.column_count ?? "—"}
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
                      {preview?.columns.map(col => (
                        <TableHead key={col} className="font-medium">{col}</TableHead>
                      ))}
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
                          {preview.columns.map(col => (
                            <TableCell key={col}>
                              {row[col] !== null && row[col] !== undefined ? String(row[col]) : "—"}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={preview?.columns.length || 5}
                          className="text-center py-8 text-muted-foreground"
                        >
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