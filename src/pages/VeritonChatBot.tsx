// import { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Send, Loader2, RotateCcw, Paperclip, FileText,
//   X, Sparkles, Bot, User,
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

// function DataModelSummary({ dataModel, relationships, schemas }: {
//   dataModel: any; relationships: any[]; schemas: any;
// }) {
//   if (!dataModel?.fact_table) return null;
//   const fact = dataModel.fact_table;
//   const dims: string[] = dataModel.dimension_tables || [];

//   return (
//     <div style={{
//       background: "linear-gradient(135deg, hsl(267 84% 65% / 0.08), hsl(197 100% 55% / 0.05))",
//       border: "1px solid hsl(267 84% 65% / 0.3)",
//       borderRadius: 12,
//       padding: "14px 16px",
//       fontSize: 12,
//       color: "hsl(var(--foreground))",
//       lineHeight: 1.8,
//       marginTop: 10,
//     }}>

//       {/* ── Header badge ── */}
//       <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
//         <div style={{
//           background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
//           borderRadius: 6,
//           padding: "3px 10px",
//           display: "flex", alignItems: "center", gap: 5,
//         }}>
//           <span style={{ fontSize: 11 }}>💡</span>
//           <span style={{ fontWeight: 700, color: "#fff", fontSize: 11, letterSpacing: 0.3 }}>
//             What this diagram shows
//           </span>
//         </div>
//       </div>

//       {/* ── Fact table row ── */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 8,
//         marginBottom: 6, flexWrap: "wrap",
//       }}>
//         <span style={{
//           width: 9, height: 9, borderRadius: "50%",
//           background: "hsl(267 84% 65%)",
//           display: "inline-block", flexShrink: 0,
//         }} />
//         <span>
//           <span style={{
//             background: "hsl(267 84% 65%)",
//             color: "#fff",
//             borderRadius: 5, padding: "1px 8px",
//             fontSize: 11, fontWeight: 700, marginRight: 5,
//           }}>{fact}</span>
//           is the <strong>main table</strong> — holds core transaction data
//         </span>
//         {schemas?.[fact] && (
//           <span style={{
//             background: "hsl(267 84% 65% / 0.15)",
//             color: "hsl(267 84% 60%)",
//             border: "1px solid hsl(267 84% 65% / 0.3)",
//             borderRadius: 20, padding: "1px 8px",
//             fontSize: 10, fontWeight: 600,
//           }}>
//             {schemas[fact].length} cols
//           </span>
//         )}
//       </div>

//       {/* ── Dimension tables row ── */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 6,
//         marginBottom: 12, flexWrap: "wrap",
//       }}>
//         <span style={{
//           width: 9, height: 9, borderRadius: "50%",
//           background: "hsl(197 100% 50%)",
//           display: "inline-block", flexShrink: 0,
//         }} />
//         <span>Connected to <strong>{dims.length} supporting table{dims.length !== 1 ? "s" : ""}</strong>:</span>
//         {dims.map((d) => (
//           <span key={d} style={{
//             background: "hsl(197 100% 50% / 0.12)",
//             color: "hsl(197 100% 38%)",
//             border: "1px solid hsl(197 100% 50% / 0.3)",
//             borderRadius: 5, padding: "1px 7px",
//             fontSize: 11, fontWeight: 600,
//           }}>{d}</span>
//         ))}
//       </div>

//       {/* ── Divider ── */}
//       <div style={{
//         borderTop: "1px solid hsl(267 84% 65% / 0.2)",
//         marginBottom: 10,
//       }} />

//       {/* ── Relationships ── */}
//       <div style={{ marginBottom: 10 }}>
//         <div style={{
//           display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
//         }}>
//           <span style={{ fontSize: 13 }}>🔗</span>
//           <span style={{ fontWeight: 700, fontSize: 12, color: "hsl(var(--foreground))" }}>
//             How they connect
//           </span>
//         </div>

//         <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
//           {relationships.map((rel, i) => (
//             <div key={i} style={{
//               display: "flex", alignItems: "center",
//               gap: 6, flexWrap: "wrap",
//               background: "hsl(var(--background) / 0.5)",
//               border: "1px solid hsl(267 84% 65% / 0.15)",
//               borderRadius: 8, padding: "5px 10px",
//             }}>
//               {/* FROM */}
//               <span style={{
//                 background: "hsl(267 84% 60%)",
//                 color: "#fff",
//                 borderRadius: 4, padding: "1px 8px",
//                 fontSize: 11, fontWeight: 700,
//               }}>{rel.from}</span>

//               {/* Arrow */}
//               <span style={{
//                 color: "hsl(var(--muted-foreground))",
//                 fontSize: 16, lineHeight: 1,
//               }}>→</span>

//               {/* TO */}
//               <span style={{
//                 background: "hsl(267 84% 65% / 0.15)",
//                 color: "hsl(267 84% 60%)",
//                 border: "1px solid hsl(267 84% 65% / 0.35)",
//                 borderRadius: 4, padding: "1px 8px",
//                 fontSize: 11, fontWeight: 700,
//               }}>{rel.to}</span>

//               {/* via label */}
//               <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>via</span>

