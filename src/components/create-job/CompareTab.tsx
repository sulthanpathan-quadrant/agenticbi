// import { useState, useMemo, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { ArrowLeft, GitCompare } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// // import { ImportedDataset } from '@/components/modals/UnifiedImportModal'
// import { ImportedDataset } from "../modals/UnifiedImportModal";
// import { useLocation } from "react-router-dom";
// import Header from "../layout/Header";
// import { toast } from "sonner";

// interface CompareTabProps {
//   dataset?: ImportedDataset | null;
// }

// type MetricSpec = { key: string; label: string; isLowerBetter?: boolean };

// const modelsByTask: Record<string, string[]> = {
//   Classification: [
//     "Logistic Regression",
//     "Random Forest",
//     "Gradient Boosting",
//     "XGBoost",
//   ],
//   Regression: ["Ridge", "Random Forest", "Gradient Boosting", "XGBoost"],
//   Forecasting: ["ARIMA", "Prophet", "XGBoost", "LightGBM", "CatBoost"],
//   Clustering: ["KMeans", "KMeans++", "DBSCAN", "GMM"],
//   "Anomaly Detection": [
//     "Isolation Forest",
//     "One-Class SVM",
//     "Local Outlier Factor (LOF)",
//     "Elliptic Envelope",
//   ],
// };

// const metricsByTask: Record<string, MetricSpec[]> = {
//   Classification: [
//     { key: "accuracy", label: "Accuracy" },
//     { key: "f1", label: "F1 Score" },
//     { key: "precision", label: "Precision" },
//     { key: "recall", label: "Recall" },
//     { key: "roc_auc", label: "ROC-AUC" },
//     { key: "precision_recall_auc", label: "PR-AUC" },
//   ],
//   Regression: [
//     { key: "rmse", label: "RMSE", isLowerBetter: true },
//     { key: "mae", label: "MAE", isLowerBetter: true },
//     { key: "r2", label: "R²" },
//     { key: "mape", label: "MAPE", isLowerBetter: true },
//     { key: "mean_residual", label: "Mean Residual", isLowerBetter: true },
//     { key: "std_residual", label: "Std Residual", isLowerBetter: true },
//     { key: "pred_mean", label: "Pred Mean" },
//     { key: "pred_std", label: "Pred Std" },
//   ],
//   Forecasting: [
//     { key: "rmse", label: "RMSE", isLowerBetter: true },
//     { key: "mae", label: "MAE", isLowerBetter: true },
//     { key: "r2", label: "R²" },
//     { key: "mape", label: "MAPE", isLowerBetter: true },
//     { key: "mse", label: "MSE", isLowerBetter: true },
//     { key: "mean_residual", label: "Mean Residual", isLowerBetter: true },
//     { key: "std_residual", label: "Std Residual", isLowerBetter: true },
//     { key: "pred_mean", label: "Pred Mean" },
//     { key: "pred_std", label: "Pred Std" },
//   ],
//   Clustering: [
//     { key: "n_clusters", label: "Number of Clusters" },
//     { key: "n_noise_points", label: "Noise Points" },
//     { key: "silhouette_score", label: "Silhouette Score" },
//     {
//       key: "davies_bouldin_score",
//       label: "Davies-Bouldin",
//       isLowerBetter: true,
//     },
//     { key: "calinski_harabasz", label: "Calinski-Harabasz" },
//   ],
//   "Anomaly Detection": [
//     { key: "n_anomalies", label: "Number of Anomalies" },
//     { key: "anomaly_percentage", label: "Anomaly Percentage (%)" },
//     { key: "anomaly_score", label: "Anomaly Score" },
//     { key: "avg_anomaly_score", label: "Avg Anomaly Score" },
//     { key: "std_anomaly_score", label: "Std Anomaly Score" },
//     { key: "min_anomaly_score", label: "Min Anomaly Score" },
//     { key: "max_anomaly_score", label: "Max Anomaly Score" },
//   ],
// };

// // Best-effort mapping from human model name -> API key (extendable)
// function modelNameToApiKey(name: string) {
//   if (!name) return name;
//   const mapping: Record<string, string> = {
//     "Logistic Regression": "logistic_regression",
//     "Random Forest": "random_forest",
//     "Gradient Boosting": "gradient_boosting",
//     XGBoost: "xgboost",
//     Ridge: "ridge",
//     ARIMA: "arima",
//     Prophet: "prophet",
//     LightGBM: "lightgbm",
//     CatBoost: "catboost",
//     KMeans: "kmeans",
//     "KMeans++": "kmeans_plusplus",
//     DBSCAN: "dbscan",
//     GMM: "gmm",
//     "Isolation Forest": "isolation_forest",
//     "One-Class SVM": "one_class_svm",
//     "Local Outlier Factor (LOF)": "lof",
//     "Elliptic Envelope": "elliptic_envelope",
//   };
//   if (mapping[name]) return mapping[name];
//   return name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
// }

