import { Router } from "express";
import DashboardController from "../controllers/DashboardController";

const router = Router();

router.get("/dashboard/counts", DashboardController.getCounts);

router.get("/dashboard/status", DashboardController.status);

export default router;
