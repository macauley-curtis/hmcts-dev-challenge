const request = require("supertest");
const pool = require("../db");
pool.query = vi.fn();
const app = require("../app");

describe("DELETE /api/tasks", () => {
  const deletionTask = {
    task_id: 1,
    task_name: "Task to Delete",
    task_type: "Hearing",
    task_description: "This task will be deleted",
    task_status: "Pending",
    due_date: "2099-12-31",
    created_at: "2024-01-01T00:00:00.000Z",
  };

  it("should delete a task and return it with status 200", async () => {
    pool.query.mockResolvedValue({
      rows: [deletionTask],
    });

    const res = await request(app).delete("/api/tasks/1");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject(deletionTask);
  });

  //better suited for an integration test with a real database
  //   it("db should be empty after deletion", async () => {
  //     pool.query.mockResolvedValue({ rows: [] });

  //     const res = await request(app).get("/api/tasks");

  //     expect(res.status).toBe(200);
  //     expect(res.body).toEqual([]);
  //   });
});
