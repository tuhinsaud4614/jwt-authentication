import { sign as jwtSign } from "jsonwebtoken";
import redis_client from "./redis_connect";

export interface IErrorResponse {
  code: number;
  success: boolean;
  detail: string | null;
  message: string;
  error: string;
  timeStamp: string;
}

export interface ISuccessResponse {
  code: number;
  success: boolean;
  timeStamp: string;
  data: any;
}

export const generateToken = (
  userId: string,
  email: string,
  name: string,
  key: string,
  expires: string,
  settable: boolean = false
) => {
  const refresh_token = jwtSign({ id: userId, email, name }, key, {
    expiresIn: expires,
  });

  if (settable) {
    redis_client.set(userId, JSON.stringify(refresh_token), (err) => {
      if (err) {
        throw err;
      }
    });
  }
  return refresh_token;
};