// // Generates mock values appropriate for given task + metric
// function generateMockMetricsForTask(task: string) {
//   const specs = metricsByTask[task] || [];
//   const obj: Record<string, string> = {};
//   specs.forEach((spec) => {
//     // realistic ranges:
//     if (
//       spec.key === "accuracy" ||
//       spec.key === "auc" ||
//       spec.key === "f1_score" ||
//       spec.key === "precision" ||
//       spec.key === "recall" ||
//       spec.key === "roc_auc" ||
//       spec.key === "precision_recall_auc"
//     ) {
//       const val = 0.7 + Math.random() * 0.3; // 0.7 - 1.0
//       obj[spec.key] = (val * 100).toFixed(1) + "%";
//     } else if (
//       spec.key === "rmse" ||
//       spec.key === "mae" ||
//       spec.key === "mse" ||
//       spec.key === "std_residual"
//     ) {
//       obj[spec.key] = (0.05 + Math.random() * 1.0).toFixed(4);
//     } else if (spec.key === "r2") {
//       obj[spec.key] = (Math.random() * 1).toFixed(4);
//     } else if (spec.key === "mape") {
//       obj[spec.key] = (5 + Math.random() * 50).toFixed(2) + "%";
//     } else if (spec.key === "mean_residual") {
//       obj[spec.key] = ((Math.random() - 0.5) * 0.1).toFixed(6);
//     } else if (spec.key === "pred_mean" || spec.key === "pred_std") {
//       obj[spec.key] = (Math.random() * 0.5).toFixed(4);
//     } else if (spec.key === "silhouette") {
//       obj[spec.key] = (0.2 + Math.random() * 0.8).toFixed(3);
//     } else if (spec.key === "davies_bouldin") {
//       obj[spec.key] = (0.2 + Math.random() * 3.0).toFixed(3);
//     } else if (spec.key === "calinski_harabasz") {
//       obj[spec.key] = Math.round(50 + Math.random() * 2000).toString();
//     } else if (spec.key === "anomaly_score") {
//       obj[spec.key] = (Math.random() * 1).toFixed(4);
//     } else {
//       // default numeric
//       obj[spec.key] = (Math.random() * 1).toFixed(4);
//     }
//   });
//   return obj;
// }

// const CompareTab = ({}: CompareTabProps) => {
//   const navigate = useNavigate();
//   const [selectedTask, setSelectedTask] = useState(""); // previously selectedFunction
//   const [selectedModel1, setSelectedModel1] = useState("");
//   const [selectedModel2, setSelectedModel2] = useState("");
//   const [selectedFeature, setSelectedFeature] = useState<"all" | string>("all");
//   const [isComparing, setIsComparing] = useState(false);
//   const [comparisonComplete, setComparisonComplete] = useState(false);
//   const [model1Metrics, setModel1Metrics] = useState<Record<
//     string,
//     any
//   > | null>(null);
//   const [model2Metrics, setModel2Metrics] = useState<Record<
//     string,
//     any
//   > | null>(null);
//   const [apiResponseRaw, setApiResponseRaw] = useState<any | null>(null);
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [blobPath, setBlobPath] = useState<string | null>(null);
//   const location = useLocation();
//   const [allTaskFeatures, setAllTaskFeatures] = useState<any>(null);
//   const [blobPathReady, setBlobPathReady] = useState(false);
//   const filePath = (location.state as any)?.filePath || "";
//   const datasetName = (location.state as any)?.datasetName || "";

//   const cameFromHub = location.state?.origin === "automlhub";

//   useEffect(() => {
//     if (!filePath) return;

//     const registerFile = async () => {
//       const userEmail = getUserEmailFromLocal();
//       if (!userEmail) return;

//       try {
//         const params = new URLSearchParams();
//         params.append("file_path", filePath);
//         params.append("upload_file_path", "true");
//         params.append("user_email", userEmail);
//         params.append("optuna_trials", "2");
//         params.append("preprocessing_mode", "simple");
//         params.append("use_cleaning", "true");
//         params.append("use_optuna", "true");
//         params.append("test_size", "0.2");
//         params.append("time_budget", "180");
//         params.append("horizon", "12");

//         const res = await fetch(
//           "https://api.veriton.ai/api/service3/build_ml_model_v",
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//               accept: "application/json",
//             },
//             body: params.toString(),
//           },
//         );

//         if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

//         const json = await res.json();
//         setBlobPath(json.blob_path);

//         if (json.features?.tasks) {
//           setAllTaskFeatures(json.features.tasks);
//         }

//         setBlobPathReady(true);
//       } catch (err) {
//         console.error("File registration error:", err);
//       }
//     };

//     registerFile();
//   }, [filePath]);

//   // Reset models & results when task changes
//   useEffect(() => {
//     setSelectedModel1("");
//     setSelectedModel2("");
//     setComparisonComplete(false);
//     setModel1Metrics(null);
//     setModel2Metrics(null);
//     setApiResponseRaw(null);
//     setErrorMessage(null);
//     setSelectedFeature("all");
//   }, [selectedTask]);

//   const availableModels = useMemo(() => {
//     return selectedTask ? modelsByTask[selectedTask] || [] : [];
//   }, [selectedTask]);

//   const taskSpecificFeatures = useMemo(() => {
//     if (!allTaskFeatures || !selectedTask) return [];
//     const taskKey = selectedTask.toLowerCase().replace(/\s+/g, "_");
//     return allTaskFeatures[taskKey]?.features || [];
//   }, [allTaskFeatures, selectedTask]);

//   const getUserEmailFromLocal = (): string | null => {
//     try {
//       const raw = localStorage.getItem("aivolve_user");
//       if (!raw) return null;
//       const parsed = JSON.parse(raw);
//       return parsed?.email ?? null;
//     } catch {
//       return null;
//     }
//   };

//   const getUserFromLocalStorage = () => {
//     try {
//       const raw = localStorage.getItem("aivolve_user");
//       if (!raw) return null;
//       return JSON.parse(raw) as {
//         email?: string;
//         session_id?: string;
//         user_id?: string;
//         agent_name?: string;
//         [key: string]: any;
//       };
//     } catch {
//       return null;
//     }
//   };

//   // const fetchFullData = async (blobPath: string, userEmail: string) => {
//   //   const url = `${FULL_DATA_URL}?blob_path=${encodeURIComponent(
//   //     blobPath
//   //   )}&user_email=${encodeURIComponent(userEmail)}`
//   //   const res = await fetch(url)
//   //   if (!res.ok) {
//   //     throw new Error('Failed to fetch full data')
//   //   }
//   //   const text = await res.text()
//   //   const blob = new Blob([text], { type: 'text/csv' })
//   //   return new File([blob], dataset!.name, { type: 'text/csv' })
//   // }

