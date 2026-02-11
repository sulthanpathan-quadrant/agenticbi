import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Upload,
  TestTube2,
  X,
  FileText,
  AlertCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { OneLakeConnector } from "./OneLakeConnector";

// get user email from localStorage
const getUserFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem("aivolve_user");
    if (!raw) return null;
    return JSON.parse(raw) as { email?: string; [k: string]: any };
  } catch (e) {
    return null;
  }
};

interface TestTabProps {
  onBackToJobs: () => void;
}

interface TrainedModel {
  id: string;
  dataset: string;
  function: string;
  modelName: string;
  targetColumn: string;
  testResults?: TestResults;
}

interface TestMetric {
  name: string;
  testing: number;
}

interface TestHistoryEntry {
  testResultId: string;
  testFileName: string;
  groundTruthAvailable: boolean;
  metrics?: TestMetric[];
  blobPath?: string;
}

interface TestResults {
  modelId: string;
  modelName: string;
  task: string;
  targetColumn: string;
  groundTruthAvailable: boolean;
  metrics?: TestMetric[];
  training_test_metrics?: {
    avg_rmse?: number;
    avg_mae?: number;
    avg_r2?: number;
  };
  predictions?: {
    customerId: string;
    tenure: number;
    monthlyCharges: string;
    predictedValue: number;
  }[];
  blobPath?: string;
  testResultId?: string;

  testHistory?: TestHistoryEntry[];
  drift_report?: {
    overall_status:
      | "stable"
      | "data_drift"
      | "degraded"
      | "critical"
      | "activated";
    summary_message?: string;
    details?: string;
    recommendation?: string;

    data_drift?: {
      detected: boolean;
      overall_psi?: number;
      drifted_features_count?: number;
      drifted_features?: string[];
      status?: string;
    };

    performance_drift?: {
      detected: boolean;
      relative_drop_percent?: number;
      baseline_metric?: number;
      current_metric?: number;
      status?: string;
    };
  };
}

const normalizeOneLakePath = (path: string) => {
  const tablesIndex = path.indexOf("Tables/");
  const filesIndex = path.indexOf("Files/");

  if (tablesIndex !== -1) {
    return path.substring(tablesIndex);
  }

  if (filesIndex !== -1) {
    return path.substring(filesIndex);
  }

  return path; // fallback (should not happen)
};

const jsonToCsv = (rows: any[]): string => {
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const csvLines = [
    headers.join(","), // header row
    ...rows.map((row) =>
      headers
        .map((h) => JSON.stringify(row[h] ?? "")) // safe stringify
        .join(",")
    ),
  ];

  return csvLines.join("\n");
};

const JOBS_API =
  "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/user_models_summary";

const ONELAKE_BASE_URL =
  "https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net";

const MODEL_TEST_HISTORY_API =
  "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/model_test_history";

type UploadSource =
  | "choose"
  | "adls"
  | "delta"
  | "onelake"
  | "local"
  | "preview";