//               {/* JOIN code */}
//               <code style={{
//                 background: "hsl(267 84% 65% / 0.1)",
//                 color: "hsl(267 84% 62%)",
//                 border: "1px solid hsl(267 84% 65% / 0.25)",
//                 borderRadius: 4, padding: "1px 7px",
//                 fontSize: 10, fontWeight: 600,
//               }}>{rel.join}</code>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── Hint bar ── */}
//       <div style={{
//         display: "flex", alignItems: "center", gap: 7,
//         background: "hsl(197 100% 50% / 0.07)",
//         border: "1px solid hsl(197 100% 50% / 0.25)",
//         borderRadius: 7, padding: "6px 10px",
//       }}>
//         <span style={{ fontSize: 13 }}>👆</span>
//         <span style={{
//           color: "hsl(var(--muted-foreground))",
//           fontSize: 11, fontStyle: "italic",
//         }}>
//           Hover over any connecting line to see exactly which columns are linked.
//         </span>
//       </div>

//     </div>
//   );
// }

// function SchemaNode({ data }: { data: any }) {
//   const isFact = data.type === "FACT";

//   return (
//     <div
//       style={{
//         background: isFact ? "hsl(var(--card))" : "hsl(var(--card))",
//         border: `2px solid ${isFact ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
//         borderRadius: 10,
//         minWidth: 180,
//         boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//         fontFamily: "inherit",
//       }}
//     >
//       <Handle type="target" position={Position.Left} style={{ background: "transparent", border: 0 }} />
//       <Handle type="source" position={Position.Right} style={{ background: "transparent", border: 0 }} />

//       {/* Header */}
//       <div
//         style={{
//           background: isFact ? "hsl(var(--primary))" : "hsl(var(--muted))",
//           borderRadius: "8px 8px 0 0",
//           padding: "6px 10px",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <span style={{
//           fontWeight: 700, fontSize: 12,
//           color: isFact ? "#fff" : "hsl(var(--foreground))",
//         }}>
//           {data.label}
//         </span>
//         <span style={{
//           fontSize: 9, fontWeight: 600,
//           color: isFact ? "rgba(255,255,255,0.85)" : "hsl(var(--primary))",
//           background: isFact ? "rgba(255,255,255,0.15)" : "hsl(var(--accent) / 0.2)",
//           borderRadius: 4,
//           padding: "1px 5px",
//         }}>
//           {data.type}
//         </span>
//       </div>

//       {/* Columns */}
//       <div style={{ padding: "6px 0", maxHeight: 160, overflowY: "auto" }}>
//         {(data.columns || []).map((col: string, i: number) => {
//           const isJoinCol = (data.relationships || []).some((rel: any) => {
//             const [left, right] = rel.join.split("=").map((s: string) => s.trim());
//             return left === col || right === col;
//           });
//           return (
//             <div
//               key={i}
//               style={{
//                 display: "flex", alignItems: "center", gap: 6,
//                 padding: "2px 10px", fontSize: 11,
//                 color: "hsl(var(--foreground))",
//                 background: isJoinCol ? "hsl(var(--primary) / 0.12)" : "transparent",
//               }}
//             >
//               {isJoinCol && (
//                 <span style={{ color: "hsl(var(--primary))", fontSize: 9, fontWeight: 700 }}>⬡</span>
//               )}
//               <span>{col}</span>
//               {isJoinCol && (
//                 <span style={{
//                   marginLeft: "auto", fontSize: 9,
//                   color: "hsl(var(--primary))", fontWeight: 600,
//                 }}>FK</span>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function SchemaEdge({
//   sourceX, sourceY, targetX, targetY, data, selected,
// }: EdgeProps & { data?: { join: string } }) {
//   const [hovered, setHovered] = useState(false);
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
//   const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });

//   return (
//     <>
//       <path
//         d={edgePath}
//         fill="none"
//         stroke="transparent"
//         strokeWidth={20}
//         onMouseEnter={(e) => {
//           setHovered(true);
//           setTooltipPos({ x: e.clientX, y: e.clientY });
//         }}
//         onMouseMove={(e) => {
//           setTooltipPos({ x: e.clientX, y: e.clientY });
//         }}
//         onMouseLeave={() => setHovered(false)}
//         style={{ cursor: "pointer" }}
//       />
//       <path
//         d={edgePath}
//         fill="none"
//         stroke={hovered || selected ? "#f59e0b" : "#6366f1"}
//         strokeWidth={hovered || selected ? 3 : 2}
//         strokeDasharray="5 4"
//         style={{ transition: "all 0.15s ease", pointerEvents: "none" }}
//       />
//       {/* Portal tooltip - renders outside ReactFlow container */}
//       {hovered && data?.join && createPortal(
//         <div
//           style={{
//             position: "fixed",
//             left: tooltipPos.x + 12,
//             top: tooltipPos.y - 36,
//             zIndex: 99999,
//             background: "hsl(var(--card))",
//             color: "hsl(var(--foreground))",
//             border: "1px solid hsl(var(--border))",
//             borderRadius: 8,
//             padding: "5px 12px",
//             fontSize: 12,
//             fontWeight: 600,
//             pointerEvents: "none",
//             boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
//             whiteSpace: "nowrap",
//             display: "flex",
//             alignItems: "center",
//             gap: 6,
//           }}
//         >
//           <span style={{ color: "#818cf8" }}>🔗</span>
//           <span>{data.join}</span>
//         </div>,
//         document.body
//       )}
//     </>
//   );
// }

