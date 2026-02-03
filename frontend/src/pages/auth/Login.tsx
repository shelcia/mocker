import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { apiAuth } from '../../services/models/authModel';
import { apiProvider } from '../../services/utilities/provider';
import { CustomLoaderButton } from '../../components/CustomButtons';
import { CustomPwdField } from '../../components/CustomInputFields';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LoginFormValues = {
  email: string;
  password: string;
};

type VerifyResponse = {
  message: string;
};

type LoginSuccessMessage = {
  emailVerified: boolean;
  token: string;
  userId: string;
};

type ApiResponse<T> = {
  status: string;
  message: T;
};

const Login = () => {
  const navigate = useNavigate();

  const [hasToken, setHasToken] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Verify existing token
  useEffect(() => {
    const ac = new AbortController();

    const userToken = localStorage.getItem('MockAPI-Token');
    if (!userToken) {
      setHasToken(false);
      return;
    }

    axios
      .get<VerifyResponse>('https://mocker-backend.vercel.app/api/auth/verify', {
        headers: { 'auth-token': userToken },
        signal: ac.signal,
      })
      .then((res) => {
        setHasToken(res.data?.message === 'ok');
      })
      .catch(() => {
        setHasToken(false);
      });

    return () => ac.abort();
  }, []);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Must be a valid email')
      .max(255, 'Too long')
      .required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters required').required('Password is required'),
  });

  const formik = useFormik<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      await loginUser(values.email, values.password);
    },
  });

  const loginUser = async (email: string, password: string) => {
    const body = { email, password };

    try {
      const res = (await apiAuth.post(body, 'signin')) as ApiResponse<LoginSuccessMessage | string>;

      if (res.status === '200') {
        // message is an object on success
        const msg = res.message as LoginSuccessMessage;

        if (!msg.emailVerified) {
          toast.error('Email not verified yet!. Please check your inbox for verification');
          return;
        }

        localStorage.setItem('MockAPI-Token', msg.token);
        apiProvider.updateToken();

        toast.success('Login successful');
        navigate(`/dashboard/${msg.userId}`);
        return;
      }

      if (res.status === '400') {
        toast.error(typeof res.message === 'string' ? res.message : 'Bad request');
        return;
      }

      toast.error('Error');
    } catch (err) {
      console.error(err);
      toast.error('Error');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setHasToken(false);
    navigate('/');
  };

  if (hasToken) {
    return (
      <Button variant="outline" onClick={logout} className="mt-4">
        Logout
      </Button>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Log in to create projects and generate mock endpoints.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@domain.com"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              'h-10 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none',
              'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              formik.touched.email && formik.errors.email ? 'border-destructive' : 'border-input',
            )}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="text-xs text-destructive">{formik.errors.email}</p>
          ) : null}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>

            <Link
              to="/reset-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <CustomPwdField
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className={[
            'inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium',
            'bg-primary text-primary-foreground shadow hover:bg-primary/90',
            'disabled:pointer-events-none disabled:opacity-50',
          ].join(' ')}
        >
          {loading ? <CustomLoaderButton /> : 'Log in'}
        </Button>

        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </>
  );
};

export default Login;
