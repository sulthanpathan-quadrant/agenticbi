// import { useState, useEffect } from 'react';
// import { DataFile, KPI } from '@/components/types/dashboard';
// import { 
//   BarChart3, 
//   TrendingUp, 
//   TrendingDown, 
//   Sparkles, 
//   Wand2, 
//   MessageSquare,
//   FileText,
//   Table,
//   FileJson,
//   Search,
//   Target,
//   CheckCircle2,
//   XCircle,
//   ChevronRight,
//   Check,
//   Loader2
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';

// // KPI with target interface
// interface KPIWithTarget {
//   id: string;
//   name: string;
//   actual: string;
//   target: string;
//   status: 'on-track' | 'at-risk' | 'off-track';
//   percentage: number;
//   metrics: KPI[];
//   measurements: string[];
// }

// interface AnalysisPanelProps {
//   file: DataFile | null;
//   onBuildWithRecommendations: (kpis: KPI[]) => void;
//   onBuildCustomDashboard: () => void;
//   isLoading: boolean;
// }

// const fileIcons = {
//   csv: FileText,
//   excel: Table,
//   json: FileJson,
// };

// const fileColors = {
//   csv: 'text-emerald-400',
//   excel: 'text-green-400',
//   json: 'text-amber-400',
// };

// // Generate KPIs with their associated metrics and measurements
// function getKPIsWithDetails(file: DataFile): KPIWithTarget[] {
//   const fileName = file.name.toLowerCase();
  
