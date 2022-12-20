import React, { Fragment, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"; // component props interface
import { apiService } from "../services/models/serviceModel";
import Login from "../pages/auth/Login";
import AuthLayout from "./AuthLayout";

const AuthGuard = ({ children }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    const token = localStorage.getItem("MockAPI-Token");
    if (token) {
      apiService
        .getSingle(`auth-token/${token}`)
        .then((res) => {
          //   console.log(res);
          if (res.status === "200") {
            setIsExpired(false);
          } else {
            setIsExpired(true);
          }
        })
        .catch(() => setIsExpired(true));
    }
    return () => ac.abort();
  }, []);

  function isAuthenticate() {
    return localStorage.getItem("MockAPI-Token") ? true : false;
  }

  function useAuth() {
    if (!isAuthenticate()) {
      return false;
    } else if (isExpired) {
      return false;
    } else {
      return true;
    }
  }

  const navigate = useNavigate();

  const isAuthenticated = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  useEffect(() => {
    const ac = new AbortController();
    if (!isAuthenticated) {
      if (pathname !== requestedLocation) {
        setRequestedLocation(pathname);
      }
      navigate("/");
    }
    return () => {
      ac.abort();
    };
  }, []);

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return (
      <AuthLayout>
        <Login />
      </AuthLayout>
    );
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
