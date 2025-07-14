import { UserRole } from '@/types/user-role';
import { UserStatus } from '@/types/user-status.type';
import {
  LoginRequest,
  RegisterRequest
} from '@/utils/validations/auth.validation';
import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';
import { authApi } from '@/lib/api';

export type User = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  verifiedAt: Date | string | null;
};

export interface AuthStoreInterface {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthStoreInterface>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setHydrated: (hydrated: boolean) => {
        set({ isHydrated: hydrated });
      },

      login: async (credentials: LoginRequest) => {
        try {
          const response = await authApi.login(credentials);
          if (response.accessToken) {
            set({
              user: response.user.props,
              token: response.accessToken,
              isAuthenticated: true
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },

      register: async (userData: RegisterRequest) => {
        try {
          const response = await authApi.register(userData);
          if (response.user.props) {
            return true;
          }
          return false;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      logout: async () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false
        });
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated when the store is rehydrated from localStorage
        if (state) {
          state.setHydrated(true);
        }
      }
    }
  )
);
