import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 255,
  },

  password: {
    type: String,
    required: true,
    max: 2048,
    min: 6,
  },

  isEmployer: {
    type: Boolean,
    required: true,
    default: true,
  },
});

export default mongoose.model("User", userSchema);
