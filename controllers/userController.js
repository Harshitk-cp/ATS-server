import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";
import User from "../models/user.js";

export const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  const emailExists = await User.exists({ email: email });
  if (emailExists) {
    res.status(400);
    throw new Error("Email already exist");
  }
  const hashPassword = await bcrypt.hashSync(password, 8);
  const user = new User({
    name: name,
    email: email,
    password: hashPassword,
  });
  await user.save();
  res.send({ success: true, message: "User successfully created." });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const passwordMatching = await bcrypt.compareSync(password, user.password);

  if (!passwordMatching) {
    res.status(400);
    throw new Error("Password incorrect");
  }

  const userLogin = {
    id: user.id,
    name: user.name,
    email: user.email,
    resume: user.resume,
    isEmployer: user.isEmployer,
    token: generateToken(user.id),
  };

  res.status(200).json({
    success: true,
    message: "User successfully Loggedin.",
    user: userLogin,
  });
});
