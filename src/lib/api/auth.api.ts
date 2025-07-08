import { apiCore } from "./core";
import { User } from "@/store/auth.store";
import {
  LoginRequest,
  LoginResponse,
  loginRequestSchema,
  loginResponseSchema,
  RegisterRequest,
  registerRequestSchema,
  RegisterResponse,
  registerResponseSchema,
} from "@/utils/validations/auth.validation";

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const validatedData = loginRequestSchema.parse(credentials);

    const response = await apiCore.post<LoginResponse>(
      "/auth/login",
      validatedData
    );

    const validatedResponse = loginResponseSchema.parse(response.data);
    return validatedResponse;
  },

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const validatedData = registerRequestSchema.parse(userData);

    const response = await apiCore.post<RegisterResponse>(
      "/auth/register",
      validatedData
    );

    const validatedResponse = registerResponseSchema.parse(response.data);
    return validatedResponse;
  },

  async logout(): Promise<void> {
    await apiCore.post("/auth/logout");
  },

  async getProfile(): Promise<User> {
    const response = await apiCore.get<User>("/profile");
    return response.data;
  },
};
