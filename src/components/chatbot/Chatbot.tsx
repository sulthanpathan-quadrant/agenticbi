// src/components/chatbot/Chatbot.tsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Brain,
  Database,
  Cpu,
  Workflow,
  CheckCircle,
  Sparkles,
  Upload,
  Plus,
  History,
  ChevronLeft,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import UnifiedImportModal from "@/components/modals/UnifiedImportModal";
import UnifiedImportModal from "../modals/UnifiedImportModal";
// import { useChatContext } from "@/contexts/ChatContext";
import { useChatContext } from "../contexts/ChatContext";
// Chatbot.tsx types from ChatContext
// import { Message, BuildData } from "@/contexts/ChatContext";
import { Message, BuildData } from "../contexts/ChatContext";
// utility to get session id (imported)
// import { getSessionId as utilsGetSessionId } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  modalBuildId?: string;
}

interface ChatbotProps {
  onShowAnalysis?: () => void;
}

const API_BASE_URL =
  "https://api.veriton.ai/api/service3";

const Chatbot = ({ onShowAnalysis }: ChatbotProps) => {
  const navigate = useNavigate();
  const {
    isOpen,
    setIsOpen,
    chatSessions,
    setChatSessions,
    currentSessionId,
    setCurrentSessionId,
    messages,
    setMessages,
    currentBuildData,
    setCurrentBuildData,
  } = useChatContext();

  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [showFullScreenBuild, setShowFullScreenBuild] = useState(false);
  const [buildStage, setBuildStage] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPreviewForMessage, setShowPreviewForMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (messages.length > 1) {
      const sessionTitle =
        messages.find((m) => m.role === "user")?.content.slice(0, 30) ||
        "Chat Session";
      const buildMessage = messages.find((m) => m.type === "build-complete");

      const currentSession: ChatSession = {
        id: currentSessionId,
        title: sessionTitle + "...",
        messages: [...messages],
        createdAt: new Date(),
        modalBuildId: buildMessage?.buildData?.buildId,
      };

      setChatSessions((prev) => {
        const filtered = prev.filter((s) => s.id !== currentSessionId);
        return [currentSession, ...filtered];
      });
    }
  }, [messages, currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBuilding, buildStage]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);
  // Add this style tag to properly render HTML tables in messages
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
    .message-content table {
      border-collapse: collapse;
      font-size: 12px;
      width: 100%;
    }
    .message-content th,
    .message-content td {
      padding: 8px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      text-align: left;
    }
    .message-content thead tr {
      background: rgba(0, 0, 0, 0.05);
    }
  `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // use imported util for session id
  const getSessionId = () => {
    try {
      const userStr = localStorage.getItem("aivolve_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.session_id || "";
      }
      return "";
    } catch {
      return "";
    }
  };

  const getUserEmail = () => {
    try {
      const userStr = localStorage.getItem("aivolve_user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.email || "";
      }
      return "";
    } catch {
      return "";
    }
  };
  // --- upload file endpoint unchanged logic
  const uploadFileToApi = async (file: File): Promise<any | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("session_id", getSessionId());
      formData.append("user_email", getUserEmail());
      formData.append("query", "true");

      const response = await fetch(`${API_BASE_URL}/upload_file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleFileUpload = async (
    file: File,
    fileName: string,
    source: string
  ) => {
    setUploadedFile(file);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Uploaded file: ${fileName} (from ${source})`,
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, userMessage]);

    // show analyzing message
    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "Analyzing your dataset...",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, loadingMessage]);
    setIsTyping(true);

    const apiResponse = await uploadFileToApi(file);
    setIsTyping(false);

    if (apiResponse) {
      setCurrentFileId(apiResponse.fileid || null);

      const assistantMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: `${apiResponse.message || "File uploaded."}\n\n${
          apiResponse.overview_response || ""
        }\n\n${(apiResponse.suggestions || [])
          .map((s: string) => `• ${s}`)
          .join("\n")}`,
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingMessage.id);
        return [...filtered, assistantMessage];
      });
    } else {
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== loadingMessage.id);
        const errorMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content:
            "Sorry, there was an error analyzing your file. Please try again or check your connection.",
          timestamp: new Date(),
          type: "text",
        };
        return [...filtered, errorMessage];
      });
    }
  };

  const handleImportComplete = async (dataset: {
    name: string;
    source: string;
    file?: File;
    rows?: number | null;
    columns?: number | null;
    preview?: any[];
    onelakeConfig?: {
      workspaceName: string;
      lakehouseName: string;
      filePath: string;
      mode: string;
    };
  }) => {
    setShowImportModal(false);

    if (dataset.file) {
      handleFileUpload(dataset.file, dataset.name, dataset.source);
    } else if (dataset.source === "onelake" && dataset.onelakeConfig) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Importing dataset: ${dataset.name} (from ${dataset.source})`,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, userMessage]);

      const loadingMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Downloading file from OneLake and uploading...",
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, loadingMessage]);
      setIsTyping(true);

      try {
        const relativePath = dataset.onelakeConfig.filePath;
        const encodedWorkspace = encodeURIComponent(
          dataset.onelakeConfig.workspaceName
        );
        const encodedLakehouse = encodeURIComponent(
          dataset.onelakeConfig.lakehouseName
        );
        const encodedPath = encodeURIComponent(relativePath);

        // 1. Fetch preview for display
        const previewUrl = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/${encodedWorkspace}/lakehouses/${encodedLakehouse}/preview?path=${encodedPath}&rows=1000`;

        const previewRes = await fetch(previewUrl, {
          method: "GET",
          headers: { accept: "application/json" },
        });

        if (!previewRes.ok) {
          throw new Error("Failed to fetch preview");
        }

        const previewData = await previewRes.json();
        const fullRows = previewData.preview.data || [];
        const fullColumns = previewData.preview.columns || [];

        // 2. Download parquet file
        // 2. Download parquet file
        const downloadUrl = `https://automl-onelake-webapp-eedahsgvbug3apc6.eastus-01.azurewebsites.net/workspaces/${encodedWorkspace}/lakehouses/${encodedLakehouse}/download?path=${encodedPath}`;

        console.log("=== DOWNLOAD DEBUG ===");
        console.log("Download URL:", downloadUrl);

        const downloadRes = await fetch(downloadUrl, {
          method: "GET",
          headers: {
            accept: "application/octet-stream",
          },
        });

        console.log("Download response status:", downloadRes.status);
        console.log(
          "Download response headers:",
          Object.fromEntries(downloadRes.headers.entries())
        );

        if (!downloadRes.ok) {
          const errorText = await downloadRes.text();
          console.error("Download error:", errorText);
          throw new Error(
            `Failed to download file from OneLake: ${downloadRes.status}`
          );
        }

        // Get the blob
        const blob = await downloadRes.blob();
        console.log("Downloaded blob size:", blob.size);
        console.log("Downloaded blob type:", blob.type);

        // Get filename from Content-Disposition header or construct it
        // Get filename from Content-Disposition header or use original
       // Get filename from Content-Disposition header
let fileName = "";
const contentDisposition = downloadRes.headers.get('content-disposition');
if (contentDisposition) {
  const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
  if (matches != null && matches[1]) {
    fileName = matches[1].replace(/['"]/g, '');
  }
}

// If no filename from header, construct from dataset name
if (!fileName) {
  fileName = dataset.name;
  
  // For tables mode, if dataset name has no extension, add .parquet
  if (dataset.onelakeConfig?.mode === "tables") {
    if (!fileName.toLowerCase().endsWith('.parquet')) {
      fileName = fileName + '.parquet';
    }
  }
  // For files mode, ensure it has an extension
  else if (dataset.onelakeConfig?.mode === "files") {
    // If no extension, try to detect from path or default to .csv
    if (!fileName.match(/\.[a-z]+$/i)) {
      const pathExt = relativePath.match(/\.([a-z]+)$/i);
      fileName = fileName + (pathExt ? pathExt[0] : '.csv');
    }
  }
}

console.log("Final filename:", fileName);

// Determine correct MIME type based on extension
let fileType = blob.type || "application/octet-stream";
if (fileName.toLowerCase().endsWith('.csv')) {
  fileType = "text/csv";
} else if (fileName.toLowerCase().endsWith('.parquet')) {
  fileType = "application/octet-stream";
}

console.log("File type:", fileType);

        const downloadedFile = new File([blob], fileName, {
          type: fileType,
        });

        console.log("File type:", fileType);

        // 3. Upload parquet to backend
        const uploadFormData = new FormData();
        uploadFormData.append("file", downloadedFile);
        uploadFormData.append("session_id", getSessionId());
        uploadFormData.append("user_email", getUserEmail());
        uploadFormData.append("query", "true");

        console.log("=== UPLOAD DEBUG ===");
        console.log("fileName:", fileName);
        console.log("parquetFile size:", downloadedFile.size);
        console.log("session_id:", getSessionId());
        console.log("user_email:", getUserEmail());

        const uploadRes = await fetch(`${API_BASE_URL}/upload_file`, {
          method: "POST",
          body: uploadFormData,
        });

        console.log("Upload response status:", uploadRes.status);

        if (!uploadRes.ok) {
          const errorText = await uploadRes.text();
          console.error("=== UPLOAD ERROR ===");
          console.error("Status:", uploadRes.status);
          console.error("Response:", errorText);
          throw new Error(`Upload failed: ${uploadRes.status} - ${errorText}`);
        }

        const uploadData = await uploadRes.json();
        console.log("=== UPLOAD SUCCESS ===");
        console.log("Upload response:", uploadData);
        setIsTyping(false);
        setMessages((prev) => prev.filter((m) => m.id !== loadingMessage.id));

        // 4. Display preview table
        const previewRows = fullRows.slice(0, 5);
        const previewTableHtml = `
<div style="overflow-x: auto; margin: 10px 0;">
  <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
    <thead>
      <tr style="background: rgba(0,0,0,0.05);">
        ${fullColumns
          .map(
            (c: any) =>
              `<th style="padding: 8px; border: 1px solid rgba(0,0,0,0.1); text-align: left;">${c.name}</th>`
          )
          .join("")}
      </tr>
    </thead>
    <tbody>
      ${previewRows
        .map(
          (row: any) => `
        <tr>
          ${fullColumns
            .map(
              (c: any) =>
                `<td style="padding: 8px; border: 1px solid rgba(0,0,0,0.1);">${
                  row[c.name] || ""
                }</td>`
            )
            .join("")}
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>
  <p style="font-size: 11px; color: #666; margin-top: 8px;">
    Showing 5 of ${fullRows.length} rows • ${fullColumns.length} columns
  </p>
</div>
    `.trim();

        const previewMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: `**Dataset Preview:**\n${previewTableHtml}`,
          timestamp: new Date(),
          type: "text",
          previewData: {
            html: previewTableHtml,
            rowCount: fullRows.length,
            columnCount: fullColumns.length,
          },
        };
        setMessages((prev) => [...prev, previewMessage]);

        // 5. Display upload response
        const responseMessage: Message = {
          id: (Date.now() + 3).toString(),
          role: "assistant",
          content: `${uploadData.message || "File uploaded."}\n\n${
            uploadData.overview_response || ""
          }\n\n${(uploadData.suggestions || [])
            .map((s: string) => `• ${s}`)
            .join("\n")}`,
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, responseMessage]);

        setCurrentFileId(uploadData.fileid || null);
      } catch (error) {
        console.error("OneLake import error:", error);
        setIsTyping(false);

        setMessages((prev) => {
          const filtered = prev.filter((m) => m.id !== loadingMessage.id);
          const errorMessage: Message = {
            id: (Date.now() + 2).toString(),
            role: "assistant",
            content:
              "Sorry, there was an error importing from OneLake. Please try again.",
            timestamp: new Date(),
            type: "text",
          };
          return [...filtered, errorMessage];
        });
      }
    } else {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: `Imported dataset: ${dataset.name} (from ${dataset.source})`,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, userMessage]);
    }
  };

  const startNewChat = async () => {
    // Save current session if it has messages
    if (messages.length > 1) {
      const sessionTitle =
        messages.find((m) => m.role === "user")?.content.slice(0, 30) ||
        "New Chat";
      const buildMessage = messages.find((m) => m.type === "build-complete");
      const newSession: ChatSession = {
        id: currentSessionId,
        title: sessionTitle + "...",
        messages: [...messages],
        createdAt: new Date(),
        modalBuildId: buildMessage?.buildData?.buildId,
      };
      setChatSessions((prev) => [
        newSession,
        ...prev.filter((s) => s.id !== currentSessionId),
      ]);
    }

    // Call API to create new session
    const sessionData = await createNewSession();

    if (sessionData) {
      // Update localStorage with new session_id
      try {
        const userStr = localStorage.getItem("aivolve_user");
        if (userStr) {
          const user = JSON.parse(userStr);
          user.session_id = sessionData.session_id;
          user.agent_id = sessionData.agent_id; // Store agent_id as well
          localStorage.setItem("aivolve_user", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error updating localStorage:", error);
      }

      // Set new session ID
      setCurrentSessionId(sessionData.session_id);
    } else {
      // Fallback to timestamp-based ID if API fails
      const fallbackSessionId = Date.now().toString();
      setCurrentSessionId(fallbackSessionId);
      console.warn("Using fallback session ID due to API error");
    }

    // Reset chat state
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI assistant. I can help you analyze data, build models, and answer questions about your ML pipeline. How can I assist you today?",
        timestamp: new Date(),
        type: "text",
      },
    ]);
    setUploadedFile(null);
    setCurrentFileId(null);
    setCurrentBuildData(null);
    setShowHistory(false);
  };

  const loadSession = (session: ChatSession) => {
    if (messages.length > 1 && currentSessionId !== session.id) {
      const sessionTitle =
        messages.find((m) => m.role === "user")?.content.slice(0, 30) || "Chat";
      const buildMessage = messages.find((m) => m.type === "build-complete");
      const currentSession: ChatSession = {
        id: currentSessionId,
        title: sessionTitle + "...",
        messages: [...messages],
        createdAt: new Date(),
        modalBuildId: buildMessage?.buildData?.buildId,
      };
      setChatSessions((prev) => {
        const filtered = prev.filter(
          (s) => s.id !== currentSessionId && s.id !== session.id
        );
        return [currentSession, ...filtered];
      });
    }

    setCurrentSessionId(session.id);
    setMessages(session.messages);
    const buildMessage = session.messages.find(
      (m) => m.type === "build-complete"
    );
    if (buildMessage?.buildData) {
      setCurrentBuildData(buildMessage.buildData);
    } else {
      setCurrentBuildData(null);
    }
    setShowHistory(false);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // build stages declared above so it's available for runtime when used
  const buildStages = [
    { id: 1, name: "Loading Data", icon: Database },
    { id: 2, name: "Feature Engineering", icon: Workflow },
    { id: 3, name: "Model Training", icon: Cpu },
    { id: 4, name: "Optimization", icon: Brain },
  ];

  // call backend endpoint
  const runProcessTaskQuery = async (queryText: string) => {
    const session_id =
      getSessionId() || currentSessionId || Date.now().toString();
    const user_email = getUserEmail();

    try {
      const body = new URLSearchParams();
      body.append("session_id", session_id);
      body.append("query", queryText);
      body.append("user_email", user_email);

      const resp = await fetch(`${API_BASE_URL}/process_task_query`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!resp.ok) {
        throw new Error("process_task_query failed");
      }

      const data = await resp.json();
      return data;
    } catch (err) {
      console.error("process_task_query error", err);
      return null;
    }
  };

  const createNewSession = async (): Promise<{
    session_id: string;
    agent_id: string;
  } | null> => {
    try {
      const user_email = getUserEmail();

      const body = new URLSearchParams();
      body.append("user_email", user_email);

      const response = await fetch(`${API_BASE_URL}/create_session`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error("Failed to create session");
      }

      const data = await response.json();
      return data; // { session_id: "thread_xxx", agent_id: "asst_xxx" }
    } catch (error) {
      console.error("Error creating new session:", error);
      return null;
    }
  };

  // Replace the startBuildFlowWithBackend function in Chatbot.tsx
  // Starting from after: const apiResp = await runProcessTaskQuery(queryText);

  const startBuildFlowWithBackend = async (queryText: string) => {
    setIsBuilding(true);
    setShowFullScreenBuild(true);
    setBuildStage(0);
    setBuildProgress(2);

    const buildingMsg: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: "Starting the model build process...",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, buildingMsg]);
    setIsTyping(true);

    const progressInterval = setInterval(() => {
      setBuildProgress((prev) => Math.min(98, prev + Math.random() * 6 + 1));
      setBuildStage((prev) =>
        Math.min(buildStages.length - 1, prev + (Math.random() < 0.12 ? 1 : 0))
      );
    }, 800);

    const apiResp = await runProcessTaskQuery(queryText);
    clearInterval(progressInterval);
    setIsTyping(false);

    // Check if API returned an error or no results
    if (!apiResp || !apiResp.all_models || apiResp.status === "error") {
      const errorMessage =
        apiResp?.response ||
        "Model build failed or returned no results. Please ensure the upload completed and try again.";
      const suggestions = apiResp?.suggestions || [];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: `${errorMessage}\n\n${
            suggestions.length > 0
              ? `**Suggestions:**\n${suggestions
                  .map((s: string) => `• ${s}`)
                  .join("\n")}`
              : ""
          }`,
          timestamp: new Date(),
          type: "text",
        },
      ]);

      setIsBuilding(false);
      setShowFullScreenBuild(false);
      setBuildProgress(0);
      setBuildStage(0);
      return;
    }

    console.log("API Response:", apiResp);

    // Display the response message in chatbot
    const responseMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content: apiResp.response || "Analysis complete.",
      timestamp: new Date(),
      type: "text",
    };
    setMessages((prev) => [...prev, responseMessage]);

    // Display suggestions if available
    if (apiResp.suggestions && apiResp.suggestions.length > 0) {
      const suggestionsMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `**Suggestions:**\n${apiResp.suggestions
          .map((s: string) => `• ${s}`)
          .join("\n")}`,
        timestamp: new Date(),
        type: "text",
      };
      setMessages((prev) => [...prev, suggestionsMessage]);
    }

    // Get buildId
    const buildId = apiResp.dataset_id || `build-${Date.now().toString(36)}`;

    // Get dataset name
    const dataset =
      apiResp.blob_file_used || uploadedFile?.name || "dataset.csv";

    // Create BuildData with results object for ModalBuilding
    const buildData: BuildData = {
      buildId,
      dataset,
      task_type: apiResp.task_type, // ← ADD THIS LINE
      target: apiResp.target, // ← ADD THIS LINE (optional but useful)
      results: {
        all_models: apiResp.all_models,
        best_model: apiResp.best_model,
        train: apiResp.all_models
          ? Object.keys(apiResp.all_models).reduce((acc, modelName) => {
              acc[modelName] = apiResp.all_models[modelName].train;
              return acc;
            }, {} as any)
          : {},
        test: apiResp.all_models
          ? Object.keys(apiResp.all_models).reduce((acc, modelName) => {
              acc[modelName] = apiResp.all_models[modelName].test;
              return acc;
            }, {} as any)
          : {},
      },
      rows: null,
      columns: null,
    };
    console.log("Parsed BuildData:", buildData);

    setCurrentBuildData(buildData);

    const completeMessage: Message = {
      id: (Date.now() + 2).toString(),
      role: "assistant",
      content: "Analysis complete! Opening results...",
      timestamp: new Date(),
      type: "build-complete",
      buildData,
    };
    setMessages((prev) => [...prev, completeMessage]);

    const sessionTitle =
      messages.find((m) => m.role === "user")?.content.slice(0, 30) ||
      "Model Build";
    const newSession: ChatSession = {
      id: currentSessionId || getSessionId(),
      title: `🔧 ${sessionTitle}...`,
      messages: [...messages, completeMessage],
      createdAt: new Date(),
      modalBuildId: buildId,
    };

    setChatSessions((prev) => [
      newSession,
      ...prev.filter((s) => s.id !== (currentSessionId || getSessionId())),
    ]);

    setIsBuilding(false);
    setBuildProgress(100);
    setBuildStage(buildStages.length - 1);

    setTimeout(() => {
      setShowFullScreenBuild(false);
      setIsOpen(false);
      navigate(`/modal-building/${buildId}`);
    }, 900);
  };

  const handleSend = async () => {
    if (!input.trim() || isBuilding) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      type: "text",
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(async () => {
      setIsTyping(false);

      const lowerInput = currentInput.toLowerCase();

      if (
        (lowerInput.includes("build") &&
          (lowerInput.includes("modal") || lowerInput.includes("model"))) ||
        lowerInput.includes("build a model") ||
        lowerInput === "build"
      ) {
        await startBuildFlowWithBackend(currentInput);
      } else if (
        lowerInput.includes("analyze") ||
        lowerInput.includes("analysis")
      ) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I've completed the detailed analysis of your dataset. You can now view the results in the Detailed Analysis section. The analysis includes dataset preview, summary statistics, outlier detection, and key findings.",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, assistantMessage]);
        if (onShowAnalysis) onShowAnalysis();
      } else {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I understand your request. Based on your current data and models, I can provide insights on model performance, data quality, or help you set up new experiments. What specific aspect would you like to explore?",
          timestamp: new Date(),
          type: "text",
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    }, 700);
  };

  const handleGoToModalBuild = () => {
    if (currentBuildData) {
      navigate(`/modal-building/${currentBuildData.buildId}`);
    }
  };

  // --- Rendering functions (kept your UI) ---
  const renderFullScreenBuildAnimation = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[500] flex items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <div className="w-full max-w-lg p-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-primary" />
          </motion.div>
          <span className="text-2xl font-bold text-foreground">
            Building ML Model
          </span>
        </div>

        <div className="flex justify-center mb-8">
          <motion.div className="relative w-40 h-40">
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <svg className="w-40 h-40 -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--secondary))"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r="70"
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * buildProgress) / 100}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Brain className="w-12 h-12 text-primary" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-3xl font-bold text-primary mb-2">
          {Math.round(buildProgress)}%
        </p>
        <p className="text-center text-sm text-muted-foreground mb-8">
          Training multiple models... Optimizing hyperparameters...
        </p>

        <div className="space-y-3">
          {buildStages.map((stage, index) => {
            const Icon = stage.icon;
            const isComplete = index < buildStage;
            const isCurrent = index === buildStage;

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl text-sm transition-all ${
                  isCurrent
                    ? "bg-primary/20 border-2 border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                    : isComplete
                    ? "bg-success/10 border border-success/20"
                    : "bg-secondary/30 border border-transparent"
                }`}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isComplete
                      ? "bg-success"
                      : isCurrent
                      ? "bg-primary"
                      : "bg-secondary"
                  }`}
                  animate={
                    isCurrent
                      ? {
                          boxShadow: [
                            "0 0 0 0 hsl(var(--primary)/0.4)",
                            "0 0 0 12px hsl(var(--primary)/0)",
                            "0 0 0 0 hsl(var(--primary)/0.4)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-success-foreground" />
                  ) : (
                    <Icon
                      className={`w-5 h-5 ${
                        isCurrent
                          ? "text-primary-foreground"
                          : "text-muted-foreground"
                      }`}
                    />
                  )}
                </motion.div>

                <span
                  className={`font-medium flex-1 ${
                    isCurrent
                      ? "text-foreground"
                      : isComplete
                      ? "text-success"
                      : "text-muted-foreground"
                  }`}
                >
                  {stage.name}
                </span>

                {isCurrent && (
                  <motion.span
                    className="text-xs text-primary font-medium"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Processing...
                  </motion.span>
                )}
                {isComplete && (
                  <span className="text-xs text-success">Complete</span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {[...Array(7)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 rounded-full bg-primary/60"
              animate={{ y: [0, -12, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.12 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderBuildComplete = (buildData: BuildData) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full bg-gradient-to-br from-success/10 via-secondary/50 to-success/5 rounded-lg p-4 border border-success/30"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-success-foreground" />
        </div>
        <span className="font-semibold text-foreground">
          Model Build Complete!
        </span>
      </div>

      <div className="space-y-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-card/60 p-2 rounded border border-border/50">
            <p className="text-muted-foreground">Dataset</p>
            <p className="font-medium text-foreground truncate">
              {buildData.dataset}
            </p>
          </div>
          <div className="bg-card/60 p-2 rounded border border-border/50">
            <p className="text-muted-foreground">Best Model</p>
            <p className="font-bold text-primary">{buildData.bestModel}</p>
          </div>
        </div>
        <p className="text-muted-foreground text-center">
          Navigating to results...
        </p>
      </div>
    </motion.div>
  );

  const renderBuildBanner = () => {
    if (!currentBuildData) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mb-2 p-3 bg-primary/10 border border-primary/20 rounded-lg"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              Modal built: {currentBuildData.dataset}
            </p>
            <p className="text-[10px] text-muted-foreground">
              Best: {currentBuildData.bestModel} (
              {currentBuildData.metrics?.accuracy ?? "-"})
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs shrink-0"
            onClick={handleGoToModalBuild}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            View
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      <AnimatePresence>
        {showFullScreenBuild && renderFullScreenBuildAnimation()}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-glow flex items-center justify-center z-[150] ${
          isOpen ? "hidden" : ""
        }`}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 400, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 400, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-4 bottom-4 w-[420px] min-w-[380px] max-w-[450px] z-[150] flex glass-modal rounded-2xl overflow-hidden"
            style={{
              height: "calc(100vh - 32px)",
              maxHeight: "700px",
              top: "auto",
            }}
          >
            <AnimatePresence>
              {showHistory && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 180, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="border-r border-border bg-secondary/30 overflow-hidden flex-shrink-0"
                >
                  <div className="p-3 border-b border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Chat History
                    </p>
                  </div>
                  <div className="p-2 space-y-1 overflow-y-auto max-h-[calc(100%-50px)] scrollbar-thin">
                    {chatSessions.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">
                        No previous chats
                      </p>
                    ) : (
                      chatSessions.map((session) => (
                        <button
                          key={session.id}
                          onClick={() => loadSession(session)}
                          className={`w-full text-left p-2 rounded-lg text-xs hover:bg-secondary/50 transition-colors ${
                            session.id === currentSessionId
                              ? "bg-primary/10 text-primary"
                              : "text-foreground"
                          }`}
                        >
                          <p className="truncate font-medium">
                            {session.title}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {session.createdAt.toLocaleDateString()}
                          </p>
                          {session.modalBuildId && (
                            <span className="text-[9px] bg-primary/20 text-primary px-1 rounded mt-1 inline-block">
                              Build
                            </span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0 bg-card/80">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setShowHistory(!showHistory)}
                    aria-label="Toggle chat history"
                  >
                    {showHistory ? (
                      <ChevronLeft className="w-4 h-4" />
                    ) : (
                      <History className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      AI Assistant
                    </h3>
                    <p className="text-xs text-success">Online</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startNewChat}
                    className="h-8 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    New
                  </Button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {renderBuildBanner()}

              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-2 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === "user" ? "bg-primary" : "bg-secondary"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-foreground" />
                      )}
                    </div>
                    <div
                      className={
                        message.type === "build-complete"
                          ? "w-full max-w-[calc(100%-36px)]"
                          : "max-w-[85%]"
                      }
                    >
                      {message.type === "build-complete" &&
                      message.buildData ? (
                        renderBuildComplete(message.buildData)
                      ) : message.previewData ? (
                        // NEW: Preview with button
                        <div
                          className={`p-3 rounded-xl text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-secondary text-foreground rounded-bl-none"
                          }`}
                        >
                          <p className="font-medium mb-2">
                            ✅ Dataset imported successfully!
                          </p>
                          <p className="text-xs mb-3">
                            {message.previewData.rowCount} rows ×{" "}
                            {message.previewData.columnCount} columns
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setShowPreviewForMessage(
                                showPreviewForMessage === message.id
                                  ? null
                                  : message.id
                              )
                            }
                            className="w-full mb-2"
                          >
                            {showPreviewForMessage === message.id
                              ? "Hide Preview"
                              : "Show Preview"}
                          </Button>
                          {showPreviewForMessage === message.id && (
                            <div
                              className="message-content mt-2"
                              dangerouslySetInnerHTML={{
                                __html: message.previewData.html,
                              }}
                            />
                          )}
                          <p
                            className={`text-[10px] mt-2 ${
                              message.role === "user"
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      ) : (
                        // EXISTING: Normal message rendering
                        <div
                          className={`p-3 rounded-xl text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-secondary text-foreground rounded-bl-none"
                          }`}
                        >
                          <div
                            className="message-content whitespace-pre-line"
                            dangerouslySetInnerHTML={{
                              __html: message.content,
                            }}
                          />
                          <p
                            className={`text-[10px] mt-1 ${
                              message.role === "user"
                                ? "text-primary-foreground/60"
                                : "text-muted-foreground"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-foreground" />
                    </div>
                    <div className="bg-secondary p-3 rounded-xl rounded-bl-none">
                      <div className="flex gap-1">
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-border flex-shrink-0 bg-card/80">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowImportModal(true)}
                    disabled={isBuilding}
                    title="Upload dataset"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isBuilding && handleSend()
                    }
                    placeholder={
                      isBuilding
                        ? "Building in progress..."
                        : "Ask me anything..."
                    }
                    className="flex-1"
                    disabled={isBuilding}
                  />
                  <Button
                    variant="glow"
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping || isBuilding}
                  >
                    {isTyping || isBuilding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {uploadedFile && (
                  <p className="text-xs text-muted-foreground mt-2">
                    File attached: {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <UnifiedImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={handleImportComplete}
      />
    </>
  );
};

export default Chatbot;
