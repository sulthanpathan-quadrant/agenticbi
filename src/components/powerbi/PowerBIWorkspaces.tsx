// import { useState } from 'react';
// import { ArrowLeft, FolderOpen, Search, LayoutGrid, List, Plus, Loader2 } from 'lucide-react';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';

// interface Workspace {
//   id: string;
//   name: string;
//   reports: number;
//   datasets: number;
// }

// const defaultWorkspaces: Workspace[] = [
//   { id: '1', name: 'Tableautopowerbi', reports: 9, datasets: 9 },
//   { id: '2', name: 'Demoworkspace1', reports: 0, datasets: 0 },
//   { id: '3', name: 'demo12', reports: 0, datasets: 0 },
//   { id: '4', name: 'newspace', reports: 5, datasets: 5 },
// ];

// interface PowerBIWorkspacesProps {
//   onBack: () => void;
//   onMigrate: (workspace: Workspace) => void;
//   fileName: string;
//   isMigrating?: boolean;
// }

// export function PowerBIWorkspaces({ onBack, onMigrate, fileName, isMigrating }: PowerBIWorkspacesProps) {
//   const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [showCreateDialog, setShowCreateDialog] = useState(false);
//   const [newWorkspaceName, setNewWorkspaceName] = useState('');
//   const [showMigrateDialog, setShowMigrateDialog] = useState(false);
//   const [reportName, setReportName] = useState('');

//   const filtered = workspaces.filter(w =>
//     w.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const handleCreate = () => {
//     if (!newWorkspaceName.trim()) return;
//     const newWs: Workspace = {
//       id: Date.now().toString(),
//       name: newWorkspaceName.trim(),
//       reports: 0,
//       datasets: 0,
//     };
//     setWorkspaces(prev => [...prev, newWs]);
//     setNewWorkspaceName('');
//     setShowCreateDialog(false);
//   };

//   const selectedWorkspace = workspaces.find(w => w.id === selectedId);

//   return (
//     <>
//     {isMigrating && (
//       <div className="fixed inset-0 z-[100] bg-transparent backdrop-blur-sm flex flex-col items-center justify-center gap-4">
//         <Loader2 className="w-12 h-12 animate-spin text-[hsl(270,70%,65%)]" />
//         <p className="text-lg font-semibold text-[hsl(0,0%,15%)]">Migrating to Power BI...</p>
//         <p className="text-sm text-[hsl(0,0%,50%)]">Please wait while your report is being migrated</p>
//       </div>
//     )}
//     <div className="min-h-screen bg-[hsl(0,0%,97%)] flex flex-col pt-2">
//       {/* <div className="bg-white border-b border-[hsl(0,0%,90%)] px-6 py-3 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <span className="text-lg font-bold bg-gradient-to-r from-[hsl(270,80%,60%)] to-[hsl(320,70%,60%)] bg-clip-text text-transparent">
//             ✦ VERITON
//           </span>
//           <span className="text-sm text-[hsl(0,0%,45%)]">Welcome, <span className="text-[hsl(270,70%,65%)] font-medium">User</span></span>
//         </div>
//       </div> */}

//       {/* File info */}
//       {/* <div className="px-6 py-4 flex items-center gap-3">
//         <div className="w-10 h-10 rounded-lg bg-[hsl(270,60%,95%)] flex items-center justify-center">
//           <FolderOpen className="w-5 h-5 text-[hsl(270,70%,65%)]" />
//         </div>
//         <div>
//           <h2 className="text-lg font-semibold text-[hsl(0,0%,15%)]">{fileName}</h2>
//           <p className="text-sm text-[hsl(0,0%,50%)]">Select destination workspace</p>
//         </div>
//       </div> */}

//       {/* Toolbar */}
//       <div className="px-6 pb-3 flex items-center justify-between">
//         <h1 className="text-xl font-bold text-[hsl(0,0%,15%)]">Power BI Workspaces</h1>
       
//       </div>

//       {/* Content */}
//       <div className="flex-1 px-6 py-2">
//         <div className="bg-white border border-[hsl(0,0%,90%)] rounded-xl p-6 space-y-4 ">
//           <div className="flex items-center gap-2 justify-between">
//             <div className="relative max-w flex-1">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(0,0%,55%)]" />
//               <Input
//                 placeholder="Search workspaces..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-11 bg-white border-[hsl(0,0%,85%)] rounded-full text-[hsl(0,0%,15%)]"
//               />
//             </div>
//             <Button
//               variant="outline"
//               size="icon"
//               onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
//               className="h-11 w-11 border-[hsl(0,0%,80%)] text-[hsl(0,0%,30%)]"
//             >
//               {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
//             </Button>
//             <div className="flex items-center gap-2 ">
//           <Button
//             onClick={() => setShowCreateDialog(true)}
//             className="gap-2 bg-[hsl(270,70%,65%)] hover:bg-[hsl(270,70%,55%)] text-white font-medium rounded-full"
//           >
//             <Plus className="w-4 h-4" />
//             Create Workspace
//           </Button>
//         </div>

