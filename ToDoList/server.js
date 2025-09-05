const express = require("express");
const app = express();
const PORT = 5000;
// Middleware to parse JSON
app.use(express.json());
// In-memory storage
let todos = [];
let nextId = 1;
//  Create a new task
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== "string") {
    return res.status(400).json({ error: "Task must be a non-empty string" });
  }
  const newTodo = { id: nextId++, task, completed: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});
// Get all tasks
app.get("/todos", (req, res) => {
  res.json(todos);
});
// Update a task by ID
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task, completed } = req.body;
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Task not found" });
  if (task !== undefined) {
    if (typeof task !== "string" || task.trim() === "") {
      return res.status(400).json({ error: "Task must be a non-empty string" });
    }
    todo.task = task;
  }
  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be true/false" });
    }
    todo.completed = completed;
  }
  res.json(todo);
});
//  Delete a task by ID
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });
  const deleted = todos.splice(index, 1)[0];
  res.json({ message: "Task deleted", deleted });
});
// Start server
app.listen(PORT, () => {
  console.log(`To-Do API running at http://localhost:${PORT}`);
});
