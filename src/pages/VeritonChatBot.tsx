// import { useState, useRef, useEffect, useMemo } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Send, Loader2, RotateCcw, Paperclip, FileText,
//   X, Sparkles, Bot, User, Pencil, Check, XCircle,
//   Download, Share2, BarChart3, TrendingUp, AlertCircle,
//   CheckCircle, Cpu, Calendar, GitBranch, Clock,
// } from "lucide-react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import ReactFlow, {
//   Controls,
//   Background,
//   Handle,
//   Position,
//   EdgeProps,
//   getStraightPath,
// } from "reactflow";
// import "reactflow/dist/style.css";
// import { createPortal } from "react-dom";
// import { useNavigate } from "react-router-dom";
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//   ScatterChart, Scatter, Cell, LineChart, Line, AreaChart, Area,
//   PieChart, Pie, Legend, FunnelChart, Funnel, LabelList,
// } from "recharts";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

// // ─────────────────────────────────────────────────────────────
// // Helper: get aivolve_user from localStorage
// // ─────────────────────────────────────────────────────────────
// function getAivolveUser() {
//   try {
//     const raw = localStorage.getItem("aivolve_user");
//     if (!raw) return null;
//     return JSON.parse(raw);
//   } catch {
//     return null;
//   }
// }

// // ─────────────────────────────────────────────────────────────
// // EditableField — inline edit with confirm / cancel
// // ─────────────────────────────────────────────────────────────
// function EditableField({
//   value,
//   onSave,
//   label,
//   saving,
// }: {
//   value: string;
//   onSave: (newValue: string) => Promise<void>;
//   label: string;
//   saving?: boolean;
// }) {
//   const [editing, setEditing] = useState(false);
//   const [draft, setDraft] = useState(value);
//   const [busy, setBusy] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (editing) inputRef.current?.focus();
//   }, [editing]);

//   const handleSave = async () => {
//     if (!draft.trim() || draft === value) {
//       setEditing(false);
//       setDraft(value);
//       return;
//     }
//     setBusy(true);
//     try {
//       await onSave(draft.trim());
//     } finally {
//       setBusy(false);
//       setEditing(false);
//     }
//   };

//   const handleCancel = () => {
//     setDraft(value);
//     setEditing(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") handleSave();
//     if (e.key === "Escape") handleCancel();
//   };

//   return (
//     <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
//       <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
//         {label}:
//       </span>
//       {editing ? (
//         <>
//           <input
//             ref={inputRef}
//             value={draft}
//             onChange={(e) => setDraft(e.target.value)}
//             onKeyDown={handleKeyDown}
//             disabled={busy}
//             style={{
//               fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))",
//               background: "hsl(var(--background))", border: "1.5px solid hsl(var(--primary))",
//               borderRadius: 6, padding: "2px 8px", outline: "none", minWidth: 160,
//             }}
//           />
//           {busy ? (
//             <Loader2 style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} className="animate-spin" />
//           ) : (
//             <>
//               <button onClick={handleSave} title="Save" style={{ background: "hsl(142 72% 42%)", border: "none", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
//                 <Check style={{ width: 12, height: 12, color: "#fff" }} />
//               </button>
//               <button onClick={handleCancel} title="Cancel" style={{ background: "hsl(0 72% 51%)", border: "none", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
//                 <XCircle style={{ width: 12, height: 12, color: "#fff" }} />
//               </button>
//             </>
//           )}
//         </>
//       ) : (
//         <>
//           <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>{value}</span>
//           <button onClick={() => { setDraft(value); setEditing(true); }} title={`Edit ${label}`} style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
//             <Pencil style={{ width: 11, height: 11, color: "hsl(var(--muted-foreground))" }} />
//             <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>Edit</span>
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // DataModelSummary
// // ─────────────────────────────────────────────────────────────
// function DataModelSummary({ dataModel, relationships, schemas }: {
//   dataModel: any; relationships: any[]; schemas: any;
// }) {
//   if (!dataModel?.fact_table) return null;
//   const fact = dataModel.fact_table;
//   const dims: string[] = dataModel.dimension_tables || [];

//   return (
//     <div style={{
//       background: "linear-gradient(135deg, hsl(267 84% 65% / 0.08), hsl(197 100% 55% / 0.05))",
//       border: "1px solid hsl(267 84% 65% / 0.3)", borderRadius: 12, padding: "14px 16px",
//       fontSize: 12, color: "hsl(var(--foreground))", lineHeight: 1.8, marginTop: 10,
//     }}>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//         <div style={{ background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))", borderRadius: 6, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5 }}>
//           <span style={{ fontSize: 11 }}>💡</span>
//           <span style={{ fontWeight: 700, color: "#fff", fontSize: 11, letterSpacing: 0.3 }}>What this diagram shows</span>
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
//         <span style={{ width: 9, height: 9, borderRadius: "50%", background: "hsl(267 84% 65%)", display: "inline-block", flexShrink: 0 }} />
//         <span>
//           <span style={{ background: "hsl(267 84% 65%)", color: "#fff", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 700, marginRight: 5 }}>{fact}</span>
//           is the <strong>main table</strong> — holds core transaction data
//         </span>
//         {schemas?.[fact] && (
//           <span style={{ background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)", border: "1px solid hsl(267 84% 65% / 0.3)", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600 }}>
//             {schemas[fact].length} cols
//           </span>
//         )}
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
//         <span style={{ width: 9, height: 9, borderRadius: "50%", background: "hsl(197 100% 50%)", display: "inline-block", flexShrink: 0 }} />
//         <span>Connected to <strong>{dims.length} supporting table{dims.length !== 1 ? "s" : ""}</strong>:</span>
//         {dims.map((d) => (
//           <span key={d} style={{ background: "hsl(197 100% 50% / 0.12)", color: "hsl(197 100% 38%)", border: "1px solid hsl(197 100% 50% / 0.3)", borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{d}</span>
//         ))}
//       </div>
//       <div style={{ borderTop: "1px solid hsl(267 84% 65% / 0.2)", marginBottom: 10 }} />
//       <div style={{ marginBottom: 10 }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
//           <span style={{ fontSize: 13 }}>🔗</span>
//           <span style={{ fontWeight: 700, fontSize: 12, color: "hsl(var(--foreground))" }}>How they connect</span>
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//           {relationships.map((rel, i) => (
//             <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", background: "hsl(var(--background) / 0.5)", border: "1px solid hsl(267 84% 65% / 0.15)", borderRadius: 8, padding: "5px 10px" }}>
//               <span style={{ background: "hsl(267 84% 60%)", color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{rel.from}</span>
//               <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 16, lineHeight: 1 }}>→</span>
//               <span style={{ background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)", border: "1px solid hsl(267 84% 65% / 0.35)", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{rel.to}</span>
//               <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>via</span>
//               <code style={{ background: "hsl(267 84% 65% / 0.1)", color: "hsl(267 84% 62%)", border: "1px solid hsl(267 84% 65% / 0.25)", borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 600 }}>{rel.join}</code>
//             </div>
//           ))}
//         </div>
//       </div>
//       <div style={{ display: "flex", alignItems: "center", gap: 7, background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.25)", borderRadius: 7, padding: "6px 10px" }}>
//         <span style={{ fontSize: 13 }}>👆</span>
//         <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11, fontStyle: "italic" }}>Hover over any connecting line to see exactly which columns are linked.</span>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // SchemaNode
// // ─────────────────────────────────────────────────────────────
// function SchemaNode({ data }: { data: any }) {
//   const isFact = data.type === "FACT";
//   return (
//     <div style={{ background: "hsl(var(--card))", border: `2px solid ${isFact ? "hsl(var(--primary))" : "hsl(var(--border))"}`, borderRadius: 10, minWidth: 180, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "inherit" }}>
//       <Handle type="target" position={Position.Left} style={{ background: "transparent", border: 0 }} />
//       <Handle type="source" position={Position.Right} style={{ background: "transparent", border: 0 }} />
//       <div style={{ background: isFact ? "hsl(var(--primary))" : "hsl(var(--muted))", borderRadius: "8px 8px 0 0", padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//         <span style={{ fontWeight: 700, fontSize: 12, color: isFact ? "#fff" : "hsl(var(--foreground))" }}>{data.label}</span>
//         <span style={{ fontSize: 9, fontWeight: 600, color: isFact ? "rgba(255,255,255,0.85)" : "hsl(var(--primary))", background: isFact ? "rgba(255,255,255,0.15)" : "hsl(var(--accent) / 0.2)", borderRadius: 4, padding: "1px 5px" }}>{data.type}</span>
//       </div>
//       <div style={{ padding: "6px 0", maxHeight: 160, overflowY: "auto" }}>
//         {(data.columns || []).map((col: string, i: number) => {
//           const isJoinCol = (data.relationships || []).some((rel: any) => {
//             const [left, right] = rel.join.split("=").map((s: string) => s.trim());
//             return left === col || right === col;
//           });
//           return (
//             <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 10px", fontSize: 11, color: "hsl(var(--foreground))", background: isJoinCol ? "hsl(var(--primary) / 0.12)" : "transparent" }}>
//               {isJoinCol && <span style={{ color: "hsl(var(--primary))", fontSize: 9, fontWeight: 700 }}>⬡</span>}
//               <span>{col}</span>
//               {isJoinCol && <span style={{ marginLeft: "auto", fontSize: 9, color: "hsl(var(--primary))", fontWeight: 600 }}>FK</span>}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // SchemaEdge
// // ─────────────────────────────────────────────────────────────
// function SchemaEdge({ sourceX, sourceY, targetX, targetY, data, selected }: EdgeProps & { data?: { join: string } }) {
//   const [hovered, setHovered] = useState(false);
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
//   const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

//   return (
//     <>
//       <path d={edgePath} fill="none" stroke="transparent" strokeWidth={20}
//         onMouseEnter={(e) => { setHovered(true); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
//         onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
//         onMouseLeave={() => setHovered(false)}
//         style={{ cursor: "pointer" }}
//       />
//       <path d={edgePath} fill="none"
//         stroke={hovered || selected ? "#f59e0b" : "#6366f1"}
//         strokeWidth={hovered || selected ? 3 : 2}
//         strokeDasharray="5 4"
//         style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
//       />
//       {hovered && data?.join && createPortal(
//         <div style={{ position: "fixed", left: tooltipPos.x + 12, top: tooltipPos.y - 36, zIndex: 99999, background: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.25)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
//           <span style={{ color: "#818cf8" }}>🔗</span>
//           <span>{data.join}</span>
//         </div>,
//         document.body
//       )}
//     </>
//   );
// }

// const schemaNodeTypes = { schemaNode: SchemaNode };
// const schemaEdgeTypes = { schemaEdge: SchemaEdge };

// function buildStarSchema(dataModel: any, relationships: any[], schemas: any) {
//   if (!dataModel?.fact_table) return { nodes: [], edges: [] };
//   const fact = dataModel.fact_table;
//   const dims: string[] = dataModel.dimension_tables || [];
//   const radius = 260;
//   const angleStep = (2 * Math.PI) / Math.max(1, dims.length);

//   const nodes: any[] = [{
//     id: fact, type: "schemaNode",
//     data: { label: fact, type: "FACT", columns: schemas?.[fact] || [], relationships },
//     position: { x: 400, y: 300 },
//   }];

//   dims.forEach((dim, index) => {
//     const angle = index * angleStep - Math.PI / 2;
//     nodes.push({
//       id: dim, type: "schemaNode",
//       data: { label: dim, type: "DIM", columns: schemas?.[dim] || [], relationships },
//       position: { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) },
//     });
//   });

//   const edges: any[] = relationships.map((rel: any) => ({
//     id: `${rel.from}-${rel.to}`, source: rel.from, target: rel.to,
//     type: "schemaEdge", data: { join: rel.join }, animated: false,
//   }));

//   return { nodes, edges };
// }

// // ─────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────
// interface MessageResult {
//   pipeline_name: string;
//   suggested_job_name: string;
//   job_name?: string; // FIX: added job_name from thread response
//   job_id: string;
//   data_model: any;
//   relationships: any[];
//   schemas: any;
//   final_dataset: {
//     rows: number;
//     columns: string[];
//     preview: any[];
//     dataset_name: string;
//     dataset_path: string;
//     onelake_path?: string;
//   };
//   download_url: string;
// }

// interface DashboardKPI {
//   kpi_name: string;
//   measures: string;
//   metrics: number;
// }

// interface DashboardVisual {
//   chart_name: string;
//   chart_type: string;
//   description: string;
//   value?: number;
//   format?: string;
//   x_axis_column?: string;
//   y_axis_columns?: string[];
//   data?: any;
// }

// interface DashboardResult {
//   status: string;
//   user_prompt: string;
//   total_kpis_discovered: number;
//   selected_kpi_names: string[];
//   computed_kpis: DashboardKPI[];
//   visuals: DashboardVisual[];
//   total_visuals: number;
// }

// interface AutoMLResult {
//   status: string;
//   message: string;
//   session_id: string;
//   model_id: string;
//   task_type: string;
//   target: string;
//   best_model: string;
//   primary_metric: string;
//   primary_score: number;
//   all_models: Record<string, any>;
//   analysis: string;
//   blob_file_used: string;
//   results_filename: string;
//   dataset_id: string;
//   suggestions: string[];
// }

// // Pipeline creation state
// type PipelineStep = "idle" | "awaiting_job_selection" | "awaiting_pipeline_name";

// interface PipelineJob {
//   job_id: string;
//   job_name: string;
// }

// // FIX: Added PipelineCreatedResult type for the pipeline creation response
// interface PipelineCreatedResult {
//   pipeline_id: string;
//   user_id: string;
//   name: string;
//   jobs: string[];
//   schedule?: {
//     type: string;
//     hour: number;
//     minute: number;
//     day?: string;
//   };
//   job_names?: Record<string, string>; // map of job_id -> job_name
// }

// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   result?: MessageResult;
//   dashboardResult?: DashboardResult;
//   automlResult?: AutoMLResult;
//   pipelineCreated?: PipelineCreatedResult; // FIX: new field for pipeline creation result
//   attachment?: string;
//   error?: boolean;
//   timestamp: Date;
//   // Pipeline job selection UI
//   pipelineJobs?: PipelineJob[];
// }

// // ─────────────────────────────────────────────────────────────
// // API base URL — one URL, endpoints appended per call
// // ─────────────────────────────────────────────────────────────
// const BASE_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net";

// // ─────────────────────────────────────────────────────────────
// // Dashboard colors
// // ─────────────────────────────────────────────────────────────
// const DASHBOARD_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// // ─────────────────────────────────────────────────────────────
// // AutoML Result Card — FIX: Performance Metrics as table in Analysis
// // ─────────────────────────────────────────────────────────────
// const metricsByTask: Record<string, { key: string; label: string }[]> = {
//   Classification: [
//     { key: "accuracy", label: "Accuracy" },
//     { key: "f1", label: "F1 Score" },
//     { key: "precision", label: "Precision" },
//     { key: "recall", label: "Recall" },
//     { key: "roc_auc", label: "ROC-AUC" },
//   ],
//   Regression: [
//     { key: "rmse", label: "RMSE" },
//     { key: "mae", label: "MAE" },
//     { key: "r2", label: "R²" },
//     { key: "mape", label: "MAPE" },
//     { key: "mean_residual", label: "Mean Residual" },
//     { key: "std_residual", label: "Std Residual" },
//   ],
//   Forecasting: [
//     { key: "rmse", label: "RMSE" },
//     { key: "mae", label: "MAE" },
//     { key: "r2", label: "R²" },
//     { key: "mape", label: "MAPE" },
//   ],
// };

// function fmt(v: any) {
//   if (v === null || v === undefined) return "—";
//   if (typeof v === "number") {
//     if (Math.abs(v) < 0.0001 && v !== 0) return v.toExponential(3);
//     return (Math.round(v * 1000) / 1000).toString();
//   }
//   return String(v);
// }

// // FIX: New consolidated performance metrics table spanning all models
// function PerformanceMetricsTable({
//   allModels,
//   bestModel,
//   taskType,
// }: {
//   allModels: Record<string, any>;
//   bestModel: string;
//   taskType: string;
// }) {
//   const metricSpecs = metricsByTask[taskType] || metricsByTask["Regression"];
//   const modelNames = Object.keys(allModels);
//   if (modelNames.length === 0) return null;

