import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";
import User from "../models/user.js";

export const register = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  console.log(req.body);

  const emailExists = await User.findOne({ email: email });

  if (emailExists) {
    res.status(401);
    throw new Error("Email already exist");
  }

  const hashPassword = bcrypt.hashSync(password, 8);

  const user = new User({
    name: name,
    email: email,
    password: hashPassword,
  });

  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// @Desc Login User
// @Route /api/user/login
// @Method POST
export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }

  const passwordMatching = bcrypt.compareSync(password, user.password);

  if (user && !passwordMatching) {
    res.status(401);
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

  res.status(201).json(userLogin);
});
