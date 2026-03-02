import { useState } from 'react';
import { PowerBIMicrosoftLogin } from './PowerBIMicrosoftLogin';
import { PowerBIWorkspaces } from './PowerBIWorkspaces';
import { PowerBIReport } from './PowerBIReport';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X } from 'lucide-react';
import { PowerBISignUp } from './PowerBISignUp';
import { Workflowheader } from '../WorkFlowHeader1';

type FlowStep = 'microsoft' | 'login' | 'signup' | 'workspaces' | 'report';

interface PowerBIFlowProps {
  fileName: string;
  onBack: () => void;
}

export function PowerBIFlow({ fileName, onBack }: PowerBIFlowProps) {
  const [step, setStep] = useState<FlowStep>('microsoft');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const [selectedWorkspaceName, setSelectedWorkspaceName] = useState('');

  const handleMigrate = (workspace: { name: string }) => {
    setSelectedWorkspaceName(workspace.name);
    setIsMigrating(true);
    setTimeout(() => {
      setIsMigrating(false);
      setShowSuccessDialog(true);
    }, 2500);
  };

  const handleViewReport = () => {
    setShowSuccessDialog(false);
    setStep('report');
  };

if (step === 'report') {
    return (
      <>
        <Workflowheader />
        <PowerBIReport
          workspaceName={selectedWorkspaceName}
          onBack={() => setStep('workspaces')}
        />
      </>
    );
  }

  if (step === 'workspaces') {
    return (
      <>
        <Workflowheader />
        <PowerBIWorkspaces
          onBack={() => setStep('microsoft')}  // ← adjusted to realistic flow
          onMigrate={handleMigrate}
          fileName={fileName}
          isMigrating={isMigrating}
        />
        <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
          {/* <DialogContent className="sm:max-w-sm text-center">
            <div className="flex flex-col items-center gap-5 py-10 px-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold text-foreground">Migration Done!</DialogTitle>
                <DialogDescription className="text-base text-muted-foreground">
                  Your report has been successfully migrated to{" "}
                  <span className="font-semibold text-foreground">"{selectedWorkspaceName}"</span> workspace.
                </DialogDescription>
              </DialogHeader>
              <Button
                onClick={handleViewReport}
                className="w-full h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold mt-3"
              >
                View Report
              </Button>
            </div>
          </DialogContent> */}
          <DialogContent className="sm:max-w-sm p-0 bg-card border-border rounded-2xl overflow-hidden">
  <DialogClose asChild>
    <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
      <X className="h-5 w-5" />
    </button>
  </DialogClose>

  <div className="flex flex-col items-center gap-5 py-8 px-6">
    <div className="w-15 h-15 rounded-full bg-primary/10 flex items-center justify-center">
      <CheckCircle2 className="w-8 h-8 text-primary" />
    </div>

    <DialogHeader className="space-y-3 text-center items-center">
      <DialogTitle className="text-2xl font-bold  text-foreground">Success!</DialogTitle>
      <DialogDescription className="text-muted-foreground">
        Report migrated to <span className="font-semibold text-foreground">"{selectedWorkspaceName}"</span>
      </DialogDescription>
    </DialogHeader>

    <Button
      onClick={handleViewReport}
      className="w-[180px] rounded-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
    >
      View Report
    </Button>
  </div>
</DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Workflowheader />
      <PowerBIMicrosoftLogin
        onBack={onBack}
        onSignInWithMicrosoft={() => setStep('workspaces')}
      />
    </>
  );
}