//   const canCompare = !!(
//     selectedTask &&
//     selectedModel1 &&
//     selectedModel2 &&
//     selectedModel1 !== selectedModel2
//   );

//   const fetchAndCompare = async () => {
//     setErrorMessage(null);
//     setIsComparing(true);
//     setComparisonComplete(false);
//     setModel1Metrics(null);
//     setModel2Metrics(null);
//     setApiResponseRaw(null);

//     const userEmail = getUserEmailFromLocal();
//     if (!userEmail) {
//       setErrorMessage("User email not found. Please login again.");
//       setIsComparing(false);
//       return;
//     }

//     if (!blobPath) {
//       setErrorMessage(
//         "Dataset not ready. Please wait or go back and try again.",
//       );
//       setIsComparing(false);
//       return;
//     }

//     try {
//       const params = new URLSearchParams();
//       params.append("file_path", filePath);
//       params.append("upload_file_path", "false");
//       params.append("user_email", userEmail);
//       params.append("task", selectedTask.toLowerCase().replace(/\s+/g, "_"));
//       params.append("target", selectedFeature === "all" ? "" : selectedFeature);
//       const model1Key = modelNameToApiKey(selectedModel1);
//       const model2Key = modelNameToApiKey(selectedModel2);
//       params.append("models", `${model1Key} , ${model2Key}`);
//       params.append("optuna_trials", "2");
//       params.append("preprocessing_mode", "simple");
//       params.append("use_cleaning", "true");
//       params.append("use_optuna", "true");
//       params.append("use_feature_selection", "false");
//       params.append("test_size", "0.2");
//       params.append("time_budget", "300");
//       params.append("horizon", "12");

//       const res = await fetch(
//         "https://api.veriton.ai/api/service3/build_ml_model_v",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             accept: "application/json",
//           },
//           body: params.toString(),
//         },
//       );

//       if (!res.ok) {
//         const txt = await res.text();
//         throw new Error(`API error ${res.status}: ${txt}`);
//       }

//       const json = await res.json();
//       setApiResponseRaw(json);

//       const allModels = json?.all_models ?? {};

//       const findKey = (k: string | null) => {
//         if (!k) return null;
//         if (allModels[k]) return k;
//         const lower = k.toLowerCase();
//         const candidate = Object.keys(allModels).find(
//           (c) => c.toLowerCase() === lower,
//         );
//         if (candidate) return candidate;
//         const candidate2 = Object.keys(allModels).find((c) =>
//           c.toLowerCase().includes(lower),
//         );
//         if (candidate2) return candidate2;
//         return null;
//       };

//       const real1 = findKey(modelNameToApiKey(selectedModel1));
//       const real2 = findKey(modelNameToApiKey(selectedModel2));

//       const pickMetrics = (obj: any) => {
//         if (!obj) return null;
//         return { train: obj.train ?? null, test: obj.test ?? null };
//       };

//       setModel1Metrics(real1 ? pickMetrics(allModels[real1]) : null);
//       setModel2Metrics(real2 ? pickMetrics(allModels[real2]) : null);
//       setComparisonComplete(true);
//     } catch (err: any) {
//       console.error("Compare API error", err);
//       setErrorMessage(err?.message || "Error calling compare API.");
//     } finally {
//       setIsComparing(false);
//     }
//   };
//   // compare two metric values based on whether lower is better
//   const compareMetric = (
//     key: string,
//     a: any,
//     b: any,
//     isLowerBetter = false,
//   ) => {
//     if (a == null && b == null) return { aClass: "", bClass: "" };
//     // parse percent strings and numeric strings
//     const toNum = (v: any) => {
//       if (v == null) return NaN;
//       if (typeof v === "string" && v.includes("%"))
//         return parseFloat(v.replace("%", ""));
//       return parseFloat(String(v));
//     };
//     const na = toNum(a);
//     const nb = toNum(b);
//     if (isNaN(na) || isNaN(nb)) return { aClass: "", bClass: "" };
//     if (isLowerBetter) {
//       if (na < nb)
//         return {
//           aClass: "text-success font-semibold",
//           bClass: "text-muted-foreground",
//         };
//       if (nb < na)
//         return {
//           aClass: "text-muted-foreground",
//           bClass: "text-success font-semibold",
//         };
//     } else {
//       if (na > nb)
//         return {
//           aClass: "text-success font-semibold",
//           bClass: "text-muted-foreground",
//         };
//       if (nb > na)
//         return {
//           aClass: "text-muted-foreground",
//           bClass: "text-success font-semibold",
//         };
//     }
//     return { aClass: "text-foreground", bClass: "text-foreground" };
//   };

//   const renderMetricValue = (v: any) => {
//     if (v == null) return "—";

//     // If it's a string with %, return as is
//     if (typeof v === "string" && v.includes("%")) {
//       return v;
//     }

//     // Convert to number and check if it's valid
//     const num = typeof v === "number" ? v : parseFloat(String(v));

//     // If it's a valid number, format to 5 decimal places
//     if (!isNaN(num)) {
//       return num.toFixed(5);
//     }

//     // Otherwise return as string
//     return String(v);
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Header />

//       <main className="pt-6 px-8 pb-16 max-w-[1400px] mx-auto">
//         {/* Back button + title */}
//         <div className="mb-8 flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             <div>
//               <h1 className="text-3xl font-semibold text-foreground">
//                 Compare Models
//               </h1>
//               <p className="text-muted-foreground mt-1">
//                 Compare performance of two models on the same dataset
//                 {datasetName && ` — ${datasetName}`}
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             <Button
//               variant="outline"
//               onClick={() => {
//                 if (cameFromHub) {
//                   navigate("/workflow/automl/automlhub"); // or wherever AutoMLHub is mounted
//                 } else {
//                   navigate("/workflow/automl"); // same destination, but different label below
//                   // If you have a real "Jobs" list page, change to: navigate('/jobs' or '/dashboard')
//                 }
//               }}
//             >
//               {cameFromHub ? "Back to Preview" : "Back to Jobs"}
//             </Button>
//           </div>
//         </div>

