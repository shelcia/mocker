import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { authService } from './auth.service';
import { authToken } from './auth.token';

export const authKeys = {
  all: ['auth'] as const,
  verify: (id: string) => [...authKeys.all, 'verify', id] as const,
};

export function useLoginMutation(opts?: {
  // eslint-disable-next-line no-unused-vars
  onSuccess?: (data: { userId: string }) => void;
}) {
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      if (res.status !== '200') {
        toast.error(typeof res.message === 'string' ? res.message : 'Login failed');

        return;
      }

      const msg = res.message as any;

      if (!msg.emailVerified) {
        toast.error('Email not verified yet! Please check your inbox.');

        return;
      }

      authToken.set(msg.token);
      opts?.onSuccess?.({ userId: msg.userId });
    },
    onError: () => toast.error('Error'),
  });
}

export function useRegisterMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (res) => {
      if (res.status === '200') {
        toast.success('We sent a verification email. Verify and come back.');
        opts?.onSuccess?.();

        return;
      }

      toast.error(String(res.message));
    },
    onError: () => toast.error('Error'),
  });
}

export function useVerifyEmailMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: authService.verifyEmail,
    onSuccess: (res) => {
      if (res.status === '200') {
        toast.success('Verified successfully');
        opts?.onSuccess?.();

        return;
      }

      toast.error('Verification failed');
    },
    onError: () => toast.error('Verification failed'),
  });
}

export function useSendResetLinkMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: ({ email, fEndUrl }: { email: string; fEndUrl: string }) =>
      authService.sendResetLink(email, fEndUrl),
    onSuccess: (res) => {
      if (res.status === '200') {
        toast.success('Reset password link sent');
        opts?.onSuccess?.();

        return;
      }

      toast.error(String(res.message));
    },
    onError: () => toast.error('Error'),
  });
}

export function useChangePasswordMutation(opts?: { onSuccess?: () => void }) {
  return useMutation({
    mutationFn: ({ authToken, password }: { authToken: string; password: string }) =>
      authService.changePassword(authToken, password),
    onSuccess: (res) => {
      if (res.status === '200') {
        toast.success('Successfully reset');
        opts?.onSuccess?.();

        return;
      }

      toast.error(String(res.message));
    },
    onError: () => toast.error('Error'),
  });
}
