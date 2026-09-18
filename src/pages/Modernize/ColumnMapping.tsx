// import { useEffect, useState } from "react";
// import {
//   AlertCircle,
//   CheckCircle2,
//   Download,
//   Loader2,
//   Sparkles,
// } from "lucide-react";

// import {
//   Footer,
//   Stat,
//   StepHeader,
// } from "./ModernizeShared";

// const API_BASE_URL =
//   "https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net";

// /*
//  * ---------------------------------------------------------------
//  * API — step3-generate-mapping
//  * ---------------------------------------------------------------
//  * Kicks off mapping generation on the backend. Returns counts and
//  * a server-side file path (saved_to) — not the rows themselves.
//  * ---------------------------------------------------------------
//  */
// export interface GenerateMappingResult {
//   row_count: number;
//   low_confidence_count: number;
//   reference_docs_loaded: number;
//   saved_to: string;
//   next_step: string;
// }

// const generateMapping = async (
//   sessionId: string
// ): Promise<GenerateMappingResult> => {
//   const response = await fetch(
//     `${API_BASE_URL}/sessions/${sessionId}/step3-generate-mapping`,
//     {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: "",
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to generate mapping (${response.status})`
//     );
//   }

//   return response.json();
// };

// /*
//  * ---------------------------------------------------------------
//  * API — GET /sessions/{id}/mapping
//  * ---------------------------------------------------------------
//  * Returns every generated mapping row as JSON. We only render
//  * the first 5 for the preview table.
//  * ---------------------------------------------------------------
//  */
// export interface MappingRow {
//   source_system: string;
//   source_schema: string;
//   source_table: string;
//   source_column: string;
//   source_data_type: string;
//   target_fact_or_dim: string;
//   target_column: string;
//   target_data_type: string;
//   confidence_score: number;
//   reasoning: string;
//   alternate_candidates: string;
//   reviewer_decision: string;
//   reviewer_override_table: string;
//   reviewer_override_column: string;
//   reviewer_comment: string;
//   index: number;
// }

// interface MappingRowsResponse {
//   rows: MappingRow[];
// }

// const fetchMappingRows = async (
//   sessionId: string
// ): Promise<MappingRow[]> => {
//   const response = await fetch(
//     `${API_BASE_URL}/sessions/${sessionId}/mapping`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to load mapping preview (${response.status})`
//     );
//   }

//   const data: MappingRowsResponse = await response.json();

//   return data.rows ?? [];
// };

