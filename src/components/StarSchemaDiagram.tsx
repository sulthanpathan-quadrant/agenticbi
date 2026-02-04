 
// import { useMemo, useCallback, useState } from 'react';
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
 
// // Fact Node – cyan FACT box, with hover highlight support
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
 
// // Dim Node – blue DIM box, with hover highlight support
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
//   // Removed viewType prop – no longer needed
// }
 
// export default function StarSchemaDiagram({
//   modelingData,
//   onTableClick,
// }: StarSchemaDiagramProps) {
//   const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
 
//   const nodes = useMemo<Node[]>(() => {
//     const factNodes = (modelingData?.tables || [])
//       .filter((t: any) => t.table_type === 'FACT')
//       .map((t: any) => ({
//         id: t.table_name,
//         type: 'fact',
//         position: { x: 500, y: 250 },
//         data: {
//           label: t.table_name,
//           columns: t.columns || [],
//           row_count: t.row_count ?? 0,
//         },
//       }));
 
//     const dimNodes = (modelingData?.tables || [])
//       .filter((t: any) => t.table_type === 'DIM')
//       .map((t: any, i: number) => {
//         const positions = [
//           { x: 120, y: 250 },   // left – nearest side to fact
//           { x: 880, y: 250 },   // right
//           { x: 500, y: 80 },    // top
//           { x: 500, y: 420 },   // bottom
//           { x: 120, y: 100 },   // top-left
//           { x: 880, y: 100 },   // top-right
//           { x: 120, y: 400 },   // bottom-left
//           { x: 880, y: 400 },   // bottom-right
//         ];
 
//         return {
//           id: t.table_name,
//           type: 'dim',
//           position: positions[i % positions.length],
//           data: {
//             label: t.table_name,
//             columns: t.columns || [],
//             row_count: t.row_count ?? 0,
//           },
//         };
//       });
 
//     return [...factNodes, ...dimNodes];
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
 
//   const handleEdgeMouseEnter = (event: React.MouseEvent, edge: Edge) => {
//     setHoveredEdge(edge.id);
//   };
 
//   const handleEdgeMouseLeave = () => {
//     setHoveredEdge(null);
//   };
 
//   const handleNodeClick = (_: React.MouseEvent, node: Node) => {
//     onTableClick(node.id);
//   };
 
//   // Enhance nodes with highlight data when edge is hovered
//   const enhancedNodes = useMemo(() => {
//     return nodes.map(node => {
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
//       <div className="h-[520px] w-full rounded-lg border border-border overflow-hidden">
//         <ReactFlow
//           nodes={enhancedNodes}
//           edges={edges}
//           nodeTypes={nodeTypes}
//           onNodeClick={handleNodeClick}
//           onEdgeMouseEnter={handleEdgeMouseEnter}
//           onEdgeMouseLeave={handleEdgeMouseLeave}
//           fitView
//           fitViewOptions={{ padding: 0.15 }}
//           minZoom={0.3}
//           maxZoom={2}
//           defaultViewport={{ x: 0, y: 0, zoom: 0.9 }}
//           panOnDrag
//           zoomOnScroll
//           nodesDraggable={false}
//           nodesConnectable={false}
//           elementsSelectable
//         >
//           <Background gap={24} size={1.5} />
//           <Controls showZoom showFitView showInteractive={false} />
//         </ReactFlow>
//       </div>
//     </ReactFlowProvider>
//   );
// }

import { useMemo, useState } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// FactNode and DimNode remain unchanged (your original code)
function FactNode({ data, selected }: NodeProps & { selected?: boolean }) {
  const typedData = data as {
    label: string;
    columns: Array<{ name: string; is_primary_key?: boolean; is_foreign_key?: boolean }>;
    row_count?: number;
    highlightedColumns?: string[];
  };

  const { label, columns = [], row_count = 0, highlightedColumns = [] } = typedData;

  return (
    <div
      className={`border-2 ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/50' : 'border-cyan-500'} rounded-lg p-5 bg-cyan-950/30 w-72 cursor-pointer hover:bg-cyan-950/40 transition-all shadow-md z-10 relative`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs bg-cyan-600 rounded px-2 py-1">FACT</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1 max-h-48 overflow-y-auto">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`px-1 py-0.5 rounded ${highlightedColumns.includes(col.name) ? 'bg-yellow-200/70 font-bold text-black' : ''}`}
          >
            {col.name} {col.is_primary_key ? "PK" : col.is_foreign_key ? "FK" : ""}
          </div>
        ))}
        <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
          {Number(row_count).toLocaleString()} rows
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
    </div>
  );
}

