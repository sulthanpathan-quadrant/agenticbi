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


// import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useState } from 'react';

// interface PowerBIMicrosoftLoginProps {
//   onBack: () => void;
//   onSignInWithMicrosoft: () => void;   // ← we still use this prop (called when already auth'd)
// }

// export function PowerBIMicrosoftLogin({
//   onBack,
//   onSignInWithMicrosoft,
// }: PowerBIMicrosoftLoginProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   const handleClick = async () => {
//     setIsLoading(true);
//     setErrorMsg(null);

//     try {
//       const res = await fetch('https://api.veriton.ai/api/service4/auth/login', {
//         method: 'GET',               // change to POST if your endpoint requires it
//         credentials: 'include',      // ← very important: sends cookies/session
//         headers: {
//           Accept: 'application/json',
//         },
//       });

//       if (!res.ok) {
//         // e.g. 401 → treat as not logged in
//         window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
//         return;
//       }

//       const data = await res.json();

//       if (data?.status === 'authenticated') {
//         // Already signed in → proceed to next step
//         onSignInWithMicrosoft();   // this calls setStep('workspaces') in parent
//       } else {
//         // Not authenticated → start OAuth flow
//         window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
//       }
//     } catch (err) {
//       console.error('Auth check failed:', err);
//       setErrorMsg('Failed to check sign-in status. Trying full login...');
//       // Fallback: still try to start login
//       setTimeout(() => {
//         window.location.href = 'https://api.veriton.ai/api/service4/auth/login';
//       }, 1200);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <div className="pt-28 flex items-center justify-center">
//         <div className="w-full max-w-md">
//           <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-6 text-center">
//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 Welcome
//               </h2>
//               <p className="text-muted-foreground text-sm">Sign in to continue to ReportFlow</p>
//             </div>

//             <Button
//               onClick={handleClick}
//               disabled={isLoading}
//               className="w-full h-12 rounded-lg bg-[#2f5496] hover:bg-[#2b4b88] text-white text-base font-semibold gap-3"
//             >
//               <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
//                 <rect x="1" y="1" width="9" height="9" fill="#F25022" />
//                 <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
//                 <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
//                 <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
//               </svg>
//               {isLoading ? 'Checking...' : 'Sign in with Microsoft'}
//               {!isLoading && <ExternalLink className="w-4 h-4" />}
//             </Button>

//             {errorMsg && (
//               <p className="text-sm text-destructive">{errorMsg}</p>
//             )}

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


// import { ArrowLeft, ExternalLink } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useState, useEffect } from 'react';

// interface PowerBIMicrosoftLoginProps {
//   onBack: () => void;
//   onSignInWithMicrosoft: () => void;   // called when auth is confirmed → usually sets step to 'workspaces'
// }

// export function PowerBIMicrosoftLogin({
//   onBack,
//   onSignInWithMicrosoft,
// }: PowerBIMicrosoftLoginProps) {
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPolling, setIsPolling] = useState(false);
//   const [errorMsg, setErrorMsg] = useState<string | null>(null);

//   // Adjust these values to your preference
//   const POLL_INTERVAL_MS = 2500;     // how often to check status
//   const POPUP_WIDTH = 520;
//   const POPUP_HEIGHT = 680;

//   const checkAuthStatus = async (): Promise<boolean> => {
//     try {
//       const res = await fetch('https://api.veriton.ai/api/service4/auth/me', {
//         method: 'GET',
       
//         headers: {
//           Accept: 'application/json',
//         },
//       });

//       if (!res.ok) return false;

//       const data = await res.json();
//       return data?.status === 'authenticated';
//     } catch (err) {
//       console.warn('Auth status check failed:', err);
//       return false;
//     }
//   };

//   const startPolling = () => {
//     setIsPolling(true);

//     const interval = setInterval(async () => {
//       const isAuth = await checkAuthStatus();

//       if (isAuth) {
//         clearInterval(interval);
//         setIsPolling(false);
//         setIsLoading(false);
//         onSignInWithMicrosoft();           // → navigate to workspaces
//       }
//     }, POLL_INTERVAL_MS);

//     // Cleanup on unmount or when we stop polling manually
//     return () => clearInterval(interval);
//   };

//   const openLoginPopup = () => {
//     // Center the popup on screen
//     const left = window.screenX + (window.outerWidth - POPUP_WIDTH) / 2;
//     const top = window.screenY + (window.outerHeight - POPUP_HEIGHT) / 2 - 50;

