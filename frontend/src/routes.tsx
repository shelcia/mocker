import React, { lazy, Suspense } from 'react';

import { Outlet } from 'react-router-dom';

import Loading from './components/common/CustomLoading';
import AuthGuard from './layout/AuthGuard';
// Layouts
import AuthLayout from './layout/AuthLayout';
import DashboardLayout from './layout/DashboardLayout';

const Loadable = (Component) => (props) => (
  <Suspense fallback={<Loading />}>
    <Component {...props} />
  </Suspense>
);

const LoginPage = Loadable(lazy(() => import('./pages/auth/Login')));
const SignupPage = Loadable(lazy(() => import('./pages/auth/Signup')));
const EmailVerify = Loadable(lazy(() => import('./pages/auth/EmailVerify')));
const ForgotPassword = Loadable(lazy(() => import('./pages/auth/ForgotPassword')));

const ProjectsPage = Loadable(lazy(() => import('./pages/dashboard/Dashboard')));
const CollectionPage = Loadable(lazy(() => import('./pages/dashboard/Collection')));

const Error404Page = Loadable(lazy(() => import('./pages/others/Error404Page')));

const routes = [
  {
    path: '',
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: '',
        element: <LoginPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/verification/:id',
        element: <EmailVerify />,
      },
      // {
      //   path: "/email-verify",
      //   element: <EmailVerify />,
      // },
      {
        path: '/reset-password',
        element: <ForgotPassword />,
      },
      {
        path: '/reset-password/:id',
        element: <ForgotPassword />,
      },
    ],
  },
  {
    path: 'dashboard/:userId',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      {
        path: '',
        element: <ProjectsPage />,
      },
      {
        path: ':projectId',
        element: <CollectionPage />,
      },
    ],
  },
  {
    path: '*',
    element: <Outlet />,
    children: [
      {
        path: '*',
        element: <Error404Page />,
      },
    ],
  },
];

export default routes;
