import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  address: string;
  profile_pic: string | null;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        // Also sync accessToken with localStorage so axios client can pick it up immediately
        localStorage.setItem("accessToken", accessToken);
        set({ user, accessToken, refreshToken });
      },
      logout: () => {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, refreshToken: null });
      },
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      // getStorage is localStorage by default
    }
  )
);
