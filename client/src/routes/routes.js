import React from "react";
import MainLayout from "../MainLayout";
import PersistLogin from "../hooks/context/state/PersistLogin";
import RequireAuth from "../hooks/context/state/RequireAuth";
// pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Admin from "../pages/Admin";
import User from "../pages/User";
//
// const Login = React.lazy(() => import("../pages/Login"));
// const Register = React.lazy(() => import("../pages/Register"));

const ROLES = {
  admin: "admin",
  user: "user",
  student: "student",
  parent: "parent",
};

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/register", element: <Register /> },
      { path: "/login", element: <Login /> },
      {
        element: <PersistLogin />,
        children: [
          {
            element: <RequireAuth allowedRoles={[ROLES.admin]} />,
            children: [
              {
                path: "/admin",
                element: <Admin />,
              },
            ],
          },
          {
            element: <RequireAuth allowedRoles={[ROLES.student]} />,
            children: [
              {
                path: "/user",
                element: <User />,
              },
            ],
          },
        ],
      },
      // { path: "*", element: <NotFound /> },
      // { path: "/unauthorized", element: <Unauthorized /> },
    ],
  },
];
