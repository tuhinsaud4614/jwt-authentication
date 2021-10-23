import { RequestHandler } from "express";
import User from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";
import { ISuccessResponse } from "../../utility";

const register: RequestHandler = async (req, res, next) => {
  try {
    const { email, name, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    const newUser = await new User({
      name: name,
      email: email,
      password: password,
    }).save();

    return res.status(201).json({
      code: 201,
      data: newUser.toJSON(),
      success: true,
      timeStamp: new Date().toISOString(),
    } as ISuccessResponse);
  } catch (error) {
    return next(new HttpError("Something went wrong!!!", 500));
  }
};

export default register;
