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
 
//   console.log("Auth component rendered, isLogin:", isLogin);
//   console.log("Current values - name:", name, "email:", email, "password:", password);
 
//   // Validation functions
//   const validateEmail = (email: string) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email.trim());
//   };
 
//   const validatePassword = (pwd: string) => pwd.length >= 6;
 
//   const validateName = (name: string) => {
//     const trimmedName = name.trim();
//     return trimmedName.length >= 2;
//   };
 
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
   
//     console.log("=== FORM SUBMITTED ===");
//     console.log("isLogin:", isLogin);
//     console.log("name:", name);
//     console.log("email:", email);
//     console.log("password:", password);
 
//     // ══════════════════════════════════════════════════════════
//     // SIGN UP VALIDATIONS
//     // ══════════════════════════════════════════════════════════
//     if (!isLogin) {
//       console.log("Running SIGNUP validations...");
     
//       // 1. Check if name is empty
//       if (!name || !name.trim()) {
//         console.log("NAME IS EMPTY - Showing toast");
//         toast({
//           title: "Name Required",
//           description: "Please enter your full name to create an account.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for empty name");
//         return;
//       }
 
//       // 2. Check if name is too short
//       if (!validateName(name)) {
//         console.log("NAME TOO SHORT - Showing toast");
//         toast({
//           title: "Invalid Name",
//           description: "Name must be at least 2 characters long.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for short name");
//         return;
//       }
 
//       // 3. Check if email is empty
//       if (!email || !email.trim()) {
//         console.log("EMAIL IS EMPTY - Showing toast");
//         toast({
//           title: "Email Required",
//           description: "Please enter your email address to create an account.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for empty email");
//         return;
//       }
 
//       // 4. Check if email format is valid
//       if (!validateEmail(email)) {
//         console.log("EMAIL FORMAT INVALID - Showing toast");
//         toast({
//           title: "Invalid Email Format",
//           description: "Please enter a valid email address (e.g., user@example.com).",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for invalid email format");
//         return;
//       }
 
//       // 5. Check if password is empty
//       if (!password) {
//         console.log("PASSWORD IS EMPTY - Showing toast");
//         toast({
//           title: "Password Required",
//           description: "Please enter a password to secure your account.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for empty password");
//         return;
//       }
 
//       // 6. Check if password meets minimum length
//       if (!validatePassword(password)) {
//         console.log("PASSWORD TOO SHORT - Showing toast");
//         toast({
//           title: "Weak Password",
//           description: "Password must be at least 6 characters long for security.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for weak password");
//         return;
//       }
//     }
 
//     // ══════════════════════════════════════════════════════════
//     // SIGN IN VALIDATIONS
//     // ══════════════════════════════════════════════════════════
//     if (isLogin) {
//       console.log("Running SIGNIN validations...");
     
//       // 1. Check if email is empty
//       if (!email || !email.trim()) {
//         console.log("EMAIL IS EMPTY - Showing toast");
//         toast({
//           title: "Email Required",
//           description: "Please enter your email address to sign in.",
//           variant: "destructive",
//           duration: 4000,
//         });
//         console.log("Toast called for empty email");
//         return;
//       }
 
//       // 2. Check if email format is valid
//       if (!validateEmail(email)) {
//         console.log("EMAIL FORMAT INVALID - Showing toast");
//         toast({
//           title: "Invalid Email Format",
//           description: "Please enter a valid email address.",
//           variant: "destructive",
//           duration: 2000,
//         });
//         console.log("Toast called for invalid email format");
//         return;
//       }
 
//       // 3. Check if password is empty
//       if (!password) {
//         console.log("PASSWORD IS EMPTY - Showing toast");
//         toast({
//           title: "Password Required",
//           description: "Please enter your password to sign in.",
//           variant: "destructive",
//           duration: 2000,
//         });
//         console.log("Toast called for empty password");
//         return;
//       }
//     }
 
//     console.log("All validations passed, proceeding with API call...");
//     setLoading(true);
 
//     try {
//       const result = isLogin
//         ? await login({ email: email.trim(), password })
//         : await signup({ name: name.trim(), email: email.trim(), password });
 
//       console.log("API call successful:", result);
 
//       // Store token and user
//       if (result.access_token) {
//         localStorage.setItem("access_token", result.access_token);
//       }
//       if (result.user) {
//         localStorage.setItem("user", JSON.stringify(result.user));
//       }
 
