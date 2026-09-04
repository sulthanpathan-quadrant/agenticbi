import {
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Layers,
  Network,
  Play,
  Plug,
  ShieldCheck,
  Sparkles,
} from "lucide-react";


const STEPS = [
  {
    id: 1,
    label: "Source Connection",
    icon: Plug,
  },
  {
    id: 2,
    label: "Target Connection",
    icon: Layers,
  },
  {
    id: 3,
    label: "Source Metadata Analysis",
    icon: Database,
  },
  {
    id: 4,
    label: "Target Metadata Analysis",
    icon: Network,
  },
  {
    id: 5,
    label: "Column Mapping",
    icon: Sparkles,
  },
  {
    id: 6,
    label: "Review & Approve",
    icon: FileSpreadsheet,
  },
  {
    id: 7,
    label: "Run Migration",
    icon: Play,
  },
  {
    id: 8,
    label: "Validate Migration",
    icon: ShieldCheck,
  },
] as const;


interface ModernizeSidebarProps {
  step: number;
  done: number[];
  onStepChange: (step: number) => void;
}


export default function ModernizeSidebar({
  step,
  done,
  onStepChange,
}: ModernizeSidebarProps) {
  return (
    <aside className="hidden lg:flex fixed top-20 left-0 z-40 h-[calc(100vh-5rem)] w-60 bg-card border-r border-border flex-col">
      <div className="p-3 pt-4">
        <nav className="space-y-1">
          {STEPS.map(({ id, label, icon: Icon }) => {
            const active = step === id;
            const finished = done.includes(id);

            return (
              <button
                key={id}
                type="button"
                onClick={() => onStepChange(id)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-accent text-foreground"
                }`}
              >
                {finished && !active ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0" />
                )}

                <span className="truncate">
                  {label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

