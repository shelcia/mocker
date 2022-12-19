import React, { Fragment, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom"; // component props interface
import Login from "../pages/auth/Login";

const AuthGuard = ({ children }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("MockAPI-Token");
    if (token) {
      //   axios
      //     .get(`https://www.hira.one/auth/tokenCheck?token=${token}`)
      //     .then((res) => {
      //       // console.log(res);
      //       if (res.data) {
      //         // console.log(res);
      //         setIsExpired(false);
      //       } else {
      //         setIsExpired(true);
      //       }
      //     })
      //     .catch(() => setIsExpired(true));
    }
  }, []);

  function isAuthenticate() {
    return localStorage.getItem("HRT-Token") ? true : false;
  }

  function useAuth() {
    // console.log(isAuthenticate(), isExpired);
    if (!isAuthenticate()) {
      return false;
    } else if (isExpired) {
      return false;
    } else {
      return true;
    }
    // return isAuthenticate() && !isExpired;
  }

  const navigate = useNavigate();

  const isAuthenticated = useAuth();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  // console.log({ isAuthenticated, requestedLocation, pathname });

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }

    navigate("/login");
    return <Login />;

    // return <Login />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <Fragment>{children}</Fragment>;
};

export default AuthGuard;
