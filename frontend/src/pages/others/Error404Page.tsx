import React from 'react';

import { Button } from '@/components/ui/button';

import { useNavigate } from 'react-router-dom';

import Img from '../../assets/404.png';

const Error404Page: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[100vh] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="rounded-2xl border bg-background/70 p-8 shadow-sm backdrop-blur">
          <img
            src={Img}
            alt="404 error information"
            className="mx-auto h-[260px] w-auto select-none"
            draggable={false}
          />

          <h1 className="mt-6 text-6xl font-bold tracking-tight">404</h1>

          <p className="mt-3 text-base text-muted-foreground">
            The page you’re looking for doesn’t exist.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              Go Home
            </Button>

            <Button
              onClick={() => navigate(-1)}
              className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition hover:bg-accent"
            >
              Go Back
            </Button>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          If you think this is a bug, try refreshing or navigating from the dashboard.
        </p>
      </div>
    </div>
  );
};

export default Error404Page;
