import { Router } from "express";
import { handlerReadiness, postChirp } from "../handlers/api.js";
import { newUser } from "../handlers/api.js"

const router = Router();

router.get("/healthz", handlerReadiness);
router.post("/chirps", postChirp);
router.post("/users", newUser);

export default router;