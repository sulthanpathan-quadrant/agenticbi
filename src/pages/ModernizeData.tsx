import { useState } from "react";
import { WorkflowHeader } from "@/components/WorkFlowHeader";
 
import ModernizeSidebar from "./Modernize/ModernizeSidebar";
import SourceConnection from "./Modernize/SourceConnection";
import TargetConnection from "./Modernize/TargetConnection";
import SourceMetadataAnalysis, {
  type SourceMetadataResult,
} from "./Modernize/SourceMetadataAnalysis";
import TargetMetadataAnalysis, {
  type TargetMetadataResult,
} from "./Modernize/TargetMetadataAnalysis";
import ColumnMapping, {
  type GenerateMappingResult,
  type MappingRow,
} from "./Modernize/ColumnMapping";
import { ConnectionValues } from "./Modernize/ModernizeShared";
import ReviewApprove, {
  type UploadResponse,
  type ValidationResponse,
} from "./Modernize/ReviewApprove";
import RunMigration from "./Modernize/RunMigration";
 
/* ============================================================
   SESSION STORAGE KEYS
   ============================================================ */
 
const SESSION_ID_STORAGE_KEY = "modernize_session_id";
const STEP_STORAGE_KEY = "modernize_step";
 
const SOURCE_CONFIG_STORAGE_KEY = "modernize_source_config";
const TARGET_CONFIG_STORAGE_KEY = "modernize_target_config";
 
const SOURCE_METADATA_STORAGE_KEY = "modernize_source_metadata";
const TARGET_METADATA_STORAGE_KEY = "modernize_target_metadata";
 
const MAPPING_RESULT_STORAGE_KEY = "modernize_mapping_result";
const MAPPING_PREVIEW_STORAGE_KEY = "modernize_mapping_preview";
const MAPPING_EXPORTED_STORAGE_KEY = "modernize_mapping_exported";
 
const REVIEW_UPLOAD_RESULT_STORAGE_KEY =
  "modernize_review_upload_result";
 
const REVIEW_VALIDATION_RESULT_STORAGE_KEY =
  "modernize_review_validation_result";
 
/* ============================================================
   SESSION STORAGE HELPERS
   ============================================================ */
 
function readSessionStorage<T>(
  key: string,
  fallback: T
): T {
  if (typeof window === "undefined") {
    return fallback;
  }
 
  try {
    const value = window.sessionStorage.getItem(key);
 
    if (!value) {
      return fallback;
    }
 
    return JSON.parse(value) as T;
  } catch (error) {
    console.error(
      `Failed to read sessionStorage key "${key}":`,
      error
    );
 
    return fallback;
  }
}
 
function writeSessionStorage<T>(
  key: string,
  value: T
): void {
  if (typeof window === "undefined") {
    return;
  }
 
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify(value)
    );
  } catch (error) {
    console.error(
      `Failed to write sessionStorage key "${key}":`,
      error
    );
  }
}
 
function removeSessionStorage(key: string): void {
  if (typeof window === "undefined") {
    return;
  }
 
  window.sessionStorage.removeItem(key);
}
 
/* ============================================================
   READ INITIAL VALUES
   ============================================================ */
 
function readStoredSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
 
  return window.sessionStorage.getItem(
    SESSION_ID_STORAGE_KEY
  );
}
 
function readStoredStep(): number {
  if (typeof window === "undefined") {
    return 1;
  }
 
  const storedStep = window.sessionStorage.getItem(
    STEP_STORAGE_KEY
  );
 
  const parsedStep = Number(storedStep);
 
  if (
    Number.isInteger(parsedStep) &&
    parsedStep >= 1 &&
    parsedStep <= 7
  ) {
    return parsedStep;
  }
 
  return 1;
}
 
/* ============================================================
   COMPONENT
   ============================================================ */
 
