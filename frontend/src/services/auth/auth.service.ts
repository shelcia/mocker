import { apiAuth } from '@/services/models/authModel';
import { apiService } from '@/services/models/serviceModel';
import { isApiResponse } from '@/types';

export type ApiResponse<T> = { status: string; message: T };

export type LoginSuccessMessage = {
  token: string;
  userId: string;
  emailVerified: boolean;
};

export type AuthRegisterBody = { email: string; password: string };
export type AuthLoginBody = { email: string; password: string };

export const authService = {
  login: async (body: AuthLoginBody): Promise<ApiResponse<LoginSuccessMessage | string>> => {
    const res = await apiAuth.post(body, 'signin');

    if (!isApiResponse(res)) throw new Error('Unexpected response shape from login');

    return res as ApiResponse<LoginSuccessMessage | string>;
  },

  register: async (body: AuthRegisterBody): Promise<ApiResponse<string>> => {
    const res = await apiAuth.post(body, 'register');

    if (!isApiResponse(res)) throw new Error('Unexpected response shape from register');

    return res as ApiResponse<string>;
  },

  verifyEmail: async (id: string): Promise<ApiResponse<string>> => {
    const res = await apiAuth.put({}, `verification/${id}`);

    if (!isApiResponse(res)) throw new Error('Unexpected response shape from verifyEmail');

    return res as ApiResponse<string>;
  },

  sendResetLink: async (email: string, fEndUrl: string): Promise<ApiResponse<string>> => {
    const res = await apiService.post({ email, fEndUrl }, 'reset-password');

    if (!isApiResponse(res)) throw new Error('Unexpected response shape from sendResetLink');

    return res as ApiResponse<string>;
  },

  changePassword: async (authToken: string, password: string): Promise<ApiResponse<string>> => {
    const res = await apiService.post({ password }, `change-password/${authToken}`);

    if (!isApiResponse(res)) throw new Error('Unexpected response shape from changePassword');

    return res as ApiResponse<string>;
  },
};
