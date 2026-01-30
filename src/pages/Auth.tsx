 
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

//   const toastOptions = { duration: 1000 };
//   const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
//   const validatePassword = (pwd: string) => pwd.length >= 6;

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Basic validations
//     if (!email || !password || (!isLogin && !name)) {
//       toast({
//         title: "Missing Fields",
//         description: "Please fill all fields.",
//         variant: "destructive",
//           ...toastOptions,
//       });
//       return;
//     }

//     if (!validateEmail(email)) {
//       toast({
//         title: "Invalid Email",
//         description: "Enter a valid email.",
//         variant: "destructive",
//           ...toastOptions,
//       });
//       return;
//     }

//     if (!validatePassword(password)) {
//       toast({
//         title: "Weak Password",
//         description: "Password must be at least 6 characters.",
//         variant: "destructive",
//           ...toastOptions,
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = isLogin
//         ? await login({ email, password })
//         : await signup({ name, email, password });
//         console.log(result.access_token)

//       // ✅ Store token and user in localStorage
//       if (result.access_token) {
//         localStorage.setItem("access_token", result.access_token);
//       }
//       if (result.user) {
//         localStorage.setItem("user", JSON.stringify(result.user));
//       }

//       toast({
//          title: isLogin ? "Login Successful!" : "Account Created!",
//         description: isLogin ? "Welcome back!" : "You’re all set!",
//         ...toastOptions,
//       });
 
//       // ✅ Navigate to dashboard
//       // navigate("/jobs");
//       setTimeout(() => navigate("/jobs"), 400);
//     } catch (err: any) {
//       toast({
//         title: "Authentication Failed",
//         description: err.message || "Something went wrong",
//         variant: "destructive",
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

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {!isLogin && (
//               <div className="space-y-2">
//                 <Label>Name</Label>
//                 <Input
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   disabled={loading}
//                 />
//               </div>
//             )}

//             <div className="space-y-2">
//               <Label>Email</Label>
//               <Input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={loading}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label>Password</Label>
//               <Input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 disabled={loading}
//               />
//             </div>

//             <Button disabled={loading} className="w-full h-11">
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
import { ArrowLeft, Loader2, X } from "lucide-react"; // ← added X icon
import { signup, login } from "@/components/api/api";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();

  const toastOptions = { duration: 4000 }; // longer so user has time to read + close

  // Reusable close button for all toasts
  const closeAction = (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 rounded-full absolute top-2 right-2"
      onClick={() => {} /* toast is dismissed automatically when action is clicked */}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </Button>
  );

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pwd: string) => pwd.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validations
    if (!email || !password || (!isLogin && !name)) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
        action: closeAction,
        ...toastOptions,
      });
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        action: closeAction,
        ...toastOptions,
      });
      return;
    }

    if (!validatePassword(password)) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
        action: closeAction,
        ...toastOptions,
      });
      return;
    }

    setLoading(true);

    try {
      const result = isLogin
        ? await login({ email, password })
        : await signup({ name, email, password });

      // Store token and user
      if (result.access_token) {
        localStorage.setItem("access_token", result.access_token);
      }
      if (result.user) {
        localStorage.setItem("user", JSON.stringify(result.user));
      }

      // ── Success toasts ────────────────────────────────────────
      if (!isLogin) {
        // Signup success
        toast({
          title: "Account Created Successfully! 🎉",
          description: "Welcome aboard! You're all set to get started.",
          variant: "default",
          action: closeAction,
          ...toastOptions,
        });
      } else {
        // Login success
        toast({
          title: "Welcome Back!",
          description: "You've been successfully signed in.",
          variant: "default",
          action: closeAction,
          ...toastOptions,
        });
      }

      // Navigate after short delay so user can see the toast
      setTimeout(() => {
        navigate("/jobs");
      }, 1400);

    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive",
        action: closeAction,
        ...toastOptions,
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

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="••••••••"
              />
            </div>

            <Button disabled={loading} className="w-full h-11">
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