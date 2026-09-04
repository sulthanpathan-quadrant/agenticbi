import { useState } from "react";

import { WorkflowHeader } from "@/components/WorkFlowHeader";

import ModernizeSidebar from "./Modernize/ModernizeSidebar";
import SourceConnection from "./Modernize/SourceConnection";
import TargetConnection from "./Modernize/TargetConnection";

import SourceMetadataAnalysis, {
  type SourceMetadataResult,
} from "./Modernize/SourceMetadataAnalysis";

import TargetMetadataAnalysis from "./Modernize/TargetMetadataAnalysis";

import ColumnMapping from "./Modernize/ColumnMapping";
import ReviewApprove from "./Modernize/ReviewApprove";
import RunMigration from "./Modernize/RunMigration";
import ValidateMigration from "./Modernize/ValidateMigration";

import {
  ConnectionValues,
  type MetadataAnalysisResult,
} from "./Modernize/ModernizeShared";


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
   * Source metadata returned from step2-source-metadata
   * is raw/unclassified metadata.
   */
  const [sourceMetadata, setSourceMetadata] =
    useState<SourceMetadataResult | null>(null);

  /*
   * Target metadata contains the classified UDM
   * metadata returned from target analysis.
   */
  const [targetMetadata, setTargetMetadata] =
    useState<MetadataAnalysisResult | null>(null);


  // =====================================================
  // MARK STEP AS COMPLETED
  // =====================================================

  const complete = (id: number) => {
    setDone((current) =>
      current.includes(id)
        ? current
        : [...current, id]
    );
  };


  // =====================================================
  // MOVE TO NEXT STEP
  // =====================================================

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

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <ModernizeSidebar
          step={step}
          done={done}
          onStepChange={setStep}
        />


        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="overflow-y-auto w-full px-6 lg:ml-60">
          <div className="p-8 max-w-7xl">


            {/* =================================================
                STEP 1 — SOURCE CONNECTION
            ================================================= */}

            {step === 1 && (
              <SourceConnection
                value={sourceConfig}
                onConnected={(config) => {
                  setSourceConfig(config);
                }}
                onNext={() => go(2)}
              />
            )}


            {/* =================================================
                STEP 2 — TARGET CONNECTION
            ================================================= */}

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


            {/* =================================================
                STEP 3 — SOURCE METADATA ANALYSIS
            ================================================= */}

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


            {/* =================================================
                STEP 4 — TARGET METADATA ANALYSIS
            ================================================= */}

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


            {/* =================================================
                STEP 5 — COLUMN MAPPING
            ================================================= */}

            {step === 5 && (
              <ColumnMapping
                sessionId={sessionId}
                sourceMetadata={sourceMetadata}
                targetMetadata={targetMetadata}
                onBack={() => setStep(4)}
                onNext={() => go(6)}
              />
            )}


            {/* =================================================
                STEP 6 — REVIEW & APPROVE
            ================================================= */}

            {step === 6 && (
              <ReviewApprove
                sessionId={sessionId}
                onBack={() => setStep(5)}
                onNext={() => go(7)}
              />
            )}


            {/* =================================================
                STEP 7 — RUN MIGRATION
            ================================================= */}

            {step === 7 && (
              <RunMigration
                sessionId={sessionId}
                onBack={() => setStep(6)}
                onNext={() => go(8)}
              />
            )}


            {/* =================================================
                STEP 8 — VALIDATE MIGRATION
            ================================================= */}

            {step === 8 && (
              <ValidateMigration
                sourceConfig={sourceConfig}
                targetConfig={targetConfig}
                onBack={() => setStep(7)}
                onDone={() => complete(8)}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

