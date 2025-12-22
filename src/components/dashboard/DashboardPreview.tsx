// import { Button } from "@/components/ui/button";
// import { ArrowLeft, Upload, Download, BarChart3, TrendingUp, FileText, MessageSquare } from "lucide-react";
// import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

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

// const pieColors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#a78bfa", "#c4b5fd"];

// interface DashboardPreviewProps {
//   file: { name: string };
//   query: string;
//   onBack: () => void; // Goes back to FileSelectionStep
// }

// export function DashboardPreview({ file, query, onBack }: DashboardPreviewProps) {
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
//         <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
//           {/* Left: Dashboard Preview Title (clickable back) */}
//           <button
//             onClick={onBack}
//             className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
//           >
//             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
//               <BarChart3 className="w-5 h-5 text-primary" />
//             </div>
//             <span className="text-lg font-semibold text-foreground">
//               Dashboard Preview
//             </span>
//           </button>

//           {/* Right: Simple "Back" button → goes to FileSelectionStep */}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onBack}   // This now goes back to FileSelectionStep
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back
//           </Button>
//         </div>
//       </div>

//       {/* Dashboard Content */}
//       <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">

//         {/* Source + Query */}
//         <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
//           <div className="space-y-4">
//             <div className="flex items-center gap-3">
//               <FileText className="w-5 h-5 text-primary" />
//               <span className="text-xs uppercase tracking-wider text-muted-foreground">Source File</span>
//               <span className="font-medium text-foreground">{file.name}</span>
//             </div>
//             <div className="flex items-start gap-3">
//               <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
//               <span className="text-xs uppercase tracking-wider text-muted-foreground">Your Query</span>
//               <p className="text-sm text-foreground max-w-3xl leading-relaxed">{query}</p>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <Button variant="outline" size="sm">
//               <Upload className="w-4 h-4 mr-2" />
//               Deploy to Power BI
//             </Button>
//             <Button size="sm">
//               <Download className="w-4 h-4 mr-2" />
//               Download Dataset
//             </Button>
//           </div>
//         </div>

//         {/* Stats Pills */}
//         <div className="flex flex-wrap gap-3">
//           <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">4 KPIs</span>
//           <span className="px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-medium">6 Months Data</span>
//           <span className="px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 text-sm font-medium">5 Categories</span>
//           <span className="px-4 py-2 rounded-full bg-violet-500/10 text-violet-400 text-sm font-medium">5 Regions</span>
//         </div>

//         {/* KPIs */}
//         <div>
//           <div className="flex items-center gap-2 mb-5">
//             <TrendingUp className="w-6 h-6 text-primary" />
//             <h3 className="text-xl font-semibold">Key Performance Indicators</h3>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
//             {[
//               { label: "Total Revenue", value: "$1.2M", change: "+12.5%", positive: true },
//               { label: "Active Users", value: "15,230", change: "+8.2%", positive: true },
//               { label: "Conversion Rate", value: "4.8%", change: "-1.1%", positive: false },
//               { label: "Avg. Session Duration", value: "3m 45s", change: "+5.0%", positive: true },
//             ].map((kpi) => (
//               <div key={kpi.label} className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
//                 <p className="text-sm text-muted-foreground">{kpi.label}</p>
//                 <p className="text-3xl font-bold mt-2 text-foreground">{kpi.value}</p>
//                 <p className={`text-sm font-s mt-3 ${kpi.positive ? "text-emerald-500" : "text-red-500"}`}>
//                   {kpi.change} from last period
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Charts Row 1 */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
//             <ResponsiveContainer width="100%" height={320}>
//               <LineChart data={monthlySalesData}>
//                 <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
//                 <XAxis dataKey="month" stroke="#9ca3af" />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
//                 <Legend />
//                 <Line type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={4} dot={{ fill: "#06b6d4", r: 6 }} />
//                 <Line type="monotone" dataKey="target" stroke="#8b5cf6" strokeWidth={3} strokeDasharray="6 6" dot={false} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">Sales by Product Category</h3>
//             <ResponsiveContainer width="100%" height={320}>
//               <PieChart>
//                 <Pie
//                   data={categoryData}
//                   dataKey="value"
//                   nameKey="name"
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={110}
//                   label={({ name, value }) => `${name}: $${(value / 1000).toFixed(1)}k`}
//                   labelLine={false}
//                 >
//                   {categoryData.map((_, index) => (
//                     <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
//                 <Legend />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Charts Row 2 */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm">
//                 <thead className="border-b border-border/50">
//                   <tr>
//                     <th className="text-left py-3 font-medium">Product Name</th>
//                     <th className="text-left py-3 font-medium">Category</th>
//                     <th className="text-left py-3 font-medium text-right">Units Sold</th>
//                     <th className="text-left py-3 font-medium text-right">Revenue</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {productTableData.map((product) => (
//                     <tr key={product.name} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition">
//                       <td className="py-4 font-medium">{product.name}</td>
//                       <td className="py-4 text-muted-foreground">{product.category}</td>
//                       <td className="py-4 text-right">{product.units.toLocaleString()}</td>
//                       <td className="py-4 text-right font-semibold">${product.revenue.toLocaleString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
//             <h3 className="text-lg font-semibold mb-4">User Demographics by Region</h3>
//             <ResponsiveContainer width="100%" height={320}>
//               <BarChart data={regionData}>
//                 <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
//                 <XAxis dataKey="region" stroke="#9ca3af" />
//                 <YAxis stroke="#9ca3af" />
//                 <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }} />
//                 <Bar dataKey="users" fill="#3b82f6" radius={[12, 12, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

 
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Upload,
  Download,
  BarChart3,
  MessageSquare,
  FileText,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
 