//   return (
//     <div style={{ overflowX: "auto", marginTop: 4 }}>
//       <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
//         <thead>
//           <tr style={{ background: "hsl(var(--muted))" }}>
//             <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "hsl(var(--foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
//               Model
//             </th>
//             {metricSpecs.map((m) => (
//               <>
//                 <th key={`${m.key}-train`} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "hsl(var(--muted-foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
//                   {m.label} (train)
//                 </th>
//                 <th key={`${m.key}-test`} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "hsl(var(--muted-foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
//                   {m.label} (test)
//                 </th>
//               </>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {modelNames.map((modelName, idx) => {
//             const modelData = allModels[modelName];
//             const isBest = modelName === bestModel;
//             return (
//               <tr
//                 key={modelName}
//                 style={{
//                   background: isBest ? "hsl(142 72% 42% / 0.08)" : idx % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.3)",
//                   borderBottom: "1px solid hsl(var(--border) / 0.5)",
//                 }}
//               >
//                 <td style={{ padding: "8px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>
//                   <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
//                     <span style={{ color: "hsl(var(--foreground))" }}>{modelName.replace(/_/g, " ")}</span>
//                     {isBest && (
//                       <span style={{
//                         fontSize: 9, fontWeight: 700, color: "#fff",
//                         background: "hsl(142 72% 38%)", borderRadius: 4,
//                         padding: "1px 5px", lineHeight: 1.6,
//                       }}>BEST</span>
//                     )}
//                   </div>
//                 </td>
//                 {metricSpecs.map((m) => (
//                   <>
//                     <td key={`${m.key}-train`} style={{ padding: "8px 10px", textAlign: "center", color: "hsl(var(--muted-foreground))", fontVariantNumeric: "tabular-nums" }}>
//                       {fmt(modelData?.train?.[m.key])}
//                     </td>
//                     <td key={`${m.key}-test`} style={{ padding: "8px 10px", textAlign: "center", color: "hsl(var(--foreground))", fontWeight: isBest ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
//                       {fmt(modelData?.test?.[m.key])}
//                     </td>
//                   </>
//                 ))}
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// /**
//  * Renders a text block where any "Label: value" pattern gets the label bolded,
//  * and lines starting with common list markers become bullet points.
//  * FIX: Skips lines that look like table rows (| ... |) - these are rendered separately.
//  */
// function FormattedAnalysisText({ text }: { text: string }) {
//   if (!text) return null;

//   const lines = text.split("\n");

//   return (
//     <div style={{ fontSize: 12, lineHeight: 1.8, color: "hsl(var(--foreground))" }}>
//       {lines.map((line, i) => {
//         const trimmed = line.trim();
//         if (!trimmed) return <div key={i} style={{ height: 6 }} />;

//         // Skip markdown table rows — they are handled by PerformanceMetricsTable
//         if (trimmed.startsWith("|")) return null;

//         // Section headers (##, ###, digits like "1.", "2.")
//         if (/^#{1,3}\s/.test(trimmed)) {
//           const headingText = trimmed.replace(/^#{1,3}\s/, "");
//           return (
//             <div key={i} style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", marginTop: 14, marginBottom: 4 }}>
//               {boldBeforeColon(headingText)}
//             </div>
//           );
//         }

//         // Numbered section headers like "1. Task Summary" or "1)"
//         if (/^\d+[\.\)]\s/.test(trimmed)) {
//           return (
//             <div key={i} style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", marginTop: 14, marginBottom: 4 }}>
//               {boldBeforeColon(trimmed)}
//             </div>
//           );
//         }

//         // Bullet/list lines: -, *, •
//         if (/^[-\*•]\s/.test(trimmed)) {
//           const content = trimmed.replace(/^[-\*•]\s/, "");
//           return (
//             <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
//               <span style={{ color: "hsl(var(--primary))", fontWeight: 700, fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>•</span>
//               <span>{boldBeforeColon(content)}</span>
//             </div>
//           );
//         }

//         // Lines that look like "Key: value"
//         if (/^[A-Za-z ]{2,40}:\s/.test(trimmed)) {
//           return (
//             <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
//               <span style={{ color: "hsl(var(--primary))", fontWeight: 700, fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>•</span>
//               <span>{boldBeforeColon(trimmed)}</span>
//             </div>
//           );
//         }

//         return (
//           <p key={i} style={{ marginBottom: 4 }}>
//             {boldBeforeColon(trimmed)}
//           </p>
//         );
//       })}
//     </div>
//   );
// }

// function boldBeforeColon(text: string): React.ReactNode {
//   const colonIdx = text.indexOf(":");
//   if (colonIdx === -1 || colonIdx === text.length - 1) return text;
//   const before = text.slice(0, colonIdx);
//   const after = text.slice(colonIdx);
//   if (before.length > 60 || before.includes(".")) return text;
//   return (
//     <>
//       <strong style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>{before}</strong>
//       {after}
//     </>
//   );
// }

// function AutoMLResultCard({ automlResult }: { automlResult: AutoMLResult }) {
//   const taskType = automlResult.task_type || "Regression";
//   const allModels = automlResult.all_models || {};

//   return (
//     <div className="mt-3 w-full max-w-2xl space-y-5">
//       {/* Header */}
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-2">
//           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//             <Cpu className="w-5 h-5 text-primary" />
//           </div>
//           <span className="text-base font-semibold text-foreground">AutoML Results</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <CheckCircle className="w-4 h-4 text-green-500" />
//           <span className="text-sm font-medium text-green-500">Build Complete</span>
//         </div>
//       </div>

//       {/* Summary pills */}
//       <div className="flex flex-wrap gap-2 text-xs">
//         <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Task: {automlResult.task_type}</span>
//         <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">Target: {automlResult.target}</span>
//         <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Best: {automlResult.best_model}</span>
//         <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
//           {automlResult.primary_metric?.toUpperCase()}: {fmt(automlResult.primary_score)}
//         </span>
//       </div>

//       {/* FIX: Consolidated Performance Metrics Table */}
//       <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
//         <div className="px-5 py-3 border-b bg-muted/40 flex items-center gap-2">
//           <BarChart3 className="w-4 h-4 text-primary" />
//           <h3 className="text-sm font-semibold text-foreground">Performance Metrics — Train vs Test</h3>
//         </div>
//         <div className="p-0">
//           <PerformanceMetricsTable
//             allModels={allModels}
//             bestModel={automlResult.best_model}
//             taskType={taskType}
//           />
//         </div>
//       </div>

//       {/* Analysis — formatted text, table rows filtered out */}
//       {automlResult.analysis && (
//         <div className="bg-card border border-border rounded-xl p-5">
//           <h2 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
//             <BarChart3 className="w-4 h-4" /> Analysis Summary
//           </h2>
//           <FormattedAnalysisText text={automlResult.analysis} />
//         </div>
//       )}

//       {/* Suggestions */}
//       {automlResult.suggestions?.length > 0 && (
//         <div className="bg-card border border-border rounded-xl p-5">
//           <h2 className="text-sm font-semibold mb-3 text-primary">Next Steps</h2>
//           <ul className="space-y-2">
//             {automlResult.suggestions.map((s, i) => (
//               <li key={i} className="flex items-start gap-2 text-xs">
//                 <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{i + 1}</span>
//                 <span>{s}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // FIX: PipelineCreatedCard — rich display of pipeline creation result
// // ─────────────────────────────────────────────────────────────
// function PipelineCreatedCard({
//   pipeline,
//   allJobs,
// }: {
//   pipeline: PipelineCreatedResult;
//   allJobs: PipelineJob[]; // used to resolve job_id -> job_name
// }) {
//   // Build job name lookup: first from pipeline.job_names, then from allJobs list
//   const resolveJobName = (jobId: string): string => {
//     if (pipeline.job_names?.[jobId]) return pipeline.job_names[jobId];
//     const found = allJobs.find((j) => j.job_id === jobId);
//     return found ? found.job_name : jobId.slice(0, 8) + "…";
//   };

//   const scheduleLabel = () => {
//     if (!pipeline.schedule) return null;
//     const { type, hour, minute, day } = pipeline.schedule;
//     const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
//     if (type === "daily") return `Every day at ${timeStr}`;
//     if (type === "weekly") return `Every week at ${timeStr}`;
//     if (type === "monthly") return `Every month on day ${day} at ${timeStr}`;
//     return `${type} at ${timeStr}`;
//   };

//   const schedStr = scheduleLabel();

//   return (
//     <div style={{
//       marginTop: 10,
//       background: "linear-gradient(135deg, hsl(142 72% 42% / 0.07), hsl(197 100% 55% / 0.05))",
//       border: "1.5px solid hsl(142 72% 42% / 0.35)",
//       borderRadius: 14,
//       padding: "16px 18px",
//       maxWidth: 480,
//     }}>
//       {/* Header */}
//       <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
//         <div style={{
//           display: "flex", alignItems: "center", justifyContent: "center",
//           width: 34, height: 34, borderRadius: 10,
//           background: "hsl(142 72% 42%)", flexShrink: 0,
//         }}>
//           <CheckCircle style={{ width: 18, height: 18, color: "#fff" }} />
//         </div>
//         <div>
//           <div style={{ fontWeight: 700, fontSize: 14, color: "hsl(var(--foreground))" }}>
//             Pipeline Created Successfully
//           </div>
//           <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>
//             {schedStr ? "Scheduled & ready to run" : "Ready to run on demand"}
//           </div>
//         </div>
//       </div>

//       {/* Pipeline Name */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 8,
//         background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
//         borderRadius: 9, padding: "8px 12px", marginBottom: 10,
//       }}>
//         <GitBranch style={{ width: 14, height: 14, color: "hsl(var(--primary))", flexShrink: 0 }} />
//         <div>
//           <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 1 }}>PIPELINE NAME</div>
//           <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--foreground))" }}>{pipeline.name}</div>
//         </div>
//       </div>

//       {/* Jobs included */}
//       <div style={{ marginBottom: 10 }}>
//         <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 6 }}>
//           JOBS INCLUDED ({pipeline.jobs.length})
//         </div>
//         <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//           {pipeline.jobs.map((jobId, idx) => (
//             <div key={jobId} style={{
//               display: "flex", alignItems: "center", gap: 8,
//               background: "hsl(var(--card))", border: "1px solid hsl(var(--border))",
//               borderRadius: 8, padding: "6px 10px",
//             }}>
//               <span style={{
//                 fontSize: 9, fontWeight: 700, color: "hsl(var(--primary))",
//                 background: "hsl(var(--primary) / 0.12)", borderRadius: 4,
//                 padding: "2px 6px", minWidth: 20, textAlign: "center",
//               }}>{idx + 1}</span>
//               <div>
//                 <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))" }}>
//                   {resolveJobName(jobId)}
//                 </div>
//                 <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>
//                   {jobId.slice(0, 8)}…
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Schedule */}
//       {schedStr && (
//         <div style={{
//           display: "flex", alignItems: "center", gap: 8,
//           background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.25)",
//           borderRadius: 9, padding: "8px 12px",
//         }}>
//           <Calendar style={{ width: 14, height: 14, color: "hsl(197 100% 38%)", flexShrink: 0 }} />
//           <div>
//             <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 1 }}>SCHEDULE</div>
//             <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(197 100% 35%)" }}>{schedStr}</div>
//           </div>
//           <div style={{ marginLeft: "auto" }}>
//             <span style={{
//               fontSize: 10, fontWeight: 600, color: "#fff",
//               background: "hsl(142 72% 38%)", borderRadius: 20,
//               padding: "2px 8px",
//             }}>Active</span>
//           </div>
//         </div>
//       )}

//       {/* Pipeline ID */}
//       <div style={{ marginTop: 10, fontSize: 10, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>
//         ID: {pipeline.pipeline_id}
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // PowerBIDashboardCard
// // ─────────────────────────────────────────────────────────────
// function PowerBIDashboardCard({ dashboard }: { dashboard: DashboardResult }) {
//   const navigate = useNavigate();
//   const visuals = dashboard.visuals || [];
//   const kpiVisuals = visuals.filter((v: any) => v.chart_type === "KPI" || v.chart_type === "card");
//   const chartVisuals = visuals.filter((v: any) => !["KPI", "card"].includes(v.chart_type));
//   const hasKpis = kpiVisuals.length > 0;
//   const hasCharts = chartVisuals.length > 0;

//   return (
//     <div className="mt-3 w-full max-w-2xl space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-2">
//           <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//             <BarChart3 className="w-5 h-5 text-primary" />
//           </div>
//           <span className="text-base font-semibold text-foreground">Power BI Dashboard</span>
//         </div>
//         <button
//           onClick={() => navigate("/workflow/powerbi-flow")}
//           style={{
//             display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff",
//             background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "1px solid rgba(255,255,255,0.15)",
//             borderRadius: 8, padding: "7px 14px", cursor: "pointer",
//             boxShadow: "0 1px 4px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)", transition: "all 0.2s ease",
//           }}
//           onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
//           onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}
//         >
//           <Share2 style={{ width: 13, height: 13 }} />
//           Deploy to Power BI
//         </button>
//       </div>

//       <div className="flex flex-wrap items-center gap-3 text-xs">
//         <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{kpiVisuals.length} KPIs</span>
//         <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">{dashboard.total_visuals} Visuals</span>
//         <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{dashboard.total_kpis_discovered} KPIs Discovered</span>
//       </div>

//       {hasKpis && (
//         <div>
//           <div className="flex items-center gap-2 mb-3">
//             <TrendingUp className="w-4 h-4 text-primary" />
//             <span className="text-sm font-semibold text-foreground">Key Results</span>
//           </div>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//             {kpiVisuals.map((kpi: any, i: number) => {
//               const val = kpi.value;
//               const formatted = val == null ? "No data" : val >= 1_000_000 ? `${(val / 1_000_000).toFixed(2)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(2)}K` : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
//               return (
//                 <div key={i} className="bg-card border border-border rounded-xl p-4">
//                   <p className="text-xs text-muted-foreground font-medium mb-1 leading-snug">{kpi.chart_name}</p>
//                   <p className="text-xl font-bold text-primary leading-none mb-1">{formatted}</p>
//                   <p className="text-[10px] text-muted-foreground leading-snug">{kpi.description || "Result from query"}</p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {hasCharts && (
//         <div>
//           <div className="flex items-center gap-2 mb-3">
//             <BarChart3 className="w-4 h-4 text-primary" />
//             <span className="text-sm font-semibold text-foreground">Visualizations</span>
//           </div>
//           <div className="grid grid-cols-1 gap-5">
//             {chartVisuals.map((visual: any, i: number) => {
//               const hasData = (visual.data?.x?.length > 0) || (visual.data?.y?.length > 0) || (visual.data?.labels?.length > 0) || (visual.data?.values?.length > 0) || (Object.values(visual.data?.series || {}).some((arr: any) => arr.length > 0)) || (visual.data?.rows?.length > 0);
//               const chartType = visual.chart_type === "column" || visual.chart_type === "histogram" ? "bar" : visual.chart_type;

//               return (
//                 <div key={i} className="bg-card rounded-xl border border-border p-4">
//                   <h3 className="text-sm font-semibold text-foreground mb-1">{visual.chart_name}</h3>
//                   <p className="text-xs text-muted-foreground mb-4">{visual.description || "No description"}</p>

//                   {(chartType === "bar") && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <BarChart data={(visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))}>
//                           <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" />
//                         </BarChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "stacked_bar" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <BarChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
//                           <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
//                           {Object.keys(visual.data?.series || {}).map((k, si) => (<Bar key={k} dataKey={k} stackId="a" fill={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} />))}
//                         </BarChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "line" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <LineChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
//                           <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
//                           {Object.keys(visual.data?.series || {}).map((k, si) => (<Line key={k} type="monotone" dataKey={k} stroke={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} strokeWidth={2} />))}
//                         </LineChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "area" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <AreaChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
//                           <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
//                           {Object.keys(visual.data?.series || {}).map((k, si) => (<Area key={k} type="monotone" dataKey={k} stackId="1" stroke={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} fill={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} fillOpacity={0.6} />))}
//                         </AreaChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "pie" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <PieChart>
//                           <Pie data={visual.data?.labels ? (visual.data.labels || []).map((label: any, idx: number) => ({ name: String(label), value: visual.data?.values?.[idx] || 0 })) : (visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} dataKey="value">
//                             {(visual.data?.labels || visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
//                           </Pie>
//                           <Tooltip /><Legend />
//                         </PieChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "donut" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <PieChart>
//                           <Pie data={visual.data?.labels ? (visual.data.labels || []).map((label: any, idx: number) => ({ name: String(label), value: visual.data?.values?.[idx] || 0 })) : (visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} cx="50%" cy="50%" outerRadius={80} innerRadius={40} labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} dataKey="value">
//                             {(visual.data?.labels || visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
//                           </Pie>
//                           <Tooltip /><Legend />
//                         </PieChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "funnel" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <FunnelChart>
//                           <Tooltip />
//                           <Funnel dataKey="value" data={(visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} isAnimationActive>
//                             <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
//                             {(visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
//                           </Funnel>
//                         </FunnelChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "scatter" && (
//                     <ResponsiveContainer width="100%" height={260}>
//                       {hasData ? (
//                         <ScatterChart>
//                           <CartesianGrid strokeDasharray="3 3" />
//                           <XAxis type="number" dataKey="x" tick={{ fontSize: 11 }} />
//                           <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} />
//                           <Tooltip /><Legend />
//                           <Scatter data={(visual.data?.x || []).map((xv: any, idx: number) => ({ x: Number(xv), y: Number(visual.data?.y?.[idx] || 0) }))} fill="#3b82f6">
//                             {(visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
//                           </Scatter>
//                         </ScatterChart>
//                       ) : <NoData />}
//                     </ResponsiveContainer>
//                   )}

