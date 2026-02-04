import React, { useEffect, useState } from 'react';

import { apiAuth } from '@/services/models/authModel';
import type { ApiStringResponse } from '@/types';

import { useNavigate, useParams } from 'react-router-dom';

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
    <div
      className={`rounded-md px-4 py-3 text-sm font-medium ${
        status === '200' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'
      }`}
    >
      {message}
    </div>
  );
};

export default EmailVerify;
