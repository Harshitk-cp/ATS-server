import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middlewares/error.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationReviewRoutes from "./routes/applicationReviewRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to DB"))
  .catch((error) => console.log(error));

app.use(express.json());

app.use(cors());

// User Route
app.use("/api/v1/users", userRoutes);

// Job Route
app.use("/api/v1/jobs", jobRoutes);

//review Route
app.use("/api/v1/review", applicationReviewRoutes);

app.use("/api/v1/", (req, res) => {
  res.send({ text: "Server Running" });
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = 8000;
// process.env.PORT ||

app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`));
