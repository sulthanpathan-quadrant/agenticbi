// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ArrowLeft, Clock, Upload } from "lucide-react";
// import { toast } from "sonner";

// interface WorkflowSteps {
//   dqRules: "skipped" | "executed";
//   ner: "skipped" | "executed";
//   businessLogic: "skipped" | "executed";
//   dataTransformations: "skipped" | "executed";
// }

// const ScheduleJob = () => {
//   const navigate = useNavigate();
//   const [triggerType, setTriggerType] = useState<"schedule" | "file">("schedule");
//   const [frequency, setFrequency] = useState("");
//   const [time, setTime] = useState("");
//   const [jobName, setJobName] = useState("");
//   const [workflowSteps, setWorkflowSteps] = useState<WorkflowSteps>({
//     dqRules: "skipped",
//     ner: "skipped",
//     businessLogic: "skipped",
//     dataTransformations: "skipped",
//   });

//   useEffect(() => {
//     // Get job name from ETL page
//     const etlJobName = localStorage.getItem("currentJobName");
//     const etlTableName = localStorage.getItem("etlTableName");
//     if (etlJobName) {
//       setJobName(etlJobName);
//     } else if (etlTableName) {
//       setJobName(`Job_${etlTableName}`);
//     }

//     // Get workflow steps status
//     const dqStatus = localStorage.getItem("dqRulesStatus");
//     const nerStatus = localStorage.getItem("nerStatus");
//     const blStatus = localStorage.getItem("businessLogicStatus");
    
//     setWorkflowSteps({
//       dqRules: dqStatus === "executed" ? "executed" : "skipped",
//       ner: nerStatus === "executed" ? "executed" : "skipped",
//       businessLogic: blStatus === "executed" ? "executed" : "skipped",
//       dataTransformations: "executed", // Default to executed for ETL
//     });
//   }, []);

//   const scheduleJob = () => {
//     if (!frequency && triggerType === "schedule") {
//       toast.error("Please select a frequency");
//       return;
//     }

//     const savedJobs = localStorage.getItem("jobs");
//     const jobs = savedJobs ? JSON.parse(savedJobs) : [];

//     const newJob = {
//       id: `job-${Date.now()}`,
//       name: jobName || `Job_${new Date().toISOString().split("T")[0]}`,
//       category: "Unknown",
//       createdAt: new Date().toLocaleString("en-US", {
//         month: "short",
//         day: "numeric",
//         year: "numeric",
//         hour: "numeric",
//         minute: "2-digit",
//         hour12: true,
//       }),
//       lastRun: "-",
//       status: "Created" as const,
//       steps: workflowSteps,
//       sourceFilePath: "s3://ingestion-01/data.csv",
//       destinationFilePath: "s3://output-bucket/data.csv",
//       triggerType: triggerType === "schedule" ? "SCHEDULE" : "FILE_TRIGGER",
//       scheduleDetails: triggerType === "schedule" ? `${frequency} at ${time || "00:00"}` : "On file upload",
//     };

//     localStorage.setItem("jobs", JSON.stringify([...jobs, newJob]));
    
//     // Clean up temporary localStorage items
//     localStorage.removeItem("currentJobName");
//     localStorage.removeItem("etlTableName");
//     localStorage.removeItem("businessLogicStatus");
//     localStorage.removeItem("dqRulesStatus");
//     localStorage.removeItem("nerStatus");
    
//     toast.success("Job scheduled successfully!");
//     navigate("/jobs");
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <div className="container mx-auto px-6 py-8 max-w-2xl">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold mb-2">Schedule Job</h1>
//           <p className="text-muted-foreground">Configure when and how your job should run</p>
//         </div>

//         <Card className="p-6">
//           <p className="text-muted-foreground mb-6">
//             Choose how you want to trigger your job execution
//           </p>

//           {/* Job Name */}
//           <div className="mb-6">
//             <Label className="mb-2 block">Job Name</Label>
//             <Input
//               value={jobName}
//               onChange={(e) => setJobName(e.target.value)}
//               placeholder="Job name set in ETL page"
//               className="bg-muted/50"
//             />
//           </div>

//           {/* Trigger Type */}
//           <RadioGroup
//             value={triggerType}
//             onValueChange={(value) => setTriggerType(value as "schedule" | "file")}
//             className="mb-6"
//           >
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="schedule" id="schedule" />
//               <Label htmlFor="schedule" className="flex items-center gap-2 cursor-pointer">
//                 <Clock className="w-4 h-4" />
//                 Time-based Schedule
//               </Label>
//             </div>
//             <div className="flex items-center space-x-2">
//               <RadioGroupItem value="file" id="file" />
//               <Label htmlFor="file" className="flex items-center gap-2 cursor-pointer">
//                 <Upload className="w-4 h-4" />
//                 File Upload Trigger
//               </Label>
//             </div>
//           </RadioGroup>

//           {triggerType === "schedule" && (
//             <div className="grid grid-cols-2 gap-4 mb-6">
//               <div>
//                 <Label className="mb-2 block">Frequency</Label>
//                 <Select value={frequency} onValueChange={setFrequency}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select frequency" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="daily">Daily</SelectItem>
//                     <SelectItem value="weekly">Weekly</SelectItem>
//                     <SelectItem value="monthly">Monthly</SelectItem>
//                     <SelectItem value="hourly">Hourly</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div>
//                 <Label className="mb-2 block">Time</Label>
//                 <div className="relative">
//                   <Input
//                     type="time"
//                     value={time}
//                     onChange={(e) => setTime(e.target.value)}
//                     className="pr-10"
//                   />
//                   <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//                 </div>
//               </div>
//             </div>
//           )}

