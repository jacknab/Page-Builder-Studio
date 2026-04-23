import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import templatesRouter from "./templates";
import bookingRouter from "./booking";
import servicesRouter from "./services";
import sitesRouter from "./sites";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/templates", templatesRouter);
router.use("/public", bookingRouter);
router.use("/services", servicesRouter);
router.use("/sites", sitesRouter);

export default router;
