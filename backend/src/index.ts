import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/userPage.route";
import plotsRoutes from "./routes/plots.route";
import cors from "cors";

dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/plots", plotsRoutes);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