export default function ModernizeData() {
  /*
   * Restore the last active step after refresh.
   */
  const [step, setStepState] = useState<number>(
    readStoredStep
  );
 
  /*
   * Restore connection configuration.
   */
  const [sourceConfig, setSourceConfigState] =
    useState<ConnectionValues | null>(() =>
      readSessionStorage<ConnectionValues | null>(
        SOURCE_CONFIG_STORAGE_KEY,
        null
      )
    );
 
  const [targetConfig, setTargetConfigState] =
    useState<ConnectionValues | null>(() =>
      readSessionStorage<ConnectionValues | null>(
        TARGET_CONFIG_STORAGE_KEY,
        null
      )
    );
 
  /*
   * Restore session ID.
   */
  const [sessionId, setSessionIdState] =
    useState<string | null>(readStoredSessionId);
 
  /*
   * Restore source metadata.
   */
  const [sourceMetadata, setSourceMetadataState] =
    useState<SourceMetadataResult | null>(() =>
      readSessionStorage<SourceMetadataResult | null>(
        SOURCE_METADATA_STORAGE_KEY,
        null
      )
    );
 
  /*
   * Restore target metadata.
   */
  const [targetMetadata, setTargetMetadataState] =
    useState<TargetMetadataResult | null>(() =>
      readSessionStorage<TargetMetadataResult | null>(
        TARGET_METADATA_STORAGE_KEY,
        null
      )
    );
 
  /*
   * Restore mapping state.
   */
  const [mappingResult, setMappingResultState] =
    useState<GenerateMappingResult | null>(() =>
      readSessionStorage<GenerateMappingResult | null>(
        MAPPING_RESULT_STORAGE_KEY,
        null
      )
    );
 
  const [mappingPreviewRows, setMappingPreviewRowsState] =
    useState<MappingRow[]>(() =>
      readSessionStorage<MappingRow[]>(
        MAPPING_PREVIEW_STORAGE_KEY,
        []
      )
    );
 
  const [mappingExported, setMappingExportedState] =
    useState<boolean>(() =>
      readSessionStorage<boolean>(
        MAPPING_EXPORTED_STORAGE_KEY,
        false
      )
    );
 
  /*
   * Restore Review/Approve API results.
   *
   * NOTE:
   * The actual File object is NOT restored here because
   * browser File objects cannot be directly persisted in
   * sessionStorage.
   */
  const [reviewFile, setReviewFile] =
    useState<File | null>(null);
 
  const [reviewUploadResult, setReviewUploadResultState] =
    useState<UploadResponse | null>(() =>
      readSessionStorage<UploadResponse | null>(
        REVIEW_UPLOAD_RESULT_STORAGE_KEY,
        null
      )
    );
 
  const [
    reviewValidationResult,
    setReviewValidationResultState,
  ] = useState<ValidationResponse | null>(() =>
    readSessionStorage<ValidationResponse | null>(
      REVIEW_VALIDATION_RESULT_STORAGE_KEY,
      null
    )
  );
 
  /* ============================================================
     PERSISTED SETTERS
     ============================================================ */
 
  const setStep = (nextStep: number) => {
    if (nextStep < 1 || nextStep > 7) {
      return;
    }
 
    setStepState(nextStep);
 
    writeSessionStorage(
      STEP_STORAGE_KEY,
      nextStep
    );
  };
 
  const setSourceConfig = (
    config: ConnectionValues | null
  ) => {
    setSourceConfigState(config);
 
    if (config) {
      writeSessionStorage(
        SOURCE_CONFIG_STORAGE_KEY,
        config
      );
    } else {
      removeSessionStorage(
        SOURCE_CONFIG_STORAGE_KEY
      );
    }
  };
 
  const setTargetConfig = (
    config: ConnectionValues | null
  ) => {
    setTargetConfigState(config);
 
    if (config) {
      writeSessionStorage(
        TARGET_CONFIG_STORAGE_KEY,
        config
      );
    } else {
      removeSessionStorage(
        TARGET_CONFIG_STORAGE_KEY
      );
    }
  };
 
  const setSessionId = (id: string | null) => {
    setSessionIdState(id);
 
    if (id) {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          SESSION_ID_STORAGE_KEY,
          id
        );
      }
    } else {
      removeSessionStorage(
        SESSION_ID_STORAGE_KEY
      );
    }
  };
 
  const setSourceMetadata = (
    metadata: SourceMetadataResult | null
  ) => {
    setSourceMetadataState(metadata);
 
    if (metadata) {
      writeSessionStorage(
        SOURCE_METADATA_STORAGE_KEY,
        metadata
      );
    } else {
      removeSessionStorage(
        SOURCE_METADATA_STORAGE_KEY
      );
    }
  };
 
  const setTargetMetadata = (
    metadata: TargetMetadataResult | null
  ) => {
    setTargetMetadataState(metadata);
 
    if (metadata) {
      writeSessionStorage(
        TARGET_METADATA_STORAGE_KEY,
        metadata
      );
    } else {
      removeSessionStorage(
        TARGET_METADATA_STORAGE_KEY
      );
    }
  };
 
  const setMappingResult = (
    result: GenerateMappingResult | null
  ) => {
    setMappingResultState(result);
 
    if (result) {
      writeSessionStorage(
        MAPPING_RESULT_STORAGE_KEY,
        result
      );
    } else {
      removeSessionStorage(
        MAPPING_RESULT_STORAGE_KEY
      );
    }
  };
 
  const setMappingPreviewRows = (
    rows: MappingRow[]
  ) => {
    setMappingPreviewRowsState(rows);
 
    writeSessionStorage(
      MAPPING_PREVIEW_STORAGE_KEY,
      rows
    );
  };
 
  const setMappingExported = (
    exported: boolean
  ) => {
    setMappingExportedState(exported);
 
    writeSessionStorage(
      MAPPING_EXPORTED_STORAGE_KEY,
      exported
    );
  };
 
  const setReviewUploadResult = (
    result: UploadResponse | null
  ) => {
    setReviewUploadResultState(result);
 
    if (result) {
      writeSessionStorage(
        REVIEW_UPLOAD_RESULT_STORAGE_KEY,
        result
      );
    } else {
      removeSessionStorage(
        REVIEW_UPLOAD_RESULT_STORAGE_KEY
      );
    }
  };
 
  const setReviewValidationResult = (
    result: ValidationResponse | null
  ) => {
    setReviewValidationResultState(result);
 
    if (result) {
      writeSessionStorage(
        REVIEW_VALIDATION_RESULT_STORAGE_KEY,
        result
      );
    } else {
      removeSessionStorage(
        REVIEW_VALIDATION_RESULT_STORAGE_KEY
      );
    }
  };
 
  /* ============================================================
     STEP COMPLETION
     ============================================================ */
 
  const [done, setDone] = useState<number[]>(() => {
    const currentStep = readStoredStep();
 
    return Array.from(
      {
        length: Math.max(
          0,
          currentStep - 1
        ),
      },
      (_, index) => index + 1
    );
  });
 
  const complete = (id: number) => {
    setDone((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  };
 
  /* ============================================================
     NAVIGATION
     ============================================================ */
 
  /*
   * Used when moving forward.
   *
   * Marks the current step as completed and persists
   * the next step.
   */
  const go = (next: number) => {
    complete(step);
    setStep(next);
 
    const main =
      document.querySelector("main");
 
    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
 
  /*
   * Used when going backwards or selecting a step
   * from the sidebar.
   *
   * It does NOT mark the current step as completed.
   */
  const changeStep = (next: number) => {
    setStep(next);
 
    const main =
      document.querySelector("main");
 
    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };
 
  /* ============================================================
     UI
     ============================================================ */
 
  return (
    <div className="h-screen bg-background overflow-hidden">
      <WorkflowHeader />
 
      <div className="flex h-[calc(100vh-5rem)]">
        <ModernizeSidebar
          step={step}
          done={done}
          onStepChange={changeStep}
        />
 
        <main className="overflow-y-auto w-full px-6 lg:ml-60">
          <div className="p-8 max-w-7xl">
 
            {step === 1 && (
              <SourceConnection
                value={sourceConfig}
                onConnected={(config) => {
                  setSourceConfig(config);
                }}
                onNext={() => go(2)}
              />
            )}
 
            {step === 2 && (
              <TargetConnection
                value={targetConfig}
                onConnected={(config) => {
                  setTargetConfig(config);
                }}
                sourceConfig={sourceConfig}
                onSessionCreated={(id) => {
                  setSessionId(id);
                }}
                onBack={() => changeStep(1)}
                onNext={() => go(3)}
              />
            )}
 
            {step === 3 && (
              <SourceMetadataAnalysis
                sessionId={sessionId}
                sourceConfig={sourceConfig}
                sourceMetadata={sourceMetadata}
                onSourceMetadataChange={
                  setSourceMetadata
                }
                onBack={() => changeStep(2)}
                onNext={() => go(4)}
              />
            )}
 
            {step === 4 && (
              <TargetMetadataAnalysis
                sessionId={sessionId}
                targetConfig={targetConfig}
                targetMetadata={targetMetadata}
                onTargetMetadataChange={
                  setTargetMetadata
                }
                onBack={() => changeStep(3)}
                onNext={() => go(5)}
              />
            )}
 
            {step === 5 && (
              <ColumnMapping
                sessionId={sessionId}
                sourceMetadata={sourceMetadata}
                targetMetadata={targetMetadata}
                mappingResult={mappingResult}
                previewRows={mappingPreviewRows}
                exported={mappingExported}
                onMappingResultChange={
                  setMappingResult
                }
                onPreviewRowsChange={
                  setMappingPreviewRows
                }
                onExportedChange={
                  setMappingExported
                }
                onBack={() => changeStep(4)}
                onNext={() => go(6)}
              />
            )}
 
            {step === 6 && (
              <ReviewApprove
                sessionId={sessionId}
                file={reviewFile}
                uploadResult={reviewUploadResult}
                validationResult={
                  reviewValidationResult
                }
                onFileChange={setReviewFile}
                onUploadResultChange={
                  setReviewUploadResult
                }
                onValidationResultChange={
                  setReviewValidationResult
                }
                onBack={() => changeStep(5)}
                onNext={() => go(7)}
              />
            )}
 
            {step === 7 && (
              <RunMigration
                sessionId={sessionId}
                onBack={() => changeStep(6)}
                onNext={() => go(8)}
              />
            )}
 
          </div>
        </main>
      </div>
    </div>
  );
}
 
 
 