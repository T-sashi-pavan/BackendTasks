const express = require("express");
const router = express.Router();
let users = [];
let idCounter = 1;
// CREATE user
router.post("/", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  const newUser = { id: idCounter++, name, email };
  users.push(newUser);
  res.status(201).json({ message: "User created", user: newUser });
});
// READ all users
router.get("/", (req, res) => {
  res.json(users);
});
// READ one user by id
router.get("/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
// UPDATE user by id
router.put("/:id", (req, res) => {
  const { name, email } = req.body;
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ message: "User updated", user });
});
// DELETE user by id
router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userExists = users.some(u => u.id === id);
  if (!userExists) return res.status(404).json({ message: "User not found" });
  users = users.filter(u => u.id !== id);
  res.json({ message: "User deleted" });
});
module.exports = router;
