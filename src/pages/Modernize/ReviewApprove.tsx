// import { useState } from "react";
// import {
//   FileSpreadsheet,
//   Upload,
//   CheckCircle2,
//   Loader2,
//   AlertCircle,
// } from "lucide-react";

// import {
//   Footer,
//   StepHeader,
// } from "./ModernizeShared";

// export interface UploadResponse {
//   row_count: number;
//   saved_to: string;
// }

// export interface ValidationResponse {
//   valid: boolean;
//   errors: string[];
//   warnings: string[];
//   rows_to_migrate: number;
//   rows_excluded: number;
// }

// interface ReviewApproveProps {
//   sessionId: string | null;

//   /*
//    * The selected file and both API results live in the parent
//    * (ModernizeData) so they survive navigating away from this
//    * step and back — ReviewApprove is unmounted whenever `step`
//    * changes, so local state here would otherwise be lost.
//    */
//   file: File | null;
//   uploadResult: UploadResponse | null;
//   validationResult: ValidationResponse | null;
//   onFileChange: (file: File | null) => void;
//   onUploadResultChange: (result: UploadResponse | null) => void;
//   onValidationResultChange: (result: ValidationResponse | null) => void;

//   onBack: () => void;
//   onNext: () => void;
// }

// export default function ReviewApprove({
//   sessionId,
//   file,
//   uploadResult,
//   validationResult,
//   onFileChange,
//   onUploadResultChange,
//   onValidationResultChange,
//   onBack,
//   onNext,
// }: ReviewApproveProps) {
//   const [uploading, setUploading] = useState(false);
//   const [validating, setValidating] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const uploaded = !!uploadResult;
//   const validated = !!validationResult?.valid;

//   const handleFileChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const selectedFile =
//       event.target.files?.[0] ?? null;

//     onFileChange(selectedFile);
//     onUploadResultChange(null);
//     onValidationResultChange(null);

//     setError(null);
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select the reviewed CSV file.");
//       return;
//     }

//     if (!sessionId) {
//       setError(
//         "Session ID is missing. Please complete the previous steps first."
//       );
//       return;
//     }

//     try {
//       setUploading(true);
//       onUploadResultChange(null);
//       setError(null);

//       const formData = new FormData();
//       formData.append("file", file);

//       const response = await fetch(
//         `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/mapping/upload-csv`,
//         {
//           method: "POST",
//           headers: {
//             accept: "application/json",
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         let message =
//           "Failed to upload the reviewed CSV.";

//         try {
//           const result = await response.json();

//           message =
//             result.detail ||
//             result.message ||
//             message;
//         } catch {
//           // Keep default error message.
//         }

//         throw new Error(message);
//       }

//       const result: UploadResponse =
//         await response.json();

//       onUploadResultChange(result);

