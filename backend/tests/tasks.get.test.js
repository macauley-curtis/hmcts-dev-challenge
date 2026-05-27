const request = require("supertest");
const pool = require("../db");
pool.query = vi.fn();
const app = require("../app");

describe("GET /api/tasks", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  it("returns tasks (200) with rows from db", async () => {
    pool.query.mockResolvedValue({
      rows: [{ task_id: 1, task_name: "Test Task" }],
    });

    const res = await request(app).get("/api/tasks");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ task_id: 1, task_name: "Test Task" }]);
  });

  it("should return a list of tasks", async () => {
    const mockTasks = [
      {
        task_id: 1,
        task_name: "Test Task",
        task_type: "Hearing",
        task_description: "Test description",
        task_status: "To do",
        due_date: "2099-12-31",
        created_at: "2024-01-01T00:00:00.000Z",
      },
    ];

    pool.query.mockResolvedValue({ rows: mockTasks });

    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTasks);
  });

  // it("should return the list ordered by created_at descending", async () => {
  //   const mockTasks = [
  //     {
  //       task_id: 1,
  //       task_name: "Older Task",
  //       created_at: "2024-01-01T00:00:00.000Z",
  //     },
  //     {
  //       task_id: 2,
  //       task_name: "Newer Task",
  //       created_at: "2024-02-01T00:00:00.000Z",
  //     },
  //   ];

  //   pool.query.mockResolvedValue({ rows: mockTasks });

  //   const response = await request(app).get("/api/tasks");

  //   expect(response.status).toBe(200);
  //   expect(response.body[1].task_name).toBe("Newer Task");
  //   expect(response.body[0].task_name).toBe("Older Task");
  // });

  it("should return 500 if there is a database error", async () => {
    pool.query.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/api/tasks");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Database error" });
  });
});

describe("GET /api/task-statuses", () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  const mockStatuses = ["Pending", "In Progress", "Completed"];
  const allowed = mockStatuses;

  it("should return a list of task statuses", async () => {
    pool.query.mockResolvedValue({
      rows: mockStatuses.map((status) => ({ status })),
    });

    const response = await request(app).get("/api/task-statuses");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockStatuses);
  });

  it("should have valid task statuses", async () => {
    pool.query.mockResolvedValue({
      rows: mockStatuses.map((status) => ({ status })),
    });

    const response = await request(app).get("/api/task-statuses");

    expect(response.status).toBe(200);
    expect(response.body.every((s) => allowed.includes(s))).toBe(true);
  });
});
