// import { useState } from "react";
// import { WorkflowLayout } from "@/components/WorkflowLayout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { toast } from "sonner";
// import { useNavigate } from "react-router-dom";
// import {
//   FileText, Play, ArrowLeft, Upload, Download,
//   BarChart3, TrendingUp, MessageSquare, Eye, Loader2,
//   Sparkles
// } from "lucide-react";
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
// } from "recharts";

// // Mock data - replace with real API later
// const availableFiles = [
//   { id: 1, name: "sales_data_2024.csv", type: "csv", columns: 8, rows: 15420, createdAt: "2024-12-01" },
//   { id: 2, name: "customer_analytics.xlsx", type: "excel", columns: 12, rows: 8750, createdAt: "2024-11-28" },
//   { id: 3, name: "product_inventory.csv", type: "csv", columns: 6, rows: 3200, createdAt: "2024-11-25" },
//   { id: 4, name: "marketing_campaigns.xlsx", type: "excel", columns: 10, rows: 890, createdAt: "2024-11-20" },
//   { id: 5, name: "revenue_quarterly.json", type: "json", columns: 5, rows: 48, createdAt: "2024-11-15" },
// ];

// // Sample chart data
// const monthlySalesData = [
//   { month: "Jan", sales: 65000, target: 60000 },
//   { month: "Feb", sales: 72000, target: 70000 },
//   { month: "Mar", sales: 85000, target: 80000 },
//   { month: "Apr", sales: 91000, target: 85000 },
//   { month: "May", sales: 98000, target: 95000 },
//   { month: "Jun", sales: 110000, target: 100000 },
// ];

// const categoryData = [
//   { name: "Electronics", value: 482000 },
//   { name: "Clothing", value: 245000 },
//   { name: "Home & Garden", value: 188250 },
//   { name: "Sports", value: 138750 },
//   { name: "Books", value: 95000 },
// ];

// const regionData = [
//   { region: "North America", users: 4520 },
//   { region: "Europe", users: 3890 },
//   { region: "Asia", users: 5120 },
//   { region: "South America", users: 1200 },
//   { region: "Africa", users: 500 },
// ];

// const productTableData = [
//   { name: "Quantum Laptop", category: "Electronics", units: 1205, revenue: 482000 },
//   { name: "Nova Smartwatch", category: "Electronics", units: 980, revenue: 245000 },
//   { name: "Aero Jacket", category: "Clothing", units: 2510, revenue: 188250 },
//   { name: "Echo Headphones", category: "Electronics", units: 1850, revenue: 138750 },
// ];

// const pieColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// export default function PowerBIDashboard() {
//   const [selectedFile, setSelectedFile] = useState<typeof availableFiles[0] | null>(null);
//   const [query, setQuery] = useState("");
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [dashboardMode, setDashboardMode] = useState(false);
//   const navigate = useNavigate();

//   const handleGenerate = async () => {
//     if (!selectedFile) return toast.error("Please select a file");
//     if (!query.trim()) return toast.error("Please enter what insights you want");

//     setIsGenerating(true);
//     await new Promise(r => setTimeout(r, 2500)); // Simulate AI
//     setIsGenerating(false);
//     setDashboardMode(true);
//     toast.success("Dashboard generated successfully!");
//   };

//   if (dashboardMode) {
//     return (
//       <WorkflowLayout>
//         <div className="min-h-screen bg-background">
//           {/* Header */}
//           <div className="border-b border-border/50 bg-card/80 backdrop-blur">
//             <div className="max-w-7xl mx-auto px-6 py-4">
//               <button onClick={() => setDashboardMode(false)} className="flex items-center gap-3 hover:opacity-80">
//                 <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//                   <BarChart3 className="w-5 h-5 text-primary" />
//                 </div>
//                 <span className="text-lg font-semibold">Dashboard Preview</span>
//               </button>
//             </div>
//           </div>

//           <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
//             {/* Info Bar */}
//             <div className="flex flex-col lg:flex-row justify-between gap-6">
//               <div className="space-y-3">
//                 <div className="flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-primary" />
//                   <span className="text-xs uppercase text-muted-foreground">Source</span>
//                   <span className="font-medium">{selectedFile?.name}</span>
//                 </div>
//                 <div className="flex items-start gap-2">
//                   <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
//                   <span className="text-xs uppercase text-muted-foreground">Query</span>
//                   <p className="text-sm max-w-2xl">{query}</p>
//                 </div>
//               </div>
//               <div className="flex gap-3">
//                 <Button variant="outline" size="sm">
//                   <Upload className="w-4 h-4 mr-2" /> Deploy to Power BI
//                 </Button>
//                 <Button size="sm">
//                   <Download className="w-4 h-4 mr-2" /> Download Dataset
//                 </Button>
//               </div>
//             </div>