//       window.dispatchEvent(
//         new CustomEvent("toast", {
//           detail: {
//             title: "CSV uploaded successfully",
//             description:
//               "The reviewed CSV has been uploaded successfully.",
//           },
//         })
//       );
//     } catch (err) {
//       console.error(
//         "Reviewed CSV upload failed:",
//         err
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to upload the reviewed CSV."
//       );
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleValidate = async () => {
//     if (!sessionId) {
//       setError(
//         "Session ID is missing. Please complete the previous steps first."
//       );
//       return;
//     }

//     if (!uploaded) {
//       setError(
//         "Please upload the reviewed CSV before validating it."
//       );
//       return;
//     }

//     try {
//       setValidating(true);
//       onValidationResultChange(null);
//       setError(null);

//       const response = await fetch(
//         `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/step5-validate`,
//         {
//           method: "POST",
//           headers: {
//             accept: "application/json",
//           },
//         }
//       );

//       let result: ValidationResponse;

//       try {
//         result = await response.json();
//       } catch {
//         throw new Error(
//           "The validation API returned an invalid response."
//         );
//       }

//       if (!response.ok) {
//         const apiError =
//           result.errors?.join(", ") ||
//           "Failed to validate the uploaded CSV.";

//         throw new Error(apiError);
//       }

//       onValidationResultChange(result);

//       if (!result.valid) {
//         const validationErrors =
//           result.errors?.length > 0
//             ? result.errors.join("\n")
//             : "The uploaded CSV failed validation.";

//         setError(validationErrors);
//         return;
//       }

//       window.dispatchEvent(
//         new CustomEvent("toast", {
//           detail: {
//             title: "Validation successful",
//             description:
//               "The uploaded CSV passed validation successfully.",
//           },
//         })
//       );
//     } catch (err) {
//       console.error(
//         "CSV validation failed:",
//         err
//       );

//       setError(
//         err instanceof Error
//           ? err.message
//           : "Failed to validate the uploaded CSV."
//       );
//     } finally {
//       setValidating(false);
//     }
//   };

//   return (
//     <section>
//       <StepHeader
//         title="Business Review & Re-Upload"
//         desc="Review the AI-generated mappings in Excel, select the appropriate reviewer decision for each row, and upload the reviewed CSV."
//       />

//       {/* Reviewer decision heading */}
//       <div className="mb-4">
//         <div className="font-mono text-sm font-semibold text-primary">
//           reviewer_decision
//         </div>
//       </div>

//       {/* Decision cards */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         {/* Approved */}
//         <div className="rounded-2xl border border-border bg-card p-5">
//           <div className="font-semibold text-foreground">
//             Approved
//           </div>

//           <p className="mt-2 text-sm leading-6 text-muted-foreground">
//             The AI-generated mapping is correct and will
//             be accepted as-is. The generated target table
//             and target column will be used for the
//             migration.
//           </p>
//         </div>

//         {/* Changed */}
//         <div className="rounded-2xl border border-border bg-card p-5">
//           <div className="font-semibold text-foreground">
//             Changed
//           </div>

//           <p className="mt-2 text-sm leading-6 text-muted-foreground">
//             The AI-generated mapping needs correction.
//             The value entered in{" "}
//             <span className="font-mono text-xs text-primary">
//               reviewer_override_column
//             </span>{" "}
//             will be used as the final target column for
//             the migration.
//           </p>
//         </div>

//         {/* N/A */}
//         <div className="rounded-2xl border border-border bg-card p-5">
//           <div className="font-semibold text-foreground">
//             N/A
//           </div>

//           <p className="mt-2 text-sm leading-6 text-muted-foreground">
//             The source column does not have a valid or
//             required UDM mapping. It will be excluded from
//             the migration while the row remains recorded
//             for traceability.
//           </p>
//         </div>
//       </div>

//       {/* Upload area */}
//       <label
//         className={`mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors ${
//           uploading
//             ? "cursor-not-allowed opacity-60"
//             : "cursor-pointer hover:border-primary"
//         }`}
//       >
//         <Upload className="mb-4 h-8 w-8 text-primary" />

//         <span className="font-semibold text-foreground">
//           Upload the reviewed CSV
//         </span>

//         <span className="mt-1 text-sm text-muted-foreground">
//           Upload the CSV after completing the business
//           review.
//         </span>

//         <input
//           type="file"
//           accept=".csv,text/csv"
//           className="hidden"
//           disabled={uploading}
//           onChange={handleFileChange}
//         />
//       </label>

//       {/* Selected file */}
//       {file && (
//         <div className="mt-6 rounded-2xl border border-border bg-card p-6">
//           <div className="flex flex-wrap items-center gap-3">
//             <FileSpreadsheet className="h-5 w-5 text-primary" />

//             <span className="font-medium text-foreground">
//               {file.name}
//             </span>

//             {uploaded && (
//               <span className="ml-auto rounded-md bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
//                 Uploaded
//               </span>
//             )}
//           </div>

//           {/* Upload button */}
//           {!uploaded && (
//             <button
//               type="button"
//               onClick={handleUpload}
//               disabled={
//                 uploading ||
//                 !sessionId
//               }
//               className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {uploading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Uploading CSV...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="h-4 w-4" />
//                   Upload Reviewed CSV
//                 </>
//               )}
//             </button>
//           )}

//           {/* Validate button */}
//           {uploaded && !validated && (
//             <button
//               type="button"
//               onClick={handleValidate}
//               disabled={
//                 validating ||
//                 !sessionId
//               }
//               className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//             >
//               {validating ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                   Validating CSV...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle2 className="h-4 w-4" />
//                   Validate Uploaded CSV
//                 </>
//               )}
//             </button>
//           )}

//           {/* Validation success */}
//           {validated &&
//             validationResult && (
//               <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
//                 <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
//                   <CheckCircle2 className="h-4 w-4" />
//                   Validation successful
//                 </div>

//                 <div className="mt-3 grid gap-3 sm:grid-cols-2">
//                   <div className="rounded-lg border border-border bg-card p-3">
//                     <div className="text-xs text-muted-foreground">
//                       Rows to migrate
//                     </div>

//                     <div className="mt-1 text-lg font-semibold text-foreground">
//                       {
//                         validationResult.rows_to_migrate
//                       }
//                     </div>
//                   </div>

//                   <div className="rounded-lg border border-border bg-card p-3">
//                     <div className="text-xs text-muted-foreground">
//                       Rows excluded
//                     </div>

//                     <div className="mt-1 text-lg font-semibold text-foreground">
//                       {
//                         validationResult.rows_excluded
//                       }
//                     </div>
//                   </div>
//                 </div>

//                 {validationResult.warnings?.length >
//                   0 && (
//                   <div className="mt-4">
//                     <div className="text-sm font-semibold text-foreground">
//                       Warnings
//                     </div>

//                     <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
//                       {validationResult.warnings.map(
//                         (warning, index) => (
//                           <li key={index}>
//                             {warning}
//                           </li>
//                         )
//                       )}
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             )}
//         </div>
//       )}

