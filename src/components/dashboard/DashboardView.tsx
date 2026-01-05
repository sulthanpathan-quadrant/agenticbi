import { DataFile, KPI } from '@/components/types/dashboard';
import { KPICard } from './KPICard';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  MessageSquare,
  Table as TableIcon,
  AlertCircle
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  LineChart,
  Line
} from 'recharts';

interface DashboardViewProps {
  data: {
    kpis: KPI[];
    visuals: any[];
    total_rows: number;
  };
  file: DataFile;
  query: string;
  onBack: () => void;
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function DashboardView({ data, file, query, onBack }: DashboardViewProps) {
  const visuals = data.visuals || [];
  const backendKpis = data.kpis || [];
  const totalRows = data.total_rows || 0;

  // Extract card/KPI visuals from backend (these are the main results)
  const cardVisuals = visuals.filter((v: any) => 
    v.chart_type === 'KPI' || v.chart_type === 'card'
  );

  // Convert card visuals to KPI format for KPICard
  const cardKpis: KPI[] = cardVisuals.map((v: any) => ({
    id: `card-${v.chart_name.replace(/\s+/g, '-')}`,
    label: v.chart_name,
    value: v.value != null ? v.value : 'No data',
    change: 0,
    changeLabel: v.description || 'Result from query'
  }));

  // All KPIs to display: backend ones + card ones
  const allKpis = [...backendKpis, ...cardKpis];

  // All other visuals (bar, scatter, table) — show even if empty
  const chartVisuals = visuals.filter((v: any) => 
    !['KPI', 'card'].includes(v.chart_type)
  );

  const hasKpis = allKpis.length > 0;
  const hasCharts = chartVisuals.length > 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border/50 bg-card/80">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground">Dashboard Preview</span>
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-6 py-6 w-full space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 animate-fade-in">
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Source</span>
              <span className="text-sm font-semibold text-foreground">{file.name}</span>
            </div>
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Query</span>
              <p className="text-sm text-foreground max-w-xl">{query}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0 lg:ml-auto">
            <Button variant="outline" size="sm" className="gap-2 h-8 text-xs">
              <Share2 className="w-3.5 h-3.5" />
              Deploy to Power BI
            </Button>
            <Button variant="glow" size="sm" className="gap-2 h-8 text-xs">
              <Download className="w-3.5 h-3.5" />
              Download Dataset
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs animate-fade-in">
          <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
            {allKpis.length} KPIs
          </span>
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
            {totalRows} Records
          </span>
          <span className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 font-medium">
            {visuals.length} Visuals Defined
          </span>
        </div>

        {/* Key Results (KPIs + Cards) */}
        {hasKpis ? (
          <div className="animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">Key Results</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allKpis.map((kpi, index) => (
                <KPICard key={kpi.id} kpi={kpi} delay={index * 50} />
              ))}
            </div>
          </div>
        ) : null}

        {/* Charts Section */}
        {hasCharts ? (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold text-foreground">Visualizations</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {chartVisuals.map((visual: any, i: number) => {
                const hasData = 
                  (visual.data?.x?.length > 0) ||
                  (visual.data?.y?.length > 0) ||
                  (Object.values(visual.data?.series || {}).some((arr: any) => arr.length > 0)) ||
                  (visual.data?.rows?.length > 0);

                const chartType = visual.chart_type === 'column' || visual.chart_type === 'histogram' 
                  ? 'bar' 
                  : visual.chart_type;

                return (
                  <div key={i} className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-medium text-foreground mb-2">{visual.chart_name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{visual.description || 'No description'}</p>

                    {chartType === 'bar' && (
                      <ResponsiveContainer width="100%" height={300}>
                        {hasData ? (
                          <BarChart data={(visual.data?.x || []).map((x: any, idx: number) => ({
                            name: String(x),
                            value: visual.data?.y?.[idx] || 
                                   Object.values(visual.data?.series || {})[0]?.[idx] || 0
                          }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#8b5cf6" />
                          </BarChart>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            <AlertCircle className="w-8 h-8 mr-2" />
                            No data available
                          </div>
                        )}
                      </ResponsiveContainer>
                    )}

                    {chartType === 'scatter' && (
                      <ResponsiveContainer width="100%" height={300}>
                        {hasData ? (
                          <ScatterChart>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" dataKey="x" />
                            <YAxis type="number" dataKey="y" />
                            <Tooltip />
                            <Scatter 
                              data={(visual.data?.x || []).map((xValue: any, idx: number) => ({
                                x: Number(xValue),
                                y: Number(visual.data?.y?.[idx] || 0)
                              }))}
                              fill="#3b82f6"
                            >
                              {(visual.data?.x || []).map((_: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Scatter>
                          </ScatterChart>
                        ) : (
                          <div className="h-full flex items-center justify-center text-muted-foreground">
                            <AlertCircle className="w-8 h-8 mr-2" />
                            No data available
                          </div>
                        )}
                      </ResponsiveContainer>
                    )}

                    {chartType === 'table' && (
                      <div className="overflow-x-auto">
                        {hasData && visual.data?.rows?.length > 0 ? (
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-border">
                                {Object.keys(visual.data.rows[0]).map((header: string) => (
                                  <th key={header} className="px-4 py-2 text-left font-medium text-muted-foreground">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {visual.data.rows.slice(0, 20).map((row: any, rowIdx: number) => (
                                <tr key={rowIdx} className="border-b border-border/50">
                                  {Object.values(row).map((value: any, cellIdx: number) => (
                                    <td key={cellIdx} className="px-4 py-2 text-foreground">
                                      {value}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                            No rows available
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* If absolutely nothing */}
        {!hasKpis && !hasCharts && (
          <div className="text-center py-16">
            <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-xl text-foreground">No results generated</p>
            <p className="text-muted-foreground mt-2">The query returned no data or visuals</p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-border">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>
    </div>
  );
}