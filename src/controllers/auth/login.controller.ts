import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { sign as jwtSign } from "jsonwebtoken";
import logger from "../../logger";
import { UserDocument } from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";
import redis_client from "../../redis_connect";
import { ISuccessResponse } from "../../utility";

const login: RequestHandler = async (req, res, next) => {
  try {
    // @ts-ignore
    const user = req.user as UserDocument;
    const { password } = req.body as {
      password: string;
    };

    const isMatch = await compare(password.trim().toString(), user.password);
    if (!isMatch) {
      return next(new HttpError("Wrong user credentials!", 422));
    }

    if (
      !process.env.ACCESS_TOKEN_SECRET_KEY ||
      !process.env.REFRESH_TOKEN_SECRET_KEY ||
      !process.env.ACCESS_TOKEN_EXPIRES ||
      !process.env.REFRESH_TOKEN_EXPIRES
    ) {
      return next(new HttpError("Something went wrong.", 500));
    }

    const userObj = {
      name: user.name,
      email: user.email,
    };

    const access_token = jwtSign(userObj, process.env.ACCESS_TOKEN_SECRET_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
    });

    const refresh_token = jwtSign(
      userObj,
      process.env.REFRESH_TOKEN_SECRET_KEY,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
      }
    );
    redis_client.set(
      user._id.toString(),
      JSON.stringify(refresh_token),
      (err) => {
        if (err) {
          next(new HttpError("Something went wrong.", 500));
          return;
        }
      }
    );

    return res.status(200).json({
      code: 200,
      data: { ...userObj, access_token: access_token, refresh_token },
      success: true,
      timeStamp: new Date().toISOString(),
    } as ISuccessResponse);
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Login failed.", 400));
  }
};
export default login;