//       {/* Validation / upload error */}
//       {error && (
//         <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

//           <div className="whitespace-pre-line">
//             {error}
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <Footer
//         onBack={onBack}
//         onNext={onNext}
//         disabled={!validated}
//         nextLabel="Generate migration"
//       />
//     </section>
//   );
// }

import { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Trash2,
} from "lucide-react";

import {
  Footer,
  StepHeader,
} from "./ModernizeShared";

export interface UploadResponse {
  row_count: number;
  saved_to: string;
}

export interface ExcludedRow {
  source_system: string;
  source_schema: string;
  source_table: string;
  source_column: string;
  target_fact_or_dim: string;
  target_column: string;
  reviewer_decision: string;
  reason: string;
}

export interface ValidationResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rows_to_migrate: number;
  rows_excluded: number;
  excluded_rows?: ExcludedRow[];
}

interface ReviewApproveProps {
  sessionId: string | null;

  /*
   * The selected file and both API results live in the parent
   * (ModernizeData) so they survive navigating away from this
   * step and back — ReviewApprove is unmounted whenever `step`
   * changes, so local state here would otherwise be lost.
   */
  file: File | null;
  uploadResult: UploadResponse | null;
  validationResult: ValidationResponse | null;
  onFileChange: (file: File | null) => void;
  onUploadResultChange: (result: UploadResponse | null) => void;
  onValidationResultChange: (result: ValidationResponse | null) => void;

  onBack: () => void;
  onNext: () => void;
}

// The API returns a couple of stock reason strings verbatim. We rewrite
// them into friendlier copy for display; anything else (e.g. a custom
// reviewer note) is shown as-is.
const REASON_REWRITES: Array<[string, string]> = [
  [
    "Target-only row: documents a target column with no source counterpart, so there is no data to migrate.",
    "No matching source column found. Data will not be migrated to this target column.",
  ],
  [
    "Reviewer marked N/A -- explicitly reviewed and excluded from migration. Reviewer note: No suitable target column in UDM; skip migration.",
    "Reviewer marked this as N/A. No suitable target column was found in the UDM, so this data will not be migrated.",
  ],
];

