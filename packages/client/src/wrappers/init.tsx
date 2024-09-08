import { useGlobalStore } from "@/store";
import { useEffect, useState } from "react";

const InitWrapper = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const token = useGlobalStore((state) => state.user.token);

  useEffect(() => {
    if (token) {
      setLoading(false);
    }
  }, [token]);

  return loading ? <></> : <>{children}</>;
};

export default InitWrapper;
