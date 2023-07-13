import asyncHandler from "express-async-handler";
import { Jobs, Application } from "../models/jobs.js";
import User from "../models/user.js";
import transporter from "../service/email.js";

const sendEmail = async (fromEmail, toEmail, subject, text) => {
  const mailOptions = {
    from: fromEmail,
    to: toEmail,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    // console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export const getJobsForHr = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const jobs = await Jobs.find({ userId });
  res.status(200).json({ success: true, data: jobs });
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Jobs.find();
  res.status(200).json({ success: true, data: jobs });
});

export const getSingleJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Jobs.findById(jobId);
  if (!job) {
    res.status(400);
    throw new Error("Job not found");
  }
  res.status(200).json({ success: true, data: job });
});

export const createJob = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user.isEmployer) {
    res.status(400);
    throw new Error("Can not create Jobs.");
  }
  await Jobs.create(req.body);
  res.status(200).json({ success: true, message: "Job successfully created." });
});

export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;
  let job = await Jobs.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found.");
  }
  job = await Jobs.findByIdAndUpdate(jobId, req.body, { new: true });
  res.status(200).json({ success: true, message: "Job status updated." });
});

export const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const job = await Jobs.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found.");
  }
  await Jobs.findByIdAndDelete(jobId);
  await Application.findOneAndDelete({ jobId });
  res.status(200).json({ success: true, message: "Job successfully deleted." });
});

export const applyJob = asyncHandler(async (req, res) => {
  const { jobId, applicantId, hrId } = req.body;
  const job = await Jobs.findOne({ _id: jobId });
  if (!job) {
    res.status(404);
    throw new Error("Job not found.");
  }
  const checkApply = await Application.find({ applicantId, jobId });
  if (checkApply.length > 0) {
    res.status(400).json({ success: false, message: "Already Applied" });
    return;
  }
  await Application.create(req.body);
  await Jobs.findByIdAndUpdate(
    jobId,
    { $push: { applicants: applicantId } },
    { new: true }
  );
  res
    .status(200)
    .json({ success: true, message: "Successfully applied for the job." });
});

const updateApplicationStatus = async (applicationId, action) => {
  const application = await Application.findById(applicationId);
  const user = await User.findById(application.applicantId);
  const job = await Jobs.findById(application.jobId);

  if (!application) {
    res.status(404);
    throw new Error("Application not found.");
  }

  let emailText = "";
  let status = "";
  let currentRound = application.currentRound;

  if (action === "reject") {
    emailText = "Sorry to inform you! Your application has been rejected.";
    status = "rejected";
  } else if (action === "accept" && currentRound < job.noOfRounds) {
    emailText =
      "Congratulations! Your application has been selected for the next round.";
    status = "ongoing";
    currentRound++;
  } else if (action === "accept" && currentRound === job.noOfRounds) {
    emailText = "Congratulations! You are hired.";
    status = "hired";
  }

  const emailSubject = "Application Status Update";
  await sendEmail(job.email, user.email, emailSubject, emailText);

  await Application.findByIdAndUpdate(
    applicationId,
    { status, currentRound },
    { new: true }
  );
};

export const updateApplication = asyncHandler(async (req, res) => {
  const { applicationId, action } = req.body;

  try {
    await updateApplicationStatus(applicationId, action);
    res
      .status(200)
      .json({ success: true, message: "Application status updated." });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update application status.",
    });
  }
});

export const getApplicationsForHr = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const applications = await Application.find({ hrId: userId });
  res.status(200).json({ success: true, data: applications });
});

export const getApplicationsForApplicant = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const applications = await Application.find({ applicantId: userId });
  res.status(200).json({ success: true, data: applications });
});
