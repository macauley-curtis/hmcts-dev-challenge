const request = require("supertest");
const pool = require("../db");
pool.query = vi.fn();
const app = require("../app");

describe("PUT /api/tasks", () => {
  const PreviousTask = {
    task_id: 1,
    task_name: "Test Task",
    task_type: "Hearing",
    task_description: "This is a test task",
    task_status: "Pending",
    due_date: "2099-12-31",
    created_at: "2024-01-01T00:00:00.000Z",
  };
  const updatedTask = {
    task_id: 1,
    task_name: "Updated Test Task",
    task_type: "Case Management",
    task_description: "This is an updated test task",
    task_status: "Completed",
    due_date: "2099-12-31",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
  };

  it("should update a task and return it with status 200", async () => {
    pool.query.mockResolvedValue({
      rows: [updatedTask],
    });

    const res = await request(app).put("/api/tasks/1").send(updatedTask);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedTask);
  });

  it("should return 500 if there is a database error", async () => {
    pool.query.mockRejectedValue(new Error("Database error"));

    const res = await request(app).put("/api/tasks/1").send({
      task_status: "Completed",
    });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Database error" });
  });

  it("updated task status should be 'Completed'", async () => {
    pool.query.mockResolvedValue({
      rows: [updatedTask],
    });

    const res = await request(app).put("/api/tasks/1").send({
      task_status: "Completed",
    });

    expect(res.status).toBe(200);
    expect(res.body.task_status).toBe("Completed");
  });
});
