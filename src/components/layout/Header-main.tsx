import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, BarChart3, GitBranch, TableIcon, Sparkles, Cloud, Database, Boxes, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

interface HeaderProps {
  /**
   * Called AFTER the new platform value has been saved to localStorage.
   * Pages should use this to immediately refetch whatever data depends on
   * the data platform (jobs, pipelines, datasets, etc). This is what fixes
   * the "only works after a page refresh" bug — previously nothing told
   * the page's effects to re-run when the platform changed, so a page
   * kept showing/fetching Fabric data even after switching to Databricks
   * until it was remounted.
   */
  onDataPlatformChange?: (platform: string) => void;
}

const NAV_ITEMS = [
  { path: "/jobs", label: "Jobs", icon: BarChart3 },
  { path: "/pipelines", label: "Pipelines", icon: GitBranch },
  { path: "/datasets", label: "Datasets", icon: TableIcon },
  { path: "/workflow/automl/jobs1", label: "Auto AI/ML", icon: Sparkles },
];

// Matches each data platform to its own icon (mirrors the icons used on
// the platform selection screen: cloud for Fabric, cylinder/db for
// Snowflake, stacked cubes for Databricks).
const PLATFORM_ICONS: Record<string, typeof Cloud> = {
  Fabric: Cloud,
  Snowflake: Database,
  Databricks: Boxes,
};

const getStoredUser = () => {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};

const Header = ({ onDataPlatformChange }: HeaderProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = getStoredUser();
  const userName = user?.name || user?.email?.split("@")[0] || "User";

  // Default to Fabric if the user object has no platform set yet.
  const [dataPlatform, setDataPlatform] = useState<string>(
    user?.dataplatform || "Fabric",
  );

  const isActive = (path: string) =>
    location.pathname === path ||
    (path === "/workflow/automl/jobs1" &&
      location.pathname.startsWith("/workflow/automl"));

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out successfully");
    navigate("/", { replace: true });
  };

  const handleDataPlatformChange = (value: string) => {
    setDataPlatform(value);

    try {
      const storedUserRaw = localStorage.getItem("user");
      const userObj = storedUserRaw ? JSON.parse(storedUserRaw) : {};
      const updatedUser = { ...userObj, dataplatform: value };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success(`Data platform set to ${value}`);

      // Tell whichever page is mounted to refetch right now, instead of
      // silently waiting for the user to hit refresh.
      onDataPlatformChange?.(value);
    } catch (err) {
      console.error("Failed to update data platform in localStorage", err);
      toast.error("Failed to save data platform selection");
    }
  };

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <a href="/" className="flex-shrink-0">
              <img
                src="/logo2.png"
                alt="Veriton"
                className="
                  h-10
                  sm:h-10
                  md:h-9 lg:h-10
                  w-auto
                  object-contain
                  drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
                  transition-transform duration-200
                  hover:scale-105
                "
              />
            </a>

            <div className="flex flex-col">
              <p className="text-sm md:text-base text-muted-foreground">
                Welcome,{" "}
                <span className="text-primary font-medium">{userName}</span>
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-6">
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 pb-1 transition-colors ${
                  isActive(path)
                    ? "text-primary font-medium border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}

            {/* ── "DataPlatform" selector — pill-style trigger to match the
                reference design: icon + label + chevron inside a bordered,
                rounded pill. State/logic below is untouched — only the
                trigger's visual markup and classes changed. ── */}
            <Select value={dataPlatform} onValueChange={handleDataPlatformChange}>
              <SelectTrigger
                className="
                  w-auto min-w-[122px] h-9
                  flex-shrink-0
                  rounded-lg border border-border
                 hover:bg-violet-300/70
                  focus:ring-0 focus:ring-offset-0
                  gap-2 px-3
                  shadow-sm
                  [&>svg]:hidden
                "
              >
                <div className="flex items-center gap-2 whitespace-nowrap">
                  {(() => {
                    const PlatformIcon = PLATFORM_ICONS[dataPlatform] ?? Cloud;
                    return (
                      <PlatformIcon className="w-4 h-4 text-violet-600 flex-shrink-0" />
                    );
                  })()}
                  <span className="text-sm font-medium text-violet-600">
                    {dataPlatform || "Fabric"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fabric">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-violet-600" />
                    Fabric
                  </div>
                </SelectItem>
                <SelectItem value="Snowflake">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-violet-600" />
                    Snowflake
                  </div>
                </SelectItem>
                <SelectItem value="Databricks">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-violet-600" />
                    Databricks
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-primary rounded-full"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;