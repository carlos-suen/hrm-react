import { create } from "zustand";
import { persist } from "zustand/middleware";

// 用戶信息（與後端 sanitizeUser 對齊）
export interface AuthUser {
  id: number;
  username: string;
  nickname: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  is_login: boolean;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

// 單 token 機制：持久化 token 與 is_login
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      is_login: false,
      user: null,
      setAuth: (token, user) => set({ token, user, is_login: true }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null, is_login: false }),
    }),
    {
      name: "hrm-auth",
      // 僅持久化必要欄位
      partialize: (state) => ({
        token: state.token,
        is_login: state.is_login,
        user: state.user,
      }),
    },
  ),
);
