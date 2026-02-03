import { useEffect, useState } from 'react';
import axios from 'axios';

type VerifyResponse = {
  message: string;
};

const VERIFY_URL = 'https://mocker-backend.vercel.app/api/auth/verify';

export const useVerifyToken = () => {
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const userToken = localStorage.getItem('MockAPI-Token');

    if (!userToken) {
      setHasToken(false);
      return () => ac.abort();
    }

    axios
      .get<VerifyResponse>(VERIFY_URL, {
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

  return [hasToken, setHasToken] as const;
};
