const express = require("express");
const cors = require("cors");
const recommendRouter = require("./routes/recommend");
const historyRouter = require("./routes/history");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recommend", recommendRouter);
app.use("/api/history", historyRouter);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CropSmart API is running" });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🌾 CropSmart API running on http://localhost:${PORT}`);
});