function getDisplayReason(reason: string): string {
  const match = REASON_REWRITES.find(([original]) => original === reason);
  return match ? match[1] : reason;
}

// The validation API returns one error string per offending line, which can
// mean dozens of near-identical messages for the same underlying issue
// (e.g. every empty reviewer_decision, or every column pointing at the same
// missing target table). We collapse those known patterns into a single,
// actionable message per issue instead of listing every line.
const EMPTY_DECISION_PATTERN = /^Line \d+: reviewer_decision '' is invalid/;
const MISSING_TARGET_TABLE_PATTERN =
  /^Line \d+: target table '([^']+)' does not exist in the UDM metadata\.$/;

function summarizeValidationErrors(errors: string[]): string[] {
  let emptyDecisionCount = 0;
  const missingTargetTables = new Map<string, number>();
  const other: string[] = [];

  for (const err of errors) {
    if (EMPTY_DECISION_PATTERN.test(err)) {
      emptyDecisionCount += 1;
      continue;
    }

    const tableMatch = err.match(MISSING_TARGET_TABLE_PATTERN);

    if (tableMatch) {
      const table = tableMatch[1];
      missingTargetTables.set(
        table,
        (missingTargetTables.get(table) ?? 0) + 1
      );
      continue;
    }

    other.push(err);
  }

  const summary: string[] = [];

  if (emptyDecisionCount > 0) {
    summary.push(
      "Reviewer decisions are required for all columns. Please select Approved, Changed, or N/A for each applicable column before re-uploading the file."
    );
  }

  for (const [table, count] of missingTargetTables) {
    summary.push(
      `Target table '${table}' does not exist in the UDM metadata (${count} column${count === 1 ? "" : "s"
      } affected).`
    );
  }

  summary.push(...other);

  return summary;
}