//             {/* Stats Pills */}
//             <div className="flex flex-wrap gap-3">
//               <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">4 KPIs</span>
//               <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">6 Months Data</span>
//               <span className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium">5 Categories</span>
//               <span className="px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium">5 Regions</span>
//             </div>

//             {/* KPIs */}
//             <div>
//               <div className="flex items-center gap-2 mb-4">
//                 <TrendingUp className="w-5 h-5 text-primary" />
//                 <h3 className="font-semibold">Key Performance Indicators</h3>
//               </div>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {[
//                   { label: "Total Revenue", value: "$1.2M", change: "+12.5%", positive: true },
//                   { label: "Active Users", value: "15,230", change: "+8.2%", positive: true },
//                   { label: "Conversion Rate", value: "4.8%", change: "-1.1%", positive: false },
//                   { label: "Avg. Session", value: "3m 45s", change: "+5.0%", positive: true },
//                 ].map((kpi) => (
//                   <div key={kpi.label} className="bg-card border border-border rounded-xl p-5">
//                     <p className="text-sm text-muted-foreground">{kpi.label}</p>
//                     <p className="text-2xl font-bold mt-1">{kpi.value}</p>
//                     <p className={`text-sm mt-2 ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>
//                       {kpi.change}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Charts Row 1: Line + Pie */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Monthly Sales Trend - Line Chart */}
//               <div className="bg-card border border-border rounded-xl p-6">
//                 <h3 className="font-semibold mb-4">Monthly Sales Trend</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={monthlySalesData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="month" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Line type="monotone" dataKey="sales" stroke="#8884d8" />
//                     <Line type="monotone" dataKey="target" stroke="#82ca9d" />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Sales by Category - Pie Chart */}
//               <div className="bg-card border border-border rounded-xl p-6">
//                 <h3 className="font-semibold mb-4">Sales by Product Category</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <PieChart>
//                     <Pie
//                       data={categoryData}
//                       dataKey="value"
//                       nameKey="name"
//                       cx="50%"
//                       cy="50%"
//                       outerRadius={100}
//                       label
//                     >
//                       {categoryData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Charts Row 2: Table + Bar */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* Top Products - Table */}
//               <div className="bg-card border border-border rounded-xl p-6 overflow-auto">
//                 <h3 className="font-semibold mb-4">Top Performing Products</h3>
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="border-b">
//                       <th className="text-left py-3">Product Name</th>
//                       <th className="text-left py-3">Category</th>
//                       <th className="text-left py-3">Units Sold</th>
//                       <th className="text-left py-3">Revenue</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {productTableData.map((product) => (
//                       <tr key={product.name} className="border-b last:border-0">
//                         <td className="py-3">{product.name}</td>
//                         <td className="py-3">{product.category}</td>
//                         <td className="py-3">{product.units.toLocaleString()}</td>
//                         <td className="py-3">${product.revenue.toLocaleString()}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Users by Region - Bar Chart */}
//               <div className="bg-card border border-border rounded-xl p-6">
//                 <h3 className="font-semibold mb-4">User Demographics by Region</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={regionData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="region" />
//                     <YAxis />
//                     <Tooltip />
//                     <Legend />
//                     <Bar dataKey="users" fill="#8884d8" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </WorkflowLayout>
//     );
//   }

//   // FILE SELECTION + QUERY MODE
//   return (
//     <WorkflowLayout>
//       <div className="min-h-screen bg-background">
//         {/* Header */}
//         <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
//           <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
//             <div className="flex items-center gap-5">
//               <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
//                 <BarChart3 className="w-8 h-8 text-primary" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">Power BI Dashboard Generator</h1>
//                 <p className="text-muted-foreground">Select data → Ask anything → Get instant dashboard</p>
//               </div>
//             </div>
//            <Button
//               variant="outline"
//               onClick={() => navigate("/workflow/path-selection")}
//               className="gap-2"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Path Selection
//             </Button>
//           </div>
//         </div>

//         <div className="max-w-6xl mx-auto px-6 py-8 space-y-10">
//           {/* File Selection - Your Exact Card + Radio UI */}
//           <div>
//             <div className="flex justify-between items-center mb-5">
//               <h2 className="text-lg font-semibold">Select Data Source</h2>
//               <span className="text-sm text-muted-foreground">{availableFiles.length} files available</span>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {availableFiles.map((file) => {
//                 const isSelected = selectedFile?.id === file.id;
//                 const isDisabled = selectedFile && !isSelected;
//                 const isCsv = file.type === "csv";
//                 const isExcel = file.type === "excel";

