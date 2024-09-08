import { useGlobalStore } from "@/store/services";
import { Navigate } from "react-router";

const LoggedWrapper = ({ children }) => {
  const token = useGlobalStore((state) => state.user.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default LoggedWrapper;
