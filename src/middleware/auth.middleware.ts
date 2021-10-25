import { RequestHandler } from "express";
import { verify } from "jsonwebtoken";
import logger from "../logger";
import { HttpError } from "../models/utility.model";
import { asyncRedisGet } from "../redis-connect";
import { generateToken, ISuccessResponse } from "../utility";

export const verifyToken: RequestHandler = (req, _, next) => {
  if (!req.headers.authorization) {
    return next(new HttpError("Invalid request.", 400));
  }

  const token = req.headers.authorization?.split(" ")[1];

  try {
    const decoded = verify(token, process.env.ACCESS_TOKEN_SECRET_KEY || "");

    if (typeof decoded === "object" && "email" in decoded) {
      // @ts-ignore
      req.user = decoded;
      return next();
    }

    return next(new HttpError("Authentication failed.", 401));
  } catch (error) {
    return next(new HttpError("Authentication failed.", 401));
  }
};

export const verifyRefreshToken: RequestHandler = async (req, _, next) => {
  // @ts-ignore
  const token = req.body.token;

  try {
    const decoded = verify(token, process.env.REFRESH_TOKEN_SECRET_KEY || "");
    if (typeof decoded === "object" && "id" in decoded && "email" in decoded) {
      const value = await asyncRedisGet(decoded["id"]);
      if (value && token === JSON.parse(value)) {
        // @ts-ignore
        req.user = {
          id: decoded["id"],
          name: decoded["name"],
          email: decoded["email"],
        };
        return next();
      }
    }

    return next(new HttpError("Something went wrong.", 500));
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Something went wrong.", 500));
  }
};

export const getTokens: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const { email, name, id } = req.user as {
      name: string;
      email: string;
      id: string;
    };

    if (
      !process.env.ACCESS_TOKEN_SECRET_KEY ||
      !process.env.REFRESH_TOKEN_SECRET_KEY ||
      !process.env.ACCESS_TOKEN_EXPIRES ||
      !process.env.REFRESH_TOKEN_EXPIRES
    ) {
      return next(new HttpError("Something went wrong.", 500));
    }

    const userObj = {
      id: id.toString(),
      name: name,
      email: email,
    };

    const access_token = generateToken(
      id.toString(),
      email,
      name,
      process.env.ACCESS_TOKEN_SECRET_KEY,
      process.env.ACCESS_TOKEN_EXPIRES
    );

    const refresh_token = generateToken(
      id.toString(),
      email,
      name,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_EXPIRES,
      true
    );

    return res.status(200).json({
      code: 200,
      data: { ...userObj, access_token: access_token, refresh_token },
      success: true,
      timeStamp: new Date().toISOString(),
    } as ISuccessResponse);
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Authentication failed", 401));
  }
};
