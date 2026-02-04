import { useEffect } from 'react';

import { useVerifyEmailMutation } from '@/services/auth/auth.queries';

import { useNavigate, useParams } from 'react-router-dom';

const EmailVerify = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const verifyMutation = useVerifyEmailMutation({
    onSuccess: () => {
      setTimeout(() => navigate('/'), 1500);
    },
  });

  useEffect(() => {
    if (!id) return;

    verifyMutation.mutate(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const isOk = verifyMutation.isSuccess;
  const isErr = verifyMutation.isError;

  const message = isOk
    ? 'Verified successfully. Redirecting to login…'
    : isErr
      ? 'Verification failed. The link may be invalid or expired.'
      : 'Verifying your email…';

  return (
    <div
      className={[
        'rounded-md px-4 py-3 text-sm font-medium',
        isOk
          ? 'bg-emerald-500/10 text-emerald-600'
          : isErr
            ? 'bg-red-500/10 text-red-600'
            : 'bg-muted text-foreground',
      ].join(' ')}
    >
      {message}
    </div>
  );
};

export default EmailVerify;