const TestTab = ({ onBackToJobs }: TestTabProps) => {
  const navigate = useNavigate();
  const [trainedModels, setTrainedModels] = useState<TrainedModel[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadWizardStep, setUploadWizardStep] = useState<
    UploadSource | "preview"
  >("choose");

  // upload-source specific states
  const [selectedUploadSource, setSelectedUploadSource] =
    useState<UploadSource | null>(null);

  // ADLS fields
  const [adlsStorageAccount, setAdlsStorageAccount] = useState("");
  const [adlsFileSystem, setAdlsFileSystem] = useState("");
  const [adlsFilePath, setAdlsFilePath] = useState("");
  const [adlsAccessKey, setAdlsAccessKey] = useState("");

  // Delta fields
  const [deltaWorkspaceUrl, setDeltaWorkspaceUrl] = useState("");
  const [deltaCatalogName, setDeltaCatalogName] = useState("");
  const [deltaSchemaName, setDeltaSchemaName] = useState("");
  const [deltaTableName, setDeltaTableName] = useState("");
  const [deltaToken, setDeltaToken] = useState("");

  // OneLake fields & options
  const [oneLakeWorkspace, setOneLakeWorkspace] = useState("");
  const [oneLakeLakehouse, setOneLakeLakehouse] = useState("");
  const [oneLakePath, setOneLakePath] = useState(""); // final selected full_path or path
  const [oneLakeMode, setOneLakeMode] = useState<"files" | "tables" | "">("");
  const [oneLakeFolders, setOneLakeFolders] = useState<string[]>([]);
  const [oneLakeFiles, setOneLakeFiles] = useState<any[]>([]); // items from API (name, full_path, last_modified)
  const [oneLakeTables, setOneLakeTables] = useState<string[]>([]); // table folder names when mode=tables
  const [oneLakeLoading, setOneLakeLoading] = useState(false);
  const [oneLakeError, setOneLakeError] = useState("");
  const [selectedOneLakeFolder, setSelectedOneLakeFolder] = useState("");
  const [selectedOneLakeFile, setSelectedOneLakeFile] = useState("");
  const [selectedOneLakeTable, setSelectedOneLakeTable] = useState("");
  const [oneLakeCurrentPath, setOneLakeCurrentPath] = useState(""); // e.g. Files or Tables/<table>

  // Local file
  const [localFile, setLocalFile] = useState<File | null>(null);

  // Reuse existing test UI state
  const [viewResultsModalOpen, setViewResultsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<TrainedModel | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const PAGE_SIZE = 10;

  const [page, setPage] = useState(0); // current page index
  const [hasNextPage, setHasNextPage] = useState(true);

  // Fetch jobs on mount
  useEffect(() => {
    const fetchJobs = async () => {
      const user = getUserFromLocalStorage();
      const email = user?.email;
      if (!email) {
        console.warn("aivolve_user not found in localStorage; using mock data");
        return;
      }

      setIsLoading(true);
      setHasNextPage(false);
      try {
        const start = page * PAGE_SIZE;

        const url =
          `${JOBS_API}?user_email=${encodeURIComponent(email)}` +
          `&start=${start}&limit=${PAGE_SIZE}`;

        const res = await fetch(url, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Failed to fetch user models summary:", txt);
          toast({
            title: "Failed to load jobs",
            description: "Server returned an error.",
          });
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        let rawJobs: any[] = [];
        if (Array.isArray(data)) {
          rawJobs = data;
        } else if (Array.isArray((data as any).models)) {
          rawJobs = (data as any).models;
        } else if (Array.isArray((data as any).data)) {
          rawJobs = (data as any).data;
        } else {
          const arr = Object.values(data).find((v) => Array.isArray(v));
          if (arr) rawJobs = arr as any[];
        }

        if (!rawJobs || rawJobs.length === 0) {
          setTrainedModels([]);
          setIsLoading(false);
          return;
        }

        const mapped: TrainedModel[] = rawJobs.map((item: any, idx: number) => {
          let dataset =
            item.table_name ||
            item.dataset_name ||
            item.dataset ||
            item.file_name ||
            item.blob_path ||
            item.name ||
            `dataset-${idx}`;

          // ✅ Extract table name from path like "Tables/iris/part-00000-..."
          if (dataset.includes("Tables/") && dataset.includes("/")) {
            const parts = dataset.split("/");
            const tableIndex = parts.indexOf("Tables");
            if (tableIndex !== -1 && parts.length > tableIndex + 1) {
              dataset = parts[tableIndex + 1]; // Get the table name after "Tables/"
            }
          }

          // ✅ Remove file extensions (.csv, .parquet, etc.)
          dataset = dataset
            .replace(/\.snappy\.parquet\.csv$/i, "")
            .replace(/\.parquet\.csv$/i, "")
            .replace(/\.csv$/i, "")
            .replace(/\.parquet$/i, "");

          // ✅ Remove long parquet file prefixes (part-00000-...)
          // if (dataset.startsWith('part-') && dataset.includes('-')) {
          //   // This is a raw parquet filename, extract just the base name
          //   // For now, show a shortened version
          //   dataset = 'parquet_file'
          // }

          const func = item.task_type || item.function || item.task || "—";

          const modelName =
            item.best_model ||
            item.model_name ||
            item.model ||
            item.name ||
            `model-${idx}`;

          const id =
            item.model_id ||
            item.id ||
            `${modelName}-${idx}-${Math.random().toString(36).slice(2, 6)}`;

          const target = item.target || item.target_column || item.label || "";

          const testResults =
            item.test_results || item.testResults || item.metrics || undefined;

          return {
            id: String(id),
            dataset: String(dataset),
            function: String(func),
            modelName: String(modelName),
            targetColumn: String(target),
            testResults,
          } as TrainedModel;
        });

        setTrainedModels(mapped);
        setHasNextPage(rawJobs.length === PAGE_SIZE);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        toast({ title: "Error", description: "Could not load jobs." });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // ======= Upload modal flow =======
  const openUploadWizard = () => {
    setUploadWizardStep("choose");
    setSelectedUploadSource(null);
    // clear fields
    setAdlsStorageAccount("");
    setAdlsFileSystem("");
    setAdlsFilePath("");
    setAdlsAccessKey("");
    setDeltaWorkspaceUrl("");
    setDeltaCatalogName("");
    setDeltaSchemaName("");
    setDeltaTableName("");
    setDeltaToken("");
    setOneLakeWorkspace("");
    setOneLakeLakehouse("");
    setOneLakePath("");
    setOneLakeMode("");
    setOneLakeFolders([]);
    setOneLakeFiles([]);
    setOneLakeTables([]);
    setSelectedOneLakeFolder("");
    setSelectedOneLakeFile("");
    setSelectedOneLakeTable("");
    setOneLakeCurrentPath("");
    setLocalFile(null);
    setUploadModalOpen(true);
  };

  const selectUploadSource = (src: UploadSource) => {
    setSelectedUploadSource(src);
    setUploadWizardStep(src);
  };

  const backToChoose = () => {
    setUploadWizardStep("choose");
    setSelectedUploadSource(null);
  };

  const validateUploadParams = (): boolean => {
    if (!selectedUploadSource) {
      toast({ title: "Select source", description: "Please choose a source." });
      return false;
    }
    if (selectedUploadSource === "adls") {
      if (!adlsStorageAccount || !adlsFileSystem || !adlsFilePath) {
        toast({
          title: "Missing fields",
          description: "Please fill all ADLS fields.",
        });
        return false;
      }
    }
    if (selectedUploadSource === "delta") {
      if (
        !deltaWorkspaceUrl ||
        !deltaCatalogName ||
        !deltaSchemaName ||
        !deltaTableName
      ) {
        toast({
          title: "Missing fields",
          description: "Please fill all Delta fields.",
        });
        return false;
      }
    }
    if (selectedUploadSource === "onelake") {
      // require workspace & lakehouse and oneLakePath to be selected
      if (!oneLakeWorkspace || !oneLakeLakehouse) {
        toast({
          title: "Missing fields",
          description: "Please fill workspace & lakehouse.",
        });
        return false;
      }
      if (!oneLakeMode) {
        toast({
          title: "Missing fields",
          description: "Please choose Files or Tables.",
        });
        return false;
      }
      if (!oneLakePath) {
        toast({
          title: "Missing fields",
          description: "Please select a file/table path.",
        });
        return false;
      }
    }
    if (selectedUploadSource === "local") {
      if (!localFile) {
        toast({
          title: "No file",
          description: "Please choose a local CSV file.",
        });
        return false;
      }
      if (!localFile.name.toLowerCase().endsWith(".csv")) {
        toast({
          title: "Invalid file",
          description: "Only CSV files are allowed.",
        });
        return false;
      }
    }
    return true;
  };

  const fetchOneLakeContents = async (
    workspace: string,
    lakehouse: string,
    path: string
  ) => {
    setOneLakeLoading(true);
    setOneLakeError("");
    // DO NOT blindly clear everything
    // Only clear files/folders/tables if we're at the root of Files or Tables
    const isRootFiles = path === "Files";
    const isRootTables = path === "Tables";
    const isTableFolder = path.startsWith("Tables/") && path !== "Tables";

    if (isRootFiles || isRootTables || isTableFolder) {
      setOneLakeFiles([]); // always clear files when navigating
      setSelectedOneLakeFile("");
      if (isTableFolder) {
        // We're inside a table → do NOT clear the table list!
      } else {
        // We're at root → safe to clear folders/tables
        setOneLakeFolders([]);
        setOneLakeTables([]);
        setSelectedOneLakeFolder("");
        setSelectedOneLakeTable("");
      }
    }

    setOneLakeCurrentPath(path || "");

    try {
      if (!workspace || !lakehouse) {
        setOneLakeError("Workspace and lakehouse are required");
        setOneLakeLoading(false);
        return null;
      }

      const encodedWorkspace = encodeURIComponent(workspace);
      const encodedLakehouse = encodeURIComponent(lakehouse);
      const encodedPath = encodeURIComponent(path);
      const url = `${ONELAKE_BASE_URL}/workspaces/${encodedWorkspace}/lakehouses/${encodedLakehouse}/contents?path=${encodedPath}`;

      const res = await fetch(url, {
        method: "GET",
        headers: { accept: "application/json" },
      });
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("OneLake contents error", res.status, txt);
        setOneLakeError(`Failed to fetch contents: ${res.status}`);
        setOneLakeLoading(false);
        return null;
      }

      const data = await res.json();
      console.log("api response", data);

      // Only populate tables when at root Tables
      if (
        isRootTables &&
        Array.isArray(data.folders) &&
        data.folders.length > 0
      ) {
        const folderNames = data.folders
          .map((f: any) => (typeof f === "string" ? f : f?.name ?? ""))
          .filter(Boolean);
        setOneLakeTables(folderNames);
      }

      // Populate folders (for Files mode or subfolders)
      if (
        !isTableFolder &&
        Array.isArray(data.folders) &&
        data.folders.length > 0
      ) {
        const folderNames = data.folders
          .map((f: any) => (typeof f === "string" ? f : f?.name ?? ""))
          .filter(Boolean);
        setOneLakeFolders(folderNames);
      }

      // Always handle files
      if (Array.isArray(data.files) && data.files.length > 0) {
        const files = data.files.map((f: any) => ({
          name: f.name,
          full_path: f.full_path,
          size_bytes: f.size_bytes,
          last_modified: f.last_modified,
          relative_path: f.relative_path,
        }));
        setOneLakeFiles(files);
      }

      // Fallback for items array
      if (
        Array.isArray((data as any).items) &&
        (data as any).items.length > 0
      ) {
        const items = (data as any).items;
        const foldersFromItems = items
          .filter((i: any) => i.type === "folder" || i.is_folder)
          .map((i: any) => i.name || i.path || "");
        const filesFromItems = items
          .filter((i: any) => !i.type || i.type === "file")
          .map((i: any) => ({
            name: i.name || i.path,
            full_path: i.full_path || i.path || i.name,
            size_bytes: i.size_bytes,
            last_modified: i.last_modified,
            relative_path: i.relative_path || i.path,
          }));
        if (!isTableFolder && foldersFromItems.length) {
          setOneLakeFolders((prev) => [...prev, ...foldersFromItems]);
        }
        if (filesFromItems.length)
          setOneLakeFiles((prev) => [...prev, ...filesFromItems]);
      }

      if (
        (!Array.isArray(data.folders) || data.folders.length === 0) &&
        (!Array.isArray(data.files) || data.files.length === 0) &&
        (!Array.isArray((data as any).items) ||
          (data as any).items.length === 0)
      ) {
        if (!isTableFolder) {
          setOneLakeError("No folders or files found at this path");
        }
      }

      setOneLakeLoading(false);
      return data;
    } catch (err) {
      console.error("fetchOneLakeContents error", err);
      setOneLakeError(
        "Failed to fetch OneLake contents — check names or CORS."
      );
      setOneLakeLoading(false);
      return null;
    }
  };

  // Drill into a folder (Files mode)
  const drillOneLakeFolder = async (folderName: string) => {
    if (!folderName) return;
    const root = oneLakeMode === "files" ? "Files" : "Tables";
    const newPath = `${root}/${folderName}`;
    await fetchOneLakeContents(oneLakeWorkspace, oneLakeLakehouse, newPath);
  };

  // When user selects a table from Tables root, call contents for Tables/<table> to list files
  const handleOneLakeTableSelect = async (tableName: string) => {
    if (!tableName) return;
    setSelectedOneLakeTable(tableName);
    const path = `Tables/${tableName}`;
    const data = await fetchOneLakeContents(
      oneLakeWorkspace,
      oneLakeLakehouse,
      path
    );
    // don't auto-preview (per your instruction). We still set oneLakePath optionally to a file's full_path if you want.
    // If there are files in the folder, set oneLakePath to first file full_path (so Connect will use it)
    if (data && Array.isArray(data.files) && data.files.length > 0) {
      const sorted = data.files
        .map((f: any) => ({
          ...f,
          ts: f.last_modified ? new Date(f.last_modified).getTime() : 0,
        }))
        .sort((a: any, b: any) => (b.ts || 0) - (a.ts || 0));
      const latestFullPath = sorted[0]?.full_path || sorted[0]?.path || "";
      setOneLakePath(latestFullPath || path);
      setSelectedOneLakeFile(sorted[0]?.name || "");
    } else {
      // if no files, set path to the folder path (so user can still connect if they want)
      setOneLakePath(path);
    }
  };

  const handleOneLakeFileSelect = (fileName: string) => {
    setSelectedOneLakeFile(fileName);
    const match = oneLakeFiles.find(
      (f) => f.name === fileName || f.full_path === fileName
    );
    const chosenPath = match
      ? match.full_path
      : oneLakeCurrentPath
      ? `${oneLakeCurrentPath}/${fileName}`
      : fileName;
    setOneLakePath(chosenPath);
  };

  // When user connects & uploads, prepare uploadedFile (for local use the selected file;
  // for remote sources create a placeholder File that downstream upload API can process)
  const handleConnectAndUpload = async () => {
    if (!validateUploadParams()) return;

    // For local, use the actual file
    if (selectedUploadSource === "local" && localFile) {
      setUploadedFile(localFile);
      toast({
        title: "File ready",
        description: `Local file ${localFile.name} selected.`,
      });
      setUploadWizardStep("preview");
      return;
    }

    // For remote sources we create a placeholder File with dataset name to pass downstream.
    let datasetName = "remote_dataset.csv";
    if (selectedUploadSource === "adls") {
      datasetName = adlsFilePath.split("/").pop() || datasetName;
    } else if (selectedUploadSource === "delta") {
      datasetName = `${deltaTableName}.csv`;
    } else if (selectedUploadSource === "onelake") {
      try {
        if (!oneLakePath) {
          toast({
            title: "No table selected",
            description: "Please select a OneLake table first.",
          });
          return;
        }

        // Get the relative_path from the selected file
        const selectedFileObj = oneLakeFiles.find(
          (f) => f.full_path === oneLakePath || f.name === selectedOneLakeFile
        );

        if (!selectedFileObj || !selectedFileObj.relative_path) {
          throw new Error("Could not find relative path for selected file");
        }

        const relativePath = selectedFileObj.relative_path;

        // Download the parquet file directly
        const downloadUrl =
          `${ONELAKE_BASE_URL}/workspaces/${encodeURIComponent(
            oneLakeWorkspace
          )}` +
          `/lakehouses/${encodeURIComponent(oneLakeLakehouse)}` +
          `/download?path=${encodeURIComponent(relativePath)}`;

        const res = await fetch(downloadUrl, {
          headers: { accept: "application/octet-stream" },
        });

        if (!res.ok) {
          throw new Error("Failed to download OneLake file");
        }

        // Get the blob (parquet file)
        const blob = await res.blob();

        // ✅ Extract clean table name from path
        let displayName = "onelake_data";

        if (selectedOneLakeTable) {
          // If we have a selected table name, use it
          displayName = selectedOneLakeTable;
        } else if (relativePath.includes("Tables/")) {
          // Extract table name from path like "Tables/iris/part-00000-..."
          const parts = relativePath.split("/");
          const tableIndex = parts.indexOf("Tables");
          if (tableIndex !== -1 && parts.length > tableIndex + 1) {
            displayName = parts[tableIndex + 1];
          }
        }

        // Create File object with clean table name
        const parquetFile = new File([blob], `${displayName}.parquet`, {
          type: "application/octet-stream",
        });

        setUploadedFile(parquetFile);

        // toast({
        //   title: "File Ready",
        //   description: `Downloaded ${displayName} from OneLake`,
        // });
      } catch (err) {
        console.error("OneLake download error:", err);
        toast({
          title: "OneLake Error",
          description: "Could not download file from OneLake.",
          variant: "destructive",
        });
      }

      setUploadWizardStep("preview");
      return;
    }
  };
  // Local file input handler (for Upload wizard)
  const handleLocalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLocalFile(file);
  };

  // ======= End upload modal flow =======

  const handleUploadClick = (model: TrainedModel) => {
    setSelectedModel(model);
    setUploadedFile(null);
    setTestResults(null);
    openUploadWizard();
  };

  const handleViewResults = async (model: TrainedModel) => {
    setSelectedModel(model);

    const user = getUserFromLocalStorage();
    const userEmail = user?.email;
    if (!userEmail) {
      toast({
        title: "Auth error",
        description: "User email not found.",
        variant: "destructive",
      });
      return;
    }

    const mapMetrics = (obj: any): TestMetric[] | undefined => {
      if (!obj) return undefined;

      return Object.entries(obj).map(([name, value]) => ({
        name,
        testing: Number(value), // <-- force value to number
      }));
    };

    try {
      const url = `${MODEL_TEST_HISTORY_API}/${encodeURIComponent(
        model.id
      )}?user_email=${encodeURIComponent(userEmail)}`;
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();

      if (!data.test_history || data.test_history.length === 0) {
        // No history found
        setTestResults({
          modelId: model.id,
          modelName: model.modelName,
          task: model.function,
          targetColumn: model.targetColumn,
          groundTruthAvailable: false,
          testHistory: [],
        });
        setViewResultsModalOpen(true);
        return;
      }

      // Convert backend test history → UI format
      const history = data.test_history.map((test: any) => ({
        testResultId: test.test_result_id,
        testFileName: test.test_file_name,
        groundTruthAvailable: test.has_ground_truth,
        metrics: mapMetrics(test.test_metrics),
        blobPath: test.predictions_file,
      }));

      setTestResults({
        modelId: data.model_id,
        modelName: data.model_name,
        task: data.task,
        targetColumn: model.targetColumn,
        groundTruthAvailable: history.some((h) => h.groundTruthAvailable),
        testHistory: history,
      });

      setViewResultsModalOpen(true);
    } catch (err) {
      console.error("Exception fetching test history:", err);
      toast({
        title: "Network error",
        description: "Could not load test history.",
        variant: "destructive",
      });
      setViewResultsModalOpen(true);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a CSV file only.",
          variant: "destructive",
        });
        return;
      }
      setUploadedFile(file);
    }
  };

  const fetchDriftReport = async (modelId: string, testResultId: string) => {
    const userEmail = getUserFromLocalStorage()?.email;
    if (!userEmail) return null;

    const body = new URLSearchParams({
      mode: "test",
      user_email: userEmail,
      model_id: modelId,
      test_result_id: testResultId,
    });

    const res = await fetch(
      "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/drift/report",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          accept: "application/json",
        },
        body,
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch drift report");
      return null;
    }

    const json = await res.json();
    return json.drift_report;
  };

  const handleRunTest = async () => {
    if (!uploadedFile || !selectedModel) {
      toast({
        title: "No file or model",
        description: "Please select a model and upload a test dataset.",
      });
      return;
    }

    const user = getUserFromLocalStorage();
    const userEmail = user?.email;
    if (!userEmail) {
      toast({
        title: "Authentication error",
        description: "User email not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsRunningTest(true);

    try {
      const formData = new FormData();
      formData.append("test_file", uploadedFile);
      formData.append("model_id", selectedModel.id);
      formData.append("user_email", userEmail);
      formData.append("return_predictions", "true");
      formData.append("save_predictions", "true");

      const response = await fetch(
        "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/test_model",
        { method: "POST", body: formData }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Test model API error:", errorText);
        toast({
          title: "Test Failed",
          description:
            "Failed to run test on model. Check file format or server logs.",
          variant: "destructive",
        });
        setIsRunningTest(false);
        return;
      }

      const data = await response.json();
      const fetchDriftReport = async (
        modelId: string,
        testResultId: string
      ) => {
        const userEmail = getUserFromLocalStorage()?.email;
        if (!userEmail) return null;

        const body = new URLSearchParams({
          mode: "test",
          user_email: userEmail,
          model_id: modelId,
          test_result_id: testResultId,
        });

        const res = await fetch(
          "https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/drift/report",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              accept: "application/json",
            },
            body,
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch drift report");
          return null;
        }

        const json = await res.json();
        return json.drift_report;
      };

      if (data.status !== "success") {
        toast({
          title: "Error",
          description: data.message || "Test failed",
          variant: "destructive",
        });
        setIsRunningTest(false);
        return;
      }
      const driftReport = await fetchDriftReport(
        data.model_info.model_id,
        data.test_result_id
      );

      // -------------------------------
      // 🔥 Dynamic metric parser (NO training metrics)
      // -------------------------------
      const mapMetrics = (obj: any) => {
        if (!obj) return undefined;
        return Object.entries(obj).map(([name, value]) => ({
          name,
          testing: Number(value),
        }));
      };

      const metricsList = mapMetrics(data.test_metrics);

      // -------------------------------
      // 🔥 Add fresh test into history
      // -------------------------------
      const historyEntry = {
        testResultId: data.test_result_id,
        testFileName: data.test_file,
        groundTruthAvailable: data.has_ground_truth,
        metrics: metricsList,
        blobPath: data.predictions_file?.blob_path,
      };

      // -------------------------------
      // 🔥 FINAL test results object
      // -------------------------------
      const mappedResults: TestResults = {
        modelId: data.model_info.model_id,
        modelName: data.model_info.model_name,
        task: data.model_info.task,
        targetColumn: data.model_info.target,
        groundTruthAvailable: data.has_ground_truth,
        metrics: metricsList,
        training_test_metrics: data.training_test_metrics,
        drift_report: driftReport,
        predictions:
          data.predictions?.predicted
            ?.slice(0, 10)
            .map((pred: number, idx: number) => ({
              customerId: `Row ${idx + 1}`,
              predictedValue: pred,
            })) || [],
        blobPath: data.predictions_file?.blob_path,
        testResultId: data.test_result_id,
        testHistory: [historyEntry], // <-- ESSENTIAL for modal display
      };

      setTestResults(mappedResults);

      // Update on grid so eye modal also uses new data
      setTrainedModels((prev) =>
        prev.map((m) =>
          m.id === selectedModel.id ? { ...m, testResults: mappedResults } : m
        )
      );

      toast({
        title: "Test Complete!",
        description: data.message || "Model tested successfully.",
      });

      // 🔥 Auto-open test results modal
      setViewResultsModalOpen(true);
    } catch (err) {
      console.error("Exception during test:", err);
      toast({
        title: "Network Error",
        description: "Could not connect to test service.",
        variant: "destructive",
      });
    } finally {
      setIsRunningTest(false);
    }
  };

  const closeUploadModal = () => {
    setUploadModalOpen(false);
    setUploadWizardStep("choose");
  };

  const closeViewResultsModal = () => {
    setViewResultsModalOpen(false);
    setSelectedModel(null);
    setTestResults(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Test Results
            </h1>
            <p className="text-muted-foreground mt-1">
              View and test your trained models with new data
            </p>
          </div>
        </div>

        {/* Models Grid */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Dataset</TableHead>
                <TableHead className="font-semibold">Function</TableHead>
                <TableHead className="font-semibold">Model Name</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    Loading jobs…
                  </TableCell>
                </TableRow>
              )}

              {!isLoading && trainedModels.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No trained models found.
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                trainedModels.map((model) => (
                  <TableRow key={model.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium">
                      {model.dataset}
                    </TableCell>
                    <TableCell>{model.function}</TableCell>
                    <TableCell>{model.modelName}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUploadClick(model)}
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Upload
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewResults(model)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        {/* Pagination */}
        {(page > 0 || hasNextPage) && (
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-4">
              {/* Previous → only if not first page */}
              {page > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
              )}

              <span className="text-sm text-muted-foreground">
                Page {page + 1}
              </span>

              {/* Next → ONLY if backend confirms more jobs */}
              {hasNextPage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              )}
            </div>
          </div>
        )}

        {trainedModels.length === 0 && !isLoading && (
          <div className="bg-card border border-border rounded-xl p-12 text-center mt-4">
            <TestTube2 className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Trained Models
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Build a model first to test it with new data.
            </p>
          </div>
        )}
      </div>

      {/* Upload Wizard Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent
          className={
            uploadWizardStep === "preview"
              ? "max-w-md p-8"
              : "max-w-2xl max-h-[90vh] overflow-y-auto"
          }
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {uploadWizardStep === "choose"
                ? "Choose upload source"
                : uploadWizardStep === "preview"
                ? "Ready to Test Model"
                : `Connect: ${selectedUploadSource?.toUpperCase()}`}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {uploadWizardStep === "choose" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => selectUploadSource("adls")}
                  className="datasource-card text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      AD
                    </div>
                    <div>
                      <p className="font-semibold">ADLS Gen2</p>
                      <p className="text-xs text-muted-foreground">
                        Connect to Azure Data Lake Storage Gen2
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectUploadSource("delta")}
                  className="datasource-card text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      DT
                    </div>
                    <div>
                      <p className="font-semibold">Delta Tables</p>
                      <p className="text-xs text-muted-foreground">
                        Fetch tables from your Delta catalog
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectUploadSource("onelake")}
                  className="datasource-card text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-warm/10 flex items-center justify-center">
                      OL
                    </div>
                    <div>
                      <p className="font-semibold">OneLake</p>
                      <p className="text-xs text-muted-foreground">
                        Select files / tables from OneLake
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => selectUploadSource("local")}
                  className="datasource-card text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/10 flex items-center justify-center">
                      LF
                    </div>
                    <div>
                      <p className="font-semibold">Local File</p>
                      <p className="text-xs text-muted-foreground">
                        Upload a CSV from your machine
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {uploadWizardStep === "adls" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm block mb-1">
                    Storage Account *
                  </label>
                  <input
                    className="input-colored w-full"
                    value={adlsStorageAccount}
                    onChange={(e) => setAdlsStorageAccount(e.target.value)}
                    placeholder="mystorageacct"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">
                    File System (container) *
                  </label>
                  <input
                    className="input-colored w-full"
                    value={adlsFileSystem}
                    onChange={(e) => setAdlsFileSystem(e.target.value)}
                    placeholder="container"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">File Path *</label>
                  <input
                    className="input-colored w-full"
                    value={adlsFilePath}
                    onChange={(e) => setAdlsFilePath(e.target.value)}
                    placeholder="path/to/file.csv"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Access Key *</label>
                  <input
                    className="input-colored w-full"
                    value={adlsAccessKey}
                    onChange={(e) => setAdlsAccessKey(e.target.value)}
                    placeholder="••••••"
                    type="password"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={backToChoose}>
                    Back
                  </Button>
                  <Button onClick={handleConnectAndUpload}>
                    Connect & Upload
                  </Button>
                </div>
              </div>
            )}

            {uploadWizardStep === "delta" && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm block mb-1">Workspace URL *</label>
                  <input
                    className="input-colored w-full"
                    value={deltaWorkspaceUrl}
                    onChange={(e) => setDeltaWorkspaceUrl(e.target.value)}
                    placeholder="https://adb-..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm block mb-1">Catalog *</label>
                    <input
                      className="input-colored w-full"
                      value={deltaCatalogName}
                      onChange={(e) => setDeltaCatalogName(e.target.value)}
                      placeholder="main_catalog"
                    />
                  </div>
                  <div>
                    <label className="text-sm block mb-1">Schema *</label>
                    <input
                      className="input-colored w-full"
                      value={deltaSchemaName}
                      onChange={(e) => setDeltaSchemaName(e.target.value)}
                      placeholder="default"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm block mb-1">Table Name *</label>
                  <input
                    className="input-colored w-full"
                    value={deltaTableName}
                    onChange={(e) => setDeltaTableName(e.target.value)}
                    placeholder="my_table"
                  />
                </div>
                <div>
                  <label className="text-sm block mb-1">Token / PAT *</label>
                  <input
                    className="input-colored w-full"
                    value={deltaToken}
                    onChange={(e) => setDeltaToken(e.target.value)}
                    placeholder="••••••"
                    type="password"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={backToChoose}>
                    Back
                  </Button>
                  <Button onClick={handleConnectAndUpload}>
                    Connect & Upload
                  </Button>
                </div>
              </div>
            )}

            {uploadWizardStep === "onelake" && (
              <div className="space-y-6">
                <OneLakeConnector
                  workspace={oneLakeWorkspace}
                  setWorkspace={setOneLakeWorkspace}
                  lakehouse={oneLakeLakehouse}
                  setLakehouse={setOneLakeLakehouse}
                  mode={oneLakeMode}
                  setMode={(m) => {
                    setOneLakeMode(m);
                    setOneLakeFolders([]);
                    setOneLakeFiles([]);
                    setOneLakeTables([]);
                    setSelectedOneLakeFolder("");
                    setSelectedOneLakeFile("");
                    setSelectedOneLakeTable("");
                    setOneLakePath("");
                  }}
                  folders={oneLakeFolders}
                  files={oneLakeFiles}
                  tables={oneLakeTables}
                  selectedFolder={selectedOneLakeFolder}
                  selectedFile={selectedOneLakeFile}
                  selectedTable={selectedOneLakeTable}
                  currentPath={oneLakeCurrentPath}
                  loading={oneLakeLoading}
                  error={oneLakeError}
                  onRootFetch={(root) =>
                    fetchOneLakeContents(
                      oneLakeWorkspace,
                      oneLakeLakehouse,
                      root
                    )
                  }
                  onFolderDrill={drillOneLakeFolder}
                  onFileSelect={handleOneLakeFileSelect}
                  onTableSelect={handleOneLakeTableSelect}
                />

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={backToChoose}>
                    Back
                  </Button>
                  <Button onClick={handleConnectAndUpload}>
                    Connect & Preview
                  </Button>
                </div>
              </div>
            )}

            {uploadWizardStep === "local" && (
              <div className="space-y-3">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center bg-primary/3">
                  <input
                    id="local-test-file"
                    type="file"
                    accept=".csv"
                    onChange={handleLocalFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="local-test-file"
                    className="cursor-pointer inline-block"
                  >
                    <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                    {localFile ? (
                      <>
                        <p className="font-medium">{localFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Click to change file
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium">Click to choose CSV file</p>
                        <p className="text-xs text-muted-foreground">
                          Only .csv files are accepted
                        </p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={backToChoose}>
                    Back
                  </Button>
                  <Button onClick={handleConnectAndUpload}>Use File</Button>
                </div>
              </div>
            )}
            {uploadWizardStep === "preview" &&
              uploadedFile &&
              selectedModel && (
                <div className="flex flex-col items-center justify-center py-2 space-y-3">
                  {/* Icon */}
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>

                  {/* Title - already set in DialogTitle, so no need to repeat */}

                  {/* Dataset */}
                  <div className="bg-muted/50 rounded-lg px-2 py-1 text-center">
                    <p className="text-sm text-muted-foreground">Dataset</p>
                    <p className="font-medium text-lg">
                      {(() => {
                        let name = uploadedFile.name
                          .replace(/\.parquet$/i, "")
                          .replace(/\.csv$/i, "")
                          .replace(/\.snappy.*$/i, "");

                        if (name.includes("Tables/")) {
                          const parts = name.split("/");
                          const idx = parts.indexOf("Tables");
                          if (idx !== -1 && parts.length > idx + 1) {
                            name = parts[idx + 1];
                          }
                        }
                        return name || "Dataset";
                      })()}
                    </p>
                  </div>

                  {/* Model */}
                  <p className="text-sm text-muted-foreground">
                    Model:{" "}
                    <span className="font-medium text-foreground">
                      {selectedModel.modelName}
                    </span>
                  </p>

                  {/* Run Test Button Only */}
                  <Button
                    onClick={handleRunTest}
                    disabled={isRunningTest}
                    size="lg"
                    className="min-w-32"
                  >
                    {isRunningTest ? "Running Test..." : "Run Test"}
                  </Button>

                  {isRunningTest && (
                    <p className="text-sm text-muted-foreground animate-pulse">
                      Processing your data...
                    </p>
                  )}
                </div>
              )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload/Test Modal (when user clicks model Upload we open wizard; after wizard closes user can run test) */}
      <Dialog
        open={viewResultsModalOpen}
        onOpenChange={setViewResultsModalOpen}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Test Results
            </DialogTitle>
            {selectedModel && (
              <p className="text-muted-foreground text-sm">
                Results for {selectedModel.modelName} on {selectedModel.dataset}
              </p>
            )}
          </DialogHeader>

          {testResults && (
            <div className="py-4">
              <TestResultsDisplay results={testResults} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const TestResultsDisplay = ({ results }: { results: TestResults }) => {
  const userEmail = getUserFromLocalStorage()?.email || "";
  const overallStatus = results.drift_report?.overall_status ?? "unknown";
  const [predictionsPreviews, setPredictionsPreviews] = useState<
    Record<string, { rows: any[]; predictedCol?: string }>
  >({}); // Now stores rows + detected predicted column
  const [loadingPreviews, setLoadingPreviews] = useState<Set<string>>(
    new Set()
  );

  const PREDICTION_KEYWORDS = [
    "predicted",
    "prediction",
    "pred",
    "forecast",
    "score",
    "probability",
    "label", // sometimes for classification
    results.targetColumn
      ? `predicted_${results.targetColumn.toLowerCase()}`
      : "",
  ].filter(Boolean);

  const detectPredictedColumn = (headers: string[]): string | undefined => {
    const lowerHeaders = headers.map((h) => h.toLowerCase().trim());

    // Exact matches first
    for (const keyword of PREDICTION_KEYWORDS) {
      const index = lowerHeaders.findIndex((h) =>
        h.includes(keyword.toLowerCase())
      );
      if (index !== -1) {
        return headers[index];
      }
    }

    // Fallback: columns containing "pred" or ending with "_pred"
    return headers.find(
      (h) =>
        h.toLowerCase().includes("pred") || h.toLowerCase().endsWith("_pred")
    );
  };

  const fetchPredictionsPreview = async (
    testResultId: string,
    blobPath: string
  ) => {
    if (predictionsPreviews[testResultId]) return;

    setLoadingPreviews((prev) => new Set(prev).add(testResultId));
    setPredictionsPreviews((prev) => ({
      ...prev,
      [testResultId]: { rows: [], predictedCol: undefined },
    }));

    try {
      const url = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/download_predictions?blob_path=${encodeURIComponent(
        blobPath
      )}&user_email=${encodeURIComponent(userEmail)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch predictions");

      const text = await res.text();
      const lines = text.trim().split("\n");
      if (lines.length < 1) throw new Error("Empty file");

      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().replace(/"/g, ""));
      const dataLines = lines.slice(1, 6); // first 5 rows

      const rows = dataLines.map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""));
        return Object.fromEntries(headers.map((h, i) => [h, values[i] || ""]));
      });

      const predictedCol = detectPredictedColumn(headers);

      setPredictionsPreviews((prev) => ({
        ...prev,
        [testResultId]: { rows, predictedCol },
      }));
    } catch (err) {
      console.error("Failed to load predictions preview:", err);
      setPredictionsPreviews((prev) => ({
        ...prev,
        [testResultId]: { rows: [], predictedCol: undefined },
      }));
      toast({
        title: "Preview failed",
        description: "Could not load prediction preview.",
        variant: "destructive",
      });
    } finally {
      setLoadingPreviews((prev) => {
        const next = new Set(prev);
        next.delete(testResultId);
        return next;
      });
    }
  };

  const handleDownload = async (blobPath: string, fileName: string) => {
    // ... (same as before)
    try {
      const url = `https://automl-webnew-chcgfqc8a5cbhtc4.eastus-01.azurewebsites.net/download_predictions?blob_path=${encodeURIComponent(
        blobPath
      )}&user_email=${encodeURIComponent(userEmail)}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not download predictions.",
        variant: "destructive",
      });
    }
  };

  if (!results.testHistory || results.testHistory.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <TestTube2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        No test history available.
      </div>
    );
  }

  return (
    <div className="space-y-8 py-5">
      {results.testHistory.map((test, idx) => {
        const previewData = predictionsPreviews[test.testResultId];
        const { rows = [], predictedCol } = previewData || {};
        const isLoading = loadingPreviews.has(test.testResultId);

        return (
          <div
            key={test.testResultId}
            className="border border-border rounded-xl bg-card p-6"
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-semibold text-lg">
                  Test #{results.testHistory!.length - idx}
                </p>
                <p className="text-sm text-muted-foreground">
                  {test.testFileName}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  ID: {test.testResultId}
                </p>
              </div>

              {test.blobPath && (
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() =>
                    handleDownload(
                      test.blobPath!,
                      test.testFileName.replace(".csv", "_predictions.csv")
                    )
                  }
                >
                  <Download className="w-4 h-4" />
                  Download predictions
                </Button>
              )}
            </div>

            {/* Metrics */}
            {test.metrics && test.metrics.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium mb-3">Metrics</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Metric</TableHead>
                      <TableHead className="text-right">Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {test.metrics
                      .filter((m) => {
                        // For multistep forecasting, only show avg_ metrics
                        if (results.task?.toLowerCase().includes("multistep")) {
                          return m.name.toLowerCase().startsWith("avg_");
                        }
                        // For other tasks, show all metrics
                        return true;
                      })
                      .map((m) => (
                        <TableRow key={m.name}>
                          <TableCell className="capitalize">
                            {m.name.replace(/_/g, " ")}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {typeof m.testing === "number"
                              ? m.testing.toFixed(4)
                              : m.testing}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* 🔥 Multistep forecasting fallback metrics */}
            {results.task === "multistep_forecasting" &&
              (!test.metrics || test.metrics.length === 0) &&
              results.training_test_metrics && (
                <div className="mb-6">
                  <h4 className="font-medium mb-3">Metrics</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Avg RMSE</TableCell>
                        <TableCell className="text-right font-medium">
                          {results.training_test_metrics.avg_rmse?.toFixed(4)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avg MAE</TableCell>
                        <TableCell className="text-right font-medium">
                          {results.training_test_metrics.avg_mae?.toFixed(4)}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Avg R²</TableCell>
                        <TableCell className="text-right font-medium">
                          {results.training_test_metrics.avg_r2?.toFixed(4)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <p className="text-xs text-muted-foreground mt-2">
                    Metrics are averaged across forecast horizons
                  </p>
                </div>
              )}
            {/* ================= Drift Report ================= */}
            {/* ================= Drift Report ================= */}
            {results.drift_report && (
              <div className="mb-6 border border-border rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">Drift Report</h4>

                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      overallStatus === "stable"
                        ? "bg-green-100 text-green-700"
                        : overallStatus === "activated"
                        ? "bg-blue-100 text-blue-700"
                        : overallStatus === "data_drift"
                        ? "bg-yellow-100 text-yellow-700"
                        : overallStatus === "degraded"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {overallStatus.toUpperCase()}
                  </span>
                </div>

                {/* Summary */}
                {results.drift_report.summary_message && (
                  <p className="text-sm mb-2">
                    {results.drift_report.summary_message}
                  </p>
                )}

                {/* Details */}
                {results.drift_report.details && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line mb-3">
                    {results.drift_report.details}
                  </p>
                )}

                {/* ================= Data Drift ================= */}
                {results.drift_report.data_drift?.detected && (
                  <div className="mb-3 p-3 rounded bg-yellow-500/5 border border-yellow-500/20">
                    <p className="font-medium text-sm mb-1">
                      Data Drift Detected
                    </p>
                    <p className="text-sm">
                      PSI: {results.drift_report.data_drift.overall_psi}
                    </p>
                    <p className="text-sm">
                      Drifted features (
                      {results.drift_report.data_drift.drifted_features_count}):
                    </p>
                    <ul className="list-disc list-inside text-sm">
                      {results.drift_report.data_drift.drifted_features?.map(
                        (f) => (
                          <li key={f}>{f}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {/* ================= Performance Drift ================= */}
                {results.drift_report.performance_drift?.detected && (
                  <div className="mb-3 p-3 rounded bg-red-500/5 border border-red-500/20">
                    <p className="font-medium text-sm mb-1">
                      Performance Degradation
                    </p>
                    <p className="text-sm">
                      Drop:{" "}
                      {
                        results.drift_report.performance_drift
                          .relative_drop_percent
                      }
                      %
                    </p>
                    <p className="text-sm">
                      Baseline:{" "}
                      {results.drift_report.performance_drift.baseline_metric} →
                      Current:{" "}
                      {results.drift_report.performance_drift.current_metric}
                    </p>
                  </div>
                )}

                {/* Recommendation */}
                {results.drift_report.recommendation && (
                  <p className="text-sm font-medium mt-2">
                    Recommendation: {results.drift_report.recommendation}
                  </p>
                )}
              </div>
            )}

            {/* Prediction Preview */}
            {test.blobPath && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">
                    Prediction Preview (first 5 rows)
                    {predictedCol && (
                      <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        Predicted: <strong>{predictedCol}</strong>
                      </span>
                    )}
                  </h4>
                  {previewData === undefined && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        fetchPredictionsPreview(
                          test.testResultId,
                          test.blobPath!
                        )
                      }
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Load Preview"}
                    </Button>
                  )}
                </div>

                {isLoading && (
                  <p className="text-sm text-muted-foreground">
                    Loading preview...
                  </p>
                )}

                {rows.length > 0 && (
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          {Object.keys(rows[0]).map((col) => (
                            <TableHead
                              key={col}
                              className={`whitespace-nowrap ${
                                col === predictedCol
                                  ? "bg-primary/20 text-primary font-semibold"
                                  : ""
                              }`}
                            >
                              {col}
                              {col === predictedCol && " ⭐"}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row, i) => (
                          <TableRow key={i}>
                            {Object.keys(row).map((col) => (
                              <TableCell
                                key={col}
                                className={`whitespace-nowrap max-w-xs ${
                                  col === predictedCol
                                    ? "bg-primary/5 font-semibold text-primary"
                                    : ""
                                }`}
                              >
                                <span className="block truncate">
                                  {row[col]}
                                </span>
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {previewData !== undefined && rows.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground border border-border rounded-lg">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Failed to load prediction preview</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TestTab;
