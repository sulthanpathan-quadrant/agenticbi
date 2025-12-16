import { useState } from "react";
import { WorkflowLayout } from "@/components/WorkflowLayout";
import { Button } from "@/components/ui/button";
import { Workflow, PieChart, Brain, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PathSelection() {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string>("Power BI Dashboard");

  const paths = [
    {
      id: "etl",
      title: "ETL Pipeline",
      description: "Prepare and export the data for use in other systems or data warehouses.",
      icon: Workflow,
      route: "/workflow/etl-output",
    },
    {
      id: "powerbi",
      title: "Power BI Dashboard",
      description: "Connect the data to Power BI for immediate visualization and reporting.",
      icon: PieChart,
      route: "/workflow/powerbi-dashboard",
    },
    {
      id: "aiml",
      title: "Auto AI/ML Model",
      description: "Use the data to train or run an automated machine learning model.",
      icon: Brain,
      route: "/workflow/automl-dashboard",
    },
  ];

  return (
    <WorkflowLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Choose Your Output Path
          </h1>
          <p className="text-muted-foreground text-lg">
            Select how you want to use your processed data.
          </p>
        </div>

        {/* Path Cards */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {paths.map((path) => {
            const Icon = path.icon;
            const isSelected = selectedPath === path.title;

            return (
              <div
                key={path.id}
                onClick={() => {
                  setSelectedPath(path.title);
                  navigate(path.route);
                }}
                className={`border rounded-lg p-8 cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-muted/30"
                }`}
              >
                <div className="mb-6">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <Icon className={`h-7 w-7 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {path.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {path.description}
                </p>
              </div>
              );
            })}
          </div>

        {/* Bottom Navigation */}
        <div className="flex items-center justify-between pt-8 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/workflow/business-logic")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button size="lg">
            Continue
          </Button>
        </div>
      </div>
    </WorkflowLayout>
  );
}