//         {/* Configuration Card */}
//         <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
//           <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
//             <GitCompare className="w-5 h-5 text-primary" />
//             Comparison Setup
//           </h3>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
//             {/* Task */}
//             <div>
//               <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
//                 Function
//               </label>
//               <Select value={selectedTask} onValueChange={setSelectedTask}>
//                 <SelectTrigger className="bg-background">
//                   <SelectValue placeholder="Select task" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {Object.keys(modelsByTask).map((task) => (
//                     <SelectItem key={task} value={task}>
//                       {task}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Model 1 */}
//             <div>
//               <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
//                 Model 1
//               </label>
//               <Select
//                 value={selectedModel1}
//                 onValueChange={setSelectedModel1}
//                 disabled={!selectedTask}
//               >
//                 <SelectTrigger className="bg-background">
//                   <SelectValue
//                     placeholder={
//                       selectedTask ? "Select Model 1" : "Select task first"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableModels.map((m) => (
//                     <SelectItem
//                       key={m}
//                       value={m}
//                       disabled={m === selectedModel2}
//                     >
//                       {m}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Model 2 */}
//             <div>
//               <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
//                 Model 2
//               </label>
//               <Select
//                 value={selectedModel2}
//                 onValueChange={setSelectedModel2}
//                 disabled={!selectedTask}
//               >
//                 <SelectTrigger className="bg-background">
//                   <SelectValue
//                     placeholder={
//                       selectedTask ? "Select Model 2" : "Select task first"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {availableModels.map((m) => (
//                     <SelectItem
//                       key={m}
//                       value={m}
//                       disabled={m === selectedModel1}
//                     >
//                       {m}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Target Feature */}
//             <div>
//               <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
//                 Target Column
//               </label>
//               <Select
//                 value={selectedFeature === "all" ? "all" : selectedFeature}
//                 onValueChange={(v) => setSelectedFeature(v as "all" | string)}
//                 disabled={!selectedTask || !blobPathReady}
//               >
//                 <SelectTrigger className="bg-background">
//                   <SelectValue
//                     placeholder={
//                       !blobPathReady
//                         ? "Loading targets..."
//                         : selectedTask
//                           ? "Select target"
//                           : "Select task first"
//                     }
//                   />
//                 </SelectTrigger>
//                 <SelectContent className="max-h-64">
//                   <SelectItem value="all">All features (auto)</SelectItem>
//                   {!blobPathReady ? (
//                     <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
//                       <svg
//                         className="animate-spin h-3 w-3"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8v8z"
//                         ></path>
//                       </svg>
//                       Loading targets...
//                     </div>
//                   ) : taskSpecificFeatures.length > 0 ? (
//                     taskSpecificFeatures.map((col) => (
//                       <SelectItem key={col} value={col}>
//                         {col}
//                       </SelectItem>
//                     ))
//                   ) : (
//                     <div className="px-3 py-2 text-sm text-muted-foreground">
//                       No targets available
//                     </div>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {errorMessage && (
//             <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
//               {errorMessage}
//             </div>
//           )}

//           <div className="mt-6">
//             <Button
//               onClick={fetchAndCompare}
//               disabled={!canCompare || isComparing || !blobPathReady}
//               size="lg"
//             >
//               {isComparing ? "Comparing..." : "Compare Models"}
//             </Button>
//           </div>
//         </div>

//         {/* Results */}
//         {comparisonComplete && (model1Metrics || model2Metrics) && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="space-y-4"
//           >
//             <div className="bg-card rounded-xl border border-border p-5">
//               <h4 className="text-base font-semibold text-foreground mb-4">
//                 Comparison Summary
//               </h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                 <div>
//                   <span className="text-muted-foreground">Task:</span>
//                   <span className="ml-2 text-foreground font-medium">
//                     {selectedTask}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Model 1:</span>
//                   <span className="ml-2 text-primary font-medium">
//                     {selectedModel1}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Model 2:</span>
//                   <span className="ml-2 text-primary font-medium">
//                     {selectedModel2}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-muted-foreground">Target:</span>
//                   <span className="ml-2 text-foreground font-medium">
//                     {selectedFeature === "all"
//                       ? "All features"
//                       : selectedFeature}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="p-4 border-b border-border">
//                 <h3 className="text-sm font-semibold text-foreground">
//                   Model Comparison Results
//                 </h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-muted/30">
//                       <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider border-b border-border">
//                         Model Name
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border">
//                         Metrics
//                       </th>
//                       {(metricsByTask[selectedTask] || []).map((spec) => (
//                         <th
//                           key={spec.key}
//                           className="px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border"
//                         >
//                           {spec.label}
//                         </th>
//                       ))}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {/* Model 1 - Train Row */}
//                     <tr className="border-b border-border/50">
//                       <td
//                         className="px-4 py-4 font-bold text-blue-500 text-primary border-r border-border"
//                         rowSpan={2}
//                       >
//                         {selectedModel1}
//                       </td>
//                       <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
//                         Train
//                       </td>
//                       {(metricsByTask[selectedTask] || []).map((spec) => {
//                         const value = model1Metrics?.train
//                           ? (model1Metrics.train[spec.key] ??
//                             model1Metrics.train[spec.key.replace(/\./g, "_")])
//                           : null;
//                         return (
//                           <td
//                             key={spec.key}
//                             className="px-4 py-3 text-center text-sm text-foreground"
//                           >
//                             {renderMetricValue(value)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                     {/* Model 1 - Test Row */}
//                     <tr className="border-b border-border">
//                       <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
//                         Test
//                       </td>
//                       {(metricsByTask[selectedTask] || []).map((spec) => {
//                         const value = model1Metrics?.test
//                           ? (model1Metrics.test[spec.key] ??
//                             model1Metrics.test[spec.key.replace(/\./g, "_")])
//                           : null;
//                         return (
//                           <td
//                             key={spec.key}
//                             className="px-4 py-3 text-center text-sm text-foreground"
//                           >
//                             {renderMetricValue(value)}
//                           </td>
//                         );
//                       })}
//                     </tr>

