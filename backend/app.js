require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/tasks", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tasks ORDER BY created_at DESC",
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/task-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT unnest(enum_range(NULL::task_type_enum)) AS type;
    `);

    res.json(result.rows.map((r) => r.type));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/task-statuses", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT unnest(enum_range(NULL::task_status_enum)) AS status;
    `);

    res.json(result.rows.map((r) => r.status));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/tasks", async (req, res) => {
  try {
    const { task_name, task_type, task_description, task_status, due_date } =
      req.body;

    const result = await pool.query(
      `INSERT INTO tasks (task_name, task_type, task_description, task_status, due_date)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [task_name, task_type, task_description, task_status, due_date],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/tasks/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;

    const result = await pool.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
      [task_id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ ok: true, deleted: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.put("/api/tasks/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { task_status } = req.body;

    const result = await pool.query(
      `UPDATE tasks
       SET task_status = $1,
           updated_at = CURRENT_TIMESTAMP
       WHERE task_id = $2
       RETURNING *`,
      [task_status, task_id],
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
