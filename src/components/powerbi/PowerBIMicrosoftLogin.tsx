// import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Navigate, useNavigate } from 'react-router-dom';

// interface PowerBIMicrosoftLoginProps {
//   onBack: () => void;
//   onSignInWithMicrosoft: () => void;
// }

// export function PowerBIMicrosoftLogin({ onBack, onSignInWithMicrosoft }: PowerBIMicrosoftLoginProps) {
//     const navigate= useNavigate()
//   return (
//     <div className="min-h-screen bg-[hsl(0,0%,97%)] flex flex-col">
//       <div className="p-4">
//         <button
//           onClick={()=> navigate("/workflow/powerbi-dashboard")}
//           className="flex items-center gap-2 text-sm text-[hsl(0,0%,40%)] hover:opacity-80 transition-opacity"
//         >
//           <ArrowLeft className="w-4 h-4" />
//         Back to dashboard
//         </button>
//       </div>
//       <div className="flex-1 flex items-center justify-center px-4">
//         <div className="w-full max-w-md">
//           <div className="bg-white border border-[hsl(0,0%,90%)] rounded-2xl p-10 shadow-sm space-y-6 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-[hsl(270,80%,60%)] to-[hsl(210,100%,60%)] bg-clip-text text-transparent">Welcome</h2>
//               <p className="text-[hsl(0,0%,45%)] text-sm">Sign in to continue to ReportFlow</p>
//             </div>

//             <Button
//               onClick={onSignInWithMicrosoft}
//               className="w-full h-12 rounded-lg bg-[hsl(214,80%,52%)] hover:bg-[hsl(214,80%,45%)] text-white text-base font-semibold gap-3"
//             >
//               <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
//                 <rect x="1" y="1" width="9" height="9" fill="#F25022" />
//                 <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
//                 <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
//                 <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
//               </svg>
//               Sign in with Microsoft
//               <ExternalLink className="w-4 h-4" />
//             </Button>

//             <p className="text-xs text-[hsl(0,0%,55%)]">
//               By signing in, you agree to our{' '}
//               <span className="underline cursor-pointer">Terms of Service</span> and{' '}
//               <span className="underline cursor-pointer">Privacy Policy</span>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useNavigate } from 'react-router-dom';

// interface PowerBIMicrosoftLoginProps {
//   onBack: () => void;
//   onSignInWithMicrosoft: () => void;
// }

// export function PowerBIMicrosoftLogin({ onBack, onSignInWithMicrosoft }: PowerBIMicrosoftLoginProps) {
//   const navigate = useNavigate();
//   const handleMicrosoftLogin = () => {
//   window.location.href = "https://api.veriton.ai/api/service4/auth/login";
//   // or use fetch + redirect if needed (less common)
// };

//   return (
//     <div className="min-h-screen bg-background flex flex-col ">
//       {/* <div className="p-4">
//         <button
//           onClick={() => navigate("/workflow/powerbi-dashboard")}
//           className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to dashboard
//         </button>
//       </div> */}

//       <div className="pt-28 flex items-center justify-center ">
//         <div className="w-full max-w-md">
//           <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-6 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 Welcome
//               </h2>
//               <p className="text-muted-foreground text-sm">Sign in to continue to ReportFlow</p>
//             </div>

//             <Button
//               onClick={handleMicrosoftLogin }
//               className="w-full h-12 rounded-lg bg-[#2f5496] hover:bg-[#2b4b88] text-white text-base font-semibold gap-3"
//             >
//               <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
//                 <rect x="1" y="1" width="9" height="9" fill="#F25022" />
//                 <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
//                 <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
//                 <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
//               </svg>
//               Sign in with Microsoft
//               <ExternalLink className="w-4 h-4" />
//             </Button>

//             <p className="text-xs text-muted-foreground">
//               By signing in, you agree to our{' '}
//               <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span> and{' '}
//               <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PowerBIMicrosoftLoginProps {
  onBack: () => void;
  onSignInWithMicrosoft: () => void;   // ← we still use this prop (called when already auth'd)
}

export function PowerBIMicrosoftLogin({
  onBack,
  onSignInWithMicrosoft,
}: PowerBIMicrosoftLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('https://api.veriton.ai/api/service4/auth/login', {
        method: 'GET',               // change to POST if your endpoint requires it
        credentials: 'include',      // ← very important: sends cookies/session
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        // e.g. 401 → treat as not logged in
        window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
        return;
      }

      const data = await res.json();

      if (data?.status === 'authenticated') {
        // Already signed in → proceed to next step
        onSignInWithMicrosoft();   // this calls setStep('workspaces') in parent
      } else {
        // Not authenticated → start OAuth flow
        window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      setErrorMsg('Failed to check sign-in status. Trying full login...');
      // Fallback: still try to start login
      setTimeout(() => {
        window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
      }, 1200);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-28 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Welcome
              </h2>
              <p className="text-muted-foreground text-sm">Sign in to continue to ReportFlow</p>
            </div>

            <Button
              onClick={handleClick}
              disabled={isLoading}
              className="w-full h-12 rounded-lg bg-[#2f5496] hover:bg-[#2b4b88] text-white text-base font-semibold gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
              </svg>
              {isLoading ? 'Checking...' : 'Sign in with Microsoft'}
              {!isLoading && <ExternalLink className="w-4 h-4" />}
            </Button>

            {errorMsg && (
              <p className="text-sm text-destructive">{errorMsg}</p>
            )}

            <p className="text-xs text-muted-foreground">
              By signing in, you agree to our{' '}
              <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span> and{' '}
              <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}