// // ── Must be outside component to avoid remount on every render ─
// const schemaNodeTypes = { schemaNode: SchemaNode };
// const schemaEdgeTypes = { schemaEdge: SchemaEdge };

// // ── Build star schema nodes + edges ───────────────────────────
// function buildStarSchema(dataModel: any, relationships: any[], schemas: any) {
//   if (!dataModel?.fact_table) return { nodes: [], edges: [] };

//   const fact = dataModel.fact_table;
//   const dims: string[] = dataModel.dimension_tables || [];
//   const radius = 260;
//   const angleStep = (2 * Math.PI) / Math.max(1, dims.length);

//   const nodes: any[] = [
//     {
//       id: fact,
//       type: "schemaNode",
//       data: {
//         label: fact,
//         type: "FACT",
//         columns: schemas?.[fact] || [],
//         relationships,
//       },
//       position: { x: 400, y: 300 },
//     },
//   ];

//   dims.forEach((dim, index) => {
//     const angle = index * angleStep - Math.PI / 2;
//     nodes.push({
//       id: dim,
//       type: "schemaNode",
//       data: {
//         label: dim,
//         type: "DIM",
//         columns: schemas?.[dim] || [],
//         relationships,
//       },
//       position: {
//         x: 400 + radius * Math.cos(angle),
//         y: 300 + radius * Math.sin(angle),
//       },
//     });
//   });

//   const edges: any[] = relationships.map((rel: any) => ({
//     id: `${rel.from}-${rel.to}`,
//     source: rel.from,
//     target: rel.to,
//     type: "schemaEdge",
//     data: { join: rel.join },
//     animated: false,
//   }));

//   return { nodes, edges };
// }

// // ─────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────
// interface Message {
//   id: string;
//   role: "user" | "assistant";
//   content: string;
//   result?: {
//     pipeline_name: string;
//     job_id: string;
//     data_model: any;
//     relationships: any[];
//     schemas: any;
//     final_dataset: {
//       rows: number;
//       columns: string[];
//       preview: any[];
//     };
//     download_url: string;
//   };
//   attachment?: string;
//   error?: boolean;
//   timestamp: Date;
// }

// const API_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/run-pipeline";
// const GET_API_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/jobs";
// // ─────────────────────────────────────────────────────────────
// // Main Component
// // ─────────────────────────────────────────────────────────────
// export default function VeritonChatBot() {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [attachedFile, setAttachedFile] = useState<File | null>(null);

