import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SchemaPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
}

const sampleData = [
  { id: 1, name: "John Doe", age: 29, city: "New York", created_at: "2023-10-02" },
  { id: 2, name: "Alice Smith", age: 34, city: "Los Angeles", created_at: "2023-10-03" },
  { id: 3, name: "David Lee", age: 41, city: "Chicago", created_at: "2023-10-04" },
  { id: 4, name: "Emma Wilson", age: 27, city: "Houston", created_at: "2023-10-05" },
  { id: 5, name: "Michael Brown", age: 38, city: "Phoenix", created_at: "2023-10-06" },
];

export function SchemaPreviewDialog({ open, onOpenChange, fileName }: SchemaPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-card border-2 border-border">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader>
          <DialogTitle>Schema Preview: {fileName}</DialogTitle>
        </DialogHeader>
        <div className="border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.age}</TableCell>
                  <TableCell>{row.city}</TableCell>
                  <TableCell>{row.created_at}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DialogContent>
    </Dialog>
  );
}
