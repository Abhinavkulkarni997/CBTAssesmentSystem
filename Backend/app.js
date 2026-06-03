const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const questionRoutes=require("./routes/questionRoutes");
const examRoutes=require("./routes/examRoutes");
const examSessionRoutes=require("./routes/examSessionRoutes");


const app = express();

app.use(cors());


app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/questions",questionRoutes);
app.use("/api/exams",examRoutes);
app.use("/api/exam-session",examSessionRoutes);
app.get("/", (req, res) => {
  res.send("CBT Assessment API Running...");
});

module.exports = app;