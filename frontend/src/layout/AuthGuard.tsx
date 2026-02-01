import React, { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { apiService } from '../services/models/serviceModel';
import Login from '../pages/auth/Login';
import AuthLayout from './AuthLayout';
import { ApiStringResponse } from '../types';

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
