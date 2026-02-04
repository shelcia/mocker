import React, { useState } from 'react';

import { CustomLoaderButton } from '@/components/common';
import { CustomPwdField } from '@/components/CustomInputFields';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useVerifyToken } from '@/hooks/useVerifyToken';
import type { ApiStringResponse } from '@/types';

import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

import { apiAuth } from '../../services/models/authModel';
import { logout } from '@/utils';

const Signup = () => {
  const [hasToken, setHasToken] = useVerifyToken();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
    password: Yup.string().min(6, 'Minimum 6 characters required').required('Password is required'),
  });

  const { errors, values, touched, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      registerUser(values.email, values.password);
    },
  });

  const registerUser = (email, password) => {
    const body = {
      email: email,
      password: password,
    };

    apiAuth.post(body, 'register').then((res: ApiStringResponse) => {
      if (res.status === '200') {
        navigate('/');
        toast.success('We have sent you verification mail. Please verify and come back');
      } else if (res.status === '400') {
        toast.error(res.message);
      } else {
        toast.error('Error');
      }

      setLoading(false);
    });
  };

  if (hasToken) {
    return (
      <Button variant="default" onClick={() => logout(setHasToken, navigate)} className="mt-4">
        Logout
      </Button>
    );
  }

  return (
    <React.Fragment>
      <div className="mb-6 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">Generate mock APIs in minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={values.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 ${
              touched.email && errors.email
                ? 'border-destructive focus:ring-destructive'
                : 'border-input focus:ring-ring'
            }`}
          />
          {touched.email && errors.email && (
            <p className="text-xs text-destructive">{errors.email}</p>
          )}
        </div>

        <CustomPwdField
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          touched={touched}
          errors={errors}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {loading ? <CustomLoaderButton /> : 'Create account'}
        </Button>
        <p className="text-sm text-muted-foreground">
          Have an account already ? Then{'  '}
          <Link to="/" className="font-medium text-foreground underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </React.Fragment>
  );
};

export default Signup;
