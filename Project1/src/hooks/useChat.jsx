import { create } from "zustand";


const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const useChat = create((set, get) => ({

  messages: [],
  message: null,
  loading: false,
  cameraZoomed: true,
  mode: "chat",
  audioUnlocked: false,
  setMessages: (messages) => set({ messages }),
  setMessage: (message) => set({ message }),
  setLoading: (loading) => set({ loading }),
  setCameraZoomed: (cameraZoomed) => set({ cameraZoomed }),
  setMode: (mode) => set({ mode }),

  onMessagePlayed: () => {
    set((state) => {
      const newMessages = state.messages.slice(1);
      return {
        messages: newMessages,
        message: newMessages[0] || null, 
      };
    });
  },

  chat: async (message) => {
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

      set((state) => ({
        messages: [...state.messages, ...resp],
        message: state.messages.length === 0 ? resp[0] : state.message,
      }));
    } catch (e) {
      console.error("Error in chat API:", e); 
    }
    set({ loading: false });
  },


  videoElement: null,
  setVideoElement: (videoElement) => set({ videoElement }),
  resultsCallback: null,
  setResultsCallback: (resultsCallback) => set({ resultsCallback }),


  isMimicReady: () => {
    return get().mode === "mimic" && get().videoElement;
  },
}));