import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface EmailState {
  email: string | null;
  setEmail: (email: string) => void;
}

export const useEmailStore = create<EmailState>()(
  persist(
    (set) => ({
      email: null,
      setEmail: (email: string) => set({ email }),
    }),
    {
      name: "user-email",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
