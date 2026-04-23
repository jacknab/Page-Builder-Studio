import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import templatesRouter from "./templates";
import bookingRouter from "./booking";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/templates", templatesRouter);
router.use("/public", bookingRouter);

export default router;
