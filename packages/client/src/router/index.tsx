import { createBrowserRouter } from "react-router-dom";
import Login from "@/pages/login";
import RootWrapper from "@/wrappers/root";
import AuthWrapper from "@/wrappers/auth";
import LoggedWrapper from "@/wrappers/logged";
import Dashboard from "@/pages/dashboard";
import InitWrapper from "@/wrappers/init";
import SignUp from "@/pages/sign-up";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootWrapper,
    // ErrorBoundary: () => <>123</>,
    children: [
      {
        path: "login",
        element: (
          <LoggedWrapper>
            <Login />
          </LoggedWrapper>
        ),
      },
      {
        path: "signup",
        element: (
          <LoggedWrapper>
            <Login />
          </LoggedWrapper>
        ),
      },
      {
        path: "dashboard",
        element: (
          <AuthWrapper>
            <InitWrapper>
              <Dashboard />
            </InitWrapper>
          </AuthWrapper>
        ),
      },
    ],
  },
]);
