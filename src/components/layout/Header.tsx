// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext";
// import {
//   Database,
//   BarChart3,
//   GitBranch,
//   Table as TableIcon,
//   LogOut,
//   ArrowLeft,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { ThemeToggle } from "../ThemeToggle";
 
// const Header = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();
 
//   const userName = user?.full_name || user?.email || "User";
 
//   const handleLogout = () => {
//     logout();
 
//     // optional: clear everything if needed
//     localStorage.clear();
 
//     navigate("/");
//   };
 
//   return (
//     <header className="fixed top-0 left-0 right-0 h-14 bg-card/80 backdrop-blur-md border-b border-border z-50 flex items-center px-4 md:px-6">
//       <div className="container mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">
//           {/* Left Section */}
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
//               <Database className="w-5 h-5 text-primary" />
//             </div>
 
//             <div>
//               <h1
//                 className="font-bold text-lg cursor-pointer"
//                 onClick={() => navigate("/jobs")}
//               >
//                 Veriton
//               </h1>
 
//               <p className="text-sm text-muted-foreground">
//                 Welcome,{" "}
//                 <span className="text-primary font-medium">{userName}</span>
//               </p>
//             </div>
//           </div>
 
//           {/* Navigation */}
//           <nav className="flex items-center gap-6">
            
//             {/* Datasets */}
//             <button
//               onClick={() => navigate("/workflow/path-selection")}
//               className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Path Selection
//             </button>
//             {/* Right Actions */}
//             <div className="flex items-center gap-3">
//               <ThemeToggle />
 
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={handleLogout}
//                 className="hover:bg-primary/10 rounded-full"
//                 title="Logout"
//               >
//                 <LogOut className="h-4 w-4" />
//               </Button>
//             </div>
//           </nav>
//         </div>
//       </div>bb 
//     </header>
//   );
// };
 
// export default Header;
 
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Database,
  BarChart3,
  GitBranch,
  Table as TableIcon,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "../ThemeToggle";
import { useEffect, useState } from "react";
 
const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
 
  const userName = user?.full_name || user?.email || "User";
  const formattedUserName =
  userName?.charAt(0).toUpperCase() + userName?.slice(1);
 
 
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
 
    window.addEventListener("scroll", handleScroll);
 
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  const handleLogout = () => {
    logout();
 
    // optional: clear everything if needed
    localStorage.clear();
 
    navigate("/");
  };
 
  return (
    <header
      className={`border-b border-border sticky top-0 z-50 transition-all duration-300
      ${
        isScrolled
          ? "bg-background/70 backdrop-blur-md shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Logo */}
            <a href="/" className="flex-shrink-0">
              <img
                src="/logo2.png"
                alt="Veriton"
                className="
                  h-10               /* mobile base size */
                  sm:h-10
                  md:h-9 lg:h-10    /* larger on desktop */
                  w-auto
                  object-contain
                  drop-shadow-[0_4px_16px_rgba(99,102,241,0.7)]
                  transition-transform duration-200
                  hover:scale-105
                "
              />
            </a>
 
            {/* Welcome text – side by side */}
            <div className="flex flex-col">
              <p className="text-sm md:text-base text-muted-foreground">
                Welcome,{" "}
                <span className="text-primary font-medium">
                  {formattedUserName}
                </span>
              </p>
            </div>
          </div>
 
          {/* Right */}
          <nav className="flex items-center gap-6">
            
            {/* <button
              onClick={() => navigate("/workflow/path-selection")}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Path Selection
            </button> */}

            <Button variant="outline" onClick={() => navigate("/workflow/path-selection")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Path Selection
          </Button>
 
            <div className="flex items-center gap-3">
              <ThemeToggle />
 
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="hover:bg-primary/10 rounded-full"
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
 
 