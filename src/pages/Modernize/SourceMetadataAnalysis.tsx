import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

import { Footer, StepHeader, type ConnectionValues } from "./ModernizeShared";
import { DiagramEdge, DiagramNode, MetadataDiagram } from "./MetaDataDiagram";


const API_BASE_URL = "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

/*
 * step2-source-metadata returns raw source metadata (tables,
 * columns, primary/foreign keys) — no dimension/fact
 * classification, unlike the target UDM analysis.
 */

export interface SourceMetadataColumn {
  name: string;
  data_type: string;
  is_nullable: boolean;
  is_primary_key: boolean;
  ordinal_position: number;
  comment: string | null;
}

export interface SourceMetadataForeignKey {
  name: string;
  columns: string[];
  referred_schema: string;
  referred_table: string;
  referred_columns: string[];
}

export interface SourceMetadataTable {
  schema: string;
  name: string;
  row_count_estimate: number;
  table_comment: string | null;
  columns: SourceMetadataColumn[];
  primary_key_columns: string[];
  foreign_keys: SourceMetadataForeignKey[];
}

export interface SourceMetadataRelationship {
  from_table: string;
  from_columns: string[];
  to_table: string;
  to_columns: string[];
  constraint_name: string;
  cardinality: string;
}

export interface SourceMetadataResult {
  table_count: number;
  column_count: number;
  tables: SourceMetadataTable[];
  relationships: SourceMetadataRelationship[];
  saved_to?: string;
}

const fetchSourceMetadata = async (
  sessionId: string
): Promise<SourceMetadataResult> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/step2-source-metadata`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "",
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to analyze source metadata (${response.status})`
    );
  }

  return response.json();
};

function friendlySourceSummary(result: SourceMetadataResult) {
  return `${result.table_count} table${result.table_count === 1 ? "" : "s"} · ${result.column_count} column${result.column_count === 1 ? "" : "s"} · ${result.relationships.length} relationship${result.relationships.length === 1 ? "" : "s"}`;
}

function cardinalityLabel(cardinality: string) {
  if (cardinality === "many-to-one") return "M:1";
  if (cardinality === "one-to-one") return "1:1";
  if (cardinality === "many-to-many") return "M:N";
  return cardinality;
}

function shortName(qualified: string) {
  return qualified.split(".").pop() ?? qualified;
}

