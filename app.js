import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { notFound, errorHandler } from "./middlewares/error.js";
import userRoutes from "./routes/userRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";

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

// User Route
app.use("/api/v1/users", userRoutes);

// Job Route
app.use("/api/v1/jobs", jobRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = 8000;
// process.env.PORT ||

app.listen(PORT, () => console.log(`Server running on Port : ${PORT}`));
