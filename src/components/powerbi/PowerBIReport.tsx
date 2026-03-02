// import { ArrowLeft, BarChart3, TrendingUp, FileText, Share2, Download, MessageSquare } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface PowerBIReportProps {
//   workspaceName: string;
//   onBack: () => void;
// }

// export function PowerBIReport({ workspaceName, onBack }: PowerBIReportProps) {
//   const kpis = [
//     { label: 'Total Mutual Funds', value: '1583', description: 'Sum of all values across 4 numeric columns', color: 'hsl(0,70%,55%)' },
//     { label: 'Average Mutual Funds per Customer', value: '9.89', description: 'Average of all numeric values (160 data points)', color: 'hsl(160,60%,45%)' },
//     { label: 'Total Equity Market Investments', value: '1583', description: 'Sum of all values across 4 numeric columns', color: 'hsl(160,60%,45%)' },
//     { label: 'Average Equity Market Investments per Customer', value: '9.89', description: 'Average of all numeric values (160 data points)', color: 'hsl(0,70%,55%)' },
//     { label: 'Total Debentures', value: '1583', description: 'Sum of all values across 4 numeric columns', color: 'hsl(160,60%,45%)' },
//   ];

//   return (
//     <div className="min-h-screen bg-white flex flex-col">
//       {/* Header */}
//       <div className="border-b border-[hsl(0,0%,90%)] bg-white px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <div className="w-10 h-10 rounded-lg bg-[hsl(270,60%,95%)] flex items-center justify-center">
//             <BarChart3 className="w-5 h-5 text-[hsl(270,70%,65%)]" />
//           </div>
//           <h1 className="text-xl font-bold text-[hsl(0,0%,15%)]">PowerBI Dashboard</h1>
//         </div>
//         <button
//           onClick={onBack}
//           className="flex items-center gap-2 text-sm text-[hsl(0,0%,40%)] hover:text-[hsl(0,0%,20%)] transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>
//       </div>

//       {/* Content */}
//       <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
//         {/* Source, Query & Action buttons row */}
//         <div className="space-y-3">
//           <div className="flex items-start justify-between">
//             <div className="space-y-2 flex-1">
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,40%)]">
//                   <FileText className="w-4 h-4" />
//                   <span className="font-medium text-[hsl(0,0%,30%)]">SOURCE</span>
//                 </div>
//                 <span className="text-sm font-semibold text-[hsl(0,0%,15%)]">{workspaceName || 'dataset001'}</span>
//               </div>
//               <div className="flex items-start gap-3">
//                 <div className="flex items-center gap-2 text-sm text-[hsl(0,0%,40%)] mt-0.5">
//                   <MessageSquare className="w-4 h-4" />
//                   <span className="font-medium text-[hsl(0,0%,30%)]">QUERY</span>
//                 </div>
//                 <p className="text-sm text-[hsl(0,0%,40%)] max-w-2xl">
//                   Recommended Dashboard: Total Mutual Funds, Average Mutual Funds per Customer, Total Equity Market Investments, Average Equity Market Investments per Customer, Total Debentures
//                 </p>
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="flex items-center gap-3 ml-6 shrink-0">
//               <Button variant="outline" className="gap-2 rounded-full border-[hsl(0,0%,85%)] text-[hsl(0,0%,30%)]">
//                 <Share2 className="w-4 h-4" />
//                 Deploy to Power BI
//               </Button>
//               <Button className="gap-2 rounded-full bg-[hsl(270,70%,65%)] hover:bg-[hsl(270,70%,55%)] text-white">
//                 <Download className="w-4 h-4" />
//                 Download Dataset
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Badges */}
//         <div className="flex gap-3">
//           <span className="px-3 py-1 text-xs font-medium rounded-full bg-[hsl(45,90%,90%)] text-[hsl(35,90%,40%)]">5 KPIs</span>
//           <span className="px-3 py-1 text-xs font-medium rounded-full bg-[hsl(160,60%,90%)] text-[hsl(160,70%,35%)]">40 Records</span>
//           <span className="px-3 py-1 text-xs font-medium rounded-full bg-[hsl(0,70%,93%)] text-[hsl(0,70%,50%)]">7 Visuals Defined</span>
//         </div>

