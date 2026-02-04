import { apiAuth } from '@/services/models/authModel';
import { apiService } from '@/services/models/serviceModel';

export type ApiResponse<T> = { status: string; message: T };

export type LoginSuccessMessage = {
  token: string;
  userId: string;
  emailVerified: boolean;
};

export type AuthRegisterBody = { email: string; password: string };
export type AuthLoginBody = { email: string; password: string };

export const authService = {
  login: async (body: AuthLoginBody) => {
    return (await apiAuth.post(body, 'signin')) as ApiResponse<LoginSuccessMessage | string>;
  },

  register: async (body: AuthRegisterBody) => {
    return (await apiAuth.post(body, 'register')) as ApiResponse<string>;
  },

  verifyEmail: async (id: string) => {
    return (await apiAuth.put({}, `verification/${id}`)) as ApiResponse<string>;
  },

  sendResetLink: async (email: string, fEndUrl: string) => {
    return (await apiService.post({ email, fEndUrl }, 'reset-password')) as ApiResponse<string>;
  },

  changePassword: async (authToken: string, password: string) => {
    return (await apiService.post(
      { password },
      `change-password/${authToken}`,
    )) as ApiResponse<string>;
  },
};