function SourceTableListItem({
  table,
  relationships,
}: {
  table: SourceMetadataTable;
  relationships: SourceMetadataRelationship[];
}) {
  const qualifiedName = `${table.schema}.${table.name}`;

  const incomingCount = relationships.filter(
    (relationship) => relationship.to_table === qualifiedName
  ).length;

  const outgoingCount = table.foreign_keys.length;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold text-foreground">
            {table.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {table.schema} · ~{table.row_count_estimate.toLocaleString()} rows
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          {table.columns.length} column{table.columns.length === 1 ? "" : "s"}
        </span>
      </div>

      {table.primary_key_columns.length > 0 && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          Primary key:{" "}
          <span className="font-mono text-foreground">
            {table.primary_key_columns.join(", ")}
          </span>
        </p>
      )}

      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>
          Used by{" "}
          <span className="font-semibold text-foreground">
            {incomingCount}
          </span>{" "}
          table{incomingCount === 1 ? "" : "s"}
        </span>
        <span>
          Points to{" "}
          <span className="font-semibold text-foreground">
            {outgoingCount}
          </span>{" "}
          table{outgoingCount === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

function SourceRelationshipListItem({
  relationship,
}: {
  relationship: SourceMetadataRelationship;
}) {
  return (
    <div className="border-b border-border px-4 py-3 last:border-0">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="font-mono font-medium text-foreground">
          {shortName(relationship.from_table)}
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary" />
        <span className="font-mono font-medium text-foreground">
          {shortName(relationship.to_table)}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span>
          on{" "}
          <span className="font-mono">
            {relationship.from_columns.join(", ")}
          </span>
        </span>
        <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-primary">
          {cardinalityLabel(relationship.cardinality)}
        </span>
      </div>
    </div>
  );
}

type PanelState = "idle" | "running" | "done" | "error";

interface SourceMetadataAnalysisProps {
  sessionId: string | null;
  sourceConfig: ConnectionValues | null;
  sourceMetadata: SourceMetadataResult | null;
  onSourceMetadataChange: (metadata: SourceMetadataResult) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function SourceMetadataAnalysis({
  sessionId,
  sourceConfig,
  sourceMetadata,
  onSourceMetadataChange,
  onBack,
  onNext,
}: SourceMetadataAnalysisProps) {
  const [state, setState] = useState<PanelState>(
    sourceMetadata ? "done" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const analyze = () => {
    if (!sessionId) return;

    setState("running");
    setError(null);

    fetchSourceMetadata(sessionId)
      .then((result) => {
        onSourceMetadataChange(result);
        setState("done");
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to analyze source metadata."
        );
        setState("error");
      });
  };

  const diagramNodes: DiagramNode[] = sourceMetadata
    ? sourceMetadata.tables.map((table) => {
        const fkColumns = new Set(
          table.foreign_keys.flatMap((fk) => fk.columns)
        );

        return {
          id: `${table.schema}.${table.name}`,
          label: table.name,
          kind: "table",
          subtitle: `${table.schema} · ~${table.row_count_estimate.toLocaleString()} rows`,
          columns: table.columns.map((col) => ({
            name: col.name,
            isPrimaryKey: col.is_primary_key,
            isForeignKey: fkColumns.has(col.name),
          })),
        };
      })
    : [];

  const diagramEdges: DiagramEdge[] = sourceMetadata
    ? sourceMetadata.relationships.map((relationship) => ({
        id: relationship.constraint_name,
        source: relationship.from_table,
        target: relationship.to_table,
        label: cardinalityLabel(relationship.cardinality),
      }))
    : [];

  return (
    <section>
      <StepHeader
        title="Source Metadata Analysis"
        desc="Analyze the source to see its tables and how they connect."
      />

      {sourceConfig?.source_type && (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Source</span>
          <span className="ml-2 font-medium text-foreground">
            {sourceConfig.source_type}
          </span>
        </div>
      )}

      {state !== "done" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-14 text-center">
          {state === "running" && (
            <>
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                Reading tables and connections...
              </p>
            </>
          )}

          {state === "error" && (
            <>
              <AlertCircle className="h-6 w-6 text-destructive" />
              <p className="mt-3 max-w-xs text-sm text-destructive">{error}</p>
              <button
                type="button"
                onClick={analyze}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try again
              </button>
            </>
          )}

          {state === "idle" && (
            <>
              <p className="max-w-xs text-sm text-muted-foreground">
                {sessionId
                  ? "Analyze the source to see its tables and how they connect."
                  : "Waiting for the migration session to be created..."}
              </p>
              <button
                type="button"
                onClick={analyze}
                disabled={!sessionId}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Analyze source metadata
              </button>
            </>
          )}
        </div>
      )}

      {state === "done" && sourceMetadata && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {friendlySourceSummary(sourceMetadata)}
            </p>
            <button
              type="button"
              onClick={analyze}
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
            >
              <Sparkles className="h-4 w-4" />
              Re-analyze
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tables ({sourceMetadata.tables.length})
                </h3>
                <div className="max-h-[270px] space-y-3 overflow-y-auto pr-1">
                  {sourceMetadata.tables.map((table) => (
                    <SourceTableListItem
                      key={`${table.schema}.${table.name}`}
                      table={table}
                      relationships={sourceMetadata.relationships}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Relationships ({sourceMetadata.relationships.length})
                </h3>
                <div className="max-h-[270px] overflow-y-auto rounded-xl border border-border">
                  {sourceMetadata.relationships.map((relationship) => (
                    <SourceRelationshipListItem
                      key={relationship.constraint_name}
                      relationship={relationship}
                    />
                  ))}

                  {sourceMetadata.relationships.length === 0 && (
                    <p className="px-4 py-6 text-center text-xs text-muted-foreground">
                      No relationships found.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <MetadataDiagram nodes={diagramNodes} edges={diagramEdges} />
          </div>
        </>
      )}

      <Footer
        onBack={onBack}
        onNext={onNext}
        disabled={state !== "done"}
        nextLabel="Continue to target analysis"
      />
    </section>
  );
}
