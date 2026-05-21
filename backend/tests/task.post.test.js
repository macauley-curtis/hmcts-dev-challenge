const request = require("supertest");
const pool = require("../db");
pool.query = vi.fn();
const app = require("../app");

describe("POST /api/taks", () => {
  const newTask = {
    task_name: "New Test Task",
    task_type: "Hearing",
    task_description: "This is a test task",
    task_status: "Pending",
    due_date: "2099-12-31",
  };

  it("should create a new task and return it with status 201", async () => {
    pool.query.mockResolvedValue({
      rows: [
        { ...newTask, task_id: 1, created_at: "2024-01-01T00:00:00.000Z" },
      ],
    });

    const res = await request(app).post("/api/tasks").send(newTask);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      ...newTask,
      task_id: 1,
      created_at: "2024-01-01T00:00:00.000Z",
    });
  });

  it("should return 500 if there is a database error", async () => {
    pool.query.mockRejectedValue(new Error("Database error"));

    const res = await request(app).post("/api/tasks").send(newTask);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
  });
});
