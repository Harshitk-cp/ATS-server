import mongoose from "mongoose";
import User from "../models/user.js";
const { Schema } = mongoose;

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Jobs",
    required: true,
  },
  status: { type: String, default: "Applied", required: true },
  currentRound: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now, alias: "created_at" },
  updatedAt: { type: Date, default: Date.now, alias: "updated_at" },
});

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  email: String,
  tags: String,
  address: String,
  salaryRange: Number,
  noOfPositions: Number,
  education: String,
  experience: String,
  noOfRounds: Number,
  status: String,
  applicants: [Schema.Types.ObjectId],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: { type: Date, default: Date.now, alias: "created_at" },
  updatedAt: { type: Date, default: Date.now, alias: "updated_at" },
});

const Jobs = mongoose.model("Jobs", jobSchema);
const Application = mongoose.model("Application", applicationSchema);
export { Jobs, Application };