interface GeneratedChart {
  chart_name: string;
  business_description: string;
  preferred_chart_type: string;
}
 
interface ApiResponse {
  table_name: string;
  total_rows: number;
  generated_charts: GeneratedChart[];
  chart_data: { [key: string]: any };
}
 
interface DashboardPreviewProps {
  filePath: string;
  query: string;
  apiResponse: ApiResponse;
  onBack: () => void;
}
 
const COLORS = ["#06b6d4", "#3b82f6", "#8b5cf6", "#a78bfa", "#c4b5fd", "#f87171", "#34d399", "#fbbf24", "#f59e0b", "#10b981"];
 
export function DashboardPreview({ filePath, query, apiResponse, onBack }: DashboardPreviewProps) {
  const { generated_charts = [], chart_data = {}, total_rows = 0, table_name = "Unknown" } = apiResponse;
 
  const renderChart = (chart: GeneratedChart) => {
    const entry = chart_data[chart.chart_name];
    if (!entry || !entry.data) {
      return (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No data available
        </div>
      );
    }
 
    const { chart_type, data } = entry;
 
    // === KPI / Card (Single Value) ===
    if (chart_type === "card" || chart_type === "kpi" || data.value !== undefined) {
      const value = data.value ?? 0;
      return (
        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl border border-primary/20">
          <p className="text-6xl md:text-7xl font-extrabold text-primary">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          <p className="mt-6 text-xl font-semibold text-foreground">{chart.chart_name}</p>
          <p className="mt-3 text-sm text-muted-foreground text-center px-6 max-w-md">
            {chart.business_description}
          </p>
        </div>
      );
    }
 
    // === Prepare Data ===
    let chartData: any[] = [];
    let seriesKeys: string[] = [];
 
    // Pie/Donut
    if ((chart_type === "pie" || chart_type === "donut") && data.labels && data.values) {
      chartData = data.labels.map((label: any, i: number) => ({
        name: String(label),
        value: Number(data.values[i]) || 0,
      }));
    }
    // Bar / Stacked Bar
    else if (data.x && data.series) {
      seriesKeys = Object.keys(data.series);
      chartData = (data.x || []).map((xVal: any, i: number) => {
        const row: any = { name: String(xVal) };
        seriesKeys.forEach((key) => {
          row[key] = Number(data.series[key][i]) || 0;
        });
        return row;
      });
    } else {
      return <div className="text-center text-muted-foreground py-12">No valid data format</div>;
    }
 
    if (chartData.length === 0) {
      return <div className="text-center text-muted-foreground py-12">No data</div>;
    }
 
    // === Pie / Donut Chart ===
    if (chart_type === "pie" || chart_type === "donut") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chart_type === "donut" ? 70 : 0}
              outerRadius={120}
              paddingAngle={2}
              label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
            >
              {chartData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      );
    }
 
    // === Bar / Stacked Bar Chart ===
    const isStacked = seriesKeys.length > 1;
 
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            angle={chartData.length > 6 ? -45 : 0}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#9ca3af" tickFormatter={(v) => v.toLocaleString()} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px" }}
            formatter={(v: number) => v.toLocaleString()}
          />
          <Legend verticalAlign="top" height={40} />
          {seriesKeys.map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[i % COLORS.length]}
              radius={[8, 8, 0, 0]}
              stackId={isStacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  };
 
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-semibold text-foreground">Dashboard Preview</span>
          </button>
 
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
 
      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* Source + Query */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Source File</span>
              <span className="font-medium text-foreground">{filePath}</span>
            </div>
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">Your Query</span>
              <p className="text-sm text-foreground max-w-3xl leading-relaxed">{query}</p>
            </div>
          </div>
 
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Deploy to Power BI
            </Button>
            <Button size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Dataset
            </Button>
          </div>
        </div>
 
        {/* Stats */}
        <div className="flex flex-wrap gap-4">
          <span className="px-5 py-3 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20">
            {generated_charts.length} Insights
          </span>
          <span className="px-5 py-3 rounded-full bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20">
            {total_rows.toLocaleString()} Rows
          </span>
          <span className="px-5 py-3 rounded-full bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20">
            Table: {table_name}
          </span>
        </div>
 
        {/* Charts Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary" />
            Generated Insights
          </h2>
 
          {generated_charts.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No insights generated.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {generated_charts.map((chart) => (
                <div
                  key={chart.chart_name}
                  className="bg-card border border-border rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold text-foreground mb-3">{chart.chart_name}</h3>
                  <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                    {chart.business_description}
                  </p>
                  <div className="h-96">{renderChart(chart)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
 