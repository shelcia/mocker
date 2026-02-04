import React from 'react';

import { CustomLoaderButton, CustomPwdField } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import { useRegisterMutation } from '@/services/auth/auth.queries';
import { logout } from '@/utils';

import { useFormik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

type SignupFormValues = {
  email: string;
  password: string;
  submit: null;
};

const Signup = () => {
  const [hasToken, setHasToken] = useVerifyToken();
  const navigate = useNavigate();

  const registerMutation = useRegisterMutation({
    onSuccess: () => navigate('/'),
  });

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters required').required('Password is required'),
  });

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      email: '',
      password: '',
      submit: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      await registerMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
    },
  });

  if (hasToken) {
    return (
      <Button variant="default" onClick={() => logout(setHasToken, navigate)} className="mt-4">
        Logout
      </Button>
    );
  }

  return (
    <>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Generate mock APIs in minutes</p>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={
              formik.touched.email && formik.errors.email
                ? 'border-destructive focus-visible:ring-destructive'
                : ''
            }
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-destructive">{formik.errors.email}</p>
          )}
        </div>

        <CustomPwdField<SignupFormValues>
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          values={formik.values}
          touched={formik.touched}
          errors={formik.errors}
        />

        <Button type="submit" disabled={registerMutation.isPending} className="w-full">
          {registerMutation.isPending ? <CustomLoaderButton /> : 'Create account'}
        </Button>

        <p className="text-sm text-muted-foreground">
          Have an account already?{' '}
          <Link to="/" className="font-medium text-foreground underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </>
  );
};

export default Signup;