//           </div>

//           <ScrollArea className="h-[400px] pr-2">
//             <div className={viewMode === 'grid'
//               ? 'grid  grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'
//               : 'space-y-2 overflow-y-auto'
//             }>
//               {filtered.map(ws => (
//                 <button
//                   key={ws.id}
//                   onClick={() => setSelectedId(ws.id)}
//                   className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
//                     selectedId === ws.id
//                       ? 'border-[hsl(270,70%,65%)] bg-[hsl(270,70%,97%)]'
//                       : 'border-[hsl(0,0%,90%)] hover:border-[hsl(270,70%,80%)] bg-white'
//                   }`}
//                 >
//                   <FolderOpen className="w-6 h-6 text-[hsl(270,70%,65%)] mb-3" />
//                   <p className="font-semibold text-[hsl(0,0%,15%)] text-sm">{ws.name}</p>
//                   <p className="text-xs text-[hsl(0,0%,50%)] mt-1">
//                     {ws.reports} reports • {ws.datasets} datasets
//                   </p>
//                 </button>
//               ))}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>

//       {/* Bottom bar */}
//       <div className="px-6 py-4 border-t border-[hsl(0,0%,90%)] bg-white flex items-center justify-between sticky bottom-0">
//         <Button
//           variant="outline"
//           className="gap-2 rounded-full border-[hsl(0,0%,85%)] text-[hsl(0,0%,25%)]"
//           onClick={onBack}
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </Button>
//         <Button
//           onClick={() => {
//             if (selectedWorkspace) {
//               setReportName(fileName.replace(/\.[^/.]+$/, ''));
//               setShowMigrateDialog(true);
//             }
//           }}
//           disabled={!selectedWorkspace || isMigrating}
//           className="gap-2 bg-[hsl(270,70%,65%)] hover:bg-[hsl(270,70%,55%)] text-white font-medium px-8 rounded-full"
//         >
//           {isMigrating ? (
//             <>
//               <Loader2 className="w-4 h-4 animate-spin" />
//               Migrating...
//             </>
//           ) : (
//             'Migrate to Power BI'
//           )}
//         </Button>
//       </div>

//       {/* Create Workspace Dialog - White theme */}
//       <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
//         <DialogContent className="sm:max-w-md bg-white border-[hsl(0,0%,90%)] text-[hsl(0,0%,15%)]">
//           <DialogHeader>
//             <DialogTitle className="text-[hsl(0,0%,15%)]">Create Power BI Workspace</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 pt-2">
//             <Input
//               placeholder="Enter workspace name"
//               value={newWorkspaceName}
//               onChange={(e) => setNewWorkspaceName(e.target.value)}
//               className="h-11 bg-white border-[hsl(0,0%,80%)] text-[hsl(0,0%,15%)] placeholder:text-[hsl(0,0%,55%)] focus:border-[hsl(270,70%,65%)]"
//               autoFocus
//               onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
//             />
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setShowCreateDialog(false)} className="border-[hsl(0,0%,85%)] text-[hsl(0,0%,40%)] hover:bg-[hsl(0,0%,96%)]">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleCreate}
//                 disabled={!newWorkspaceName.trim()}
//                 className="bg-[hsl(270,70%,65%)] hover:bg-[hsl(270,70%,55%)] text-white"
//               >
//                 Create
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Migrate Dialog with Input */}
//       <Dialog open={showMigrateDialog} onOpenChange={setShowMigrateDialog}>
//         <DialogContent className="sm:max-w-md bg-white border-[hsl(0,0%,90%)] text-[hsl(0,0%,15%)]">
//           <DialogHeader>
//             <DialogTitle className="text-[hsl(0,0%,15%)]">Migrate to Power BI</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4 pt-2">
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-[hsl(0,0%,30%)]">Report Name</label>
//               <Input
//                 placeholder="Enter report name"
//                 value={reportName}
//                 onChange={(e) => setReportName(e.target.value)}
//                 className="h-11 bg-white border-[hsl(0,0%,80%)] text-[hsl(0,0%,15%)] placeholder:text-[hsl(0,0%,55%)] focus:border-[hsl(270,70%,65%)]"
//                 autoFocus
//               />
//             </div>
//             <div className="space-y-2">
//               <label className="text-sm font-medium text-[hsl(0,0%,30%)]">Destination Workspace</label>
//               <Input
//                 value={selectedWorkspace?.name || ''}
//                 disabled
//                 className="h-11 bg-[hsl(0,0%,96%)] border-[hsl(0,0%,80%)] text-[hsl(0,0%,15%)]"
//               />
//             </div>
//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="outline" onClick={() => setShowMigrateDialog(false)} className="border-[hsl(0,0%,85%)] text-[hsl(0,0%,40%)] hover:bg-[hsl(0,0%,96%)]">
//                 Cancel
//               </Button>
//               <Button
//                 onClick={() => {
//                   setShowMigrateDialog(false);
//                   if (selectedWorkspace) onMigrate(selectedWorkspace);
//                 }}
//                 disabled={!reportName.trim()}
//                 className="bg-[hsl(270,70%,65%)] hover:bg-[hsl(270,70%,55%)] text-white"
//               >
//                 Start Migration
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//     </>
//   );
// }

