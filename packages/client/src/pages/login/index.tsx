import { LoginForm } from "@/modules/login/login-form";
import styles from "./index.module.less";
import { LoginHeader } from "@/modules/login/login-header";

const Login = () => {
  return (
    <div className={styles.login_warp}>
      <div className={styles.content}>
        <LoginHeader />
        <LoginForm />
      </div>
    </div>
  );
};

export default Login;
