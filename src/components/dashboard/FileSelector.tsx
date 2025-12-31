
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { Play, Loader2, Sparkles, FileText } from "lucide-react";
// import { useState } from "react";
 
// interface FileSelectionStepProps {
//   onGenerate: (filePath: string, query: string, apiResponse: any) => void;
// }
 
// export function FileSelectionStep({ onGenerate }: FileSelectionStepProps) {
//   const [filePath, setFilePath] = useState("");
//   const [query, setQuery] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
 
//   const handleGenerate = async () => {
//     const trimmedPath = filePath.trim();
//     const trimmedQuery = query.trim();
 
//     if (!trimmedPath) {
//       return toast.error("Please enter a file path");
//     }
//     if (!trimmedQuery) {
//       return toast.error("Please describe the insights you want");
//     }
 
//     setIsGenerating(true);
 
//     try {
//       const response = await fetch("https://4.227.238.34/generate_dashboard", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           business_objective: trimmedQuery,  // User's exact query sent here
//           csv_blob: trimmedPath,
//         }),
//       });
 
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to generate: ${response.status} ${errorText || response.statusText}`);
//       }
 
//       const data = await response.json();
 
//       onGenerate(trimmedPath, trimmedQuery, data);
//       toast.success("Dashboard generated successfully!");
//     } catch (error: any) {
//       toast.error(error.message || "Something went wrong. Please try again.");
//       console.error("API Error:", error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };
 
//   return (
//     <div className="max-w-6xl mx-auto space-y-12 py-8">
//       {/* File Path Input */}
//       <div>
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-xl font-semibold text-foreground">Enter Dataset Path</h2>
//           <span className="text-sm text-muted-foreground">e.g. powerbikpi/Forcast Template.csv</span>
//         </div>
 
//         <div className="max-w-2xl">
//           <div className="rounded-xl border border-border bg-card p-6 space-y-4">
//             <div className="flex items-center gap-3">
//               <FileText className="w-6 h-6 text-primary" />
//               <Input
//                 placeholder="Enter file path"
//                 value={filePath}
//                 onChange={(e) => setFilePath(e.target.value)}
//                 className="text-base"
//                 disabled={isGenerating}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
 
//       {/* Query Input - Only shows after file path */}
//       {filePath.trim() && (
//         <div className="space-y-4">
//           <h2 className="text-2xl font-bold flex items-center gap-3">
//             <Sparkles className="w-7 h-7 text-primary" />
//             What insights do you want?
//           </h2>
//           <div className="rounded-xl border border-border bg-card p-6">
//             <Textarea
//               placeholder="e.g. Show forecast for March and November by product and country"
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               className="min-h-32 resize-none"
//               disabled={isGenerating}
//             />
//             <div className="flex justify-end mt-4">
//               <Button onClick={handleGenerate} size="lg" disabled={isGenerating}>
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Generating Dashboard...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="w-4 h-4 mr-2" />
//                     Generate Dashboard
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
 
import { DataFile } from '@/components/types/dashboard';
import { FileText, Table, FileJson } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileSelectorProps {
  files: DataFile[];
  selectedFile: DataFile | null;
  onSelectFile: (file: DataFile) => void;
}

const fileIcons = {
  csv: FileText,
  excel: Table,
  json: FileJson,
};

const fileColors = {
  csv: 'text-emerald-400',
  excel: 'text-green-400',
  json: 'text-amber-400',
};

export function FileSelector({ files, selectedFile, onSelectFile }: FileSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {files.map((file) => {
        const Icon = fileIcons[file.type];
        const iconColor = fileColors[file.type];
        const isSelected = selectedFile?.id === file.id;
        
        return (
          <div
            key={file.id}
            onClick={() => onSelectFile(file)}
            className={cn(
              'group relative rounded-xl border p-3 transition-all duration-200 cursor-pointer',
              'border-border hover:border-primary/50 hover:bg-primary/5',
              isSelected && 'border-primary bg-primary/10 ring-1 ring-primary/30'
            )}
          >
            {/* File Icon & Info */}
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200',
                isSelected ? 'bg-primary/20' : 'bg-secondary/50 group-hover:bg-primary/10'
              )}>
                <Icon className={cn('w-4 h-4', iconColor)} />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-foreground block truncate text-sm">{file.name}</span>
                <span className="text-xs text-muted-foreground">
                  {file.rows.toLocaleString()} rows
                </span>
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}