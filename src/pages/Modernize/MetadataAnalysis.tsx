import { useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Database,
  Layers,
  Link2,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  Footer,
  StepHeader,
  type AnalysisRelationship,
  type AnalysisTable,
  type ConnectionValues,
  type MetadataAnalysisResult,
} from "./ModernizeShared";

/*
 * ---------------------------------------------------------------
 * API
 * ---------------------------------------------------------------
 *
 * step2-source-metadata returns raw source metadata (tables,
 * columns, primary/foreign keys) — it is NOT classified into
 * dimension/fact roles, so its shape is different from the
 * target UDM analysis response below.
 *
 * step1-target-analysis returns the already-classified UDM
 * model, matching MetadataAnalysisResult exactly (role, grain,
 * related_tables, summary, etc.).
 *
 * NOTE: If `SourceMetadata` / `TargetMetadata` are declared in
 * ModernizeShared.tsx, make sure they're updated to match
 * SourceMetadataResult / MetadataAnalysisResult below so the
 * parent component's state stays in sync with what these APIs
 * actually return.
 */

const API_BASE_URL = "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

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

// ---------- plain-language helpers (non-technical friendly) ----------

const ROLE_BADGE: Record<string, string> = {
  dimension: "bg-accent text-primary",
  fact: "bg-primary text-primary-foreground",
  bridge: "bg-muted text-foreground",
  unknown: "bg-muted text-muted-foreground",
};

function shortName(qualified: string) {
  return qualified.split(".").pop() ?? qualified;
}

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

