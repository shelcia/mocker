import { useState } from 'react';

import { CustomLoaderButton, CustomPwdField } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import { cn } from '@/lib/utils';
import { apiAuth } from '@/services/models/authModel';
import { apiProvider } from '@/services/utilities/provider';
import { logout } from '@/utils';

import { useFormik } from 'formik';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

type LoginFormValues = {
  email: string;
  password: string;
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

  const [hasToken, setHasToken] = useVerifyToken();
  const [loading, setLoading] = useState<boolean>(false);

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
          <CustomPwdField
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
