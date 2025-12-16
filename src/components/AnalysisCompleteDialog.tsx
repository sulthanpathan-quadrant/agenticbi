import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Wrench, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface AnalysisCompleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuickFix: () => void;
}

export function AnalysisCompleteDialog({
  open,
  onOpenChange,
  onQuickFix,
}: AnalysisCompleteDialogProps) {
  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<{reason: string; solution: string}>({reason: '', solution: ''});

  const handleEditClick = (ruleName: string, reason: string, solution: string) => {
    setEditingRule(ruleName);
    setEditedData({ reason, solution });
  };

  const handleSaveEdit = () => {
    toast({
      title: "Rule Updated",
      description: "Changes have been saved successfully",
      duration: 1000,
    });
    setEditingRule(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] flex flex-col bg-card border-2 border-border">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>

        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Analysis Complete</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <p className="text-muted-foreground">
            Found 2 issues that can be automatically resolved
          </p>

          <div className="space-y-4">
            {/* Rule 1: categories */}
            <div className="border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-orange-900 dark:text-orange-400">
                  Rule: categories
                </h3>
                {editingRule === 'categories' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8"
                      onClick={() => setEditingRule(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => handleEditClick('categories', "1465 invalid category values found in column 'categories'", "Ensure all values are in the set ['yes', 'no'].")}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-400 mb-0.5">
                    Reason for Failure:
                  </p>
                  {editingRule === 'categories' ? (
                    <textarea
                      value={editedData.reason}
                      onChange={(e) => setEditedData({ ...editedData, reason: e.target.value })}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-foreground min-h-[60px]"
                    />
                  ) : (
                    <p className="text-orange-800 dark:text-orange-300">
                      1465 invalid category values found in column 'categories'
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-400 mb-0.5">
                    Proposed Solution:
                  </p>
                  {editingRule === 'categories' ? (
                    <textarea
                      value={editedData.solution}
                      onChange={(e) => setEditedData({ ...editedData, solution: e.target.value })}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-foreground min-h-[60px]"
                    />
                  ) : (
                    <p className="text-orange-800 dark:text-orange-300">
                      Ensure all values are in the set ['yes', 'no'].
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Rule 2: rating */}
            <div className="border border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-900 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-orange-900 dark:text-orange-400">
                  Rule: rating
                </h3>
                {editingRule === 'rating' ? (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-8"
                      onClick={() => setEditingRule(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8"
                    onClick={() => handleEditClick('rating', "1465 values out of range in column 'rating'", "Ensure all values are between 1 and 5.")}
                  >
                    Edit
                  </Button>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-400 mb-0.5">
                    Reason for Failure:
                  </p>
                  {editingRule === 'rating' ? (
                    <textarea
                      value={editedData.reason}
                      onChange={(e) => setEditedData({ ...editedData, reason: e.target.value })}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-foreground min-h-[60px]"
                    />
                  ) : (
                    <p className="text-orange-800 dark:text-orange-300">
                      1465 values out of range in column 'rating'
                    </p>
                  )}
                </div>

                <div>
                  <p className="font-medium text-orange-900 dark:text-orange-400 mb-0.5">
                    Proposed Solution:
                  </p>
                  {editingRule === 'rating' ? (
                    <textarea
                      value={editedData.solution}
                      onChange={(e) => setEditedData({ ...editedData, solution: e.target.value })}
                      className="w-full bg-background border border-border rounded px-2 py-1 text-foreground min-h-[60px]"
                    />
                  ) : (
                    <p className="text-orange-800 dark:text-orange-300">
                      Ensure all values are between 1 and 5.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t border-border mt-4 bg-card">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onQuickFix} className="bg-primary hover:bg-primary/90">
            <Wrench className="h-4 w-4 mr-2" />
            Quick Fix
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
