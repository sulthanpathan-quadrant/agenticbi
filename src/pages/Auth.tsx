// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { ArrowLeft, Loader2 } from "lucide-react";
// import { signup, login } from "@/components/api/api";
 
// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);
 
//   const { toast } = useToast();
//   const navigate = useNavigate();
 
//   // Normalize email to lowercase before sending to backend
//   const normalizeEmail = (emailStr: string): string => {
//     return emailStr.trim().toLowerCase();
//   };
 
//   // Validation functions
//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email.trim());
//   };
 
//   const validatePassword = (pwd: string) => pwd.length >= 6;
//   const validateName = (name: string) => name.trim().length >= 2;
 
//   const initializeAutoMLUser = async (user: any) => {
//     try {
//       const formData = new URLSearchParams();
//       formData.append("email", user.email);
//       formData.append("full_name", user.name);
 
//       const res = await fetch(
//         "https://api.veriton.ai/api/service3/automl_register_login",
//         {
//           method: "POST",
//           headers: {
//             accept: "application/json",
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: formData.toString(),
//         },
//       );
 
//       if (!res.ok) {
//         console.warn("AutoML init failed");
//         return;
//       }
 
//       const data = await res.json();
 
//       const aivolveUser = {
//         ...data.user,
//         agent_id: data.agent_id,
//         agent_name: data.agent_name,
//         session_id: data.session_id,
//         total_chats: data.total_chats,
//       };
 
//       localStorage.setItem("aivolve_user", JSON.stringify(aivolveUser));
//     } catch (err) {
//       console.error("AutoML init error:", err);
//     }
//   };
 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
 
//     const normalizedEmail = normalizeEmail(email);
 
//     // ─────────────────────────────────────────────────────────────
//     // VALIDATIONS
//     // ─────────────────────────────────────────────────────────────
//     if (!isLogin) {
//       if (!name?.trim()) {
//         toast({
//           title: "Name Required",
//           description: "Please enter your full name.",
//           variant: "destructive",
//         });
//         return;
//       }
//       if (!validateName(name)) {
//         toast({
//           title: "Invalid Name",
//           description: "Name must be at least 2 characters long.",
//           variant: "destructive",
//         });
//         return;
//       }
//     }
 
//     if (!email?.trim()) {
//       toast({
//         title: "Email Required",
//         description: "Please enter your email address.",
//         variant: "destructive",
//       });
//       return;
//     }
 
//     if (!validateEmail(email)) {
//       toast({
//         title: "Invalid Email",
//         description: "Please enter a valid email address.",
//         variant: "destructive",
//       });
//       return;
//     }
 
//     if (!password) {
//       toast({
//         title: "Password Required",
//         description: "Please enter your password.",
//         variant: "destructive",
//       });
//       return;
//     }
 
//     if (!isLogin && !validatePassword(password)) {
//       toast({
//         title: "Weak Password",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive",
//       });
//       return;
//     }
 
//     setLoading(true);
 
//     try {
//       let result: any;
 
//       if (isLogin) {
//         // LOGIN - send normalized email
//         result = await login({
//           email: normalizedEmail,
//           password,
//         });
//       } else {
//         // SIGNUP - send normalized email
//         result = await signup({
//           name: name.trim(),
//           email: normalizedEmail,
//           password,
//         });
//       }
 
//       // Store authentication data
//       if (result.access_token) {
//         localStorage.setItem("access_token", result.access_token);
//       }
//       if (result.user) {
//         localStorage.setItem("user", JSON.stringify(result.user));
//         if (!localStorage.getItem("aivolve_user")) {
//           await initializeAutoMLUser(result.user);
//         }
//       }
 
//       // Success messages
//       if (!isLogin) {
//         toast({
//           title: "Account Created Successfully! 🎉",
//           description: "You can now sign in with your new account.",
//           variant: "default",
//           duration: 1500,
//         });
//         setIsLogin(true);
//         setName("");
//         setEmail("");
//         setPassword("");
//         return;
//       }
 
//       // Login success
//       toast({
//         title: "Welcome Back!",
//         description: "You've been successfully signed in.",
//         variant: "default",
//         duration: 1000,
//       });
 
//       setTimeout(() => {
//         navigate("/jobs");
//       }, 1200);
//     } catch (err: any) {
//       console.error("Authentication error:", err);
 
//       let title = "Authentication Failed";
//       let description = "Something went wrong. Please try again.";
 
