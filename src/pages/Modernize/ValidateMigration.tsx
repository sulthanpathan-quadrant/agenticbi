// // // import { useState } from "react";
// // // import {
// // //   CheckCircle2,
// // //   Loader2,
// // //   Play,
// // //   AlertCircle,
// // //   XCircle,
// // // } from "lucide-react";

// // // import {
// // //   Footer,
// // //   Stat,
// // //   StepHeader,
// // // } from "./ModernizeShared";

// // // interface ValidateMigrationProps {
// // //   sessionId: string | null;
// // //   onBack: () => void;
// // //   onDone: () => void;
// // // }

// // // interface ValidationCheckResult {
// // //   name: string;
// // //   source_query: string;
// // //   target_query: string;
// // //   source_value: string | null;
// // //   target_value: string | null;
// // //   match: boolean;
// // //   error: string | null;
// // // }

// // // interface ValidateDataResponse {
// // //   results: ValidationCheckResult[];
// // //   total_checks: number;
// // //   passed: number;
// // //   failed: number;
// // // }

// // // export default function ValidateMigration({
// // //   sessionId,
// // //   onBack,
// // //   onDone,
// // // }: ValidateMigrationProps) {
// // //   const [state, setState] = useState<"idle" | "running" | "done">("idle");

// // //   const [result, setResult] =
// // //     useState<ValidateDataResponse | null>(null);

// // //   const [error, setError] =
// // //     useState<string | null>(null);

// // //   const run = async () => {
// // //     if (!sessionId) {
// // //       setError(
// // //         "Session ID is missing. Please complete the previous steps first."
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       setState("running");
// // //       setError(null);
// // //       setResult(null);

// // //       const response = await fetch(
// // //         `http://127.0.0.1:8000/sessions/${sessionId}/validate-data`,
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             accept: "application/json",
// // //             "Content-Type": "application/json",
// // //           },
// // //           body: JSON.stringify({}),
// // //         }
// // //       );

// // //       let data: ValidateDataResponse;

// // //       try {
// // //         data = await response.json();
// // //       } catch {
// // //         throw new Error(
// // //           "The validation API returned an invalid response."
// // //         );
// // //       }

// // //       if (!response.ok) {
// // //         throw new Error("Failed to run validation.");
// // //       }

// // //       setResult(data);
// // //       setState("done");

// // //       window.dispatchEvent(
// // //         new CustomEvent("toast", {
// // //           detail: {
// // //             title:
// // //               data.failed === 0
// // //                 ? "Validation passed"
// // //                 : "Validation completed with mismatches",
// // //             description: `${data.passed}/${data.total_checks} checks passed.`,
// // //           },
// // //         })
// // //       );

// // //       onDone();
// // //     } catch (err) {
// // //       console.error("Validation failed:", err);

// // //       setError(
// // //         err instanceof Error
// // //           ? err.message
// // //           : "Failed to run validation."
// // //       );

// // //       setState("idle");
// // //     }
// // //   };

// // //   return (
// // //     <section>
// // //       <StepHeader
// // //         title="Validate Migration"
// // //         desc="Run source-vs-target reconciliation queries to confirm the migrated data matches the original."
// // //       />

// // //       {error && (
// // //         <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
// // //           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
// // //           <div>{error}</div>
// // //         </div>
// // //       )}

// // //       {state !== "done" && (
// // //         <div className="rounded-2xl border border-border bg-card p-8 text-center">
// // //           <div className="mx-auto max-w-2xl">
// // //             <h2 className="text-xl font-semibold text-foreground">
// // //               Ready to validate
// // //             </h2>

// // //             <p className="mt-2 text-sm leading-6 text-muted-foreground">
// // //               This runs a set of reconciliation queries against both the
// // //               source and target systems and compares the results.
// // //             </p>

