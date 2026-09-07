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

export default function ModernizeData() {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState<number[]>([]);

  const [sourceConfig, setSourceConfig] =
    useState<ConnectionValues | null>(null);

  const [targetConfig, setTargetConfig] =
    useState<ConnectionValues | null>(null);

  const [sessionId, setSessionId] =
    useState<string | null>(null);

  /*
   * step2-source-metadata returns raw, unclassified source
   * metadata — typed as SourceMetadataResult (defined in
   * SourceMetadataAnalysis.tsx).
   *
   * step1-target-analysis returns the classified UDM model
   * WITH a full columns array per table — typed as
   * TargetMetadataResult (defined in TargetMetadataAnalysis.tsx),
   * NOT the generic MetadataAnalysisResult from ModernizeShared,
   * which has no columns field.
   */
  const [sourceMetadata, setSourceMetadata] =
    useState<SourceMetadataResult | null>(null);

  const [targetMetadata, setTargetMetadata] =
    useState<TargetMetadataResult | null>(null);

  /*
   * Lifted out of ColumnMapping so the generated mapping,
   * preview rows, and download status survive navigating away
   * from that step and back — ColumnMapping is unmounted
   * whenever `step` changes, so anything kept in its own local
   * state would otherwise be lost.
   */
  const [mappingResult, setMappingResult] =
    useState<GenerateMappingResult | null>(null);

  const [mappingPreviewRows, setMappingPreviewRows] =
    useState<MappingRow[]>([]);

  const [mappingExported, setMappingExported] =
    useState(false);

  /*
   * Same reasoning as the mapping state above: ReviewApprove
   * unmounts on step change, so its selected file and API
   * results need to live here to survive navigating away and
   * back.
   */
  const [reviewFile, setReviewFile] =
    useState<File | null>(null);

  const [reviewUploadResult, setReviewUploadResult] =
    useState<UploadResponse | null>(null);

  const [reviewValidationResult, setReviewValidationResult] =
    useState<ValidationResponse | null>(null);

  const complete = (id: number) => {
    setDone((current) =>
      current.includes(id) ? current : [...current, id]
    );
  };

  const go = (next: number) => {
    complete(step);
    setStep(next);

    const main = document.querySelector("main");

    if (main) {
      main.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-screen bg-background overflow-hidden">
      <WorkflowHeader />

      <div className="flex h-[calc(100vh-5rem)]">
        <ModernizeSidebar
          step={step}
          done={done}
          onStepChange={setStep}
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
                onBack={() => setStep(1)}
                onNext={() => go(3)}
              />
            )}

            {step === 3 && (
              <SourceMetadataAnalysis
                sessionId={sessionId}
                sourceConfig={sourceConfig}
                sourceMetadata={sourceMetadata}
                onSourceMetadataChange={setSourceMetadata}
                onBack={() => setStep(2)}
                onNext={() => go(4)}
              />
            )}

            {step === 4 && (
              <TargetMetadataAnalysis
                sessionId={sessionId}
                targetConfig={targetConfig}
                targetMetadata={targetMetadata}
                onTargetMetadataChange={setTargetMetadata}
                onBack={() => setStep(3)}
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
                onMappingResultChange={setMappingResult}
                onPreviewRowsChange={setMappingPreviewRows}
                onExportedChange={setMappingExported}
                onBack={() => setStep(4)}
                onNext={() => go(6)}
              />
            )}

            {step === 6 && (
              <ReviewApprove
                sessionId={sessionId}
                file={reviewFile}
                uploadResult={reviewUploadResult}
                validationResult={reviewValidationResult}
                onFileChange={setReviewFile}
                onUploadResultChange={setReviewUploadResult}
                onValidationResultChange={setReviewValidationResult}
                onBack={() => setStep(5)}
                onNext={() => go(7)}
              />
            )}

            {step === 7 && (
              <RunMigration
                sessionId={sessionId}
                onBack={() => setStep(6)}
                onNext={() => go(8)}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
