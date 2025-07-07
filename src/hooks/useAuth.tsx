import {create} from "zustand/index";
import {AuthStoreInterface} from "@/store/auth-store";
import {createJSONStorage, persist} from "zustand/middleware";
import {LoginRequest, RegisterRequest} from "@/utils/validations/auth.validation";
import {authApi} from "@/lib/api";

export const useAuth = create<AuthStoreInterface>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (credentials: LoginRequest) => {
                try {
                    const response = await authApi.login(credentials);
                    if (response.accessToken) {
                        set({
                            user: response.user.props,
                            token: response.accessToken,
                            isAuthenticated: true,
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
                await authApi.logout();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);