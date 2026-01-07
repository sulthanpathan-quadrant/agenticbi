import { useState, useEffect } from 'react';
import { DatasetSidebar } from '@/components/dashboard/DatasetSidebar';
import { AnalysisPanel } from '@/components/dashboard/AnalysisPanel';
import { ChatbotInterface } from '@/components/dashboard/ChatbotInterface';
import { DashboardView } from '@/components/dashboard/DashboardView';
import { DataFile, KPI } from '@/components/types/dashboard';
import { BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";

type ViewMode = 'analysis' | 'chatbot' | 'dashboard';

const PowerBIDashboard = () => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DataFile | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('analysis');
  const [loadingFiles, setLoadingFiles] = useState(true);

  const navigate = useNavigate();

  // Fetch datasets
  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const userData = localStorage.getItem("user");
        const jobId = localStorage.getItem("current_job_id");

        if (!userData || !jobId) {
          toast.error("User or Job ID not found. Please log in again.");
          setLoadingFiles(false);
          return;
        }

        const userId = JSON.parse(userData).id;

        setLoadingFiles(true);
        const response = await fetch(
          `https://20.81.213.147/list-datasets?user_id=${userId}&job_id=${jobId}`
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        const fetchedFiles: DataFile[] = data.datasets.map((dataset: any, index: number) => {
          const isCsv = dataset.filename.toLowerCase().endsWith('.csv');
          const isExcel = dataset.filename.toLowerCase().endsWith('.xlsx') || dataset.filename.toLowerCase().endsWith('.xls');

          return {
            id: `file-${index}-${dataset.filename}`,
            name: dataset.filename,
            type: isCsv ? 'csv' : isExcel ? 'excel' : 'json',
            rows: 0,
            columns: 0,
            dateModified: dataset.date_modified || new Date().toLocaleString(),
            csvBlob: `${userId}/${jobId}/${dataset.filename}`, // Correct path without "Files/Datasets/"
          };
        });

        setFiles(fetchedFiles);
      } catch (err) {
        console.error("Failed to load datasets:", err);
        toast.error("Failed to load datasets.");
        setFiles([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    fetchDatasets();
  }, []);

  const handleFileSelect = (file: DataFile) => {
    if (selectedFile?.id === file.id) {
      setSelectedFile(null);
      setViewMode('analysis');
    } else {
      setSelectedFile(file);
      setViewMode('analysis');
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleBuildWithRecommendations = (data: any) => {
    if (!selectedFile) return;
    setDashboardData(data);
    setCurrentQuery(`Recommended Dashboard: ${data.kpis.map((k: KPI) => k.label).join(', ')}`);
    setViewMode('dashboard');
    toast.success('Dashboard generated!');
  };

  const handleBuildCustomDashboard = () => {
    setViewMode('chatbot');
  };

  const handleBackFromChatbot = () => {
    setViewMode('analysis');
  };

  const handleBackFromDashboard = () => {
    setDashboardData(null);
    setCurrentQuery('');
    setViewMode('analysis');
  };

  // Custom prompt dashboard generation
  const handleCustomGenerate = async (query: string) => {
    if (!selectedFile) {
      toast.error("No file selected");
      return;
    }

    setIsGenerating(true);
    setCurrentQuery(query);

    const userData = localStorage.getItem("user");
    const jobId = localStorage.getItem("current_job_id");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId || !jobId) {
      toast.error("User or Job ID missing");
      setIsGenerating(false);
      return;
    }

    const csvBlobPath = `${userId}/${jobId}/${selectedFile.name}`;

    try {
      const response = await fetch('https://20.81.213.147/generate_dashboard_from_prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv_blob: csvBlobPath,
          user_prompt: query
        })
      });

      if (!response.ok) throw new Error("Failed to generate dashboard");

      const result = await response.json();

      const charts = result.charts || {};
      const visualsArray = Object.keys(charts).map((chartName) => {
        const chart = charts[chartName];
        let chartType = chart.chart_type;

        // Map backend types to our frontend types
        if (chartType === 'card') chartType = 'KPI';
        if (['column', 'histogram'].includes(chartType)) chartType = 'bar';

        return {
          chart_name: chartName,
          chart_type: chartType,
          value: chart.data?.value,
          description: chart.description || '',
          data: {
            x: chart.data?.x || [],
            y: chart.data?.y || [],
            series: chart.data?.series || {},
            rows: chart.data?.rows || []
          }
        };
      });

      // Extract KPIs (from card types)
      const kpisFromBackend: KPI[] = visualsArray
        .filter((v: any) => v.chart_type === 'KPI')
        .map((v: any, i: number) => ({
          id: `custom-kpi-${i}`,
          label: v.chart_name,
          value: v.value?.toString() || '—',
          change: 0,
          changeLabel: v.description || 'From your query'
        }));

      // Fallback KPI if none
      const finalKpis = kpisFromBackend.length > 0
        ? kpisFromBackend
        : [{ id: 'fallback', label: 'Result', value: result.business_context || query, change: 0, changeLabel: 'Custom Query' }];

      setDashboardData({
        kpis: finalKpis,
        visuals: visualsArray,
        total_rows: result.total_rows || 0
      });

      setViewMode('dashboard');
      toast.success('Custom dashboard generated!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate dashboard. Try again.');
      // Fallback
      setDashboardData({
        kpis: [{ id: 'error', label: 'Error', value: 'Try different query', change: 0 }],
        visuals: [],
        total_rows: 0
      });
      setViewMode('dashboard');
    } finally {
      setIsGenerating(false);
    }
  };

  if (viewMode === 'dashboard' && dashboardData && selectedFile) {
    return (
      <DashboardView
        data={dashboardData}
        file={selectedFile}
        query={currentQuery}
        onBack={handleBackFromDashboard}
      />
    );
  }

  return (
    <div className="min-h-screen h-screen bg-background flex flex-col overflow-hidden">
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm shrink-0">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center gap-4 animate-fade-in">
            <div className='flex gap-4'>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Power BI Dashboard Generator
                </h1>
                <p className="text-xs text-muted-foreground">
                  Select dataset → Analyze → Build with AI recommendations or create your own
                </p>
              </div>
            </div>
            <div>
              <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to path selection
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <DatasetSidebar
          files={files}
          selectedFile={selectedFile}
          onSelectFile={handleFileSelect}
          loading={loadingFiles}
        />

        {viewMode === 'chatbot' && selectedFile ? (
          <ChatbotInterface
            file={selectedFile}
            onGenerateDashboard={handleCustomGenerate}
            onBack={handleBackFromChatbot}
            isLoading={isGenerating}
          />
        ) : (
          <AnalysisPanel
            file={selectedFile}
            onBuildWithRecommendations={handleBuildWithRecommendations}
            onBuildCustomDashboard={handleBuildCustomDashboard}
            isLoading={isGenerating}
          />
        )}
      </div>

      {isGenerating && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-foreground">Generating your dashboard...</p>
            <p className="text-sm text-muted-foreground mt-2">Analyzing data and creating visualizations</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerBIDashboard;