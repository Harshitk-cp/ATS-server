import express from "express";
import {
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  applyJob,
  updateApplication,
  getJobsForHr,
  getApplicationsForHr,
  getApplicationsForApplicant,
  getAllJobs,
} from "../controllers/jobController.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").get(protect, getJobsForHr).post(protect, createJob);
router.route("/getAllJobs").get(protect, getAllJobs);
router
  .route("/:jobId")
  .get(getSingleJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);
router.route("/:jobId/apply").post(protect, applyJob);
router.route("/:applicationId/update").post(protect, updateApplication);
router.route("/:userId/hrApplications").get(protect, getApplicationsForHr);
router
  .route("/:userId/applicantApplications")
  .get(protect, getApplicationsForApplicant);
export default router;
