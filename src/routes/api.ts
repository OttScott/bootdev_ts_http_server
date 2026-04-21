import { Router } from "express";
import { handlerReadiness, postChirp, getChirps, getSingleChirp } from "../handlers/api.js";
import { newUser, loginUser } from "../handlers/api.js"

const router = Router();

router.get("/healthz", handlerReadiness);

router.post("/users", newUser);

router.get("/chirps", getChirps);
router.get("/chirps/:chirpId", getSingleChirp);
router.post("/chirps", postChirp);

router.post("/login", loginUser);

export default router;