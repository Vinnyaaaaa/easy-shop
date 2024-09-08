import { LoginHeader } from "@/modules/login/login-header";
import styles from "./index.module.less";
import { SignUpForm } from "@/modules/sign-up-form";

const signUp = () => {
  return (
    <div className={styles.login_warp}>
      <div className={styles.content}>
        <LoginHeader />
        <SignUpForm />
      </div>
    </div>
  );
};

export default signUp;
