import React, { Fragment, type ReactNode, useEffect, useMemo, useState } from 'react';

import { useLocation } from 'react-router-dom';

import Login from '../pages/auth/Login';
import { apiService } from '../services/models/serviceModel';
import type { ApiStringResponse } from '../types';

import AuthLayout from './AuthLayout';

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const location = useLocation();

  const [isExpired, setIsExpired] = useState<boolean | null>(null);

  // -------------------------
  // Check token validity
  // -------------------------
  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem('MockAPI-Token');

    if (!token) {
      setIsExpired(true);

      return;
    }

    apiService
      .getSingle(`auth-token/${token}`, ac.signal)
      .then((res: ApiStringResponse) => {
        setIsExpired(res.status !== '200');
      })
      .catch(() => {
        setIsExpired(true);
      });

    return () => ac.abort();
  }, []);

  // -------------------------
  // Auth state (memoized)
  // -------------------------
  const isAuthenticated = useMemo(() => {
    const tokenExists = Boolean(localStorage.getItem('MockAPI-Token'));

    return tokenExists && isExpired === false;
  }, [isExpired]);

  // -------------------------
  // Loading state while verifying token
  // -------------------------
  if (isExpired === null) {
    return null; // or <Loader /> if you want
  }

  // -------------------------
  // Not authenticated → Login
  // -------------------------
  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  // -------------------------
  // Authenticated → allow access
  // -------------------------
  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