export default function ReviewApprove({
  sessionId,
  file,
  uploadResult,
  validationResult,
  onFileChange,
  onUploadResultChange,
  onValidationResultChange,
  onBack,
  onNext,
}: ReviewApproveProps) {
  const [uploading, setUploading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [showExcludedReasons, setShowExcludedReasons] = useState(false);

  const uploaded = !!uploadResult;
  const validated = !!validationResult?.valid;

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] ?? null;

    onFileChange(selectedFile);
    onUploadResultChange(null);
    onValidationResultChange(null);

    setError(null);
    setShowExcludedReasons(false);

    // Upload immediately on selection, rather than waiting for a
    // separate "Upload" click. We pass the file explicitly since
    // the `file` prop (from parent state) won't be updated yet on
    // this same render.
    if (selectedFile) {
      handleUpload(selectedFile);
    }

    // Allow re-selecting the same file again later and still have
    // onChange fire (e.g. after an error, re-picking the same CSV).
    event.target.value = "";
  };

  const handleUpload = async (fileToUpload?: File) => {
    const targetFile = fileToUpload ?? file;

    if (!targetFile) {
      setError(["Please select the reviewed CSV file."]);
      return;
    }

    if (!sessionId) {
      setError([
        "Session ID is missing. Please complete the previous steps first.",
      ]);
      return;
    }

    try {
      setUploading(true);
      onUploadResultChange(null);
      setError(null);

      const formData = new FormData();
      formData.append("file", targetFile);

      const response = await fetch(
        `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/mapping/upload-csv`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            accept: "application/json",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        let message =
          "Failed to upload the reviewed CSV.";

        try {
          const result = await response.json();

          message =
            result.detail ||
            result.message ||
            message;
        } catch {
          // Keep default error message.
        }

        throw new Error(message);
      }

      const result: UploadResponse =
        await response.json();

      onUploadResultChange(result);

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "CSV uploaded successfully",
            description:
              "The reviewed CSV has been uploaded successfully.",
          },
        })
      );
    } catch (err) {
      console.error(
        "Reviewed CSV upload failed:",
        err
      );

      setError([
        err instanceof Error
          ? err.message
          : "Failed to upload the reviewed CSV.",
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = () => {
    // Don't allow removing mid-upload — there'd be nothing to cancel
    // the in-flight request, and the result would land after the
    // file was already cleared.
    if (uploading) return;

    onFileChange(null);
    onUploadResultChange(null);
    onValidationResultChange(null);

    setError(null);
    setShowExcludedReasons(false);
  };

  const handleValidate = async () => {
    if (!sessionId) {
      setError([
        "Session ID is missing. Please complete the previous steps first.",
      ]);
      return;
    }

    if (!uploaded) {
      setError(["Please upload the reviewed CSV before validating it."]);
      return;
    }

    try {
      setValidating(true);
      onValidationResultChange(null);
      setError(null);
      setShowExcludedReasons(false);

      const response = await fetch(
        `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/step5-validate?_=${Date.now()}`,
        {
          method: "POST",
          cache: "no-store",
          headers: {
            accept: "application/json",
          },
        }
      );

      let result: ValidationResponse;

      try {
        result = await response.json();
      } catch {
        throw new Error(
          "The validation API returned an invalid response."
        );
      }

      if (!response.ok) {
        const apiErrors =
          result.errors?.length > 0
            ? summarizeValidationErrors(result.errors)
            : ["Failed to validate the uploaded CSV."];

        throw new Error(apiErrors.join("\n"));
      }

      onValidationResultChange(result);

      if (!result.valid) {
        const validationErrors =
          result.errors?.length > 0
            ? summarizeValidationErrors(result.errors)
            : ["The uploaded CSV failed validation."];

        setError(validationErrors);
        return;
      }

      window.dispatchEvent(
        new CustomEvent("toast", {
          detail: {
            title: "Validation successful",
            description:
              "The uploaded CSV passed validation successfully.",
          },
        })
      );
    } catch (err) {
      console.error(
        "CSV validation failed:",
        err
      );

      setError(
        (err instanceof Error
          ? err.message
          : "Failed to validate the uploaded CSV."
        ).split("\n")
      );
    } finally {
      setValidating(false);
    }
  };

  return (
    <section>
      <StepHeader
        title="Business Review & Re-Upload"
        desc="Review the AI-generated mappings in Excel, select the appropriate reviewer decision for each column, and upload the reviewed CSV."
      />

      {/* Reviewer decision heading */}
      <div className="mb-4">
        <div className="font-mono text-sm font-semibold text-primary">
          reviewer_decision
        </div>
      </div>

      {/* Decision cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Approved */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="font-semibold text-foreground">
            Approved
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The AI-generated mapping is correct and will
            be accepted as-is. The generated target table
            and target column will be used for the
            migration.
          </p>
        </div>

        {/* Changed */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="font-semibold text-foreground">
            Changed
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The AI-generated mapping needs correction.
            The value entered in{" "}
            <span className="font-mono text-xs text-primary">
              reviewer_override_column
            </span>{" "}
            will be used as the final target column for
            the migration.
          </p>
        </div>

        {/* N/A */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="font-semibold text-foreground">
            N/A
          </div>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The source column does not have a valid or
            required UDM mapping. It will be excluded from
            the migration while the column remains recorded
            for traceability.
          </p>
        </div>
      </div>

      {/* Upload area */}
      <label
        className={`mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors ${uploading
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:border-primary"
          }`}
      >
        <Upload className="mb-4 h-8 w-8 text-primary" />

        <span className="font-semibold text-foreground">
          Upload the reviewed CSV
        </span>

        <span className="mt-1 text-sm text-muted-foreground">
          Upload the CSV after completing the business
          review.
        </span>

        <input
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          disabled={uploading}
          onChange={handleFileChange}
        />
      </label>

      {/* Selected file */}
      {file && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-primary" />

            <span className="font-medium text-foreground">
              {file.name}
            </span>

            {uploaded && (
              <span className="ml-auto rounded-md bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Uploaded
              </span>
            )}

            {!uploaded && uploading && (
              <span className={uploaded ? "" : "ml-auto inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground"}>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Uploading...
              </span>
            )}

            {!uploading && (
              <button
                type="button"
                onClick={handleRemoveFile}
                title="Remove file"
                aria-label="Remove file"
                className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10 ${uploaded ? "" : "ml-auto"
                  }`}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          {/* Validate button */}
          {uploaded && !validated && (
            <button
              type="button"
              onClick={handleValidate}
              disabled={
                validating ||
                !sessionId
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {validating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Validating CSV...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Validate Uploaded CSV
                </>
              )}
            </button>
          )}

          {/* Validation success */}
          {validated &&
            validationResult && (
              <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  Validation successful
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-xs text-muted-foreground">
                      Columns to migrate
                    </div>

                    <div className="mt-1 text-lg font-semibold text-foreground">
                      {
                        validationResult.rows_to_migrate
                      }
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-xs text-muted-foreground">
                      Columns excluded
                    </div>

                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="text-lg font-semibold text-foreground">
                        {
                          validationResult.rows_excluded
                        }
                      </div>

                      {!!validationResult.excluded_rows?.length && (
                        <button
                          type="button"
                          onClick={() =>
                            setShowExcludedReasons((prev) => !prev)
                          }
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
                        >
                          {showExcludedReasons ? (
                            <>
                              Hide reasons
                              <ChevronUp className="h-3.5 w-3.5" />
                            </>
                          ) : (
                            <>
                              View reasons
                              <ChevronDown className="h-3.5 w-3.5" />
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Excluded column reasons */}
                {showExcludedReasons &&
                  !!validationResult.excluded_rows?.length && (
                    <div className="mt-4 rounded-lg border border-border bg-card p-3">
                      <div className="text-sm font-semibold text-foreground">
                        Why these columns were excluded
                      </div>

                      <ul className="mt-2 space-y-3">
                        {validationResult.excluded_rows.map(
                          (row, index) => {
                            /*
                             * Target-only columns (a UDM column with no source
                             * counterpart) store the literal string "N/A" in
                             * source_table/source_column, not a blank value —
                             * so falling back to "—" never triggers and the
                             * label ends up as the meaningless "N/A.N/A".
                             * Show the target column instead in that case,
                             * since that's the actual thing being described.
                             */
                            const hasSource =
                              !!row.source_table &&
                              row.source_table.toUpperCase() !== "N/A";

                            const label = hasSource
                              ? `${row.source_table}.${row.source_column || "—"}`
                              : `${(row.target_fact_or_dim || "—").split(".").pop()}.${row.target_column || "—"
                              }`;

                            const displayReason = getDisplayReason(
                              row.reason
                            );

                            return (
                              <li
                                key={index}
                                className="rounded-md border border-border/60 bg-background p-3 text-sm"
                              >
                                <div className="flex flex-wrap items-center gap-2">
                                  <span
                                    className="rounded-md bg-purple-500/15 px-2 py-0.5 text-xs font-semibold text-purple-600 dark:text-purple-400"
                                  >
                                    {hasSource ? "Source table" : "Target table"}
                                  </span>

                                  <span className="rounded-md bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                                    {label}
                                  </span>
                                </div>

                                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                                  {displayReason}
                                </p>
                              </li>
                            );
                          }
                        )}
                      </ul>
                    </div>
                  )}

                {validationResult.warnings?.length >
                  0 && (
                    <div className="mt-4">
                      <div className="text-sm font-semibold text-foreground">
                        Warnings
                      </div>

                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {validationResult.warnings.map(
                          (warning, index) => (
                            <li key={index}>
                              {warning}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            )}
        </div>
      )}

      {/* Validation / upload error */}
      {error && error.length > 0 && (
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            Please review before continuing
          </div>

          <ul className="mt-2 list-disc space-y-1 pl-9 text-sm leading-6 text-foreground">
            {error.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer */}
      <Footer
        onBack={onBack}
        onNext={onNext}
        disabled={!validated}
        nextLabel="Generate migration"
      />
    </section>
  );
}
