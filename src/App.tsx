 
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LearnMore from "./pages/LearnMore";
import Auth from "./pages/Auth";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EditJob from "./pages/EditJob";
import Pipelines from "./pages/Pipelines";
import CreatePipeline from "./pages/CreatePipeline";
import ScheduleJob from "./pages/ScheduleJob";
import DataIngestion from "./pages/DataIngestion";
import LandingZone from "./pages/LandingZone";
import DataModeling from "./pages/DataModeling";
import DataPreview from "./pages/DataPreview";
import DataCreation from "./pages/DataCreation";
import DataQuality from "./pages/DataQuality";
import NER from "./pages/NER";
import BusinessLogic from "./pages/BusinessLogic";
import PathSelection from "./pages/PathSelection";
import ETLOutput from "./pages/ETLOutput";
import PowerBIDashboard from "./pages/PowerBIDashboard";
import AutoMLDashboard from "./pages/AutoMLDashboard";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "@/components/ThemeProvider";
 
// New: Force dark mode wrapper for landing pages
const LandingLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="forced-dark">
    {children}
  </div>
);
 
const queryClient = new QueryClient();
 
const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        {/* Home & Learn More: Always dark, ignore global theme */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <Index />
            </LandingLayout>
          }
        />
        <Route
          path="/learn-more"
          element={
            <LandingLayout>
              <LearnMore />
            </LandingLayout>
          }
        />
 
        {/* All App/Dashboard Routes: Theme toggle works */}
        <Route
          path="/*"
          element={
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/job-details/:id" element={<JobDetails />} />
                  <Route path="/edit-job/:id" element={<EditJob />} />
                  <Route path="/pipelines" element={<Pipelines />} />
                  <Route path="/create-pipeline" element={<CreatePipeline />} />
                  <Route path="/edit-pipeline/:id" element={<CreatePipeline />} />
                  <Route path="/schedule-job" element={<ScheduleJob />} />
                  <Route path="/workflow/data-ingestion" element={<DataIngestion />} />
                  <Route path="/workflow/landing-zone" element={<LandingZone />} />
                  <Route path="/workflow/data-modeling" element={<DataModeling />} />
                  <Route path="/workflow/data-preview" element={<DataPreview />} />
                  <Route path="/workflow/data-creation" element={<DataCreation />} />
                  <Route path="/workflow/data-quality" element={<DataQuality />} />
                  <Route path="/workflow/ner" element={<NER />} />
                  <Route path="/workflow/business-logic" element={<BusinessLogic />} />
                  <Route path="/workflow/path-selection" element={<PathSelection />} />
                  <Route path="/workflow/etl-output" element={<ETLOutput />} />
                  <Route path="/workflow/powerbi-dashboard" element={<PowerBIDashboard />} />
                  <Route path="/workflow/automl-dashboard" element={<AutoMLDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </ThemeProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>
);
 
export default App;
 