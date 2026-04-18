import { Router } from "express";
import { handlerReadiness, validateChirp } from "../handlers/api.js";
import { newUser } from "../handlers/api.js"

const router = Router();

router.get("/healthz", handlerReadiness);
router.post("/validate_chirp", validateChirp);
router.post("/users", newUser);

export default router;