//       const errorMsg = (err.message || "").toLowerCase();
 
//       if (isLogin) {
//         if (
//           errorMsg.includes("invalid") ||
//           errorMsg.includes("incorrect") ||
//           errorMsg.includes("wrong")
//         ) {
//           title = "Invalid Credentials";
//           description = "The email or password you entered is incorrect.";
//         } else if (
//           errorMsg.includes("not found") ||
//           errorMsg.includes("no user")
//         ) {
//           title = "Account Not Found";
//           description =
//             "No account exists with this email. Please sign up first.";
//         }
//       } else {
//         if (
//           errorMsg.includes("already exists") ||
//           errorMsg.includes("already registered")
//         ) {
//           title = "Email Already Registered";
//           description =
//             "An account with this email already exists. Please sign in instead.";
//         }
//       }
 
//       toast({
//         title,
//         description,
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };
 
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4">
//       <div className="w-full max-w-md">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="mb-6"
//           disabled={loading}
//         >
//           <ArrowLeft className="mr-2" size={20} /> Back to Home
//         </Button>
 
//         <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
//           <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
//             {isLogin ? "Welcome Back" : "Get Started"}
//           </h1>
//           <p className="text-muted-foreground mb-6">
//             {isLogin
//               ? "Sign in to continue to your account"
//               : "Create your account to get started"}
//           </p>
 
//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label htmlFor="name">
//                   Name <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   disabled={loading}
//                   placeholder="Enter your full name"
//                   autoComplete="name"
//                 />
//               </div>
//             )}
 
//             <div className="space-y-2">
//               <Label htmlFor="email">
//                 Email <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//               />
//             </div>
 
//             <div className="space-y-2">
//               <Label htmlFor="password">
//                 Password <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 placeholder="••••••••"
//                 autoComplete={isLogin ? "current-password" : "new-password"}
//               />
//               {!isLogin && (
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Must be at least 6 characters long
//                 </p>
//               )}
//             </div>
 
//             <Button disabled={loading} className="w-full h-11" type="submit">
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {isLogin ? "Signing In..." : "Creating Account..."}
//                 </>
//               ) : isLogin ? (
//                 "Sign In"
//               ) : (
//                 "Create Account"
//               )}
//             </Button>
//           </form>
 
//           <div className="mt-6 text-center">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setName("");
//                 setEmail("");
//                 setPassword("");
//               }}
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               disabled={loading}
//             >
//               {isLogin
//                 ? "Don't have an account? Sign up"
//                 : "Already have an account? Sign in"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
 
// export default Auth; 


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useToast } from "@/hooks/use-toast";
// import { ArrowLeft, Loader2, Cloud, Database, Boxes } from "lucide-react";
// import { signup, login } from "@/components/api/api";

// type DataPlatform = "Fabric" | "Snowflake" | "Databricks";

// const PLATFORM_OPTIONS: {
//   key: DataPlatform;
//   label: string;
//   description: string;
//   icon: React.ElementType;
// }[] = [
//   {
//     key: "Fabric",
//     label: "Fabric (OneLake)",
//     description: "Microsoft Fabric / OneLake",
//     icon: Cloud,
//   },
//   {
//     key: "Snowflake",
//     label: "Snowflake",
//     description: "Snowflake Data Cloud",
//     icon: Database,
//   },
//   {
//     key: "Databricks",
//     label: "Databricks",
//     description: "Databricks Lakehouse",
//     icon: Boxes,
//   },
// ];

// const Auth = () => {
//   const [isLogin, setIsLogin] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   // NEW: controls whether we show the login/signup form or the platform picker
//   const [step, setStep] = useState<"auth" | "platform">("auth");
//   const [platformSaving, setPlatformSaving] = useState<DataPlatform | null>(null);

//   const { toast } = useToast();
//   const navigate = useNavigate();

//   // Normalize email to lowercase before sending to backend
//   const normalizeEmail = (emailStr: string): string => {
//     return emailStr.trim().toLowerCase();
//   };

//   // Validation functions
//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email.trim());
//   };

//   const validatePassword = (pwd: string) => pwd.length >= 6;
//   const validateName = (name: string) => name.trim().length >= 2;

//   const initializeAutoMLUser = async (user: any) => {
//     try {
//       const formData = new URLSearchParams();
//       formData.append("email", user.email);
//       formData.append("full_name", user.name);

