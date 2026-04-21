import { Router } from "express";
import { handlerReadiness, postChirp, getChirps, getSingleChirp } from "../handlers/api.js";
import { newUser } from "../handlers/api.js"

const router = Router();

router.get("/healthz", handlerReadiness);
router.post("/chirps", postChirp);
router.get("/chirps", getChirps);
router.get("/chirps/:chirpId", getSingleChirp);
router.post("/users", newUser);

export default router;