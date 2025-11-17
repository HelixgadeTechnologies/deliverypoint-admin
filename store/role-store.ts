// store/role-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = "admin" | "super-admin";

interface RoleState {
  role: UserRole;
  setRole: (role: UserRole) => void;
  clearRole: () => void;
}

export const useRoleStore = create<RoleState>()(
  persist(
    (set) => ({
      role: "admin",
      setRole: (role) => set({ role }),
      clearRole: () => set({ role: "admin" }),
    }),
    {
      name: 'user-role-storage', // localStorage key
    }
  )
);