import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Play,
  AlertCircle,
} from "lucide-react";

import {
  Footer,
  Stat,
  StepHeader,
} from "./ModernizeShared";

interface RunMigrationProps {
  sessionId: string | null;
  onBack: () => void;
  onNext: () => void;
}

interface MigrationJob {
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

interface MigrationTotals {
  jobs: number;
  rows_written: number;
  rows_failed: number;
  excluded_rows: number;
}

interface MigrationResponse {
  mode: string;
  jobs: MigrationJob[];
  totals: MigrationTotals;
  run_report: string;
  lineage_csv: string;
}

export default function RunMigration({
  sessionId,
  onBack,
  onNext,
}: RunMigrationProps) {
  const [state, setState] = useState<
    "idle" | "running" | "done"
  >("idle");

  const [result, setResult] =
    useState<MigrationResponse | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const run = async () => {
    if (!sessionId) {
      setError(
        "Session ID is missing. Please complete the previous steps first."
      );
      return;
    }

    try {
      setState("running");
      setError(null);
      setResult(null);

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

      setResult(data);
      setState("done");

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

      setState("idle");
    }
  };

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

      {/* Run migration */}
      {state !== "done" && (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground">
              Ready to run migration
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              The validated mapping will be used to generate the migration
              jobs and write the transformed data into the target UDM.
            </p>

            <button
              type="button"
              onClick={run}
              disabled={
                state === "running" ||
                !sessionId
              }
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === "running" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Migrating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run migration
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Migration completed */}
      {state === "done" && result && (
        <>
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-6">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-6 w-6" />

              <span className="text-lg font-semibold">
                Migration completed
              </span>
            </div>

            <p className="mt-2 text-sm text-muted-foreground">
              The migration jobs have finished and the execution results
              have been captured for audit and lineage.
            </p>
          </div>

          {/* Migration statistics */}
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <Stat
              value={String(result.totals.jobs)}
              label="Migration jobs"
            />

            <Stat
              value={result.totals.rows_written.toLocaleString()}
              label="Rows migrated"
            />

            <Stat
              value={result.totals.rows_failed.toLocaleString()}
              label="Rows failed"
            />

            <Stat
              value={result.totals.excluded_rows.toLocaleString()}
              label="Rows excluded"
            />
          </div>

          {/* Job results */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-foreground">
              Migration jobs
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Results for each generated migration job.
            </p>

            <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-5 py-4 font-semibold text-foreground">
                      Source
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Target
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Status
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Rows Read
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Rows Written
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Rows Failed
                    </th>

                    <th className="px-5 py-4 font-semibold text-foreground">
                      Error
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {result.jobs.map((job, index) => {
                    const success =
                      job.status === "success";

                    return (
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
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                              success
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : "bg-destructive/15 text-destructive"
                            }`}
                          >
                            {success && (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}

                            {job.status}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-foreground">
                          {job.rows_read.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-foreground">
                          {job.rows_written.toLocaleString()}
                        </td>

                        <td className="px-5 py-4 text-foreground">
                          {job.rows_failed.toLocaleString()}
                        </td>

                        <td className="max-w-[350px] px-5 py-4 text-sm text-muted-foreground">
                          {job.error_message || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      <Footer
    onBack={onBack}
    onNext={onNext}
    disabled={state !== "done"}
    nextLabel="Validate Migration"
  />
  

 
    </section>
  );
}

