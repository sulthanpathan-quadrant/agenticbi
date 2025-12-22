import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SchemaPreviewDialog } from "@/components/SchemaPreviewDialog";
import { Search, Plus, Eye, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
 
interface Document {
  source: string;
  filename: string;
  file_type: string;
}
 
interface ApiResponse {
  user_id: string;
  job_id: string;
  status: string;
  documents: Document[];
}
 
interface TableRowData {
  id: string;
  fileName: string;
  source: string;
  type: string;
}
 
export default function LandingZone() {
  const navigate = useNavigate();
 
  const [schemaPreviewOpen, setSchemaPreviewOpen] = useState(false);
  const [previewFileName, setPreviewFileName] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [data, setData] = useState<TableRowData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [fileToDelete, setFileToDelete] = useState<string | null>(null);
 
  const userId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : null;
  const jobId = localStorage.getItem("current_job_id");
 
  // Fetch documents list
  useEffect(() => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information. Please complete ingestion first.");
      setLoading(false);
      return;
    }
 
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://4.227.238.34/view-documents/${userId}/${jobId}`);
 
        if (!response.ok) throw new Error("Failed to fetch files");
 
        const result: ApiResponse = await response.json();
 
        if (result.documents && result.documents.length > 0) {
          const formattedData: TableRowData[] = result.documents.map((doc, index) => ({
            id: `${index + 1}`,
            fileName: doc.filename,
            source: doc.source.toUpperCase(),
            type: doc.file_type.toUpperCase().replace(".", ""),
          }));
          setData(formattedData);
        } else {
          setData([]);
          toast.info("No documents found for this job.");
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Failed to load ingested files.");
        setData([]);
      } finally {
        setLoading(false);
      }
    };
 
    fetchDocuments();
  }, [userId, jobId]);
 
  // Preview file
  const openPreview = async (fileName: string) => {
    if (!userId || !jobId) {
      toast.error("Missing user or job information");
      return;
    }
 
    setPreviewFileName(fileName);
    setPreviewLoading(true);
    setPreviewData(null);
    setSchemaPreviewOpen(true);
 
    try {
      const encodedFileName = encodeURIComponent(fileName);
      const response = await fetch(
        `https://4.227.238.34/preview-file/${userId}/${jobId}/${encodedFileName}`
      );
 
      if (response.ok) {
        const data = await response.json();
        setPreviewData(data);
      } else {
        const error = await response.json();
        throw new Error(error.detail || "File not found");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to preview file");
      setPreviewData({ error: error.message });
    } finally {
      setPreviewLoading(false);
    }
  };
 
  // Delete file
  // const handleDelete = async (fileName: string) => {
  //   if (!userId || !jobId) {
  //     toast.error("Missing user or job information");
  //     return;
  //   }
 
  //   if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) return;
 
  //   try {
  //     const encodedFileName = encodeURIComponent(fileName);
  //     const response = await fetch(
  //       `http://4.227.238.34:8000/delete-file/${userId}/${jobId}/${encodedFileName}`,
  //       { method: "DELETE" }
  //     );
 
  //     if (response.ok) {
  //       toast.success(`"${fileName}" deleted successfully`);
  //       setData(prev => prev.filter(item => item.fileName !== fileName));
  //     } else {
  //       const error = await response.json();
  //       throw new Error(error.detail || "Failed to delete file");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Failed to delete file");
  //   }
  // };
   
  const handleDelete = (fileName: string) => {
  setFileToDelete(fileName);
  setDeleteConfirmOpen(true);
};

const confirmDelete = async () => {
  if (!fileToDelete || !userId || !jobId) {
    toast.error("Missing file or job information");
    return;
  }

  try {
    const encodedFileName = encodeURIComponent(fileToDelete);
    const response = await fetch(
      `https://4.227.238.34/delete-file/${userId}/${jobId}/${encodedFileName}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      toast.success(`"${fileToDelete}" deleted successfully`);
      setData(prev => prev.filter(item => item.fileName !== fileToDelete));
    } else {
      const error = await response.json();
      throw new Error(error.detail || "Failed to delete file");
    }
  } catch (error: any) {
    toast.error(error.message || "Failed to delete file");
  } finally {
    setDeleteConfirmOpen(false);
    setFileToDelete(null);
  }
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
              <SelectItem value="s3">S3</SelectItem>
              <SelectItem value="blob">Blob</SelectItem>
              <SelectItem value="snowflake">Snowflake</SelectItem>
              <SelectItem value="onelake">OneLake</SelectItem>
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
 
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading ingested files...</p>
          </div>
        ) : (
          <>
            {/* Data Table */}
            <div className="border border-border rounded-lg overflow-hidden mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                        No files found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium">{row.fileName}</TableCell>
                        <TableCell className="text-muted-foreground">{row.source}</TableCell>
                        <TableCell className="text-muted-foreground">{row.type}</TableCell>
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
                              className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                              onClick={() => handleDelete(row.fileName)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
 
            {/* Pagination */}
            {filteredData.length > itemsPerPage && (
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
            )}
 
            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate("/workflow/data-ingestion")}>
                Back
              </Button>
              <Button
                onClick={() => navigate("/workflow/data-modeling")}
                size="lg"
                className="px-8"
                disabled={data.length === 0}
              >
                Proceed to Data Modeling
              </Button>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
{/* <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-xxl">Confirm Deletion</DialogTitle>
      <DialogDescription className="text-xl mt-2">
        Are you sure you want to delete the file?
      </DialogDescription>
    </DialogHeader>
    <div className="mt-4 py-4">
      <p className="font-medium text-foreground break-all">
        {fileToDelete}
      </p>
    </div>
    <div className="flex justify-end gap-3 mt-6">
      <Button
        variant="outline"
        onClick={() => {
          setDeleteConfirmOpen(false);
          setFileToDelete(null);
        }}
      >
        Cancel
      </Button>
      <Button
        variant="destructive"
        onClick={confirmDelete}
      >
        Delete File
      </Button>
    </div>
  </DialogContent>
</Dialog> */}

{/* Delete Confirmation Modal - Matching the Screenshot Style */}
<Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-center">
        Confirm delete
      </DialogTitle>
    </DialogHeader>

    <div className="py-6 text-center">
      <p className="text-lg text-foreground">
        Are you sure you want to delete
        <span className="font-semibold"> "{fileToDelete}"</span>?
      </p>
    </div>

    {/* Action Buttons - Red primary on left, subtle on right */}
    <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-center mt-8">
      {/* Secondary: No, keep it */}
      <Button
        variant="ghost"
        size="lg"
        className="text-muted-foreground hover:text-foreground"
        onClick={() => {
          setDeleteConfirmOpen(false);
          setFileToDelete(null);
        }}
      >
        No, keep it
      </Button>

      {/* Primary Destructive: Yes, delete it */}
      <Button
        variant="destructive"
        size="lg"
        className="min-w-48"
        onClick={confirmDelete}
      >
        Yes, delete it
      </Button>
    </div>
  </DialogContent>
</Dialog>

 
        {/* Schema Preview Dialog */}
        <SchemaPreviewDialog
          open={schemaPreviewOpen}
          onOpenChange={setSchemaPreviewOpen}
          fileName={previewFileName}
          previewData={previewData}
          loading={previewLoading}
        />
      </div>
    </WorkflowLayout>
  );
}
