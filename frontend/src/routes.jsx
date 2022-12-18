import React, { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import Loading from "./components/CustomLoading";

// Layouts
import AuthLayout from "./layout/AuthLayout";
import DashboardLayout from "./layout/DashboardLayout";

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<Loading />}>
      <Component {...props} />
    </Suspense>
  );

const LoginPage = Loadable(lazy(() => import("./pages/auth/Login")));
const SignupPage = Loadable(lazy(() => import("./pages/auth/Signup")));
const Custom404 = Loadable(lazy(() => import("./components/Custom404")));
const EmailVerify = Loadable(lazy(() => import("./pages/auth/EmailVerify")));
const ForgotPassword = Loadable(lazy(() => import("./pages/auth/ForgotPassword")));

const ProjectsPage = Loadable(
  lazy(() => import("./pages/dashboard/Dashboard"))
);
const CollectionPage = Loadable(
  lazy(() => import("./pages/dashboard/Collection"))
);

const routes = [
  {
    path: "",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    children: [
      {
        path: "",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignupPage />,
      },
      {
        path: "/404",
        element: <Custom404 />,
      },
      {
        path: "/emailverify",
        element: <EmailVerify />,
      },
      {
        path: "/resetpassword",
        element: <ForgotPassword />
      }
    ],
  },
  {
    path: "",
    element: (
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    ),
    children: [
      {
        path: ":userId",
        element: <ProjectsPage />,
      },
      {
        path: ":userId/:projectId",
        element: <CollectionPage />,
      },
    ],
  },
  {
    path: "*",
    element: <Custom404 />
  }
];

export default routes;
