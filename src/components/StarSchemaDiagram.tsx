// import { useMemo, useState } from 'react';
// import {
//   ReactFlow,
//   Background,
//   Controls,
//   Node,
//   Edge,
//   Position,
//   Handle,
//   NodeProps,
//   ReactFlowProvider,
// } from '@xyflow/react';
// import '@xyflow/react/dist/style.css';

// // FactNode and DimNode remain unchanged (your original code)
// function FactNode({ data, selected }: NodeProps & { selected?: boolean }) {
//   const typedData = data as {
//     label: string;
//     columns: Array<{ name: string; is_primary_key?: boolean; is_foreign_key?: boolean }>;
//     row_count?: number;
//     highlightedColumns?: string[];
//   };

//   const { label, columns = [], row_count = 0, highlightedColumns = [] } = typedData;

//   return (
//     <div
//       className={`border-2 ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/50' : 'border-cyan-500'} rounded-lg p-5 bg-cyan-950/30 w-72 cursor-pointer hover:bg-cyan-950/40 transition-all shadow-md z-10 relative`}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <span className="text-sm font-semibold text-foreground">{label}</span>
//         <span className="text-xs bg-cyan-600 rounded px-2 py-1">FACT</span>
//       </div>
//       <div className="text-xs text-muted-foreground space-y-1 max-h-48 overflow-y-auto">
//         {columns.map((col, i) => (
//           <div
//             key={i}
//             className={`px-1 py-0.5 rounded ${highlightedColumns.includes(col.name) ? 'bg-yellow-200/70 font-bold text-black' : ''}`}
//           >
//             {col.name} {col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : ""}
//           </div>
//         ))}
//         <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
//           {Number(row_count).toLocaleString()} rows
//         </div>
//       </div>

//       <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
//       <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
//     </div>
//   );
// }

// function DimNode({ data, selected }: NodeProps & { selected?: boolean }) {
//   const typedData = data as {
//     label: string;
//     columns: Array<{ name: string; is_primary_key?: boolean }>;
//     row_count?: number;
//     highlightedColumns?: string[];
//   };

//   const { label, columns = [], row_count = 0, highlightedColumns = [] } = typedData;

//   return (
//     <div
//       className={`border ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/50' : 'border-blue-500'} rounded-lg p-4 bg-card/90 backdrop-blur w-64 cursor-pointer hover:bg-card transition-all shadow-md max-h-64 overflow-hidden z-10 relative`}
//     >
//       <div className="flex items-center justify-between mb-2">
//         <span className="text-sm font-semibold text-foreground">{label}</span>
//         <span className="text-xs border border-blue-400 rounded px-2 py-1">DIM</span>
//       </div>
//       <div className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
//         {columns.map((col, i) => (
//           <div
//             key={i}
//             className={`px-1 py-0.5 rounded ${highlightedColumns.includes(col.name) ? 'bg-yellow-200/70 font-bold text-black' : ''}`}
//           >
//             {col.name} {col.is_primary_key ? "PK" : ""}
//           </div>
//         ))}
//         <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
//           {Number(row_count).toLocaleString()} rows
//         </div>
//       </div>

//       <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
//       <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
//     </div>
//   );
// }

// const nodeTypes = {
//   fact: FactNode,
//   dim: DimNode,
// };

// interface StarSchemaDiagramProps {
//   modelingData: any;
//   onTableClick: (tableName: string) => void;
// }

// export default function StarSchemaDiagram({
//   modelingData,
//   onTableClick,
// }: StarSchemaDiagramProps) {
//   const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

//   const nodes = useMemo<Node[]>(() => {
//     const factTable = modelingData?.tables?.find((t: any) => t.table_type === 'FACT');
//     if (!factTable) return [];

//     const factNode: Node = {
//       id: factTable.table_name,
//       type: 'fact',
//       position: { x: 0, y: 0 },
//       data: {
//         label: factTable.table_name,
//         columns: factTable.columns || [],
//         row_count: factTable.row_count ?? 0,
//       },
//     };

