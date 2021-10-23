import * as yup from "yup";

export const registerValidateSchema = yup.object().shape({
  body: yup.object().shape({
    password: yup
      .string()
      .required("Password is required!!!")
      .min(6, "Password should at least 6 characters!!!"),
    email: yup
      .string()
      .email("This is not valid email!!!")
      .required("Email is required!!!"),
    name: yup.string().required("Name is required!!!"),
  }),
});
