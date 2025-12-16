import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemaPreviewDialog } from "@/components/SchemaPreviewDialog";
import { Search, Plus, Eye, Download, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const landingZoneData = [
  {
    id: "1",
    fileName: "customer_data_q1_2023.csv",
    source: "S3 Bucket",
    type: "CSV",
    size: "15.2 MB",
    rowCount: "1,150,324",
    status: "completed",
  },
  {
    id: "2",
    fileName: "product_catalog_update.parquet",
    source: "SFTP Upload",
    type: "Parquet",
    size: "8.9 MB",
    rowCount: "85,400",
    status: "completed",
  },
  {
    id: "3",
    fileName: "user_profiles_latest.json",
    source: "API Feed",
    type: "JSON",
    size: "25.1 MB",
    rowCount: "2,300,100",
    status: "pending",
    progress: 65,
  },
  {
    id: "4",
    fileName: "transaction_log_failed.csv",
    source: "S3 Bucket",
    type: "CSV",
    size: "5.5 MB",
    rowCount: "N/A",
    status: "error",
  },
];

export default function LandingZone() {
  const navigate = useNavigate();
  const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
  const [previewFileName, setPreviewFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [data, setData] = useState(landingZoneData);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const openPreview = (fileName: string) => {
    setPreviewFileName(fileName);
    setSchemaPreviewOpen(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
  };

  // Filter data
  const filteredData = data.filter(item => {
    const matchesSearch = item.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === "all" || item.source.toLowerCase().includes(sourceFilter.toLowerCase());
    const matchesType = typeFilter === "all" || item.type.toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesSource && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getStatusBadge = (status: string, progress?: number) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Completed</Badge>;
      case "pending":
        return (
          <div className="flex items-center gap-2">
            <Badge className="bg-orange-500/20 text-orange-500 border-orange-500/30">
              Pending ({progress}%)
            </Badge>
            <Progress value={progress} className="w-20 h-2" />
          </div>
        );
      case "error":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <WorkflowLayout>
      <div className="p-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Landing Zone</h1>
            <p className="text-muted-foreground">
              Manage all raw ingested data files.
            </p>
          </div>
          <Button onClick={() => navigate("/workflow/data-ingestion")} className="gap-2">
            <Plus className="h-4 w-4" />
            New Ingestion
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by file name..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Source: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Source: All</SelectItem>
              <SelectItem value="s3">S3 Bucket</SelectItem>
              <SelectItem value="sftp">SFTP Upload</SelectItem>
              <SelectItem value="api">API Feed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="File Type: All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">File Type: All</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="parquet">Parquet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Data Table */}
        <div className="border border-border rounded-lg overflow-hidden mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Row Count</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.fileName}</TableCell>
                  <TableCell className="text-muted-foreground">{row.source}</TableCell>
                  <TableCell className="text-muted-foreground">{row.type}</TableCell>
                  <TableCell className="text-muted-foreground">{row.size}</TableCell>
                  <TableCell className="text-muted-foreground">{row.rowCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent"
                        onClick={() => openPreview(row.fileName)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-accent"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} files
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink 
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => setCurrentPage(totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={() => navigate("/workflow/data-ingestion")}
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/workflow/data-modeling")}
            size="lg"
            className="px-8"
          >
            Proceed to Data Modeling
          </Button>
        </div>

        {/* Schema Preview Dialog */}
        <SchemaPreviewDialog
          open={schemaPreviewOpen}
          onOpenChange={setSchemaPreviewOpen}
          fileName={previewFileName}
        />
      </div>
    </WorkflowLayout>
  );
}
