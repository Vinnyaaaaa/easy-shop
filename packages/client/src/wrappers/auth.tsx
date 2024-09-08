import { useGlobalStore } from "@/store/services";
import { Navigate } from "react-router-dom";

const AuthWrapper = ({ children }) => {
  const token = useGlobalStore((state) => state.user.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AuthWrapper;