//                     {/* Model 2 - Train Row */}
//                     <tr className="border-b border-border/50">
//                       <td
//                         className="px-4 py-4 font-bold text-purple-500 text-primary border-r border-border"
//                         rowSpan={2}
//                       >
//                         {selectedModel2}
//                       </td>
//                       <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
//                         Train
//                       </td>
//                       {(metricsByTask[selectedTask] || []).map((spec) => {
//                         const value = model2Metrics?.train
//                           ? (model2Metrics.train[spec.key] ??
//                             model2Metrics.train[spec.key.replace(/\./g, "_")])
//                           : null;
//                         return (
//                           <td
//                             key={spec.key}
//                             className="px-4 py-3 text-center text-sm text-foreground"
//                           >
//                             {renderMetricValue(value)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                     {/* Model 2 - Test Row */}
//                     <tr className="border-b border-border">
//                       <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
//                         Test
//                       </td>
//                       {(metricsByTask[selectedTask] || []).map((spec) => {
//                         const value = model2Metrics?.test
//                           ? (model2Metrics.test[spec.key] ??
//                             model2Metrics.test[spec.key.replace(/\./g, "_")])
//                           : null;
//                         return (
//                           <td
//                             key={spec.key}
//                             className="px-4 py-3 text-center text-sm text-foreground"
//                           >
//                             {renderMetricValue(value)}
//                           </td>
//                         );
//                       })}
//                     </tr>
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default CompareTab;


import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import { ImportedDataset } from '@/components/modals/UnifiedImportModal'
import { ImportedDataset } from "../modals/UnifiedImportModal";
import { useLocation } from "react-router-dom";
import Header from "../layout/Header";
import { toast } from "sonner";

interface CompareTabProps {
  dataset?: ImportedDataset | null;
}

type MetricSpec = { key: string; label: string; isLowerBetter?: boolean };

const modelsByTask: Record<string, string[]> = {
  Classification: [
    "Logistic Regression",
    "Random Forest",
    "Gradient Boosting",
    "XGBoost",
  ],
  Regression: ["Ridge", "Random Forest", "Gradient Boosting", "XGBoost"],
  Forecasting: ["ARIMA", "Prophet", "XGBoost", "LightGBM", "CatBoost"],
  Clustering: ["KMeans", "KMeans++", "DBSCAN", "GMM"],
  "Anomaly Detection": [
    "Isolation Forest",
    "One-Class SVM",
    "Local Outlier Factor (LOF)",
    "Elliptic Envelope",
  ],
};

const metricsByTask: Record<string, MetricSpec[]> = {
  Classification: [
    { key: "accuracy", label: "Accuracy" },
    { key: "f1", label: "F1 Score" },
    { key: "precision", label: "Precision" },
    { key: "recall", label: "Recall" },
    { key: "roc_auc", label: "ROC-AUC" },
    { key: "precision_recall_auc", label: "PR-AUC" },
  ],
  Regression: [
    { key: "rmse", label: "RMSE", isLowerBetter: true },
    { key: "mae", label: "MAE", isLowerBetter: true },
    { key: "r2", label: "R²" },
    { key: "mape", label: "MAPE", isLowerBetter: true },
    { key: "mean_residual", label: "Mean Residual", isLowerBetter: true },
    { key: "std_residual", label: "Std Residual", isLowerBetter: true },
    { key: "pred_mean", label: "Pred Mean" },
    { key: "pred_std", label: "Pred Std" },
  ],
  Forecasting: [
    { key: "rmse", label: "RMSE", isLowerBetter: true },
    { key: "mae", label: "MAE", isLowerBetter: true },
    { key: "r2", label: "R²" },
    { key: "mape", label: "MAPE", isLowerBetter: true },
    { key: "mse", label: "MSE", isLowerBetter: true },
    { key: "mean_residual", label: "Mean Residual", isLowerBetter: true },
    { key: "std_residual", label: "Std Residual", isLowerBetter: true },
    { key: "pred_mean", label: "Pred Mean" },
    { key: "pred_std", label: "Pred Std" },
  ],
  Clustering: [
    { key: "n_clusters", label: "Number of Clusters" },
    { key: "n_noise_points", label: "Noise Points" },
    { key: "silhouette_score", label: "Silhouette Score" },
    {
      key: "davies_bouldin_score",
      label: "Davies-Bouldin",
      isLowerBetter: true,
    },
    { key: "calinski_harabasz", label: "Calinski-Harabasz" },
  ],
  "Anomaly Detection": [
    { key: "n_anomalies", label: "Number of Anomalies" },
    { key: "anomaly_percentage", label: "Anomaly Percentage (%)" },
    { key: "anomaly_score", label: "Anomaly Score" },
    { key: "avg_anomaly_score", label: "Avg Anomaly Score" },
    { key: "std_anomaly_score", label: "Std Anomaly Score" },
    { key: "min_anomaly_score", label: "Min Anomaly Score" },
    { key: "max_anomaly_score", label: "Max Anomaly Score" },
  ],
};