//           {triggerType === "file" && (
//             <div className="mb-6 p-4 bg-muted/50 rounded-lg">
//               <p className="text-sm text-muted-foreground">
//                 The job will automatically trigger when a new file is uploaded to the configured source location.
//               </p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-4">
//             <Button
//               variant="outline"
//               className="flex-1"
//               onClick={() => navigate("/workflow/path-selection")}
//             >
//               Cancel
//             </Button>
//             <Button
//               className="flex-1"
//               onClick={scheduleJob}
//             >
//               Schedule Job
//             </Button>
//           </div>
//         </Card>

//         {/* Back Button */}
//         <Button
//           variant="ghost"
//           className="mt-6"
//           onClick={() => navigate("/workflow/path-selection")}
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ScheduleJob;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Clock, Upload } from "lucide-react";
import { toast } from "sonner";

interface WorkflowSteps {
  dqRules: "skipped" | "executed";
  ner: "skipped" | "executed";
  businessLogic: "skipped" | "executed";
  dataTransformations: "skipped" | "executed";
}

const ScheduleJob = () => {
  const navigate = useNavigate();
  const [triggerType, setTriggerType] = useState<"schedule" | "file">("schedule");
  const [frequency, setFrequency] = useState("");
  const [time, setTime] = useState("");
  const [jobName, setJobName] = useState("");
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowSteps>({
    dqRules: "skipped",
    ner: "skipped",
    businessLogic: "skipped",
    dataTransformations: "skipped",
  });

  useEffect(() => {
    const etlJobName = localStorage.getItem("currentJobName");
    const etlTableName = localStorage.getItem("etlTableName");

    if (etlJobName) setJobName(etlJobName);
    else if (etlTableName) setJobName(`Job_${etlTableName}`);

    setWorkflowSteps({
      dqRules: localStorage.getItem("dqRulesStatus") === "executed" ? "executed" : "skipped",
      ner: localStorage.getItem("nerStatus") === "executed" ? "executed" : "skipped",
      businessLogic: localStorage.getItem("businessLogicStatus") === "executed" ? "executed" : "skipped",
      dataTransformations: "executed",
    });
  }, []);

  const scheduleJob = () => {
    if (!frequency && triggerType === "schedule") {
      toast.error("Please select a frequency");
      return;
    }

    const savedJobs = localStorage.getItem("jobs");
    const jobs = savedJobs ? JSON.parse(savedJobs) : [];

    const newJob = {
      id: `job-${Date.now()}`,
      name: jobName || `Job_${new Date().toISOString().split("T")[0]}`,
      category: "Unknown",
      createdAt: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      lastRun: "-",
      status: "Created" as const,
      steps: workflowSteps,
      sourceFilePath: "s3://ingestion-01/data.csv",
      destinationFilePath: "s3://output-bucket/data.csv",
      triggerType: triggerType === "schedule" ? "SCHEDULE" : "FILE_TRIGGER",
      scheduleDetails:
        triggerType === "schedule"
          ? `${frequency} at ${time || "00:00"}`
          : "On file upload",
    };

    localStorage.setItem("jobs", JSON.stringify([...jobs, newJob]));

    localStorage.removeItem("currentJobName");
    localStorage.removeItem("etlTableName");
    localStorage.removeItem("businessLogicStatus");
    localStorage.removeItem("dqRulesStatus");
    localStorage.removeItem("nerStatus");

    toast.success("Job scheduled successfully!");
    navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-10 max-w-2xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Schedule Job</h1>
          <p className="text-muted-foreground mt-1">
            Configure how and when your job should run.
          </p>
        </div>

        {/* MAIN CARD */}
        <Card className="p-8 rounded-2xl shadow-sm border bg-card">

          {/* JOB NAME */}
          <div className="space-y-2 mb-6">
            <Label>Job Name</Label>
            <Input 
              value={jobName}
              onChange={(e) => setJobName(e.target.value)}
              placeholder="Enter job name"
              className="bg-muted/40 rounded-lg"
            />
          </div>

          {/* TRIGGER TYPE */}
          <div className="mb-6 space-y-3">
            <Label>Trigger Type</Label>

            <RadioGroup
              value={triggerType}
              onValueChange={(value) => setTriggerType(value as "schedule" | "file")}
              className="grid grid-cols-1 gap-3"
            >
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule" className="flex items-center gap-2 cursor-pointer">
                  <Clock className="w-4 h-4" /> Time-based Schedule
                </Label>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition">
                <RadioGroupItem value="file" id="file" />
                <Label htmlFor="file" className="flex items-center gap-2 cursor-pointer">
                  <Upload className="w-4 h-4" /> File Upload Trigger
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* SCHEDULE FIELDS */}
          {triggerType === "schedule" && (
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="rounded-lg bg-muted/40">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-lg bg-muted/40 pr-10"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}

          {/* FILE TRIGGER INFO */}
          {triggerType === "file" && (
            <div className="mb-6 p-4 rounded-lg bg-muted/40 border text-sm">
              This job will automatically trigger when a new file is uploaded.
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg"
              onClick={() => navigate("/workflow/path-selection")}
            >
              Cancel
            </Button>

            <Button 
              className="flex-1 rounded-lg"
              onClick={scheduleJob}
            >
              Schedule Job
            </Button>
          </div>
        </Card>

        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          className="mt-6"
          onClick={() => navigate("/workflow/path-selection")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    </div>
  );
};

export default ScheduleJob;
