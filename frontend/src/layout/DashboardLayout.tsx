import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomToggle from '../components/CustomToggle';
import Logo from '../assets/images/logo.png';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* header */}
      <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/55">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-4">
          {/* brand */}
          <div className="flex items-center gap-2">
            <img src={Logo} alt="logo" className="h-4 w-4" />
            <span className="text-sm font-extrabold uppercase">Mocker</span>
          </div>

          {/* actions */}
          <div className="ml-auto flex items-center gap-2">
            <CustomToggle />
            <Button onClick={logout}>Logout</Button>
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