// Best-effort mapping from human model name -> API key (extendable)
function modelNameToApiKey(name: string) {
  if (!name) return name;
  const mapping: Record<string, string> = {
    "Logistic Regression": "logistic_regression",
    "Random Forest": "random_forest",
    "Gradient Boosting": "gradient_boosting",
    XGBoost: "xgboost",
    Ridge: "ridge",
    ARIMA: "arima",
    Prophet: "prophet",
    LightGBM: "lightgbm",
    CatBoost: "catboost",
    KMeans: "kmeans",
    "KMeans++": "kmeans_plusplus",
    DBSCAN: "dbscan",
    GMM: "gmm",
    "Isolation Forest": "isolation_forest",
    "One-Class SVM": "one_class_svm",
    "Local Outlier Factor (LOF)": "lof",
    "Elliptic Envelope": "elliptic_envelope",
  };
  if (mapping[name]) return mapping[name];
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "_");
}

// Generates mock values appropriate for given task + metric
function generateMockMetricsForTask(task: string) {
  const specs = metricsByTask[task] || [];
  const obj: Record<string, string> = {};
  specs.forEach((spec) => {
    // realistic ranges:
    if (
      spec.key === "accuracy" ||
      spec.key === "auc" ||
      spec.key === "f1_score" ||
      spec.key === "precision" ||
      spec.key === "recall" ||
      spec.key === "roc_auc" ||
      spec.key === "precision_recall_auc"
    ) {
      const val = 0.7 + Math.random() * 0.3; // 0.7 - 1.0
      obj[spec.key] = (val * 100).toFixed(1) + "%";
    } else if (
      spec.key === "rmse" ||
      spec.key === "mae" ||
      spec.key === "mse" ||
      spec.key === "std_residual"
    ) {
      obj[spec.key] = (0.05 + Math.random() * 1.0).toFixed(4);
    } else if (spec.key === "r2") {
      obj[spec.key] = (Math.random() * 1).toFixed(4);
    } else if (spec.key === "mape") {
      obj[spec.key] = (5 + Math.random() * 50).toFixed(2) + "%";
    } else if (spec.key === "mean_residual") {
      obj[spec.key] = ((Math.random() - 0.5) * 0.1).toFixed(6);
    } else if (spec.key === "pred_mean" || spec.key === "pred_std") {
      obj[spec.key] = (Math.random() * 0.5).toFixed(4);
    } else if (spec.key === "silhouette") {
      obj[spec.key] = (0.2 + Math.random() * 0.8).toFixed(3);
    } else if (spec.key === "davies_bouldin") {
      obj[spec.key] = (0.2 + Math.random() * 3.0).toFixed(3);
    } else if (spec.key === "calinski_harabasz") {
      obj[spec.key] = Math.round(50 + Math.random() * 2000).toString();
    } else if (spec.key === "anomaly_score") {
      obj[spec.key] = (Math.random() * 1).toFixed(4);
    } else {
      // default numeric
      obj[spec.key] = (Math.random() * 1).toFixed(4);
    }
  });
  return obj;
}