//         {/* Key Results */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-bold text-[hsl(0,0%,15%)] flex items-center gap-2">
//             <TrendingUp className="w-5 h-5 text-[hsl(0,0%,40%)]" />
//             Key Results
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {kpis.map((kpi, i) => (
//               <div
//                 key={i}
//                 className="bg-white border border-[hsl(0,0%,90%)] rounded-xl p-5 space-y-3"
//               >
//                 <div className="flex items-start justify-between">
//                   <p className="text-sm font-medium text-[hsl(0,0%,25%)]">{kpi.label}</p>
//                   <span className="text-xl font-bold text-[hsl(0,0%,15%)] ml-3 whitespace-nowrap">{kpi.value}</span>
//                 </div>
//                 <div
//                   className="rounded-lg px-3 py-2 text-xs flex items-center gap-2"
//                   style={{ backgroundColor: `${kpi.color}15`, color: kpi.color }}
//                 >
//                   <TrendingUp className="w-3 h-3" />
//                   {kpi.description}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Visualizations */}
//         <div className="space-y-4">
//           <h2 className="text-lg font-bold text-[hsl(0,0%,15%)] flex items-center gap-2">
//             <BarChart3 className="w-5 h-5 text-[hsl(0,0%,40%)]" />
//             Visualizations
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {/* Bar Chart */}
//             <div className="bg-white border border-[hsl(0,0%,90%)] rounded-xl p-6 h-72 flex flex-col">
//               <h3 className="text-sm font-semibold text-[hsl(0,0%,25%)] mb-4">Revenue Trend</h3>
//               <div className="flex-1 flex items-end gap-1.5">
//                 {[35, 50, 40, 55, 65, 60, 72, 68, 80, 75, 88, 95].map((h, i) => (
//                   <div
//                     key={i}
//                     className="flex-1 rounded-t-sm transition-all hover:opacity-80"
//                     style={{ height: `${h}%`, backgroundColor: 'hsl(195,90%,50%)' }}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Donut Chart */}
//             <div className="bg-white border border-[hsl(0,0%,90%)] rounded-xl p-6 h-72 flex flex-col">
//               <h3 className="text-sm font-semibold text-[hsl(0,0%,25%)] mb-4">Category Distribution</h3>
//               <div className="flex-1 flex items-center justify-center">
//                 <div className="relative w-36 h-36">
//                   <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
//                     <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(0,0%,92%)" strokeWidth="20" />
//                     <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(270,60%,60%)" strokeWidth="20" strokeDasharray="100 151" />
//                     <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(270,45%,70%)" strokeWidth="20" strokeDasharray="60 191" strokeDashoffset="-100" />
//                     <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(270,30%,80%)" strokeWidth="20" strokeDasharray="40 211" strokeDashoffset="-160" />
//                   </svg>
//                 </div>
//                 <div className="ml-6 space-y-2 text-xs">
//                   {[
//                     { label: 'Electronics (40%)', color: 'hsl(270,60%,60%)' },
//                     { label: 'Clothing (24%)', color: 'hsl(270,45%,70%)' },
//                     { label: 'Home (16%)', color: 'hsl(270,30%,80%)' },
//                     { label: 'Other (20%)', color: 'hsl(0,0%,85%)' },
//                   ].map((item, i) => (
//                     <div key={i} className="flex items-center gap-2">
//                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
//                       <span className="text-[hsl(0,0%,45%)]">{item.label}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Branding */}
//         <div className="flex justify-end pb-4">
//           <div className="flex items-center gap-2 text-[hsl(270,60%,60%)]">
//             <div className="w-8 h-8 rounded-full bg-[hsl(270,60%,95%)] flex items-center justify-center font-bold text-sm">Q</div>
//             <span className="font-bold text-sm">QUADRANT</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { ArrowLeft, BarChart3, TrendingUp, FileText, Share2, Download, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PowerBIReportProps {
  workspaceName: string;
  onBack: () => void;
}

export function PowerBIReport({ workspaceName, onBack }: PowerBIReportProps) {
  const kpis = [
    { label: 'Total Mutual Funds', value: '1583', description: 'Sum of all values across 4 numeric columns', colorVar: 'destructive' },
    { label: 'Average Mutual Funds per Customer', value: '9.89', description: 'Average of all numeric values (160 data points)', colorVar: 'primary' },
    { label: 'Total Equity Market Investments', value: '1583', description: 'Sum of all values across 4 numeric columns', colorVar: 'primary' },
    { label: 'Average Equity Market Investments per Customer', value: '9.89', description: 'Average of all numeric values (160 data points)', colorVar: 'destructive' },
    { label: 'Total Debentures', value: '1583', description: 'Sum of all values across 4 numeric columns', colorVar: 'primary' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-xl font-bold text-foreground">PowerBI Dashboard</h1>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full space-y-6">
        {/* Source, Query & Action buttons row */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium text-foreground/80">SOURCE</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{workspaceName || 'dataset001'}</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium text-foreground/80">QUERY</span>
                </div>
                <p className="text-sm text-muted-foreground max-w-2xl">
                  Recommended Dashboard: Total Mutual Funds, Average Mutual Funds per Customer, Total Equity Market Investments, Average Equity Market Investments per Customer, Total Debentures
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button variant="outline" className="gap-2 rounded-full">
                <Share2 className="w-4 h-4" />
                Deploy to Power BI
              </Button>
              <Button className="gap-2 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="w-4 h-4" />
                Download Dataset
              </Button>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-3">
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 dark:bg-yellow-950/50 text-yellow-800 dark:text-yellow-300">5 KPIs</span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 dark:bg-green-950/50 text-green-800 dark:text-green-300">40 Records</span>
          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 dark:bg-red-950/50 text-red-800 dark:text-red-300">7 Visuals Defined</span>
        </div>

        {/* Key Results */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            Key Results
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-xl p-5 space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-medium text-foreground/90">{kpi.label}</p>
                  <span className="text-xl font-bold text-foreground whitespace-nowrap">{kpi.value}</span>
                </div>
                <div
                  className="rounded-lg px-3 py-2 text-xs flex items-center gap-2"
                  style={{ backgroundColor: `hsl(var(--${kpi.colorVar})/0.15)`, color: `hsl(var(--${kpi.colorVar}))` }}
                >
                  <TrendingUp className="w-3 h-3" />
                  {kpi.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visualizations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-muted-foreground" />
            Visualizations
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bar Chart */}
            <div className="bg-card border border-border rounded-xl p-6 h-72 flex flex-col">
              <h3 className="text-sm font-semibold text-foreground/90 mb-4">Revenue Trend</h3>
              <div className="flex-1 flex items-end gap-1.5">
                {[35, 50, 40, 55, 65, 60, 72, 68, 80, 75, 88, 95].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm transition-all hover:opacity-80 bg-primary/80"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Donut Chart placeholder – kept original, can be improved */}
            <div className="bg-card border border-border rounded-xl p-6 h-72 flex flex-col">
              <h3 className="text-sm font-semibold text-foreground/90 mb-4">Category Distribution</h3>
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--border))" strokeWidth="20" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="20" strokeDasharray="100 151" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary)/0.8)" strokeWidth="20" strokeDasharray="60 191" strokeDashoffset="-100" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--primary)/0.6)" strokeWidth="20" strokeDasharray="40 211" strokeDashoffset="-160" />
                  </svg>
                </div>
                <div className="ml-6 space-y-2 text-xs">
                  {[
                    { label: 'Electronics (40%)', color: 'primary' },
                    { label: 'Clothing (24%)', color: 'primary/0.8' },
                    { label: 'Home (16%)', color: 'primary/0.6' },
                    { label: 'Other (20%)', color: 'muted' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: `hsl(var(--${item.color}))` }} />
                      <span className="text-muted-foreground">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="flex justify-end pb-4">
          <div className="flex items-center gap-2 text-primary">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm">Q</div>
            <span className="font-bold text-sm">QUADRANT</span>
          </div>
        </div>
      </div>
    </div>
  );
}