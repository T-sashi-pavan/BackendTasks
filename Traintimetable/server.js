const express = require("express");
const mongoose = require("mongoose");
const Train = require("./models/Train");
const Ticket = require("./models/Ticket");

const app = express();
app.use(express.json());

// ✅ MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/trainSystem", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err));

// ------------------------------
// 🚆 TRAIN APIs (CRUD)
// ------------------------------

// CREATE Train
app.post("/trains", async (req, res) => {
  try {
    const { trainNo, station, departure } = req.body;
    const newTrain = new Train({ trainNo, station, departure });
    await newTrain.save();
    res.status(201).json(newTrain);
  } catch (err) {
    res.status(500).json({ message: "Error adding train" });
  }
});

// READ All Trains (timetable with filters)
app.get("/timetable", async (req, res) => {
  try {
    let trains = await Train.find();
    const { station, trainNo } = req.query;

    if (station) {
      trains = trains.filter(
        (t) => t.station.toLowerCase() === station.toLowerCase()
      );
    }
    if (trainNo) {
      trains = trains.filter((t) => t.trainNo == trainNo);
    }

    // Sort by departure
    trains.sort((a, b) => new Date(a.departure) - new Date(b.departure));

    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: "Error fetching timetable" });
  }
});

// UPDATE Train
app.put("/trains/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrain = await Train.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTrain) return res.status(404).json({ message: "Train not found" });
    res.json(updatedTrain);
  } catch (err) {
    res.status(500).json({ message: "Error updating train" });
  }
});

// DELETE Train
app.delete("/trains/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrain = await Train.findByIdAndDelete(id);
    if (!deletedTrain) return res.status(404).json({ message: "Train not found" });
    res.json({ message: "Train deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting train" });
  }
});

// ------------------------------
// 🎟️ TICKET APIs (CRUD)
// ------------------------------

// CREATE Ticket
app.post("/generate-ticket", async (req, res) => {
  try {
    const { trainNo } = req.body;

    const ticketNumber =
      "TRAIN-" +
      new Date().toISOString().slice(0, 10).replace(/-/g, "") +
      "-" +
      Math.random().toString(36).substr(2, 5).toUpperCase();

    const newTicket = new Ticket({ ticketNumber, trainNo });
    await newTicket.save();
    res.status(201).json(newTicket);
  } catch (err) {
    res.status(500).json({ message: "Error generating ticket" });
  }
});

// READ All Tickets
app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: "Error fetching tickets" });
  }
});

// UPDATE Ticket (change trainNo if needed)
app.put("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTicket = await Ticket.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedTicket) return res.status(404).json({ message: "Ticket not found" });
    res.json(updatedTicket);
  } catch (err) {
    res.status(500).json({ message: "Error updating ticket" });
  }
});

// DELETE Ticket
app.delete("/tickets/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTicket = await Ticket.findByIdAndDelete(id);
    if (!deletedTicket) return res.status(404).json({ message: "Ticket not found" });
    res.json({ message: "Ticket deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting ticket" });
  }
});

// ------------------------------
// 🚀 Start Server
// ------------------------------
const PORT = 5000;
app.listen(PORT, () =>
  console.log(`🚆 Train System running on http://localhost:${PORT}`)
);
