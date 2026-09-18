import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  Loader2,
  Play,
  X,
} from "lucide-react";

import { Footer, StepHeader } from "./ModernizeShared";

export interface MigrationJob {
  source_table: string;
  target_table: string;
  status: "success" | "failed" | string;
  rows_read: number;
  rows_written: number;
  rows_failed: number;
  error_message: string | null;
  generated_code_path: string;
  code_explanation: string;
  columns_populated: string[];
}

export interface MigrationTotals {
  jobs: number;
  rows_written: number;
  rows_failed: number;
  excluded_rows: number;
}

export interface MigrationResponse {
  mode: string;
  jobs: MigrationJob[];
  totals: MigrationTotals;
  run_report: string;
  lineage_csv: string;
}

interface RunMigrationProps {
  sessionId: string | null;

  /*
   * The migration result lives in the parent (ModernizeData) so it
   * survives a page refresh or navigating away from this step and
   * back. This component only holds transient in-flight UI state
   * (whether a run is currently in progress, and its error/progress).
   */
  result: MigrationResponse | null;
  onResultChange: (result: MigrationResponse | null) => void;

  onBack: () => void;
  onNext: () => void;
}

type Phase = "idle" | "running" | "done";

/*
 * ---------------------------------------------------------------
 * Backend-process steps + simulated progress.
 *
 * The migration endpoint is a single request/response with no
 * streamed progress, so we simulate a percentage timed to how
 * long this step typically takes (1-2 minutes), advancing at a
 * steady linear pace and capping short of 100% so it never looks
 * "done" before the response actually arrives. The step indicator
 * is driven directly off that same percentage, so the bar and the
 * steps always agree with each other.
 *
 * `label` is the short word shown under each step circle; `detail`
 * is the fuller sentence shown as the current status line.
 * ---------------------------------------------------------------
 */
const MIGRATION_STEPS = [
  {
    label: "Initializing",
    detail: "Reading the approved mapping and reviewer changes",
  },
  {
    label: "Generating",
    detail: "Generating migration code for each table",
  },
  {
    label: "Migrating",
    detail: "Executing batch writes to the target UDM",
  },
  {
    label: "Finalizing",
    detail: "Writing the run report and lineage file",
  },
];

// Typical run time — used only to pace the simulated bar.
const ESTIMATED_DURATION_MS = 90000; // ~1.5 minutes
const SIMULATED_CAP = 95;

// ---------- columns-populated modal (handles jobs with 100s of columns) ----------

