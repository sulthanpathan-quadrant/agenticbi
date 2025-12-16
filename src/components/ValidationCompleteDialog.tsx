import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CheckCircle2, X, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ValidationCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnalyzeFailures: () => void;
  onProceedToNER: () => void;
}

export function ValidationCompleteDialog({
  open,
  onOpenChange,
  onAnalyzeFailures,
  onProceedToNER,
}: ValidationCompleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="space-y-6 py-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">DQ Rules Validation</h2>
            <p className="text-muted-foreground mt-1">
              Running validation on all configured data quality rules
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>

            <h3 className="text-2xl font-semibold text-green-500">
              Validation Complete!
            </h3>

            <div className="w-full bg-muted/50 rounded-lg p-6">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-500 mb-2">14</div>
                  <div className="text-muted-foreground">Rules Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-red-500 mb-2">2</div>
                  <div className="text-muted-foreground">Rules Failed</div>
                </div>
              </div>
              <p className="text-center text-muted-foreground">
                Validation completed: 14 rules passed, 2 rules failed. Data quality score: 88%
              </p>
            </div>

            <div className="flex gap-3 w-full">
              <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
                Modify DQ Rules
              </Button>
              <Button
                variant="default"
                className="flex-1 bg-orange-600 hover:bg-orange-700"
                onClick={onAnalyzeFailures}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Analyze Failures
              </Button>
              <Button className="flex-1" onClick={onProceedToNER}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Proceed to NER
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