//     const dimTables = modelingData?.tables?.filter((t: any) => t.table_type === 'DIM') || [];

//     const radius = Math.max(380, dimTables.length * 45);
//     const angleStep = (2 * Math.PI) / Math.max(1, dimTables.length);

//     const dimNodes: Node[] = dimTables.map((t: any, i: number) => {
//       const angle = i * angleStep - Math.PI / 2; // start from top
//       const x = Math.cos(angle) * radius;
//       const y = Math.sin(angle) * radius;

//       return {
//         id: t.table_name,
//         type: 'dim',
//         position: { x, y },
//         data: {
//           label: t.table_name,
//           columns: t.columns || [],
//           row_count: t.row_count ?? 0,
//         },
//       };
//     });

//     return [factNode, ...dimNodes];
//   }, [modelingData]);

//   const edges = useMemo<Edge[]>(() => {
//     return (modelingData?.relationships || []).map((rel: any, i: number) => {
//       let source = rel.from_table || rel.from || '';
//       let target = rel.to_table || rel.to || '';

//       if (rel.from_table_role === 'DIM' || rel.to_table_role === 'FACT') {
//         source = rel.from_table || rel.from;
//         target = rel.to_table || rel.to;
//       }

//       return {
//         id: `e-${i}`,
//         source,
//         target,
//         type: 'straight',
//         style: {
//           stroke: 'hsl(var(--primary))',
//           strokeWidth: 3,
//           strokeDasharray: '6 4',
//         },
//         animated: false,
//         label: rel.relationship_type || 'M1',
//         labelStyle: {
//           fontSize: 12,
//           fill: 'hsl(var(--primary))',
//           fontWeight: 600,
//           backgroundColor: 'white',
//           padding: '2px 6px',
//           borderRadius: '4px',
//           border: `1px solid hsl(var(--primary))`,
//         },
//         zIndex: -1,
//       };
//     });
//   }, [modelingData]);

//   const enhancedNodes = useMemo<Node[]>(() => {
//     return nodes.map((node) => {
//       const relatedRel = hoveredEdge
//         ? modelingData?.relationships?.find((r: any, idx: number) => `e-${idx}` === hoveredEdge)
//         : null;

//       if (!relatedRel) return node;

//       const highlightedColumns: string[] = [];

//       if (relatedRel.from_column) highlightedColumns.push(relatedRel.from_column);
//       if (relatedRel.to_column) highlightedColumns.push(relatedRel.to_column);

//       if (highlightedColumns.length === 0) {
//         const columns = Array.isArray(node.data?.columns) ? node.data.columns : [];
//         columns.forEach((col: any) => {
//           if (col?.is_foreign_key || col?.is_primary_key) {
//             if (col?.name) highlightedColumns.push(col.name);
//           }
//         });
//       }

//       return {
//         ...node,
//         data: {
//           ...node.data,
//           highlightedColumns,
//         },
//         selected: node.id === relatedRel.from_table || node.id === relatedRel.to_table,
//       };
//     });
//   }, [nodes, hoveredEdge, modelingData]);

//   return (
//     <ReactFlowProvider>
//       <div className="h-[580px] w-full rounded-lg border border-border overflow-hidden">
//         {/* No custom gradient — uses your theme's default background */}
//         <ReactFlow
//           nodes={enhancedNodes}
//           edges={edges}
//           nodeTypes={nodeTypes}
//           onNodeClick={(_, node) => onTableClick(node.id)}
//           onEdgeMouseEnter={(_, edge) => setHoveredEdge(edge.id)}
//           onEdgeMouseLeave={() => setHoveredEdge(null)}
//           fitView
//           fitViewOptions={{
//             padding: 0.25,
//             minZoom: 0.35,
//             maxZoom: 1.1,
//             duration: 800,
//           }}
//           minZoom={0.25}
//           maxZoom={1.6}
//           panOnDrag
//           zoomOnScroll
//           nodesDraggable={false}
//           nodesConnectable={false}
//           proOptions={{ hideAttribution: true }}
//         >
//           <Background gap={24} size={1.5} /> {/* Default background dots/pattern */}
//           {/* <Controls
//             showZoom 
//             showFitView
//             showInteractive={false}
//             position="bottom-left"
//           /> */}
//            <Controls
//             showZoom
//           showFitView
//           showInteractive={false}
//           position="bottom-left"
//           className="!rounded-lg overflow-hidden"
//         />
//         </ReactFlow>
//       </div>
//     </ReactFlowProvider>
//   );
// }

