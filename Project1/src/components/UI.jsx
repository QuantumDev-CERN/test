import { useRef } from "react";
import { useChat } from "../hooks/useChat"; // <-- 1. Import our new unified hook

export const UI = () => {
  // --- Logic from Project 2 ---
  const input = useRef();
  // Get the state we need from our unified store
  const { chat, loading, message, mode } = useChat(); // <-- 2. Get the 'mode'
  
  // --- THIS IS THE FIX ---
  const set = useChat.setState; // <-- Use setState from the hook
  // --- END OF FIX ---

  const sendMessage = () => {
    const text = input.current.value;

    // --- AUDIO UNLOCK FIX ---
    if (!useChat.getState().audioUnlocked) {
      // A tiny, silent WAV file
      const dummyAudio = new Audio(
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYBAACABAAZGF0YQAAAAA="
      );
      dummyAudio
        .play()
        .then(() => {
          console.log("Audio context unlocked!");
          set({ audioUnlocked: true }); // This will now work
        })
        .catch((e) => {
          console.error("Audio unlock failed:", e);
        });
    }
    // --- END OF FIX ---

    // Check if we're busy, and also if the input isn't empty
    if (!loading && !message && text.trim()) {
      chat(text);
      input.current.value = "";
    }
  };

  return (
    <section className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      {/* --- UI from Project 1 (Logo) --- */}
      <div className="absolute top-4 left-4 md:top-8 md:left-14 opacity-0 animate-fade-in-down animation-delay-200 pointer-events-auto">
        <a href="https://wawasensei.dev" target="_blank">
          <img
            src="/images/wawasensei-white.png"
            alt="Wawa Sensei logo"
            className="w-20 h-20 object-contain"
          />
        </a>
      </div>

      {/* --- UI from Project 1 (Text) --- */}
      <div className="absolute left-4 md:left-15 -translate-x-1/2 -rotate-90 flex items-center gap-4 animation-delay-1500 animate-fade-in-down opacity-0">
        <div className="w-20 h-px bg-white/60"></div>
        <p className="text-white/60 text-xs">🎙️ Become a pop star ⭐️</p>
      </div>

      {/* --- UI from Project 2 (Chat Box) --- */}
      {/* 3. This is the key: only show if mode === 'chat' */}
      {mode === "chat" && (
        <div className="absolute bottom-10 left-0 right-0 z-20 pointer-events-auto">
          <div className="flex items-center gap-2 pointer-events-auto max-w-screen-sm w-full mx-auto p-4">
            <input
              ref={input}
              className="w-full placeholder:text-gray-500 placeholder:italic p-4 rounded-full bg-white/80 backdrop-blur-md shadow-lg text-black"
              placeholder="Say something..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <button
              className={`flex-shrink-0 p-4 rounded-full bg-indigo-400 hover:bg-indigo-700 shadow-lg transition-colors ${
                loading || message ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={sendMessage}
              disabled={loading || message}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.875L6 12z"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};