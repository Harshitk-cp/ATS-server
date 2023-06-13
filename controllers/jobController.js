import asyncHandler from "express-async-handler";
import Jobs from "../models/jobs.js";
import User from "../models/user.js";

export const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Jobs.find({});

  res.status(200).json({ jobs });
});

export const getSingleJob = asyncHandler(async (req, res) => {

  const job = await Jobs.findById(req.body.jobId);

  if (!job) {
    res.status(401);
    throw new Error("Job not found");
  }

  res.status(201).json({"data": job});
});

export const createJob = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body.userId);
  if (!user.isEmployer) {
    res.status(401);
    throw new Error("Can not Create Jobs");
  }

    const job = await Jobs.create(req.body);
    res.status(201).json(job);
  
});

export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  try {
    let job = await Jobs.findById(jobId);

    if (!job) {
      res.status(401);
      throw new Error("Job not found");
    }

    job = await Jobs.findByIdAndUpdate(jobId, req.body, { new: true });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Jobs.findById(jobId);

  if (!job) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  await Jobs.findByIdAndDelete(jobId);

  res.status(200).json({ message: "Job successfully deleted" });
});


export const applyJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user.id;

  const jobExist = await Job.findById(jobId);

  if (!jobExist) {
    res.status(404).json({ message: "Job not found" });
    return;
  }

  const checkApply = await Application.find({ userId, jobId });

  if (checkApply.length > 0) {
    res.status(401).json({ message: "Already Applied" });
    return;
  }

  const app = await Application.create({ userId, jobId });

  res.status(201).json(app);
});

