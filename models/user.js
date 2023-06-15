import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 1,
    max: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 100,
  },

  password: {
    type: String,
    required: true,
    max: 10,
    min: 6,
  },

  isEmployer: {
    type: Boolean,
    required: true,
    default: true,
  },

  resume: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
