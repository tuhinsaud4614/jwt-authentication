import { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";
import * as yup from "yup";
import User from "../../models/auth.model";
import { HttpError } from "../../models/utility.model";

export const registerValidateSchema = yup.object().shape({
  body: yup.object().shape({
    password: yup
      .string()
      .trim()
      .required("Password is required.")
      .min(6, "Password should at least 6 characters.")
      .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters.")
      .test(
        "sanitize",
        "Malicious value entered!!",
        (value) => !!value && !!sanitizeHtml(value)
      ),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Password must be matched!"),
    email: yup
      .string()
      .email("This is not valid email.")
      .required("Email is required."),
    name: yup
      .string()
      .trim()
      .required("Name is required.")
      .test(
        "sanitize",
        "Malicious value entered!!",
        (value) => !!value && !!sanitizeHtml(value)
      ),
  }),
});

export const loginValidateSchema = yup.object().shape({
  body: yup.object().shape({
    password: yup
      .string()
      .trim()
      .required("Password is required.")
      .test(
        "sanitize",
        "Malicious value entered!!",
        (value) => !!value && !!sanitizeHtml(value)
      ),
    email: yup
      .string()
      .email("This is not valid email.")
      .required("Email is required."),
  }),
});

export const tokenValidateSchema = yup.object().shape({
  body: yup.object().shape({
    token: yup.string().required("Token is required."),
  }),
});

// Check user exist or not
export const userExistenceValidate = (
  errorWhen: "exist" | "not-exist",
  code: number = 500
) => {
  return async (req: Request, _: Response, next: NextFunction) => {
    try {
      // @ts-ignore
      const email = req.body.email;
      const currentUser = await User.findOne({
        email: email,
      }).exec();

      if (errorWhen === "exist") {
        if (currentUser) {
          return next(new HttpError("User already exist.", code));
        }
      } else {
        if (!currentUser) {
          return next(new HttpError("User not exist.", code));
        }
        // @ts-ignore
        req.user = currentUser;
      }
      return next();
    } catch (error) {
      return next(new HttpError("Something went wrong.", 500));
    }
  };
};
