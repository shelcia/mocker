import React from 'react';

import { CustomToggle } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { Component } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/utils';
import { useVerifyToken } from '@/hooks/useVerifyToken';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [, setHasToken] = useVerifyToken();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          {/* brand */}
          <div className="flex items-center gap-2">
            <Component className="size-4" />
            <span className="text-sm font-extrabold uppercase">Mocker</span>
          </div>

          {/* actions */}
          <div className="ml-auto flex items-center gap-4">
            <CustomToggle />
            <Button onClick={() => logout(setHasToken, navigate)} variant="ghost">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Card className="rounded-2xl border bg-card/70 p-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/55 sm:p-6">
          {children}
        </Card>
      </main>
    </div>
  );
};

export default DashboardLayout;
