import express from "express";
import { protect } from "../middlewares/auth.js";
import { getReview } from "../controllers/applicationReviewController.js";

const router = express.Router();

router.route("/").post(getReview);

export default router;
