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

  phone: {
    type: Number,
    max: 10,
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
  },

  bio: {
    type: String,
    min: 100,
  },
});

export default mongoose.model("User", userSchema);
