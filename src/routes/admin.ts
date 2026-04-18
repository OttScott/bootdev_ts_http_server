import { Router } from "express";
import { showHits, reset } from "../handlers/admin.js";

const router = Router();

router.get("/metrics", showHits);
router.post("/reset", reset);

export default router;