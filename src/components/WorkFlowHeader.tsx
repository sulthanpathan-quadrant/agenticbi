import { ArrowLeft, Bell, UserCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";


export function WorkflowHeader() {
    const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 h-16 w-full bg-card border-b border-border">
      <div className="h-full flex items-center justify-between px-6">
        
        {/* Left: Title */}
        <div>
          <h1 className="text-lg font-bold text-foreground">
            Data Platform
          </h1>
          <p className="text-xs text-muted-foreground">
            Workflow
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>     
        </div>
      </div>
    </header>
  );
}