//   const chatContainerRef = useRef<HTMLDivElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const scrollToBottom = () => {
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTo({
//         top: chatContainerRef.current.scrollHeight,
//         behavior: "smooth",
//       });
//     }
//   };

//   const userId = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}").id
//     : null;
//   const jobId = localStorage.getItem("current_job_id");

//   useEffect(() => { scrollToBottom(); }, [messages, loading]);

//   useEffect(() => {
//     const textarea = textareaRef.current;
//     if (textarea) {
//       textarea.style.height = "auto";
//       textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
//     }
//   }, [input]);

// //   useEffect(() => {
// //   if (!userId || !jobId) return;

// //   const fetchJobResult = async () => {
// //     try {
// //       const res = await fetch(`${GET_API_URL}/${userId}/${jobId}`);
// //       const data = await res.json();

// //       if (data.status === "success") {
// //         // Recreate the user prompt message from pipeline_metadata
// //         const userMsg: Message = {
// //           id: "restored-user",
// //           role: "user",
// //           content: data.pipeline_metadata?.prompt || "Previous pipeline request",
// //           timestamp: new Date(),
// //         };

// //         // Recreate the assistant result message
// //         const assistantMsg: Message = {
// //           id: "restored-assistant",
// //           role: "assistant",
// //           content: "Pipeline executed successfully",
// //           result: {
// //             pipeline_name: data.pipeline_metadata?.job_id || jobId,
// //             job_id: data.pipeline_metadata?.job_id || jobId,
// //             data_model: data.data_model,
// //             relationships: data.relationships,
// //             schemas: data.schemas,
// //             final_dataset: data.final_dataset,
// //             download_url: "", // set if your GET response includes it
// //           },
// //           timestamp: new Date(),
// //         };

// //         setMessages([userMsg, assistantMsg]);
// //       }
// //     } catch (err) {
// //       console.error("Failed to restore job result:", err);
// //     }
// //   };

// //   fetchJobResult();
// // }, []); // runs once on mount

// useEffect(() => {
//   if (!userId || !jobId) return;

//   const fetchJobResult = async () => {
//     try {
//       const res = await fetch(`${GET_API_URL}/${userId}/${jobId}`);
//       const data = await res.json();

//       if (!data.job_id) return;

//       // User bubble — restored from pipeline_metadata.prompt
//       const userMsg: Message = {
//         id: "restored-user",
//         role: "user",
//         content: data.pipeline_metadata?.prompt || "Previous pipeline request",
//         timestamp: new Date(),
//       };

//       // Assistant result card
//       const assistantMsg: Message = {
//         id: "restored-assistant",
//         role: "assistant",
//         content: "Pipeline executed successfully",
//         result: {
//           pipeline_name: data.pipeline_name,
//           job_id: data.job_id,
//           data_model: data.data_model,
//           relationships: data.relationships,
//           schemas: data.schemas,
//           final_dataset: data.final_dataset,
//           download_url: data.download_url,  // now available directly
//         },
//         timestamp: new Date(),
//       };

//       setMessages([userMsg, assistantMsg]);
//     } catch (err) {
//       console.error("Failed to restore job result:", err);
//     }
//   };

//   fetchJobResult();
// }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) setAttachedFile(file);
//     e.target.value = "";
//   };

//   const removeAttachment = () => setAttachedFile(null);

//   const isGreeting = (text: string) => {
//     const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
//     return greetings.some((g) => text.toLowerCase().includes(g));
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

//     if (isGreeting(content)) {
//       setLoading(false);
//       setTimeout(() => {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: (Date.now() + 1).toString(),
//             role: "assistant",
//             content: "Hello! 👋 How can I help you with your data today?",
//             timestamp: new Date(),
//           },
//         ]);
//       }, 600);
//       return;
//     }

//     try {
//       if (!userId || !jobId) {
//         setMessages((prev) => [
//           ...prev,
//           {
//             id: (Date.now() + 1).toString(),
//             role: "assistant",
//             content: "User session missing. Please login again.",
//             error: true,
//             timestamp: new Date(),
//           },
//         ]);
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json", accept: "application/json" },
//         body: JSON.stringify({ user_id: userId, job_id: jobId, prompt: content }),
//       });

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: data.message || "Pipeline executed successfully",
//           result: {
//             pipeline_name: data.pipeline_name,
//             job_id: data.job_id,
//             data_model: data.data_model,
//             relationships: data.relationships,
//             schemas: data.schemas,
//             final_dataset: data.final_dataset,
//             download_url: data.download_url,
//           },
//           timestamp: new Date(),
//         },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         {
//           id: (Date.now() + 1).toString(),
//           role: "assistant",
//           content: "I couldn't reach the server. Please try again in a moment.",
//           error: true,
//           timestamp: new Date(),
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatTime = (date: Date) =>
//     date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const isEmpty = messages.length === 0;

//   const handleDownload = async (url: string) => {
//     try {
//       const response = await fetch(`http://127.0.0.1:8000${url}`);
//       const blob = await response.blob();
//       const link = document.createElement("a");
//       link.href = window.URL.createObjectURL(blob);
//       link.download = "dataset.csv";
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       console.error("Download failed", err);
//     }
//   };

// return (
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
//             <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-muted-foreground hover:text-foreground gap-2">
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
//                     <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 shadow-sm ${
//                       msg.role === "assistant"
//                         ? "bg-gradient-to-br from-purple-500 to-indigo-600"
//                         : "bg-gradient-to-br from-slate-600 to-slate-800"
//                     }`}>
//                       {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
//                     </div>

//                     {/* Bubble + result */}
//                     <div className={`flex flex-col max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      
//                       {/* Message text bubble */}
//                       <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
//                         msg.role === "user"
//                           ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm"
//                           : msg.error
//                             ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-sm"
//                             : "bg-card text-card-foreground border border-border rounded-tl-sm"
//                       }`}>
//                         {msg.attachment && msg.role === "user" && (
//                           <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/20 text-xs opacity-90">
//                             <FileText className="w-3.5 h-3.5" /> {msg.attachment}
//                           </div>
//                         )}
//                         {msg.content}
//                       </div>

//                       {/* Result card */}
//                       {msg.result && !msg.error && (
//                         <div className="mt-3 w-full max-w-2xl bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
                          
//                           {/* Pipeline name */}
//                           <p className="text-sm font-semibold text-foreground">
//                             Pipeline: {msg.result.pipeline_name}
//                           </p>

//                           {/* Data Model Diagram */}
//                           {msg.result.data_model && msg.result.relationships && (
//                             <div>
//                               <p className="text-xs font-semibold text-foreground mb-2">Data Model</p>
//                               <div className="h-[400px] w-full border border-border rounded-lg overflow-hidden">
//                                 <ReactFlow
//                                   nodes={buildStarSchema(msg.result.data_model, msg.result.relationships, msg.result.schemas).nodes}
//                                   edges={buildStarSchema(msg.result.data_model, msg.result.relationships, msg.result.schemas).edges}
//                                   nodeTypes={schemaNodeTypes}
//                                   edgeTypes={schemaEdgeTypes}
//                                   fitView
//                                   fitViewOptions={{ padding: 0.3 }}
//                                   proOptions={{ hideAttribution: true }}
//                                 >
//                                   <Background gap={20} size={1} />
//                                   <Controls showInteractive={false} />
//                                 </ReactFlow>
//                               </div>

//                               <DataModelSummary
//                                 dataModel={msg.result.data_model}
//                                 relationships={msg.result.relationships}
//                                 schemas={msg.result.schemas}
//                               />
//                             </div>
//                           )}

//                           {/* Dataset label */}
//                           {msg.result.final_dataset && (
//                             <p className="text-sm font-semibold text-foreground">Dataset</p>
//                           )}

//                           {/* Preview table */}
//                           {msg.result.final_dataset?.preview && (
//                             <div className="overflow-auto border border-border rounded-lg">
//                               <table className="text-xs w-full">
//                                 <thead className="bg-muted">
//                                   <tr>
//                                     {Object.keys(msg.result.final_dataset.preview[0]).map((key) => (
//                                       <th key={key} className="border-b border-border px-2 py-1.5 text-left text-muted-foreground font-semibold whitespace-nowrap">
//                                         {key}
//                                       </th>
//                                     ))}
//                                   </tr>
//                                 </thead>
//                                 <tbody>
//                                   {msg.result.final_dataset.preview.slice(0, 5).map((row, i) => (
//                                     <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
//                                       {Object.values(row).map((val: any, j) => (
//                                         <td key={j} className="px-2 py-1.5 text-foreground whitespace-nowrap">
//                                           {String(val)}
//                                         </td>
//                                       ))}
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           )}