import { useMemo, useState, useCallback, useEffect } from 'react';
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
  Connection,
  EdgeProps,
  getStraightPath,
  BaseEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Check, X, ChevronRight } from 'lucide-react';
import { RelationshipPayload, EntityPatchPayload } from "@/components/api/api";

// ── Types ─────────────────────────────────────────────────────
interface Column {
  name: string;
  data_type?: string;
  is_primary_key?: boolean;
  is_foreign_key?: boolean;
  is_surrogate?: boolean;
  display_label?: string;
}

interface PendingConnection {
  fromTable: string;
  toTable: string;
  fromColumn: string;
  toColumn: string;
  relationship_type: string;
}

interface StarSchemaDiagramProps {
  modelingData: any;
  onDeleteRelationship: (relationshipId: string) => Promise<void>;
  onAddRelationship: (payload: RelationshipPayload) => Promise<void>;
  onEditEntity: (entityName: string, payload: EntityPatchPayload) => Promise<void>;
}

// ── Deletable Edge ─────────────────────────────────────────────
function DeletableEdge({
  id, sourceX, sourceY, targetX, targetY,
  label, selected, data,
}: EdgeProps & { data?: { onDelete: (id: string) => void } }) {
  const [edgePath, labelX, labelY] = getStraightPath({ sourceX, sourceY, targetX, targetY });
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? '#f59e0b' : 'hsl(var(--primary))',
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: '6 4',
        }}
      />
      {/* Relationship type label */}
      <foreignObject x={labelX - 20} y={labelY - 12} width={40} height={24}>
        <div className="flex items-center justify-center">
          <span className="text-[10px] font-semibold bg-background border border-border rounded px-1 text-foreground">
            {String(label || 'M:1')}
          </span>
        </div>
      </foreignObject>
      {/* Delete button shown when edge is selected */}
      
          </>
        );
      }

// ── Fact Node ─────────────────────────────────────────────────
function FactNode({ data, selected }: NodeProps) {
  const typedData = data as {
    label: string;
    columns: Column[];
    row_count?: number;
    highlightedColumns?: string[];
    onClick: () => void;
  };
  const { label, columns = [], highlightedColumns = [], onClick } = typedData;

  return (
    <div
      onClick={onClick}
      className={`border-2 ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/30' : 'border-cyan-500'}
        rounded-lg p-4 bg-cyan-950/30 w-64 cursor-pointer hover:bg-cyan-950/50 transition-all shadow-md relative`}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground truncate">{label}</span>
        <span className="text-[10px] bg-cyan-600 text-white rounded px-1.5 py-0.5 ml-1 shrink-0">FACT</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5 max-h-44 overflow-y-auto">
        {columns.map((col, i) => (
          <div key={i} className={`px-1 py-0.5 rounded flex items-center justify-between
            ${highlightedColumns?.includes(col.name) ? 'bg-yellow-200/20 text-yellow-300' : ''}`}>
            <span className="truncate">{col.display_label || col.name}</span>
            {col.is_primary_key && <Badge variant="outline" className="text-[9px] px-1 h-4 ml-1 shrink-0">PK</Badge>}
            {col.is_foreign_key && <Badge variant="outline" className="text-[9px] px-1 h-4 ml-1 shrink-0">FK</Badge>}
          </div>
        ))}
        <div className="text-[10px] text-muted-foreground/60 mt-1 pt-1 border-t border-border">
          {columns.length} columns
        </div>
      </div>
    </div>
  );
}



