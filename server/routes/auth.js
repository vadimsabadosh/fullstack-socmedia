import express from "express";
import { login, updateUser, isLoggedIn } from "../controllers/auth.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/update", verifyToken, updateUser);
router.get("/check-user", isLoggedIn);

export default router;
