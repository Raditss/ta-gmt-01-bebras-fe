import { UserRole } from "@/types/user-role";
import {
  LoginRequest,
  RegisterRequest,
} from "@/utils/validations/auth.validation";

export type User = {
  id: number;
  username: string;
  name: string;
  role: UserRole;
};

export interface AuthStoreInterface {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
}