//       const res = await fetch(
//         "https://api.veriton.ai/api/service3/automl_register_login",
//         {
//           method: "POST",
//           headers: {
//             accept: "application/json",
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: formData.toString(),
//         },
//       );

//       if (!res.ok) {
//         console.warn("AutoML init failed");
//         return;
//       }

//       const data = await res.json();

//       const aivolveUser = {
//         ...data.user,
//         agent_id: data.agent_id,
//         agent_name: data.agent_name,
//         session_id: data.session_id,
//         total_chats: data.total_chats,
//       };

//       localStorage.setItem("aivolve_user", JSON.stringify(aivolveUser));
//     } catch (err) {
//       console.error("AutoML init error:", err);
//     }
//   };

//   // NEW: called when user clicks a data platform card
//   const handleSelectPlatform = (platform: DataPlatform) => {
//     setPlatformSaving(platform);

//     try {
//       const storedUserRaw = localStorage.getItem("user");
//       const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};

//       const updatedUser = {
//         ...storedUser,
//         dataplatform: platform,
//       };

//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       toast({
//         title: "Platform Selected",
//         description: `${platform} has been set as your data platform.`,
//         duration: 1000,
//       });

//       setTimeout(() => {
//         navigate("/jobs");
//       }, 600);
//     } catch (err) {
//       console.error("Failed to save data platform:", err);
//       toast({
//         title: "Something went wrong",
//         description: "Could not save your data platform selection.",
//         variant: "destructive",
//       });
//       setPlatformSaving(null);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const normalizedEmail = normalizeEmail(email);

//     // ─────────────────────────────────────────────────────────────
//     // VALIDATIONS
//     // ─────────────────────────────────────────────────────────────
//     if (!isLogin) {
//       if (!name?.trim()) {
//         toast({
//           title: "Name Required",
//           description: "Please enter your full name.",
//           variant: "destructive",
//         });
//         return;
//       }
//       if (!validateName(name)) {
//         toast({
//           title: "Invalid Name",
//           description: "Name must be at least 2 characters long.",
//           variant: "destructive",
//         });
//         return;
//       }
//     }

//     if (!email?.trim()) {
//       toast({
//         title: "Email Required",
//         description: "Please enter your email address.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!validateEmail(email)) {
//       toast({
//         title: "Invalid Email",
//         description: "Please enter a valid email address.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!password) {
//       toast({
//         title: "Password Required",
//         description: "Please enter your password.",
//         variant: "destructive",
//       });
//       return;
//     }

//     if (!isLogin && !validatePassword(password)) {
//       toast({
//         title: "Weak Password",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       let result: any;

//       if (isLogin) {
//         // LOGIN - send normalized email
//         result = await login({
//           email: normalizedEmail,
//           password,
//         });
//       } else {
//         // SIGNUP - send normalized email
//         result = await signup({
//           name: name.trim(),
//           email: normalizedEmail,
//           password,
//         });
//       }

//       // Store authentication data
//       if (result.access_token) {
//         localStorage.setItem("access_token", result.access_token);
//       }
//       if (result.user) {
//         localStorage.setItem("user", JSON.stringify(result.user));
//         if (!localStorage.getItem("aivolve_user")) {
//           await initializeAutoMLUser(result.user);
//         }
//       }

//       // Success messages
//       if (!isLogin) {
//         toast({
//           title: "Account Created Successfully! 🎉",
//           description: "You can now sign in with your new account.",
//           variant: "default",
//           duration: 1500,
//         });
//         setIsLogin(true);
//         setName("");
//         setEmail("");
//         setPassword("");
//         return;
//       }

//       // Login success
//       toast({
//         title: "Welcome Back!",
//         description: "You've been successfully signed in.",
//         variant: "default",
//         duration: 1000,
//       });

//       // CHANGED: instead of navigating straight to /jobs, show the platform picker
//       setTimeout(() => {
//         setStep("platform");
//       }, 800);
//     } catch (err: any) {
//       console.error("Authentication error:", err);

//       let title = "Authentication Failed";
//       let description = "Something went wrong. Please try again.";

//       const errorMsg = (err.message || "").toLowerCase();