function ColumnsModal({
  job,
  onClose,
}: {
  job: MigrationJob;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[80vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground">
              Columns populated
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              {job.target_table} · {job.columns_populated.length}{" "}
              column{job.columns_populated.length === 1 ? "" : "s"}
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

        <div className="flex-1 overflow-y-auto px-6 py-2">
          <ul className="divide-y divide-border">
            {job.columns_populated.map((col, i) => (
              <li
                key={`${col}-${i}`}
                className="py-2 text-sm font-medium text-foreground"
              >
                {col}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function RunMigration({
  sessionId,
  result,
  onResultChange,
  onBack,
  onNext,
}: RunMigrationProps) {
  const [phase, setPhase] = useState<Phase>(
    result ? "done" : "idle"
  );

  const [error, setError] =
    useState<string | null>(null);

  const [columnsModalJob, setColumnsModalJob] =
    useState<MigrationJob | null>(null);

  // Simulated progress while running. The step checklist is
  // derived from this same value, so they can never disagree.
  const [progress, setProgress] = useState(0);
  const runStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "running") {
      return;
    }

    runStartRef.current = Date.now();
    setProgress(0);

    const progressTimer = setInterval(() => {
      const startedAt = runStartRef.current ?? Date.now();
      const elapsed = Date.now() - startedAt;

      // Steady, linear pace toward the cap so the bar — and the
      // checklist derived from it — reliably works through every
      // step over the estimated duration, rather than racing
      // ahead early and then appearing to stall.
      const simulated = Math.min(
        SIMULATED_CAP,
        (elapsed / ESTIMATED_DURATION_MS) * SIMULATED_CAP
      );

      setProgress(simulated);
    }, 250);

    return () => clearInterval(progressTimer);
  }, [phase]);

  const activeStepIndex = Math.min(
    MIGRATION_STEPS.length - 1,
    Math.floor((progress / 100) * MIGRATION_STEPS.length)
  );

  const run = async () => {
    if (!sessionId) {
      setError(
        "Session ID is missing. Please complete the previous steps first."
      );
      return;
    }

    try {
      setPhase("running");
      setError(null);
      onResultChange(null);

      const response = await fetch(
        `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/step5-migrate`,
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dry_run: false,
            batch_size: 5000,
            max_row_error_rate: 0.05,
          }),
        }
      );

      let data: MigrationResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The migration API returned an invalid response."
        );
      }

      if (!response.ok) {
        throw new Error(
          "Failed to execute the migration."
        );
      }

      // Snap the bar/checklist to fully complete, then reveal the
      // results a moment later.
      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 450));

      onResultChange(data);
      setPhase("done");

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Migration completed",
            description:
              "The migration has finished successfully.",
          },
        })
      );
    } catch (err) {
      console.error(
        "Migration failed:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to execute the migration."
      );

      setPhase("idle");

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Migration failed",
            description:
              err instanceof Error
                ? err.message
                : "Failed to execute the migration.",
          },
        })
      );
    }
  };

  const successfulJobs =
    result?.jobs.filter((job) => job.status === "success") ?? [];

  const failedJobs =
    result?.jobs.filter((job) => job.status !== "success") ?? [];

  return (
    <section>
      <StepHeader
        title="Generate & Execute Migration"
        desc="The approved mapping and reviewer changes are used to generate and execute the migration directly against your UDM."
      />

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div>{error}</div>
        </div>
      )}

      {/* Ready to run */}
      {phase === "idle" && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground">
              Ready to run migration
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The validated mapping will be used to generate migration
              code and write the transformed data into the target UDM.
            </p>

            <button
              type="button"
              onClick={run}
              disabled={!sessionId}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Play className="h-4 w-4" />
              Run migration
            </button>
          </div>
        </div>
      )}

      {/* Running — step indicator + single progress bar + status line */}
      {phase === "running" && (
        <div className="rounded-2xl border border-border bg-card px-8 py-8">
          {/* Step circles with labels underneath */}
          <div className="flex items-start justify-between">
            {MIGRATION_STEPS.map((step, index) => {
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
                {MIGRATION_STEPS[activeStepIndex].detail}...
              </span>
            </div>

            <span className="shrink-0 text-sm font-semibold text-primary tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            Please wait — this may take a couple of minutes depending on
            data volume.
          </p>
        </div>
      )}

      {/* Migration completed — tables only, no stat cards or dialog;
          completion is communicated via the toast that already
          fired in `run()`. */}
      {phase === "done" && result && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {successfulJobs.length} of {result.jobs.length} tables
              migrated successfully.
            </p>

            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
            >
              <Play className="h-4 w-4" />
              Run again
            </button>
          </div>

          {/* Migrated tables */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-foreground">
              Migrated Tables
            </h2>

            <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 font-semibold text-foreground">
                      Source Table
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Target Table
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Columns Populated
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {successfulJobs.map((job, index) => (
                    <tr
                      key={`${job.source_table}-${job.target_table}-${index}`}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-5 py-4 font-medium text-foreground">
                        {job.source_table}
                      </td>

                      <td className="px-5 py-4 text-primary">
                        {job.target_table}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setColumnsModalJob(job)}
                          title="View columns populated"
                          aria-label={`View ${job.columns_populated.length} columns populated`}
                          className="inline-flex items-center justify-center rounded-md bg-muted p-2 text-foreground transition-colors hover:bg-accent"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {successfulJobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-5 py-8 text-center text-sm text-muted-foreground"
                      >
                        No tables were migrated successfully.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Failed migrations — only rendered when something failed */}
          {failedJobs.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-foreground">
                Failed Migrations
              </h2>

              <div className="mt-3 overflow-x-auto rounded-2xl border border-border bg-card">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-4 font-semibold text-foreground">
                        Source Table
                      </th>

                      <th className="px-5 py-4 font-semibold text-foreground">
                        Target Table
                      </th>

                      <th className="px-5 py-4 font-semibold text-foreground">
                        Error Message
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {failedJobs.map((job, index) => (
                      <tr
                        key={`${job.source_table}-${job.target_table}-${index}`}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-5 py-4 font-medium text-foreground">
                          {job.source_table}
                        </td>

                        <td className="px-5 py-4 text-primary">
                          {job.target_table}
                        </td>

                        <td className="max-w-md px-5 py-4 text-muted-foreground">
                          <div className="max-h-24 overflow-y-auto whitespace-normal break-words pr-2 leading-relaxed">
                            {job.error_message || "—"}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {columnsModalJob && (
            <ColumnsModal
              job={columnsModalJob}
              onClose={() => setColumnsModalJob(null)}
            />
          )}
        </>
      )}

      <Footer
        onBack={onBack}
        onNext={onNext}
        disabled={phase !== "done"}
        nextLabel="Validate Migration"
      />
    </section>
  );
}