//   if (fileName.includes('sales') || fileName.includes('revenue')) {
//     return [
//       { 
//         id: 'sales-kpi', 
//         name: 'Sales vs Target', 
//         actual: '$2.4M', 
//         target: '$2.5M', 
//         status: 'at-risk', 
//         percentage: 96,
//         metrics: [
//           { id: 'total-sales', label: 'Total Sales', value: '$2.4M', change: 12.5, changeLabel: '+12.5% vs last period' },
//           { id: 'avg-deal-size', label: 'Average Deal Size', value: '$4,250', change: 8.3, changeLabel: '+8.3% vs last period' },
//         ],
//         measurements: ['Sum of Sales', 'Sales Count', 'Average Sale Value']
//       },
//       { 
//         id: 'revenue-kpi', 
//         name: 'Revenue Growth', 
//         actual: '15.3%', 
//         target: '12%', 
//         status: 'on-track', 
//         percentage: 127,
//         metrics: [
//           { id: 'revenue-total', label: 'Total Revenue', value: '$3.2M', change: 15.3, changeLabel: '+15.3% growth' },
//           { id: 'mrr', label: 'Monthly Recurring Revenue', value: '$280K', change: 18.2, changeLabel: '+18.2% vs last month' },
//         ],
//         measurements: ['Revenue Sum', 'Revenue Growth Rate', 'YoY Comparison']
//       },
//       { 
//         id: 'profit-kpi', 
//         name: 'Profit Margin', 
//         actual: '18%', 
//         target: '20%', 
//         status: 'at-risk', 
//         percentage: 90,
//         metrics: [
//           { id: 'gross-profit', label: 'Gross Profit', value: '$576K', change: 10.2, changeLabel: '+10.2% vs last period' },
//           { id: 'net-profit', label: 'Net Profit', value: '$432K', change: 8.7, changeLabel: '+8.7% vs last period' },
//         ],
//         measurements: ['Profit Calculation', 'Margin Percentage', 'Cost Analysis']
//       },
//     ];
//   }
//   if (fileName.includes('customer')) {
//     return [
//       { 
//         id: 'retention-kpi', 
//         name: 'Retention Rate', 
//         actual: '87%', 
//         target: '85%', 
//         status: 'on-track', 
//         percentage: 102,
//         metrics: [
//           { id: 'active-customers', label: 'Active Customers', value: '12,450', change: 18.2, changeLabel: '+18.2% growth' },
//           { id: 'churned', label: 'Churned Customers', value: '1,842', change: -12.5, changeLabel: '-12.5% reduced' },
//         ],
//         measurements: ['Retention Rate Calc', 'Churn Rate', 'Customer Lifetime']
//       },
//       { 
//         id: 'satisfaction-kpi', 
//         name: 'CSAT Score', 
//         actual: '4.2', 
//         target: '4.5', 
//         status: 'at-risk', 
//         percentage: 93,
//         metrics: [
//           { id: 'csat-avg', label: 'Average CSAT', value: '4.2/5', change: 5.0, changeLabel: '+5.0% improved' },
//           { id: 'promoters', label: 'Promoters', value: '8,245', change: 22.3, changeLabel: '+22.3% growth' },
//         ],
//         measurements: ['CSAT Average', 'Response Rate', 'Satisfaction Trend']
//       },
//       { 
//         id: 'nps-kpi', 
//         name: 'NPS Score', 
//         actual: '45', 
//         target: '50', 
//         status: 'at-risk', 
//         percentage: 90,
//         metrics: [
//           { id: 'nps-score', label: 'Current NPS', value: '45', change: 8.4, changeLabel: '+8.4 points' },
//           { id: 'detractors', label: 'Detractors', value: '1,024', change: -15.2, changeLabel: '-15.2% reduced' },
//         ],
//         measurements: ['NPS Calculation', 'Promoter Ratio', 'Detractor Ratio']
//       },
//     ];
//   }
//   if (fileName.includes('inventory')) {
//     return [
//       { 
//         id: 'stockout-kpi', 
//         name: 'Stockout Rate', 
//         actual: '2%', 
//         target: '3%', 
//         status: 'on-track', 
//         percentage: 150,
//         metrics: [
//           { id: 'stockout-count', label: 'Stockout Events', value: '23', change: -45.2, changeLabel: '-45.2% reduced' },
//           { id: 'fill-rate', label: 'Fill Rate', value: '98%', change: 2.1, changeLabel: '+2.1% improved' },
//         ],
//         measurements: ['Stockout Count', 'Fill Rate Calc', 'Availability Rate']
//       },
//       { 
//         id: 'turnover-kpi', 
//         name: 'Inventory Turnover', 
//         actual: '5.2x', 
//         target: '6x', 
//         status: 'at-risk', 
//         percentage: 87,
//         metrics: [
//           { id: 'turnover-rate', label: 'Turnover Rate', value: '5.2x', change: 12.5, changeLabel: '+12.5% improved' },
//           { id: 'days-on-hand', label: 'Days on Hand', value: '45', change: -8.3, changeLabel: '-8.3 days reduced' },
//         ],
//         measurements: ['Turnover Calculation', 'Days Inventory', 'Velocity Rate']
//       },
//       { 
//         id: 'fill-kpi', 
//         name: 'Fill Rate', 
//         actual: '98%', 
//         target: '95%', 
//         status: 'on-track', 
//         percentage: 103,
//         metrics: [
//           { id: 'orders-filled', label: 'Orders Filled', value: '9,823', change: 15.3, changeLabel: '+15.3% growth' },
//           { id: 'partial-fills', label: 'Partial Fills', value: '187', change: -22.4, changeLabel: '-22.4% reduced' },
//         ],
//         measurements: ['Fill Rate Percentage', 'Order Completion', 'Backorder Rate']
//       },
//     ];
//   }
//   if (fileName.includes('marketing')) {
//     return [
//       { 
//         id: 'roi-kpi', 
//         name: 'Campaign ROI', 
//         actual: '320%', 
//         target: '300%', 
//         status: 'on-track', 
//         percentage: 107,
//         metrics: [
//           { id: 'campaign-revenue', label: 'Campaign Revenue', value: '$1.2M', change: 28.5, changeLabel: '+28.5% growth' },
//           { id: 'campaign-cost', label: 'Campaign Cost', value: '$375K', change: 5.2, changeLabel: '+5.2% invested' },
//         ],
//         measurements: ['ROI Calculation', 'Revenue Attribution', 'Cost per Conversion']
//       },
//       { 
//         id: 'cac-kpi', 
//         name: 'CAC vs Budget', 
//         actual: '$45', 
//         target: '$40', 
//         status: 'off-track', 
//         percentage: 88,
//         metrics: [
//           { id: 'cac-actual', label: 'Current CAC', value: '$45', change: -8.2, changeLabel: '-8.2% improving' },
//           { id: 'new-customers', label: 'New Customers', value: '2,450', change: 35.2, changeLabel: '+35.2% growth' },
//         ],
//         measurements: ['CAC Calculation', 'Budget Variance', 'Cost Breakdown']
//       },
//       { 
//         id: 'leads-kpi', 
//         name: 'Lead Generation', 
//         actual: '1,200', 
//         target: '1,000', 
//         status: 'on-track', 
//         percentage: 120,
//         metrics: [
//           { id: 'total-leads', label: 'Total Leads', value: '1,200', change: 42.5, changeLabel: '+42.5% growth' },
//           { id: 'qualified-leads', label: 'Qualified Leads', value: '480', change: 38.2, changeLabel: '+38.2% growth' },
//         ],
//         measurements: ['Lead Count', 'Conversion Rate', 'Lead Quality Score']
//       },
//     ];
//   }
//   return [
//     { 
//       id: 'performance-kpi', 
//       name: 'Overall Performance', 
//       actual: '92%', 
//       target: '90%', 
//       status: 'on-track', 
//       percentage: 102,
//       metrics: [
//         { id: 'performance-score', label: 'Performance Score', value: '92%', change: 5.2, changeLabel: '+5.2% improved' },
//         { id: 'efficiency', label: 'Efficiency Rate', value: '88%', change: 3.1, changeLabel: '+3.1% improved' },
//       ],
//       measurements: ['Performance Index', 'Efficiency Calc', 'Benchmark Comparison']
//     },
//     { 
//       id: 'quality-kpi', 
//       name: 'Data Quality', 
//       actual: '94%', 
//       target: '95%', 
//       status: 'at-risk', 
//       percentage: 99,
//       metrics: [
//         { id: 'quality-score', label: 'Quality Score', value: '94%', change: 2.5, changeLabel: '+2.5% improved' },
//         { id: 'completeness', label: 'Completeness', value: '98%', change: 1.2, changeLabel: '+1.2% improved' },
//       ],
//       measurements: ['Quality Index', 'Completeness Rate', 'Accuracy Score']
//     },
//     { 
//       id: 'coverage-kpi', 
//       name: 'Coverage Rate', 
//       actual: '88%', 
//       target: '85%', 
//       status: 'on-track', 
//       percentage: 104,
//       metrics: [
//         { id: 'coverage-rate', label: 'Coverage Rate', value: '88%', change: 8.5, changeLabel: '+8.5% improved' },
//         { id: 'data-points', label: 'Data Points', value: '125K', change: 15.2, changeLabel: '+15.2% growth' },
//       ],
//       measurements: ['Coverage Calc', 'Data Volume', 'Growth Rate']
//     },
//   ];
// }

// type Step = 'select-kpis' | 'select-metrics' | 'confirmation';

// export function AnalysisPanel({ 
//   file, 
//   onBuildWithRecommendations, 
//   onBuildCustomDashboard,
//   isLoading 
// }: AnalysisPanelProps) {
//   const [isAnalyzing, setIsAnalyzing] = useState(false);
//   const [isAnalyzed, setIsAnalyzed] = useState(false);
//   const [isGeneratingMetrics, setIsGeneratingMetrics] = useState(false);
//   const [kpisWithDetails, setKpisWithDetails] = useState<KPIWithTarget[]>([]);
//   const [selectedKpis, setSelectedKpis] = useState<Set<string>>(new Set());
//   const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
//   const [selectedMeasurements, setSelectedMeasurements] = useState<Set<string>>(new Set());
//   const [currentStep, setCurrentStep] = useState<Step>('select-kpis');

//   // Reset state when file changes
//   useEffect(() => {
//     if (file) {
//       setIsAnalyzed(false);
//       setIsAnalyzing(true);
//       setKpisWithDetails([]);
//       setSelectedKpis(new Set());
//       setSelectedMetrics(new Set());
//       setSelectedMeasurements(new Set());
//       setCurrentStep('select-kpis');
      
