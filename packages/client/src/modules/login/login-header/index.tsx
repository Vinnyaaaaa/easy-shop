import styles from "./index.module.less";
import { useState } from "react";

export const LoginHeader = () => {
  const { pathname } = window.location;

  const [path, setPath] = useState(pathname);

  const navigatorToSignUp = () => {
    history.pushState({}, "", "/signup");
    setPath("/signup");
  };

  const navigatorToSignIn = () => {
    history.pushState({}, "", "/login");
    setPath("/login");
  };


  return (
    <div className={styles.login_header__wrap}>
      <div data-active={path === "/login"} onClick={navigatorToSignIn}>
        Log In
      </div>
      <div data-active={path === "/signup"} onClick={navigatorToSignUp}>
        Sign Up
      </div>
    </div>
  );
};
