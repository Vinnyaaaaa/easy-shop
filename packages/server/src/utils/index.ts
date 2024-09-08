interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

export function createResponse<T>(
  code: number,
  message: string,
  data?: T
): ApiResponse<T> {
  return { code, message, data };
}

export const getRandomCode = () => {
  return ("000000" + Math.floor(Math.random() * 999999)).slice(-6);
};
