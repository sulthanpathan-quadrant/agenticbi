// import { Database, Home, Layers, CheckCircle, Hash, Workflow, TrendingUp, Settings, LogOut, GitMerge, Eye, FileSpreadsheet } from "lucide-react";
// import { NavLink } from "./NavLink";
// import { Separator } from "./ui/separator";

// export function WorkflowSidebar() {


//   return (
//     <aside className="fixed left-0 top-0 h-screen w-60 bg-card border-r border-border flex flex-col">
//       {/* Header */}
//       <div className="p-4 border-b border-border">
//         <h1 className="text-lg font-bold text-foreground">Data Platform</h1>
//         <p className="text-sm text-muted-foreground">Workflow</p>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
//         <NavLink
//           to="/workflow/data-ingestion"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Database className="h-4 w-4" />
//           <span>Data Ingestion</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/landing-zone"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Home className="h-4 w-4" />
//           <span>Landing Zone</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/data-modeling"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Layers className="h-4 w-4" />
//           <span>Data Modeling</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/data-preview"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Eye className="h-4 w-4" />
//           <span>Data Preview</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/data-creation"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <GitMerge className="h-4 w-4" />
//           <span>Create Dataset</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/data-quality"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <CheckCircle className="h-4 w-4" />
//           <span>Data Quality</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/ner"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Hash className="h-4 w-4" />
//           <span>NER</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/business-logic"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <Workflow className="h-4 w-4" />
//           <span>Business Logic</span>
//         </NavLink>

//         <NavLink
//           to="/workflow/path-selection"
//           className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//           activeClassName="bg-primary text-primary-foreground font-medium hover:bg-primary"
//         >
//           <TrendingUp className="h-4 w-4" />
//           <span>Path Selection</span>
//         </NavLink>
//       </nav>

//       {/* Bottom Actions */}
//       <div className="p-3 border-t border-border space-y-1">
//         <button
//           onClick={() => {localStorage.clear(); window.location.href = '/'}
//           }
//           className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors hover:bg-accent"
//         >
//           <LogOut className="h-4 w-4" />
//           <span>Logout</span>
//         </button>
//       </div>
//     </aside>
//   );
// }

import {
  Database,
  Home,
  Layers,
  CheckCircle,
  Hash,
  Workflow,
  TrendingUp,
  LogOut,
  GitMerge,
  Eye,
} from "lucide-react";
import { NavLink } from "./NavLink";

export function WorkflowSidebar() {
  return (
    <aside className="fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-60 bg-card border-r border-border flex flex-col">
      
      {/* Scrollable navigation ONLY */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <NavLink to="/workflow/data-ingestion" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Database className="h-4 w-4" />
          <span>Data Ingestion</span>
        </NavLink>

        <NavLink to="/workflow/landing-zone" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Home className="h-4 w-4" />
          <span>Landing Zone</span>
        </NavLink>

        <NavLink to="/workflow/data-modeling" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Layers className="h-4 w-4" />
          <span>Data Modeling</span>
        </NavLink>

        <NavLink to="/workflow/data-preview" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Eye className="h-4 w-4" />
          <span>Data Preview</span>
        </NavLink>

        <NavLink to="/workflow/data-creation" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <GitMerge className="h-4 w-4" />
          <span>Create Dataset</span>
        </NavLink>

        <NavLink to="/workflow/data-quality" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <CheckCircle className="h-4 w-4" />
          <span>Data Quality</span>
        </NavLink>

        <NavLink to="/workflow/ner" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Hash className="h-4 w-4" />
          <span>NER</span>
        </NavLink>

        <NavLink to="/workflow/business-logic" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <Workflow className="h-4 w-4" />
          <span>Business Logic</span>
        </NavLink>

        <NavLink to="/workflow/path-selection" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition" activeClassName="bg-primary text-primary-foreground font-medium">
          <TrendingUp className="h-4 w-4" />
          <span>Path Selection</span>
        </NavLink>
      </nav>

      {/* Logout (fixed at bottom, no scroll) */}
      <div className="p-3 border-t border-border">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-accent transition"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