import { useState } from 'react';
import { ArrowLeft, FolderOpen, Search, LayoutGrid, List, Plus, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Workspace {
  id: string;
  name: string;
  reports: number;
  datasets: number;
}

const defaultWorkspaces: Workspace[] = [
  { id: '1', name: 'Tableautopowerbi', reports: 9, datasets: 9 },
  { id: '2', name: 'Demoworkspace1', reports: 0, datasets: 0 },
  { id: '3', name: 'demo12', reports: 0, datasets: 0 },
  { id: '4', name: 'newspace', reports: 5, datasets: 5 },
];

interface PowerBIWorkspacesProps {
  onBack: () => void;
  onMigrate: (workspace: Workspace) => void;
  fileName: string;
  isMigrating?: boolean;
}

export function PowerBIWorkspaces({ onBack, onMigrate, fileName, isMigrating }: PowerBIWorkspacesProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(defaultWorkspaces);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [showMigrateDialog, setShowMigrateDialog] = useState(false);
  const [reportName, setReportName] = useState('');

  const filtered = workspaces.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!newWorkspaceName.trim()) return;
    const newWs: Workspace = {
      id: Date.now().toString(),
      name: newWorkspaceName.trim(),
      reports: 0,
      datasets: 0,
    };
    setWorkspaces(prev => [...prev, newWs]);
    setNewWorkspaceName('');
    setShowCreateDialog(false);
  };

  const selectedWorkspace = workspaces.find(w => w.id === selectedId);

  return (
    <>
      {isMigrating && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-semibold text-foreground">Migrating to Power BI...</p>
          <p className="text-sm text-muted-foreground">Please wait while your report is being migrated</p>
        </div>
      )}

      <div className="min-h-screen bg-background flex flex-col pt-6">
        {/* Toolbar */}
        <div className="px-6 pb-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Power BI Workspaces</h1>
        </div>

        <div className="flex-1 px-6 py-2">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-3 flex-wrap justify-between">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-background border-input text-foreground placeholder:text-muted-foreground rounded-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="h-11 w-11"
                >
                  {viewMode === 'grid' ? <List className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
                </Button>

                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                >
                  <Plus className="w-4 h-4" />
                  Create Workspace
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[400px] pr-2">
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-2'
              }>
                {filtered.map(ws => (
                  <button
                    key={ws.id}
                    onClick={() => setSelectedId(ws.id)}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                      selectedId === ws.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-primary/40 bg-card hover:shadow-sm'
                    }`}
                  >
                    <FolderOpen className="w-6 h-6 text-primary mb-3" />
                    <p className="font-semibold text-foreground text-sm truncate">{ws.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {ws.reports} reports • {ws.datasets} datasets
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-6 py-4 border-t border-border bg-card flex items-center justify-between sticky bottom-0 z-10">
          <Button
            variant="outline"
            className="gap-2 rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={() => {
              if (selectedWorkspace) {
                setReportName(fileName.replace(/\.[^/.]+$/, ''));
                setShowMigrateDialog(true);
              }
            }}
            disabled={!selectedWorkspace || isMigrating}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-full min-w-[180px]"
          >
            {isMigrating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Migrating...
              </>
            ) : (
              'Migrate to Power BI'
            )}
          </Button>
        </div>

        {/* Create Workspace Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Power BI Workspace</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <Input
                placeholder="Enter workspace name"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                className="h-11"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!newWorkspaceName.trim()}
                >
                  Create
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Migrate Dialog */}
        <Dialog open={showMigrateDialog} onOpenChange={setShowMigrateDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Migrate to Power BI</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">Report Name</label>
                <Input
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="h-11"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/90">Destination Workspace</label>
                <Input
                  value={selectedWorkspace?.name || ''}
                  disabled
                  className="h-11 bg-muted/50"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowMigrateDialog(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowMigrateDialog(false);
                    if (selectedWorkspace) onMigrate(selectedWorkspace);
                  }}
                  disabled={!reportName.trim()}
                >
                  Start Migration
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}