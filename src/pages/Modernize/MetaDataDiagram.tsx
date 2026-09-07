import { useMemo, useState } from "react";
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
  EdgeProps,
  getStraightPath,
  BaseEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Badge } from "@/components/ui/badge";

export interface DiagramColumn {
  name: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
}

export interface DiagramNode {
  id: string;
  label: string;
  kind: "fact" | "dimension" | "table";
  subtitle?: string;
  columns: DiagramColumn[];
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface MetadataDiagramProps {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

const KIND_LABEL: Record<DiagramNode["kind"], string> = {
  fact: "FACT",
  dimension: "DIM",
  table: "TABLE",
};

// Approximate rendered box sizes, used to space nodes so they
// don't overlap. Keep these in sync with the w-64/w-56 classes
// below if those change.
const FACT_BOX_WIDTH = 264;
const DIM_BOX_WIDTH = 232;

function ColumnList({ columns }: { columns: DiagramColumn[] }) {
  if (columns.length === 0) return null;

  return (
    <div className="max-h-40 space-y-0.5 overflow-y-auto text-xs text-muted-foreground">
      {columns.map((col) => (
        <div
          key={col.name}
          className="flex items-center justify-between rounded px-1 py-0.5 text-foreground"
        >
          <span className="truncate">{col.name}</span>
          <span className="ml-1 flex shrink-0 gap-1">
            {col.isPrimaryKey && (
              <Badge variant="outline" className="h-4 px-1 text-[9px]">
                PK
              </Badge>
            )}
            {col.isForeignKey && (
              <Badge variant="outline" className="h-4 px-1 text-[9px]">
                FK
              </Badge>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

function FactBox({ data }: NodeProps) {
  const node = data as unknown as DiagramNode & {
    dimmed?: boolean;
    highlighted?: boolean;
  };

  return (
    <div
      className={`w-64 rounded-lg border-2 bg-cyan-950/30 p-4 shadow-md transition-all
        ${node.highlighted ? "border-yellow-400 shadow-lg shadow-yellow-500/30" : "border-cyan-500"}
        ${node.dimmed ? "opacity-30" : "opacity-100"}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!border-0 !bg-transparent"
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold text-foreground">
          {node.label}
        </span>
        <span className="shrink-0 rounded bg-cyan-600 px-1.5 py-0.5 text-[10px] text-white">
          {KIND_LABEL[node.kind]}
        </span>
      </div>
      {node.subtitle && (
        <div className="mb-1.5 text-[11px] text-muted-foreground">
          {node.subtitle}
        </div>
      )}
      <ColumnList columns={node.columns} />
    </div>
  );
}

function DimBox({ data }: NodeProps) {
  const node = data as unknown as DiagramNode & {
    dimmed?: boolean;
    highlighted?: boolean;
  };

  return (
    <div
      className={`w-56 rounded-lg border bg-card/90 p-4 shadow-md backdrop-blur transition-all
        ${node.highlighted ? "border-2 border-yellow-400 shadow-lg shadow-yellow-500/30" : "border-blue-500"}
        ${node.dimmed ? "opacity-30" : "opacity-100"}`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!border-0 !bg-transparent"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!border-0 !bg-transparent"
      />
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="truncate text-sm font-semibold text-foreground">
          {node.label}
        </span>
        <span className="shrink-0 rounded border border-blue-400 px-1.5 py-0.5 text-[10px] text-blue-400">
          {KIND_LABEL[node.kind]}
        </span>
      </div>
      {node.subtitle && (
        <div className="mb-1.5 text-[11px] text-muted-foreground">
          {node.subtitle}
        </div>
      )}
      <ColumnList columns={node.columns} />
    </div>
  );
}

function RelationshipEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  label,
  data,
}: EdgeProps & { data?: { isSelected?: boolean; isDimmed?: boolean } }) {
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const isSelected = data?.isSelected;
  const isDimmed = data?.isDimmed;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={24}
        style={{
          stroke: isSelected ? "#f59e0b" : "hsl(var(--primary))",
          strokeWidth: isSelected ? 3 : 2,
          strokeDasharray: "6 4",
          opacity: isDimmed ? 0.25 : 1,
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
      />
      {label && (
        <foreignObject
          x={labelX - 24}
          y={labelY - 12}
          width={48}
          height={24}
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center">
            <span
              className={`rounded border px-1 text-[10px] font-semibold transition-colors ${
                isSelected
                  ? "border-amber-400 bg-amber-400/10 text-amber-500"
                  : "border-border bg-background text-foreground"
              }`}
            >
              {String(label)}
            </span>
          </div>
        </foreignObject>
      )}
    </>
  );
}

const nodeTypes = { fact: FactBox, dim: DimBox };
const edgeTypes = { relationship: RelationshipEdge };

/*
 * Radius needed so that `count` boxes of `boxWidth`, evenly
 * spaced around a circle with `gap` px between them, don't
 * overlap. Derived from the chord-length formula:
 *   chord = 2 * radius * sin(angleStep / 2) >= boxWidth + gap
 */
function ringRadius(count: number, boxWidth: number, gap: number, minRadius: number) {
  if (count <= 1) return 0;

  const angleStep = (2 * Math.PI) / count;
  const needed = (boxWidth + gap) / (2 * Math.sin(angleStep / 2));

  return Math.max(minRadius, needed);
}

/*
 * Read-only ER diagram. Reuses the layout idea from
 * StarSchemaDiagram (fact tables centered, everything else
 * arranged radially around them) but drops all editing
 * machinery — no drag-to-connect, no delete, no entity panel —
 * since this is purely for displaying metadata analysis
 * results, not modeling a star schema.
 *
 * Layout: fact tables form a small, tightly-spaced inner ring
 * (or sit dead center if there's only one), and every other
 * table forms a much larger outer ring around them. Both radii
 * are computed from the actual box width and node count so
 * boxes never overlap regardless of how many facts/dimensions
 * come back from the API.
 *
 * Clicking a relationship line highlights the two tables it
 * connects (yellow border) and dims every other table; clicking
 * the same line again, or clicking empty canvas, clears it.
 */
export function MetadataDiagram({ nodes: inputNodes, edges: inputEdges }: MetadataDiagramProps) {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const selectedEdge = useMemo(
    () => inputEdges.find((e) => e.id === selectedEdgeId) ?? null,
    [inputEdges, selectedEdgeId]
  );

  const highlightedNodeIds = useMemo(() => {
    if (!selectedEdge) return null;
    return new Set([selectedEdge.source, selectedEdge.target]);
  }, [selectedEdge]);

  const nodes = useMemo<Node[]>(() => {
    const factNodes = inputNodes.filter((n) => n.kind === "fact");
    const otherNodes = inputNodes.filter((n) => n.kind !== "fact");

    const toData = (node: DiagramNode) => ({
      ...node,
      dimmed: highlightedNodeIds ? !highlightedNodeIds.has(node.id) : false,
      highlighted: highlightedNodeIds ? highlightedNodeIds.has(node.id) : false,
    });

    // Facts: a single fact sits dead center; multiple facts form
    // a small, tightly-packed ring of their own near the center.
    const factRadius = ringRadius(factNodes.length, FACT_BOX_WIDTH, 50, 170);
    const factAngleStep = (2 * Math.PI) / Math.max(1, factNodes.length);

    const factFlowNodes: Node[] = factNodes.map((node, index) => {
      const angle = index * factAngleStep - Math.PI / 2;

      return {
        id: node.id,
        type: "fact",
        position: {
          x: Math.cos(angle) * factRadius,
          y: Math.sin(angle) * factRadius,
        },
        data: toData(node) as unknown as Record<string, unknown>,
        draggable: false,
      };
    });

    // Dimensions/plain tables: one big outer ring, sized so it
    // both clears the fact cluster and gives every dim box
    // enough room around the circle.
    const dimRingRadius = ringRadius(otherNodes.length, DIM_BOX_WIDTH, 60, 420);
    const dimRadius = Math.max(dimRingRadius, factRadius + FACT_BOX_WIDTH / 2 + DIM_BOX_WIDTH / 2 + 120);
    const dimAngleStep = (2 * Math.PI) / Math.max(1, otherNodes.length);

    const otherFlowNodes: Node[] = otherNodes.map((node, index) => {
      const angle = index * dimAngleStep - Math.PI / 2;

      return {
        id: node.id,
        type: "dim",
        position: {
          x: Math.cos(angle) * dimRadius,
          y: Math.sin(angle) * dimRadius,
        },
        data: toData(node) as unknown as Record<string, unknown>,
        draggable: false,
      };
    });

    return [...factFlowNodes, ...otherFlowNodes];
  }, [inputNodes, highlightedNodeIds]);

  const edges = useMemo<Edge[]>(
    () =>
      inputEdges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: "relationship",
        label: edge.label,
        data: {
          isSelected: edge.id === selectedEdgeId,
          isDimmed: !!selectedEdgeId && edge.id !== selectedEdgeId,
        },
      })),
    [inputEdges, selectedEdgeId]
  );

  const handleEdgeClick = (edgeId: string) => {
    setSelectedEdgeId((current) => (current === edgeId ? null : edgeId));
  };

  return (
    <ReactFlowProvider>
      <div className="h-[600px] w-full overflow-hidden rounded-2xl border border-border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onEdgeClick={(_, edge) => handleEdgeClick(edge.id)}
          onPaneClick={() => setSelectedEdgeId(null)}
          fitView
          fitViewOptions={{ padding: 0.2, minZoom: 0.2, maxZoom: 1.1, duration: 500 }}
          minZoom={0.15}
          maxZoom={1.6}
          panOnDrag
          zoomOnScroll
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={24} size={1.5} />
          <Controls showZoom showFitView showInteractive={false} position="bottom-left" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