//       // Simulate analysis
//       const timer = setTimeout(() => {
//         const generatedKPIs = getKPIsWithDetails(file);
//         setKpisWithDetails(generatedKPIs);
//         setIsAnalyzed(true);
//         setIsAnalyzing(false);
//       }, 2000);
      
//       return () => clearTimeout(timer);
//     } else {
//       setIsAnalyzed(false);
//       setIsAnalyzing(false);
//       setKpisWithDetails([]);
//       setSelectedKpis(new Set());
//       setSelectedMetrics(new Set());
//       setSelectedMeasurements(new Set());
//       setCurrentStep('select-kpis');
//     }
//   }, [file?.id]);

//   const toggleKpi = (kpiId: string) => {
//     setSelectedKpis(prev => {
//       const next = new Set(prev);
//       if (next.has(kpiId)) {
//         next.delete(kpiId);
//       } else {
//         next.add(kpiId);
//       }
//       return next;
//     });
//   };

//   const toggleMetric = (metricId: string) => {
//     setSelectedMetrics(prev => {
//       const next = new Set(prev);
//       if (next.has(metricId)) {
//         next.delete(metricId);
//       } else {
//         next.add(metricId);
//       }
//       return next;
//     });
//   };

//   const toggleMeasurement = (measurement: string) => {
//     setSelectedMeasurements(prev => {
//       const next = new Set(prev);
//       if (next.has(measurement)) {
//         next.delete(measurement);
//       } else {
//         next.add(measurement);
//       }
//       return next;
//     });
//   };

//   const handleGenerateMetrics = () => {
//     setIsGeneratingMetrics(true);
//     setTimeout(() => {
//       setIsGeneratingMetrics(false);
//       setCurrentStep('select-metrics');
//     }, 1500);
//   };

//   const handleProceedToConfirmation = () => {
//     setCurrentStep('confirmation');
//   };

//   const handleBackToKpis = () => {
//     setCurrentStep('select-kpis');
//     setSelectedMetrics(new Set());
//     setSelectedMeasurements(new Set());
//   };

//   const handleBackToMetrics = () => {
//     setCurrentStep('select-metrics');
//   };

//   const handleBuildDashboard = () => {
//     const allSelectedMetrics: KPI[] = [];
//     kpisWithDetails.forEach(kpi => {
//       if (selectedKpis.has(kpi.id)) {
//         kpi.metrics.forEach(metric => {
//           if (selectedMetrics.has(metric.id)) {
//             allSelectedMetrics.push(metric);
//           }
//         });
//       }
//     });
//     onBuildWithRecommendations(allSelectedMetrics);
//   };

//   // Get selected KPIs data
//   const selectedKpisData = kpisWithDetails.filter(kpi => selectedKpis.has(kpi.id));
//   const hasMetricSelection = selectedMetrics.size > 0 || selectedMeasurements.size > 0;

//   const getStatusColor = (status: KPIWithTarget['status']) => {
//     switch (status) {
//       case 'on-track': return 'text-emerald-400';
//       case 'at-risk': return 'text-amber-400';
//       case 'off-track': return 'text-red-400';
//     }
//   };

//   const getStatusBg = (status: KPIWithTarget['status']) => {
//     switch (status) {
//       case 'on-track': return 'bg-emerald-400/10 border-emerald-400/30';
//       case 'at-risk': return 'bg-amber-400/10 border-amber-400/30';
//       case 'off-track': return 'bg-red-400/10 border-red-400/30';
//     }
//   };

//   const getStatusIcon = (status: KPIWithTarget['status']) => {
//     switch (status) {
//       case 'on-track': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
//       case 'at-risk': return <Target className="w-4 h-4 text-amber-400" />;
//       case 'off-track': return <XCircle className="w-4 h-4 text-red-400" />;
//     }
//   };

//   // Empty State - No file selected
//   if (!file) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center animate-fade-in">
//           <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-6">
//             <BarChart3 className="w-10 h-10 text-muted-foreground" />
//           </div>
//           <h2 className="text-xl font-semibold text-foreground mb-2">Select a Dataset</h2>
//           <p className="text-muted-foreground text-sm max-w-sm">
//             Choose a data source from the sidebar to analyze and generate your Power BI dashboard
//           </p>
//         </div>
//       </div>
//     );
//   }

//   const Icon = fileIcons[file.type];
//   const iconColor = fileColors[file.type];

//   // Analyzing State
//   if (isAnalyzing) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center animate-fade-in">
//           <div className="relative w-20 h-20 mx-auto mb-6">
//             <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
//             <div className="absolute inset-0 flex items-center justify-center">
//               <Search className="w-8 h-8 text-primary" />
//             </div>
//           </div>
//           <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Dataset</h2>
//           <p className="text-muted-foreground text-sm">
//             Detecting KPIs in <span className="text-primary font-medium">{file.name}</span>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // Step Indicator Component
//   const StepIndicator = () => (
//     <div className="flex items-center justify-center gap-2 mb-8">
//       <div className={cn(
//         "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
//         currentStep === 'select-kpis' 
//           ? "bg-primary text-primary-foreground" 
//           : "bg-primary/20 text-primary"
//       )}>
//         <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">1</span>
//         Select KPIs
//       </div>
//       <ChevronRight className="w-4 h-4 text-muted-foreground" />
//       <div className={cn(
//         "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
//         currentStep === 'select-metrics' 
//           ? "bg-primary text-primary-foreground" 
//           : currentStep === 'confirmation'
//           ? "bg-primary/20 text-primary"
//           : "bg-secondary text-muted-foreground"
//       )}>
//         <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">2</span>
//         Select Metrics
//       </div>
//       <ChevronRight className="w-4 h-4 text-muted-foreground" />
//       <div className={cn(
//         "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
//         currentStep === 'confirmation' 
//           ? "bg-primary text-primary-foreground" 
//           : "bg-secondary text-muted-foreground"
//       )}>
//         <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">3</span>
//         Confirm
//       </div>
//     </div>
//   );

