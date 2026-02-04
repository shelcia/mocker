import React, { useState } from 'react';

import { CustomLoaderButton, CustomPwdField } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import { useChangePasswordMutation, useSendResetLinkMutation } from '@/services/auth/auth.queries';
import { logout } from '@/utils';

import { useFormik } from 'formik';
import { Link, useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useVerifyToken();
  const { id } = useParams<{ id?: string }>();

  if (hasToken) {
    return (
      <Button onClick={() => logout(setHasToken, navigate)} className="mt-4">
        Logout
      </Button>
    );
  }

  return <>{id ? <SetPasswordForm authToken={id} /> : <VerifyForm />}</>;
};

type SetPasswordFormProps = { authToken: string };

const SetPasswordForm = ({ authToken }: SetPasswordFormProps) => {
  const [isResponse, setIsResponse] = useState(false);
  const [status, setStatus] = useState(false);

  const changePwdMutation = useChangePasswordMutation();

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Minimum 6 characters required').required('Password is required'),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Confirm password should be same'),
  });

  const formik = useFormik({
    initialValues: { password: '', confirmPassword: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsResponse(false);

      const res = await changePwdMutation.mutateAsync({
        authToken,
        password: values.password,
      });

      setStatus(res.status === '200');
      setIsResponse(true);
    },
  });

  const loading = changePwdMutation.isPending;

  return (
    <>
      <h2 className="mb-2 text-lg font-semibold tracking-tight">Change password</h2>

      {isResponse && (
        <div
          className={[
            'rounded-md px-3 py-2 text-sm',
            status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600',
          ].join(' ')}
        >
          {status ? 'Password successfully changed' : 'Failed to reset password'}
        </div>
      )}

      <form noValidate onSubmit={formik.handleSubmit} className="w-full space-y-4">
        {/* Password */}
        <div className="space-y-1">
          <CustomPwdField
            label="Password"
            field="password"
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-xs text-destructive">{String(formik.errors.password)}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <CustomPwdField
            label="Confirm password"
            field="confirmPassword"
            handleBlur={formik.handleBlur}
            handleChange={formik.handleChange}
            values={formik.values}
            touched={formik.touched}
            errors={formik.errors}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-xs text-destructive">{String(formik.errors.confirmPassword)}</p>
          )}
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <CustomLoaderButton /> : 'Reset password'}
        </Button>

        {status && (
          <p className="pt-4 text-center text-sm text-muted-foreground">
            <Link to="/" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        )}
      </form>
    </>
  );
};

const VerifyForm = () => {
  const navigate = useNavigate();

  const [isMailSent, setIsMailSent] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(false);

  const sendLinkMutation = useSendResetLinkMutation();

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  });

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema,
    onSubmit: async (values) => {
      setIsMailSent(false);

      const res = await sendLinkMutation.mutateAsync({
        email: values.email,
        fEndUrl: `${window.location.protocol}//${window.location.host}`,
      });

      setStatus(res.status === '200');
      setIsMailSent(true);
    },
  });

  const loading = sendLinkMutation.isPending;

  return (
    <>
      <h2 className="mb-2 text-lg font-semibold tracking-tight">Reset password</h2>

      <form noValidate onSubmit={formik.handleSubmit} className="w-full space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            name="email"
            value={formik.values.email}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            placeholder="you@example.com"
            className={
              formik.touched.email && formik.errors.email ? 'border-destructive' : 'border-input'
            }
          />

          {formik.touched.email && formik.errors.email && (
            <p className="text-xs text-destructive">{String(formik.errors.email)}</p>
          )}
        </div>

        {/* Mail sent message */}
        {isMailSent && (
          <div
            className={[
              'rounded-md px-3 py-2 text-sm',
              status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600',
            ].join(' ')}
          >
            {status ? 'Verification link sent' : 'Failed to send verification link'}
          </div>
        )}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <CustomLoaderButton /> : 'Verify'}
        </Button>

        <Button type="button" variant="outline" onClick={() => navigate('/')} className="w-full">
          Go Back
        </Button>
      </form>
    </>
  );
};

export default ForgotPassword;
