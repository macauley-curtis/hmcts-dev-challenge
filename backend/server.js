require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// simple health
app.get("/health", (req, res) => res.json({ ok: true }));

// Create a task
app.post("/api/tasks", async (req, res) => {
  try {
    const { task_name, task_type, task_description, task_status, due_date } =
      req.body;
    const q = `INSERT INTO tasks (task_name, task_type, task_description, task_status, due_date)
               VALUES ($1,$2,$3,$4,$5) RETURNING *`;
    const { rows } = await pool.query(q, [
      task_name,
      task_type,
      task_description,
      task_status,
      due_date,
    ]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error("POST /api/tasks error", err);
    res.status(500).json({ error: "insert failed" });
  }
});

// List tasks
app.get("/api/tasks", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );
    res.json(rows);
  } catch (err) {
    console.error("GET /api/tasks error", err);
    res.status(500).json({ error: "select failed" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

module.exports = app;