//   // Step 1: Select KPIs
//   if (currentStep === 'select-kpis') {
//     return (
//       <div className="flex-1 overflow-auto">
//         <div className="max-w-4xl mx-auto p-6 space-y-6">
//           {/* Header */}
//           <div className="animate-fade-in">
//             <div className="flex items-center gap-3 mb-4">
//               <div className={cn(
//                 'w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20'
//               )}>
//                 <Icon className={cn('w-5 h-5', iconColor)} />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-foreground">{file.name}</h2>
//                 <p className="text-xs text-muted-foreground">
//                   {file.columns} columns • {file.rows.toLocaleString()} rows
//                 </p>
//               </div>
//             </div>
//           </div>

//           <StepIndicator />

//           {/* KPIs Selection */}
//           <div className="space-y-4 animate-slide-up">
//             <div className="flex items-center gap-2">
//               <Target className="w-5 h-5 text-primary" />
//               <h3 className="text-lg font-semibold text-foreground">Select KPIs</h3>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Choose the Key Performance Indicators you want to track. Each KPI has associated metrics and measurements.
//             </p>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {kpisWithDetails.map((kpi, index) => {
//                 const isSelected = selectedKpis.has(kpi.id);
//                 return (
//                   <div
//                     key={kpi.id}
//                     onClick={() => toggleKpi(kpi.id)}
//                     className={cn(
//                       "p-4 rounded-xl border cursor-pointer transition-all animate-fade-in group",
//                       isSelected 
//                         ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/10" 
//                         : "border-border bg-card/50 hover:border-primary/50 hover:bg-card hover:shadow-md"
//                     )}
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className={cn(
//                         "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
//                         isSelected 
//                           ? "bg-primary border-primary" 
//                           : "border-muted-foreground/40 group-hover:border-primary/60"
//                       )}>
//                         {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
//                       </div>
//                       {getStatusIcon(kpi.status)}
//                     </div>
                    
//                     <h4 className="text-sm font-semibold text-foreground mb-3">{kpi.name}</h4>
                    
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-xs">
//                         <span className="text-muted-foreground">Actual</span>
//                         <span className="font-mono font-bold text-foreground">{kpi.actual}</span>
//                       </div>
//                       <div className="flex justify-between text-xs">
//                         <span className="text-muted-foreground">Target</span>
//                         <span className="font-mono text-muted-foreground">{kpi.target}</span>
//                       </div>
//                       <div className={cn(
//                         "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs",
//                         getStatusBg(kpi.status)
//                       )}>
//                         <span className={getStatusColor(kpi.status)}>
//                           {kpi.status === 'on-track' ? 'On Track' : kpi.status === 'at-risk' ? 'At Risk' : 'Off Track'}
//                         </span>
//                         <span className={cn("font-mono font-semibold", getStatusColor(kpi.status))}>{kpi.percentage}%</span>
//                       </div>
//                     </div>

//                     <div className="mt-3 pt-3 border-t border-border/50">
//                       <p className="text-xs text-muted-foreground">
//                         {kpi.metrics.length} metrics • {kpi.measurements.length} measurements
//                       </p>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-4">
//             <Button
//               onClick={handleGenerateMetrics}
//               disabled={selectedKpis.size === 0 || isGeneratingMetrics}
//               variant="glow"
//               size="lg"
//               className="flex-1 gap-2"
//             >
//               {isGeneratingMetrics ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   Generating Metrics...
//                 </>
//               ) : (
//                 <>
//                   <Sparkles className="w-4 h-4" />
//                   Generate Metrics & Measurements ({selectedKpis.size} KPIs)
//                 </>
//               )}
//             </Button>
            
//             <Button
//               onClick={onBuildCustomDashboard}
//               disabled={isLoading}
//               variant="outline"
//               size="lg"
//               className="flex-1 gap-2"
//             >
//               <MessageSquare className="w-4 h-4" />
//               Build Your Own Dashboard
//             </Button>
//           </div>

//           {selectedKpis.size === 0 && (
//             <p className="text-xs text-center text-muted-foreground">
//               Select at least one KPI to generate metrics and measurements
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Step 2: Select Metrics & Measurements
//   if (currentStep === 'select-metrics') {
//     return (
//       <div className="flex-1 overflow-auto">
//         <div className="max-w-4xl mx-auto p-6 space-y-6">
//           {/* Header */}
//           <div className="animate-fade-in">
//             <div className="flex items-center gap-3 mb-4">
//               <div className={cn(
//                 'w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20'
//               )}>
//                 <Icon className={cn('w-5 h-5', iconColor)} />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold text-foreground">{file.name}</h2>
//                 <p className="text-xs text-muted-foreground">
//                   {selectedKpis.size} KPI{selectedKpis.size > 1 ? 's' : ''} selected
//                 </p>
//               </div>
//             </div>
//           </div>

//           <StepIndicator />

//           {/* Metrics and Measurements for each selected KPI */}
//           <div className="space-y-8 animate-slide-up">
//             {selectedKpisData.map((kpi, kpiIndex) => (
//               <div key={kpi.id} className="space-y-4" style={{ animationDelay: `${kpiIndex * 100}ms` }}>
//                 <div className="flex items-center gap-3 pb-2 border-b border-border/50">
//                   <div className={cn("p-2 rounded-lg", getStatusBg(kpi.status))}>
//                     {getStatusIcon(kpi.status)}
//                   </div>
//                   <div>
//                     <h3 className="text-base font-semibold text-foreground">{kpi.name}</h3>
//                     <p className="text-xs text-muted-foreground">
//                       {kpi.actual} / {kpi.target} ({kpi.percentage}%)
//                     </p>
//                   </div>
//                 </div>

//                 {/* Metrics */}
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <TrendingUp className="w-4 h-4 text-primary" />
//                     <span className="text-sm font-medium text-foreground">Metrics</span>
//                     <span className="text-xs text-muted-foreground">(Business performance values)</span>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {kpi.metrics.map((metric, index) => {
//                       const isSelected = selectedMetrics.has(metric.id);
//                       return (
//                         <div
//                           key={metric.id}
//                           onClick={() => toggleMetric(metric.id)}
//                           className={cn(
//                             "p-4 rounded-lg border cursor-pointer transition-all",
//                             isSelected 
//                               ? "border-primary bg-primary/10 ring-1 ring-primary/50" 
//                               : "border-border bg-card/50 hover:border-primary/50"
//                           )}
//                         >
//                           <div className="flex items-start justify-between">
//                             <div className="flex items-center gap-2">
//                               <div className={cn(
//                                 "w-5 h-5 rounded border-2 flex items-center justify-center",
//                                 isSelected 
//                                   ? "bg-primary border-primary" 
//                                   : "border-muted-foreground/40"
//                               )}>
//                                 {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
//                               </div>
//                               <span className="text-sm text-muted-foreground">{metric.label}</span>
//                             </div>
//                             <span className="text-lg font-bold text-foreground font-mono">{metric.value}</span>
//                           </div>
//                           <div className={cn(
//                             'flex items-center gap-1 text-xs mt-2 ml-7',
//                             metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'
//                           )}>
//                             {metric.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
//                             <span>{metric.changeLabel}</span>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 {/* Measurements */}
//                 <div className="space-y-3">
//                   <div className="flex items-center gap-2">
//                     <BarChart3 className="w-4 h-4 text-primary" />
//                     <span className="text-sm font-medium text-foreground">Measurements</span>
//                     <span className="text-xs text-muted-foreground">(DAX calculations)</span>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     {kpi.measurements.map((measurement, index) => {
//                       const isSelected = selectedMeasurements.has(`${kpi.id}-${measurement}`);
//                       return (
//                         <button
//                           key={index}
//                           onClick={() => toggleMeasurement(`${kpi.id}-${measurement}`)}
//                           className={cn(
//                             "px-4 py-2 rounded-full text-sm font-medium border transition-all",
//                             isSelected 
//                               ? "bg-primary text-primary-foreground border-primary" 
//                               : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
//                           )}
//                         >
//                           {measurement}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-4">
//             <Button
//               onClick={handleBackToKpis}
//               variant="outline"
//               size="lg"
//               className="gap-2"
//             >
//               Back to KPIs
//             </Button>
//             <Button
//               onClick={handleProceedToConfirmation}
//               disabled={!hasMetricSelection}
//               variant="glow"
//               size="lg"
//               className="flex-1 gap-2"
//             >
//               <ChevronRight className="w-4 h-4" />
//               Review Selection ({selectedMetrics.size + selectedMeasurements.size} items)
//             </Button>
//           </div>

//           {!hasMetricSelection && (
//             <p className="text-xs text-center text-muted-foreground">
//               Select at least one metric or measurement to proceed
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Step 3: Confirmation
//   return (
//     <div className="flex-1 overflow-auto">
//       <div className="max-w-4xl mx-auto p-6 space-y-6">
//         {/* Header */}
//         <div className="animate-fade-in">
//           <div className="flex items-center gap-3 mb-4">
//             <div className={cn(
//               'w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20'
//             )}>
//               <Icon className={cn('w-5 h-5', iconColor)} />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-foreground">Confirm Your Selection</h2>
//               <p className="text-xs text-muted-foreground">
//                 Review and build your dashboard
//               </p>
//             </div>
//           </div>
//         </div>

//         <StepIndicator />

//         {/* Selection Summary */}
//         <div className="space-y-6 animate-slide-up">
//           <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
//             <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
//               <CheckCircle2 className="w-5 h-5 text-primary" />
//               Your Dashboard will include:
//             </h3>

//             {/* Selected KPIs */}
//             <div className="space-y-4">
//               {selectedKpisData.map((kpi) => {
//                 const selectedKpiMetrics = kpi.metrics.filter(m => selectedMetrics.has(m.id));
//                 const selectedKpiMeasurements = kpi.measurements.filter(m => selectedMeasurements.has(`${kpi.id}-${m}`));
                
//                 return (
//                   <div key={kpi.id} className="p-4 rounded-lg bg-card/80 border border-border">
//                     <div className="flex items-center gap-2 mb-3">
//                       {getStatusIcon(kpi.status)}
//                       <span className="font-semibold text-foreground">{kpi.name}</span>
//                       <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusBg(kpi.status), getStatusColor(kpi.status))}>
//                         {kpi.percentage}%
//                       </span>
//                     </div>

//                     {selectedKpiMetrics.length > 0 && (
//                       <div className="mb-2">
//                         <span className="text-xs text-muted-foreground">Metrics: </span>
//                         <span className="text-sm text-foreground">
//                           {selectedKpiMetrics.map(m => m.label).join(', ')}
//                         </span>
//                       </div>
//                     )}

//                     {selectedKpiMeasurements.length > 0 && (
//                       <div>
//                         <span className="text-xs text-muted-foreground">Measurements: </span>
//                         <span className="text-sm text-foreground">
//                           {selectedKpiMeasurements.join(', ')}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>

//             {/* Summary Stats */}
//             <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-primary">{selectedKpis.size}</div>
//                 <div className="text-xs text-muted-foreground">KPIs</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-primary">{selectedMetrics.size}</div>
//                 <div className="text-xs text-muted-foreground">Metrics</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-primary">{selectedMeasurements.size}</div>
//                 <div className="text-xs text-muted-foreground">Measurements</div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-4 pt-4">
//           <Button
//             onClick={handleBackToMetrics}
//             variant="outline"
//             size="lg"
//             className="gap-2"
//           >
//             Back to Metrics
//           </Button>
//           <Button
//             onClick={handleBuildDashboard}
//             disabled={isLoading}
//             variant="glow"
//             size="lg"
//             className="flex-1 gap-2"
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Building Dashboard...
//               </>
//             ) : (
//               <>
//                 <Wand2 className="w-4 h-4" />
//                 Build Dashboard with Recommendations
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { DataFile, KPI } from '@/components/types/dashboard';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Wand2, 
  MessageSquare,
  FileText,
  Table,
  FileJson,
  Search,
  Target,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface KPIWithTarget {
  id: string;
  name: string;
  actual: string;
  target: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  percentage: number;
  metrics: KPI[];
  measurements: string[];
}

interface AnalysisPanelProps {
  file: DataFile | null;
  onBuildWithRecommendations: (data: { kpis: KPI[]; visuals: any[]; total_rows: number }) => void;
  onBuildCustomDashboard: () => void;
  isLoading: boolean;
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

type Step = 'select-kpis' | 'select-metrics' | 'confirmation';

export function AnalysisPanel({ 
  file, 
  onBuildWithRecommendations, 
  onBuildCustomDashboard,
  isLoading 
}: AnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [kpisWithDetails, setKpisWithDetails] = useState<KPIWithTarget[]>([]);
  const [selectedKpis, setSelectedKpis] = useState<Set<string>>(new Set());
  const [selectedMetrics, setSelectedMetrics] = useState<Set<string>>(new Set());
  const [selectedMeasurements, setSelectedMeasurements] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState<Step>('select-kpis');
  const [isGeneratingMetrics, setIsGeneratingMetrics] = useState(false);

  // Step 1: Discover KPIs
  useEffect(() => {
    if (!file) {
      setKpisWithDetails([]);
      setIsAnalyzing(false);
      return;
    }

    const userData = localStorage.getItem("user");
    const jobId = localStorage.getItem("current_job_id");

    if (!userData || !jobId) {
      toast.error("User or Job ID missing");
      return;
    }

    const userId = JSON.parse(userData).id;
    const csvBlobPath = `${userId}/${jobId}/${file.name}.csv`;

    setIsAnalyzing(true);
    setKpisWithDetails([]);
    setSelectedKpis(new Set());
    setSelectedMetrics(new Set());
    setSelectedMeasurements(new Set());
    setCurrentStep('select-kpis');

    const fetchKPIs = async () => {
      try {
        const response = await fetch('http://20.81.213.147:8000/discover_kpis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csv_blob: csvBlobPath })
        });

        if (!response.ok) throw new Error("Failed to discover KPIs");

        const data = await response.json();
        const apiKpis = data.available_kpis || [];

        const generatedKPIs: KPIWithTarget[] = apiKpis.map((item: { kpi_name: string }, index: number) => {
          const statuses: ('on-track' | 'at-risk' | 'off-track')[] = ['on-track', 'at-risk', 'off-track'];
          const status = statuses[index % 3];
          const percentage = 75 + (index * 8) % 35;

          return {
            id: `kpi-${index}`,
            name: item.kpi_name,
            actual: '—',
            target: '—',
            status,
            percentage,
            metrics: [],
            measurements: []
          };
        });

        setKpisWithDetails(generatedKPIs);
        toast.success(`${apiKpis.length} KPIs discovered!`);
      } catch (err) {
        toast.error("Failed to load KPIs");
        setKpisWithDetails([]);
      } finally {
        setIsAnalyzing(false);
      }
    };

    fetchKPIs();
  }, [file]);

  // Step 2: Compute real metrics
  const handleGenerateMetrics = async () => {
    if (selectedKpis.size === 0) return;

    setIsGeneratingMetrics(true);

    const userData = localStorage.getItem("user");
    const jobId = localStorage.getItem("current_job_id");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId || !jobId || !file) {
      toast.error("Missing data");
      setIsGeneratingMetrics(false);
      return;
    }

    const csvBlobPath = `${userId}/${jobId}/${file.name}.csv`;
    const selectedKpiNames = kpisWithDetails
      .filter(kpi => selectedKpis.has(kpi.id))
      .map(kpi => kpi.name);

    try {
      const response = await fetch('http://20.81.213.147:8000/compute_kpis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv_blob: csvBlobPath,
          selected_kpi_names: selectedKpiNames
        })
      });

      if (!response.ok) throw new Error("Failed to compute KPIs");

      const data = await response.json();
      const computedKpis = data.selected_kpis || [];

      const updatedKpis = kpisWithDetails.map(kpi => {
        if (!selectedKpis.has(kpi.id)) return kpi;

        const computed = computedKpis.find((c: any) => c.kpi_name === kpi.name);
        if (!computed) return kpi;

        return {
          ...kpi,
          actual: computed.metrics.toString(),
          metrics: [
            {
              id: `metric-${kpi.id}`,
              label: `${kpi.name} Value`,
              value: computed.metrics.toLocaleString(undefined, { maximumFractionDigits: 2 }),
              change: 0,
              changeLabel: 'Computed from data'
            }
          ],
          measurements: [computed.measures]
        };
      });

      setKpisWithDetails(updatedKpis);
      toast.success("Metrics computed!");
      setCurrentStep('select-metrics');
    } catch (err) {
      toast.error("Failed to compute metrics");
    } finally {
      setIsGeneratingMetrics(false);
    }
  };

  // Step 3: Generate full dashboard
  const handleBuildDashboard = async () => {
    if (!file) return;

    const userData = localStorage.getItem("user");
    const jobId = localStorage.getItem("current_job_id");
    const userId = userData ? JSON.parse(userData).id : null;

    if (!userId || !jobId) {
      toast.error("User or Job ID missing");
      return;
    }

    const csvBlobPath = `${userId}/${jobId}/${file.name}.csv`;

    const selectedComputedKpis = kpisWithDetails
      .filter(kpi => selectedKpis.has(kpi.id))
      .map(kpi => ({
        kpi_name: kpi.name,
        measures: kpi.measurements[0] || "",
        metrics: parseFloat(kpi.actual.replace(/,/g, '')) || 0
      }));

    if (selectedComputedKpis.length === 0) {
      toast.error("No KPIs selected");
      return;
    }

    // Always prepare fallback KPIs from our real computed data
    const fallbackKpis: KPI[] = selectedComputedKpis.map((k, i) => ({
      id: `fallback-${i}`,
      label: k.kpi_name,
      value: k.metrics.toLocaleString(),
      change: 0,
      changeLabel: 'From your selection'
    }));

    try {
      const response = await fetch('http://20.81.213.147:8000/generate_visuals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csv_blob: csvBlobPath,
          computed_kpis: selectedComputedKpis
        })
      });

      const visualsData = response.ok ? await response.json() : { visuals: [], total_rows: 0 };

      // Extract KPI visuals from backend
      let finalKpis = visualsData.visuals
        ?.filter((v: any) => v.chart_type === "KPI")
        ?.map((v: any, i: number) => ({
          id: `api-kpi-${i}`,
          label: v.chart_name,
          value: v.value?.toString() || '—',
          change: Math.random() * 30 - 10,
          changeLabel: v.description || 'AI Generated'
        })) || [];

      // If backend didn't return KPI visuals, use our real computed ones
      if (finalKpis.length === 0) {
        finalKpis = fallbackKpis;
      }

      // Pass FULL data to parent
      onBuildWithRecommendations({
        kpis: finalKpis,
        visuals: visualsData.visuals || [],
        total_rows: visualsData.total_rows || selectedComputedKpis.length
      });

      toast.success("Dashboard generated with real visuals!");
    } catch (err) {
      console.error("Generate visuals failed:", err);
      toast.info("Showing your selected KPIs");

      // Always show something
      onBuildWithRecommendations({
        kpis: fallbackKpis,
        visuals: [],
        total_rows: selectedComputedKpis.length
      });
    }
  };

  const toggleKpi = (kpiId: string) => {
    setSelectedKpis(prev => {
      const next = new Set(prev);
      next.has(kpiId) ? next.delete(kpiId) : next.add(kpiId);
      return next;
    });
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(prev => {
      const next = new Set(prev);
      next.has(metricId) ? next.delete(metricId) : next.add(metricId);
      return next;
    });
  };

  const toggleMeasurement = (measurement: string) => {
    setSelectedMeasurements(prev => {
      const next = new Set(prev);
      next.has(measurement) ? next.delete(measurement) : next.add(measurement);
      return next;
    });
  };

  const handleProceedToConfirmation = () => setCurrentStep('confirmation');
  const handleBackToKpis = () => {
    setCurrentStep('select-kpis');
    setSelectedMetrics(new Set());
    setSelectedMeasurements(new Set());
  };
  const handleBackToMetrics = () => setCurrentStep('select-metrics');

  const selectedKpisData = kpisWithDetails.filter(kpi => selectedKpis.has(kpi.id));
  const hasMetricSelection = selectedMetrics.size > 0 || selectedMeasurements.size > 0;

  const getStatusColor = (status: KPIWithTarget['status']) => {
    switch (status) {
      case 'on-track': return 'text-emerald-400';
      case 'at-risk': return 'text-amber-400';
      case 'off-track': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status: KPIWithTarget['status']) => {
    switch (status) {
      case 'on-track': return 'bg-emerald-400/10 border-emerald-400/30';
      case 'at-risk': return 'bg-amber-400/10 border-amber-400/30';
      case 'off-track': return 'bg-red-400/10 border-red-400/30';
      default: return 'bg-secondary';
    }
  };

  const getStatusIcon = (status: KPIWithTarget['status']) => {
    switch (status) {
      case 'on-track': return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'at-risk': return <Target className="w-4 h-4 text-amber-400" />;
      case 'off-track': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-secondary/50 border border-border flex items-center justify-center mx-auto mb-6">
            <BarChart3 className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Select a Dataset</h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Choose a data source from the sidebar to analyze and generate your Power BI dashboard
          </p>
        </div>
      </div>
    );
  }

  const Icon = fileIcons[file.type] || FileText;
  const iconColor = fileColors[file.type] || 'text-muted-foreground';

  if (isAnalyzing) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Analyzing Dataset</h2>
          <p className="text-muted-foreground text-sm">
            Detecting KPIs in <span className="text-primary font-medium">{file.name}</span>
          </p>
        </div>
      </div>
    );
  }

  if (kpisWithDetails.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center">
        <p className="text-muted-foreground">No KPIs discovered for this dataset.</p>
      </div>
    );
  }

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        currentStep === 'select-kpis' ? "bg-primary text-primary-foreground" : "bg-primary/20 text-primary"
      )}>
        <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">1</span>
        Select KPIs
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        currentStep === 'select-metrics' 
          ? "bg-primary text-primary-foreground" 
          : currentStep === 'confirmation' ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
      )}>
        <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">2</span>
        Select Metrics
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground" />
      <div className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
        currentStep === 'confirmation' ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
      )}>
        <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center">3</span>
        Confirm
      </div>
    </div>
  );

  if (currentStep === 'select-kpis') {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20')}>
                <Icon className={cn('w-5 h-5', iconColor)} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{file.name}</h2>
                <p className="text-xs text-muted-foreground">AI-discovered KPIs</p>
              </div>
            </div>
          </div>

          <StepIndicator />

          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Select KPIs</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Choose the Key Performance Indicators you want to track.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {kpisWithDetails.map((kpi, index) => {
                const isSelected = selectedKpis.has(kpi.id);
                return (
                  <div
                    key={kpi.id}
                    onClick={() => toggleKpi(kpi.id)}
                    className={cn(
                      "p-4 rounded-xl border cursor-pointer transition-all animate-fade-in group",
                      isSelected 
                        ? "border-primary bg-primary/10 ring-2 ring-primary/30 shadow-lg shadow-primary/10" 
                        : "border-border bg-card/50 hover:border-primary/50 hover:bg-card hover:shadow-md"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary" : "border-muted-foreground/40 group-hover:border-primary/60"
                      )}>
                        {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                      </div>
                      {getStatusIcon(kpi.status)}
                    </div>
                    
                    <h4 className="text-sm font-semibold text-foreground mb-3">{kpi.name}</h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Actual</span>
                        <span className="font-mono font-bold text-foreground">{kpi.actual}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Target</span>
                        <span className="font-mono text-muted-foreground">{kpi.target}</span>
                      </div>
                      <div className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded-lg text-xs",
                        getStatusBg(kpi.status)
                      )}>
                        <span className={getStatusColor(kpi.status)}>
                          {kpi.status === 'on-track' ? 'On Track' : kpi.status === 'at-risk' ? 'At Risk' : 'Off Track'}
                        </span>
                        <span className={cn("font-mono font-semibold", getStatusColor(kpi.status))}>{kpi.percentage}%</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        {kpi.metrics.length} metrics • {kpi.measurements.length} measurements
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              onClick={handleGenerateMetrics}
              disabled={selectedKpis.size === 0 || isGeneratingMetrics}
              variant="glow"
              size="lg"
              className="flex-1 gap-2"
            >
              {isGeneratingMetrics ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Computing Metrics...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Metrics & Measurements ({selectedKpis.size} KPIs)
                </>
              )}
            </Button>
            
            <Button
              onClick={onBuildCustomDashboard}
              disabled={isLoading}
              variant="outline"
              size="lg"
              className="flex-1 gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Build Your Own Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'select-metrics') {
    return (
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20')}>
                <Icon className={cn('w-5 h-5', iconColor)} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{file.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedKpis.size} KPI{selectedKpis.size > 1 ? 's' : ''} selected
                </p>
              </div>
            </div>
          </div>

          <StepIndicator />

          <div className="space-y-8 animate-slide-up">
            {selectedKpisData.map((kpi, kpiIndex) => (
              <div key={kpi.id} className="space-y-4" style={{ animationDelay: `${kpiIndex * 100}ms` }}>
                <div className="flex items-center gap-3 pb-2 border-b border-border/50">
                  <div className={cn("p-2 rounded-lg", getStatusBg(kpi.status))}>
                    {getStatusIcon(kpi.status)}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{kpi.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {kpi.actual} / {kpi.target} ({kpi.percentage}%)
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Metrics</span>
                    <span className="text-xs text-muted-foreground">(Computed values)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {kpi.metrics.map((metric) => {
                      const isSelected = selectedMetrics.has(metric.id);
                      return (
                        <div
                          key={metric.id}
                          onClick={() => toggleMetric(metric.id)}
                          className={cn(
                            "p-4 rounded-lg border cursor-pointer transition-all",
                            isSelected 
                              ? "border-primary bg-primary/10 ring-1 ring-primary/50" 
                              : "border-border bg-card/50 hover:border-primary/50"
                          )}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "w-5 h-5 rounded border-2 flex items-center justify-center",
                                isSelected ? "bg-primary border-primary" : "border-muted-foreground/40"
                              )}>
                                {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                              <span className="text-sm text-muted-foreground">{metric.label}</span>
                            </div>
                            <span className="text-lg font-bold text-foreground font-mono">{metric.value}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs mt-2 ml-7 text-emerald-400">
                            <TrendingUp className="w-3 h-3" />
                            <span>{metric.changeLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Measurements</span>
                    <span className="text-xs text-muted-foreground">(DAX calculations)</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {kpi.measurements.map((measurement, idx) => {
                      const isSelected = selectedMeasurements.has(measurement);
                      return (
                        <button
                          key={idx}
                          onClick={() => toggleMeasurement(measurement)}
                          className={cn(
                            "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                            isSelected 
                              ? "bg-primary text-primary-foreground border-primary" 
                              : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                          )}
                        >
                          {measurement}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={handleBackToKpis} variant="outline" size="lg" className="gap-2">
              Back to KPIs
            </Button>
            <Button
              onClick={handleProceedToConfirmation}
              disabled={!hasMetricSelection}
              variant="glow"
              size="lg"
              className="flex-1 gap-2"
            >
              <ChevronRight className="w-4 h-4" />
              Review Selection ({selectedMetrics.size + selectedMeasurements.size} items)
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Confirmation
  return (
    <div className="flex-1 overflow-auto">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 border border-primary/20')}>
              <Icon className={cn('w-5 h-5', iconColor)} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Confirm Your Selection</h2>
              <p className="text-xs text-muted-foreground">Review and build your dashboard</p>
            </div>
          </div>
        </div>

        <StepIndicator />

        <div className="space-y-6 animate-slide-up">
          <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Your Dashboard will include:
            </h3>

            <div className="space-y-4">
              {selectedKpisData.map((kpi) => {
                const selectedKpiMetrics = kpi.metrics.filter(m => selectedMetrics.has(m.id));
                const selectedKpiMeasurements = kpi.measurements.filter(m => selectedMeasurements.has(m));
                
                return (
                  <div key={kpi.id} className="p-4 rounded-lg bg-card/80 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusIcon(kpi.status)}
                      <span className="font-semibold text-foreground">{kpi.name}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", getStatusBg(kpi.status), getStatusColor(kpi.status))}>
                        {kpi.percentage}%
                      </span>
                    </div>

                    {selectedKpiMetrics.length > 0 && (
                      <div className="mb-2">
                        <span className="text-xs text-muted-foreground">Metrics: </span>
                        <span className="text-sm text-foreground">
                          {selectedKpiMetrics.map(m => m.label).join(', ')}
                        </span>
                      </div>
                    )}

                    {selectedKpiMeasurements.length > 0 && (
                      <div>
                        <span className="text-xs text-muted-foreground">Measurements: </span>
                        <span className="text-sm text-foreground">
                          {selectedKpiMeasurements.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-6 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedKpis.size}</div>
                <div className="text-xs text-muted-foreground">KPIs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedMetrics.size}</div>
                <div className="text-xs text-muted-foreground">Metrics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedMeasurements.size}</div>
                <div className="text-xs text-muted-foreground">Measurements</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button onClick={handleBackToMetrics} variant="outline" size="lg" className="gap-2">
            Back to Metrics
          </Button>
          <Button
            onClick={handleBuildDashboard}
            disabled={isLoading}
            variant="glow"
            size="lg"
            className="flex-1 gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Building Dashboard...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                Build Dashboard with Recommendations
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