//                   {chartType === "table" && (
//                     <div className="overflow-x-auto overflow-y-auto" style={{ height: 260 }}>
//                       {hasData && visual.data?.rows?.length > 0 ? (
//                         <table className="w-full text-xs">
//                           <thead className="sticky top-0 bg-card">
//                             <tr className="border-b border-border">
//                               {Object.keys(visual.data.rows[0]).map((h: string) => (<th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>))}
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {visual.data.rows.map((row: any, ri: number) => (
//                               <tr key={ri} className="border-b border-border/50">
//                                 {Object.values(row).map((v: any, ci: number) => (<td key={ci} className="px-3 py-2 text-foreground whitespace-nowrap">{String(v)}</td>))}
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       ) : <NoData />}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       {!hasKpis && !hasCharts && (
//         <div className="text-center py-10">
//           <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
//           <p className="text-sm text-foreground">No results generated</p>
//           <p className="text-xs text-muted-foreground mt-1">The query returned no data or visuals</p>
//         </div>
//       )}
//     </div>
//   );
// }

// function NoData() {
//   return (
//     <div className="h-full flex items-center justify-center text-muted-foreground gap-2">
//       <AlertCircle className="w-6 h-6" />
//       <span className="text-sm">No data available</span>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Pipeline Job Selector — shown inside chat bubble
// // ─────────────────────────────────────────────────────────────
// function PipelineJobSelector({
//   jobs,
//   onConfirm,
// }: {
//   jobs: PipelineJob[];
//   onConfirm: (selectedIds: string[]) => void;
// }) {
//   const [selected, setSelected] = useState<Set<string>>(new Set());

//   const toggle = (id: string) => {
//     setSelected((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   };

//   return (
//     <div style={{ marginTop: 10, maxWidth: 420 }}>
//       <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))", marginBottom: 8 }}>
//         Select jobs to include in the pipeline:
//       </p>
//       <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto", padding: "2px 0" }}>
//         {jobs.map((job) => (
//           <label
//             key={job.job_id}
//             style={{
//               display: "flex", alignItems: "center", gap: 10, padding: "7px 10px",
//               borderRadius: 8, cursor: "pointer",
//               border: selected.has(job.job_id) ? "1.5px solid hsl(var(--primary))" : "1.5px solid hsl(var(--border))",
//               background: selected.has(job.job_id) ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))",
//               transition: "all 0.15s ease",
//             }}
//           >
//             <input
//               type="checkbox"
//               checked={selected.has(job.job_id)}
//               onChange={() => toggle(job.job_id)}
//               style={{ accentColor: "hsl(var(--primary))", width: 14, height: 14 }}
//             />
//             <div>
//               <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))" }}>{job.job_name}</span>
//               <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginLeft: 6 }}>{job.job_id.slice(0, 8)}…</span>
//             </div>
//           </label>
//         ))}
//       </div>
//       <button
//         disabled={selected.size === 0}
//         onClick={() => onConfirm(Array.from(selected))}
//         style={{
//           marginTop: 10, display: "flex", alignItems: "center", gap: 6,
//           fontSize: 12, fontWeight: 600, color: "#fff",
//           background: selected.size === 0 ? "hsl(var(--muted))" : "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
//           border: "none", borderRadius: 8, padding: "7px 16px",
//           cursor: selected.size === 0 ? "not-allowed" : "pointer",
//           opacity: selected.size === 0 ? 0.5 : 1, transition: "all 0.2s ease",
//         }}
//       >
//         <Check style={{ width: 13, height: 13 }} />
//         Confirm Selection ({selected.size})
//       </button>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // ResultCard
// // ─────────────────────────────────────────────────────────────
// function ResultCard({ result, userId, onDownload }: { result: MessageResult; userId: string | null; onDownload: (url: string) => void; }) {
//   // FIX: Prefer job_name from thread response, then suggested_job_name, then pipeline_name
//   const [jobName, setJobName] = useState(result.job_name || result.suggested_job_name || result.pipeline_name || "");
//   const [datasetName, setDatasetName] = useState(result.final_dataset?.dataset_name || "");
//   const [saving, setSaving] = useState(false);
//   const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

//   const handleSaveJobName = async (newName: string) => {
//     const res = await fetch(`${BASE_URL}/rename-job`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", accept: "application/json" },
//       body: JSON.stringify({ user_id: userId, job_id: result.job_id, job_name: newName }),
//     });
//     const data = await res.json();
//     if (data.status === "success") { setJobName(data.job_name || newName); } else { throw new Error("Failed to rename job"); }
//   };

//   const handleRenameDataset = async (newName: string) => {
//     const res = await fetch(`${BASE_URL}/rename-dataset`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json", accept: "application/json" },
//       body: JSON.stringify({ user_id: userId, job_id: result.job_id, old_name: datasetName, new_name: newName }),
//     });
//     const data = await res.json();
//     if (data.status === "success") { setDatasetName(data.new_name || newName); } else { throw new Error("Failed to rename dataset"); }
//   };

//   const handleSaveJob = async () => {
//     if (saving || saveStatus === "success") return;
//     setSaving(true);
//     setSaveStatus("idle");

//     const aivolveUser = getAivolveUser();
//     const datasetFromStorage = localStorage.getItem("current_dataset_name") || "";
//     const onelakePath = localStorage.getItem("current_onelake_path") || "";
//     const sessionId = aivolveUser?.session_id || "";
//     const userEmail = aivolveUser?.email || "";

//     try {
//       const res = await fetch(`${BASE_URL}/save-job`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           job_id: result.job_id,
//           dataset: datasetFromStorage,
//           onelake_path: onelakePath,
//           session_id: sessionId,
//           user_email: userEmail,
//         }),
//       });
//       const data = await res.json();
//       if (data.status !== "success") {
//         setSaveStatus("error");
//         setTimeout(() => setSaveStatus("idle"), 3000);
//         return;
//       }
//       setSaveStatus("success");
//     } catch {
//       setSaveStatus("error");
//       setTimeout(() => setSaveStatus("idle"), 3000);
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="mt-3 w-full max-w-2xl bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
//       <EditableField label="Job Name" value={jobName} onSave={handleSaveJobName} />

//       {result.data_model && result.relationships && (
//         <div>
//           <p className="text-xs font-semibold text-foreground mb-2">Data Model</p>
//           <div className="h-[400px] w-full border border-border rounded-lg overflow-hidden">
//             <ReactFlow
//               nodes={buildStarSchema(result.data_model, result.relationships, result.schemas).nodes}
//               edges={buildStarSchema(result.data_model, result.relationships, result.schemas).edges}
//               nodeTypes={schemaNodeTypes}
//               edgeTypes={schemaEdgeTypes}
//               fitView fitViewOptions={{ padding: 0.3 }}
//               proOptions={{ hideAttribution: true }}
//             >
//               <Background gap={20} size={1} />
//               <Controls showInteractive={false} />
//             </ReactFlow>
//           </div>
//           <DataModelSummary dataModel={result.data_model} relationships={result.relationships} schemas={result.schemas} />
//         </div>
//       )}

//       {result.final_dataset && (
//         <EditableField label="Dataset" value={datasetName} onSave={handleRenameDataset} />
//       )}

//       {result.final_dataset?.preview && (
//         <div className="overflow-auto border border-border rounded-lg">
//           <table className="text-xs w-full">
//             <thead className="bg-muted">
//               <tr>
//                 {Object.keys(result.final_dataset.preview[0]).map((key) => (
//                   <th key={key} className="border-b border-border px-2 py-1.5 text-left text-muted-foreground font-semibold whitespace-nowrap">{key}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {result.final_dataset.preview.slice(0, 5).map((row, i) => (
//                 <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
//                   {Object.values(row).map((val: any, j) => (
//                     <td key={j} className="px-2 py-1.5 text-foreground whitespace-nowrap">{String(val)}</td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//         <div style={{ background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.2)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>
//           <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>💾 Save</span> stores this dataset to your account so you can access it later.{" "}
//           <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>⬇️ Download</span> exports the CSV file directly to your device.
//         </div>

//         <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//           <button
//             onClick={handleSaveJob}
//             disabled={saving || saveStatus === "success"}
//             style={{
//               display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
//               color: saveStatus === "success" ? "#fff" : saveStatus === "error" ? "#fff" : "hsl(var(--foreground))",
//               background: saveStatus === "success" ? "hsl(142 72% 38%)" : saveStatus === "error" ? "hsl(0 72% 51%)" : "hsl(var(--muted))",
//               border: `1.5px solid ${saveStatus === "success" ? "hsl(142 72% 32%)" : saveStatus === "error" ? "hsl(0 72% 46%)" : "hsl(var(--border))"}`,
//               borderRadius: 8, padding: "7px 14px", cursor: saving || saveStatus === "success" ? "default" : "pointer",
//               opacity: saving ? 0.7 : 1, transition: "all 0.25s ease",
//               boxShadow: saveStatus === "success" ? "0 0 0 3px hsl(142 72% 38% / 0.25)" : "none",
//             }}
//           >
//             {saving ? <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" /> : saveStatus === "success" ? <Check style={{ width: 13, height: 13 }} /> : saveStatus === "error" ? <XCircle style={{ width: 13, height: 13 }} /> : <span style={{ fontSize: 13 }}>💾</span>}
//             {saving ? "Saving…" : saveStatus === "success" ? "Saved!" : saveStatus === "error" ? "Save failed" : "Save Dataset"}
//           </button>

//           {result.download_url && (
//             <button
//               onClick={() => onDownload(result.download_url)}
//               style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", transition: "opacity 0.2s ease" }}
//               onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
//               onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
//             >
//               <span style={{ fontSize: 13 }}>⬇️</span> Download CSV
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Helper: render messages from threads API response
// // ─────────────────────────────────────────────────────────────
// function buildMessagesFromThreads(threadsData: any): Message[] {
//   const msgs: Message[] = [];
//   const actions: any[] = threadsData?.actions || [];

//   for (const action of actions) {
//     const type = action.type;
//     const prompt = action.prompt;
//     const response = action.response;
//     const timestamp = new Date(action.timestamp || Date.now());

//     if (prompt) {
//       msgs.push({
//         id: `${type}-user-${timestamp.getTime()}`,
//         role: "user",
//         content: prompt,
//         timestamp,
//       });
//     }

//     if (type === "etl" && response?.status === "success") {
//       msgs.push({
//         id: `${type}-assistant-${timestamp.getTime()}`,
//         role: "assistant",
//         content: response.message || "Job completed.",
//         result: {
//           pipeline_name: response.pipeline_name || "",
//           suggested_job_name: response.suggested_job_name || response.pipeline_name || "",
//           // FIX: pick up job_name from the action if present
//           job_name: action.job_name || response.job_name || "",
//           job_id: threadsData.job_id || "",
//           data_model: response.data_model,
//           relationships: response.relationships,
//           schemas: response.schemas,
//           final_dataset: response.final_dataset,
//           download_url: action.download_url || "",
//         },
//         timestamp,
//       });
//     } else if (type === "powerbi" && response?.status === "success") {
//       msgs.push({
//         id: `${type}-assistant-${timestamp.getTime()}`,
//         role: "assistant",
//         content: "Power BI dashboard generated successfully!",
//         dashboardResult: response,
//         timestamp,
//       });
//     } else if (type === "automl" && response?.status === "success") {
//       msgs.push({
//         id: `${type}-assistant-${timestamp.getTime()}`,
//         role: "assistant",
//         content: "AutoML completed successfully!",
//         automlResult: response,
//         timestamp,
//       });
//     } else if (type === "file_upload" && response) {
//       msgs.push({
//         id: `${type}-assistant-${timestamp.getTime()}`,
//         role: "assistant",
//         content: response.response || "File uploaded successfully.",
//         timestamp,
//       });
//     }
//   }

//   return msgs;
// }

// // ─────────────────────────────────────────────────────────────
// // Main Component
// // ─────────────────────────────────────────────────────────────
// export default function VeritonChatBot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);

//   // Pipeline creation state machine
//   const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
//   const [pipelineSelectedJobs, setPipelineSelectedJobs] = useState<string[]>([]);
//   // FIX: keep track of all known jobs so we can resolve names in PipelineCreatedCard
//   const [allKnownJobs, setAllKnownJobs] = useState<PipelineJob[]>([]);

//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
//     }
//   };

//   const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null;
//   const userId = userFromStorage?.id || null;
//   const jobId = localStorage.getItem("current_job_id");

//   useEffect(() => { scrollToBottom(); }, [messages, loading]);

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
//     }
//   }, [input]);

//   useEffect(() => {
//     if (!userId || !jobId) return;
//     const fetchThreads = async () => {
//       try {
//         const res = await fetch(`${BASE_URL}/threads?user_id=${userId}&job_id=${jobId}`);
//         const data = await res.json();
//         if (!data) return;
//         const restoredMessages = buildMessagesFromThreads(data);
//         if (restoredMessages.length > 0) {
//           setMessages(restoredMessages);
//         }
//       } catch (err) {
//         console.error("Failed to restore threads:", err);
//       }
//     };
//     fetchThreads();
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setAttachedFile(file);
//     e.target.value = "";
//   };

//   const removeAttachment = () => setAttachedFile(null);

//   const isGreeting = (text: string) => {
//     const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
//     return greetings.some((g) => text.toLowerCase().trim() === g || text.toLowerCase().startsWith(g + " ") || text.toLowerCase().startsWith(g + "!") || text.toLowerCase().startsWith(g + ","));
//   };

//   const isPowerBiIntent = (text: string) => {
//     const lower = text.toLowerCase();
//     return (
//       lower.includes("powerbi") || lower.includes("power bi") || lower.includes("dashboard") ||
//       lower.includes("generate dashboard") || lower.includes("create dashboard") ||
//       lower.includes("build dashboard") || lower.includes("report") ||
//       lower.includes("generate report") || lower.includes("create report") ||
//       lower.includes("visualize") || lower.includes("analytics report")
//     );
//   };

//   const isAutoMLIntent = (text: string) => {
//     const lower = text.toLowerCase();
//     return (
//       lower.includes("build model") || lower.includes("train model") || lower.includes("ml model") ||
//       lower.includes("machine learning") || lower.includes("automl") || lower.includes("auto ml") ||
//       lower.includes("regression") || lower.includes("classification") || lower.includes("clustering") ||
//       lower.includes("forecasting") || lower.includes("predict") || lower.includes("build a model") ||
//       lower.includes("run model") || lower.includes("model training") || lower.includes("fit model")
//     );
//   };

//   const isCreatePipelineIntent = (text: string) => {
//     return text.toLowerCase().includes("create pipeline");
//   };

//   // ── Pipeline: step 1 — user typed "create pipeline" → call /chat
//   const handleCreatePipeline = async (content: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           job_id: jobId,
//           message: content,
//           selected_jobs: [],
//         }),
//       });
//       const data = await res.json();
//       const jobs: PipelineJob[] = data.jobs || [];

//       // FIX: store all jobs for later name resolution
//       if (jobs.length > 0) setAllKnownJobs(jobs);

//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: data.response || "Select jobs for pipeline:",
//         pipelineJobs: jobs,
//         timestamp: new Date(),
//       }]);

//       setPipelineStep("awaiting_job_selection");
//     } catch {
//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: "Failed to start pipeline creation. Please try again.",
//         error: true,
//         timestamp: new Date(),
//       }]);
//       setPipelineStep("idle");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Pipeline: step 2 — user selected jobs
//   const handleJobSelectionConfirm = async (selectedIds: string[]) => {
//     setPipelineSelectedJobs(selectedIds);

//     setMessages((prev) => [...prev, {
//       id: Date.now().toString(),
//       role: "user",
//       content: `Selected ${selectedIds.length} job(s) for pipeline.`,
//       timestamp: new Date(),
//     }]);

//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           job_id: jobId,
//           message: "selected",
//           selected_jobs: selectedIds,
//         }),
//       });
//       const data = await res.json();

//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: data.response || "Please enter a pipeline name.",
//         timestamp: new Date(),
//       }]);

//       setPipelineStep("awaiting_pipeline_name");
//     } catch {
//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: "Failed to confirm job selection. Please try again.",
//         error: true,
//         timestamp: new Date(),
//       }]);
//       setPipelineStep("idle");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Pipeline: step 3 — user typed pipeline name
//   // FIX: parse the response.pipeline object and render PipelineCreatedCard
//   const handlePipelineNameSubmit = async (content: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${BASE_URL}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({
//           user_id: userId,
//           job_id: jobId,
//           message: content,
//           selected_jobs: pipelineSelectedJobs,
//         }),
//       });
//       const data = await res.json();

//       // Build a job_names map from allKnownJobs
//       const jobNamesMap: Record<string, string> = {};
//       allKnownJobs.forEach((j) => { jobNamesMap[j.job_id] = j.job_name; });

//       const pipelineCreated: PipelineCreatedResult | undefined = data.pipeline
//         ? { ...data.pipeline, job_names: jobNamesMap }
//         : undefined;

//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: data.response || "Pipeline created successfully!",
//         pipelineCreated,
//         timestamp: new Date(),
//       }]);

//       setPipelineStep("idle");
//       setPipelineSelectedJobs([]);
//     } catch {
//       setMessages((prev) => [...prev, {
//         id: Date.now().toString(),
//         role: "assistant",
//         content: "Failed to create pipeline. Please try again.",
//         error: true,
//         timestamp: new Date(),
//       }]);
//       setPipelineStep("idle");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (text?: string) => {
//     const content = (text || input).trim();
//     if ((!content && !attachedFile) || loading) return;

//     const userMsg: Message = {
//       id: Date.now().toString(),
//       role: "user",
//       content: content || `Uploaded file: ${attachedFile?.name}`,
//       attachment: attachedFile?.name,
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);
//     removeAttachment();

//     if (pipelineStep === "awaiting_pipeline_name") {
//       setLoading(false);
//       await handlePipelineNameSubmit(content);
//       return;
//     }

//     if (isGreeting(content)) {
//       setLoading(false);
//       setTimeout(() => {
//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "Hello! 👋 How can I help you with your data today?",
//           timestamp: new Date(),
//         }]);
//       }, 600);
//       return;
//     }

//     if (isCreatePipelineIntent(content)) {
//       setLoading(false);
//       await handleCreatePipeline(content);
//       return;
//     }

//     if (isAutoMLIntent(content)) {
//       try {
//         if (!userId || !jobId) {
//           setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "User session missing. Please login again.", error: true, timestamp: new Date() }]);
//           setLoading(false);
//           return;
//         }

//         const aivolveUser = getAivolveUser();
//         const sessionId = aivolveUser?.session_id || "";
//         const userEmail = aivolveUser?.email || "";

//         const res = await fetch(`${BASE_URL}/automl/run`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json", accept: "application/json" },
//           body: JSON.stringify({
//             user_id: userId,
//             job_id: jobId,
//             session_id: sessionId,
//             user_email: userEmail,
//             query: content,
//           }),
//         });

//         const data = await res.json();

//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: data.message || "AutoML completed successfully!",
//           automlResult: data,
//           timestamp: new Date(),
//         }]);
//       } catch {
//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "Failed to run AutoML. Please try again.",
//           error: true,
//           timestamp: new Date(),
//         }]);
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     if (isPowerBiIntent(content)) {
//       try {
//         const csvBlob = localStorage.getItem("current_dataset_path");
//         if (!csvBlob) {
//           setMessages((prev) => [...prev, {
//             id: (Date.now() + 1).toString(),
//             role: "assistant",
//             content: "No dataset found. Please run a pipeline first to generate a dataset, then request the dashboard.",
//             error: true,
//             timestamp: new Date(),
//           }]);
//           setLoading(false);
//           return;
//         }

//         const res = await fetch(`${BASE_URL}/generate_powerbi_dashboard`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json", accept: "application/json" },
//           body: JSON.stringify({
//             csv_blob: csvBlob,
//             user_prompt: content,
//             user_id: userId,
//             job_id: jobId,
//           }),
//         });

//         const data = await res.json();

//         const fileName = (localStorage.getItem("current_dataset_path") || "").split("/").pop() || "";
//         sessionStorage.setItem("pbi_generate_visuals", JSON.stringify({ ...data, file_name: fileName }));

//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "Power BI dashboard generated successfully!",
//           dashboardResult: data,
//           timestamp: new Date(),
//         }]);
//       } catch {
//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "Failed to generate the Power BI dashboard. Please try again.",
//           error: true,
//           timestamp: new Date(),
//         }]);
//       } finally {
//         setLoading(false);
//       }
//       return;
//     }

//     // ── Standard pipeline (ETL) flow
//     try {
//       if (!userId || !jobId) {
//         setMessages((prev) => [...prev, {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "User session missing. Please login again.",
//           error: true,
//           timestamp: new Date(),
//         }]);
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`${BASE_URL}/run`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({ user_id: userId, job_id: jobId, prompt: content }),
//       });

//       const data = await res.json();

//       if (data.final_dataset?.dataset_path) {
//         localStorage.setItem("current_dataset_path", data.final_dataset.dataset_path);
//       }
//       if (data.final_dataset?.onelake_path) {
//         localStorage.setItem("current_onelake_path", data.final_dataset.onelake_path);
//       }
//       if (data.final_dataset?.dataset_name) {
//         localStorage.setItem("current_dataset_name", data.final_dataset.dataset_name);
//       }
//       if (data.onelake_path) {
//         localStorage.setItem("current_onelake_path", data.onelake_path);
//       }

//       setMessages((prev) => [...prev, {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: data.message || "Job completed.",
//         result: {
//           pipeline_name: data.pipeline_name,
//           suggested_job_name: data.suggested_job_name || data.pipeline_name,
//           // FIX: include job_name from live API response too
//           job_name: data.job_name || "",
//           job_id: data.job_id,
//           data_model: data.data_model,
//           relationships: data.relationships,
//           schemas: data.schemas,
//           final_dataset: data.final_dataset,
//           download_url: data.download_url,
//         },
//         timestamp: new Date(),
//       }]);
//     } catch {
//       setMessages((prev) => [...prev, {
//         id: (Date.now() + 1).toString(),
//         role: "assistant",
//         content: "I couldn't reach the server. Please try again in a moment.",
//         error: true,
//         timestamp: new Date(),
//       }]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
//   };

//   const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const isEmpty = messages.length === 0;

//   const handleDownload = async (url: string) => {
//     try {
//       const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
//       const response = await fetch(fullUrl);
//       const blob = await response.blob();
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       const fileName = url.split("/").pop() || "dataset.csv";
//       link.download = fileName;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("Download failed", err);
//     }
//   };

//   return (
//     <WorkflowLayout>
//       <div className="flex flex-col h-screen bg-background">
//         {/* Header */}
//         <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
//           <div className="flex items-center gap-3">
//             <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/20">
//               <Sparkles className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h1 className="text-base font-semibold text-foreground leading-tight">Veriton AI</h1>
//               <p className="text-xs text-muted-foreground">Your data, on demand</p>
//             </div>
//           </div>
//           {messages.length > 0 && (
//             <Button variant="ghost" size="sm" onClick={() => { setMessages([]); setPipelineStep("idle"); setPipelineSelectedJobs([]); }} className="text-muted-foreground hover:text-foreground gap-2">
//               <RotateCcw className="w-4 h-4" /> Clear
//             </Button>
//           )}
//         </header>

//         {/* Chat Area */}
//         <main ref={chatContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
//           <div className="max-w-3xl mx-auto px-4 py-6">
//             {isEmpty ? (
//               <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
//                 <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 mb-5">
//                   <Bot className="w-8 h-8 text-white" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-foreground mb-2">What data do you need?</h2>
//                 <p className="text-sm text-muted-foreground max-w-md mb-8">Describe your request in plain English</p>
//               </div>
//             ) : (
//               <div className="space-y-5">
//                 {messages.map((msg) => (
//                   <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
//                     {/* Avatar */}
//                     <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-slate-600 to-slate-800"}`}>
//                       {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
//                     </div>

//                     {/* Bubble + result */}
//                     <div className={`flex flex-col max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
//                       <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${msg.role === "user" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm" : msg.error ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-sm" : "bg-card text-card-foreground border border-border rounded-tl-sm"}`}>
//                         {msg.attachment && msg.role === "user" && (
//                           <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/20 text-xs opacity-90">
//                             <FileText className="w-3.5 h-3.5" /> {msg.attachment}
//                           </div>
//                         )}
//                         {msg.content}
//                       </div>

//                       {/* Pipeline job selector */}
//                       {msg.pipelineJobs && msg.pipelineJobs.length > 0 && pipelineStep === "awaiting_job_selection" && (
//                         <div className="mt-2 w-full max-w-md">
//                           <PipelineJobSelector
//                             jobs={msg.pipelineJobs}
//                             onConfirm={handleJobSelectionConfirm}
//                           />
//                         </div>
//                       )}

//                       {/* ETL Result card */}
//                       {msg.result && !msg.error && (
//                         <ResultCard result={msg.result} userId={userId} onDownload={handleDownload} />
//                       )}

//                       {/* FIX: Pipeline Created card */}
//                       {msg.pipelineCreated && !msg.error && (
//                         <PipelineCreatedCard
//                           pipeline={msg.pipelineCreated}
//                           allJobs={allKnownJobs}
//                         />
//                       )}

//                       {/* Power BI Dashboard card */}
//                       {msg.dashboardResult && !msg.error && (
//                         <PowerBIDashboardCard dashboard={msg.dashboardResult} />
//                       )}

//                       {/* AutoML Result card */}
//                       {msg.automlResult && !msg.error && (
//                         <AutoMLResultCard automlResult={msg.automlResult} />
//                       )}

//                       <span className="text-[11px] text-muted-foreground mt-1 px-1">{formatTime(msg.timestamp)}</span>
//                     </div>
//                   </div>
//                 ))}

//                 {/* Loading */}
//                 {loading && (
//                   <div className="flex gap-3">
//                     <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm flex-shrink-0">
//                       <Bot className="w-4 h-4 text-white" />
//                     </div>
//                     <div className="px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-sm shadow-sm">
//                       <div className="flex items-center gap-1">
//                         <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
//                         <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
//                         <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </main>

//         {/* Footer */}
//         <footer className="sticky bottom-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
//           <div className="max-w-3xl mx-auto px-4 py-3">
//             {attachedFile && (
//               <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
//                 <FileText className="w-4 h-4 text-primary flex-shrink-0" />
//                 <span className="text-sm text-foreground truncate flex-1">{attachedFile.name}</span>
//                 <button onClick={removeAttachment} className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground">
//                   <X className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             )}
//             <div className="flex items-end gap-2 bg-card border border-border rounded-2xl shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all px-2 py-1.5">
//               <button onClick={() => fileInputRef.current?.click()} className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Attach file">
//                 <Paperclip className="w-5 h-5" />
//               </button>
//               <textarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder={
//                   pipelineStep === "awaiting_pipeline_name"
//                     ? "Enter pipeline name (e.g. sales_pipeline daily 10:00)…"
//                     : "Ask for any data…"
//                 }
//                 rows={1}
//                 className="flex-1 bg-transparent outline-none px-1 py-2 text-[15px] text-foreground placeholder:text-muted-foreground resize-none max-h-32 overflow-y-auto"
//               />
//               <Button
//                 onClick={() => sendMessage()}
//                 disabled={(!input.trim() && !attachedFile) || loading}
//                 size="icon"
//                 className="h-9 w-9 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
//               >
//                 {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
//               </Button>
//             </div>
//             <p className="text-[11px] text-muted-foreground text-center mt-2">Press Enter to send · Shift + Enter for new line</p>
//             <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx,.parquet" onChange={handleFileChange} className="hidden" />
//           </div>
//         </footer>
//       </div>
//     </WorkflowLayout>
//   );
// }


import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Send, Loader2, RotateCcw, Paperclip, FileText,
  X, Sparkles, Bot, User, Pencil, Check, XCircle,
  Download, Share2, BarChart3, TrendingUp, AlertCircle,
  CheckCircle, Cpu, Calendar, GitBranch, Clock,
  Database, Search, Eye, ChevronDown, ChevronUp,
  Table2, PlayCircle, Star,
} from "lucide-react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import ReactFlow, {
  Controls,
  Background,
  Handle,
  Position,
  EdgeProps,
  getStraightPath,
} from "reactflow";
import "reactflow/dist/style.css";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, Cell, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Legend, FunnelChart, Funnel, LabelList,
} from "recharts";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─────────────────────────────────────────────────────────────
// Helper: get aivolve_user from localStorage
// ─────────────────────────────────────────────────────────────
function getAivolveUser() {
  try {
    const raw = localStorage.getItem("aivolve_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// EditableField — inline edit with confirm / cancel
// ─────────────────────────────────────────────────────────────
function EditableField({
  value,
  onSave,
  label,
  saving,
}: {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  label: string;
  saving?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const handleSave = async () => {
    if (!draft.trim() || draft === value) {
      setEditing(false);
      setDraft(value);
      return;
    }
    setBusy(true);
    try {
      await onSave(draft.trim());
    } finally {
      setBusy(false);
      setEditing(false);
    }
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
      <span style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
        {label}:
      </span>
      {editing ? (
        <>
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={busy}
            style={{
              fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))",
              background: "hsl(var(--background))", border: "1.5px solid hsl(var(--primary))",
              borderRadius: 6, padding: "2px 8px", outline: "none", minWidth: 160,
            }}
          />
          {busy ? (
            <Loader2 style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} className="animate-spin" />
          ) : (
            <>
              <button onClick={handleSave} title="Save" style={{ background: "hsl(142 72% 42%)", border: "none", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Check style={{ width: 12, height: 12, color: "#fff" }} />
              </button>
              <button onClick={handleCancel} title="Cancel" style={{ background: "hsl(0 72% 51%)", border: "none", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <XCircle style={{ width: 12, height: 12, color: "#fff" }} />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>{value}</span>
          <button onClick={() => { setDraft(value); setEditing(true); }} title={`Edit ${label}`} style={{ background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))", borderRadius: 5, padding: "2px 6px", cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>
            <Pencil style={{ width: 11, height: 11, color: "hsl(var(--muted-foreground))" }} />
            <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>Edit</span>
          </button>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// DataModelSummary
// ─────────────────────────────────────────────────────────────
function DataModelSummary({ dataModel, relationships, schemas }: {
  dataModel: any; relationships: any[]; schemas: any;
}) {
  if (!dataModel?.fact_table) return null;
  const fact = dataModel.fact_table;
  const dims: string[] = dataModel.dimension_tables || [];

  return (
    <div style={{
      background: "linear-gradient(135deg, hsl(267 84% 65% / 0.08), hsl(197 100% 55% / 0.05))",
      border: "1px solid hsl(267 84% 65% / 0.3)", borderRadius: 12, padding: "14px 16px",
      fontSize: 12, color: "hsl(var(--foreground))", lineHeight: 1.8, marginTop: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))", borderRadius: 6, padding: "3px 10px", display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 11 }}>💡</span>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 11, letterSpacing: 0.3 }}>What this diagram shows</span>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "hsl(267 84% 65%)", display: "inline-block", flexShrink: 0 }} />
        <span>
          <span style={{ background: "hsl(267 84% 65%)", color: "#fff", borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 700, marginRight: 5 }}>{fact}</span>
          is the <strong>main table</strong> — holds core transaction data
        </span>
        {schemas?.[fact] && (
          <span style={{ background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)", border: "1px solid hsl(267 84% 65% / 0.3)", borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600 }}>
            {schemas[fact].length} cols
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: "hsl(197 100% 50%)", display: "inline-block", flexShrink: 0 }} />
        <span>Connected to <strong>{dims.length} supporting table{dims.length !== 1 ? "s" : ""}</strong>:</span>
        {dims.map((d) => (
          <span key={d} style={{ background: "hsl(197 100% 50% / 0.12)", color: "hsl(197 100% 38%)", border: "1px solid hsl(197 100% 50% / 0.3)", borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 600 }}>{d}</span>
        ))}
      </div>
      <div style={{ borderTop: "1px solid hsl(267 84% 65% / 0.2)", marginBottom: 10 }} />
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>🔗</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: "hsl(var(--foreground))" }}>How they connect</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {relationships.map((rel, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", background: "hsl(var(--background) / 0.5)", border: "1px solid hsl(267 84% 65% / 0.15)", borderRadius: 8, padding: "5px 10px" }}>
              <span style={{ background: "hsl(267 84% 60%)", color: "#fff", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{rel.from}</span>
              <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 16, lineHeight: 1 }}>→</span>
              <span style={{ background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)", border: "1px solid hsl(267 84% 65% / 0.35)", borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700 }}>{rel.to}</span>
              <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>via</span>
              <code style={{ background: "hsl(267 84% 65% / 0.1)", color: "hsl(267 84% 62%)", border: "1px solid hsl(267 84% 65% / 0.25)", borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 600 }}>{rel.join}</code>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 7, background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.25)", borderRadius: 7, padding: "6px 10px" }}>
        <span style={{ fontSize: 13 }}>👆</span>
        <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11, fontStyle: "italic" }}>Hover over any connecting line to see exactly which columns are linked.</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SchemaNode
// ─────────────────────────────────────────────────────────────
function SchemaNode({ data }: { data: any }) {
  const isFact = data.type === "FACT";
  return (
    <div style={{ background: "hsl(var(--card))", border: `2px solid ${isFact ? "hsl(var(--primary))" : "hsl(var(--border))"}`, borderRadius: 10, minWidth: 180, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "inherit" }}>
      <Handle type="target" position={Position.Left} style={{ background: "transparent", border: 0 }} />
      <Handle type="source" position={Position.Right} style={{ background: "transparent", border: 0 }} />
      <div style={{ background: isFact ? "hsl(var(--primary))" : "hsl(var(--muted))", borderRadius: "8px 8px 0 0", padding: "6px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: isFact ? "#fff" : "hsl(var(--foreground))" }}>{data.label}</span>
        <span style={{ fontSize: 9, fontWeight: 600, color: isFact ? "rgba(255,255,255,0.85)" : "hsl(var(--primary))", background: isFact ? "rgba(255,255,255,0.15)" : "hsl(var(--accent) / 0.2)", borderRadius: 4, padding: "1px 5px" }}>{data.type}</span>
      </div>
      <div style={{ padding: "6px 0", maxHeight: 160, overflowY: "auto" }}>
        {(data.columns || []).map((col: string, i: number) => {
          const isJoinCol = (data.relationships || []).some((rel: any) => {
            const [left, right] = rel.join.split("=").map((s: string) => s.trim());
            return left === col || right === col;
          });
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "2px 10px", fontSize: 11, color: "hsl(var(--foreground))", background: isJoinCol ? "hsl(var(--primary) / 0.12)" : "transparent" }}>
              {isJoinCol && <span style={{ color: "hsl(var(--primary))", fontSize: 9, fontWeight: 700 }}>⬡</span>}
              <span>{col}</span>
              {isJoinCol && <span style={{ marginLeft: "auto", fontSize: 9, color: "hsl(var(--primary))", fontWeight: 600 }}>FK</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SchemaEdge
// ─────────────────────────────────────────────────────────────
function SchemaEdge({ sourceX, sourceY, targetX, targetY, data, selected }: EdgeProps & { data?: { join: string } }) {
  const [hovered, setHovered] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [edgePath] = getStraightPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <path d={edgePath} fill="none" stroke="transparent" strokeWidth={20}
        onMouseEnter={(e) => { setHovered(true); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
        onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: "pointer" }}
      />
      <path d={edgePath} fill="none"
        stroke={hovered || selected ? "#f59e0b" : "#6366f1"}
        strokeWidth={hovered || selected ? 3 : 2}
        strokeDasharray="5 4"
        style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
      />
      {hovered && data?.join && createPortal(
        <div style={{ position: "fixed", left: tooltipPos.x + 12, top: tooltipPos.y - 36, zIndex: 99999, background: "hsl(var(--card))", color: "hsl(var(--foreground))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 600, pointerEvents: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.25)", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#818cf8" }}>🔗</span>
          <span>{data.join}</span>
        </div>,
        document.body
      )}
    </>
  );
}

const schemaNodeTypes = { schemaNode: SchemaNode };
const schemaEdgeTypes = { schemaEdge: SchemaEdge };

function buildStarSchema(dataModel: any, relationships: any[], schemas: any) {
  if (!dataModel?.fact_table) return { nodes: [], edges: [] };
  const fact = dataModel.fact_table;
  const dims: string[] = dataModel.dimension_tables || [];
  const radius = 260;
  const angleStep = (2 * Math.PI) / Math.max(1, dims.length);

  const nodes: any[] = [{
    id: fact, type: "schemaNode",
    data: { label: fact, type: "FACT", columns: schemas?.[fact] || [], relationships },
    position: { x: 400, y: 300 },
  }];

  dims.forEach((dim, index) => {
    const angle = index * angleStep - Math.PI / 2;
    nodes.push({
      id: dim, type: "schemaNode",
      data: { label: dim, type: "DIM", columns: schemas?.[dim] || [], relationships },
      position: { x: 400 + radius * Math.cos(angle), y: 300 + radius * Math.sin(angle) },
    });
  });

  const edges: any[] = relationships.map((rel: any) => ({
    id: `${rel.from}-${rel.to}`, source: rel.from, target: rel.to,
    type: "schemaEdge", data: { join: rel.join }, animated: false,
  }));

  return { nodes, edges };
}

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface MessageResult {
  pipeline_name: string;
  suggested_job_name: string;
  job_name?: string;
  job_id: string;
  data_model: any;
  relationships: any[];
  schemas: any;
  final_dataset: {
    rows: number;
    columns: string[];
    preview: any[];
    dataset_name: string;
    dataset_path: string;
    onelake_path?: string;
  };
  download_url: string;
}

interface DashboardKPI {
  kpi_name: string;
  measures: string;
  metrics: number;
}

interface DashboardVisual {
  chart_name: string;
  chart_type: string;
  description: string;
  value?: number;
  format?: string;
  x_axis_column?: string;
  y_axis_columns?: string[];
  data?: any;
}

interface DashboardResult {
  status: string;
  user_prompt: string;
  total_kpis_discovered: number;
  selected_kpi_names: string[];
  computed_kpis: DashboardKPI[];
  visuals: DashboardVisual[];
  total_visuals: number;
}

interface AutoMLResult {
  status: string;
  message: string;
  session_id: string;
  model_id: string;
  task_type: string;
  target: string;
  best_model: string;
  primary_metric: string;
  primary_score: number;
  all_models: Record<string, any>;
  analysis: string;
  blob_file_used: string;
  results_filename: string;
  dataset_id: string;
  suggestions: string[];
}

type PipelineStep = "idle" | "awaiting_job_selection" | "awaiting_pipeline_name";

interface PipelineJob {
  job_id: string;
  job_name: string;
}

interface PipelineCreatedResult {
  pipeline_id: string;
  user_id: string;
  name: string;
  jobs: string[];
  schedule?: {
    type: string;
    hour: number;
    minute: number;
    day?: string;
  };
  job_names?: Record<string, string>;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: MessageResult;
  dashboardResult?: DashboardResult;
  automlResult?: AutoMLResult;
  pipelineCreated?: PipelineCreatedResult;
  attachment?: string;
  error?: boolean;
  timestamp: Date;
  pipelineJobs?: PipelineJob[];
  isDatasetPicker?: boolean;
}

// ─────────────────────────────────────────────────────────────
// Dataset types
// ─────────────────────────────────────────────────────────────
interface DatasetItem {
  jobName: string;
  datasetName: string;
  lastRun: string;
  completedAt: string;
  job_id: string;
  dataset_path?: string;
  onelake_path?: string;
}

interface DatasetPreviewData {
  columns: string[];
  column_types: Record<string, string>;
  preview_rows: Record<string, any>[];
  total_rows: number;
  total_columns: number;
}

interface ActiveDataset {
  datasetName: string;
  jobName: string;
  job_id: string;
  dataset_path: string;
  onelake_path?: string;
}

// ─────────────────────────────────────────────────────────────
// API base URL
// ─────────────────────────────────────────────────────────────
const BASE_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net";

// ─────────────────────────────────────────────────────────────
// Dashboard colors
// ─────────────────────────────────────────────────────────────
const DASHBOARD_COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// ─────────────────────────────────────────────────────────────
// AutoML helpers
// ─────────────────────────────────────────────────────────────
const metricsByTask: Record<string, { key: string; label: string }[]> = {
  Classification: [
    { key: "accuracy", label: "Accuracy" },
    { key: "f1", label: "F1 Score" },
    { key: "precision", label: "Precision" },
    { key: "recall", label: "Recall" },
    { key: "roc_auc", label: "ROC-AUC" },
  ],
  Regression: [
    { key: "rmse", label: "RMSE" },
    { key: "mae", label: "MAE" },
    { key: "r2", label: "R²" },
    { key: "mape", label: "MAPE" },
    { key: "mean_residual", label: "Mean Residual" },
    { key: "std_residual", label: "Std Residual" },
  ],
  Forecasting: [
    { key: "rmse", label: "RMSE" },
    { key: "mae", label: "MAE" },
    { key: "r2", label: "R²" },
    { key: "mape", label: "MAPE" },
  ],
};

function fmt(v: any) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "number") {
    if (Math.abs(v) < 0.0001 && v !== 0) return v.toExponential(3);
    return (Math.round(v * 1000) / 1000).toString();
  }
  return String(v);
}

function PerformanceMetricsTable({
  allModels,
  bestModel,
  taskType,
}: {
  allModels: Record<string, any>;
  bestModel: string;
  taskType: string;
}) {
  const metricSpecs = metricsByTask[taskType] || metricsByTask["Regression"];
  const modelNames = Object.keys(allModels);
  if (modelNames.length === 0) return null;

  return (
    <div style={{ overflowX: "auto", marginTop: 4 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
        <thead>
          <tr style={{ background: "hsl(var(--muted))" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "hsl(var(--foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
              Model
            </th>
            {metricSpecs.map((m) => (
              <>
                <th key={`${m.key}-train`} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "hsl(var(--muted-foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
                  {m.label} (train)
                </th>
                <th key={`${m.key}-test`} style={{ padding: "8px 10px", textAlign: "center", fontWeight: 600, color: "hsl(var(--muted-foreground))", borderBottom: "1px solid hsl(var(--border))", whiteSpace: "nowrap" }}>
                  {m.label} (test)
                </th>
              </>
            ))}
          </tr>
        </thead>
        <tbody>
          {modelNames.map((modelName, idx) => {
            const modelData = allModels[modelName];
            const isBest = modelName === bestModel;
            return (
              <tr
                key={modelName}
                style={{
                  background: isBest ? "hsl(142 72% 42% / 0.08)" : idx % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.3)",
                  borderBottom: "1px solid hsl(var(--border) / 0.5)",
                }}
              >
                <td style={{ padding: "8px 12px", fontWeight: 600, whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ color: "hsl(var(--foreground))" }}>{modelName.replace(/_/g, " ")}</span>
                    {isBest && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: "#fff", background: "hsl(142 72% 38%)", borderRadius: 4, padding: "1px 5px", lineHeight: 1.6 }}>BEST</span>
                    )}
                  </div>
                </td>
                {metricSpecs.map((m) => (
                  <>
                    <td key={`${m.key}-train`} style={{ padding: "8px 10px", textAlign: "center", color: "hsl(var(--muted-foreground))", fontVariantNumeric: "tabular-nums" }}>
                      {fmt(modelData?.train?.[m.key])}
                    </td>
                    <td key={`${m.key}-test`} style={{ padding: "8px 10px", textAlign: "center", color: "hsl(var(--foreground))", fontWeight: isBest ? 600 : 400, fontVariantNumeric: "tabular-nums" }}>
                      {fmt(modelData?.test?.[m.key])}
                    </td>
                  </>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function FormattedAnalysisText({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <div style={{ fontSize: 12, lineHeight: 1.8, color: "hsl(var(--foreground))" }}>
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={i} style={{ height: 6 }} />;
        if (trimmed.startsWith("|")) return null;
        if (/^#{1,3}\s/.test(trimmed)) {
          const headingText = trimmed.replace(/^#{1,3}\s/, "");
          return (
            <div key={i} style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", marginTop: 14, marginBottom: 4 }}>
              {boldBeforeColon(headingText)}
            </div>
          );
        }
        if (/^\d+[\.\)]\s/.test(trimmed)) {
          return (
            <div key={i} style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))", marginTop: 14, marginBottom: 4 }}>
              {boldBeforeColon(trimmed)}
            </div>
          );
        }
        if (/^[-\*•]\s/.test(trimmed)) {
          const content = trimmed.replace(/^[-\*•]\s/, "");
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "hsl(var(--primary))", fontWeight: 700, fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>•</span>
              <span>{boldBeforeColon(content)}</span>
            </div>
          );
        }
        if (/^[A-Za-z ]{2,40}:\s/.test(trimmed)) {
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
              <span style={{ color: "hsl(var(--primary))", fontWeight: 700, fontSize: 14, lineHeight: 1.6, flexShrink: 0 }}>•</span>
              <span>{boldBeforeColon(trimmed)}</span>
            </div>
          );
        }
        return (
          <p key={i} style={{ marginBottom: 4 }}>
            {boldBeforeColon(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function boldBeforeColon(text: string): React.ReactNode {
  const colonIdx = text.indexOf(":");
  if (colonIdx === -1 || colonIdx === text.length - 1) return text;
  const before = text.slice(0, colonIdx);
  const after = text.slice(colonIdx);
  if (before.length > 60 || before.includes(".")) return text;
  return (
    <>
      <strong style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>{before}</strong>
      {after}
    </>
  );
}

function AutoMLResultCard({ automlResult }: { automlResult: AutoMLResult }) {
  const taskType = automlResult.task_type || "Regression";
  const allModels = automlResult.all_models || {};

  return (
    <div className="mt-3 w-full max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <Cpu className="w-5 h-5 text-primary" />
          </div>
          <span className="text-base font-semibold text-foreground">AutoML Results</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="text-sm font-medium text-green-500">Build Complete</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">Task: {automlResult.task_type}</span>
        <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">Target: {automlResult.target}</span>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">Best: {automlResult.best_model}</span>
        <span className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-medium">
          {automlResult.primary_metric?.toUpperCase()}: {fmt(automlResult.primary_score)}
        </span>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b bg-muted/40 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Performance Metrics — Train vs Test</h3>
        </div>
        <div className="p-0">
          <PerformanceMetricsTable allModels={allModels} bestModel={automlResult.best_model} taskType={taskType} />
        </div>
      </div>

      {automlResult.analysis && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3 text-primary flex items-center gap-2">
            <BarChart3 className="w-4 h-4" /> Analysis Summary
          </h2>
          <FormattedAnalysisText text={automlResult.analysis} />
        </div>
      )}

      {automlResult.suggestions?.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-3 text-primary">Next Steps</h2>
          <ul className="space-y-2">
            {automlResult.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-[10px] font-semibold">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PipelineCreatedCard
// ─────────────────────────────────────────────────────────────
function PipelineCreatedCard({ pipeline, allJobs }: { pipeline: PipelineCreatedResult; allJobs: PipelineJob[] }) {
  const resolveJobName = (jobId: string): string => {
    if (pipeline.job_names?.[jobId]) return pipeline.job_names[jobId];
    const found = allJobs.find((j) => j.job_id === jobId);
    return found ? found.job_name : jobId.slice(0, 8) + "…";
  };

  const scheduleLabel = () => {
    if (!pipeline.schedule) return null;
    const { type, hour, minute, day } = pipeline.schedule;
    const timeStr = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
    if (type === "daily") return `Every day at ${timeStr}`;
    if (type === "weekly") return `Every week at ${timeStr}`;
    if (type === "monthly") return `Every month on day ${day} at ${timeStr}`;
    return `${type} at ${timeStr}`;
  };

  const schedStr = scheduleLabel();

  return (
    <div style={{ marginTop: 10, background: "linear-gradient(135deg, hsl(142 72% 42% / 0.07), hsl(197 100% 55% / 0.05))", border: "1.5px solid hsl(142 72% 42% / 0.35)", borderRadius: 14, padding: "16px 18px", maxWidth: 480 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 10, background: "hsl(142 72% 42%)", flexShrink: 0 }}>
          <CheckCircle style={{ width: 18, height: 18, color: "#fff" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "hsl(var(--foreground))" }}>Pipeline Created Successfully</div>
          <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>
            {schedStr ? "Scheduled & ready to run" : "Ready to run on demand"}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 9, padding: "8px 12px", marginBottom: 10 }}>
        <GitBranch style={{ width: 14, height: 14, color: "hsl(var(--primary))", flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 1 }}>PIPELINE NAME</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(var(--foreground))" }}>{pipeline.name}</div>
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 6 }}>JOBS INCLUDED ({pipeline.jobs.length})</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {pipeline.jobs.map((jobId, idx) => (
            <div key={jobId} style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 10px" }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: "hsl(var(--primary))", background: "hsl(var(--primary) / 0.12)", borderRadius: 4, padding: "2px 6px", minWidth: 20, textAlign: "center" }}>{idx + 1}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))" }}>{resolveJobName(jobId)}</div>
                <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>{jobId.slice(0, 8)}…</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {schedStr && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.25)", borderRadius: 9, padding: "8px 12px" }}>
          <Calendar style={{ width: 14, height: 14, color: "hsl(197 100% 38%)", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600, marginBottom: 1 }}>SCHEDULE</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(197 100% 35%)" }}>{schedStr}</div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: "#fff", background: "hsl(142 72% 38%)", borderRadius: 20, padding: "2px 8px" }}>Active</span>
          </div>
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 10, color: "hsl(var(--muted-foreground))", fontFamily: "monospace" }}>
        ID: {pipeline.pipeline_id}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PowerBIDashboardCard
// ─────────────────────────────────────────────────────────────
function PowerBIDashboardCard({ dashboard }: { dashboard: DashboardResult }) {
  const navigate = useNavigate();
  const visuals = dashboard.visuals || [];
  const kpiVisuals = visuals.filter((v: any) => v.chart_type === "KPI" || v.chart_type === "card");
  const chartVisuals = visuals.filter((v: any) => !["KPI", "card"].includes(v.chart_type));
  const hasKpis = kpiVisuals.length > 0;
  const hasCharts = chartVisuals.length > 0;

  return (
    <div className="mt-3 w-full max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <span className="text-base font-semibold text-foreground">Power BI Dashboard</span>
        </div>
        <button
          onClick={() => navigate("/workflow/powerbi-flow")}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, #2563eb, #1d4ed8)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", boxShadow: "0 1px 4px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.1)", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #1d4ed8, #1e40af)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}
        >
          <Share2 style={{ width: 13, height: 13 }} />
          Deploy to Power BI
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">{kpiVisuals.length} KPIs</span>
        <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">{dashboard.total_visuals} Visuals</span>
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">{dashboard.total_kpis_discovered} KPIs Discovered</span>
      </div>

      {hasKpis && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Key Results</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {kpiVisuals.map((kpi: any, i: number) => {
              const val = kpi.value;
              const formatted = val == null ? "No data" : val >= 1_000_000 ? `${(val / 1_000_000).toFixed(2)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(2)}K` : val.toLocaleString(undefined, { maximumFractionDigits: 2 });
              return (
                <div key={i} className="bg-card border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground font-medium mb-1 leading-snug">{kpi.chart_name}</p>
                  <p className="text-xl font-bold text-primary leading-none mb-1">{formatted}</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">{kpi.description || "Result from query"}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasCharts && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Visualizations</span>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {chartVisuals.map((visual: any, i: number) => {
              const hasData = (visual.data?.x?.length > 0) || (visual.data?.y?.length > 0) || (visual.data?.labels?.length > 0) || (visual.data?.values?.length > 0) || (Object.values(visual.data?.series || {}).some((arr: any) => arr.length > 0)) || (visual.data?.rows?.length > 0);
              const chartType = visual.chart_type === "column" || visual.chart_type === "histogram" ? "bar" : visual.chart_type;

              return (
                <div key={i} className="bg-card rounded-xl border border-border p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{visual.chart_name}</h3>
                  <p className="text-xs text-muted-foreground mb-4">{visual.description || "No description"}</p>

                  {(chartType === "bar") && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <BarChart data={(visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "stacked_bar" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <BarChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
                          {Object.keys(visual.data?.series || {}).map((k, si) => (<Bar key={k} dataKey={k} stackId="a" fill={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} />))}
                        </BarChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "line" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <LineChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
                          {Object.keys(visual.data?.series || {}).map((k, si) => (<Line key={k} type="monotone" dataKey={k} stroke={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} strokeWidth={2} />))}
                        </LineChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "area" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <AreaChart data={(visual.data?.x || []).map((x: any, idx: number) => { const pt: any = { name: String(x) }; Object.entries(visual.data?.series || {}).forEach(([k, vals]: [string, any]) => { pt[k] = vals[idx] || 0; }); return pt; })}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} /><Tooltip /><Legend />
                          {Object.keys(visual.data?.series || {}).map((k, si) => (<Area key={k} type="monotone" dataKey={k} stackId="1" stroke={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} fill={DASHBOARD_COLORS[si % DASHBOARD_COLORS.length]} fillOpacity={0.6} />))}
                        </AreaChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "pie" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <PieChart>
                          <Pie data={visual.data?.labels ? (visual.data.labels || []).map((label: any, idx: number) => ({ name: String(label), value: visual.data?.values?.[idx] || 0 })) : (visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} cx="50%" cy="50%" outerRadius={80} labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} dataKey="value">
                            {(visual.data?.labels || visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
                          </Pie>
                          <Tooltip /><Legend />
                        </PieChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "donut" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <PieChart>
                          <Pie data={visual.data?.labels ? (visual.data.labels || []).map((label: any, idx: number) => ({ name: String(label), value: visual.data?.values?.[idx] || 0 })) : (visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} cx="50%" cy="50%" outerRadius={80} innerRadius={40} labelLine={false} label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`} dataKey="value">
                            {(visual.data?.labels || visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
                          </Pie>
                          <Tooltip /><Legend />
                        </PieChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "funnel" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <FunnelChart>
                          <Tooltip />
                          <Funnel dataKey="value" data={(visual.data?.x || []).map((x: any, idx: number) => ({ name: String(x), value: visual.data?.y?.[idx] || (Object.values(visual.data?.series || {}) as any[])[0]?.[idx] || 0 }))} isAnimationActive>
                            <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                            {(visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
                          </Funnel>
                        </FunnelChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "scatter" && (
                    <ResponsiveContainer width="100%" height={260}>
                      {hasData ? (
                        <ScatterChart>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" dataKey="x" tick={{ fontSize: 11 }} />
                          <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} />
                          <Tooltip /><Legend />
                          <Scatter data={(visual.data?.x || []).map((xv: any, idx: number) => ({ x: Number(xv), y: Number(visual.data?.y?.[idx] || 0) }))} fill="#3b82f6">
                            {(visual.data?.x || []).map((_: any, idx: number) => (<Cell key={idx} fill={DASHBOARD_COLORS[idx % DASHBOARD_COLORS.length]} />))}
                          </Scatter>
                        </ScatterChart>
                      ) : <NoData />}
                    </ResponsiveContainer>
                  )}

                  {chartType === "table" && (
                    <div className="overflow-x-auto overflow-y-auto" style={{ height: 260 }}>
                      {hasData && visual.data?.rows?.length > 0 ? (
                        <table className="w-full text-xs">
                          <thead className="sticky top-0 bg-card">
                            <tr className="border-b border-border">
                              {Object.keys(visual.data.rows[0]).map((h: string) => (<th key={h} className="px-3 py-2 text-left font-medium text-muted-foreground whitespace-nowrap">{h}</th>))}
                            </tr>
                          </thead>
                          <tbody>
                            {visual.data.rows.map((row: any, ri: number) => (
                              <tr key={ri} className="border-b border-border/50">
                                {Object.values(row).map((v: any, ci: number) => (<td key={ci} className="px-3 py-2 text-foreground whitespace-nowrap">{String(v)}</td>))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : <NoData />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!hasKpis && !hasCharts && (
        <div className="text-center py-10">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-foreground">No results generated</p>
          <p className="text-xs text-muted-foreground mt-1">The query returned no data or visuals</p>
        </div>
      )}
    </div>
  );
}

function NoData() {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground gap-2">
      <AlertCircle className="w-6 h-6" />
      <span className="text-sm">No data available</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Pipeline Job Selector
// ─────────────────────────────────────────────────────────────
function PipelineJobSelector({ jobs, onConfirm }: { jobs: PipelineJob[]; onConfirm: (selectedIds: string[]) => void }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div style={{ marginTop: 10, maxWidth: 420 }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))", marginBottom: 8 }}>
        Select jobs to include in the pipeline:
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, maxHeight: 240, overflowY: "auto", padding: "2px 0" }}>
        {jobs.map((job) => (
          <label
            key={job.job_id}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 8, cursor: "pointer", border: selected.has(job.job_id) ? "1.5px solid hsl(var(--primary))" : "1.5px solid hsl(var(--border))", background: selected.has(job.job_id) ? "hsl(var(--primary) / 0.08)" : "hsl(var(--card))", transition: "all 0.15s ease" }}
          >
            <input type="checkbox" checked={selected.has(job.job_id)} onChange={() => toggle(job.job_id)} style={{ accentColor: "hsl(var(--primary))", width: 14, height: 14 }} />
            <div>
              <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))" }}>{job.job_name}</span>
              <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginLeft: 6 }}>{job.job_id.slice(0, 8)}…</span>
            </div>
          </label>
        ))}
      </div>
      <button
        disabled={selected.size === 0}
        onClick={() => onConfirm(Array.from(selected))}
        style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: selected.size === 0 ? "hsl(var(--muted))" : "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))", border: "none", borderRadius: 8, padding: "7px 16px", cursor: selected.size === 0 ? "not-allowed" : "pointer", opacity: selected.size === 0 ? 0.5 : 1, transition: "all 0.2s ease" }}
      >
        <Check style={{ width: 13, height: 13 }} />
        Confirm Selection ({selected.size})
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ResultCard
// ─────────────────────────────────────────────────────────────
function ResultCard({ result, userId, onDownload }: { result: MessageResult; userId: string | null; onDownload: (url: string) => void }) {
  const [jobName, setJobName] = useState(result.job_name || result.suggested_job_name || result.pipeline_name || "");
  const [datasetName, setDatasetName] = useState(result.final_dataset?.dataset_name || "");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSaveJobName = async (newName: string) => {
    const res = await fetch(`${BASE_URL}/rename-job`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({ user_id: userId, job_id: result.job_id, job_name: newName }),
    });
    const data = await res.json();
    if (data.status === "success") { setJobName(data.job_name || newName); } else { throw new Error("Failed to rename job"); }
  };

  const handleRenameDataset = async (newName: string) => {
    const res = await fetch(`${BASE_URL}/rename-dataset`, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({ user_id: userId, job_id: result.job_id, old_name: datasetName, new_name: newName }),
    });
    const data = await res.json();
    if (data.status === "success") { setDatasetName(data.new_name || newName); } else { throw new Error("Failed to rename dataset"); }
  };

  const handleSaveJob = async () => {
    if (saving || saveStatus === "success") return;
    setSaving(true);
    setSaveStatus("idle");

    const aivolveUser = getAivolveUser();
    const datasetFromStorage = localStorage.getItem("current_dataset_name") || "";
    const onelakePath = localStorage.getItem("current_onelake_path") || "";
    const sessionId = aivolveUser?.session_id || "";
    const userEmail = aivolveUser?.email || "";

    try {
      const res = await fetch(`${BASE_URL}/save-job`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: result.job_id, dataset: datasetFromStorage, onelake_path: onelakePath, session_id: sessionId, user_email: userEmail }),
      });
      const data = await res.json();
      if (data.status !== "success") { setSaveStatus("error"); setTimeout(() => setSaveStatus("idle"), 3000); return; }
      setSaveStatus("success");
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 w-full max-w-2xl bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
      <EditableField label="Job Name" value={jobName} onSave={handleSaveJobName} />

      {result.data_model && result.relationships && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Data Model</p>
          <div className="h-[400px] w-full border border-border rounded-lg overflow-hidden">
            <ReactFlow
              nodes={buildStarSchema(result.data_model, result.relationships, result.schemas).nodes}
              edges={buildStarSchema(result.data_model, result.relationships, result.schemas).edges}
              nodeTypes={schemaNodeTypes}
              edgeTypes={schemaEdgeTypes}
              fitView fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
          <DataModelSummary dataModel={result.data_model} relationships={result.relationships} schemas={result.schemas} />
        </div>
      )}

      {result.final_dataset && (
        <EditableField label="Dataset" value={datasetName} onSave={handleRenameDataset} />
      )}

      {result.final_dataset?.preview && (
        <div className="overflow-auto border border-border rounded-lg">
          <table className="text-xs w-full">
            <thead className="bg-muted">
              <tr>
                {Object.keys(result.final_dataset.preview[0]).map((key) => (
                  <th key={key} className="border-b border-border px-2 py-1.5 text-left text-muted-foreground font-semibold whitespace-nowrap">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.final_dataset.preview.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  {Object.values(row).map((val: any, j) => (
                    <td key={j} className="px-2 py-1.5 text-foreground whitespace-nowrap">{String(val)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ background: "hsl(197 100% 50% / 0.07)", border: "1px solid hsl(197 100% 50% / 0.2)", borderRadius: 8, padding: "8px 12px", fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>💾 Save</span> stores this dataset to your account so you can access it later.{" "}
          <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>⬇️ Download</span> exports the CSV file directly to your device.
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={handleSaveJob}
            disabled={saving || saveStatus === "success"}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: saveStatus === "success" ? "#fff" : saveStatus === "error" ? "#fff" : "hsl(var(--foreground))", background: saveStatus === "success" ? "hsl(142 72% 38%)" : saveStatus === "error" ? "hsl(0 72% 51%)" : "hsl(var(--muted))", border: `1.5px solid ${saveStatus === "success" ? "hsl(142 72% 32%)" : saveStatus === "error" ? "hsl(0 72% 46%)" : "hsl(var(--border))"}`, borderRadius: 8, padding: "7px 14px", cursor: saving || saveStatus === "success" ? "default" : "pointer", opacity: saving ? 0.7 : 1, transition: "all 0.25s ease", boxShadow: saveStatus === "success" ? "0 0 0 3px hsl(142 72% 38% / 0.25)" : "none" }}
          >
            {saving ? <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" /> : saveStatus === "success" ? <Check style={{ width: 13, height: 13 }} /> : saveStatus === "error" ? <XCircle style={{ width: 13, height: 13 }} /> : <span style={{ fontSize: 13 }}>💾</span>}
            {saving ? "Saving…" : saveStatus === "success" ? "Saved!" : saveStatus === "error" ? "Save failed" : "Save Dataset"}
          </button>

          {result.download_url && (
            <button
              onClick={() => onDownload(result.download_url)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff", background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span style={{ fontSize: 13 }}>⬇️</span> Download CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// InlineDatasetPicker
// ─────────────────────────────────────────────────────────────
function InlineDatasetPicker({
  userId,
  activeDataset,
  onSelect,
  onClose,
}: {
  userId: string | null;
  activeDataset: ActiveDataset | null;
  onSelect: (ds: ActiveDataset) => void;
  onClose: () => void;
}) {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [previewTarget, setPreviewTarget] = useState<DatasetItem | null>(null);
  const [previewData, setPreviewData] = useState<DatasetPreviewData | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    fetch(`https://api.veriton.ai/api/service2/datasets?user_id=${userId}`)
      .then((r) => r.json())
      .then((data: any[]) => {
        setDatasets(
          data.map((item) => ({
            jobName: item.job_name || "Unnamed Job",
            datasetName: item.dataset_name || "Unnamed Dataset",
            lastRun: item.completed_at
              ? new Date(item.completed_at).toLocaleString("en-US", {
                  month: "short", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit", hour12: true,
                })
              : "—",
            completedAt: item.completed_at || "",
            job_id: item.job_id || "",
            dataset_path: item.dataset_path || item.blob_path || "",
            onelake_path: item.onelake_path || "",
          }))
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const openPreview = async (ds: DatasetItem) => {
    setPreviewTarget(ds);
    setPreviewData(null);
    setPreviewError(null);
    setPreviewLoading(true);
    try {
      const url = `https://api.veriton.ai/api/service2/preview-dataset?user_id=${userId}&job_id=${ds.job_id}&datasetname=${encodeURIComponent(ds.datasetName)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status}`);
      const d = await res.json();
      setPreviewData(d);
    } catch (e: any) {
      setPreviewError(e.message || "Failed to load preview");
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setPreviewTarget(null);
    setPreviewData(null);
    setPreviewError(null);
  };

  const filtered = datasets.filter(
    (d) =>
      d.datasetName.toLowerCase().includes(search.toLowerCase()) ||
      d.jobName.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (ds: DatasetItem) => {
    onSelect({
      datasetName: ds.datasetName,
      jobName: ds.jobName,
      job_id: ds.job_id,
      dataset_path: ds.dataset_path || "",
      onelake_path: ds.onelake_path,
    });
  };

  return (
    <>
      <div style={{
        background: "hsl(var(--card))",
        border: "1.5px solid hsl(var(--primary) / 0.3)",
        borderRadius: 16,
        overflow: "hidden",
        width: "100%",
        maxWidth: 560,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, hsl(267 84% 60% / 0.12), hsl(220 90% 60% / 0.08))",
          borderBottom: "1px solid hsl(var(--border))",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <Database style={{ width: 15, height: 15, color: "#fff" }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "hsl(var(--foreground))" }}>
                Select a Dataset to Work With
              </div>
              <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>
                {loading ? "Loading…" : `${datasets.length} dataset${datasets.length !== 1 ? "s" : ""} available`}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))",
              borderRadius: 7, padding: "5px 7px", cursor: "pointer",
              display: "flex", alignItems: "center", color: "hsl(var(--muted-foreground))",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--accent))";
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--foreground))";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--muted))";
              (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
            }}
          >
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 14px", borderBottom: "1px solid hsl(var(--border) / 0.5)" }}>
          <div style={{ position: "relative" }}>
            <Search style={{
              position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)",
              width: 13, height: 13, color: "hsl(var(--muted-foreground))", pointerEvents: "none",
            }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search datasets…"
              style={{
                width: "100%", boxSizing: "border-box",
                paddingLeft: 28, paddingRight: 28, paddingTop: 7, paddingBottom: 7,
                fontSize: 12,
                background: "hsl(var(--muted) / 0.5)",
                border: "1px solid hsl(var(--border))",
                borderRadius: 8,
                color: "hsl(var(--foreground))",
                outline: "none",
                transition: "border-color 0.15s ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "hsl(var(--primary) / 0.5)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "hsl(var(--border))")}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute", right: 7, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  color: "hsl(var(--muted-foreground))", padding: 2,
                  display: "flex", alignItems: "center",
                }}
              >
                <X style={{ width: 11, height: 11 }} />
              </button>
            )}
          </div>
        </div>

        {/* Dataset List */}
        <div style={{ maxHeight: 320, overflowY: "auto", padding: "8px 10px" }}>
          {loading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 120, gap: 8, color: "hsl(var(--muted-foreground))", fontSize: 12 }}>
              <Loader2 style={{ width: 16, height: 16 }} className="animate-spin" />
              Loading your datasets…
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 16px" }}>
              <Database style={{ width: 28, height: 28, color: "hsl(var(--muted-foreground))", margin: "0 auto 8px" }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))", marginBottom: 3 }}>
                {search ? "No matches found" : "No datasets yet"}
              </div>
              <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                {search ? "Try a different search term" : "Run a pipeline first to generate datasets"}
              </div>
            </div>
          ) : (
            filtered.map((ds, i) => {
              const isActive = activeDataset?.datasetName === ds.datasetName && activeDataset?.job_id === ds.job_id;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex", alignItems: "center",
                    padding: "9px 10px", borderRadius: 10, marginBottom: 4,
                    border: isActive
                      ? "1.5px solid hsl(var(--primary))"
                      : "1.5px solid hsl(var(--border))",
                    background: isActive
                      ? "linear-gradient(135deg, hsl(267 84% 60% / 0.1), hsl(220 90% 60% / 0.06))"
                      : "hsl(var(--background))",
                    transition: "all 0.15s ease",
                    cursor: "default",
                    gap: 10,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--primary) / 0.4)";
                      (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--primary) / 0.03)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--border))";
                      (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--background))";
                    }
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                    background: isActive
                      ? "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))"
                      : "hsl(var(--muted))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.15s ease",
                  }}>
                    <Table2 style={{ width: 13, height: 13, color: isActive ? "#fff" : "hsl(var(--muted-foreground))" }} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600, fontSize: 12,
                      color: isActive ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      display: "flex", alignItems: "center", gap: 5,
                    }}>
                      {ds.datasetName}
                      {isActive && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: "#fff",
                          background: "hsl(var(--primary))",
                          borderRadius: 4, padding: "1px 5px", lineHeight: 1.6,
                          flexShrink: 0,
                        }}>ACTIVE</span>
                      )}
                    </div>
                    <div style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", marginTop: 1, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 140 }}>{ds.jobName}</span>
                      <span>·</span>
                      <span style={{ flexShrink: 0 }}>{ds.lastRun}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                    <button
                      onClick={() => openPreview(ds)}
                      title="Preview dataset"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 28, height: 28, borderRadius: 7,
                        background: "hsl(var(--muted))",
                        border: "1px solid hsl(var(--border))",
                        cursor: "pointer", transition: "all 0.15s ease",
                        color: "hsl(var(--muted-foreground))",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(197 100% 50% / 0.1)";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(197 100% 50% / 0.4)";
                        (e.currentTarget as HTMLButtonElement).style.color = "hsl(197 100% 38%)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--muted))";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                        (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
                      }}
                    >
                      <Eye style={{ width: 12, height: 12 }} />
                    </button>

                    {isActive ? (
                      <div style={{
                        display: "flex", alignItems: "center", gap: 4,
                        fontSize: 11, fontWeight: 600, color: "hsl(var(--primary))",
                        background: "hsl(var(--primary) / 0.1)",
                        border: "1px solid hsl(var(--primary) / 0.3)",
                        borderRadius: 7, padding: "5px 9px",
                      }}>
                        <CheckCircle style={{ width: 11, height: 11 }} />
                        Selected
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSelect(ds)}
                        style={{
                          display: "flex", alignItems: "center", gap: 4,
                          fontSize: 11, fontWeight: 600, color: "#fff",
                          background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
                          border: "none", borderRadius: 7, padding: "5px 9px",
                          cursor: "pointer", transition: "opacity 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <PlayCircle style={{ width: 11, height: 11 }} />
                        Use this
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!loading && filtered.length > 0 && (
          <div style={{
            borderTop: "1px solid hsl(var(--border) / 0.5)",
            padding: "8px 14px",
            background: "hsl(var(--muted) / 0.3)",
          }}>
            <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", textAlign: "center", lineHeight: 1.5 }}>
              💡 Select a dataset to make it the active context for analysis, dashboards, and AutoML
            </p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTarget && createPortal(
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div
            onClick={closePreview}
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          />
          <div style={{
            position: "relative",
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 16,
            width: "90vw", maxWidth: 920, maxHeight: "82vh",
            display: "flex", flexDirection: "column",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "16px 20px",
              borderBottom: "1px solid hsl(var(--border))",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "hsl(var(--card))",
              flexShrink: 0,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "hsl(var(--foreground))", marginBottom: 3 }}>
                  Dataset Preview
                </div>
                <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    color: "hsl(var(--primary))", fontWeight: 600,
                    background: "hsl(var(--primary) / 0.1)",
                    border: "1px solid hsl(var(--primary) / 0.2)",
                    borderRadius: 5, padding: "1px 7px", fontSize: 11,
                  }}>
                    {previewTarget.datasetName}
                  </span>
                  {previewData && (
                    <span>{previewData.total_columns} columns × {previewData.total_rows} rows</span>
                  )}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {activeDataset?.datasetName !== previewTarget.datasetName && (
                  <button
                    onClick={() => { handleSelect(previewTarget); closePreview(); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#fff",
                      background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
                      border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer",
                    }}
                  >
                    <PlayCircle style={{ width: 13, height: 13 }} />
                    Use this Dataset
                  </button>
                )}
                <button
                  onClick={closePreview}
                  style={{
                    background: "hsl(var(--muted))", border: "1px solid hsl(var(--border))",
                    borderRadius: 8, padding: "6px 8px", cursor: "pointer",
                    display: "flex", alignItems: "center",
                  }}
                >
                  <X style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))" }} />
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflow: "auto" }}>
              {previewLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 240, gap: 12, color: "hsl(var(--muted-foreground))", fontSize: 13 }}>
                  <Loader2 style={{ width: 24, height: 24 }} className="animate-spin" />
                  Loading preview…
                </div>
              ) : previewError ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 240, gap: 10 }}>
                  <AlertCircle style={{ width: 28, height: 28, color: "hsl(0 72% 51%)" }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: "hsl(0 72% 51%)" }}>Failed to load preview</div>
                  <div style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{previewError}</div>
                </div>
              ) : previewData ? (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                    <tr style={{ background: "hsl(var(--primary))" }}>
                      {previewData.columns.map((col) => (
                        <th key={col} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "#fff", whiteSpace: "nowrap", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
                          <div style={{ fontSize: 12 }}>{col}</div>
                          <div style={{ fontSize: 10, opacity: 0.75, fontWeight: 400, marginTop: 1 }}>{previewData.column_types[col] || "?"}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.preview_rows.length === 0 ? (
                      <tr>
                        <td colSpan={previewData.columns.length} style={{ padding: "40px 16px", textAlign: "center", color: "hsl(var(--muted-foreground))", fontSize: 13 }}>
                          No preview rows available
                        </td>
                      </tr>
                    ) : (
                      previewData.preview_rows.map((row, ri) => (
                        <tr key={ri}
                          style={{ borderBottom: "1px solid hsl(var(--border) / 0.5)", background: ri % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.3)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--primary) / 0.04)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = ri % 2 === 0 ? "transparent" : "hsl(var(--muted) / 0.3)")}
                        >
                          {previewData.columns.map((col) => (
                            <td key={col} style={{ padding: "8px 14px", color: "hsl(var(--foreground))", whiteSpace: "nowrap", borderRight: "1px solid hsl(var(--border) / 0.3)" }}>
                              {row[col] != null ? String(row[col]) : <span style={{ color: "hsl(var(--muted-foreground))" }}>—</span>}
                            </td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              ) : null}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// ActiveDatasetBadge — compact corner pill (UPDATED)
// ─────────────────────────────────────────────────────────────
function ActiveDatasetBadge({
  dataset,
  onClear,
  onChangeClick,
}: {
  dataset: ActiveDataset;
  onClear: () => void;
  onChangeClick: () => void;
}) {
  return (
    <div
      onClick={onChangeClick}
      title={`Active: ${dataset.datasetName} — click to change`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "hsl(var(--muted))",
        border: "1px solid hsl(var(--border))",
        borderRadius: 20,
        padding: "4px 8px 4px 5px",
        cursor: "pointer",
        maxWidth: 210,
        transition: "border-color 0.15s ease, background 0.15s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--primary) / 0.5)";
        (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--primary) / 0.06)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "hsl(var(--border))";
        (e.currentTarget as HTMLDivElement).style.background = "hsl(var(--muted))";
      }}
    >
      {/* Dot indicator */}
      <div style={{
        width: 20,
        height: 20,
        borderRadius: "50%",
        background: "hsl(267 84% 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}>
        <Table2 style={{ width: 10, height: 10, color: "#fff" }} />
      </div>

      {/* Dataset name */}
      <span style={{
        fontSize: 12,
        fontWeight: 500,
        color: "hsl(var(--foreground))",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: 130,
      }}>
        {dataset.datasetName}
      </span>

      {/* Dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClear();
        }}
        title="Remove active dataset"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          color: "hsl(var(--muted-foreground))",
          flexShrink: 0,
          marginLeft: 1,
          transition: "color 0.15s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(0 72% 51%)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}
      >
        <X style={{ width: 11, height: 11 }} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Helper: render messages from threads API response
// ─────────────────────────────────────────────────────────────
function buildMessagesFromThreads(threadsData: any): Message[] {
  const msgs: Message[] = [];
  const actions: any[] = threadsData?.actions || [];

  for (const action of actions) {
    const type = action.type;
    const prompt = action.prompt;
    const response = action.response;
    const timestamp = new Date(action.timestamp || Date.now());

    if (prompt) {
      msgs.push({ id: `${type}-user-${timestamp.getTime()}`, role: "user", content: prompt, timestamp });
    }

    if (type === "etl" && response?.status === "success") {
      msgs.push({
        id: `${type}-assistant-${timestamp.getTime()}`,
        role: "assistant",
        content: response.message || "Job completed.",
        result: {
          pipeline_name: response.pipeline_name || "",
          suggested_job_name: response.suggested_job_name || response.pipeline_name || "",
          job_name: action.job_name || response.job_name || "",
          job_id: threadsData.job_id || "",
          data_model: response.data_model,
          relationships: response.relationships,
          schemas: response.schemas,
          final_dataset: response.final_dataset,
          download_url: action.download_url || "",
        },
        timestamp,
      });
    } else if (type === "powerbi" && response?.status === "success") {
      msgs.push({ id: `${type}-assistant-${timestamp.getTime()}`, role: "assistant", content: "Power BI dashboard generated successfully!", dashboardResult: response, timestamp });
    } else if (type === "automl" && response?.status === "success") {
      msgs.push({ id: `${type}-assistant-${timestamp.getTime()}`, role: "assistant", content: "AutoML completed successfully!", automlResult: response, timestamp });
    } else if (type === "file_upload" && response) {
      msgs.push({ id: `${type}-assistant-${timestamp.getTime()}`, role: "assistant", content: response.response || "File uploaded successfully.", timestamp });
    }
  }

  return msgs;
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function VeritonChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [activeDataset, setActiveDataset] = useState<ActiveDataset | null>(null);
  const [datasetPickerOpen, setDatasetPickerOpen] = useState(false);

  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");
  const [pipelineSelectedJobs, setPipelineSelectedJobs] = useState<string[]>([]);
  const [allKnownJobs, setAllKnownJobs] = useState<PipelineJob[]>([]);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  const userFromStorage = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}") : null;
  const userId = userFromStorage?.id || null;
  const jobId = localStorage.getItem("current_job_id");

  useEffect(() => { scrollToBottom(); }, [messages, loading, datasetPickerOpen]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!userId || !jobId) return;
    const fetchThreads = async () => {
      try {
        const res = await fetch(`${BASE_URL}/threads?user_id=${userId}&job_id=${jobId}`);
        const data = await res.json();
        if (!data) return;
        const restoredMessages = buildMessagesFromThreads(data);
        if (restoredMessages.length > 0) {
          setMessages(restoredMessages);
        }
      } catch (err) {
        console.error("Failed to restore threads:", err);
      }
    };
    fetchThreads();
  }, []);

  const handleDatasetSelect = (ds: ActiveDataset) => {
    setActiveDataset(ds);
    if (ds.dataset_path) localStorage.setItem("current_dataset_path", ds.dataset_path);
    if (ds.onelake_path) localStorage.setItem("current_onelake_path", ds.onelake_path);
    if (ds.datasetName) localStorage.setItem("current_dataset_name", ds.datasetName);
    setDatasetPickerOpen(false);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ **${ds.datasetName}** is now your active dataset. I'll use it for analysis, dashboards, and AutoML. What would you like to do with it?`,
        timestamp: new Date(),
      },
    ]);
  };

  const handleClearActiveDataset = () => {
    setActiveDataset(null);
    localStorage.removeItem("current_dataset_path");
    localStorage.removeItem("current_dataset_name");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  };

  const removeAttachment = () => setAttachedFile(null);

  const isGreeting = (text: string) => {
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
    return greetings.some((g) => text.toLowerCase().trim() === g || text.toLowerCase().startsWith(g + " ") || text.toLowerCase().startsWith(g + "!") || text.toLowerCase().startsWith(g + ","));
  };

  const isPowerBiIntent = (text: string) => {
    const lower = text.toLowerCase();
    return lower.includes("powerbi") || lower.includes("power bi") || lower.includes("dashboard") || lower.includes("generate dashboard") || lower.includes("create dashboard") || lower.includes("build dashboard") || lower.includes("report") || lower.includes("generate report") || lower.includes("create report") || lower.includes("visualize") || lower.includes("analytics report");
  };

  const isAutoMLIntent = (text: string) => {
    const lower = text.toLowerCase();
    return lower.includes("build model") || lower.includes("train model") || lower.includes("ml model") || lower.includes("machine learning") || lower.includes("automl") || lower.includes("auto ml") || lower.includes("regression") || lower.includes("classification") || lower.includes("clustering") || lower.includes("forecasting") || lower.includes("predict") || lower.includes("build a model") || lower.includes("run model") || lower.includes("model training") || lower.includes("fit model");
  };

  const isCreatePipelineIntent = (text: string) => {
    return text.toLowerCase().includes("create pipeline");
  };

  const isDatasetIntent = (text: string) => {
    const lower = text.toLowerCase();
    return lower.includes("select dataset") || lower.includes("choose dataset") || lower.includes("switch dataset") || lower.includes("change dataset") || lower.includes("my datasets") || lower.includes("show datasets") || lower.includes("list datasets") || lower.includes("use dataset") || lower.includes("open dataset");
  };

  const handleCreatePipeline = async (content: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId, message: content, selected_jobs: [] }),
      });
      const data = await res.json();
      const jobs: PipelineJob[] = data.jobs || [];
      if (jobs.length > 0) setAllKnownJobs(jobs);
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.response || "Select jobs for pipeline:", pipelineJobs: jobs, timestamp: new Date() }]);
      setPipelineStep("awaiting_job_selection");
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Failed to start pipeline creation. Please try again.", error: true, timestamp: new Date() }]);
      setPipelineStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const handleJobSelectionConfirm = async (selectedIds: string[]) => {
    setPipelineSelectedJobs(selectedIds);
    setMessages((prev) => [...prev, { id: Date.now().toString(), role: "user", content: `Selected ${selectedIds.length} job(s) for pipeline.`, timestamp: new Date() }]);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId, message: "selected", selected_jobs: selectedIds }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.response || "Please enter a pipeline name.", timestamp: new Date() }]);
      setPipelineStep("awaiting_pipeline_name");
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Failed to confirm job selection. Please try again.", error: true, timestamp: new Date() }]);
      setPipelineStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const handlePipelineNameSubmit = async (content: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId, message: content, selected_jobs: pipelineSelectedJobs }),
      });
      const data = await res.json();
      const jobNamesMap: Record<string, string> = {};
      allKnownJobs.forEach((j) => { jobNamesMap[j.job_id] = j.job_name; });
      const pipelineCreated: PipelineCreatedResult | undefined = data.pipeline ? { ...data.pipeline, job_names: jobNamesMap } : undefined;
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: data.response || "Pipeline created successfully!", pipelineCreated, timestamp: new Date() }]);
      setPipelineStep("idle");
      setPipelineSelectedJobs([]);
    } catch {
      setMessages((prev) => [...prev, { id: Date.now().toString(), role: "assistant", content: "Failed to create pipeline. Please try again.", error: true, timestamp: new Date() }]);
      setPipelineStep("idle");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if ((!content && !attachedFile) || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content || `Uploaded file: ${attachedFile?.name}`,
      attachment: attachedFile?.name,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    removeAttachment();

    if (pipelineStep === "awaiting_pipeline_name") {
      setLoading(false);
      await handlePipelineNameSubmit(content);
      return;
    }

    if (isGreeting(content)) {
      setLoading(false);
      setTimeout(() => {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Hello! 👋 How can I help you with your data today?", timestamp: new Date() }]);
      }, 600);
      return;
    }

    if (isDatasetIntent(content)) {
      setLoading(false);
      setDatasetPickerOpen(true);
      return;
    }

    if (isCreatePipelineIntent(content)) {
      setLoading(false);
      await handleCreatePipeline(content);
      return;
    }

    if (isAutoMLIntent(content)) {
      try {
        if (!userId || !jobId) {
          setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "User session missing. Please login again.", error: true, timestamp: new Date() }]);
          setLoading(false);
          return;
        }
        const aivolveUser = getAivolveUser();
        const sessionId = aivolveUser?.session_id || "";
        const userEmail = aivolveUser?.email || "";
        const res = await fetch(`${BASE_URL}/automl/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify({ user_id: userId, job_id: jobId, session_id: sessionId, user_email: userEmail, query: content }),
        });
        const data = await res.json();
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: data.message || "AutoML completed successfully!", automlResult: data, timestamp: new Date() }]);
      } catch {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Failed to run AutoML. Please try again.", error: true, timestamp: new Date() }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    if (isPowerBiIntent(content)) {
      try {
        const csvBlob = localStorage.getItem("current_dataset_path");
        if (!csvBlob) {
          setMessages((prev) => [...prev, {
            id: (Date.now() + 1).toString(), role: "assistant",
            content: "No dataset selected. Please select a dataset first by clicking the **Datasets** button, then request the dashboard.",
            error: true, timestamp: new Date(),
          }]);
          setLoading(false);
          return;
        }
        const res = await fetch(`${BASE_URL}/generate_powerbi_dashboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "application/json" },
          body: JSON.stringify({ csv_blob: csvBlob, user_prompt: content, user_id: userId, job_id: jobId }),
        });
        const data = await res.json();
        const fileName = (localStorage.getItem("current_dataset_path") || "").split("/").pop() || "";
        sessionStorage.setItem("pbi_generate_visuals", JSON.stringify({ ...data, file_name: fileName }));
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Power BI dashboard generated successfully!", dashboardResult: data, timestamp: new Date() }]);
      } catch {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "Failed to generate the Power BI dashboard. Please try again.", error: true, timestamp: new Date() }]);
      } finally {
        setLoading(false);
      }
      return;
    }

    // Standard ETL flow
    try {
      if (!userId || !jobId) {
        setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "User session missing. Please login again.", error: true, timestamp: new Date() }]);
        setLoading(false);
        return;
      }
      const res = await fetch(`${BASE_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId, prompt: content }),
      });
      const data = await res.json();
      if (data.final_dataset?.dataset_path) localStorage.setItem("current_dataset_path", data.final_dataset.dataset_path);
      if (data.final_dataset?.onelake_path) localStorage.setItem("current_onelake_path", data.final_dataset.onelake_path);
      if (data.final_dataset?.dataset_name) localStorage.setItem("current_dataset_name", data.final_dataset.dataset_name);
      if (data.onelake_path) localStorage.setItem("current_onelake_path", data.onelake_path);
      if (data.final_dataset?.dataset_path) {
        setActiveDataset({
          datasetName: data.final_dataset.dataset_name || "",
          jobName: data.suggested_job_name || data.pipeline_name || "",
          job_id: data.job_id || "",
          dataset_path: data.final_dataset.dataset_path,
          onelake_path: data.final_dataset.onelake_path,
        });
      }
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Job completed.",
        result: {
          pipeline_name: data.pipeline_name,
          suggested_job_name: data.suggested_job_name || data.pipeline_name,
          job_name: data.job_name || "",
          job_id: data.job_id,
          data_model: data.data_model,
          relationships: data.relationships,
          schemas: data.schemas,
          final_dataset: data.final_dataset,
          download_url: data.download_url,
        },
        timestamp: new Date(),
      }]);
    } catch {
      setMessages((prev) => [...prev, { id: (Date.now() + 1).toString(), role: "assistant", content: "I couldn't reach the server. Please try again in a moment.", error: true, timestamp: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isEmpty = messages.length === 0 && !datasetPickerOpen;

  const handleDownload = async (url: string) => {
    try {
      const fullUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      const fileName = url.split("/").pop() || "dataset.csv";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <WorkflowLayout>
      <div className="flex flex-col h-screen bg-background">

        {/* ── Header ── */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-md shadow-purple-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground leading-tight">Veriton AI</h1>
              <p className="text-xs text-muted-foreground">Your data, on demand</p>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Compact dataset pill — shown when active, replaces the Datasets button */}
            {activeDataset ? (
              <ActiveDatasetBadge
                dataset={activeDataset}
                onClear={handleClearActiveDataset}
                onChangeClick={() => setDatasetPickerOpen(true)}
              />
            ) : (
              <button
                onClick={() => setDatasetPickerOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 500,
                  color: datasetPickerOpen ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: datasetPickerOpen ? "hsl(var(--primary) / 0.08)" : "hsl(var(--muted))",
                  border: `1px solid ${datasetPickerOpen ? "hsl(var(--primary) / 0.4)" : "hsl(var(--border))"}`,
                  borderRadius: 20, padding: "5px 10px",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary) / 0.4)";
                  (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--primary))";
                }}
                onMouseLeave={(e) => {
                  if (!datasetPickerOpen) {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                    (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
                  }
                }}
              >
                <Database style={{ width: 13, height: 13 }} />
                Datasets
                {datasetPickerOpen
                  ? <ChevronUp style={{ width: 11, height: 11 }} />
                  : <ChevronDown style={{ width: 11, height: 11 }} />}
              </button>
            )}

            {/* Clear button */}
            {(messages.length > 0 || datasetPickerOpen) && (
              <button
                onClick={() => {
                  setMessages([]);
                  setPipelineStep("idle");
                  setPipelineSelectedJobs([]);
                  setDatasetPickerOpen(false);
                }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 12, fontWeight: 500,
                  color: "hsl(var(--muted-foreground))",
                  background: "hsl(var(--muted))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 20, padding: "5px 10px",
                  cursor: "pointer", transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--foreground))";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = "hsl(var(--muted-foreground))";
                }}
              >
                <RotateCcw style={{ width: 13, height: 13 }} />
                Clear
              </button>
            )}
          </div>
        </header>

        {/* ── Chat Area ── */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 mb-5">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">What data do you need?</h2>
                <p className="text-sm text-muted-foreground max-w-md mb-8">Describe your request in plain English</p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    { icon: "🗂️", label: "Select a dataset", action: () => setDatasetPickerOpen(true) },
                    { icon: "📊", label: "Build a dashboard", action: () => setInput("Generate a dashboard") },
                    { icon: "🤖", label: "Train an ML model", action: () => setInput("Build a machine learning model") },
                    { icon: "🔄", label: "Create a pipeline", action: () => setInput("Create pipeline") },
                  ].map((chip) => (
                    <button
                      key={chip.label}
                      onClick={chip.action}
                      style={{
                        display: "flex", alignItems: "center", gap: 6,
                        fontSize: 12, fontWeight: 500,
                        color: "hsl(var(--foreground))",
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 20, padding: "7px 14px",
                        cursor: "pointer", transition: "all 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--primary) / 0.5)";
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--primary) / 0.06)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--border))";
                        (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--card))";
                      }}
                    >
                      <span>{chip.icon}</span>
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-gradient-to-br from-purple-500 to-indigo-600" : "bg-gradient-to-br from-slate-600 to-slate-800"}`}>
                      {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                    </div>

                    <div className={`flex flex-col max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${msg.role === "user" ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm" : msg.error ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-sm" : "bg-card text-card-foreground border border-border rounded-tl-sm"}`}>
                        {msg.attachment && msg.role === "user" && (
                          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/20 text-xs opacity-90">
                            <FileText className="w-3.5 h-3.5" /> {msg.attachment}
                          </div>
                        )}
                        {msg.content}
                      </div>

                      {msg.pipelineJobs && msg.pipelineJobs.length > 0 && pipelineStep === "awaiting_job_selection" && (
                        <div className="mt-2 w-full max-w-md">
                          <PipelineJobSelector jobs={msg.pipelineJobs} onConfirm={handleJobSelectionConfirm} />
                        </div>
                      )}

                      {msg.result && !msg.error && (
                        <ResultCard result={msg.result} userId={userId} onDownload={handleDownload} />
                      )}

                      {msg.pipelineCreated && !msg.error && (
                        <PipelineCreatedCard pipeline={msg.pipelineCreated} allJobs={allKnownJobs} />
                      )}

                      {msg.dashboardResult && !msg.error && (
                        <PowerBIDashboardCard dashboard={msg.dashboardResult} />
                      )}

                      {msg.automlResult && !msg.error && (
                        <AutoMLResultCard automlResult={msg.automlResult} />
                      )}

                      <span className="text-[11px] text-muted-foreground mt-1 px-1">{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-4 py-3 bg-card border border-border rounded-2xl rounded-tl-sm shadow-sm">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Inline Dataset Picker */}
            {datasetPickerOpen && (
              <div className={`${messages.length > 0 ? "mt-6" : "mt-2"} flex gap-3`}>
                <div className="flex items-start justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 shadow-sm flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white mt-2" />
                </div>
                <div className="flex flex-col items-start" style={{ maxWidth: "calc(100% - 44px)", width: "100%" }}>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm bg-card text-card-foreground border border-border shadow-sm text-[15px] leading-relaxed mb-3">
                    Here are your saved datasets. Select one to make it active for analysis, dashboards, and AutoML:
                  </div>
                  <InlineDatasetPicker
                    userId={userId}
                    activeDataset={activeDataset}
                    onSelect={handleDatasetSelect}
                    onClose={() => setDatasetPickerOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ── Footer / Input ── */}
        <footer className="sticky bottom-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="max-w-3xl mx-auto px-4 py-3">
            {/* Active dataset context — slim one-liner above input */}
            {activeDataset && (
              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                marginBottom: 6, fontSize: 11,
                color: "hsl(var(--muted-foreground))",
              }}>
                <Table2 style={{ width: 11, height: 11, color: "hsl(var(--primary))", flexShrink: 0 }} />
                <span>Working on:</span>
                <span style={{ fontWeight: 600, color: "hsl(var(--primary))" }}>{activeDataset.datasetName}</span>
                <button
                  onClick={() => setDatasetPickerOpen(true)}
                  style={{
                    marginLeft: 4, fontSize: 10, fontWeight: 600,
                    color: "hsl(var(--muted-foreground))",
                    background: "none", border: "none", cursor: "pointer",
                    textDecoration: "underline", textUnderlineOffset: 2,
                    transition: "color 0.15s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "hsl(var(--primary))")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "hsl(var(--muted-foreground))")}
                >
                  Change
                </button>
              </div>
            )}

            {attachedFile && (
              <div className="mb-2 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded-lg">
                <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground truncate flex-1">{attachedFile.name}</span>
                <button onClick={removeAttachment} className="p-1 rounded-md hover:bg-primary/10 text-muted-foreground hover:text-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="flex items-end gap-2 bg-card border border-border rounded-2xl shadow-sm focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all px-2 py-1.5">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Attach file"
              >
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Datasets quick-access inside input bar */}
              <button
                onClick={() => setDatasetPickerOpen((v) => !v)}
                title="Select dataset"
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  fontSize: 11, fontWeight: 600, flexShrink: 0,
                  padding: "5px 9px", borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                  background: datasetPickerOpen
                    ? "hsl(var(--primary) / 0.1)"
                    : activeDataset
                    ? "hsl(267 84% 60% / 0.1)"
                    : "hsl(var(--muted))",
                  color: (datasetPickerOpen || activeDataset)
                    ? "hsl(var(--primary))"
                    : "hsl(var(--muted-foreground))",
                  cursor: "pointer", transition: "all 0.15s ease",
                  borderColor: (datasetPickerOpen || activeDataset)
                    ? "hsl(var(--primary) / 0.4)"
                    : "hsl(var(--border))",
                }}
              >
                <Database style={{ width: 12, height: 12 }} />
                {activeDataset
                  ? <span style={{ maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{activeDataset.datasetName}</span>
                  : "Datasets"}
              </button>

              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  pipelineStep === "awaiting_pipeline_name"
                    ? "Enter pipeline name (e.g. sales_pipeline daily 10:00)…"
                    : activeDataset
                    ? `Ask about ${activeDataset.datasetName}…`
                    : "Ask for any data…"
                }
                rows={1}
                className="flex-1 bg-transparent outline-none px-1 py-2 text-[15px] text-foreground placeholder:text-muted-foreground resize-none max-h-32 overflow-y-auto"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={(!input.trim() && !attachedFile) || loading}
                size="icon"
                className="h-9 w-9 bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-xl text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Press Enter to send · Shift + Enter for new line
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.json,.xlsx,.parquet"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </footer>
      </div>
    </WorkflowLayout>
  );
}