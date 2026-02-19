import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  prepareDataset,
  PreparedDataset,
} from "@/components/utils/preparedDataset";
import Header from "@/components/layout/Header";
 
export default function AutoMLHub() {
  const location = useLocation();
  const navigate = useNavigate();
 
  const [prepared, setPrepared] = useState<PreparedDataset | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const prepareData = async () => {
      // First, check if passed via state (fresh navigation)
      let datasetFromState = location.state
        ?.preparedDataset as PreparedDataset | null;
 
      if (datasetFromState) {
        setPrepared(datasetFromState);
        setLoading(false);
        return;
      }
 
      // Fallback: re-prepare using stored identifiers
      const userId = localStorage.getItem("selected_user_id") || "";
      const jobId = localStorage.getItem("selected_job_id") || "";
      const datasetName = localStorage.getItem("selected_dataset_name") || "";
      const folderPath = localStorage.getItem("selected_folder_path") || ""; // Optional if you store it
 
      if (!userId || !jobId || !datasetName) {
        toast.error("No dataset selected. Please go back to datasets.");
        navigate("/datasets");
        return;
      }
 
      try {
        const toastId = toast.loading("Preparing dataset for AutoML...");
        const preparedData = await prepareDataset(
          userId,
          jobId,
          datasetName,
          folderPath,
        );
 
        if (!preparedData) {
          toast.error("Failed to prepare dataset", { id: toastId });
          navigate("/datasets");
          return;
        }
 
        toast.success("Dataset ready!", { id: toastId });
        setPrepared(preparedData);
 
        // Optional: store prepared blobPath etc. if needed for further persistence
      } catch (err: any) {
        console.error(err);
        toast.error("Preparation failed: " + (err.message || "Unknown error"));
        navigate("/datasets");
      } finally {
        setLoading(false);
      }
    };
 
    prepareData();
  }, [location.state, navigate]);
 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
 
  if (!prepared) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">No Dataset Loaded</h1>
        <p className="text-muted-foreground mb-6">
          Please select a dataset from the datasets tab.
        </p>
        <Button onClick={() => navigate("/datasets")}>
          Go Back to Datasets
        </Button>
      </div>
    );
  }
 
  const { name, total_rows, columns, rows } = prepared;
 
  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      {/* Veriton Header */}
      <Header />
 
      <div className="flex-1 flex flex-col overflow-auto">
        <main className="px-6 py-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* ================= PAGE HEADER ================= */}
 
            <div className="mb-8 flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">AutoML</h1>
 
                <p className="text-muted-foreground mt-1">
                  Dataset:
                  <span className="text-foreground font-medium ml-1">
                    {name}
                  </span>
                  <span className="mx-2">•</span>
                  {total_rows.toLocaleString()} rows
                  <span className="mx-2">•</span>
                  {columns.length} columns
                </p>
              </div>
 
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/datasets")}
              >
                Back to Dataset
              </Button>
            </div>
 
            {/* ================= DATASET CARD ================= */}
 
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              {/* CARD HEADER */}
 
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-semibold">Dataset Preview</h2>
 
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate("/workflow/automl/build-model", {
                        state: { preparedDataset: prepared },
                      })
                    }
                  >
                    Build Model
                  </Button>
 
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate("/workflow/automl/compare", {
                        state: { preparedDataset: prepared },
                      })
                    }
                  >
                    Compare
                  </Button>
                </div>
              </div>
 
              {/* TABLE */}
 
              <div className="overflow-x-auto max-h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted">
                      {columns.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
 
                  <TableBody>
                    {rows.slice(0, 20).map((row, i) => (
                      <TableRow key={i} className="hover:bg-muted/40">
                        {columns.map((col) => (
                          <TableCell key={col}>{row[col] ?? "—"}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
 
              {rows.length === 0 && (
                <div className="p-10 text-center text-muted-foreground">
                  No preview available
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
 
 