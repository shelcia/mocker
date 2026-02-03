import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiService } from '../../services/models/serviceModel';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CustomLoaderButton } from '../../components/CustomButtons';
import { ApiStringResponse } from '../../types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import { Eye, EyeOff } from 'lucide-react';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [hasToken, setHasToken] = useVerifyToken();

  const { id } = useParams();
  const logout = () => {
    localStorage.clear();
    setHasToken(false);
    navigate('/');
  };

  if (hasToken) {
    return (
      <Button onClick={logout} className="mt-4">
        Logout
      </Button>
    );
  }
  return (
    <React.Fragment>{id ? <SetPasswordForm auth_token={id} /> : <VerifyForm />}</React.Fragment>
  );
};

const SetPasswordForm = ({ auth_token }) => {
  const [loading, setLoading] = useState(false);
  const [isResponse, setIsResponse] = useState(false);
  const [status, setStatus] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const initialValues = {
    password: '',
    confirmPassword: '',
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    password: Yup.string().min(6, 'Minimum 6 characters required').required('Password is required'),
    confirmPassword: Yup.string().when('password', {
      is: (password: string | undefined) => !!password,
      then: (schema) => schema.oneOf([Yup.ref('password')], 'Confirm password should be same'),
      otherwise: (schema) => schema,
    }),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setIsResponse(false);
      resetPassword(values.confirmPassword);
    },
  });

  const resetPassword = (password) => {
    const body = {
      password: password,
    };

    apiService.post(body, `change-password/${auth_token}`).then((res: ApiStringResponse) => {
      if (res.status === '200') {
        toast.success('Successfully reset');
        setStatus(true);
      } else if (res.status === '400') {
        toast.error(res.message);
        setStatus(false);
      } else {
        toast.error('Error');
        setStatus(false);
      }
      setLoading(false);
      setIsResponse(true);
    });
  };

  return (
    <>
      <h2 className="mb-2 text-lg font-semibold tracking-tight">Change password</h2>

      <form noValidate onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Password */}
        <div className="space-y-1">
          <label className="text-sm font-medium">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={values.password || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`h-10 w-full rounded-md border px-3 pr-10 text-sm outline-none transition
            ${
              touched.password && errors.password
                ? 'border-destructive focus:ring-destructive'
                : 'border-input focus:ring-primary'
            }
          `}
            />

            <Button
              onClick={handleClickShowPassword}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          {touched.password && errors.password && (
            <p className="text-xs text-destructive">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">Confirm password</Label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={values.confirmPassword || ''}
              onBlur={handleBlur}
              onChange={handleChange}
              className={`h-10 w-full rounded-md border px-3 pr-10 text-sm outline-none transition
            ${
              touched.confirmPassword && errors.confirmPassword
                ? 'border-destructive focus:ring-destructive'
                : 'border-input focus:ring-primary'
            }
          `}
            />

            <Button
              type="button"
              onClick={handleClickShowConfirmPassword}
              className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          {touched.confirmPassword && errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        {/* Response message */}
        {isResponse && (
          <div
            className={`rounded-md px-3 py-2 text-sm ${
              status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
            }`}
          >
            {status ? 'Password successfully changed' : 'Failed to reset password'}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <CustomLoaderButton /> : 'Reset password'}
        </Button>

        {/* Back to login */}
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

  const [loading, setLoading] = useState(false);
  const [isMailSent, setIsMailSent] = useState(false);
  const [status, setStatus] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  }; // form field value validation schema

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      setIsMailSent(false);
      sendLink(values.email);
    },
  });

  const sendLink = (email) => {
    const body = {
      email: email,
      fEndUrl: location.protocol + '//' + location.host,
    };

    apiService.post(body, 'reset-password').then((res: ApiStringResponse) => {
      if (res.status === '200') {
        setStatus(true);
        toast.success('Reset Password link sent');
      } else if (res.status === '400') {
        toast.error(res.message);
        setStatus(false);
      } else {
        toast.error('Error');
        setStatus(false);
      }
      setLoading(false);
      setIsMailSent(true);
    });
  };

  return (
    <>
      <h2 className="mb-2 text-lg font-semibold tracking-tight">Reset password</h2>

      <form noValidate onSubmit={handleSubmit} className="w-full space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <Label className="text-sm font-medium">Email</Label>

          <Input
            type="email"
            name="email"
            value={values.email || ''}
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`h-10 w-full rounded-md border px-3 text-sm outline-none transition
          ${
            touched.email && errors.email
              ? 'border-destructive focus:ring-destructive'
              : 'border-input focus:ring-primary'
          }`}
          />

          {touched.email && errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        {/* Mail sent message */}
        {isMailSent && (
          <div
            className={`rounded-md px-3 py-2 text-sm ${
              status ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
            }`}
          >
            {status ? 'Verification link sent' : 'Failed to send verification link'}
          </div>
        )}

        {/* Verify button */}
        <Button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <CustomLoaderButton /> : 'Verify'}
        </Button>

        {/* Go back */}
        <Button
          onClick={() => navigate('/')}
          className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background text-sm font-medium transition hover:bg-accent"
        >
          Go Back
        </Button>
      </form>
    </>
  );
};

export default ForgotPassword;
