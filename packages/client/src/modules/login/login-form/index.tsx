import { Form, Input, Button, message } from "antd";

import styles from "./index.module.less";
import { useState } from "react";
import { useGlobalStore } from "@/store/services";
import { Navigate } from "react-router";
import { checkEmail, checkPassword } from "@/utils";
import { Mail, LockKeyhole } from "lucide-react";

export const LoginForm = () => {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const login = useGlobalStore((state) => state.login);
  const register = useGlobalStore((state) => state.register);

  const handleLogin = async () => {
    setLoading(true);
    const email = form.getFieldValue("email");
    const password = form.getFieldValue("password");

    const { isSuc, msg, code } = await login({ email, password });

    setLoading(false);
    if (isSuc) {
      <Navigate to="/dashboard" />;
      message.success("login success");
      return;
    }

    switch (code) {
      case 40002:
        message.error("user not found");
        break;
      case 40003:
        message.error("invalid password or email");
        break;
      default:
        message.error(msg);
    }
  };

  const handleRegister = async () => {
    const email = form.getFieldValue("email");
    const password = form.getFieldValue("password");

    setLoading(true);

    const { isSuc, code, msg } = await register({ email, password });
    setLoading(false);

    if (isSuc) {
      <Navigate to="/dashboard" />;
      message.success("register success");
      return;
    }

    switch (code) {
      case 40001:
        message.error("email already exists");
        break;
      default:
        message.error(msg);
    }
  };

  const onSubmit = async () => {
    const isLogin = location.pathname === "/login";

    if (isLogin) {
      return handleLogin();
    }

    handleRegister();
  };

  return (
    <Form form={form} className={styles.signup_form} onFinish={onSubmit}>
      <Form.Item
        name="email"
        rules={[
          {
            validator: (rule, value) => {
              if (!checkEmail(value)) {
                return Promise.reject("Invalid email address");
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input
          prefix={<Mail size={16} />}
          size="large"
          autoComplete="email"
          placeholder={"Please enter your email address"}
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            validator: (rule, value) => {
              if (!checkPassword(value) || !value) {
                return Promise.reject("Invalid password");
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <Input.Password
          prefix={<LockKeyhole size={16} />}
          size="large"
          autoComplete="one-time-code"
          placeholder={"Password"}
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          loading={loading}
          className={styles.submit_btn}
          block
        >
          Log In
        </Button>
      </Form.Item>
    </Form>
  );
};