const CompareTab = ({}: CompareTabProps) => {
  const navigate = useNavigate();
  const [selectedTask, setSelectedTask] = useState(""); // previously selectedFunction
  const [selectedModel1, setSelectedModel1] = useState("");
  const [selectedModel2, setSelectedModel2] = useState("");
  const [selectedFeature, setSelectedFeature] = useState<"all" | string>("all");
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonComplete, setComparisonComplete] = useState(false);
  const [model1Metrics, setModel1Metrics] = useState<Record<
    string,
    any
  > | null>(null);
  const [model2Metrics, setModel2Metrics] = useState<Record<
    string,
    any
  > | null>(null);
  const [apiResponseRaw, setApiResponseRaw] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [blobPath, setBlobPath] = useState<string | null>(null);
  const location = useLocation();
  const [allTaskFeatures, setAllTaskFeatures] = useState<any>(null);
  const [blobPathReady, setBlobPathReady] = useState(false);
  const filePath = (location.state as any)?.filePath || "";
  const registerAbortRef = useRef<AbortController | null>(null);
  const datasetName = (location.state as any)?.datasetName || "";

  const cameFromHub = location.state?.origin === "automlhub";

  // ✅ add this ref at top of component if not already added
  // const registerAbortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!filePath) return;

    const registerFile = async () => {
      const userEmail = getUserEmailFromLocal();

      if (!userEmail) return;

      try {
        // ✅ Create AbortController
        registerAbortRef.current = new AbortController();

        const params = new URLSearchParams();

        params.append("file_path", filePath);
        params.append("upload_file_path", "true");
        params.append("user_email", userEmail);
        params.append("optuna_trials", "2");
        params.append("preprocessing_mode", "simple");
        params.append("use_cleaning", "true");
        params.append("use_optuna", "true");
        params.append("test_size", "0.2");
        params.append("time_budget", "180");
        params.append("horizon", "12");

        const res = await fetch(
          "https://api.veriton.ai/api/service3/build_ml_model_v",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              accept: "application/json",
            },

            body: params.toString(),

            // ✅ attach signal
            signal: registerAbortRef.current.signal,
          },
        );

        if (!res.ok) throw new Error(`Registration failed: ${res.status}`);

        const json = await res.json();

        setBlobPath(json.blob_path);

        if (json.features?.tasks) {
          setAllTaskFeatures(json.features.tasks);
        }

        setBlobPathReady(true);
      } catch (err: any) {
        // ✅ IMPORTANT: ignore abort error
        if (err.name === "AbortError") {
          console.log("Registration API aborted");

          return;
        }

        console.error("File registration error:", err);
      }
    };

    registerFile();

    // ✅ cleanup when leaving page
    return () => {
      if (registerAbortRef.current) {
        registerAbortRef.current.abort();
      }
    };
  }, [filePath]);

  // Reset models & results when task changes
  useEffect(() => {
    setSelectedModel1("");
    setSelectedModel2("");
    setComparisonComplete(false);
    setModel1Metrics(null);
    setModel2Metrics(null);
    setApiResponseRaw(null);
    setErrorMessage(null);
    setSelectedFeature("all");
  }, [selectedTask]);

  const availableModels = useMemo(() => {
    return selectedTask ? modelsByTask[selectedTask] || [] : [];
  }, [selectedTask]);

  const taskSpecificFeatures = useMemo(() => {
    if (!allTaskFeatures || !selectedTask) return [];
    const taskKey = selectedTask.toLowerCase().replace(/\s+/g, "_");
    return allTaskFeatures[taskKey]?.features || [];
  }, [allTaskFeatures, selectedTask]);

  const getUserEmailFromLocal = (): string | null => {
    try {
      const raw = localStorage.getItem("aivolve_user");
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.email ?? null;
    } catch {
      return null;
    }
  };

  const canCompare = !!(
    selectedTask &&
    selectedModel1 &&
    selectedModel2 &&
    selectedModel1 !== selectedModel2
  );

  const fetchAndCompare = async () => {
    setErrorMessage(null);
    setIsComparing(true);
    setComparisonComplete(false);
    setModel1Metrics(null);
    setModel2Metrics(null);
    setApiResponseRaw(null);

    const userEmail = getUserEmailFromLocal();
    if (!userEmail) {
      setErrorMessage("User email not found. Please login again.");
      setIsComparing(false);
      return;
    }

    if (!blobPath) {
      setErrorMessage(
        "Dataset not ready. Please wait or go back and try again.",
      );
      setIsComparing(false);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("file_path", filePath);
      params.append("upload_file_path", "false");
      params.append("user_email", userEmail);
      params.append("task", selectedTask.toLowerCase().replace(/\s+/g, "_"));
      params.append("target", selectedFeature === "all" ? "" : selectedFeature);
      const model1Key = modelNameToApiKey(selectedModel1);
      const model2Key = modelNameToApiKey(selectedModel2);
      params.append("models", `${model1Key} , ${model2Key}`);
      params.append("optuna_trials", "2");
      params.append("preprocessing_mode", "simple");
      params.append("use_cleaning", "true");
      params.append("use_optuna", "true");
      params.append("use_feature_selection", "false");
      params.append("test_size", "0.2");
      params.append("time_budget", "300");
      params.append("horizon", "12");

      const res = await fetch(
        "https://api.veriton.ai/api/service3/build_ml_model_v",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            accept: "application/json",
          },
          body: params.toString(),
        },
      );

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API error ${res.status}: ${txt}`);
      }

      const json = await res.json();
      setApiResponseRaw(json);

      const allModels = json?.all_models ?? {};

      const findKey = (k: string | null) => {
        if (!k) return null;
        if (allModels[k]) return k;
        const lower = k.toLowerCase();
        const candidate = Object.keys(allModels).find(
          (c) => c.toLowerCase() === lower,
        );
        if (candidate) return candidate;
        const candidate2 = Object.keys(allModels).find((c) =>
          c.toLowerCase().includes(lower),
        );
        if (candidate2) return candidate2;
        return null;
      };

      const real1 = findKey(modelNameToApiKey(selectedModel1));
      const real2 = findKey(modelNameToApiKey(selectedModel2));

      const pickMetrics = (obj: any) => {
        if (!obj) return null;
        return { train: obj.train ?? null, test: obj.test ?? null };
      };

      setModel1Metrics(real1 ? pickMetrics(allModels[real1]) : null);
      setModel2Metrics(real2 ? pickMetrics(allModels[real2]) : null);
      setComparisonComplete(true);
    } catch (err: any) {
      console.error("Compare API error", err);
      setErrorMessage(err?.message || "Error calling compare API.");
    } finally {
      setIsComparing(false);
    }
  };
  // compare two metric values based on whether lower is better
  const compareMetric = (
    key: string,
    a: any,
    b: any,
    isLowerBetter = false,
  ) => {
    if (a == null && b == null) return { aClass: "", bClass: "" };
    // parse percent strings and numeric strings
    const toNum = (v: any) => {
      if (v == null) return NaN;
      if (typeof v === "string" && v.includes("%"))
        return parseFloat(v.replace("%", ""));
      return parseFloat(String(v));
    };
    const na = toNum(a);
    const nb = toNum(b);
    if (isNaN(na) || isNaN(nb)) return { aClass: "", bClass: "" };
    if (isLowerBetter) {
      if (na < nb)
        return {
          aClass: "text-success font-semibold",
          bClass: "text-muted-foreground",
        };
      if (nb < na)
        return {
          aClass: "text-muted-foreground",
          bClass: "text-success font-semibold",
        };
    } else {
      if (na > nb)
        return {
          aClass: "text-success font-semibold",
          bClass: "text-muted-foreground",
        };
      if (nb > na)
        return {
          aClass: "text-muted-foreground",
          bClass: "text-success font-semibold",
        };
    }
    return { aClass: "text-foreground", bClass: "text-foreground" };
  };

  const renderMetricValue = (v: any) => {
    if (v == null) return "—";

    // If it's a string with %, return as is
    if (typeof v === "string" && v.includes("%")) {
      return v;
    }

    // Convert to number and check if it's valid
    const num = typeof v === "number" ? v : parseFloat(String(v));

    // If it's a valid number, format to 5 decimal places
    if (!isNaN(num)) {
      return num.toFixed(5);
    }

    // Otherwise return as string
    return String(v);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-6 px-8 pb-16 max-w-[1400px] mx-auto">
        {/* Back button + title */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                Compare Models
              </h1>
              <p className="text-muted-foreground mt-1">
                Compare performance of two models on the same dataset
                {datasetName && ` — ${datasetName}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => {
                if (registerAbortRef.current) {
                  registerAbortRef.current.abort();
                }

                if (cameFromHub) {
                  navigate("/workflow/automl/automlhub");
                } else {
                  navigate("/workflow/automl");
                }
              }}
            >
              {cameFromHub ? "Back to Preview" : "Back to Jobs"}
            </Button>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-primary" />
            Comparison Setup
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Task */}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
                Function
              </label>
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select task" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(modelsByTask).map((task) => (
                    <SelectItem key={task} value={task}>
                      {task}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model 1 */}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
                Model 1
              </label>
              <Select
                value={selectedModel1}
                onValueChange={setSelectedModel1}
                disabled={!selectedTask}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={
                      selectedTask ? "Select Model 1" : "Select task first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m) => (
                    <SelectItem
                      key={m}
                      value={m}
                      disabled={m === selectedModel2}
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Model 2 */}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
                Model 2
              </label>
              <Select
                value={selectedModel2}
                onValueChange={setSelectedModel2}
                disabled={!selectedTask}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={
                      selectedTask ? "Select Model 2" : "Select task first"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableModels.map((m) => (
                    <SelectItem
                      key={m}
                      value={m}
                      disabled={m === selectedModel1}
                    >
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target Feature */}
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">
                Target Column
              </label>
              <Select
                value={selectedFeature === "all" ? "all" : selectedFeature}
                onValueChange={(v) => setSelectedFeature(v as "all" | string)}
                disabled={!selectedTask || !blobPathReady}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue
                    placeholder={
                      !blobPathReady
                        ? "Loading targets..."
                        : selectedTask
                          ? "Select target"
                          : "Select task first"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value="all">All features (auto)</SelectItem>
                  {!blobPathReady ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground flex items-center gap-2">
                      <svg
                        className="animate-spin h-3 w-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                      Loading targets...
                    </div>
                  ) : taskSpecificFeatures.length > 0 ? (
                    taskSpecificFeatures.map((col) => (
                      <SelectItem key={col} value={col}>
                        {col}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      No targets available
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
              {errorMessage}
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={fetchAndCompare}
              disabled={!canCompare || isComparing || !blobPathReady}
              size="lg"
            >
              {isComparing ? "Comparing..." : "Compare Models"}
            </Button>
          </div>
        </div>

        {/* Results */}
        {comparisonComplete && (model1Metrics || model2Metrics) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-base font-semibold text-foreground mb-4">
                Comparison Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Task:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {selectedTask}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Model 1:</span>
                  <span className="ml-2 text-primary font-medium">
                    {selectedModel1}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Model 2:</span>
                  <span className="ml-2 text-primary font-medium">
                    {selectedModel2}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Target:</span>
                  <span className="ml-2 text-foreground font-medium">
                    {selectedFeature === "all"
                      ? "All features"
                      : selectedFeature}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Model Comparison Results
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-bold text-foreground uppercase tracking-wider border-b border-border">
                        Model Name
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border">
                        Metrics
                      </th>
                      {(metricsByTask[selectedTask] || []).map((spec) => (
                        <th
                          key={spec.key}
                          className="px-4 py-3 text-center text-xs font-bold text-foreground uppercase tracking-wider border-b border-border"
                        >
                          {spec.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Model 1 - Train Row */}
                    <tr className="border-b border-border/50">
                      <td
                        className="px-4 py-4 font-bold text-blue-500 text-primary border-r border-border"
                        rowSpan={2}
                      >
                        {selectedModel1}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                        Train
                      </td>
                      {(metricsByTask[selectedTask] || []).map((spec) => {
                        const value = model1Metrics?.train
                          ? (model1Metrics.train[spec.key] ??
                            model1Metrics.train[spec.key.replace(/\./g, "_")])
                          : null;
                        return (
                          <td
                            key={spec.key}
                            className="px-4 py-3 text-center text-sm text-foreground"
                          >
                            {renderMetricValue(value)}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Model 1 - Test Row */}
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                        Test
                      </td>
                      {(metricsByTask[selectedTask] || []).map((spec) => {
                        const value = model1Metrics?.test
                          ? (model1Metrics.test[spec.key] ??
                            model1Metrics.test[spec.key.replace(/\./g, "_")])
                          : null;
                        return (
                          <td
                            key={spec.key}
                            className="px-4 py-3 text-center text-sm text-foreground"
                          >
                            {renderMetricValue(value)}
                          </td>
                        );
                      })}
                    </tr>

                    {/* Model 2 - Train Row */}
                    <tr className="border-b border-border/50">
                      <td
                        className="px-4 py-4 font-bold text-purple-500 text-primary border-r border-border"
                        rowSpan={2}
                      >
                        {selectedModel2}
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                        Train
                      </td>
                      {(metricsByTask[selectedTask] || []).map((spec) => {
                        const value = model2Metrics?.train
                          ? (model2Metrics.train[spec.key] ??
                            model2Metrics.train[spec.key.replace(/\./g, "_")])
                          : null;
                        return (
                          <td
                            key={spec.key}
                            className="px-4 py-3 text-center text-sm text-foreground"
                          >
                            {renderMetricValue(value)}
                          </td>
                        );
                      })}
                    </tr>
                    {/* Model 2 - Test Row */}
                    <tr className="border-b border-border">
                      <td className="px-4 py-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
                        Test
                      </td>
                      {(metricsByTask[selectedTask] || []).map((spec) => {
                        const value = model2Metrics?.test
                          ? (model2Metrics.test[spec.key] ??
                            model2Metrics.test[spec.key.replace(/\./g, "_")])
                          : null;
                        return (
                          <td
                            key={spec.key}
                            className="px-4 py-3 text-center text-sm text-foreground"
                          >
                            {renderMetricValue(value)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default CompareTab;
