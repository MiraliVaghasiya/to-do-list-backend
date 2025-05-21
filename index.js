require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Task = require("./models/Task");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Get all tasks
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Add a new task
app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const task = new Task({ text, completed: false });
  await task.save();
  res.json(task);
});

// Update a task (edit text or mark complete)
app.put("/tasks/:id", async (req, res) => {
  const { text, completed } = req.body;
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { text, completed },
    { new: true }
  );
  res.json(task);
});

// Delete a task
app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
