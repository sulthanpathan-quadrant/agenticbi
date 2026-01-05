import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
 
interface SchemaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  previewData?: any;     // Real data from API
  loading?: boolean;    // Loading state
}
 
export function SchemaPreviewDialog({
  open,
  onOpenChange,
  fileName,
  previewData,
  loading = false
}: SchemaPreviewDialogProps) {
 
  // Handle different possible response formats
  const getTableData = () => {
    if (loading) {
      return { columns: [], rows: [] };
    }
 
    if (!previewData) {
      return { columns: [], rows: [] };
    }
 
    if (previewData.error) {
      return { columns: ["Message"], rows: [[previewData.error]] };
    }
 
    // Assume previewData is an array of objects (common for CSV/Parquet preview)
    if (Array.isArray(previewData) && previewData.length > 0) {
      const firstRow = previewData[0];
      const columns = Object.keys(firstRow);
      const rows = previewData.map(row => columns.map(col => row[col]));
      return { columns, rows };
    }
 
    // Fallback: if it's an object with data array
    if (previewData.data && Array.isArray(previewData.data) && previewData.data.length > 0) {
      const firstRow = previewData.data[0];
      const columns = Object.keys(firstRow);
      const rows = previewData.data.map((row: any) => columns.map(col => row[col]));
      return { columns, rows };
    }
 
    // If no structured data
    return { columns: ["Info"], rows: [["No preview available"]] };
  };
 
  const { columns, rows } = getTableData();
 
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto bg-card border-2 border-border">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle className="text-xl">Schema Preview: {fileName}</DialogTitle>
        </DialogHeader>
 
        <div className="mt-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading preview...</p>
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No preview data available
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.slice(0, 10).map((row, rowIndex) => (  // Show first 10 rows
                      <TableRow key={rowIndex}>
                        {row.map((cell: any, cellIndex: number) => (
                          <TableCell key={cellIndex}>
                            {cell === null || cell === undefined ? "-" : String(cell)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {rows.length > 10 && (
                <div className="p-4 text-center text-sm text-muted-foreground border-t">
                  Showing first 10 rows of {rows.length}
                </div>
              )}
            </div>
          )}
        </div>
 
        {/* Optional Pagination (kept for consistency with original design) */}
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </DialogContent>
    </Dialog>
  );
}
 