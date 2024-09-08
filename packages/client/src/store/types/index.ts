export interface UserInfoRes {
  uid: string;
  email: string;
  token: string;
}

export interface CommonRes {
  isSuc: boolean;
  msg: string;
  code: number;
}
