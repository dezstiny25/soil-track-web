import express from "express";
import {
  checkAuth,
  forgotPassword,
  login,
  logout,
  resetPassword,
  signUp,
} from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/check", checkAuth);
router.post("/logout", logout);

export default router;
