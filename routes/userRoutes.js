import express from "express";
import { register, login, getUser } from "../controllers/userController.js";

const router = express.Router();

router.route("/signup").post(register);

router.route("/login").post(login);

router.route("/:userId").get(getUser);

export default router;
