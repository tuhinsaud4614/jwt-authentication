import { RequestHandler } from "express";
import User from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";
import { ISuccessResponse } from "../../utility";
import { hash } from "bcryptjs";

const register: RequestHandler = async (req, res, next) => {
  try {

    const { email, name, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };
    
    const hashPassword = await hash(password.toString(), 12);

    await new User({
      name: name,
      email: email,
      password: hashPassword,
    }).save();

    return res.status(201).json({
      code: 201,
      data: { email: email, name: name },
      success: true,
      timeStamp: new Date().toISOString(),
    } as ISuccessResponse);
  } catch (error) {
    return next(new HttpError("User creation failed!!!", 400));
  }
};

export default register;
