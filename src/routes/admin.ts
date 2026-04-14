import { Router } from "express";
import { showHits, resetHits } from "../handlers/admin.js";

const router = Router();

router.get("/metrics", showHits);
router.post("/reset", resetHits);

export default router;