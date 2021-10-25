import { Router } from "express";
import login from "../controllers/auth/login.controller";
import logout from "../controllers/auth/logout.controller";
import register from "../controllers/auth/register.controller";
import { getTokens, verifyRefreshToken } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/validations";
import {
  loginValidateSchema,
  registerValidateSchema,
  tokenValidateSchema,
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
  login,
  getTokens
);

router.post(
  "/token",
  validateRequest(tokenValidateSchema, 422),
  verifyRefreshToken,
  getTokens
);
router.delete(
  "/logout",
  validateRequest(tokenValidateSchema, 422),
  verifyRefreshToken,
  logout
);

export default router;