// // //             <button
// // //               type="button"
// // //               onClick={run}
// // //               disabled={state === "running" || !sessionId}
// // //               className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
// // //             >
// // //               {state === "running" ? (
// // //                 <>
// // //                   <Loader2 className="h-4 w-4 animate-spin" />
// // //                   Validating...
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <Play className="h-4 w-4" />
// // //                   Run validation
// // //                 </>
// // //               )}
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {state === "done" && result && (
// // //         <>
// // //           <div
// // //             className={`rounded-2xl border p-6 ${
// // //               result.failed === 0
// // //                 ? "border-emerald-500/40 bg-emerald-500/10"
// // //                 : "border-amber-500/40 bg-amber-500/10"
// // //             }`}
// // //           >
// // //             <div
// // //               className={`flex items-center gap-3 ${
// // //                 result.failed === 0
// // //                   ? "text-emerald-600 dark:text-emerald-400"
// // //                   : "text-amber-600 dark:text-amber-400"
// // //               }`}
// // //             >
// // //               {result.failed === 0 ? (
// // //                 <CheckCircle2 className="h-6 w-6" />
// // //               ) : (
// // //                 <AlertCircle className="h-6 w-6" />
// // //               )}

// // //               <span className="text-lg font-semibold">
// // //                 {result.failed === 0
// // //                   ? "All checks passed"
// // //                   : `${result.failed} check(s) failed`}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           <div className="mt-6 grid gap-4 sm:grid-cols-3">
// // //             <Stat value={String(result.total_checks)} label="Total checks" />
// // //             <Stat value={String(result.passed)} label="Passed" />
// // //             <Stat value={String(result.failed)} label="Failed" />
// // //           </div>

// // //           <div className="mt-8">
// // //             <h2 className="text-lg font-semibold text-foreground">
// // //               Check results
// // //             </h2>

// // //             <div className="mt-4 overflow-x-auto rounded-2xl border border-border bg-card">
// // //               <table className="w-full min-w-[900px] text-left text-sm">
// // //                 <thead>
// // //                   <tr className="border-b border-border">
// // //                     <th className="px-5 py-4 font-semibold text-foreground">Check</th>
// // //                     <th className="px-5 py-4 font-semibold text-foreground">Source value</th>
// // //                     <th className="px-5 py-4 font-semibold text-foreground">Target value</th>
// // //                     <th className="px-5 py-4 font-semibold text-foreground">Result</th>
// // //                   </tr>
// // //                 </thead>

// // //                 <tbody>
// // //                   {result.results.map((check, index) => (
// // //                     <tr
// // //                       key={`${check.name}-${index}`}
// // //                       className="border-b border-border last:border-0"
// // //                     >
// // //                       <td className="px-5 py-4 font-medium text-foreground">
// // //                         {check.name}
// // //                       </td>

// // //                       <td className="px-5 py-4 text-foreground">
// // //                         {check.source_value ?? "—"}
// // //                       </td>

// // //                       <td className="px-5 py-4 text-foreground">
// // //                         {check.target_value ?? "—"}
// // //                       </td>

// // //                       <td className="px-5 py-4">
// // //                         <span
// // //                           className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
// // //                             check.match
// // //                               ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
// // //                               : "bg-destructive/15 text-destructive"
// // //                           }`}
// // //                         >
// // //                           {check.match ? (
// // //                             <CheckCircle2 className="h-3.5 w-3.5" />
// // //                           ) : (
// // //                             <XCircle className="h-3.5 w-3.5" />
// // //                           )}
// // //                           {check.match ? "Match" : "Mismatch"}
// // //                         </span>
// // //                       </td>
// // //                     </tr>
// // //                   ))}
// // //                 </tbody>
// // //               </table>
// // //             </div>
// // //           </div>
// // //         </>
// // //       )}

// // //       <Footer onBack={onBack} />
// // //     </section>
// // //   );
// // // }


// // // import { useState } from "react";
// // // import {
// // //   CheckCircle2,
// // //   Loader2,
// // //   Play,
// // //   AlertCircle,
// // //   XCircle,
// // // } from "lucide-react";

// // // import { Footer, StepHeader } from "./ModernizeShared";
// // // import type { ConnectionValues } from "./ModernizeShared";

// // // interface ValidateMigrationProps {
// // //   sourceConfig: ConnectionValues | null;
// // //   targetConfig: ConnectionValues | null;
// // //   onBack: () => void;
// // //   onDone: () => void;
// // // }

// // // interface QueryResult {
// // //   columns: string[];
// // //   rows: (string | null)[][];
// // //   row_count: number;
// // // }

// // // const DEFAULT_SOURCE_QUERY =
// // //   "SELECT COUNT(*) AS row_count FROM dbo.PRODRUN_TXN;";
// // // const DEFAULT_TARGET_QUERY =
// // //   "SELECT COUNT(*) AS row_count FROM FACT_PRODUCTION_OUTPUT;";

// // // export default function ValidateMigration({
// // //   sourceConfig,
// // //   targetConfig,
// // //   onBack,
// // //   onDone,
// // // }: ValidateMigrationProps) {
// // //   const [sourceQuery, setSourceQuery] = useState(DEFAULT_SOURCE_QUERY);
// // //   const [targetQuery, setTargetQuery] = useState(DEFAULT_TARGET_QUERY);

// // //   const [state, setState] = useState<"idle" | "running" | "done">("idle");
// // //   const [sourceResult, setSourceResult] = useState<QueryResult | null>(null);
// // //   const [targetResult, setTargetResult] = useState<QueryResult | null>(null);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const run = async () => {
// // //     if (!sourceConfig || !targetConfig) {
// // //       setError("Source or target connection is missing. Complete the earlier steps first.");
// // //       return;
// // //     }

// // //     try {
// // //       setState("running");
// // //       setError(null);
// // //       setSourceResult(null);
// // //       setTargetResult(null);

// // //       const [sourceRes, targetRes] = await Promise.all([
// // //         fetch("http://127.0.0.1:8000/run-query-sql", {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ ...sourceConfig, query: sourceQuery }),
// // //         }),
// // //         fetch("http://127.0.0.1:8000/run-query-snowflake", {
// // //           method: "POST",
// // //           headers: { "Content-Type": "application/json" },
// // //           body: JSON.stringify({ ...targetConfig, query: targetQuery }),
// // //         }),
// // //       ]);

// // //       if (!sourceRes.ok) {
// // //         const detail = await sourceRes.json().catch(() => null);
// // //         throw new Error(detail?.detail || "Source query failed.");
// // //       }
// // //       if (!targetRes.ok) {
// // //         const detail = await targetRes.json().catch(() => null);
// // //         throw new Error(detail?.detail || "Target query failed.");
// // //       }

// // //       setSourceResult(await sourceRes.json());
// // //       setTargetResult(await targetRes.json());
// // //       setState("done");
// // //       onDone();
// // //     } catch (err) {
// // //       console.error("Validation failed:", err);
// // //       setError(err instanceof Error ? err.message : "Failed to run validation.");
// // //       setState("idle");
// // //     }
// // //   };

// // //   const isScalarMatch =
// // //     sourceResult &&
// // //     targetResult &&
// // //     sourceResult.rows.length === 1 &&
// // //     sourceResult.rows[0].length === 1 &&
// // //     targetResult.rows.length === 1 &&
// // //     targetResult.rows[0].length === 1
// // //       ? sourceResult.rows[0][0] === targetResult.rows[0][0]
// // //       : null;

// // //   const renderTable = (label: string, result: QueryResult | null) => (
// // //     <div className="flex-1 min-w-0">
// // //       <h3 className="text-sm font-semibold text-foreground mb-2">{label}</h3>
// // //       {result ? (
// // //         <div className="overflow-x-auto rounded-xl border border-border bg-card">
// // //           <table className="w-full text-left text-sm">
// // //             <thead>
// // //               <tr className="border-b border-border">
// // //                 {result.columns.map((c) => (
// // //                   <th key={c} className="px-4 py-2 font-semibold text-foreground">
// // //                     {c}
// // //                   </th>
// // //                 ))}
// // //               </tr>
// // //             </thead>
// // //             <tbody>
// // //               {result.rows.map((row, i) => (
// // //                 <tr key={i} className="border-b border-border last:border-0">
// // //                   {row.map((v, j) => (
// // //                     <td key={j} className="px-4 py-2 text-foreground">
// // //                       {v ?? "—"}
// // //                     </td>
// // //                   ))}
// // //                 </tr>
// // //               ))}
// // //             </tbody>
// // //           </table>
// // //         </div>
// // //       ) : (
// // //         <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
// // //           No result yet.
// // //         </div>
// // //       )}
// // //     </div>
// // //   );

// // //   return (
// // //     <section>
// // //       <StepHeader
// // //         title="Validate Migration"
// // //         desc="Run a query against the source and the equivalent query against the target, then compare the results."
// // //       />

// // //       {error && (
// // //         <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
// // //           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
// // //           <div>{error}</div>
// // //         </div>
// // //       )}

// // //       <div className="grid gap-4 sm:grid-cols-2">
// // //         <div>
// // //           <label className="text-sm font-semibold text-foreground">Source query (SQL Server)</label>
// // //           <textarea
// // //             value={sourceQuery}
// // //             onChange={(e) => setSourceQuery(e.target.value)}
// // //             rows={4}
// // //             className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
// // //           />
// // //         </div>
// // //         <div>
// // //           <label className="text-sm font-semibold text-foreground">Target query (Snowflake)</label>
// // //           <textarea
// // //             value={targetQuery}
// // //             onChange={(e) => setTargetQuery(e.target.value)}
// // //             rows={4}
// // //             className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
// // //           />
// // //         </div>
// // //       </div>

// // //       <div className="mt-4 text-center">
// // //         <button
// // //           type="button"
// // //           onClick={run}
// // //           disabled={state === "running"}
// // //           className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
// // //         >
// // //           {state === "running" ? (
// // //             <>
// // //               <Loader2 className="h-4 w-4 animate-spin" />
// // //               Running...
// // //             </>
// // //           ) : (
// // //             <>
// // //               <Play className="h-4 w-4" />
// // //               Run validation
// // //             </>
// // //           )}
// // //         </button>
// // //       </div>

// // //       {state === "done" && isScalarMatch !== null && (
// // //         <div
// // //           className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${
// // //             isScalarMatch
// // //               ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
// // //               : "border-destructive/30 bg-destructive/10 text-destructive"
// // //           }`}
// // //         >
// // //           {isScalarMatch ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
// // //           <span className="font-semibold">
// // //             {isScalarMatch ? "Values match" : "Values do not match"}
// // //           </span>
// // //         </div>
// // //       )}

// // //       {state === "done" && (
// // //         <div className="mt-6 flex flex-col gap-6 sm:flex-row">
// // //           {renderTable("Source result", sourceResult)}
// // //           {renderTable("Target result", targetResult)}
// // //         </div>
// // //       )}

// // //       <Footer onBack={onBack} />
// // //     </section>
// // //   );
// // // }


// // import { useState } from "react";
// // import {
// //   CheckCircle2,
// //   Loader2,
// //   Play,
// //   AlertCircle,
// //   XCircle,
// // } from "lucide-react";

// // import { Footer, StepHeader, type ConnectionValues } from "./ModernizeShared";

// // interface ValidateMigrationProps {
// //   sourceConfig: ConnectionValues | null;
// //   targetConfig: ConnectionValues | null;
// //   onBack: () => void;
// //   onDone: () => void;
// // }

// // interface QueryPair {
// //   label: string;
// //   sourceQuery: string;
// //   targetQuery: string;
// // }

// // const DEFAULT_CHECKS: QueryPair[] = [
// //   {
// //     label: "Row count",
// //     sourceQuery: "SELECT COUNT(*) AS row_count FROM dbo.PRODRUN_TXN;",
// //     targetQuery: "SELECT COUNT(*) AS row_count FROM FACT_PRODUCTION_OUTPUT;",
// //   },
// //   {
// //     label: "Null count — Manufacturer",
// //     sourceQuery: "SELECT COUNT(*) AS null_count FROM dbo.MACHINE_MST WHERE Manufacturer IS NULL;",
// //     targetQuery: "SELECT COUNT(*) AS null_count FROM DIM_MACHINE WHERE manufacturer IS NULL;",
// //   },
// //   {
// //     label: "Sum — QtyProduced",
// //     sourceQuery: "SELECT SUM(QtyProduced) AS total_qty_produced FROM dbo.PRODRUN_TXN;",
// //     targetQuery: "SELECT SUM(qty_produced) AS total_qty_produced FROM FACT_PRODUCTION_OUTPUT;",
// //   },
// //   {
// //     label: "Distinct machines",
// //     sourceQuery: "SELECT COUNT(DISTINCT MachineID) AS distinct_machines FROM dbo.PRODRUN_TXN;",
// //     targetQuery: "SELECT COUNT(DISTINCT machine_key) AS distinct_machines FROM FACT_PRODUCTION_OUTPUT;",
// //   },
// //   {
// //     label: "Average run time",
// //     sourceQuery: "SELECT AVG(RunTimeMin) AS avg_run_time_min FROM dbo.PRODRUN_TXN;",
// //     targetQuery: "SELECT AVG(run_time_minutes) AS avg_run_time_min FROM FACT_PRODUCTION_OUTPUT;",
// //   },
// // ];

// // function buildSqlServerBody(cfg: ConnectionValues, query: string) {
// //   return {
// //     server: cfg.host ?? cfg.server ?? "",
// //     database: cfg.database ?? "",
// //     username: cfg.username ?? "",
// //     password: cfg.password ?? "",
// //     query,
// //   };
// // }

// // function buildSnowflakeBody(cfg: ConnectionValues, query: string) {
// //   return {
// //     account: cfg.account ?? cfg.account_identifier ?? "",
// //     username: cfg.username ?? "",
// //     password: cfg.password ?? "",
// //     warehouse: cfg.warehouse ?? "",
// //     database: cfg.database ?? "",
// //     schema: cfg.schema ?? "",
// //     role: cfg.role ?? "ACCOUNTADMIN",
// //     query,
// //   };
// // }

// // export default function ValidateMigration({
// //   sourceConfig,
// //   targetConfig,
// //   onBack,
// //   onDone,
// // }: ValidateMigrationProps) {
// //   const [checks, setChecks] = useState<QueryPair[]>(DEFAULT_CHECKS);

// //   const [state, setState] = useState<"idle" | "running" | "done">("idle");
// //   const [sourceResult, setSourceResult] = useState<QueryResult | null>(null);
// //   const [targetResult, setTargetResult] = useState<QueryResult | null>(null);
// //   const [error, setError] = useState<string | null>(null);

// //   const run = async () => {
// //     if (!sourceConfig || !targetConfig) {
// //       setError("Source or target connection is missing. Complete the earlier steps first.");
// //       return;
// //     }

// //     try {
// //       setState("running");
// //       setError(null);
// //       setSourceResult(null);
// //       setTargetResult(null);

// //       const [sourceRes, targetRes] = await Promise.all([
// //         fetch("http://127.0.0.1:8000/run-query-sql", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(buildSqlServerBody(sourceConfig, sourceQuery)),
// //         }),
// //         fetch("http://127.0.0.1:8000/run-query-snowflake", {
// //           method: "POST",
// //           headers: { "Content-Type": "application/json" },
// //           body: JSON.stringify(buildSnowflakeBody(targetConfig, targetQuery)),
// //         }),
// //       ]);

// //       if (!sourceRes.ok) {
// //         const detail = await sourceRes.json().catch(() => null);
// //         throw new Error(detail?.detail || "Source query failed.");
// //       }
// //       if (!targetRes.ok) {
// //         const detail = await targetRes.json().catch(() => null);
// //         throw new Error(detail?.detail || "Target query failed.");
// //       }

// //       setSourceResult(await sourceRes.json());
// //       setTargetResult(await targetRes.json());
// //       setState("done");
// //       onDone();
// //     } catch (err) {
// //       console.error("Validation failed:", err);
// //       setError(err instanceof Error ? err.message : "Failed to run validation.");
// //       setState("idle");
// //     }
// //   };

// //   const isScalarMatch =
// //     sourceResult &&
// //     targetResult &&
// //     sourceResult.rows.length === 1 &&
// //     sourceResult.rows[0].length === 1 &&
// //     targetResult.rows.length === 1 &&
// //     targetResult.rows[0].length === 1
// //       ? sourceResult.rows[0][0] === targetResult.rows[0][0]
// //       : null;

// //   const renderTable = (label: string, result: QueryResult | null) => (
// //     <div className="flex-1 min-w-0">
// //       <h3 className="text-sm font-semibold text-foreground mb-2">{label}</h3>
// //       {result ? (
// //         <div className="overflow-x-auto rounded-xl border border-border bg-card">
// //           <table className="w-full text-left text-sm">
// //             <thead>
// //               <tr className="border-b border-border">
// //                 {result.columns.map((c) => (
// //                   <th key={c} className="px-4 py-2 font-semibold text-foreground">
// //                     {c}
// //                   </th>
// //                 ))}
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {result.rows.map((row, i) => (
// //                 <tr key={i} className="border-b border-border last:border-0">
// //                   {row.map((v, j) => (
// //                     <td key={j} className="px-4 py-2 text-foreground">
// //                       {v ?? "—"}
// //                     </td>
// //                   ))}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>
// //       ) : (
// //         <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
// //           No result yet.
// //         </div>
// //       )}
// //     </div>
// //   );

// //   return (
// //     <section>
// //       <StepHeader
// //         title="Validate Migration"
// //         desc="Run a query against the source and the equivalent query against the target, then compare the results."
// //       />

// //       {error && (
// //         <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
// //           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
// //           <div>{error}</div>
// //         </div>
// //       )}

// //       <div className="grid gap-4 sm:grid-cols-2">
// //         <div>
// //           <label className="text-sm font-semibold text-foreground">Source query (SQL Server)</label>
// //           <textarea
// //             value={sourceQuery}
// //             onChange={(e) => setSourceQuery(e.target.value)}
// //             rows={4}
// //             className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
// //           />
// //         </div>
// //         <div>
// //           <label className="text-sm font-semibold text-foreground">Target query (Snowflake)</label>
// //           <textarea
// //             value={targetQuery}
// //             onChange={(e) => setTargetQuery(e.target.value)}
// //             rows={4}
// //             className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
// //           />
// //         </div>
// //       </div>

// //       <div className="mt-4 text-center">
// //         <button
// //           type="button"
// //           onClick={run}
// //           disabled={state === "running"}
// //           className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
// //         >
// //           {state === "running" ? (
// //             <>
// //               <Loader2 className="h-4 w-4 animate-spin" />
// //               Running...
// //             </>
// //           ) : (
// //             <>
// //               <Play className="h-4 w-4" />
// //               Run validation
// //             </>
// //           )}
// //         </button>
// //       </div>

// //       {state === "done" && isScalarMatch !== null && (
// //         <div
// //           className={`mt-6 flex items-center gap-3 rounded-2xl border p-4 ${
// //             isScalarMatch
// //               ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
// //               : "border-destructive/30 bg-destructive/10 text-destructive"
// //           }`}
// //         >
// //           {isScalarMatch ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
// //           <span className="font-semibold">
// //             {isScalarMatch ? "Values match" : "Values do not match"}
// //           </span>
// //         </div>
// //       )}

// //       {state === "done" && (
// //         <div className="mt-6 flex flex-col gap-6 sm:flex-row">
// //           {renderTable("Source result", sourceResult)}
// //           {renderTable("Target result", targetResult)}
// //         </div>
// //       )}

// //       <Footer onBack={onBack} />
// //     </section>
// //   );
// // }





// import { useState } from "react";
// import {
//   CheckCircle2,
//   Loader2,
//   Play,
//   AlertCircle,
//   XCircle,
// } from "lucide-react";

// import { Footer, StepHeader, type ConnectionValues } from "./ModernizeShared";

// interface ValidateMigrationProps {
//   sourceConfig: ConnectionValues | null;
//   targetConfig: ConnectionValues | null;
//   onBack: () => void;
//   onDone: () => void;
// }

// interface QueryResult {
//   columns: string[];
//   rows: (string | null)[][];
//   row_count: number;
// }

// interface QueryPair {
//   label: string;
//   sourceQuery: string;
//   targetQuery: string;
// }

// const DEFAULT_CHECKS: QueryPair[] = [
//   {
//     label: "Row count",
//     sourceQuery: "SELECT COUNT(*) AS row_count FROM dbo.PRODRUN_TXN;",
//     targetQuery: "SELECT COUNT(*) AS row_count FROM FACT_PRODUCTION_OUTPUT;",
//   },
//   {
//     label: "Null count — Manufacturer",
//     sourceQuery:
//       "SELECT COUNT(*) AS null_count FROM dbo.MACHINE_MST WHERE Manufacturer IS NULL;",
//     targetQuery:
//       "SELECT COUNT(*) AS null_count FROM DIM_MACHINE WHERE manufacturer IS NULL;",
//   },
//   {
//     label: "Sum — QtyProduced",
//     sourceQuery:
//       "SELECT SUM(QtyProduced) AS total_qty_produced FROM dbo.PRODRUN_TXN;",
//     targetQuery:
//       "SELECT SUM(qty_produced) AS total_qty_produced FROM FACT_PRODUCTION_OUTPUT;",
//   },
//   {
//     label: "Distinct machines",
//     sourceQuery:
//       "SELECT COUNT(DISTINCT MachineID) AS distinct_machines FROM dbo.PRODRUN_TXN;",
//     targetQuery:
//       "SELECT COUNT(DISTINCT machine_key) AS distinct_machines FROM FACT_PRODUCTION_OUTPUT;",
//   },
//   {
//     label: "Average run time",
//     sourceQuery:
//       "SELECT AVG(RunTimeMin) AS avg_run_time_min FROM dbo.PRODRUN_TXN;",
//     targetQuery:
//       "SELECT AVG(run_time_minutes) AS avg_run_time_min FROM FACT_PRODUCTION_OUTPUT;",
//   },
// ];

// function buildSqlServerBody(cfg: ConnectionValues, query: string) {
//   return {
//     server: cfg.host ?? cfg.server ?? "",
//     database: cfg.database ?? "",
//     username: cfg.username ?? "",
//     password: cfg.password ?? "",
//     query,
//   };
// }

// function buildSnowflakeBody(cfg: ConnectionValues, query: string) {
//   return {
//     account: cfg.account ?? cfg.account_identifier ?? "",
//     username: cfg.username ?? "",
//     password: cfg.password ?? "",
//     warehouse: cfg.warehouse ?? "",
//     database: cfg.database ?? "",
//     schema: cfg.schema ?? "",
//     role: cfg.role ?? "ACCOUNTADMIN",
//     query,
//   };
// }

// export default function ValidateMigration({
//   sourceConfig,
//   targetConfig,
//   onBack,
//   onDone,
// }: ValidateMigrationProps) {
//   const [checks, setChecks] = useState<QueryPair[]>(DEFAULT_CHECKS);

//   const [state, setState] = useState<"idle" | "running" | "done">("idle");
//   const [sourceResults, setSourceResults] = useState<(QueryResult | null)[]>([]);
//   const [targetResults, setTargetResults] = useState<(QueryResult | null)[]>([]);
//   const [error, setError] = useState<string | null>(null);

//   const updateCheck = (
//     index: number,
//     field: "sourceQuery" | "targetQuery",
//     value: string
//   ) => {
//     setChecks((current) =>
//       current.map((c, i) => (i === index ? { ...c, [field]: value } : c))
//     );
//   };

//   const run = async () => {
//     if (!sourceConfig || !targetConfig) {
//       setError(
//         "Source or target connection is missing. Complete the earlier steps first."
//       );
//       return;
//     }

//     try {
//       setState("running");
//       setError(null);
//       setSourceResults([]);
//       setTargetResults([]);

//       const sourceCalls = checks.map((c) =>
//         fetch("http://127.0.0.1:8000/run-query-sql", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(buildSqlServerBody(sourceConfig, c.sourceQuery)),
//         })
//       );

//       const targetCalls = checks.map((c) =>
//         fetch("http://127.0.0.1:8000/run-query-snowflake", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(buildSnowflakeBody(targetConfig, c.targetQuery)),
//         })
//       );

//       const [sourceResponses, targetResponses] = await Promise.all([
//         Promise.all(sourceCalls),
//         Promise.all(targetCalls),
//       ]);

//       for (const res of [...sourceResponses, ...targetResponses]) {
//         if (!res.ok) {
//           const detail = await res.json().catch(() => null);
//           throw new Error(detail?.detail || "One or more queries failed.");
//         }
//       }

//       const sourceData = await Promise.all(sourceResponses.map((r) => r.json()));
//       const targetData = await Promise.all(targetResponses.map((r) => r.json()));

//       setSourceResults(sourceData);
//       setTargetResults(targetData);
//       setState("done");
//       onDone();
//     } catch (err) {
//       console.error("Validation failed:", err);
//       setError(
//         err instanceof Error ? err.message : "Failed to run validation."
//       );
//       setState("idle");
//     }
//   };

//   const isMatch = (i: number): boolean | null => {
//     const s = sourceResults[i];
//     const t = targetResults[i];
//     if (
//       !s ||
//       !t ||
//       s.rows.length !== 1 ||
//       s.rows[0].length !== 1 ||
//       t.rows.length !== 1 ||
//       t.rows[0].length !== 1
//     ) {
//       return null;
//     }
//     return s.rows[0][0] === t.rows[0][0];
//   };

//   const renderTable = (label: string, result: QueryResult | null) => (
//     <div className="flex-1 min-w-0">
//       <h4 className="text-xs font-semibold text-foreground mb-2">{label}</h4>
//       {result ? (
//         <div className="overflow-x-auto rounded-xl border border-border bg-card">
//           <table className="w-full text-left text-sm">
//             <thead>
//               <tr className="border-b border-border">
//                 {result.columns.map((c) => (
//                   <th key={c} className="px-4 py-2 font-semibold text-foreground">
//                     {c}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {result.rows.map((row, i) => (
//                 <tr key={i} className="border-b border-border last:border-0">
//                   {row.map((v, j) => (
//                     <td key={j} className="px-4 py-2 text-foreground">
//                       {v ?? "—"}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
//           No result yet.
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <section>
//       <StepHeader
//         title="Validate Migration"
//         desc="Run a query against the source and the equivalent query against the target, then compare the results."
//       />

//       {error && (
//         <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
//           <div>{error}</div>
//         </div>
//       )}

//       <div className="text-center">
//         <button
//           type="button"
//           onClick={run}
//           disabled={state === "running"}
//           className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
//         >
//           {state === "running" ? (
//             <>
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Running...
//             </>
//           ) : (
//             <>
//               <Play className="h-4 w-4" />
//               Run validation
//             </>
//           )}
//         </button>
//       </div>

//       {checks.map((check, i) => (
//         <div key={i} className="mt-8 rounded-2xl border border-border p-6">
//           <h3 className="text-sm font-semibold text-foreground mb-4">
//             {check.label}
//           </h3>

//           <div className="grid gap-4 sm:grid-cols-2">
//             <div>
//               <label className="text-xs font-medium text-muted-foreground">
//                 Source query (SQL Server)
//               </label>
//               <textarea
//                 value={check.sourceQuery}
//                 onChange={(e) =>
//                   updateCheck(i, "sourceQuery", e.target.value)
//                 }
//                 rows={3}
//                 className="mt-1 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
//               />
//             </div>
//             <div>
//               <label className="text-xs font-medium text-muted-foreground">
//                 Target query (Snowflake)
//               </label>
//               <textarea
//                 value={check.targetQuery}
//                 onChange={(e) =>
//                   updateCheck(i, "targetQuery", e.target.value)
//                 }
//                 rows={3}
//                 className="mt-1 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
//               />
//             </div>
//           </div>

//           {state === "done" && (
//             <>
//               {isMatch(i) !== null && (
//                 <div
//                   className={`mt-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
//                     isMatch(i)
//                       ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
//                       : "bg-destructive/10 text-destructive"
//                   }`}
//                 >
//                   {isMatch(i) ? (
//                     <CheckCircle2 className="h-4 w-4" />
//                   ) : (
//                     <XCircle className="h-4 w-4" />
//                   )}
//                   {isMatch(i) ? "Match" : "Mismatch"}
//                 </div>
//               )}

//               <div className="mt-4 flex flex-col gap-4 sm:flex-row">
//                 {renderTable("Source result", sourceResults[i] ?? null)}
//                 {renderTable("Target result", targetResults[i] ?? null)}
//               </div>
//             </>
//           )}
//         </div>
//       ))}

//       <Footer onBack={onBack} />
//     </section>
//   );
// }


import { useState } from "react";
import {
  CheckCircle2,
  Loader2,
  Play,
  AlertCircle,
  XCircle,
} from "lucide-react";

import { Footer, StepHeader, type ConnectionValues } from "./ModernizeShared";

interface ValidateMigrationProps {
  sourceConfig: ConnectionValues | null;
  targetConfig: ConnectionValues | null;
  onBack: () => void;
  onDone: () => void;
}

interface QueryResult {
  columns: string[];
  rows: (string | null)[][];
  row_count: number;
}

const DEFAULT_SOURCE_QUERIES = [
  "SELECT COUNT(*) AS row_count FROM dbo.PRODRUN_TXN;",
  "SELECT COUNT(*) AS null_count FROM dbo.MACHINE_MST WHERE Manufacturer IS NULL;",
  "SELECT SUM(QtyProduced) AS total_qty_produced FROM dbo.PRODRUN_TXN;",
  "SELECT COUNT(DISTINCT MachineID) AS distinct_machines FROM dbo.PRODRUN_TXN;",
  "SELECT AVG(RunTimeMin) AS avg_run_time_min FROM dbo.PRODRUN_TXN;",
].join("\n");

const DEFAULT_TARGET_QUERIES = [
  "SELECT COUNT(*) AS row_count FROM FACT_PRODUCTION_OUTPUT;",
  "SELECT COUNT(*) AS null_count FROM DIM_MACHINE WHERE manufacturer IS NULL;",
  "SELECT SUM(qty_produced) AS total_qty_produced FROM FACT_PRODUCTION_OUTPUT;",
  "SELECT COUNT(DISTINCT machine_key) AS distinct_machines FROM FACT_PRODUCTION_OUTPUT;",
  "SELECT AVG(run_time_minutes) AS avg_run_time_min FROM FACT_PRODUCTION_OUTPUT;",
].join("\n");

function buildSqlServerBody(cfg: ConnectionValues, query: string) {
  return {
    server: cfg.host ?? cfg.server ?? "",
    database: cfg.database ?? "",
    username: cfg.username ?? "",
    password: cfg.password ?? "",
    query,
  };
}

function buildSnowflakeBody(cfg: ConnectionValues, query: string) {
  return {
    account: cfg.account ?? cfg.account_identifier ?? "",
    username: cfg.username ?? "",
    password: cfg.password ?? "",
    warehouse: cfg.warehouse ?? "",
    database: cfg.database ?? "",
    schema: cfg.schema ?? "",
    role: cfg.role ?? "ACCOUNTADMIN",
    query,
  };
}

/*
 * Splits a textarea's contents into individual statements on ';',
 * trims whitespace, drops empty lines/comments-only lines.
 */
function splitQueries(raw: string): string[] {
  return raw
    .split(";")
    .map((q) => q.trim())
    .filter((q) => q.length > 0);
}

/*
 * Numeric-aware equality. Snowflake returns SUM()/AVG() on integer
 * columns as e.g. "1173583.0" while SQL Server returns "1173583" --
 * a plain string compare treats these as a mismatch even though the
 * underlying value is identical. Parse both sides as numbers when
 * possible and compare with a small epsilon; fall back to a trimmed
 * string compare for non-numeric values (dates, text, NULLs).
 */
function valuesMatch(a: string | null, b: string | null): boolean {
  if (a === null || b === null) return a === b;

  const numA = Number(a);
  const numB = Number(b);

  if (!Number.isNaN(numA) && !Number.isNaN(numB)) {
    return Math.abs(numA - numB) < 1e-6;
  }

  return a.trim() === b.trim();
}

export default function ValidateMigration({
  sourceConfig,
  targetConfig,
  onBack,
  onDone,
}: ValidateMigrationProps) {
  const [sourceQueries, setSourceQueries] = useState(DEFAULT_SOURCE_QUERIES);
  const [targetQueries, setTargetQueries] = useState(DEFAULT_TARGET_QUERIES);

  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [sourceResults, setSourceResults] = useState<(QueryResult | null)[]>([]);
  const [targetResults, setTargetResults] = useState<(QueryResult | null)[]>([]);
  const [ranSourceQueries, setRanSourceQueries] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!sourceConfig || !targetConfig) {
      setError(
        "Source or target connection is missing. Complete the earlier steps first."
      );
      return;
    }

    const sourceList = splitQueries(sourceQueries);
    const targetList = splitQueries(targetQueries);

    if (sourceList.length === 0 || targetList.length === 0) {
      setError("Enter at least one query on each side.");
      return;
    }

    if (sourceList.length !== targetList.length) {
      setError(
        `Query count mismatch: ${sourceList.length} source quer${
          sourceList.length === 1 ? "y" : "ies"
        } vs ${targetList.length} target quer${
          targetList.length === 1 ? "y" : "ies"
        }. Each source query needs a matching target query on the same line position.`
      );
      return;
    }

    try {
      setState("running");
      setError(null);
      setSourceResults([]);
      setTargetResults([]);

      const sourceCalls = sourceList.map((q) =>
        fetch("https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/run-query-sql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildSqlServerBody(sourceConfig, q)),
        })
      );

      const targetCalls = targetList.map((q) =>
        fetch("https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/run-query-snowflake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buildSnowflakeBody(targetConfig, q)),
        })
      );

      const [sourceResponses, targetResponses] = await Promise.all([
        Promise.all(sourceCalls),
        Promise.all(targetCalls),
      ]);

      for (const res of [...sourceResponses, ...targetResponses]) {
        if (!res.ok) {
          const detail = await res.json().catch(() => null);
          throw new Error(detail?.detail || "One or more queries failed.");
        }
      }

      const sourceData = await Promise.all(sourceResponses.map((r) => r.json()));
      const targetData = await Promise.all(targetResponses.map((r) => r.json()));

      setSourceResults(sourceData);
      setTargetResults(targetData);
      setRanSourceQueries(sourceList);
      setState("done");
      onDone();
    } catch (err) {
      console.error("Validation failed:", err);
      setError(
        err instanceof Error ? err.message : "Failed to run validation."
      );
      setState("idle");
    }
  };

  const isMatch = (i: number): boolean | null => {
    const s = sourceResults[i];
    const t = targetResults[i];
    if (
      !s ||
      !t ||
      s.rows.length !== 1 ||
      s.rows[0].length !== 1 ||
      t.rows.length !== 1 ||
      t.rows[0].length !== 1
    ) {
      return null;
    }
    return valuesMatch(s.rows[0][0], t.rows[0][0]);
  };

  const renderTable = (label: string, result: QueryResult | null) => (
    <div className="flex-1 min-w-0">
      <h4 className="text-xs font-semibold text-foreground mb-2">{label}</h4>
      {result ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {result.columns.map((c) => (
                  <th key={c} className="px-4 py-2 font-semibold text-foreground">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  {row.map((v, j) => (
                    <td key={j} className="px-4 py-2 text-foreground">
                      {v ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
          No result yet.
        </div>
      )}
    </div>
  );

  return (
    <section>
      <StepHeader
        title="Validate Migration"
        desc="Run the queries against the source and the matching queries against the target, then compare the results. One query per line, ending with a semicolon — source line 1 is compared against target line 1, and so on."
      />

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-foreground">
            Source queries (SQL Server)
          </label>
          <textarea
            value={sourceQueries}
            onChange={(e) => setSourceQueries(e.target.value)}
            rows={10}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground">
            Target queries (Snowflake)
          </label>
          <textarea
            value={targetQueries}
            onChange={(e) => setTargetQueries(e.target.value)}
            rows={10}
            spellCheck={false}
            className="mt-2 w-full rounded-xl border border-border bg-background p-3 font-mono text-sm text-foreground"
          />
        </div>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={run}
          disabled={state === "running"}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "running" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run validation
            </>
          )}
        </button>
      </div>

      {state === "done" &&
        ranSourceQueries.map((sq, i) => (
          <div key={i} className="mt-8 rounded-2xl border border-border p-6">
            <p className="mb-3 font-mono text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Check {i + 1}</span>
              {" — "}
              {sq}
            </p>

            {isMatch(i) !== null && (
              <div
                className={`mb-4 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
                  isMatch(i)
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {isMatch(i) ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {isMatch(i) ? "Match" : "Mismatch"}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row">
              {renderTable("Source result", sourceResults[i] ?? null)}
              {renderTable("Target result", targetResults[i] ?? null)}
            </div>
          </div>
        ))}

      <Footer onBack={onBack} />
    </section>
  );
}