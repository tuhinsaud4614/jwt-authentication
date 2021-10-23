import { Router } from "express";
import register from "../controllers/auth/register.controller";
import { validateRequest } from "../middleware/validations";
import { registerValidateSchema, userExistenceValidate } from "../middleware/validations/auth-validation.middleware";

const router = Router();

router.post("/register", validateRequest(registerValidateSchema, 422),userExistenceValidate, register);

export default router;
