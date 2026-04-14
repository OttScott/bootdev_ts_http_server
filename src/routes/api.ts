import { Router } from "express";
import { handlerReadiness, validateChirp } from "../handlers/api.js";

const router = Router();

router.get("/healthz", handlerReadiness);
router.post("/validate_chirp", validateChirp);

export default router;