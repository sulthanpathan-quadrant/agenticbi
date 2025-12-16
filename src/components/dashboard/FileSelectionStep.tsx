// src/components/dashboard/FileSelectionStep.tsx
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Play, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

const availableFiles = [
  { id: 1, name: "sales_data_2024.csv", type: "csv", createdAt: "2024-12-01" },
  { id: 2, name: "customer_analytics.xlsx", type: "excel", createdAt: "2024-11-28" },
  { id: 3, name: "product_inventory.csv", type: "csv", createdAt: "2024-11-25" },
  { id: 4, name: "marketing_campaigns.xlsx", type: "excel", createdAt: "2024-11-20" },
  { id: 5, name: "revenue_quarterly.json", type: "json", createdAt: "2024-11-15" },
];

interface FileSelectionStepProps {
  onGenerate: (file: typeof availableFiles[0], query: string) => void;
}

export function FileSelectionStep({ onGenerate }: FileSelectionStepProps) {
  const [selectedFile, setSelectedFile] = useState<typeof availableFiles[0] | null>(null);
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedFile) return toast.error("Please select a file");
    if (!query.trim()) return toast.error("Please describe the insights you want");

    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsGenerating(false);

    onGenerate(selectedFile, query);
    toast.success("Dashboard generated!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* File Selection */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-foreground">Select Dataset</h2>
          <span className="text-sm text-muted-foreground">{availableFiles.length} files available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableFiles.map((file) => {
            const isSelected = selectedFile?.id === file.id;
            const isDisabled = selectedFile && !isSelected;

            return (
              <div
                key={file.id}
                onClick={() => !isDisabled && setSelectedFile(isSelected ? null : file)}
                className={`
                  relative rounded-xl border p-6 transition-all duration-200 cursor-pointer
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
                  ${isSelected ? "border-cyan-500 bg-cyan-500/5 ring-2 ring-cyan-500/20" : "border-border"}
                `}
              >
                <div className="absolute top-5 right-5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                    ${isSelected ? "border-cyan-500 bg-cyan-500" : "border-muted-foreground"}
                  `}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`
                    p-3 rounded-lg
                    ${file.type === "csv" ? "bg-emerald-500/20" : file.type === "excel" ? "bg-green-500/20" : "bg-amber-500/20"}
                  `}>
                    <FileText className={`w-6 h-6 ${file.type === "csv" ? "text-emerald-400" : file.type === "excel" ? "text-green-400" : "text-amber-400"}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(file.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insight Input */}
      {selectedFile && (
      
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-left  gap-3">
                  <Sparkles className="w-7 h-7 text-primary" />
                  What insights do you want?
                </h2>
              {/* <h2 className="text-lg font-semibold">What insights do you want?</h2> */}
              <div className="rounded-xl border border-border bg-card p-6">
                <Textarea
                  placeholder="e.g. Show me sales trends by region and product category with KPIs"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-32 resize-none"
                />
                <div className="flex justify-end mt-4">
                  <Button onClick={handleGenerate} size="lg" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Dashboard...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Generate Dashboard
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div> 
  );
}