// /*
//  * ---------------------------------------------------------------
//  * API — GET /sessions/{id}/mapping/download-csv
//  * ---------------------------------------------------------------
//  * Returns the full mapping_review.csv file for download.
//  * ---------------------------------------------------------------
//  */
// const downloadMappingCsv = async (
//   sessionId: string
// ): Promise<Blob> => {
//   const response = await fetch(
//     `${API_BASE_URL}/sessions/${sessionId}/mapping/download-csv`,
//     {
//       method: "GET",
//       headers: {
//         Accept: "application/json",
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error(
//       `Failed to download mapping CSV (${response.status})`
//     );
//   }

//   return response.blob();
// };

// function triggerBlobDownload(blob: Blob, filename: string) {
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = filename;

//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);

//   URL.revokeObjectURL(url);
// }

// // ---------- display helpers ----------

// function shortSource(row: MappingRow) {
//   if (!row.source_table || row.source_table === "N/A") {
//     return "—";
//   }

//   return `${row.source_table}.${row.source_column}`;
// }

// function shortTarget(row: MappingRow) {
//   if (!row.target_fact_or_dim || !row.target_column) {
//     return "—";
//   }

//   const table = row.target_fact_or_dim.split(".").pop();

//   return `${table}.${row.target_column}`;
// }

// function confClass(confidence: number) {
//   if (confidence >= 85) {
//     return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
//   }

//   if (confidence >= 70) {
//     return "bg-amber-500/15 text-amber-600 dark:text-amber-400";
//   }

//   return "bg-destructive/15 text-destructive";
// }

// type Phase = "idle" | "generating" | "done" | "error";

// interface ColumnMappingProps {
//   sessionId: string | null;
//   sourceMetadata?: unknown;
//   targetMetadata?: unknown;

//   /*
//    * Generation results live in the parent (ModernizeData) so
//    * they survive navigating away from this step and back.
//    * This component only holds transient in-flight UI state.
//    */
//   mappingResult: GenerateMappingResult | null;
//   previewRows: MappingRow[];
//   exported: boolean;

//   onMappingResultChange: (
//     result: GenerateMappingResult
//   ) => void;

//   onPreviewRowsChange: (
//     rows: MappingRow[]
//   ) => void;

//   onExportedChange: (
//     exported: boolean
//   ) => void;

//   onBack: () => void;
//   onNext: () => void;
// }

// export default function ColumnMapping({
//   sessionId,
//   mappingResult,
//   previewRows,
//   exported,
//   onMappingResultChange,
//   onPreviewRowsChange,
//   onExportedChange,
//   onBack,
//   onNext,
// }: ColumnMappingProps) {
//   const [phase, setPhase] = useState<Phase>(
//     mappingResult ? "done" : "idle"
//   );

//   const [error, setError] = useState<string | null>(null);

//   const [downloading, setDownloading] = useState(false);

//   const [downloadError, setDownloadError] =
//     useState<string | null>(null);

//   /*
//    * ---------------------------------------------------------------
//    * RESTORE MAPPING FROM BACKEND
//    * ---------------------------------------------------------------
//    *
//    * When the user refreshes the page or leaves Step 5 and comes
//    * back, fetch the latest mapping rows from the backend.
//    *
//    * IMPORTANT:
//    * Do NOT put onPreviewRowsChange in the dependency array.
//    *
//    * ModernizeData passes a callback that is recreated when the
//    * parent re-renders. Including that callback here would cause:
//    *
//    * GET -> set parent state -> parent re-render ->
//    * callback changes -> effect runs again -> GET -> ...
//    *
//    * sessionId is enough because ColumnMapping is mounted again
//    * whenever the user returns to Step 5.
//    * ---------------------------------------------------------------
//    */
//   useEffect(() => {
//     if (!sessionId) {
//       return;
//     }

//     let cancelled = false;

//     const restoreMapping = async () => {
//       try {
//         const rows = await fetchMappingRows(sessionId);

//         if (cancelled) {
//           return;
//         }

//         if (rows.length > 0) {
//           onPreviewRowsChange(rows.slice(0, 5));
//         }
//       } catch (err) {
//         if (!cancelled) {
//           console.error(
//             "Failed to restore mapping from backend:",
//             err
//           );
//         }
//       }
//     };

//     restoreMapping();

//     return () => {
//       cancelled = true;
//     };
//   }, [sessionId]);

//   /*
//    * ---------------------------------------------------------------
//    * GENERATE MAPPING
//    * ---------------------------------------------------------------
//    *
//    * POST generates the mapping.
//    * GET then retrieves the generated rows for the preview.
//    * ---------------------------------------------------------------
//    */
//   const handleGenerate = async () => {
//     if (!sessionId) {
//       return;
//     }

//     setPhase("generating");
//     setError(null);

//     try {
//       const result = await generateMapping(sessionId);

//       const rows = await fetchMappingRows(sessionId);

//       onMappingResultChange(result);

//       onPreviewRowsChange(
//         rows.slice(0, 5)
//       );

//       setPhase("done");
//     } catch (err) {
//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to generate mapping."
//       );

//       setPhase("error");
//     }
//   };

//   /*
//    * ---------------------------------------------------------------
//    * DOWNLOAD MAPPING CSV
//    * ---------------------------------------------------------------
//    */
//   const handleDownload = async () => {
//     if (!sessionId) {
//       return;
//     }

//     setDownloading(true);
//     setDownloadError(null);

//     try {
//       const blob = await downloadMappingCsv(sessionId);

//       triggerBlobDownload(
//         blob,
//         "mapping_review.csv"
//       );

//       onExportedChange(true);
//     } catch (err) {
//       setDownloadError(
//         err instanceof Error
//           ? err.message
//           : "Failed to download mapping CSV."
//       );
//     } finally {
//       setDownloading(false);
//     }
//   };

//   return (
//     <section>
//       <StepHeader
//         title="Automated Column Mapping"
//         desc="Veriton automatically compares source and UDM columns and recommends the best matches."
//       />

//       {phase === "idle" && (
//         <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
//           <button
//             type="button"
//             onClick={handleGenerate}
//             disabled={!sessionId}
//             className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             <Sparkles className="h-4 w-4" />
//             Generate mapping
//           </button>

//           {!sessionId && (
//             <p className="mt-3 text-xs text-muted-foreground">
//               Waiting for the migration session to be created...
//             </p>
//           )}
//         </div>
//       )}

//       {phase === "generating" && (
//         <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
//           <Loader2 className="h-8 w-8 animate-spin text-primary" />

//           <h3 className="mt-4 font-semibold text-foreground">
//             Generating the mapping...
//           </h3>

//           <p className="mt-1 text-sm text-muted-foreground">
//             Comparing every source column against the target UDM.
//             This usually takes a few seconds.
//           </p>
//         </div>
//       )}

//       {phase === "error" && (
//         <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-5 py-10 text-center">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
//             <AlertCircle className="h-7 w-7" />
//           </div>

//           <h3 className="mt-4 font-semibold text-foreground">
//             Couldn't generate the mapping
//           </h3>

//           <p className="mt-1 max-w-xs text-sm text-destructive">
//             {error}
//           </p>

//           <button
//             type="button"
//             onClick={handleGenerate}
//             className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
//           >
//             <Sparkles className="h-4 w-4" />
//             Try again
//           </button>
//         </div>
//       )}

//       {phase === "done" && mappingResult && (
//         <>
//           <div className="mb-6 grid gap-4 sm:grid-cols-3">
//             <Stat
//               value={String(mappingResult.row_count)}
//               label="Mapping rows generated"
//             />

//             <Stat
//               value={String(
//                 mappingResult.row_count -
//                   mappingResult.low_confidence_count
//               )}
//               label="High-confidence matches"
//             />

//             <Stat
//               value={String(
//                 mappingResult.low_confidence_count
//               )}
//               label="Need attention (<70)"
//             />
//           </div>

//           <p className="mb-3 text-xs font-medium text-muted-foreground">
//             Preview — first {previewRows.length} of{" "}
//             {mappingResult.row_count} rows
//           </p>

//           <div className="overflow-x-auto rounded-2xl border border-border bg-card">
//             <table className="w-full min-w-[1080px] text-left text-sm">
//               <thead>
//                 <tr className="border-b border-border font-semibold text-foreground">
//                   <th className="px-6 py-4">
//                     Source Column
//                   </th>

//                   <th className="px-6 py-4">
//                     Source Type
//                   </th>

//                   <th className="px-6 py-4">
//                     Recommended Target
//                   </th>

//                   <th className="px-6 py-4">
//                     Target Type
//                   </th>

//                   <th className="px-6 py-4">
//                     Conf.
//                   </th>

//                   <th className="px-6 py-4">
//                     Reviewer Decision
//                   </th>

//                   <th className="px-6 py-4">
//                     Reasoning
//                   </th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {previewRows.map((row) => (
//                   <tr
//                     key={row.index}
//                     className="border-b border-border last:border-0"
//                   >
//                     <td className="px-6 py-4 font-medium text-foreground">
//                       {shortSource(row)}
//                     </td>

//                     <td className="px-6 py-4 text-muted-foreground">
//                       {row.source_data_type || "—"}
//                     </td>

//                     <td className="px-6 py-4 text-primary">
//                       {shortTarget(row)}
//                     </td>

//                     <td className="px-6 py-4 text-muted-foreground">
//                       {row.target_data_type || "—"}
//                     </td>

//                     <td className="px-6 py-4">
//                       <span
//                         className={`rounded-md px-2.5 py-1 text-xs font-semibold ${confClass(
//                           row.confidence_score
//                         )}`}
//                       >
//                         {row.confidence_score}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4 text-muted-foreground">
//                       {row.reviewer_decision || "—"}
//                     </td>

//                     <td
//                       className="max-w-xs truncate px-6 py-4 text-muted-foreground"
//                       title={row.reasoning}
//                     >
//                       {row.reasoning}
//                     </td>
//                   </tr>
//                 ))}

//                 {previewRows.length === 0 && (
//                   <tr>
//                     <td
//                       colSpan={7}
//                       className="px-6 py-8 text-center text-sm text-muted-foreground"
//                     >
//                       No mapping rows returned.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <button
//             type="button"
//             onClick={handleDownload}
//             disabled={downloading}
//             className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
//           >
//             {downloading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Download className="h-4 w-4" />
//             )}

//             {downloading
//               ? "Downloading..."
//               : "Download mapping as CSV"}
//           </button>

//           {downloadError && (
//             <p className="mt-3 flex items-center gap-2 text-sm text-destructive">
//               <AlertCircle className="h-4 w-4" />
//               {downloadError}
//             </p>
//           )}

//           {exported && !downloadError && (
//             <p className="mt-3 flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
//               <CheckCircle2 className="h-4 w-4" />
//               mapping_review.csv downloaded — nothing has been
//               applied to any data yet.
//             </p>
//           )}
//         </>
//       )}

//       <Footer
//         onBack={onBack}
//         onNext={onNext}
//         disabled={!exported}
//         nextLabel="Send for business review"
//       />
//     </section>
//   );
// }

import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Download,
  Loader2,
  RefreshCw,
  Sparkles,
  X,
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
 * Returns every generated mapping row as JSON. We keep the full
 * set locally (for the attention-needed drawer) and surface just
 * the first 5 as the "preview" that persists on the parent.
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
 * Backend-process steps + simulated progress for the generating
 * state.
 *
 * The API is a single request/response with no streamed progress,
 * so we simulate a percentage timed to how long this step
 * typically takes (2-3 minutes) using an ease-out curve: it climbs
 * quickly at first and then slows down, capping at 95% so it never
 * looks "done" before the response actually arrives. The step
 * indicator is driven directly off that same percentage, so the
 * bar and the steps always agree with each other (matches the
 * pattern used on the Run Migration step).
 *
 * `label` is the short word shown under each step circle; `detail`
 * is the fuller sentence shown as the current status line.
 * ---------------------------------------------------------------
 */
const GENERATION_STEPS = [
  {
    label: "Scanning",
    detail: "Reading source schema metadata",
  },
  {
    label: "Comparing",
    detail: "Comparing source columns against the target UDM",
  },
  {
    label: "Scoring",
    detail: "Scoring confidence for each candidate mapping",
  },
  {
    label: "Resolving",
    detail: "Resolving foreign-key and lookup relationships",
  },
  {
    label: "Finalizing",
    detail: "Writing mapping_review.csv",
  },
];

// Typical generation time — used only to pace the simulated bar.
// Tuned to the real ~1.5–2 minute typical run so the bar feels
// responsive early on; it still eases toward the cap rather than
// hitting it, so longer-than-usual runs don't look "stuck" at 95%
// for too long, but never look "done" before the response arrives.
const ESTIMATED_DURATION_MS = 70000; // ~70s — climbs fast, then eases toward the cap
const SIMULATED_CAP = 95;

// ---------- mapping card (used only in the attention drawer) ----------

function MappingCard({ row }: { row: MappingRow }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Source
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {shortSource(row)}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.source_data_type || "—"}
          </p>
        </div>

        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />

        <div className="min-w-0 text-right">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Target
          </p>
          <p className="truncate text-sm font-semibold text-primary">
            {shortTarget(row)}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.target_data_type || "—"}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-md px-2 py-0.5 text-xs font-semibold ${confClass(
            row.confidence_score
          )}`}
        >
          {row.confidence_score}% confidence
        </span>

        {row.reviewer_decision && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {row.reviewer_decision}
          </span>
        )}
      </div>

      {row.reasoning && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {row.reasoning}
        </p>
      )}
    </div>
  );
}

// ---------- attention-needed panel ----------

function AttentionModal({
  mappings,
  onClose,
}: {
  mappings: MappingRow[];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="font-semibold text-foreground">
              Columns needing attention
            </h3>
            <p className="text-xs text-muted-foreground">
              {mappings.length} mapping{mappings.length === 1 ? "" : "s"}{" "}
              scored below 70% confidence
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {mappings.map((row) => (
            <MappingCard key={row.index} row={row} />
          ))}

          {mappings.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No low-confidence mappings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- row detail modal (opened by clicking any preview row) ----------

function RowDetailModal({
  row,
  onClose,
}: {
  row: MappingRow;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">
              Mapping details
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {shortSource(row)} → {shortTarget(row)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="ml-4 shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
          {/* Source / Target */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Source
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {shortSource(row)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.source_system || "—"} · {row.source_schema || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.source_data_type || "—"}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Target
              </p>
              <p className="mt-1 text-sm font-semibold text-primary">
                {shortTarget(row)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {row.target_fact_or_dim || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                {row.target_data_type || "—"}
              </p>
            </div>
          </div>

          {/* Confidence + reviewer decision */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-md px-2.5 py-1 text-xs font-semibold ${confClass(
                row.confidence_score
              )}`}
            >
              {row.confidence_score}% confidence
            </span>

            {row.reviewer_decision && (
              <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                {row.reviewer_decision}
              </span>
            )}
          </div>

          {/* Full reasoning — never truncated here */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Reasoning
            </p>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground">
              {row.reasoning || "—"}
            </p>
          </div>

          {/* Alternate candidates */}
          {row.alternate_candidates && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Alternate candidates
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {row.alternate_candidates}
              </p>
            </div>
          )}

          {/* Reviewer override + comment */}
          {(row.reviewer_override_table ||
            row.reviewer_override_column ||
            row.reviewer_comment) && (
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Reviewer override
              </p>

              {(row.reviewer_override_table ||
                row.reviewer_override_column) && (
                <p className="mt-1 text-sm text-foreground">
                  {row.reviewer_override_table || "—"}.
                  {row.reviewer_override_column || "—"}
                </p>
              )}

              {row.reviewer_comment && (
                <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                  {row.reviewer_comment}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

  // Full mapping set, kept locally only — powers the "needs
  // attention" drawer without changing what the parent persists
  // (it still only keeps the 5-row preview).
  const [allMappings, setAllMappings] = useState<MappingRow[]>([]);

  const [showAttentionModal, setShowAttentionModal] =
    useState(false);

  const [selectedRow, setSelectedRow] = useState<MappingRow | null>(
    null
  );

  // Simulated progress while generating. The step checklist is
  // derived from this same value, so they can never disagree.
  const [progress, setProgress] = useState(0);
  const generationStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "generating") {
      return;
    }

    generationStartRef.current = Date.now();
    setProgress(0);

    const progressTimer = setInterval(() => {
      const startedAt = generationStartRef.current ?? Date.now();
      const elapsed = Date.now() - startedAt;

      // Ease-out curve toward the cap — fast at first, slows down,
      // never quite reaches 100% on its own.
      const simulated =
        SIMULATED_CAP *
        (1 - Math.exp(-elapsed / ESTIMATED_DURATION_MS));

      setProgress(simulated);
    }, 250);

    return () => clearInterval(progressTimer);
  }, [phase]);

  const activeStepIndex = Math.min(
    GENERATION_STEPS.length - 1,
    Math.floor((progress / 100) * GENERATION_STEPS.length)
  );

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
          setAllMappings(rows);
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
   *
   * Also used for "Re-run mapping" — same flow, triggered again.
   * ---------------------------------------------------------------
   */
  const handleGenerate = async () => {
    if (!sessionId) {
      return;
    }

    setPhase("generating");
    setError(null);

    try {
      const result = await generateMapping(sessionId);

      const rows = await fetchMappingRows(sessionId);

      onMappingResultChange(result);

      setAllMappings(rows);
      onPreviewRowsChange(rows.slice(0, 5));

      // Snap the bar to 100% so the user sees it complete, then
      // reveal the results a moment later.
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 450));

      setPhase("done");
    } catch (err) {
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

  const attentionMappings = allMappings.filter(
    (row) => row.confidence_score < 70
  );

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <StepHeader
          title="Automated Column Mapping"
          desc="Veriton automatically compares source and UDM columns and recommends the best matches."
        />

        {mappingResult && (
          <button
            type="button"
            onClick={handleGenerate}
            disabled={phase === "generating"}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-primary px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-5 w-5 ${
                phase === "generating" ? "animate-spin" : ""
              }`}
            />
            Re-run mapping
          </button>
        )}
      </div>

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

      {/* Generating — step indicator + single progress bar + status line */}
      {phase === "generating" && (
        <div className="rounded-2xl border border-border bg-card px-8 py-8">
          {/* Step circles with labels underneath */}
          <div className="flex items-start justify-between">
            {GENERATION_STEPS.map((step, index) => {
              const isDone =
                index < activeStepIndex || progress >= 100;
              const isActive =
                index === activeStepIndex && progress < 100;

              return (
                <div
                  key={step.label}
                  className="flex flex-1 flex-col items-center"
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      isDone
                        ? "bg-primary text-primary-foreground"
                        : isActive
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/25"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isDone ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>

                  <span
                    className={`mt-2 text-xs font-medium ${
                      isDone || isActive
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Single continuous progress bar */}
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Current status + percentage */}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
              <span key={activeStepIndex}>
                {GENERATION_STEPS[activeStepIndex].detail}...
              </span>
            </div>

            <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Typically takes 1.5–2 minutes, occasionally longer
            depending on schema size.
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
              label="Columns mapped"
            />

            <Stat
              value={String(
                mappingResult.row_count -
                  mappingResult.low_confidence_count
              )}
              label="High-confidence matches"
            />

            <button
              type="button"
              onClick={() => setShowAttentionModal(true)}
              className="rounded-2xl text-left transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Stat
                value={String(
                  mappingResult.low_confidence_count
                )}
                label="Need attention (<70) — click to review"
              />
            </button>
          </div>

          <p className="mb-3 text-xs font-medium text-muted-foreground">
            Preview — first {previewRows.length} of{" "}
            {mappingResult.row_count} mapped columns
          </p>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[1200px] text-left text-sm">
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
                    onClick={() => setSelectedRow(row)}
                    className="cursor-pointer border-b border-border align-top transition-colors last:border-0 hover:bg-accent/50"
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

                    <td className="max-w-xs px-6 py-4 text-muted-foreground">
                      <span
                        className="block truncate"
                        title={row.reasoning}
                      >
                        {row.reasoning}
                      </span>
                    </td>
                  </tr>
                ))}

                {previewRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-sm text-muted-foreground"
                    >
                      No mapped columns returned.
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

          {showAttentionModal && (
            <AttentionModal
              mappings={attentionMappings}
              onClose={() => setShowAttentionModal(false)}
            />
          )}

          {selectedRow && (
            <RowDetailModal
              row={selectedRow}
              onClose={() => setSelectedRow(null)}
            />
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