function friendlyRoleHint(role: AnalysisTable["role"]) {
  switch (role) {
    case "dimension":
      return "Describes things like dates, machines or products.";
    case "fact":
      return "Records events and measurements.";
    default:
      return "";
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
  return `We found ${result.tables.length} tables: ${dimensions} lookup lists (dimensions) and ${facts} activity tables (facts), linked by ${result.relationships.length} connection${result.relationships.length === 1 ? "" : "s"}.`;
}

function friendlySourceSummary(result: SourceMetadataResult) {
  return `We found ${result.table_count} table${result.table_count === 1 ? "" : "s"} with ${result.column_count} column${result.column_count === 1 ? "" : "s"} in total, linked by ${result.relationships.length} relationship${result.relationships.length === 1 ? "" : "s"}.`;
}

function friendlyCardinality(cardinality: string) {
  switch (cardinality) {
    case "many-to-one":
      return "Many rows point to one row";
    case "one-to-one":
      return "One row to one row";
    case "many-to-many":
      return "Many rows to many rows";
    default:
      return cardinality;
  }
}

// ---------- shared building blocks ----------

function RelationshipRow({
  relationship,
}: {
  relationship: AnalysisRelationship | SourceMetadataRelationship;
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
          matched on{" "}
          <span className="font-mono">{relationship.from_columns.join(", ")}</span>
        </span>
        <span className="rounded-full bg-accent px-2 py-0.5 font-medium text-primary">
          {friendlyCardinality(relationship.cardinality)}
        </span>
      </div>
    </div>
  );
}

// ---------- target UDM building blocks (role/grain classified) ----------

function TargetTableCard({ table }: { table: AnalysisTable }) {
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
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ROLE_BADGE[table.role] ?? ROLE_BADGE["unknown"]}`}
        >
          {friendlyRole(table.role)}
        </span>
      </div>

      <p className="mt-1.5 text-[11px] italic text-muted-foreground">
        {friendlyRoleHint(table.role)}
      </p>

      {table.related_tables.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Connects to
          </div>
          <div className="flex flex-wrap gap-1.5">
            {table.related_tables.map((related) => (
              <span
                key={related}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                <Link2 className="h-3 w-3" />
                {shortName(related)}
              </span>
            ))}
          </div>
        </div>
      )}

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

// ---------- source metadata building blocks (raw, unclassified) ----------

function SourceTableCard({
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

      {table.foreign_keys.length > 0 && (
        <div className="mt-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Connects to
          </div>
          <div className="flex flex-wrap gap-1.5">
            {table.foreign_keys.map((fk) => (
              <span
                key={fk.name}
                className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                <Link2 className="h-3 w-3" />
                {fk.referred_table}
              </span>
            ))}
          </div>
        </div>
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

type PanelState = "idle" | "running" | "done" | "error";

// ---------- card shells ----------

function SourceAnalysisCard({
  title,
  subtitle,
  state,
  result,
  error,
  sessionReady,
  onAnalyze,
}: {
  title: string;
  subtitle: string;
  state: PanelState;
  result: SourceMetadataResult | null;
  error: string | null;
  sessionReady: boolean;
  onAnalyze: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {state === "done" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Analyzed
          </span>
        )}
      </div>

      {state === "idle" && (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!sessionReady}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Analyze source metadata
          </button>
          {!sessionReady && (
            <p className="mt-3 text-xs text-muted-foreground">
              Waiting for the migration session to be created...
            </p>
          )}
        </div>
      )}

      {state === "running" && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h3 className="mt-4 font-semibold text-foreground">
            Scanning your source...
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reading tables and connections. This usually takes a few seconds.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            Couldn't analyze the source
          </h3>
          <p className="mt-1 max-w-xs text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={onAnalyze}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {state === "done" && result && (
        <div className="p-5">
          <p className="rounded-xl bg-accent/50 p-4 text-sm leading-relaxed text-foreground">
            {friendlySourceSummary(result)}
          </p>

          <div className="mt-4 grid max-h-[420px] gap-3 overflow-y-auto pr-1">
            {result.tables.map((table) => (
              <SourceTableCard
                key={`${table.schema}.${table.name}`}
                table={table}
                relationships={result.relationships}
              />
            ))}
          </div>

          <h3 className="mt-5 text-sm font-semibold text-foreground">
            How the tables connect ({result.relationships.length})
          </h3>
          <div className="mt-2 max-h-[240px] overflow-y-auto rounded-xl border border-border">
            {result.relationships.map((relationship) => (
              <RelationshipRow
                key={relationship.constraint_name}
                relationship={relationship}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Sparkles className="h-4 w-4" />
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}

function TargetAnalysisCard({
  title,
  subtitle,
  state,
  result,
  error,
  sessionReady,
  onAnalyze,
}: {
  title: string;
  subtitle: string;
  state: PanelState;
  result: MetadataAnalysisResult | null;
  error: string | null;
  sessionReady: boolean;
  onAnalyze: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-border p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {state === "done" && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Analyzed
          </span>
        )}
      </div>

      {state === "idle" && (
        <div className="flex flex-col items-center px-5 py-10 text-center">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={!sessionReady}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Analyze target metadata
          </button>
          {!sessionReady && (
            <p className="mt-3 text-xs text-muted-foreground">
              Waiting for the migration session to be created...
            </p>
          )}
        </div>
      )}

      {state === "running" && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h3 className="mt-4 font-semibold text-foreground">
            Scanning your target...
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Reading tables and connections. This usually takes a few seconds.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center px-5 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            Couldn't analyze the target
          </h3>
          <p className="mt-1 max-w-xs text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={onAnalyze}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {state === "done" && result && (
        <div className="p-5">
          <p className="rounded-xl bg-accent/50 p-4 text-sm leading-relaxed text-foreground">
            {friendlyTargetSummary(result)}
          </p>

          <div className="mt-4 grid max-h-[420px] gap-3 overflow-y-auto pr-1">
            {result.tables.map((table) => (
              <TargetTableCard key={`${table.schema}.${table.name}`} table={table} />
            ))}
          </div>

          <h3 className="mt-5 text-sm font-semibold text-foreground">
            How the tables connect ({result.relationships.length})
          </h3>
          <div className="mt-2 max-h-[240px] overflow-y-auto rounded-xl border border-border">
            {result.relationships.map((relationship) => (
              <RelationshipRow
                key={relationship.constraint_name}
                relationship={relationship}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={onAnalyze}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            <Sparkles className="h-4 w-4" />
            Re-analyze
          </button>
        </div>
      )}
    </div>
  );
}

interface MetadataAnalysisProps {
  sessionId: string | null;
  sourceConfig: ConnectionValues | null;
  targetConfig: ConnectionValues | null;
  sourceMetadata: SourceMetadataResult | null;
  targetMetadata: MetadataAnalysisResult | null;
  onSourceMetadataChange: (metadata: SourceMetadataResult) => void;
  onTargetMetadataChange: (metadata: MetadataAnalysisResult) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function MetadataAnalysis({
  sessionId,
  sourceConfig,
  targetConfig,
  sourceMetadata,
  targetMetadata,
  onSourceMetadataChange,
  onTargetMetadataChange,
  onBack,
  onNext,
}: MetadataAnalysisProps) {
  const [sourceState, setSourceState] = useState<PanelState>(
    sourceMetadata ? "done" : "idle"
  );
  const [targetState, setTargetState] = useState<PanelState>(
    targetMetadata ? "done" : "idle"
  );

  const [sourceError, setSourceError] = useState<string | null>(null);
  const [targetError, setTargetError] = useState<string | null>(null);

  /*
   * ---------------------------------------------------------
   * ANALYZE SOURCE
   * ---------------------------------------------------------
   *
   * Only runs when the user explicitly clicks "Analyze source
   * metadata" / "Re-analyze" / "Try again" — there is no
   * automatic run when the session is created, and it no
   * longer chains into the target analysis.
   */
  const analyzeSource = () => {
    if (!sessionId) return;

    setSourceState("running");
    setSourceError(null);

    fetchSourceMetadata(sessionId)
      .then((result) => {
        onSourceMetadataChange(result);
        setSourceState("done");
      })
      .catch((err) => {
        setSourceError(
          err instanceof Error
            ? err.message
            : "Failed to analyze source metadata."
        );
        setSourceState("error");
      });
  };

  /*
   * ---------------------------------------------------------
   * ANALYZE TARGET
   * ---------------------------------------------------------
   *
   * Only runs when the user explicitly clicks "Analyze target
   * metadata" / "Re-analyze" / "Try again".
   */
  const analyzeTarget = () => {
    if (!sessionId) return;

    setTargetState("running");
    setTargetError(null);

    fetchTargetAnalysis(sessionId)
      .then((result) => {
        onTargetMetadataChange(result);
        setTargetState("done");
      })
      .catch((err) => {
        setTargetError(
          err instanceof Error
            ? err.message
            : "Failed to analyze target metadata."
        );
        setTargetState("error");
      });
  };

  const bothDone = sourceState === "done" && targetState === "done";

  return (
    <section>
      <StepHeader
        title="Source & Target Metadata Analysis"
        desc="Run the analysis on each side whenever you're ready — we'll show you its tables and how they connect, in plain language, no technical knowledge needed."
      />

      {sessionId && (
        <div className="mb-6 rounded-xl border border-border bg-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Session</span>
          <span className="ml-2 font-mono font-medium text-foreground">
            {sessionId}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
        <SourceAnalysisCard
          title="Source"
          subtitle={sourceConfig?.source_type ?? "Source database"}
          state={sourceState}
          result={sourceMetadata}
          error={sourceError}
          sessionReady={!!sessionId}
          onAnalyze={analyzeSource}
        />

        <TargetAnalysisCard
          title="Target UDM"
          subtitle={targetConfig?.target_type ?? "Target platform"}
          state={targetState}
          result={targetMetadata}
          error={targetError}
          sessionReady={!!sessionId}
          onAnalyze={analyzeTarget}
        />
      </div>

      <Footer
        onBack={onBack}
        onNext={onNext}
        disabled={!bothDone}
        nextLabel="Continue to mapping"
      />
    </section>
  );
}
