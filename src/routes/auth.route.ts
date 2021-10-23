import { Router } from "express";
import login from "../controllers/auth/login.controller";
import register from "../controllers/auth/register.controller";
import { validateRequest } from "../middleware/validations";
import {
  loginValidateSchema,
  registerValidateSchema,
  userExistenceValidate,
} from "../middleware/validations/auth-validation.middleware";

const router = Router();

router.post(
  "/register",
  validateRequest(registerValidateSchema, 422),
  userExistenceValidate("exist", 422),
  register
);
router.post(
  "/login",
  validateRequest(loginValidateSchema, 422),
  userExistenceValidate("not-exist", 404),
  login
);

export default router;
