import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import logger from "../../logger";
import { UserDocument } from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";

const login: RequestHandler = async (req, _, next) => {
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

    // @ts-ignore
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
    return next();
  } catch (error) {
    logger.error(error);
    return next(new HttpError("Login failed.", 400));
  }
};
export default login;