//                 return (
//                   <div
//                     key={file.id}
//                     onClick={() => {
//                       if (isDisabled) return;
//                       setSelectedFile(isSelected ? null : file);
//                     }}
//                     className={`
//                       relative rounded-xl border p-6 transition-all
//                       ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor h-pointer hover:border-cyan-500/50 hover:bg-muted/10"}
//                       ${isSelected ? "border-cyan-500 bg-cyan-500/5 ring-2 ring-cyan-500/20" : "border-border"}
//                     `}
//                   >
//                     {/* Radio Circle */}
//                     <div className="absolute top-5 right-5">
//                       <div className={`
//                         w-5 h-5 rounded-full border-2 flex items-center justify-center
//                         ${isSelected ? "border-cyan-500 bg-cyan-500" : "border-muted-foreground"}
//                       `}>
//                         {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4">
//                       <div className={`
//                         p-3 rounded-lg
//                         ${isCsv ? "bg-emerald-500/20" : isExcel ? "bg-green-500/20" : "bg-amber-500/20"}
//                       `}>
//                         <FileText className={`
//                           w-6 h-6
//                           ${isCsv ? "text-emerald-400" : isExcel ? "text-green-400" : "text-amber-400"}
//                         `} />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-foreground">{file.name}</h3>
//                         <p className="text-sm text-muted-foreground">
//                           {new Date(file.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* AI Query Input */}
//           {selectedFile && (
//             <div className="space-y-4">
//               <h2 className="text-2xl font-bold flex items-left  gap-3">
//                   <Sparkles className="w-7 h-7 text-primary" />
//                   What insights do you want?
//                 </h2>
//               {/* <h2 className="text-lg font-semibold">What insights do you want?</h2> */}
//               <div className="rounded-xl border border-border bg-card p-6">
//                 <Textarea
//                   placeholder="e.g. Show me sales trends by region and product category with KPIs"
//                   value={query}
//                   onChange={(e) => setQuery(e.target.value)}
//                   className="min-h-30 resize-none"
//                 />
//                 <div className="flex justify-end mt-4">
//                   <Button onClick={handleGenerate} size="lg" disabled={isGenerating}>
//                     {isGenerating ? (
//                       <>
//                         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                         Generating Dashboard...
//                       </>
//                     ) : (
//                       <>
//                         <Play className="w-4 h-4 mr-2" />
//                         Generate Dashboard
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div> 

//         {/* Loading Overlay */}
//         {isGenerating && (
//           <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
//             <div className="text-center">
//               <div className="relative">
//                 <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
//                 <BarChart3 className="w-10 h-10 text-primary absolute inset-0 m-auto" />
//               </div>
//               <p className="mt-8 text-xl font-medium">Generating your dashboard...</p>
//               <p className="text-muted-foreground">Analyzing patterns and building visualizations</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </WorkflowLayout>
//   );
// }


// src/pages/PowerBIDashboard.tsx
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { FileSelectionStep } from "@/components/dashboard/FileSelectionStep";
import { DashboardPreview } from "@/components/dashboard/DashboardPreview";
import { BarChart3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function PowerBIDashboard() {
  const navigate = useNavigate();
  const [previewData, setPreviewData] = useState<{ file: any; query: string } | null>(null);

  // ──────── DASHBOARD PREVIEW MODE ────────
  if (previewData) {
    return (
      <WorkflowLayout>
        <DashboardPreview
          file={previewData.file}
          query={previewData.query}
          // This goes back to FileSelectionStep inside this page
          onBack={() => setPreviewData(null)}
        />
      </WorkflowLayout>
    );
  }

  // ──────── FILE SELECTION + QUERY MODE ────────
  return (
    <WorkflowLayout>
      <div className="min-h-screen bg-background">
        {/* Main Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <BarChart3 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Power BI Dashboard 
                </h1>
                {/* <p className="text-muted-foreground">
                  Select data → Ask anything → Get instant dashboard
                </p> */}
              </div>
            </div>

            {/* This button leaves the entire Power BI page */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/workflow/path-selection")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Path Selection
            </Button>
          </div>
        </div>

        {/* File Selection + Insight Input */}
        <FileSelectionStep
          onGenerate={(file, query) => setPreviewData({ file, query })}
        />
      </div>
    </WorkflowLayout>
  );
}