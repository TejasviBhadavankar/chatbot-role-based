import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: "light",
  
  initTheme: (userId) => {
    if (!userId) return;

    const savedTheme =
      localStorage.getItem(`chat-theme-${userId}`) || "light";

    document.documentElement.setAttribute("data-theme", savedTheme);
    set({ theme: savedTheme });
  },

  setTheme: (theme, userId) => {
    if (!userId) return;

    localStorage.setItem(`chat-theme-${userId}`, theme);
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },

  clearTheme: () => {
    document.documentElement.removeAttribute("data-theme");
    set({ theme: "light" });
  },
}));