//     const popup = window.open(
//       'https://api.veriton.ai/api/service4/auth/login',
//       'MicrosoftLogin',
//       `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},resizable=yes,scrollbars=yes`
//     );

//     if (!popup || popup.closed || typeof popup.closed === 'undefined') {
//       setErrorMsg('Popup was blocked. Please allow popups for this site.');
//       setIsLoading(false);
//       return;
//     }

//     setIsPolling(true);
//     setErrorMsg(null);

//     // Start polling immediately
//     const cleanup = startPolling();

//     // Also detect if user closed popup manually
//     const timer = setInterval(() => {
//       if (popup.closed) {
//         clearInterval(timer);
//         cleanup();
//         setIsPolling(false);
//         setIsLoading(false);
//         setErrorMsg('Login window was closed. Please try again.');
//       }
//     }, 1000);

//     // Optional: you can also listen for popup postMessage if backend supports it
//   };

//   const handleSignInClick = async () => {
//     setIsLoading(true);
//     setErrorMsg(null);

//     // First check if already signed in (cookie/session exists)
//     const alreadyAuth = await checkAuthStatus();

//     if (alreadyAuth) {
//       onSignInWithMicrosoft();
//       setIsLoading(false);
//       return;
//     }

//     // Not logged in → open popup + start polling
//     openLoginPopup();
//     // isLoading stays true until polling finishes or errors out
//   };

//   // Optional: stop polling if component unmounts while polling
//   useEffect(() => {
//     return () => {
//       setIsPolling(false);
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <div className="pt-28 flex items-center justify-center">
//         <div className="w-full max-w-md">
//           <div className="bg-card border border-border rounded-2xl p-10 shadow-sm space-y-6 text-center">

//             <div className="space-y-2">
//               <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                 Welcome
//               </h2>
//               <p className="text-muted-foreground text-sm">Sign in to continue to ReportFlow</p>
//             </div>

//             {isPolling ? (
//               <div className="space-y-6 py-4">
//                 <p className="text-base font-medium">
//                   Waiting for authentication...
//                 </p>
//                 <div className="animate-pulse flex justify-center">
//                   <div className="h-3 w-3 bg-primary rounded-full mx-1"></div>
//                   <div className="h-3 w-3 bg-primary rounded-full mx-1 animation-delay-150"></div>
//                   <div className="h-3 w-3 bg-primary rounded-full mx-1 animation-delay-300"></div>
//                 </div>

//                 <Button
//                   variant="outline"
//                   onClick={() => {
//                     setIsPolling(false);
//                     setIsLoading(false);
//                   }}
//                   className="gap-2"
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back to application
//                 </Button>

//                 <p className="text-xs text-muted-foreground">
//                   Complete sign-in in the popup window
//                 </p>
//               </div>
//             ) : (
//               <Button
//                 onClick={handleSignInClick}
//                 disabled={isLoading}
//                 className="w-full h-12 rounded-lg bg-[#2f5496] hover:bg-[#2b4b88] text-white text-base font-semibold gap-3"
//               >
//                 <svg className="w-5 h-5" viewBox="0 0 21 21" fill="none">
//                   <rect x="1" y="1" width="9" height="9" fill="#F25022" />
//                   <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
//                   <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
//                   <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
//                 </svg>
//                 {isLoading ? 'Checking...' : 'Sign in with Microsoft'}
//                 {!isLoading && <ExternalLink className="w-4 h-4" />}
//               </Button>
//             )}

//             {errorMsg && (
//               <p className="text-sm text-destructive pt-2">{errorMsg}</p>
//             )}

//             <p className="text-xs text-muted-foreground pt-4">
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
import { useState, useEffect, useRef } from 'react';

interface PowerBIMicrosoftLoginProps {
  onBack: () => void;
  onSignInWithMicrosoft: () => void;
}

