import React from 'react';

import { CustomLoaderButton, CustomPwdField } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import { cn } from '@/lib/utils';
import { useLoginMutation } from '@/services/auth/auth.queries';
import { logout } from '@/utils';

import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

type LoginFormValues = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useVerifyToken();

  const loginMutation = useLoginMutation({
    onSuccess: ({ userId }) => {
      navigate(`/dashboard/${userId}`);
    },
  });

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
      await loginMutation.mutateAsync(values);
    },
  });

  if (hasToken) {
    return (
      <Button variant="outline" onClick={() => logout(setHasToken, navigate)} className="mt-4">
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
          <CustomPwdField<LoginFormValues>
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
          />

          <div className="flex items-center justify-between">
            <Link
              to="/reset-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" disabled={loginMutation.isPending} className="h-10 w-full">
          {loginMutation.isPending ? <CustomLoaderButton /> : 'Log in'}
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
