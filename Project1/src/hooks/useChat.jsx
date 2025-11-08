import { create } from "zustand";

// This is the backend URL. Make sure your backend server is running on this port.
const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

// --- THIS IS THE NEW UNIFIED "BRAIN" ---
export const useChat = create((set, get) => ({
  // --- Project 2 State (Chatbot) ---
  messages: [],
  message: null,
  loading: false,
  cameraZoomed: true,
  mode: "chat", // Default to "chat" mode (camera off)
  setMessages: (messages) => set({ messages }),
  setMessage: (message) => set({ message }),
  setLoading: (loading) => set({ loading }),
  setCameraZoomed: (cameraZoomed) => set({ cameraZoomed }),
  setMode: (mode) => set({ mode }),

  onMessagePlayed: () => {
    set((state) => ({ messages: state.messages.slice(1) }));
  },

  chat: async (message) => {
    console.log("Sending chat message:", message);
    set({ loading: true });
    try {
      const data = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
      const resp = (await data.json()).messages;
      set((state) => ({ messages: [...state.messages, ...resp] }));
    } catch (e) {
      console.error("Error in chat API:", e);
    }
    set({ loading: false });
  },

  // --- Project 1 State (Motion Capture) ---
  videoElement: null,
  setVideoElement: (videoElement) => set({ videoElement }),
  resultsCallback: null,
  setResultsCallback: (resultsCallback) => set({ resultsCallback }),

  // --- Derived State (for convenience) ---
  isMimicReady: () => {
    return get().mode === "mimic" && get().videoElement;
  },
}));

// --- THIS REPLACES THE <ChatProvider> useEffect ---
// This "subscribes" to the messages array.
// When 'messages' changes, this function runs.
// It updates 'message' to be the first item in the array.
useChat.subscribe(
  (state) => state.messages, // The part of state to watch
  (messages) => {
    // The function to run when 'messages' changes
    if (messages.length > 0) {
      useChat.getState().setMessage(messages[0]);
    } else {
      useChat.getState().setMessage(null);
    }
  }
);