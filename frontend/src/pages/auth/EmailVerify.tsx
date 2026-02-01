import React, { useEffect, useState } from 'react';
import { Container, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { apiAuth } from '../../services/models/authModel';
import { CustomTypoDisplay } from '../../components/CustomDisplay';
import { ApiStringResponse } from '../../types';

const EmailVerify = () => {
  const { id } = useParams();

  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<string>('200');

  const navigate = useNavigate();

  useEffect(() => {
    apiAuth.put({}, `verification/${id}`).then((res: ApiStringResponse) => {
      //   console.log(res);
      if (res.status === '200') {
        setMessage('Verified Sucessfully');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setStatus(res.status);
        setMessage('Verification Failed');
      }
    });
  }, []);

  return (
    <Container>
      <Paper elevation={4}>
        <CustomTypoDisplay status={status === '200'}>{message}</CustomTypoDisplay>
      </Paper>
    </Container>
  );
};

export default EmailVerify;