function DimNode({ data, selected }: NodeProps & { selected?: boolean }) {
  const typedData = data as {
    label: string;
    columns: Array<{ name: string; is_primary_key?: boolean }>;
    row_count?: number;
    highlightedColumns?: string[];
  };

  const { label, columns = [], row_count = 0, highlightedColumns = [] } = typedData;

  return (
    <div
      className={`border ${selected ? 'border-yellow-400 shadow-lg shadow-yellow-500/50' : 'border-blue-500'} rounded-lg p-4 bg-card/90 backdrop-blur w-64 cursor-pointer hover:bg-card transition-all shadow-md max-h-64 overflow-hidden z-10 relative`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs border border-blue-400 rounded px-2 py-1">DIM</span>
      </div>
      <div className="text-xs text-muted-foreground space-y-1 max-h-40 overflow-y-auto">
        {columns.map((col, i) => (
          <div
            key={i}
            className={`px-1 py-0.5 rounded ${highlightedColumns.includes(col.name) ? 'bg-yellow-200/70 font-bold text-black' : ''}`}
          >
            {col.name} {col.is_primary_key ? "PK" : ""}
          </div>
        ))}
        <div className="text-xs text-muted-foreground/70 mt-2 pt-2 border-t border-border">
          {Number(row_count).toLocaleString()} rows
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="!bg-transparent !border-0" />
      <Handle type="source" position={Position.Right} className="!bg-transparent !border-0" />
    </div>
  );
}

const nodeTypes = {
  fact: FactNode,
  dim: DimNode,
};

interface StarSchemaDiagramProps {
  modelingData: any;
  onTableClick: (tableName: string) => void;
}

export default function StarSchemaDiagram({
  modelingData,
  onTableClick,
}: StarSchemaDiagramProps) {
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  const nodes = useMemo<Node[]>(() => {
    const factTable = modelingData?.tables?.find((t: any) => t.table_type === 'FACT');
    if (!factTable) return [];

    const factNode: Node = {
      id: factTable.table_name,
      type: 'fact',
      position: { x: 0, y: 0 },
      data: {
        label: factTable.table_name,
        columns: factTable.columns || [],
        row_count: factTable.row_count ?? 0,
      },
    };

    const dimTables = modelingData?.tables?.filter((t: any) => t.table_type === 'DIM') || [];

    const radius = Math.max(380, dimTables.length * 45);
    const angleStep = (2 * Math.PI) / Math.max(1, dimTables.length);

    const dimNodes: Node[] = dimTables.map((t: any, i: number) => {
      const angle = i * angleStep - Math.PI / 2; // start from top
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      return {
        id: t.table_name,
        type: 'dim',
        position: { x, y },
        data: {
          label: t.table_name,
          columns: t.columns || [],
          row_count: t.row_count ?? 0,
        },
      };
    });

    return [factNode, ...dimNodes];
  }, [modelingData]);

  const edges = useMemo<Edge[]>(() => {
    return (modelingData?.relationships || []).map((rel: any, i: number) => {
      let source = rel.from_table || rel.from || '';
      let target = rel.to_table || rel.to || '';

      if (rel.from_table_role === 'DIM' || rel.to_table_role === 'FACT') {
        source = rel.from_table || rel.from;
        target = rel.to_table || rel.to;
      }

      return {
        id: `e-${i}`,
        source,
        target,
        type: 'straight',
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 3,
          strokeDasharray: '6 4',
        },
        animated: false,
        label: rel.relationship_type || 'M1',
        labelStyle: {
          fontSize: 12,
          fill: 'hsl(var(--primary))',
          fontWeight: 600,
          backgroundColor: 'white',
          padding: '2px 6px',
          borderRadius: '4px',
          border: `1px solid hsl(var(--primary))`,
        },
        zIndex: -1,
      };
    });
  }, [modelingData]);

  const enhancedNodes = useMemo<Node[]>(() => {
    return nodes.map((node) => {
      const relatedRel = hoveredEdge
        ? modelingData?.relationships?.find((r: any, idx: number) => `e-${idx}` === hoveredEdge)
        : null;

      if (!relatedRel) return node;

      const highlightedColumns: string[] = [];

      if (relatedRel.from_column) highlightedColumns.push(relatedRel.from_column);
      if (relatedRel.to_column) highlightedColumns.push(relatedRel.to_column);

      if (highlightedColumns.length === 0) {
        const columns = Array.isArray(node.data?.columns) ? node.data.columns : [];
        columns.forEach((col: any) => {
          if (col?.is_foreign_key || col?.is_primary_key) {
            if (col?.name) highlightedColumns.push(col.name);
          }
        });
      }

      return {
        ...node,
        data: {
          ...node.data,
          highlightedColumns,
        },
        selected: node.id === relatedRel.from_table || node.id === relatedRel.to_table,
      };
    });
  }, [nodes, hoveredEdge, modelingData]);

  return (
    <ReactFlowProvider>
      <div className="h-[580px] w-full rounded-lg border border-border overflow-hidden">
        {/* No custom gradient — uses your theme's default background */}
        <ReactFlow
          nodes={enhancedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => onTableClick(node.id)}
          onEdgeMouseEnter={(_, edge) => setHoveredEdge(edge.id)}
          onEdgeMouseLeave={() => setHoveredEdge(null)}
          fitView
          fitViewOptions={{
            padding: 0.25,
            minZoom: 0.35,
            maxZoom: 1.1,
            duration: 800,
          }}
          minZoom={0.25}
          maxZoom={1.6}
          panOnDrag
          zoomOnScroll
          nodesDraggable={false}
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1.5} /> {/* Default background dots/pattern */}
          <Controls
            showZoom
            showFitView
            showInteractive={false}
            position="bottom-left"
          />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}