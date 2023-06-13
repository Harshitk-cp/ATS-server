import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findOne({ _id: decodedToken.id });

      next();
    } catch (error) {
      console.log(error.message);
      res.status(401);
      throw new Error("no token, no auth");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("no token, no auth");
  }
});

const employer = (req, res, next) => {
  if (req.user && req.user.isEmployee) {
    next();
  } else {
    res.status(401);
    throw new Error("no token, no auth");
  }
};

export { protect, employer };