export function PowerBIMicrosoftLogin({
  onBack,
  onSignInWithMicrosoft,
}: PowerBIMicrosoftLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const POLL_INTERVAL_MS = 2500;
  const MAX_POLL_ATTEMPTS = 10;           // ≈ 75 seconds
  const MAX_POLL_DURATION_MS = 120_000;   // hard cap 2 minutes

  const pollCountRef = useRef(0);
  const pollStartTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

//   const checkAuthStatus = async (): Promise<boolean> => {
//     try {
//       const res = await fetch('https://api.veriton.ai/api/service4/auth/me', {
//         method: 'GET',
     
//         headers: { Accept: 'application/json' },
//       });

//       if (!res.ok) return false;

//       const data = await res.json();
//       return data?.status === 'authenticated';
//     } catch {
//       return false;
//     }
//   };

// const checkAuthStatus = async (): Promise<boolean> => {
//   try {
//     const res = await fetch('https://api.veriton.ai/api/service4/auth/me', {
//       method: 'GET',
              
//       headers: {
//         'Accept': 'application/json',
//       },
//     });

//     // Optional: Log for debugging (remove later)
//     console.log('Auth check status:', res.status);

//     if (!res.ok) {
//       // 401/403 likely means not yet authenticated
//       return false;
//     }

//     const data = await res.json();
//     console.log('Auth response data:', data); // Debug

//     // Adjust based on your actual response shape
//     return data?.status === 'authenticated' || data?.authenticated === true;
//   } catch (err) {
//     console.error('Auth check failed:', err);
//     return false;
//   }
// };


const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const res = await fetch('https://api.veriton.ai/api/service4/auth/me', {
      method: 'GET',
      credentials: 'include',             // ← Add this
      headers: {
        'Accept': 'application/json',
      },
    });

    console.log('Status:', res.status);
    console.log('Cookies sent?', document.cookie); // won't show HttpOnly, but good sanity check

    if (!res.ok) return false;

    const data = await res.json();
    console.log('Data:', data);

    return data?.status === 'authenticated' || data?.authenticated === true;
  } catch (err) {
    console.error(err);
    return false;
  }
};



  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
    setIsLoading(false);
    pollCountRef.current = 0;
    pollStartTimeRef.current = null;
  };

  const startPolling = () => {
    setIsPolling(true);
    setErrorMsg(null);
    pollCountRef.current = 0;
    pollStartTimeRef.current = Date.now();

    intervalRef.current = setInterval(async () => {
      pollCountRef.current += 1;

      const elapsed = pollStartTimeRef.current
        ? Date.now() - pollStartTimeRef.current
        : 0;

      // Safety limits
      if (pollCountRef.current >= MAX_POLL_ATTEMPTS || elapsed >= MAX_POLL_DURATION_MS) {
        stopPolling();
        setErrorMsg(
          'Authentication check timed out. Please try again or check if login was completed.'
        );
        return;
      }

      const isAuth = await checkAuthStatus();

      if (isAuth) {
        stopPolling();
        onSignInWithMicrosoft(); // → go to workspaces
      }
    }, POLL_INTERVAL_MS);
  };

  const openLoginPopup = () => {
    const width = 520;
    const height = 680;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2 - 50;

    const popup = window.open(
      'https://api.veriton.ai/api/service4/auth/login',
      'MicrosoftLogin',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      setErrorMsg('Popup blocked. Please allow popups for this site.');
      setIsLoading(false);
      return;
    }

    // Start polling right after popup opens
    startPolling();

    // Watch for manual popup close
    const closeChecker = setInterval(() => {
      if (popup.closed) {
        clearInterval(closeChecker);
        if (isPolling) {
          stopPolling();
          setErrorMsg('Login window was closed before authentication completed.');
        }
      }
    }, 1200);

    // Cleanup when component unmounts
    return () => clearInterval(closeChecker);
  };

  const handleSignInClick = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const alreadyAuth = await checkAuthStatus();

    if (alreadyAuth) {
      setIsLoading(false);
      onSignInWithMicrosoft();
      return;
    }

    // Open popup + polling
    openLoginPopup();
    // isLoading stays true while polling is active
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

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

            {isPolling ? (
              <div className="space-y-6 py-4">
                <p className="text-base font-medium">
                  Waiting for you to sign in...
                </p>
                <div className="flex justify-center gap-2">
                  <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-3 w-3 bg-primary rounded-full animate-bounce"></div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {pollCountRef.current > 0 &&
                    `Checking... (attempt ${pollCountRef.current}/${MAX_POLL_ATTEMPTS})`}
                </p>

                <Button
                  variant="outline"
                  onClick={() => {
                    stopPolling();
                    setErrorMsg(null);
                  }}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Cancel & back
                </Button>

                <p className="text-xs text-muted-foreground pt-2">
                  Complete sign-in in the opened window
                </p>
              </div>
            ) : (
              <Button
                onClick={handleSignInClick}
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
            )}

            {errorMsg && (
              <p className="text-sm text-destructive pt-2">{errorMsg}</p>
            )}

            <p className="text-xs text-muted-foreground pt-4">
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