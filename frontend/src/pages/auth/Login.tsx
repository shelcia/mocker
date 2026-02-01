import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import { apiAuth } from '../../services/models/authModel';
import { apiProvider } from '../../services/utilities/provider';
import { CustomLoaderButton } from '../../components/CustomButtons';
import { CustomPwdField } from '../../components/CustomInputFields';

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
      <Button variant="contained" onClick={logout} sx={{ mt: 4 }}>
        Logout
      </Button>
    );
  }

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Login
      </Typography>

      <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
        <TextField
          label="email"
          size="small"
          type="email"
          sx={{ mb: 2 }}
          fullWidth
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.email}
          error={Boolean(formik.touched.email && formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />

        <CustomPwdField
          handleBlur={formik.handleBlur}
          handleChange={formik.handleChange}
          values={formik.values}
          touched={formik.touched}
          errors={formik.errors}
        />

        <Button
          variant="contained"
          sx={{ display: 'block', mt: 2, mx: 'auto' }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CustomLoaderButton /> : 'Login'}
        </Button>

        <Typography variant="h6" component="p" sx={{ mt: 2, mb: 1 }}>
          Don&apos;t have an account ? Then{' '}
          <Link to="/signup" style={{ color: 'deepskyblue' }}>
            Signup
          </Link>
        </Typography>

        <Typography variant="h6" component="p">
          <Link to="/reset-password" style={{ color: 'deepskyblue' }}>
            Forgot password ?
          </Link>
        </Typography>
      </Box>
    </>
  );
};

export default Login;