// ── Dim Node ──────────────────────────────────────────────────
function DimNode({ data, selected }: NodeProps) {
  const typedData = data as {
    label: string;
    columns: Column[];
    row_count?: number;
    highlightedColumns?: string[];
    onClick: () => void;
  };
  const { label, columns = [], row_count = 0, highlightedColumns = [], onClick } = typedData;

  return (
    <div
      onClick={onClick}
      className={`border ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/30' : 'border-blue-500'}
        rounded-lg p-4 bg-card/90 backdrop-blur w-56 cursor-pointer hover:bg-card transition-all shadow-md relative`}
    >
      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground truncate">{label}</span>
        <span className="text-[10px] border border-blue-400 text-blue-400 rounded px-1.5 py-0.5 ml-1 shrink-0">DIM</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-0.5 max-h-36 overflow-y-auto">
        {columns.map((col, i) => (
          <div key={i} className={`px-1 py-0.5 rounded flex items-center justify-between
            ${highlightedColumns?.includes(col.name) ? 'bg-yellow-200/20 text-yellow-300' : ''}`}>
            <span className="truncate">{col.display_label || col.name}</span>
            {col.is_primary_key && <Badge variant="outline" className="text-[9px] px-1 h-4 ml-1 shrink-0">PK</Badge>}
            {col.is_foreign_key && <Badge variant="outline" className="text-[9px] px-1 h-4 ml-1 shrink-0">FK</Badge>}
          </div>
        ))}
        <div className="text-[10px] text-muted-foreground/60 mt-1 pt-1 border-t border-border">
          {columns.length} columns
        </div>
      </div>
    </div>
  );
}

const nodeTypes = { fact: FactNode, dim: DimNode };
const edgeTypes = { deletable: DeletableEdge };

