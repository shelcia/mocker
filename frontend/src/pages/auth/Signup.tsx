import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { apiAuth } from '../../services/models/authModel';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { CustomLoaderButton } from '../../components/CustomButtons';
import { CustomPwdField } from '../../components/CustomInputFields';
import { ApiStringResponse } from '../../types';

const Signup = () => {
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const userToken = localStorage.getItem('MockAPI-Token');
    const headers = {
      'auth-token': `${userToken}`,
    };
    axios
      .get('https://mocker-backend.vercel.app/api/auth/verify', {
        headers,
      })
      .then((res) => {
        if (res.data.message === 'ok') {
          setHasToken(true);
        }
      })
      .catch((err) => {
        setHasToken(false);
      });
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: '',
    password: '',
    submit: null,
  }; // form field value validation schema

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
    <React.Fragment>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Signup
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        style={{
          width: '100%',
        }}
      >
        <TextField
          label="email"
          size="small"
          type="email"
          sx={{ mb: 2 }}
          fullWidth
          name="email"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.email || ''}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
        />
        <CustomPwdField
          handleBlur={handleBlur}
          handleChange={handleChange}
          values={values}
          touched={touched}
          errors={errors}
        />
        <Button
          variant="contained"
          sx={{ display: 'block', mt: 2, mx: 'auto' }}
          type="submit"
          disabled={loading}
        >
          {loading ? <CustomLoaderButton /> : 'Signup'}
        </Button>
        <Typography variant="h6" component="p" sx={{ my: 2 }}>
          Have an account already ? Then{'  '}
          <Link to="/" style={{ color: 'deepskyblue' }}>
            Login
          </Link>
        </Typography>
      </Box>
    </React.Fragment>
  );
};

export default Signup;
