import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateTokens.js";
import User from "../models/user.js";
import formidable from "formidable";
import fs from "fs";

export const register = asyncHandler(async (req, res) => {
  if (req.body.isEmployer == true) {
    const { email, name, password } = req.body;
    const emailExists = await User.exists({ email: email });
    if (emailExists) {
      res.status(400);
      throw new Error("Email already exist");
    }
    const hashPassword = bcrypt.hashSync(password, 8);
    const user = new User({
      name: name,
      email: email,
      password: hashPassword,
    });
    await user.save();
    res.send({ success: true, message: "User successfully created." });
  } else {
    const form = formidable({ multiples: false });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        res
          .status(400)
          .send({ success: true, message: "Failed to parse form data" });
        return;
      }
      2;
      const email = fields.email[0];
      const name = fields.name[0];
      const phone = fields.phone[0];
      const password = fields.password[0];
      const bio = fields.bio[0];
      const isEmpoyer = fields.isEmployer[0];
      const emailExists = await User.exists({ email: email });
      if (emailExists) {
        res
          .status(400)
          .send({ success: true, message: "Email already exists" });
        return;
      }

      const hashPassword = bcrypt.hashSync(password, 8);
      const resume = files.resume;

      // const filename = uuidv4() + ".pdf";

      const resumeBuffer = fs.readFileSync(resume[0].filepath);

      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
        phone: phone,
        bio: bio,
        isEmployer: isEmpoyer,
        resume: resumeBuffer, // Read the file and store it in the user object
      });

      await user.save();

      res.send({ success: true, message: "User successfully created." });
    });
  }
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const passwordMatching = await bcrypt.compare(password, user.password);

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
    phone: user.phone,
    bio: user.bio,
    token: generateToken(user.id),
  };

  res.json({
    success: true,
    message: "User successfully logged in.",
    user: userLogin,
  });
});

export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findById(userId).select("-password");
  res.status(200).json({
    success: true,
    data: user,
  });
});