// ── Main Component ────────────────────────────────────────────
export default function StarSchemaDiagram({
  modelingData,
  onDeleteRelationship,
  onAddRelationship,
  onEditEntity,
}: StarSchemaDiagramProps) {
  const [selectedEdgeId, setSelectedEdgeId]         = useState<string | null>(null);
  const [pendingConnection, setPendingConnection]   = useState<PendingConnection | null>(null);
  const [selectedEntity, setSelectedEntity]         = useState<any | null>(null);
  const [editingColumns, setEditingColumns]         = useState<Column[]>([]);
  const [isSavingEntity, setIsSavingEntity]         = useState(false);
  const [isDeletingEdge, setIsDeletingEdge]         = useState(false);
  const [isAddingRel, setIsAddingRel]               = useState(false);
  


  const [edgeToolbar, setEdgeToolbar] = useState<{
  x: number;
  y: number;
  edgeId: string;
  fromTable: string;
  toTable: string;
  relType: string;
} | null>(null);
  useEffect(() => {
  const close = () => setEdgeToolbar(null);

  window.addEventListener('click', close);
  return () => window.removeEventListener('click', close);
}, []);

  // ── Auto-detect matching columns between two tables ──────────
  const autoDetectColumns = useCallback((fromTableName: string, toTableName: string) => {
    const tables: any[] = modelingData?.tables || [];
    const fromTable = tables.find((t: any) => t.table_name === fromTableName);
    const toTable   = tables.find((t: any) => t.table_name === toTableName);

    if (!fromTable || !toTable) return { fromColumn: '', toColumn: '', relationship_type: 'M:1' };

    const fromCols: string[] = (fromTable.columns || []).map((c: any) => c.name);
    const toCols:   string[] = (toTable.columns   || []).map((c: any) => c.name);
    const toPKs:    string[] = toTable.primary_keys || [];

    // Try to find FK in fromTable that matches PK in toTable
    let fromColumn = '';
    let toColumn   = '';

    for (const pk of toPKs) {
      if (fromCols.includes(pk)) {
        fromColumn = pk;
        toColumn   = pk;
        break;
      }
    }

    // Fallback: find any column name match
    if (!fromColumn) {
      for (const fc of fromCols) {
        if (toCols.includes(fc)) {
          fromColumn = fc;
          toColumn   = fc;
          break;
        }
      }
    }

    // Last resort: use first columns
    if (!fromColumn) {
      fromColumn = fromCols[0] || '';
      toColumn   = toPKs[0] || toCols[0] || '';
    }

    return { fromColumn, toColumn, relationship_type: 'M:1' };
  }, [modelingData]);

  // ── Handle new connection drawn by user ───────────────────────
  const handleConnect = useCallback((connection: Connection) => {
    const fromTableName = connection.source || '';
    const toTableName   = connection.target || '';
    if (!fromTableName || !toTableName || fromTableName === toTableName) return;

    const { fromColumn, toColumn, relationship_type } = autoDetectColumns(fromTableName, toTableName);

    setPendingConnection({
      fromTable: fromTableName,
      toTable:   toTableName,
      fromColumn,
      toColumn,
      relationship_type,
    });
  }, [autoDetectColumns]);

  // ── Confirm add relationship ─────────────────────────────────
  const handleConfirmConnection = async () => {
    if (!pendingConnection) return;
    setIsAddingRel(true);
    await onAddRelationship({
      from_table:        pendingConnection.fromTable,
      from_column:       pendingConnection.fromColumn,
      to_table:          pendingConnection.toTable,
      to_column:         pendingConnection.toColumn,
      relationship_type: pendingConnection.relationship_type,
    });
    setPendingConnection(null);
    setIsAddingRel(false);
  };

  // ── Delete edge ───────────────────────────────────────────────
  const handleDeleteEdge = useCallback(async (edgeId: string) => {
    setIsDeletingEdge(true);
    await onDeleteRelationship(edgeId);
    setSelectedEdgeId(null);
    setIsDeletingEdge(false);
  }, [onDeleteRelationship]);

  // ── Open entity side panel ────────────────────────────────────
  const handleNodeClick = useCallback((tableName: string) => {
    const table = modelingData?.tables?.find((t: any) => t.table_name === tableName);
    if (!table) return;
    setSelectedEntity(table);
    setEditingColumns(
      (table.columns || []).map((c: any) => ({ ...c }))
    );
    setSelectedEdgeId(null);
    setPendingConnection(null);
  }, [modelingData]);

  // ── Save entity edits ─────────────────────────────────────────
  const handleSaveEntity = async () => {
    if (!selectedEntity) return;
    setIsSavingEntity(true);

    const newPKs = editingColumns
      .filter(c => c.is_primary_key)
      .map(c => c.name);

    const payload: EntityPatchPayload = {
      primary_keys: newPKs,
      columns: editingColumns.map(c => ({
        name:          c.name,
        is_primary_key: c.is_primary_key,
        is_foreign_key: c.is_foreign_key,
        data_type:     c.data_type,
      })),
    };

    await onEditEntity(selectedEntity.table_name, payload);
    setSelectedEntity(null);
    setIsSavingEntity(false);
  };

  // ── Build nodes ───────────────────────────────────────────────
  const nodes = useMemo<Node[]>(() => {
    const tables: any[] = modelingData?.tables || [];
    const factTable  = tables.find((t: any) => t.table_type === 'FACT');
    const dimTables  = tables.filter((t: any) => t.table_type === 'DIM');

    if (!factTable) return [];

    const radius    = Math.max(380, dimTables.length * 50);
    const angleStep = (2 * Math.PI) / Math.max(1, dimTables.length);

    const factNode: Node = {
      id:   factTable.table_name,
      type: 'fact',
      position: { x: 0, y: 0 },
      data: {
        label:     factTable.table_name,
        columns:   factTable.columns || [],
        row_count: factTable.row_count ?? 0,
        onClick:   () => handleNodeClick(factTable.table_name),
      },
    };

    const dimNodes: Node[] = dimTables.map((t: any, i: number) => {
      const angle = i * angleStep - Math.PI / 2;
      return {
        id:   t.table_name,
        type: 'dim',
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
        },
        data: {
          label:     t.table_name,
          columns:   t.columns || [],
          row_count: t.row_count ?? 0,
          onClick:   () => handleNodeClick(t.table_name),
        },
      };
    });

    return [factNode, ...dimNodes];
  }, [modelingData, handleNodeClick]);

  // ── Build edges using actual relationship_id ─────────────────
  const edges = useMemo<Edge[]>(() => {
    return (modelingData?.relationships || []).map((rel: any) => {
      const relId = rel.relationship_id || `${rel.from_table}-${rel.from_column}-${rel.to_table}-${rel.to_column}`;
      return {
        id:     relId,
        source: rel.from_table || '',
        target: rel.to_table   || '',
        type:   'deletable',
        label:  rel.relationship_type || 'M:1',
        selected: selectedEdgeId === relId,
        data: { onDelete: handleDeleteEdge },
      };
    });
  }, [modelingData, selectedEdgeId, handleDeleteEdge]);

  return (
    <div className="relative">
      {/* Main ReactFlow canvas */}
      <ReactFlowProvider>
        <div className="h-[580px] w-full rounded-lg border border-border overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={handleConnect}
            onEdgeClick={(e, edge) => {
              e.stopPropagation();
              const rel = modelingData?.relationships?.find(
                (r: any) => r.relationship_id === edge.id
              );
              setEdgeToolbar({
                x: e.clientX,
                y: e.clientY,
                edgeId: edge.id,
                fromTable: rel?.from_table || '',
                toTable:   rel?.to_table   || '',
                relType:   rel?.relationship_type || 'M:1',
              });
              setSelectedEntity(null);
              setPendingConnection(null);
            }}
            onPaneClick={() => {
              setSelectedEdgeId(null);
              setPendingConnection(null);
              setEdgeToolbar(null)
            }}
            fitView
            fitViewOptions={{ padding: 0.25, minZoom: 0.3, maxZoom: 1.1, duration: 800 }}
            minZoom={0.2}
            maxZoom={1.6}
            panOnDrag
            zoomOnScroll
            nodesDraggable={false}
            nodesConnectable={true}
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={24} size={1.5} />
            <Controls showZoom showFitView showInteractive={false} position="bottom-left" />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
      {edgeToolbar && (
        <div
          className="fixed z-[9999] bg-card border border-border rounded-lg shadow-xl px-3 py-2 flex items-center gap-3"
          style={{ top: edgeToolbar.y + 8, left: edgeToolbar.x + 8 }}
        >
          <span className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{edgeToolbar.fromTable}</span>
            {' → '}
            <span className="font-medium text-foreground">{edgeToolbar.toTable}</span>
            <span className="ml-1 text-[10px] border border-border rounded px-1">{edgeToolbar.relType}</span>
          </span>
          <button
            onClick={async () => {
              setEdgeToolbar(null);
              await handleDeleteEdge(edgeToolbar.edgeId);
            }}
            className="flex items-center gap-1 text-destructive hover:bg-destructive/10 rounded px-2 py-1 text-xs font-medium transition-colors"
          >
            <Trash2 className="h-3 w-3" />
            Delete
          </button>
          <button
            onClick={() => setEdgeToolbar(null)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )}
      {/* ── Inline confirmation panel for new relationship ──────── */}
      {pendingConnection && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50
          bg-card border border-border rounded-lg shadow-xl p-4 w-[360px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">Confirm New Relationship</span>
            <button onClick={() => setPendingConnection(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs mb-4">
            {/* From */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-12 shrink-0">From</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-muted rounded px-2 py-1 font-medium">{pendingConnection.fromTable}</span>
                <ChevronRight className="h-3 w-3 self-center text-muted-foreground" />
                <select
                  value={pendingConnection.fromColumn}
                  onChange={e => setPendingConnection(p => p ? { ...p, fromColumn: e.target.value } : p)}
                  className="bg-muted rounded px-1 py-1 flex-1 text-xs border-0 outline-none"
                >
                  {(modelingData?.tables?.find((t: any) => t.table_name === pendingConnection.fromTable)?.columns || [])
                    .map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)
                  }
                </select>
              </div>
            </div>

            {/* To */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-12 shrink-0">To</span>
              <div className="flex gap-1 flex-1">
                <span className="bg-muted rounded px-2 py-1 font-medium">{pendingConnection.toTable}</span>
                <ChevronRight className="h-3 w-3 self-center text-muted-foreground" />
                <select
                  value={pendingConnection.toColumn}
                  onChange={e => setPendingConnection(p => p ? { ...p, toColumn: e.target.value } : p)}
                  className="bg-muted rounded px-1 py-1 flex-1 text-xs border-0 outline-none"
                >
                  {(modelingData?.tables?.find((t: any) => t.table_name === pendingConnection.toTable)?.columns || [])
                    .map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)
                  }
                </select>
              </div>
            </div>

            {/* Type */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground w-12 shrink-0">Type</span>
              <select
                value={pendingConnection.relationship_type}
                onChange={e => setPendingConnection(p => p ? { ...p, relationship_type: e.target.value } : p)}
                className="bg-muted rounded px-2 py-1 text-xs border-0 outline-none"
              >
                {['M:1', '1:M', '1:1', 'M:N'].map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={() => setPendingConnection(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmConnection} disabled={isAddingRel}>
              {isAddingRel ? 'Adding...' : (
                <><Check className="h-3 w-3 mr-1" />Confirm</>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* ── Right side panel for entity editing ─────────────────── */}
      {selectedEntity && (
        <div className="absolute top-0 right-0 h-full w-72 bg-card border-l border-border
          shadow-xl z-40 flex flex-col rounded-r-lg overflow-hidden">

          {/* Panel header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div>
              <div className="text-sm font-semibold text-foreground">{selectedEntity.table_name}</div>
              <div className="text-[10px] text-muted-foreground capitalize">{selectedEntity.table_type} table</div>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Column list */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-2 px-1">
              Columns
            </div>
            {editingColumns.map((col, i) => (
              <div key={i} className="bg-muted/50 rounded-lg px-3 py-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground truncate">
                    {col.display_label || col.name}
                  </span>
                  {col.is_surrogate && (
                    <span className="text-[9px] text-amber-400 ml-1 shrink-0">✨ surrogate</span>
                  )}
                </div>

                {/* Data type */}
                <input
                  value={col.data_type || ''}
                  disabled={col.is_surrogate}
                  onChange={e => {
                    const updated = [...editingColumns];
                    updated[i] = { ...updated[i], data_type: e.target.value };
                    setEditingColumns(updated);
                  }}
                  className="w-full text-[11px] bg-background border border-border rounded px-2 py-1
                    text-foreground outline-none focus:border-primary disabled:opacity-50"
                  placeholder="data type"
                />

                {/* PK / FK toggles */}
                <div className="flex gap-2">
                  <button
                    disabled={col.is_surrogate}
                    onClick={() => {
                      const updated = [...editingColumns];
                      updated[i] = { ...updated[i], is_primary_key: !col.is_primary_key };
                      setEditingColumns(updated);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors
                      ${col.is_primary_key
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'border-border text-muted-foreground hover:border-primary'}
                      disabled:opacity-40`}
                  >
                    PK
                  </button>
                  <button
                    disabled={col.is_surrogate}
                    onClick={() => {
                      const updated = [...editingColumns];
                      updated[i] = { ...updated[i], is_foreign_key: !col.is_foreign_key };
                      setEditingColumns(updated);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors
                      ${col.is_foreign_key
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-border text-muted-foreground hover:border-blue-600'}
                      disabled:opacity-40`}
                  >
                    FK
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Panel footer */}
          <div className="px-3 py-3 border-t border-border shrink-0 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setSelectedEntity(null)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={handleSaveEntity}
              disabled={isSavingEntity}
            >
              {isSavingEntity ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}