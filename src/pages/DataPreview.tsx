import { useState } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Table as TableIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function DataPreview() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sample table data
  const tables = {
    fact_sales: {
      type: "FACT",
      rowCount: "200,000",
      columns: ["sale_id", "customer_id", "product_id", "region_id", "sale_amount", "sale_date"],
      data: [
        { sale_id: 100001, customer_id: 5234, product_id: 8821, region_id: 102, sale_amount: "1,458.00", sale_date: "2024-03-15" },
        { sale_id: 100002, customer_id: 5235, product_id: 8822, region_id: 103, sale_amount: "2,340.00", sale_date: "2024-03-16" },
        { sale_id: 100003, customer_id: 5236, product_id: 8823, region_id: 104, sale_amount: "980.50", sale_date: "2024-03-17" },
        { sale_id: 100004, customer_id: 5237, product_id: 8824, region_id: 105, sale_amount: "3,120.00", sale_date: "2024-03-18" },
        { sale_id: 100005, customer_id: 5238, product_id: 8825, region_id: 106, sale_amount: "1,750.25", sale_date: "2024-03-19" },
      ],
    },
    dim_customer: {
      type: "DIM",
      rowCount: "50,000",
      columns: ["customer_id", "name", "email", "city", "country"],
      data: [
        { customer_id: 5234, name: "John Smith", email: "john.smith@example.com", city: "New York", country: "USA" },
        { customer_id: 5235, name: "Emma Johnson", email: "emma.j@example.com", city: "London", country: "UK" },
        { customer_id: 5236, name: "Michael Chen", email: "m.chen@example.com", city: "Singapore", country: "Singapore" },
        { customer_id: 5237, name: "Sarah Williams", email: "sarah.w@example.com", city: "Sydney", country: "Australia" },
        { customer_id: 5238, name: "David Brown", email: "d.brown@example.com", city: "Toronto", country: "Canada" },
      ],
    },
    dim_product: {
      type: "DIM",
      rowCount: "5,000",
      columns: ["product_id", "name", "category", "price", "stock"],
      data: [
        { product_id: 8821, name: "Laptop Pro X1", category: "Electronics", price: "$1,299", stock: 45 },
        { product_id: 8822, name: "Wireless Mouse", category: "Accessories", price: "$29", stock: 230 },
        { product_id: 8823, name: "USB-C Hub", category: "Accessories", price: "$49", stock: 120 },
        { product_id: 8824, name: "Monitor 27inch", category: "Electronics", price: "$399", stock: 67 },
        { product_id: 8825, name: "Keyboard RGB", category: "Accessories", price: "$89", stock: 156 },
      ],
    },
    dim_region: {
      type: "DIM",
      rowCount: "150",
      columns: ["region_id", "country", "state", "region_name"],
      data: [
        { region_id: 102, country: "USA", state: "California", region_name: "West Coast" },
        { region_id: 103, country: "USA", state: "New York", region_name: "East Coast" },
        { region_id: 104, country: "UK", state: "England", region_name: "Southeast" },
        { region_id: 105, country: "Australia", state: "NSW", region_name: "Pacific" },
        { region_id: 106, country: "Canada", state: "Ontario", region_name: "Central" },
      ],
    },
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Data Preview</h1>
          <p className="text-muted-foreground">
            Preview table data from your modeled schema
          </p>
        </div>

        {/* Tables Display */}
        <div className="border border-border rounded-lg p-8 bg-card mb-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-4">
              <Database className="h-5 w-5" />
              Available Tables
            </h2>
            <p className="text-sm text-muted-foreground mb-6">Click on a table name to preview its data</p>
          </div>

          {/* Tables Grid Layout */}
          <div className="relative min-h-[400px] flex items-center justify-center">
            {/* Relationship Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              {/* Line to dim_customer (top-left) */}
              <line x1="50%" y1="50%" x2="30%" y2="15%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5,5" />
              <text x="40%" y="30%" fill="hsl(var(--muted-foreground))" fontSize="12" className="font-medium">1:N</text>
              
              {/* Line to dim_product (top-right) */}
              <line x1="50%" y1="50%" x2="70%" y2="15%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5,5" />
              <text x="60%" y="30%" fill="hsl(var(--muted-foreground))" fontSize="12" className="font-medium">1:N</text>
              
              {/* Line to dim_region (bottom) */}
              <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="hsl(var(--border))" strokeWidth="2" strokeDasharray="5,5" />
              <text x="52%" y="70%" fill="hsl(var(--muted-foreground))" fontSize="12" className="font-medium">1:N</text>
            </svg>

            {/* Fact Table (Center) */}
            <div className="flex flex-col items-center relative z-10">
              <div
                className={`border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 w-64 cursor-pointer transition-all ${
                  selectedTable === "fact_sales" ? "ring-2 ring-cyan-400 bg-cyan-950/50" : "hover:bg-cyan-950/40"
                }`}
                onClick={() => setSelectedTable("fact_sales")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold text-foreground">fact_sales</span>
                  </div>
                  <Badge className="text-xs bg-cyan-600">FACT</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span className="font-medium">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span className="font-medium">200,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension Tables - Positioned around fact table */}
            <div className="absolute top-0 left-20 z-10">
              <div
                className={`border border-blue-500 rounded-lg p-4 bg-card/50 w-56 cursor-pointer transition-all ${
                  selectedTable === "dim_customer" ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"
                }`}
                onClick={() => setSelectedTable("dim_customer")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold text-foreground">dim_customer</span>
                  </div>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span className="font-medium">50,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-20 z-10">
              <div
                className={`border border-blue-500 rounded-lg p-4 bg-card/50 w-56 cursor-pointer transition-all ${
                  selectedTable === "dim_product" ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"
                }`}
                onClick={() => setSelectedTable("dim_product")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold text-foreground">dim_product</span>
                  </div>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span className="font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span className="font-medium">5,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
              <div
                className={`border border-blue-500 rounded-lg p-4 bg-card/50 w-56 cursor-pointer transition-all ${
                  selectedTable === "dim_region" ? "ring-2 ring-blue-400 bg-card" : "hover:bg-card"
                }`}
                onClick={() => setSelectedTable("dim_region")}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TableIcon className="h-4 w-4" />
                    <span className="text-sm font-semibold text-foreground">dim_region</span>
                  </div>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between">
                    <span>Columns:</span>
                    <span className="font-medium">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rows:</span>
                    <span className="font-medium">150</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Data Display */}
        {selectedTable && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TableIcon className="h-5 w-5" />
                {selectedTable} - Data Preview
              </h3>
              <Badge variant={tables[selectedTable as keyof typeof tables].type === "FACT" ? "default" : "outline"}>
                {tables[selectedTable as keyof typeof tables].type}
              </Badge>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Rows:</span>
                <span className="ml-2 font-semibold text-foreground">
                  {tables[selectedTable as keyof typeof tables].rowCount}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Columns:</span>
                <span className="ml-2 font-semibold text-foreground">
                  {tables[selectedTable as keyof typeof tables].columns.length}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Showing:</span>
                <span className="ml-2 font-semibold text-foreground">First 5 rows</span>
              </div>
            </div>

            {/* Data Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {tables[selectedTable as keyof typeof tables].columns.map((column) => (
                      <TableHead key={column}>{column}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables[selectedTable as keyof typeof tables].data.map((row, index) => (
                    <TableRow key={index}>
                      {tables[selectedTable as keyof typeof tables].columns.map((column) => (
                        <TableCell key={column}>{row[column as keyof typeof row]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/workflow/data-modeling")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate("/workflow/data-creation")}>
            Data Creation
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
