import express from "express";
import {
  getJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").get(protect, getJobs).post(protect, createJob);
router
  .route("/:jobId")
  .get(getSingleJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);
router.route("/:jobId/apply").post(protect, applyJob);

export default router;
