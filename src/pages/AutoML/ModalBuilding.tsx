// ModalBuilding.tsx
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Database,
  Cpu,
  CheckCircle,
  TrendingUp,
  Play,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useAuth } from "@/contexts/AuthContext";
import { useAuth } from "@/components/contexts/AuthContext";
// import { useChatContext } from "@/contexts/ChatContext";
import { useChatContext } from "@/components/contexts/ChatContext";
import { useEffect, useMemo, useRef, useState } from "react";

type SortMetric = "accuracy" | "f1" | "precision" | "recall" | "rmse" | "auc" | "mae" | "r2" | "mape";

const MetricLabels: Record<SortMetric, string> = {
  accuracy: "Accuracy",
  f1: "F1",
  precision: "Precision",
  recall: "Recall",
  rmse: "RMSE",
  auc: "AUC",
  mae: "MAE",
  r2: "R²",
  mape: "MAPE",
};

const ModalBuilding = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { getSessionByBuildId, openChatWithSession, setIsOpen } =
    useChatContext();
  const [sortBy, setSortBy] = useState<SortMetric>("rmse");
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  // local UI state for fallback message or manual refresh
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, navigate]);

  // Try to find a session that has this build id
  const session = id ? getSessionByBuildId(id) : null;

  // Extract buildData from the session (search for a message with type 'build-complete')
  const buildMessage = useMemo(() => {
    if (!session) return null;
    const found = session.messages?.find(
      (m) => m.type === "build-complete" && (m as any).buildData
    );
    return (found as any) ?? null;
  }, [session]);

  // Combined build data object (from buildMessage.buildData). If none, we display helpful instructions.
  const buildData = buildMessage ? (buildMessage as any).buildData : null;

  // Extract task type from buildData
  const taskType = buildData?.task_type || 'Classification';

  // Update sortBy based on task type
  useEffect(() => {
    if (buildData?.task_type === 'Regression') {
      setSortBy('rmse');
    } else if (buildData?.task_type === 'Classification') {
      setSortBy('accuracy');
    }
  }, [buildData?.task_type]);

  // Compose dataset preview / models from buildData.results if available; otherwise empty
  const datasetInfo =
    buildData?.dataset || buildData?.dataset_name || "Unknown dataset";
  const datasetRows =
    buildData?.rows ?? buildData?.results?.train?.class_distribution
      ? null
      : null;
  // Models information — try to extract from buildData.results.all_models or from a `models` field
  const allModelsFromResults = buildData?.results?.all_models;

  const modelsList = useMemo(() => {
    console.log("=== DEBUG MODEL PARSING ===");
    console.log("allModelsFromResults:", allModelsFromResults);

    if (!allModelsFromResults) {
      console.log(
        "allModelsFromResults is null/undefined - returning empty array"
      );
      return [];
    }

    console.log(
      "allModelsFromResults keys:",
      Object.keys(allModelsFromResults)
    );

    const models: Array<any> = [];

    // Iterate through each model in all_models
    for (const modelName of Object.keys(allModelsFromResults)) {
      const modelData = allModelsFromResults[modelName];
      console.log(`Processing model: ${modelName}`, modelData);

      // Get test metrics (prefer test, fallback to train)
      const metrics = modelData?.test || modelData?.train || {};

      // Get params if available
      const params = modelData?.train?.params || modelData?.params || {};

      models.push({
        name: modelName,
        type: "Model",
        params: params,
        metrics: metrics,
      });
    }

    console.log("Final models array:", models);
    return models;
  }, [allModelsFromResults]);

  // Derive "best model" from buildData.results.best_model or from modelsList sorted by chosen metric.
  const bestModel = useMemo(() => {
    if (buildData?.results?.best_model) {
      const bestModelName = buildData.results.best_model;
      return modelsList.find((m) => m.name === bestModelName) || null;
    }

    if (modelsList.length === 0) return null;

    // Fallback: sort by selected metric
    const copy = [...modelsList];
    copy.sort((a, b) => {
      const aVal = a.metrics?.[sortBy];
      const bVal = b.metrics?.[sortBy];
      if (sortBy === "rmse") return (aVal ?? Infinity) - (bVal ?? Infinity);
      return (bVal ?? -Infinity) - (aVal ?? -Infinity);
    });
    return copy[0] ?? null;
  }, [buildData, modelsList, sortBy]);

  // A defensive "open chat" button behavior (find session by buildId or just open chat)
  const handleContinueChat = () => {
  if (!id) return;
  if (session) {
    // If session exists, open that chat
    openChatWithSession(session.id);
  } else {
    // just open the UI chat
    setIsOpen(true);
  }
  // Navigate to home page (or jobs page)
  navigate('/jobs'); // or navigate('/') depending on your route
};
  // const handleRunInference = () => {
  //   navigate("/", { state: { scrollTo: "inference" } });
  // };

  // If we have no build data, show helpful instructions and option to open the chat (where build happened)
  if (!buildData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 bg-card backdrop-blur-sm border-b border-border z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back to Home</span>
            </motion.button>

            <div className="flex items-center gap-3">
              <Button
                ref={continueButtonRef}
                variant="outline"
                size="sm"
                onClick={handleContinueChat}
                className="gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Continue Chat
              </Button>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-foreground">
                  No Build Data
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Model Build Results
            </h1>
            <p className="text-muted-foreground text-sm">
              Build ID: {id ?? "-"}
            </p>
          </motion.div>

          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              No build details found
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't find saved build results for this build id. This
              usually means:
            </p>
            <ul className="list-disc ml-6 text-sm text-muted-foreground mb-4">
              <li>
                The build completed but wasn't saved to the chat session (race
                condition).
              </li>
              <li>
                You opened this page directly (deep link) and the app doesn't
                have the build stored locally.
              </li>
              <li>The build id in the URL is incorrect or trimmed.</li>
            </ul>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/")}>
                Back Home
              </Button>
              <Button onClick={handleContinueChat}>Open Chat</Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              Tip: Open the chat where you built the model — the build results
              are saved there and we will display them here once available.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Build data exists — render the actual UI using buildData & modelsList
  // Format helper for numeric metrics
  const fmt = (v: any, isPercentage: boolean = false) => {
    if (v === null || v === undefined) return "-";
    if (typeof v === "number") {
      if (isPercentage && v <= 1) {
        // Convert decimal to percentage (0.778 → 77.8%)
        return (Math.round(v * 1000) / 10).toFixed(1);
      }
      return Number.isFinite(v)
        ? (Math.round(v * 1000) / 1000).toString()
        : String(v);
    }
    return String(v);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 bg-card backdrop-blur-sm border-b border-border z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Home</span>
          </motion.button>

          <div className="flex items-center gap-3">
            <Button
              ref={continueButtonRef}
              variant="outline"
              size="sm"
              onClick={handleContinueChat}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Continue Chat
            </Button>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span className="text-sm font-medium text-foreground">
                Build Complete
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Model Build Results
          </h1>
          <p className="text-muted-foreground text-sm">
            Build ID: {buildData?.buildId ?? id} | Task: {taskType}
          </p>
        </motion.div>

        {/* Dataset Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl overflow-hidden mb-6"
        >
          <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Dataset Used
            </h2>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-1">Source File</p>
              <p className="text-sm font-medium text-foreground">
                {buildData?.dataset ?? buildData?.blob_file_used ?? "Unknown"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-secondary/30 p-2 rounded">
                <p className="text-xs text-muted-foreground">Rows</p>
                <p className="text-sm font-semibold text-foreground">
                  {(() => {
                    // Try to get rows from buildData
                    if (buildData?.rows) return buildData.rows.toLocaleString();

                    // Calculate from train class_distribution
                    const gradientBoostingTrain =
                      buildData?.results?.all_models?.gradient_boosting?.train;
                    if (gradientBoostingTrain?.class_distribution) {
                      const total = Object.values(
                        gradientBoostingTrain.class_distribution
                      ).reduce((a: number, b: number) => a + b, 0);
                      return total.toLocaleString();
                    }

                    // Fallback: try any model's train class_distribution
                    const allModels = buildData?.results?.all_models;
                    if (allModels) {
                      for (const modelName of Object.keys(allModels)) {
                        const classDist =
                          allModels[modelName]?.train?.class_distribution;
                        if (classDist) {
                          const total = Object.values(classDist).reduce(
                            (a: number, b: number) => a + b,
                            0
                          );
                          return total.toLocaleString();
                        }
                      }
                    }

                    return "-";
                  })()}
                </p>
              </div>
              <div className="bg-secondary/30 p-2 rounded">
                <p className="text-xs text-muted-foreground">Columns</p>
                <p className="text-sm font-semibold text-foreground">
                  {buildData?.columns ?? "-"}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <div className="overflow-x-auto">
              <table className="data-table text-xs w-full">
                <thead>
                  <tr>
                    {buildData?.preview && buildData.preview.length > 0 ? (
                      Object.keys(buildData.preview[0])
                        .slice(0, 8)
                        .map((h) => (
                          <th
                            key={h}
                            className="px-4 py-3 text-left text-xs font-medium text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))
                    ) : (
                      <>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                          No preview
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {buildData?.preview && buildData.preview.length > 0 ? (
                    buildData.preview
                      .slice(0, 8)
                      .map((row: any, idx: number) => (
                        <tr key={idx}>
                          {Object.keys(row)
                            .slice(0, 8)
                            .map((k) => (
                              <td key={k} className="px-4 py-3">
                                {String(row[k])}
                              </td>
                            ))}
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-muted-foreground">
                        No preview rows available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              {buildData?.preview
                ? `Showing ${buildData.preview.length} preview rows`
                : "No preview"}
            </p>
          </div>
        </motion.div>

        {/* Metric Selection Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-4 rounded-xl mb-4"
        >
          <h3 className="text-sm font-medium text-foreground mb-3">
            Best Performing By:
          </h3>
          <Tabs
            value={sortBy}
            onValueChange={(v) => setSortBy(v as SortMetric)}
            className="w-full"
          >
            <TabsList className={`grid w-full ${taskType === 'Regression' ? 'grid-cols-4' : 'grid-cols-6'}`}>
              {taskType === 'Regression' ? (
                <>
                  <TabsTrigger value="rmse">RMSE</TabsTrigger>
                  <TabsTrigger value="mae">MAE</TabsTrigger>
                  <TabsTrigger value="r2">R²</TabsTrigger>
                  <TabsTrigger value="mape">MAPE</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                  <TabsTrigger value="f1">F1</TabsTrigger>
                  <TabsTrigger value="precision">Precision</TabsTrigger>
                  <TabsTrigger value="recall">Recall</TabsTrigger>
                  <TabsTrigger value="auc">AUC</TabsTrigger>
                </>
              )}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Best Performing Model */}
        {bestModel && (
          <motion.div
            key={sortBy}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-xl overflow-hidden mb-6 border-2 border-primary/30"
          >
            <div className="px-4 py-3 bg-primary/10 border-b border-border flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">
                Best Performing Model
              </h2>
              <span className="ml-auto text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                Best by {sortBy.toUpperCase()} (
                {taskType === 'Regression' 
                  ? fmt(bestModel.metrics?.[sortBy])
                  : fmt(bestModel.metrics?.[sortBy], true) + '%'
                })
              </span>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-primary mb-1">
                  {bestModel.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {bestModel.type ?? "Model"}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Parameters</p>
                <div className="flex flex-wrap gap-2">
                  {bestModel.params &&
                  Object.keys(bestModel.params).length > 0 ? (
                    Object.entries(bestModel.params).map(([key, value]) => (
                      <span
                        key={key}
                        className="text-xs bg-secondary/50 px-2 py-1 rounded text-foreground"
                      >
                        {key}:{" "}
                        <span className="font-medium">{String(value)}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      No params available
                    </span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-3">
                  Performance Metrics
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {taskType === 'Regression' ? (
                    <>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          RMSE
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.rmse)}
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          MAE
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.mae)}
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          R²
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.r2)}
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          MAPE
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.mape)}
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          MSE
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.mse)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Accuracy
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.accuracy, true)}%
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          F1 Score
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.f1, true)}%
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Precision
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.precision, true)}%
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          Recall
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(bestModel.metrics?.recall, true)}%
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/30 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-0.5">
                          AUC
                        </p>
                        <p className="text-xl font-semibold text-primary">
                          {fmt(
                            bestModel.metrics?.roc_auc ??
                              bestModel.metrics?.auc ??
                              "-"
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other Models Ranked List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl overflow-hidden mb-6"
        >
          <div className="px-4 py-3 bg-secondary/30 border-b border-border flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">
              Other Models (Ranked)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Rank
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Model
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                    {MetricLabels[sortBy]}
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {modelsList.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3" colSpan={5}>
                      No model list available
                    </td>
                  </tr>
                ) : (
                  modelsList
                    .sort((a, b) => {
                      const aVal =
                        a.metrics?.[sortBy] ??
                        (sortBy === "rmse" ? Infinity : -Infinity);
                      const bVal =
                        b.metrics?.[sortBy] ??
                        (sortBy === "rmse" ? Infinity : -Infinity);
                      if (sortBy === "rmse") return aVal - bVal;
                      return bVal - aVal;
                    })
                    .map((model, index) => (
                      <tr
                        key={model.name}
                        className="border-b border-border hover:bg-secondary/20"
                      >
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {model.name}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 text-xs rounded bg-secondary text-muted-foreground">
                            {model.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-foreground">
                          {taskType === 'Regression'
                            ? fmt(model.metrics?.[sortBy])
                            : fmt(model.metrics?.[sortBy], true) + '%'
                          }
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-4"
        >
          <Button variant="outline" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Artifacts
          </Button>
          {/*<Button className="flex-1 bg-primary hover:bg-primary/90" onClick={handleRunInference}>
            <Play className="w-4 h-4 mr-2" />
            Run Inference
          </Button>*/}
        </motion.div>
      </main>
    </div>
  );
};

export default ModalBuilding;