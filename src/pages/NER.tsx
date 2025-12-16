import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { MapPin, RefreshCw, Smile, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";

export default function NER() {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [nerResults, setNerResults] = useState<boolean>(false);
  const [entityStates, setEntityStates] = useState<{ [key: number]: 'pending' | 'accepted' | 'rejected' }>({
    0: 'pending',
    1: 'pending',
    2: 'pending',
  });
  const [stats, setStats] = useState({ accepted: 0, rejected: 0, pending: 3 });

  // Load custom created tables from Data Creation
  const [files, setFiles] = useState<Array<{name: string; source: string; type: string; size: string}>>([]);

  useEffect(() => {
    const customTables = localStorage.getItem("customCreatedTables");
    if (customTables) {
      const tables = JSON.parse(customTables);
      const customFiles = tables.map((table: any) => ({
        name: `${table.name}.csv`,
        source: "Data Creation",
        type: "CSV",
        size: "N/A",
      }));
      setFiles(customFiles);
    }
  }, []);

  const entityMatches = [
    {
      type: "place",
      from: "NYC",
      to: "New York",
      confidence: 100,
    },
    {
      type: "place",
      from: "LA",
      to: "Los Angeles",
      confidence: 95,
    },
    {
      type: "place",
      from: "SF",
      to: "San Francisco",
      confidence: 95,
    },
  ];

  const toggleFileSelection = (fileName: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileName)
        ? prev.filter((f) => f !== fileName)
        : [...prev, fileName]
    );
  };

  const handleRunNER = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a file to run NER analysis",
        variant: "destructive",
      });
      return;
    }
    setNerResults(true);
    toast({
      title: "NER Analysis Complete",
      description: `Found ${entityMatches.length} entity matches`,
      duration: 1000,
    });
  };

  const handleAccept = (index: number) => {
    setEntityStates({ ...entityStates, [index]: 'accepted' });
    setStats({ 
      accepted: stats.accepted + 1, 
      rejected: stats.rejected,
      pending: stats.pending - 1 
    });
    toast({
      title: "Entity Accepted",
      description: "Entity match has been accepted",
      duration: 1000,
    });
  };

  const handleReject = (index: number) => {
    setEntityStates({ ...entityStates, [index]: 'rejected' });
    setStats({ 
      accepted: stats.accepted, 
      rejected: stats.rejected + 1,
      pending: stats.pending - 1 
    });
    toast({
      title: "Entity Rejected",
      description: "Entity match has been rejected",
      duration: 1000,
    });
  };

  const handleAcceptAll = () => {
    const newStates: { [key: number]: 'pending' | 'accepted' | 'rejected' } = {};
    entityMatches.forEach((_, index) => {
      if (entityStates[index] === 'pending') {
        newStates[index] = 'accepted';
      } else {
        newStates[index] = entityStates[index];
      }
    });
    setEntityStates(newStates);
    setStats({ accepted: 3, rejected: 0, pending: 0 });
    toast({
      title: "All Entities Accepted",
      description: "All pending entity matches have been accepted",
      duration: 1000,
    });
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Named Entity Resolution
            </h1>
            <p className="text-muted-foreground">
              Review and resolve entity matches in your data
            </p>
          </div>
          <Button onClick={handleRunNER}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Run NER
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Matches</span>
              <RefreshCw className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-3xl font-bold text-foreground">3</div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pending</span>
              <Smile className="h-5 w-5 text-yellow-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.pending}</div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Accepted</span>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.accepted}</div>
          </div>

          <div className="border border-border rounded-lg p-6 bg-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Rejected</span>
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-3xl font-bold text-foreground">{stats.rejected}</div>
          </div>
        </div>

        {/* File Selection */}
        <div className="border border-border rounded-lg p-6 bg-card mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-foreground mb-1">File Selection</h2>
            <p className="text-sm text-muted-foreground">
              Select files from all ingested sources to perform NER.
            </p>
          </div>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground w-12"></th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    File Name
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">
                    Size
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((file) => (
                  <tr
                    key={file.name}
                    className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => toggleFileSelection(file.name)}
                  >
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedFiles.includes(file.name)}
                        onCheckedChange={() => toggleFileSelection(file.name)}
                      />
                    </td>
                    <td className="p-4" onClick={() => toggleFileSelection(file.name)}>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{file.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {file.source}
                        </Badge>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">{file.type}</td>
                    <td className="p-4 text-sm text-muted-foreground">{file.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Entity Matches */}
        {nerResults && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Entity Matches</h2>
                <p className="text-sm text-muted-foreground">
                  Review suggested entity matches and accept or reject them
                </p>
              </div>
              <Button variant="outline" onClick={handleAcceptAll}>Accept All</Button>
            </div>

            <div className="space-y-3">
              {entityMatches.map((match, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 transition-colors ${
                    entityStates[index] === 'accepted' 
                      ? 'border-green-500 bg-green-500/10'
                      : entityStates[index] === 'rejected'
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-border bg-background hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <Badge variant="secondary" className="text-xs">
                        {match.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{match.from}</span>
                        <span className="text-primary">→</span>
                        <span className="font-medium text-foreground">{match.to}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Confidence: {match.confidence}%
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleReject(index)}
                        disabled={entityStates[index] !== 'pending'}
                      >
                        Reject
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleAccept(index)}
                        disabled={entityStates[index] !== 'pending'}
                      >
                        Accept
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/workflow/data-quality")}>
            Back
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate("/workflow/business-logic")}>
              Skip
            </Button>
            <Button onClick={() => navigate("/workflow/business-logic")}>
              Proceed to Business Logic
            </Button>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}