//       if (isLogin) {
//         if (
//           errorMsg.includes("invalid") ||
//           errorMsg.includes("incorrect") ||
//           errorMsg.includes("wrong")
//         ) {
//           title = "Invalid Credentials";
//           description = "The email or password you entered is incorrect.";
//         } else if (
//           errorMsg.includes("not found") ||
//           errorMsg.includes("no user")
//         ) {
//           title = "Account Not Found";
//           description =
//             "No account exists with this email. Please sign up first.";
//         }
//       } else {
//         if (
//           errorMsg.includes("already exists") ||
//           errorMsg.includes("already registered")
//         ) {
//           title = "Email Already Registered";
//           description =
//             "An account with this email already exists. Please sign in instead.";
//         }
//       }

//       toast({
//         title,
//         description,
//         variant: "destructive",
//         duration: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // NEW: platform selection screen, shown after a successful sign-in
//   if (step === "platform") {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4">
//         <div className="w-full max-w-md">
//           <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
//             <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
//               You've signed in
//             </h1>
//             <p className="text-muted-foreground mb-6">
//               Please select your data platform to continue
//             </p>

//             <div className="space-y-3">
//               {PLATFORM_OPTIONS.map(({ key, label, description, icon: Icon }) => {
//                 const isSaving = platformSaving === key;
//                 return (
//                   <button
//                     key={key}
//                     type="button"
//                     onClick={() => handleSelectPlatform(key)}
//                     disabled={platformSaving !== null}
//                     className="w-full flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
//                   >
//                     <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
//                       {isSaving ? (
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                       ) : (
//                         <Icon className="h-5 w-5" />
//                       )}
//                     </div>
//                     <div>
//                       <p className="font-semibold">{label}</p>
//                       <p className="text-xs text-muted-foreground">
//                         {description}
//                       </p>
//                     </div>
//                   </button>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4">
//       <div className="w-full max-w-md">
//         <Button
//           variant="ghost"
//           onClick={() => navigate("/")}
//           className="mb-6"
//           disabled={loading}
//         >
//           <ArrowLeft className="mr-2" size={20} /> Back to Home
//         </Button>

//         <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
//           <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
//             {isLogin ? "Welcome Back" : "Get Started"}
//           </h1>
//           <p className="text-muted-foreground mb-6">
//             {isLogin
//               ? "Sign in to continue to your account"
//               : "Create your account to get started"}
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label htmlFor="name">
//                   Name <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   id="name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   disabled={loading}
//                   placeholder="Enter your full name"
//                   autoComplete="name"
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label htmlFor="email">
//                 Email <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//                 placeholder="you@example.com"
//                 autoComplete="email"
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="password">
//                 Password <span className="text-destructive">*</span>
//               </Label>
//               <Input
//                 id="password"
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//                 placeholder="••••••••"
//                 autoComplete={isLogin ? "current-password" : "new-password"}
//               />
//               {!isLogin && (
//                 <p className="text-xs text-muted-foreground mt-1">
//                   Must be at least 6 characters long
//                 </p>
//               )}
//             </div>

//             <Button disabled={loading} className="w-full h-11" type="submit">
//               {loading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {isLogin ? "Signing In..." : "Creating Account..."}
//                 </>
//               ) : isLogin ? (
//                 "Sign In"
//               ) : (
//                 "Create Account"
//               )}
//             </Button>
//           </form>

//           <div className="mt-6 text-center">
//             <button
//               type="button"
//               onClick={() => {
//                 setIsLogin(!isLogin);
//                 setName("");
//                 setEmail("");
//                 setPassword("");
//               }}
//               className="text-sm text-muted-foreground hover:text-foreground transition-colors"
//               disabled={loading}
//             >
//               {isLogin
//                 ? "Don't have an account? Sign up"
//                 : "Already have an account? Sign in"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Auth;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, Cloud, Database, Boxes } from "lucide-react";
import { signup, login } from "@/components/api/api";

type DataPlatform = "Fabric" | "Snowflake" | "Databricks";

const PLATFORM_OPTIONS: {
  key: DataPlatform;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    key: "Fabric",
    label: "Fabric (OneLake)",
    description: "Microsoft Fabric / OneLake",
    icon: Cloud,
  },
  {
    key: "Snowflake",
    label: "Snowflake",
    description: "Snowflake Data Cloud",
    icon: Database,
  },
  {
    key: "Databricks",
    label: "Databricks",
    description: "Databricks Lakehouse",
    icon: Boxes,
  },
];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // NEW: controls whether we show the login/signup form or the platform picker
  const [step, setStep] = useState<"auth" | "platform">("auth");
  const [platformSaving, setPlatformSaving] = useState<DataPlatform | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  // Normalize email to lowercase before sending to backend
  const normalizeEmail = (emailStr: string): string => {
    return emailStr.trim().toLowerCase();
  };

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (pwd: string) => pwd.length >= 6;
  const validateName = (name: string) => name.trim().length >= 2;

  const initializeAutoMLUser = async (user: any) => {
    try {
      const formData = new URLSearchParams();
      formData.append("email", user.email);
      formData.append("full_name", user.name);

      const res = await fetch(
        "https://api.veriton.ai/api/service3/automl_register_login",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        },
      );

      if (!res.ok) {
        console.warn("AutoML init failed");
        return;
      }

      const data = await res.json();

      const aivolveUser = {
        ...data.user,
        agent_id: data.agent_id,
        agent_name: data.agent_name,
        session_id: data.session_id,
        total_chats: data.total_chats,
      };

      localStorage.setItem("aivolve_user", JSON.stringify(aivolveUser));
    } catch (err) {
      console.error("AutoML init error:", err);
    }
  };

  // NEW: called when user clicks a data platform card
  const handleSelectPlatform = (platform: DataPlatform) => {
    setPlatformSaving(platform);

    try {
      const storedUserRaw = localStorage.getItem("user");
      const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : {};

      const updatedUser = {
        ...storedUser,
        dataplatform: platform,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast({
        title: "Platform Selected",
        description: `${platform} has been set as your data platform.`,
        duration: 1000,
      });

      setTimeout(() => {
        navigate("/jobs");
      }, 600);
    } catch (err) {
      console.error("Failed to save data platform:", err);
      toast({
        title: "Something went wrong",
        description: "Could not save your data platform selection.",
        variant: "destructive",
      });
      setPlatformSaving(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = normalizeEmail(email);

    // ─────────────────────────────────────────────────────────────
    // VALIDATIONS
    // ─────────────────────────────────────────────────────────────
    if (!isLogin) {
      if (!name?.trim()) {
        toast({
          title: "Name Required",
          description: "Please enter your full name.",
          variant: "destructive",
        });
        return;
      }
      if (!validateName(name)) {
        toast({
          title: "Invalid Name",
          description: "Name must be at least 2 characters long.",
          variant: "destructive",
        });
        return;
      }
    }

    if (!email?.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    if (!password) {
      toast({
        title: "Password Required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    if (!isLogin && !validatePassword(password)) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let result: any;

      if (isLogin) {
        // LOGIN - send normalized email
        result = await login({
          email: normalizedEmail,
          password,
        });
      } else {
        // SIGNUP - send normalized email
        result = await signup({
          name: name.trim(),
          email: normalizedEmail,
          password,
        });
      }

      // Store authentication data
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
      }
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
        if (!localStorage.getItem("aivolve_user")) {
          await initializeAutoMLUser(result.user);
        }
      }

      // Success messages
      if (!isLogin) {
        toast({
          title: "Account Created Successfully! 🎉",
          description: "You can now sign in with your new account.",
          variant: "default",
          duration: 1500,
        });
        setIsLogin(true);
        setName("");
        setEmail("");
        setPassword("");
        return;
      }

      // Login success
      toast({
        title: "Welcome Back!",
        description: "You've been successfully signed in.",
        variant: "default",
        duration: 1000,
      });

      // CHANGED: instead of navigating straight to /jobs, show the platform picker
      setTimeout(() => {
        setStep("platform");
      }, 800);
    } catch (err: any) {
      console.error("Authentication error:", err);

      let title = "Authentication Failed";
      let description = "Something went wrong. Please try again.";

      const errorMsg = (err.message || "").toLowerCase();

      if (isLogin) {
        if (
          errorMsg.includes("invalid") ||
          errorMsg.includes("incorrect") ||
          errorMsg.includes("wrong")
        ) {
          title = "Invalid Credentials";
          description = "The email or password you entered is incorrect.";
        } else if (
          errorMsg.includes("not found") ||
          errorMsg.includes("no user")
        ) {
          title = "Account Not Found";
          description =
            "No account exists with this email. Please sign up first.";
        }
      } else {
        if (
          errorMsg.includes("already exists") ||
          errorMsg.includes("already registered")
        ) {
          title = "Email Already Registered";
          description =
            "An account with this email already exists. Please sign in instead.";
        }
      }

      toast({
        title,
        description,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // // NEW: platform selection screen, shown after a successful sign-in
  // if (step === "platform") {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4">
  //       <div className="w-full max-w-md">
  //         <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
  //           <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
  //             You've signed in
  //           </h1>
  //           <p className="text-muted-foreground mb-6">
  //             Please select your data platform to continue
  //           </p>

  //           <div className="space-y-3">
  //             {PLATFORM_OPTIONS.map(({ key, label, description, icon: Icon }) => {
  //               const isSaving = platformSaving === key;
  //               return (
  //                 <button
  //                   key={key}
  //                   type="button"
  //                   onClick={() => handleSelectPlatform(key)}
  //                   disabled={platformSaving !== null}
  //                   className="w-full flex items-center gap-4 rounded-xl border border-border bg-background/50 p-4 text-left transition-colors hover:border-primary hover:bg-primary/5 disabled:opacity-60 disabled:cursor-not-allowed"
  //                 >
  //                   <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
  //                     {isSaving ? (
  //                       <Loader2 className="h-5 w-5 animate-spin" />
  //                     ) : (
  //                       <Icon className="h-5 w-5" />
  //                     )}
  //                   </div>
  //                   <div>
  //                     <p className="font-semibold">{label}</p>
  //                     <p className="text-xs text-muted-foreground">
  //                       {description}
  //                     </p>
  //                   </div>
  //                 </button>
  //               );
  //             })}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }
// NEW: platform selection screen, shown after a successful sign-in
  if (step === "platform") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-hero-from/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-hero-to/20 blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />

        <div className="w-full max-w-5xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              You're signed in
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
              Choose your data platform
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-base">
              Pick where your data lives. You can always change this later from settings.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLATFORM_OPTIONS.map(({ key, label, description, icon: Icon }) => {
              const isSaving = platformSaving === key;
              const isDisabled = platformSaving !== null;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectPlatform(key)}
                  disabled={isDisabled}
                  className={[
                    "group relative flex flex-col items-start gap-6 rounded-3xl border p-8 text-left min-h-[280px] overflow-hidden",
                    "bg-card/70 backdrop-blur-sm transition-all duration-300 ease-out",
                    "hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/10",
                    isSaving
                      ? "border-primary ring-2 ring-primary/30 -translate-y-1.5 shadow-2xl shadow-primary/10"
                      : "border-border/80 hover:border-primary/50",
                    isDisabled && !isSaving ? "opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-none" : "",
                  ].join(" ")}
                >
                  {/* Soft radial glow inside card on hover */}
                  <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br from-hero-from/0 to-hero-to/0 group-hover:from-hero-from/10 group-hover:to-hero-to/10 blur-2xl transition-all duration-500" />

                  {/* Gradient top border */}
                  <div className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-hero-from to-hero-to opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div
                    className={[
                      "relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                      isSaving
                        ? "bg-gradient-to-br from-hero-from to-hero-to text-white shadow-lg shadow-primary/30"
                        : "bg-primary/10 text-primary group-hover:bg-gradient-to-br group-hover:from-hero-from group-hover:to-hero-to group-hover:text-white group-hover:shadow-lg group-hover:shadow-primary/20",
                    ].join(" ")}
                  >
                    {isSaving ? (
                      <Loader2 className="h-7 w-7 animate-spin" />
                    ) : (
                      <Icon className="h-7 w-7" />
                    )}
                  </div>

                  <div className="relative flex-1">
                    <p className="text-xl font-semibold text-foreground mb-2.5 tracking-tight">
                      {label}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {isSaving ? "Setting up your workspace..." : description}
                    </p>
                  </div>

                  {/* Selected indicator dot, top-right */}
                  <div
                    className={[
                      "absolute top-7 right-7 h-2.5 w-2.5 rounded-full transition-all duration-300",
                      isSaving
                        ? "bg-primary scale-100"
                        : "bg-transparent scale-0 group-hover:bg-primary/30 group-hover:scale-100",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-section-bg to-background p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
          disabled={loading}
        >
          <ArrowLeft className="mr-2" size={20} /> Back to Home
        </Button>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-hero-from to-hero-to bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Get Started"}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isLogin
              ? "Sign in to continue to your account"
              : "Create your account to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                Password <span className="text-destructive">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {!isLogin && (
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 6 characters long
                </p>
              )}
            </div>

            <Button disabled={loading} className="w-full h-11" type="submit">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              disabled={loading}
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;