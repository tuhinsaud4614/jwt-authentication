import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import User from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";
import sanitizeHtml from 'sanitize-html';


export const registerValidateSchema = yup.object().shape({
  body: yup.object().shape({
    password: yup
      .string()
      .trim()
      .required("Password is required!!!")
      .min(6, "Password should at least 6 characters!!!").test(
        "sanitize",
        "Malicious value entered!!",
        (value) => !!value && !!sanitizeHtml(value)
      ),
    email: yup
      .string()
      .email("This is not valid email!!!")
      .required("Email is required!!!"),
    name: yup
      .string()
      .trim()
      .required("Name is required!!!")
      .test(
        "sanitize",
        "Malicious value entered!!",
        (value) => !!value && !!sanitizeHtml(value)
      ),
  }),
});

export const userExistenceValidate = async (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    // @ts-ignore
    const email = req.body.email;
    const currentUser = await User.findOne({
      email: email,
    });
    if (currentUser) {
      return next(new HttpError("User already exist!!!", 422));
    }
    return next();
  } catch (error) {
    return next(new HttpError("Something went wrong!!!", 500));
  }
};
