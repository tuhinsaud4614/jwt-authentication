import { Router } from "express";
import authRouter from "./auth.route";
import protectedRouter from "./protected.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/protected", protectedRouter);

export default router;
