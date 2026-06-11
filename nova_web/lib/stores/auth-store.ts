"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";
import { storage } from "@/lib/storage";

interface AuthState {
  user: User | null;
  hydrated: boolean;
  login: (
    username: string,
    password: string
  ) => { ok: true; user: User } | { ok: false; error: string };
  logout: () => void;
  refreshUser: () => void;
  updateUser: (patch: Partial<User>) => void;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,

      login(username, password) {
        const found = storage.findByUsername(username.trim());
        if (!found || found.password !== password) {
          return { ok: false as const, error: "Username atau password salah." };
        }
        set({ user: found });
        return { ok: true as const, user: found };
      },

      logout() {
        set({ user: null });
      },

      refreshUser() {
        const current = get().user;
        if (!current) return;
        const fresh = storage
          .getUsers()
          .find((u) => u.id === current.id);
        if (fresh) set({ user: fresh });
      },

      updateUser(patch) {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...patch };
        storage.updateUser(updated);
        set({ user: updated });
      },

      setHydrated() {
        set({ hydrated: true });
      },
    }),
    {
      name: "nova:session",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
