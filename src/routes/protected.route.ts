import { Router } from "express";
import protectedHome from "../controllers/protected/home.controller";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/", verifyToken, protectedHome);

export default router;
