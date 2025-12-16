import { useState } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Edit, Eye, Network, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

export default function DataModeling() {
  const [activeView, setActiveView] = useState<"star" | "er">("star");
  const [selectedSchema, setSelectedSchema] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [schemaData, setSchemaData] = useState([
    { columnName: "sale_id", dataType: "INTEGER", example: "100001", key: "PK" },
    { columnName: "customer_id", dataType: "INTEGER", example: "5234", key: "FK" },
    { columnName: "product_id", dataType: "INTEGER", example: "8821", key: "FK" },
    { columnName: "region_id", dataType: "INTEGER", example: "102", key: "FK" },
    { columnName: "sale_amount", dataType: "DECIMAL", example: "1,458.00", key: "" },
    { columnName: "sale_date", dataType: "DATE", example: "2024-03-15", key: "" },
  ]);
  const navigate = useNavigate();

  const handleSchemaClick = (schemaName: string) => {
    setSelectedSchema(schemaName);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCellChange = (index: number, field: string, value: string) => {
    const newData = [...schemaData];
    newData[index] = { ...newData[index], [field]: value };
    setSchemaData(newData);
  };

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Automated Data Modeling</h1>
          <p className="text-muted-foreground">
            AI-generated star schema & entity relationships from your data sources
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="mb-6">
          <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value as "star" | "er")} className="justify-start">
            <ToggleGroupItem value="star" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <Database className="mr-2 h-4 w-4" />
              Schema
            </ToggleGroupItem>
            <ToggleGroupItem value="er" className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground">
              <Network className="mr-2 h-4 w-4" />
              ER Graph
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        {/* Star Schema View */}
        {activeView === "star" && (
          <div className="border border-border rounded-lg p-8 bg-card mb-6 min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Database className="h-5 w-5" />
                Star Schema
              </h2>
            </div>

            {/* Star Schema Visualization */}
            <div className="relative h-[450px] flex items-center justify-center">
              {/* Dimension Table: dim_customer (top left) */}
              <div 
                className="absolute top-0 left-20 border border-blue-500 rounded-lg p-4 bg-card/50 w-48 cursor-pointer hover:bg-card transition-colors"
                onClick={() => handleSchemaClick("dim_customer")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">dim_customer</span>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>customer_id 🔑</div>
                  <div>name</div>
                  <div>email</div>
                  <div className="text-xs text-muted-foreground/70 mt-2">50,000 rows</div>
                </div>
              </div>

              {/* Dimension Table: dim_product (top right) */}
              <div 
                className="absolute top-0 right-20 border border-blue-500 rounded-lg p-4 bg-card/50 w-48 cursor-pointer hover:bg-card transition-colors"
                onClick={() => handleSchemaClick("dim_product")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">dim_product</span>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>product_id 🔑</div>
                  <div>name</div>
                  <div>category</div>
                  <div className="text-xs text-muted-foreground/70 mt-2">5,000 rows</div>
                </div>
              </div>

              {/* Fact Table: fact_sales (center) */}
              <div 
                className="border-2 border-cyan-500 rounded-lg p-4 bg-cyan-950/30 w-56 z-10 cursor-pointer hover:bg-cyan-950/40 transition-colors"
                onClick={() => handleSchemaClick("fact_sales")}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-foreground">fact_sales</span>
                  <Badge className="text-xs bg-cyan-600">FACT</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>sale_id 🔑</div>
                  <div>customer_id 🔗</div>
                  <div>product_id 🔗</div>
                  <div>region_id 🔗</div>
                  <div className="border-t border-border my-2 pt-2">
                    <div>sale_amount</div>
                    <div>sale_date</div>
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-2">200,000 rows</div>
                </div>
              </div>

              {/* Dimension Table: dim_region (bottom) */}
              <div 
                className="absolute bottom-0 left-1/2 -translate-x-1/2 border border-blue-500 rounded-lg p-4 bg-card/50 w-48 cursor-pointer hover:bg-card transition-colors"
                onClick={() => handleSchemaClick("dim_region")}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-foreground">dim_region</span>
                  <Badge variant="outline" className="text-xs">DIM</Badge>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>region_id 🔑</div>
                  <div>country</div>
                  <div>state</div>
                  <div className="text-xs text-muted-foreground/70 mt-2">150 rows</div>
                </div>
              </div>

              {/* Relationship Lines - SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                {/* Line from fact_sales to dim_customer */}
                <line x1="50%" y1="50%" x2="25%" y2="15%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" />
                <text x="30%" y="28%" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="500">1:N</text>

                {/* Line from fact_sales to dim_product */}
                <line x1="50%" y1="50%" x2="75%" y2="15%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" />
                <text x="67%" y="28%" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="500">1:N</text>

                {/* Line from fact_sales to dim_region */}
                <line x1="50%" y1="50%" x2="50%" y2="85%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" />
                <text x="52%" y="68%" fill="hsl(var(--muted-foreground))" fontSize="11" fontWeight="500">1:N</text>
              </svg>
            </div>
          </div>
        )}

        {/* ER Diagram View */}
        {activeView === "er" && (
          <div className="border border-border rounded-lg p-8 bg-card mb-6 min-h-[500px]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Network className="h-5 w-5" />
                Entity Relationship Graph
              </h2>
            </div>

            {/* ER Graph Visualization */}
            <div className="relative h-[450px] flex items-center justify-center">
              {/* Node: dim_customer (top left) */}
              <div className="absolute top-12 left-12 border border-purple-500 rounded-lg p-3 bg-purple-950/20 w-40 cursor-pointer hover:bg-purple-950/30 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">dim_customer</div>
                <div className="text-xs text-muted-foreground">3 columns</div>
                <div className="text-xs text-muted-foreground">50,000 rows</div>
                <div className="text-xs text-purple-400 mt-1">Null: 2%</div>
              </div>

              {/* Node: dim_product (top right) */}
              <div className="absolute top-12 right-12 border border-purple-500 rounded-lg p-3 bg-purple-950/20 w-40 cursor-pointer hover:bg-purple-950/30 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">dim_product</div>
                <div className="text-xs text-muted-foreground">3 columns</div>
                <div className="text-xs text-muted-foreground">5,000 rows</div>
                <div className="text-xs text-purple-400 mt-1">Null: 1%</div>
              </div>

              {/* Node: fact_sales (center) */}
              <div className="border-2 border-cyan-500 rounded-lg p-3 bg-cyan-950/30 w-40 z-10 cursor-pointer hover:bg-cyan-950/40 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">fact_sales</div>
                <div className="text-xs text-muted-foreground">6 columns</div>
                <div className="text-xs text-muted-foreground">200,000 rows</div>
                <div className="text-xs text-cyan-400 mt-1">Null: 0%</div>
              </div>

              {/* Node: Customer (bottom left) */}
              <div className="absolute bottom-20 left-24 border border-purple-500 rounded-lg p-3 bg-purple-950/20 w-40 cursor-pointer hover:bg-purple-950/30 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">Customer</div>
                <div className="text-xs text-muted-foreground">12 columns</div>
                <div className="text-xs text-muted-foreground">50,000 rows</div>
                <div className="text-xs text-purple-400 mt-1">Null: 3%</div>
              </div>

              {/* Node: dim_region (bottom center) */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 border border-purple-500 rounded-lg p-3 bg-purple-950/20 w-40 cursor-pointer hover:bg-purple-950/30 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">dim_region</div>
                <div className="text-xs text-muted-foreground">3 columns</div>
                <div className="text-xs text-muted-foreground">150 rows</div>
                <div className="text-xs text-purple-400 mt-1">Null: 0%</div>
              </div>

              {/* Node: Order (bottom right) */}
              <div className="absolute bottom-20 right-24 border border-purple-500 rounded-lg p-3 bg-purple-950/20 w-40 cursor-pointer hover:bg-purple-950/30 transition-colors">
                <div className="text-sm font-semibold text-foreground mb-1">Order</div>
                <div className="text-xs text-muted-foreground">8 columns</div>
                <div className="text-xs text-muted-foreground">75,000 rows</div>
                <div className="text-xs text-purple-400 mt-1">Null: 1%</div>
              </div>

              {/* Relationship Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <line x1="20%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="32%" y="35%" fill="hsl(var(--muted-foreground))" fontSize="10">1:N (customer_id)</text>

                <line x1="80%" y1="25%" x2="50%" y2="50%" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="62%" y="35%" fill="hsl(var(--muted-foreground))" fontSize="10">1:N (product_id)</text>

                <line x1="50%" y1="50%" x2="50%" y2="75%" stroke="hsl(var(--primary))" strokeWidth="2" />
                <text x="52%" y="65%" fill="hsl(var(--muted-foreground))" fontSize="10">1:N (region_id)</text>

                <line x1="28%" y1="75%" x2="20%" y2="30%" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.6" />
                <text x="20%" y="55%" fill="hsl(var(--muted-foreground))" fontSize="10">1:N</text>

                <line x1="72%" y1="75%" x2="80%" y2="30%" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" opacity="0.6" />
              </svg>
            </div>
          </div>
        )}

        {/* Schema Details Section */}
        {selectedSchema && (
          <div className="border border-border rounded-lg p-6 bg-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Database className="h-5 w-5" />
                {selectedSchema} - Schema Details
              </h3>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                )}
              </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
              <div>
                <span className="text-muted-foreground">Rows:</span>
                <span className="ml-2 font-semibold text-foreground">200,000</span>
              </div>
              <div>
                <span className="text-muted-foreground">Columns:</span>
                <span className="ml-2 font-semibold text-foreground">6</span>
              </div>
            </div>

            {/* Table View */}
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Example</TableHead>
                    <TableHead>Key</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemaData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={row.columnName} 
                            onChange={(e) => handleCellChange(index, 'columnName', e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          row.columnName
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={row.dataType} 
                            onChange={(e) => handleCellChange(index, 'dataType', e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          row.dataType
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditing ? (
                          <Input 
                            value={row.example} 
                            onChange={(e) => handleCellChange(index, 'example', e.target.value)}
                            className="h-8"
                          />
                        ) : (
                          row.example
                        )}
                      </TableCell>
                      <TableCell>
                        {row.key && <Badge variant="secondary" className="text-xs">{row.key}</Badge>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Bottom Action Buttons */}
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/workflow/landing-zone")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={() => navigate("/workflow/data-preview")}>
            Next to Data Preview
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
