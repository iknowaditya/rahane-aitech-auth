require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("./config");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const contentRoutes = require("./routes/contentRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/logs", logRoutes);

app.get("/", (req, res) => res.send("Admin Dashboard Backend"));

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