//       // ══════════════════════════════════════════════════════════
//       // SUCCESS TOASTS
//       // ══════════════════════════════════════════════════════════
//       if (!isLogin) {
//         console.log("Showing SUCCESS toast for signup");
//         toast({
//           title: "Account Created Successfully! 🎉",
//           description: "Welcome! You're all set to get started.",
//           variant: "default",
//           duration: 2000,
//         });
//       } else {
//         console.log("Showing SUCCESS toast for login");
//         toast({
//           title: "Welcome Back!",
//           description: "You've been successfully signed in.",
//           variant: "default",
//           duration: 2000,
//         });
//       }
 
//       // Navigate after short delay so user can see the toast
//       setTimeout(() => {
//         navigate("/jobs");
//       }, 1400);
 
//     } catch (err: any) {
//       console.error("Authentication error:", err);
 
//       // ══════════════════════════════════════════════════════════
//       // ERROR HANDLING WITH SPECIFIC MESSAGES
//       // ══════════════════════════════════════════════════════════
//       let errorTitle = "Authentication Failed";
//       let errorDescription = "Something went wrong. Please try again.";
 
//       const errorMsg = err.message ? err.message.toLowerCase() : "";
 
//       if (isLogin) {
//         if (
//           errorMsg.includes("invalid") ||
//           errorMsg.includes("incorrect") ||
//           errorMsg.includes("wrong")
//         ) {
//           errorTitle = "Invalid Credentials";
//           errorDescription = "The email or password you entered is incorrect. Please try again.";
//         } else if (
//           errorMsg.includes("user not found") ||
//           errorMsg.includes("not found") ||
//           errorMsg.includes("no user") ||
//           errorMsg.includes("doesn't exist")
//         ) {
//           errorTitle = "Account Not Found";
//           errorDescription = "No account exists with this email address. Please sign up first.";
//         } else if (
//           errorMsg.includes("password") &&
//           (errorMsg.includes("wrong") || errorMsg.includes("incorrect"))
//         ) {
//           errorTitle = "Incorrect Password";
//           errorDescription = "The password you entered is incorrect. Please try again.";
//         } else if (errorMsg.includes("login failed")) {
//           errorTitle = "Login Failed";
//           errorDescription = "Unable to sign in. Please check your credentials and try again.";
//         } else if (errorMsg.includes("unauthorized") || errorMsg.includes("401")) {
//           errorTitle = "Unauthorized Access";
//           errorDescription = "Invalid email or password. Please check your credentials.";
//         } else if (err.message && err.message !== "Login failed") {
//           errorDescription = err.message;
//         }
//       } else {
//         if (
//           errorMsg.includes("already exists") ||
//           errorMsg.includes("already registered") ||
//           errorMsg.includes("email already") ||
//           errorMsg.includes("user already")
//         ) {
//           errorTitle = "Email Already Registered";
//           errorDescription = "An account with this email already exists. Please sign in instead.";
//         } else if (errorMsg.includes("invalid email")) {
//           errorTitle = "Invalid Email";
//           errorDescription = "The email address format is invalid. Please enter a valid email.";
//         } else if (errorMsg.includes("email") && errorMsg.includes("required")) {
//           errorTitle = "Email Required";
//           errorDescription = "Please provide a valid email address.";
//         } else if (
//           errorMsg.includes("password") &&
//           (errorMsg.includes("weak") || errorMsg.includes("short"))
//         ) {
//           errorTitle = "Weak Password";
//           errorDescription = "Password must be at least 6 characters long.";
//         } else if (errorMsg.includes("password") && errorMsg.includes("required")) {
//           errorTitle = "Password Required";
//           errorDescription = "Please provide a password for your account.";
//         } else if (errorMsg.includes("name") && errorMsg.includes("required")) {
//           errorTitle = "Name Required";
//           errorDescription = "Please provide your full name.";
//         } else if (errorMsg.includes("invalid name")) {
//           errorTitle = "Invalid Name";
//           errorDescription = "Please enter a valid name (at least 2 characters).";
//         } else if (errorMsg.includes("signup failed")) {
//           errorTitle = "Signup Failed";
//           errorDescription = "Unable to create account. Please try again.";
//         } else if (errorMsg.includes("validation")) {
//           errorTitle = "Validation Error";
//           errorDescription = err.message || "Please check your input and try again.";
//         } else if (err.message && err.message !== "Signup failed") {
//           errorDescription = err.message;
//         }
//       }
 
//       console.log("Showing ERROR toast:", errorTitle, errorDescription);
//       toast({
//         title: errorTitle,
//         description: errorDescription,
//         variant: "destructive",
//         duration: 4000,
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
 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { signup, login } from "@/components/api/api";
 
const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
 
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
 
      setTimeout(() => {
        navigate("/jobs");
      }, 1200);
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
 
 