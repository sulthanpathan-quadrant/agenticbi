// const BASE_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net";

// let _pendingThread: Promise<any> | null = null;

// /** Called by WorkflowSidebar on click — starts the fetch immediately. */
// export function startCreateThread(): void {
//   const userFromStorage = localStorage.getItem("user")
//     ? JSON.parse(localStorage.getItem("user") || "{}")
//     : null;
//   const userId = userFromStorage?.id || null;
//   const jobId  = localStorage.getItem("current_job_id");

//   if (!userId || !jobId) {
//     _pendingThread = null;
//     return;
//   }

//   _pendingThread = fetch(`${BASE_URL}/create-thread`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ user_id: userId, job_id: jobId }),
//   })
//     .then((r) => r.json())
//     .then((data) => {
//       if (data.thread_id) {
//         localStorage.setItem("current_thread_id", data.thread_id);
//       }
//       if (data.job_id) {
//         localStorage.setItem("current_job_id", data.job_id);
//       }
//       return data;
//     })
//     .catch((err) => {
//       console.error("create-thread failed:", err);
//       return null;
//     })
//     .finally(() => {
//       _pendingThread = null;
//     });
// }

// /** Called by VeritonChatBot on mount — awaits the in-flight promise if any. */
// export function awaitPendingThread(): Promise<any> | null {
//   return _pendingThread;
// }

// ─────────────────────────────────────────────────────────────
// threadManager.ts
// Shared module that holds the in-flight create-thread promise.
// WorkflowSidebar fires it on click; VeritonChatBot awaits it.
// ─────────────────────────────────────────────────────────────

const BASE_URL = "https://veriton-webapp-ezbud7exfzb7g8at.eastus-01.azurewebsites.net";

let _pendingThread: Promise<any> | null = null;

// ✅ NEW: local helper (mirrors the one in VeritonChatBot.tsx) to read the aivolve user
function getAivolveUser() {
  try {
    const raw = localStorage.getItem("aivolve_user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Called by WorkflowSidebar on click — starts the fetch immediately. */
export function startCreateThread(): void {
  const userFromStorage = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;
  const userId = userFromStorage?.id || null;
  const jobId  = localStorage.getItem("current_job_id");

  if (!userId || !jobId) {
    _pendingThread = null;
    return;
  }

  // ✅ NEW: pull email the same way VeritonChatBot does
  const aivolveUser = getAivolveUser();

  _pendingThread = fetch(`${BASE_URL}/create-thread`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      job_id: jobId,
      user_email: aivolveUser?.email || "", // ✅ NEW
    }),
  })
    .then((r) => r.json())
    .then((data) => {
      if (data.thread_id) {
        localStorage.setItem("current_thread_id", data.thread_id);
      }
      if (data.job_id) {
        localStorage.setItem("current_job_id", data.job_id);
      }
      // ✅ NEW: persist session_id from context, same key used by VeritonChatBot
      if (data?.context?.session_id) {
        localStorage.setItem("chatbot_session_id", data.context.session_id);
      }
      return data;
    })
    .catch((err) => {
      console.error("create-thread failed:", err);
      return null;
    })
    .finally(() => {
      _pendingThread = null;
    });
}

/** Called by VeritonChatBot on mount — awaits the in-flight promise if any. */
export function awaitPendingThread(): Promise<any> | null {
  return _pendingThread;
}