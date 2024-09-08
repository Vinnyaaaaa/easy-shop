import apiClient from "@/api/request";
import { useGlobalStore } from "@/store/services";
import { useEffect, useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";

const RootWrapper = () => {
  const token = useGlobalStore((state) => state.user.token);
  const handleLogout = useGlobalStore((state) => state.handleLogout);
  const handleLoginSuccess = useGlobalStore(
    (state) => state.handleLoginSuccess
  );

  const setConfig = () => {
    apiClient.configuration(token);
  };

  useEffect(() => {
    setConfig();
  }, [token]);

  useLayoutEffect(() => {
    const token = localStorage.getItem("token");
    const userInfo = localStorage.getItem("userInfo");

    if (!token || !userInfo) {
      handleLogout();
      return;
    }

    handleLoginSuccess(token, JSON.parse(userInfo));
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootWrapper;