//                           {/* Download */}
//                           {msg.result.download_url && (
//                             <button
//                               onClick={() => handleDownload(msg.result!.download_url)}
//                               className="text-xs text-white bg-purple-600 px-3 py-1.5 rounded-lg hover:bg-purple-700 transition-colors font-medium"
//                             >
//                               Download Dataset
//                             </button>
//                           )}
//                         </div>
//                       )}

//                       <span className="text-[11px] text-muted-foreground mt-1 px-1">
//                         {formatTime(msg.timestamp)}
//                       </span>
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
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="text-muted-foreground hover:text-primary p-2 rounded-lg hover:bg-muted transition-colors"
//                 aria-label="Attach file"
//               >
//                 <Paperclip className="w-5 h-5" />
//               </button>
//               <textarea
//                 ref={textareaRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={handleKeyDown}
//                 placeholder="Ask for any data…"
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

//             <p className="text-[11px] text-muted-foreground text-center mt-2">
//               Press Enter to send · Shift + Enter for new line
//             </p>

//             <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx,.parquet" onChange={handleFileChange} className="hidden" />
//           </div>
//         </footer>
//       </div>
//     </WorkflowLayout>
//   );
// }

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Send, Loader2, RotateCcw, Paperclip, FileText,
  X, Sparkles, Bot, User, Pencil, Check, XCircle,
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
              fontSize: 13,
              fontWeight: 600,
              color: "hsl(var(--foreground))",
              background: "hsl(var(--background))",
              border: "1.5px solid hsl(var(--primary))",
              borderRadius: 6,
              padding: "2px 8px",
              outline: "none",
              minWidth: 160,
            }}
          />
          {busy ? (
            <Loader2 style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} className="animate-spin" />
          ) : (
            <>
              <button
                onClick={handleSave}
                title="Save"
                style={{
                  background: "hsl(142 72% 42%)",
                  border: "none",
                  borderRadius: 5,
                  padding: "2px 6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Check style={{ width: 12, height: 12, color: "#fff" }} />
              </button>
              <button
                onClick={handleCancel}
                title="Cancel"
                style={{
                  background: "hsl(0 72% 51%)",
                  border: "none",
                  borderRadius: 5,
                  padding: "2px 6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <XCircle style={{ width: 12, height: 12, color: "#fff" }} />
              </button>
            </>
          )}
        </>
      ) : (
        <>
          <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>
            {value}
          </span>
          <button
            onClick={() => { setDraft(value); setEditing(true); }}
            title={`Edit ${label}`}
            style={{
              background: "hsl(var(--muted))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 5,
              padding: "2px 6px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Pencil style={{ width: 11, height: 11, color: "hsl(var(--muted-foreground))" }} />
            <span style={{ fontSize: 10, color: "hsl(var(--muted-foreground))", fontWeight: 600 }}>
              Edit
            </span>
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
      border: "1px solid hsl(267 84% 65% / 0.3)",
      borderRadius: 12,
      padding: "14px 16px",
      fontSize: 12,
      color: "hsl(var(--foreground))",
      lineHeight: 1.8,
      marginTop: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{
          background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
          borderRadius: 6,
          padding: "3px 10px",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{ fontSize: 11 }}>💡</span>
          <span style={{ fontWeight: 700, color: "#fff", fontSize: 11, letterSpacing: 0.3 }}>
            What this diagram shows
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
        <span style={{
          width: 9, height: 9, borderRadius: "50%",
          background: "hsl(267 84% 65%)", display: "inline-block", flexShrink: 0,
        }} />
        <span>
          <span style={{
            background: "hsl(267 84% 65%)", color: "#fff",
            borderRadius: 5, padding: "1px 8px", fontSize: 11, fontWeight: 700, marginRight: 5,
          }}>{fact}</span>
          is the <strong>main table</strong> — holds core transaction data
        </span>
        {schemas?.[fact] && (
          <span style={{
            background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)",
            border: "1px solid hsl(267 84% 65% / 0.3)",
            borderRadius: 20, padding: "1px 8px", fontSize: 10, fontWeight: 600,
          }}>
            {schemas[fact].length} cols
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        <span style={{
          width: 9, height: 9, borderRadius: "50%",
          background: "hsl(197 100% 50%)", display: "inline-block", flexShrink: 0,
        }} />
        <span>Connected to <strong>{dims.length} supporting table{dims.length !== 1 ? "s" : ""}</strong>:</span>
        {dims.map((d) => (
          <span key={d} style={{
            background: "hsl(197 100% 50% / 0.12)", color: "hsl(197 100% 38%)",
            border: "1px solid hsl(197 100% 50% / 0.3)",
            borderRadius: 5, padding: "1px 7px", fontSize: 11, fontWeight: 600,
          }}>{d}</span>
        ))}
      </div>

      <div style={{ borderTop: "1px solid hsl(267 84% 65% / 0.2)", marginBottom: 10 }} />

      <div style={{ marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 13 }}>🔗</span>
          <span style={{ fontWeight: 700, fontSize: 12, color: "hsl(var(--foreground))" }}>
            How they connect
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {relationships.map((rel, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
              background: "hsl(var(--background) / 0.5)",
              border: "1px solid hsl(267 84% 65% / 0.15)",
              borderRadius: 8, padding: "5px 10px",
            }}>
              <span style={{
                background: "hsl(267 84% 60%)", color: "#fff",
                borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700,
              }}>{rel.from}</span>
              <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 16, lineHeight: 1 }}>→</span>
              <span style={{
                background: "hsl(267 84% 65% / 0.15)", color: "hsl(267 84% 60%)",
                border: "1px solid hsl(267 84% 65% / 0.35)",
                borderRadius: 4, padding: "1px 8px", fontSize: 11, fontWeight: 700,
              }}>{rel.to}</span>
              <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11 }}>via</span>
              <code style={{
                background: "hsl(267 84% 65% / 0.1)", color: "hsl(267 84% 62%)",
                border: "1px solid hsl(267 84% 65% / 0.25)",
                borderRadius: 4, padding: "1px 7px", fontSize: 10, fontWeight: 600,
              }}>{rel.join}</code>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        display: "flex", alignItems: "center", gap: 7,
        background: "hsl(197 100% 50% / 0.07)",
        border: "1px solid hsl(197 100% 50% / 0.25)",
        borderRadius: 7, padding: "6px 10px",
      }}>
        <span style={{ fontSize: 13 }}>👆</span>
        <span style={{ color: "hsl(var(--muted-foreground))", fontSize: 11, fontStyle: "italic" }}>
          Hover over any connecting line to see exactly which columns are linked.
        </span>
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
    <div style={{
      background: "hsl(var(--card))",
      border: `2px solid ${isFact ? "hsl(var(--primary))" : "hsl(var(--border))"}`,
      borderRadius: 10, minWidth: 180,
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)", fontFamily: "inherit",
    }}>
      <Handle type="target" position={Position.Left} style={{ background: "transparent", border: 0 }} />
      <Handle type="source" position={Position.Right} style={{ background: "transparent", border: 0 }} />
      <div style={{
        background: isFact ? "hsl(var(--primary))" : "hsl(var(--muted))",
        borderRadius: "8px 8px 0 0", padding: "6px 10px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontWeight: 700, fontSize: 12, color: isFact ? "#fff" : "hsl(var(--foreground))" }}>
          {data.label}
        </span>
        <span style={{
          fontSize: 9, fontWeight: 600,
          color: isFact ? "rgba(255,255,255,0.85)" : "hsl(var(--primary))",
          background: isFact ? "rgba(255,255,255,0.15)" : "hsl(var(--accent) / 0.2)",
          borderRadius: 4, padding: "1px 5px",
        }}>
          {data.type}
        </span>
      </div>
      <div style={{ padding: "6px 0", maxHeight: 160, overflowY: "auto" }}>
        {(data.columns || []).map((col: string, i: number) => {
          const isJoinCol = (data.relationships || []).some((rel: any) => {
            const [left, right] = rel.join.split("=").map((s: string) => s.trim());
            return left === col || right === col;
          });
          return (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "2px 10px", fontSize: 11, color: "hsl(var(--foreground))",
              background: isJoinCol ? "hsl(var(--primary) / 0.12)" : "transparent",
            }}>
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
        <div style={{
          position: "fixed", left: tooltipPos.x + 12, top: tooltipPos.y - 36,
          zIndex: 99999, background: "hsl(var(--card))", color: "hsl(var(--foreground))",
          border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "5px 12px",
          fontSize: 12, fontWeight: 600, pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)", whiteSpace: "nowrap",
          display: "flex", alignItems: "center", gap: 6,
        }}>
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
  };
  download_url: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: MessageResult;
  attachment?: string;
  error?: boolean;
  timestamp: Date;
}

const API_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/run";
const GET_API_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/jobs";
const SAVE_JOB_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/save-job";
const RENAME_JOB_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/rename-job";
const RENAME_DATASET_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net/rename-dataset";

// ─────────────────────────────────────────────────────────────
// ResultCard — isolated so editable state lives per-message
// ─────────────────────────────────────────────────────────────
function ResultCard({
  result,
  userId,
  onDownload,
}: {
  result: MessageResult;
  userId: string | null;
  onDownload: (url: string) => void;
}) {
  const [jobName, setJobName] = useState(result.suggested_job_name || result.pipeline_name || "");
  const [datasetName, setDatasetName] = useState(result.final_dataset?.dataset_name || "");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSaveJobName = async (newName: string) => {
    const res = await fetch(RENAME_JOB_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        user_id: userId,
        job_id: result.job_id,
        job_name: newName,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setJobName(data.job_name || newName);
    } else {
      throw new Error("Failed to rename job");
    }
  };

  const handleRenameDataset = async (newName: string) => {
    const res = await fetch(RENAME_DATASET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        user_id: userId,
        job_id: result.job_id,
        old_name: datasetName,
        new_name: newName,
      }),
    });
    const data = await res.json();
    if (data.status === "success") {
      setDatasetName(data.new_name || newName);
    } else {
      throw new Error("Failed to rename dataset");
    }
  };

  const handleSaveJob = async () => {
    if (saving) return;
    setSaving(true);
    setSaveStatus("idle");
    try {
      const res = await fetch(SAVE_JOB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({
          user_id: userId,
          job_id: result.job_id,
        }),
      });
      const data = await res.json();
      if (data.status === "success") {
        setSaveStatus("success");
        setTimeout(() => setSaveStatus("idle"), 3000);
      } else {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 w-full max-w-2xl bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">

      {/* Editable Job Name */}
      <EditableField
        label="Pipeline"
        value={jobName}
        onSave={handleSaveJobName}
      />

      {/* Data Model Diagram */}
      {result.data_model && result.relationships && (
        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Data Model</p>
          <div className="h-[400px] w-full border border-border rounded-lg overflow-hidden">
            <ReactFlow
              nodes={buildStarSchema(result.data_model, result.relationships, result.schemas).nodes}
              edges={buildStarSchema(result.data_model, result.relationships, result.schemas).edges}
              nodeTypes={schemaNodeTypes}
              edgeTypes={schemaEdgeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} />
              <Controls showInteractive={false} />
            </ReactFlow>
          </div>
          <DataModelSummary
            dataModel={result.data_model}
            relationships={result.relationships}
            schemas={result.schemas}
          />
        </div>
      )}

      {/* Editable Dataset Name */}
      {result.final_dataset && (
        <EditableField
          label="Dataset"
          value={datasetName}
          onSave={handleRenameDataset}
        />
      )}

      {/* Preview table */}
      {result.final_dataset?.preview && (
        <div className="overflow-auto border border-border rounded-lg">
          <table className="text-xs w-full">
            <thead className="bg-muted">
              <tr>
                {Object.keys(result.final_dataset.preview[0]).map((key) => (
                  <th key={key} className="border-b border-border px-2 py-1.5 text-left text-muted-foreground font-semibold whitespace-nowrap">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.final_dataset.preview.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                  {Object.values(row).map((val: any, j) => (
                    <td key={j} className="px-2 py-1.5 text-foreground whitespace-nowrap">
                      {String(val)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Action buttons row */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Info banner */}
        <div style={{
          background: "hsl(197 100% 50% / 0.07)",
          border: "1px solid hsl(197 100% 50% / 0.2)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: 11,
          color: "hsl(var(--muted-foreground))",
          lineHeight: 1.6,
        }}>
          <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>💾 Save</span>
          {" "}stores this dataset to your account so you can access it later. {" "}
          <span style={{ fontWeight: 700, color: "hsl(var(--foreground))" }}>⬇️ Download</span>
          {" "}exports the CSV file directly to your device.
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {/* Save Job button */}
          <button
            onClick={handleSaveJob}
            disabled={saving}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              fontWeight: 600,
              color: saveStatus === "success" ? "#fff" : saveStatus === "error" ? "#fff" : "hsl(var(--foreground))",
              background: saveStatus === "success"
                ? "hsl(142 72% 42%)"
                : saveStatus === "error"
                  ? "hsl(0 72% 51%)"
                  : "hsl(var(--muted))",
              border: `1.5px solid ${
                saveStatus === "success"
                  ? "hsl(142 72% 38%)"
                  : saveStatus === "error"
                    ? "hsl(0 72% 46%)"
                    : "hsl(var(--border))"
              }`,
              borderRadius: 8,
              padding: "7px 14px",
              cursor: saving ? "not-allowed" : "pointer",
              opacity: saving ? 0.7 : 1,
              transition: "all 0.2s ease",
            }}
          >
            {saving ? (
              <Loader2 style={{ width: 13, height: 13 }} className="animate-spin" />
            ) : saveStatus === "success" ? (
              <Check style={{ width: 13, height: 13 }} />
            ) : saveStatus === "error" ? (
              <XCircle style={{ width: 13, height: 13 }} />
            ) : (
              <span style={{ fontSize: 13 }}>💾</span>
            )}
            {saving
              ? "Saving…"
              : saveStatus === "success"
                ? "Saved!"
                : saveStatus === "error"
                  ? "Save failed"
                  : "Save Dataset"}
          </button>

          {/* Download button */}
          {result.download_url && (
            <button
              onClick={() => onDownload(result.download_url)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, hsl(267 84% 60%), hsl(220 90% 60%))",
                border: "none",
                borderRadius: 8,
                padding: "7px 14px",
                cursor: "pointer",
                transition: "opacity 0.2s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span style={{ fontSize: 13 }}>⬇️</span>
              Download CSV
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function VeritonChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  };

  const userId = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}").id
    : null;
  const jobId = localStorage.getItem("current_job_id");

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 128)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!userId || !jobId) return;
    const fetchJobResult = async () => {
      try {
        const res = await fetch(`${GET_API_URL}/${userId}/${jobId}`);
        const data = await res.json();
        if (!data.job_id) return;

        const userMsg: Message = {
          id: "restored-user",
          role: "user",
          content: data.pipeline_metadata?.prompt || "Previous pipeline request",
          timestamp: new Date(),
        };
        const assistantMsg: Message = {
          id: "restored-assistant",
          role: "assistant",
          content: "Pipeline executed successfully",
          result: {
            pipeline_name: data.pipeline_name,
            suggested_job_name: data.suggested_job_name || data.pipeline_name,
            job_id: data.job_id,
            data_model: data.data_model,
            relationships: data.relationships,
            schemas: data.schemas,
            final_dataset: data.final_dataset,
            download_url: data.download_url,
          },
          timestamp: new Date(),
        };
        setMessages([userMsg, assistantMsg]);
      } catch (err) {
        console.error("Failed to restore job result:", err);
      }
    };
    fetchJobResult();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedFile(file);
    e.target.value = "";
  };

  const removeAttachment = () => setAttachedFile(null);

  const isGreeting = (text: string) => {
    const greetings = ["hi", "hello", "hey", "good morning", "good afternoon", "good evening"];
    return greetings.some((g) => text.toLowerCase().includes(g));
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

    if (isGreeting(content)) {
      setLoading(false);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Hello! 👋 How can I help you with your data today?",
          timestamp: new Date(),
        }]);
      }, 600);
      return;
    }

    try {
      if (!userId || !jobId) {
        setMessages((prev) => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "User session missing. Please login again.",
          error: true,
          timestamp: new Date(),
        }]);
        setLoading(false);
        return;
      }

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", accept: "application/json" },
        body: JSON.stringify({ user_id: userId, job_id: jobId, prompt: content }),
      });

      const data = await res.json();

      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message || "Pipeline executed successfully",
        result: {
          pipeline_name: data.pipeline_name,
          suggested_job_name: data.suggested_job_name || data.pipeline_name,
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
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I couldn't reach the server. Please try again in a moment.",
        error: true,
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const isEmpty = messages.length === 0;

  const handleDownload = async (url: string) => {
    try {
      // Use the full download URL from the API response directly
      const fullUrl = url.startsWith("http")
        ? url
        : `https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net${url}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      // Use the dataset filename from the URL path
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
        {/* Header */}
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
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setMessages([])} className="text-muted-foreground hover:text-foreground gap-2">
              <RotateCcw className="w-4 h-4" /> Clear
            </Button>
          )}
        </header>

        {/* Chat Area */}
        <main ref={chatContainerRef} className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center text-center pt-16 pb-8">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 mb-5">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">What data do you need?</h2>
                <p className="text-sm text-muted-foreground max-w-md mb-8">Describe your request in plain English</p>
              </div>
            ) : (
              <div className="space-y-5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 shadow-sm ${
                      msg.role === "assistant"
                        ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                        : "bg-gradient-to-br from-slate-600 to-slate-800"
                    }`}>
                      {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                    </div>

                    {/* Bubble + result */}
                    <div className={`flex flex-col max-w-[78%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                      <div className={`px-4 py-2.5 rounded-2xl text-[15px] leading-relaxed whitespace-pre-wrap break-words shadow-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-sm"
                          : msg.error
                            ? "bg-red-500/10 text-red-400 border border-red-500/20 rounded-tl-sm"
                            : "bg-card text-card-foreground border border-border rounded-tl-sm"
                      }`}>
                        {msg.attachment && msg.role === "user" && (
                          <div className="flex items-center gap-2 mb-1.5 pb-1.5 border-b border-white/20 text-xs opacity-90">
                            <FileText className="w-3.5 h-3.5" /> {msg.attachment}
                          </div>
                        )}
                        {msg.content}
                      </div>

                      {/* Result card with editable fields */}
                      {msg.result && !msg.error && (
                        <ResultCard
                          result={msg.result}
                          userId={userId}
                          onDownload={handleDownload}
                        />
                      )}

                      <span className="text-[11px] text-muted-foreground mt-1 px-1">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading */}
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
          </div>
        </main>

        {/* Footer */}
        <footer className="sticky bottom-0 z-20 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="max-w-3xl mx-auto px-4 py-3">
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
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask for any data…"
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
            <input ref={fileInputRef} type="file" accept=".csv,.json,.xlsx,.parquet" onChange={handleFileChange} className="hidden" />
          </div>
        </footer>
      </div>
    </WorkflowLayout>
  );
}
