import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Sparkles,
} from "lucide-react";

import {
  Footer,
  Stat,
  StepHeader,
} from "./ModernizeShared";

const API_BASE_URL = "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

/*
 * ---------------------------------------------------------------
 * API — step3-generate-mapping
 * ---------------------------------------------------------------
 * Kicks off mapping generation on the backend. Returns counts and
 * a server-side file path (saved_to) — not the rows themselves.
 * ---------------------------------------------------------------
 */
interface GenerateMappingResult {
  row_count: number;
  low_confidence_count: number;
  reference_docs_loaded: number;
  saved_to: string;
  next_step: string;
}

const generateMapping = async (
  sessionId: string
): Promise<GenerateMappingResult> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/step3-generate-mapping`,
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
      `Failed to generate mapping (${response.status})`
    );
  }

  return response.json();
};

/*
 * ---------------------------------------------------------------
 * API — GET /sessions/{id}/mapping
 * ---------------------------------------------------------------
 * Returns every generated mapping row as JSON. We only render
 * the first 5 for the preview table.
 * ---------------------------------------------------------------
 */
export interface MappingRow {
  source_system: string;
  source_schema: string;
  source_table: string;
  source_column: string;
  source_data_type: string;
  target_fact_or_dim: string;
  target_column: string;
  target_data_type: string;
  confidence_score: number;
  reasoning: string;
  alternate_candidates: string;
  reviewer_decision: string;
  reviewer_override_table: string;
  reviewer_override_column: string;
  reviewer_comment: string;
  index: number;
}

interface MappingRowsResponse {
  rows: MappingRow[];
}

const fetchMappingRows = async (
  sessionId: string
): Promise<MappingRow[]> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/mapping`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load mapping preview (${response.status})`
    );
  }

  const data: MappingRowsResponse = await response.json();
  return data.rows ?? [];
};

/*
 * ---------------------------------------------------------------
 * API — GET /sessions/{id}/mapping/download-csv
 * ---------------------------------------------------------------
 * Returns the full mapping_review.csv file for download.
 * ---------------------------------------------------------------
 */
const downloadMappingCsv = async (
  sessionId: string
): Promise<Blob> => {
  const response = await fetch(
    `${API_BASE_URL}/sessions/${sessionId}/mapping/download-csv`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to download mapping CSV (${response.status})`
    );
  }

  return response.blob();
};

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

// ---------- display helpers ----------

function shortSource(row: MappingRow) {
  if (!row.source_table || row.source_table === "N/A") return "—";
  return `${row.source_table}.${row.source_column}`;
}

function shortTarget(row: MappingRow) {
  if (!row.target_fact_or_dim || !row.target_column) return "—";
  const table = row.target_fact_or_dim.split(".").pop();
  return `${table}.${row.target_column}`;
}

function confClass(confidence: number) {
  if (confidence >= 85) {
    return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  }

  if (confidence >= 70) {
    return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  }

  return "bg-destructive/15 text-destructive";
}

type GenerateState = "idle" | "generating" | "done" | "error";

interface ColumnMappingProps {
  sessionId: string | null;
  sourceMetadata: unknown;
  targetMetadata: unknown;
  onBack: () => void;
  onNext: () => void;
}

export default function ColumnMapping({
  sessionId,
  onBack,
  onNext,
}: ColumnMappingProps) {
  const [state, setState] = useState<GenerateState>("idle");
  const [stats, setStats] = useState<GenerateMappingResult | null>(null);
  const [previewRows, setPreviewRows] = useState<MappingRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  /*
   * Generate the mapping, then immediately pull the first 5 rows
   * from GET /mapping for the preview table.
   */
  const handleGenerate = async () => {
    if (!sessionId) return;

    setState("generating");
    setError(null);

    try {
      const result = await generateMapping(sessionId);
      setStats(result);

      const rows = await fetchMappingRows(sessionId);
      setPreviewRows(rows.slice(0, 5));

      setState("done");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate mapping."
      );
      setState("error");
    }
  };

  const handleDownload = async () => {
    if (!sessionId) return;

    setDownloading(true);
    setDownloadError(null);

    try {
      const blob = await downloadMappingCsv(sessionId);
      triggerBlobDownload(blob, "mapping_review.csv");
      setExported(true);
    } catch (err) {
      setDownloadError(
        err instanceof Error
          ? err.message
          : "Failed to download mapping CSV."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section>
      <StepHeader
        title="AI-Generated Column Mapping"
        desc="Veriton compares every source column against your UDM columns and proposes the best match — with a confidence score, plain-English reasoning and alternates."
      />

      {state === "idle" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!sessionId}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            Generate mapping
          </button>
          {!sessionId && (
            <p className="mt-3 text-xs text-muted-foreground">
              Waiting for the migration session to be created...
            </p>
          )}
        </div>
      )}

      {state === "generating" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h3 className="mt-4 font-semibold text-foreground">
            Generating the mapping...
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Comparing every source column against the target UDM. This
            usually takes a few seconds.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-semibold text-foreground">
            Couldn't generate the mapping
          </h3>
          <p className="mt-1 max-w-xs text-sm text-destructive">{error}</p>
          <button
            type="button"
            onClick={handleGenerate}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles className="h-4 w-4" />
            Try again
          </button>
        </div>
      )}

      {state === "done" && stats && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat
              value={String(stats.row_count)}
              label="Mapping rows generated"
            />

            <Stat
              value={String(stats.row_count - stats.low_confidence_count)}
              label="High-confidence matches"
            />

            <Stat
              value={String(stats.low_confidence_count)}
              label="Need attention (<70)"
            />
          </div>

          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Preview — first {previewRows.length} of {stats.row_count} rows
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-border font-semibold text-foreground">
                  <th className="px-6 py-4">Source Column</th>
                  <th className="px-6 py-4">Source Type</th>
                  <th className="px-6 py-4">Recommended Target</th>
                  <th className="px-6 py-4">Target Type</th>
                  <th className="px-6 py-4">Conf.</th>
                  <th className="px-6 py-4">Reviewer Decision</th>
                  <th className="px-6 py-4">Reasoning</th>
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row) => (
                  <tr
                    key={row.index}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {shortSource(row)}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {row.source_data_type || "—"}
                    </td>

                    <td className="px-6 py-4 text-primary">
                      {shortTarget(row)}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {row.target_data_type || "—"}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-semibold ${confClass(
                          row.confidence_score
                        )}`}
                      >
                        {row.confidence_score}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground">
                      {row.reviewer_decision || "—"}
                    </td>

                    <td
                      className="max-w-xs truncate px-6 py-4 text-muted-foreground"
                      title={row.reasoning}
                    >
                      {row.reasoning}
                    </td>
                  </tr>
                ))}

                {previewRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-muted-foreground"
                    >
                      No mapping rows returned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {downloading ? "Downloading..." : "Download mapping as CSV"}
          </button>

          {downloadError && (
            <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {downloadError}
            </p>
          )}

          {exported && !downloadError && (
            <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              mapping_review.csv downloaded — nothing has been applied to
              any data yet.
            </p>
          )}
        </>
      )}

      <Footer
        onBack={onBack}
        onNext={onNext}
        disabled={!exported}
        nextLabel="Send for business review"
      />
    </section>
  );
}
