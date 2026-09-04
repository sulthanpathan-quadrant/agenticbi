import { useState } from "react";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

import {
  Footer,
  StepHeader,
  type AnalysisRelationship,
  type AnalysisTable,
  type ConnectionValues,
  type MetadataAnalysisResult,
} from "./ModernizeShared";
import { DiagramEdge, DiagramNode, MetadataDiagram } from "./MetaDataDiagram";



const API_BASE_URL = "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

const fetchTargetAnalysis = async (
  sessionId: string
): Promise<MetadataAnalysisResult> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/step1-target-analysis`,
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
      `Failed to analyze target metadata (${response.status})`
    );
  }

  return response.json();
};

// "dimension" -> "Lookup list" etc., so non-technical users understand.
function friendlyRole(role: AnalysisTable["role"]) {
  switch (role) {
    case "dimension":
      return "Lookup list";
    case "fact":
      return "Activity data";
    case "bridge":
      return "Connector";
    default:
      return "Other";
  }
}

// "one row per dim_date, keyed by date_key" -> "Each row is one dim_date."
function friendlyGrain(grain: string) {
  const match = grain.match(/^one row per ([^,]+)/i);
  if (match) return `Each row is one ${match[1]}.`;
  return grain.charAt(0).toUpperCase() + grain.slice(1);
}

function friendlyTargetSummary(result: MetadataAnalysisResult) {
  const dimensions = result.tables.filter((t) => t.role === "dimension").length;
  const facts = result.tables.filter((t) => t.role === "fact").length;
  return `${result.tables.length} tables · ${dimensions} lookup lists · ${facts} activity tables · ${result.relationships.length} connection${result.relationships.length === 1 ? "" : "s"}`;
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

function TargetTableListItem({ table }: { table: AnalysisTable }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-sm font-semibold text-foreground">
            {table.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {friendlyGrain(table.grain)}
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-accent px-2.5 py-0.5 text-[11px] font-semibold text-primary">
          {friendlyRole(table.role)}
        </span>
      </div>

      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <span>
          Used by{" "}
          <span className="font-semibold text-foreground">
            {table.incoming_fk_count}
          </span>{" "}
          table{table.incoming_fk_count === 1 ? "" : "s"}
        </span>
        <span>
          Points to{" "}
          <span className="font-semibold text-foreground">
            {table.outgoing_fk_count}
          </span>{" "}
          table{table.outgoing_fk_count === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

function TargetRelationshipListItem({
  relationship,
}: {
  relationship: AnalysisRelationship;
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

interface TargetMetadataAnalysisProps {
  sessionId: string | null;
  targetConfig: ConnectionValues | null;
  targetMetadata: MetadataAnalysisResult | null;
  onTargetMetadataChange: (metadata: MetadataAnalysisResult) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function TargetMetadataAnalysis({
  sessionId,
  targetConfig,
  targetMetadata,
  onTargetMetadataChange,
  onBack,
  onNext,
}: TargetMetadataAnalysisProps) {
  const [state, setState] = useState<PanelState>(
    targetMetadata ? "done" : "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const analyze = () => {
    if (!sessionId) return;

    setState("running");
    setError(null);

    fetchTargetAnalysis(sessionId)
      .then((result) => {
        onTargetMetadataChange(result);
        setState("done");
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to analyze target metadata."
        );
        setState("error");
      });
  };

  /*
   * NOTE: step1-target-analysis does not return column-level
   * detail per table (unlike the source metadata response), so
   * these diagram nodes render with an empty column list.
   */
  const diagramNodes: DiagramNode[] = targetMetadata
    ? targetMetadata.tables.map((table) => ({
        id: `${table.schema}.${table.name}`,
        label: table.name,
        kind:
          table.role === "fact"
            ? "fact"
            : table.role === "dimension"
              ? "dimension"
              : "table",
        subtitle: `${friendlyRole(table.role)} · ${friendlyGrain(table.grain)}`,
        columns: [],
      }))
    : [];

  const diagramEdges: DiagramEdge[] = targetMetadata
    ? targetMetadata.relationships.map((relationship) => ({
        id: relationship.constraint_name,
        source: relationship.from_table,
        target: relationship.to_table,
        label: cardinalityLabel(relationship.cardinality),
      }))
    : [];

  return (
    <section>
      <StepHeader
        title="Target Metadata Analysis"
        desc="Analyze the target UDM to see its tables and how they connect."
      />

      {targetConfig?.target_type && (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Target</span>
          <span className="ml-2 font-medium text-foreground">
            {targetConfig.target_type}
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
                  ? "Analyze the target UDM to see its tables and how they connect."
                  : "Waiting for the migration session to be created..."}
              </p>
              <button
                type="button"
                onClick={analyze}
                disabled={!sessionId}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Analyze target metadata
              </button>
            </>
          )}
        </div>
      )}

      {state === "done" && targetMetadata && (
        <>
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {friendlyTargetSummary(targetMetadata)}
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
                  Tables ({targetMetadata.tables.length})
                </h3>
                <div className="max-h-[270px] space-y-3 overflow-y-auto pr-1">
                  {targetMetadata.tables.map((table) => (
                    <TargetTableListItem
                      key={`${table.schema}.${table.name}`}
                      table={table}
                    />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Relationships ({targetMetadata.relationships.length})
                </h3>
                <div className="max-h-[270px] overflow-y-auto rounded-xl border border-border">
                  {targetMetadata.relationships.map((relationship) => (
                    <TargetRelationshipListItem
                      key={relationship.constraint_name}
                      relationship={relationship}
                    />
                  ))}

                  {targetMetadata.relationships.length === 0 && (
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
        nextLabel="Continue to column mapping"
      />
    </section>
  );
}
