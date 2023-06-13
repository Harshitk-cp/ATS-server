import mongoose from "mongoose";
import User from "../models/user.js";
const { Schema } = mongoose;
import { nanoid } from 'nanoid';



const applicationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true,index: true, sparse: true},
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  userId: String,
  jobId: String,
  createdAt: { type: Date, default: Date.now, alias: 'created_at' },
  updatedAt: { type: Date, default: Date.now, alias: 'updated_at' },
});

const jobSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => nanoid(),
    required: true,
    unique: true
  },
  title: { type: String, required: true },
  description: String,
  email: String,
  tags: String,
  address: String,
  salaryRange: Number,
  noOfPositions: Number,
  education: String,
  experience: String,
  appliedJobs: {type: [applicationSchema], sparse: true},
  userId: String,
  createdAt: { type: Date, default: Date.now, alias: 'created_at' },
  updatedAt: { type: Date, default: Date.now, alias: 'updated_at' },
});


export default mongoose.model("Jobs", jobSchema);
