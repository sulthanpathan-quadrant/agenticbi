
import { useEffect, useRef, useState } from "react";
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

const API_BASE_URL =
  "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

/*
 * ---------------------------------------------------------------
 * API — step3-generate-mapping
 * ---------------------------------------------------------------
 * Kicks off mapping generation on the backend. Returns counts and
 * a server-side file path (saved_to) — not the rows themselves.
 * ---------------------------------------------------------------
 */
export interface GenerateMappingResult {
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
      headers: {
        Accept: "application/json",
      },
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
      headers: {
        Accept: "application/json",
      },
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
  if (!row.source_table || row.source_table === "N/A") {
    return "—";
  }

  return `${row.source_table}.${row.source_column}`;
}

function shortTarget(row: MappingRow) {
  if (!row.target_fact_or_dim || !row.target_column) {
    return "—";
  }

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

/*
 * ---------------------------------------------------------------
 * SIMULATED PROGRESS
 * ---------------------------------------------------------------
 * The backend doesn't stream real progress — step3-generate-mapping
 * is a single POST that resolves only once the whole job is done,
 * and that job typically takes 2-3 minutes for a full schema.
 *
 * So instead of a fixed per-tick increment (which would either
 * finish in a few seconds or crawl forever depending on how long
 * the job actually takes), progress is a function of *elapsed
 * time* against an expected duration. It follows an easing curve
 * that moves briskly at first, then slows as it approaches a 92%
 * soft cap — so a job that finishes early still looks complete,
 * and a job that runs long doesn't stall the bar dead on-screen.
 * When the real response lands, we snap straight to 100% and hold
 * briefly before showing the results.
 * ---------------------------------------------------------------
 */
const EXPECTED_DURATION_MS = 150_000; // ~2.5 minutes, typical case
const PROGRESS_TAU_MS = EXPECTED_DURATION_MS / 2; // controls easing rate
const PROGRESS_CAP = 92;

const GENERATION_STAGES: { threshold: number; label: string }[] = [
  { threshold: 6, label: "Reading source schema metadata..." },
  { threshold: 20, label: "Reading target UDM schema..." },
  { threshold: 38, label: "Comparing source and target columns..." },
  { threshold: 58, label: "Scoring match confidence..." },
  { threshold: 75, label: "Finding alternate candidates..." },
  { threshold: 88, label: "Cross-checking against reference docs..." },
  { threshold: 92, label: "Writing mapping rows..." },
];

function getStageLabel(pct: number) {
  for (const stage of GENERATION_STAGES) {
    if (pct < stage.threshold) {
      return stage.label;
    }
  }

  return "Finalizing...";
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type Phase = "idle" | "generating" | "done" | "error";

interface ColumnMappingProps {
  sessionId: string | null;
  sourceMetadata?: unknown;
  targetMetadata?: unknown;

  /*
   * Generation results live in the parent (ModernizeData) so
   * they survive navigating away from this step and back.
   * This component only holds transient in-flight UI state.
   */
  mappingResult: GenerateMappingResult | null;
  previewRows: MappingRow[];
  exported: boolean;

  onMappingResultChange: (
    result: GenerateMappingResult
  ) => void;

  onPreviewRowsChange: (
    rows: MappingRow[]
  ) => void;

  onExportedChange: (
    exported: boolean
  ) => void;

  onBack: () => void;
  onNext: () => void;
}

export default function ColumnMapping({
  sessionId,
  mappingResult,
  previewRows,
  exported,
  onMappingResultChange,
  onPreviewRowsChange,
  onExportedChange,
  onBack,
  onNext,
}: ColumnMappingProps) {
  const [phase, setPhase] = useState<Phase>(
    mappingResult ? "done" : "idle"
  );

  const [error, setError] = useState<string | null>(null);

  const [downloading, setDownloading] = useState(false);

  const [downloadError, setDownloadError] =
    useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  // Tracks whether the real request has finished, so the ticker
  // knows it's allowed to blow past the 92% soft cap.
  const requestDoneRef = useRef(false);

  // When the current generation run started, so progress is driven
  // by elapsed time rather than a fixed per-tick increment.
  const startTimeRef = useRef<number | null>(null);

  /*
   * ---------------------------------------------------------------
   * PROGRESS TICKER
   * ---------------------------------------------------------------
   * Runs only while phase === "generating". Progress is derived
   * from elapsed time via an easing curve toward PROGRESS_CAP, so
   * the bar's pace matches the job's real ~2-3 minute duration
   * instead of racing to 90% in a few seconds. Once the real
   * request resolves, requestDoneRef flips and the bar is allowed
   * to close out past the cap to 100%.
   * ---------------------------------------------------------------
   */
  useEffect(() => {
    if (phase !== "generating") {
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const interval = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      setElapsedMs(elapsed);

      setProgress((prev) => {
        if (prev >= 100) {
          return prev;
        }

        if (requestDoneRef.current) {
          const remaining = 100 - prev;
          return Math.min(prev + Math.max(remaining * 0.5, 4), 100);
        }

        const eased =
          PROGRESS_CAP * (1 - Math.exp(-elapsed / PROGRESS_TAU_MS));

        // Never go backwards, even if the easing curve and a prior
        // tick briefly disagree.
        return Math.max(prev, Math.min(eased, PROGRESS_CAP));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [phase]);

  /*
   * ---------------------------------------------------------------
   * RESTORE MAPPING FROM BACKEND
   * ---------------------------------------------------------------
   *
   * When the user refreshes the page or leaves Step 5 and comes
   * back, fetch the latest mapping rows from the backend.
   *
   * IMPORTANT:
   * Do NOT put onPreviewRowsChange in the dependency array.
   *
   * ModernizeData passes a callback that is recreated when the
   * parent re-renders. Including that callback here would cause:
   *
   * GET -> set parent state -> parent re-render ->
   * callback changes -> effect runs again -> GET -> ...
   *
   * sessionId is enough because ColumnMapping is mounted again
   * whenever the user returns to Step 5.
   * ---------------------------------------------------------------
   */
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let cancelled = false;

    const restoreMapping = async () => {
      try {
        const rows = await fetchMappingRows(sessionId);

        if (cancelled) {
          return;
        }

        if (rows.length > 0) {
          onPreviewRowsChange(rows.slice(0, 5));
        }
      } catch (err) {
        if (!cancelled) {
          console.error(
            "Failed to restore mapping from backend:",
            err
          );
        }
      }
    };

    restoreMapping();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  /*
   * ---------------------------------------------------------------
   * GENERATE MAPPING
   * ---------------------------------------------------------------
   *
   * POST generates the mapping.
   * GET then retrieves the generated rows for the preview.
   * ---------------------------------------------------------------
   */
  const handleGenerate = async () => {
    if (!sessionId) {
      return;
    }

    requestDoneRef.current = false;
    startTimeRef.current = Date.now();
    setProgress(0);
    setElapsedMs(0);
    setPhase("generating");
    setError(null);

    try {
      const result = await generateMapping(sessionId);

      const rows = await fetchMappingRows(sessionId);

      requestDoneRef.current = true;
      setProgress(100);

      onMappingResultChange(result);

      onPreviewRowsChange(
        rows.slice(0, 5)
      );

      // Brief hold so the bar visibly reaches 100% before the
      // results table replaces it.
      await new Promise((resolve) => setTimeout(resolve, 400));

      setPhase("done");
    } catch (err) {
      requestDoneRef.current = true;

      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate mapping."
      );

      setPhase("error");
    }
  };

  /*
   * ---------------------------------------------------------------
   * DOWNLOAD MAPPING CSV
   * ---------------------------------------------------------------
   */
  const handleDownload = async () => {
    if (!sessionId) {
      return;
    }

    setDownloading(true);
    setDownloadError(null);

    try {
      const blob = await downloadMappingCsv(sessionId);

      triggerBlobDownload(
        blob,
        "mapping_review.csv"
      );

      onExportedChange(true);
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

      {phase === "idle" && (
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

      {phase === "generating" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />

          <h3 className="mt-4 font-semibold text-foreground">
            Generating the mapping...
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            {getStageLabel(progress)}
          </p>

          <div className="mt-6 w-full max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-xs font-medium tabular-nums text-muted-foreground">
              <span>{formatElapsed(elapsedMs)} elapsed</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            This usually takes 2–3 minutes for a full schema —
            feel free to leave this tab open, it'll keep running.
          </p>
        </div>
      )}

      {phase === "error" && (
        <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-7 w-7" />
          </div>

          <h3 className="mt-4 font-semibold text-foreground">
            Couldn't generate the mapping
          </h3>

          <p className="mt-1 max-w-xs text-sm text-destructive">
            {error}
          </p>

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

      {phase === "done" && mappingResult && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Stat
              value={String(mappingResult.row_count)}
              label="Mapping rows generated"
            />

            <Stat
              value={String(
                mappingResult.row_count -
                  mappingResult.low_confidence_count
              )}
              label="High-confidence matches"
            />

            <Stat
              value={String(
                mappingResult.low_confidence_count
              )}
              label="Need attention (<70)"
            />
          </div>

          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Preview — first {previewRows.length} of{" "}
            {mappingResult.row_count} rows
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead>
                <tr className="border-b border-border font-semibold text-foreground">
                  <th className="px-6 py-4">
                    Source Column
                  </th>

                  <th className="px-6 py-4">
                    Source Type
                  </th>

                  <th className="px-6 py-4">
                    Recommended Target
                  </th>

                  <th className="px-6 py-4">
                    Target Type
                  </th>

                  <th className="px-6 py-4">
                    Conf.
                  </th>

                  <th className="px-6 py-4">
                    Reviewer Decision
                  </th>

                  <th className="px-6 py-4">
                    Reasoning
                  </th>
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

            {downloading
              ? "Downloading..."
              : "Download mapping as CSV"}
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
              mapping_review.csv downloaded — nothing has been
              applied to any data yet.
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

