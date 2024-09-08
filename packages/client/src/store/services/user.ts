import apiClient from "@/api/request";
import { StateCreator } from "zustand";
import { CommonRes, UserInfoRes } from "../types";

interface UserState {
  uid: string;
  email: string;
  token: string;
}

interface UserAction {
  login: (data: { email: string; password: string }) => Promise<CommonRes>;
  register: (data: { email: string; password: string }) => Promise<CommonRes>;

  handleLoginSuccess: (
    token: string,
    userInfo: { email: string; uid: string }
  ) => void;

  handleLogout: () => void;
}

export type UserSlice = {
  user: UserState;
} & UserAction;

const initUserState = () => {
  return {
    user: {
      uid: "",
      email: "",
      token: "",
    },
  };
};

export const createUserSlice: StateCreator<
  UserSlice,
  [],
  [["zustand/immer", never]],
  UserSlice
> = (set, get) => ({
  ...initUserState(),

  login: async (data) => {
    try {
      const res = await apiClient.post<UserInfoRes>("/users/login", {
        body: data,
      });

      const { token, email, uid } = res.data;

      if (res.code === 0) {
        set({
          user: {
            token,
            email,
            uid,
          },
        });
        apiClient.configuration(token);
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify({ email, uid }));
      }

      return { isSuc: res.code === 0, msg: res.msg, code: res.code };
    } catch (error) {
      console.log("error", error);
      return { isSuc: false, msg: "login failed", code: -1 };
    }
  },
  register: async (data) => {
    try {
      const res = await apiClient.post<UserInfoRes>("/users/register", {
        body: data,
      });

      const { token, email, uid } = res.data;

      if (res.code === 0) {
        set({
          user: {
            token,
            email,
            uid,
          },
        });
        apiClient.configuration(token);
        localStorage.setItem("token", token);
        localStorage.setItem("userInfo", JSON.stringify({ email, uid }));
      }

      return { isSuc: res.code === 0, msg: res.msg, code: res.code };
    } catch (error) {
      console.log("error", error);
      return { isSuc: false, msg: "login failed", code: -1 };
    }
  },

  handleLoginSuccess: (token, userInfo) => {
    set({
      user: {
        token,
        email: userInfo.email,
        uid: userInfo.uid,
      },
    });
  },

  handleLogout: () => {
    set({ ...initUserState() });
  },
});
