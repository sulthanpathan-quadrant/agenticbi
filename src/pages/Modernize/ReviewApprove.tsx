import { useState } from "react";
import {
  FileSpreadsheet,
  Upload,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

import {
  Footer,
  StepHeader,
} from "./ModernizeShared";

interface ReviewApproveProps {
  sessionId: string | null;
  onBack: () => void;
  onNext: () => void;
}

interface UploadResponse {
  row_count: number;
  saved_to: string;
}

interface ValidationResponse {
  valid: boolean;
  errors: string[];
  warnings: string[];
  rows_to_migrate: number;
  rows_excluded: number;
}

export default function ReviewApprove({
  sessionId,
  onBack,
  onNext,
}: ReviewApproveProps) {
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [uploadResult, setUploadResult] =
    useState<UploadResponse | null>(null);

  const [validating, setValidating] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validationResult, setValidationResult] =
    useState<ValidationResponse | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      event.target.files?.[0] ?? null;

    setFile(selectedFile);

    setUploaded(false);
    setUploadResult(null);

    setValidated(false);
    setValidationResult(null);

    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select the reviewed CSV file.");
      return;
    }

    if (!sessionId) {
      setError(
        "Session ID is missing. Please complete the previous steps first."
      );
      return;
    }

    try {
      setUploading(true);
      setUploaded(false);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/mapping/upload-csv`,
        {
          method: "POST",
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

      setUploadResult(result);
      setUploaded(true);

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

      setError(
        err instanceof Error
          ? err.message
          : "Failed to upload the reviewed CSV."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleValidate = async () => {
    if (!sessionId) {
      setError(
        "Session ID is missing. Please complete the previous steps first."
      );
      return;
    }

    if (!uploaded) {
      setError(
        "Please upload the reviewed CSV before validating it."
      );
      return;
    }

    try {
      setValidating(true);
      setValidated(false);
      setValidationResult(null);
      setError(null);

      const response = await fetch(
        `https://veriton-udm-backend-cdgxcme7fbbmfyg5.westus3-01.azurewebsites.net/sessions/${sessionId}/step5-validate`,
        {
          method: "POST",
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
        const apiError =
          result.errors?.join(", ") ||
          "Failed to validate the uploaded CSV.";

        throw new Error(apiError);
      }

      setValidationResult(result);

      if (!result.valid) {
        const validationErrors =
          result.errors?.length > 0
            ? result.errors.join("\n")
            : "The uploaded CSV failed validation.";

        setError(validationErrors);
        return;
      }

      setValidated(true);

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
        err instanceof Error
          ? err.message
          : "Failed to validate the uploaded CSV."
      );
    } finally {
      setValidating(false);
    }
  };

  return (
    <section>
      <StepHeader
        title="Business Review & Re-Upload"
        desc="Review the AI-generated mappings in Excel, select the appropriate reviewer decision for each row, and upload the reviewed CSV."
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
            the migration while the row remains recorded
            for traceability.
          </p>
        </div>
      </div>

      {/* Upload area */}
      <label
        className={`mt-8 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card p-12 text-center transition-colors ${
          uploading
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
          </div>

          {/* Upload button */}
          {!uploaded && (
            <button
              type="button"
              onClick={handleUpload}
              disabled={
                uploading ||
                !sessionId
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading CSV...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload Reviewed CSV
                </>
              )}
            </button>
          )}

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
                      Rows to migrate
                    </div>

                    <div className="mt-1 text-lg font-semibold text-foreground">
                      {
                        validationResult.rows_to_migrate
                      }
                    </div>
                  </div>

                  <div className="rounded-lg border border-border bg-card p-3">
                    <div className="text-xs text-muted-foreground">
                      Rows excluded
                    </div>

                    <div className="mt-1 text-lg font-semibold text-foreground">
                      {
                        validationResult.rows_excluded
                      }
                    </div>
                  </div>
                </div>

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
      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

          <div className="whitespace-pre-line">
            {error}
          </div>
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

