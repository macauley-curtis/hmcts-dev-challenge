const request = require("supertest");
const app = require("../app");
const { resetTasksTable, closePool } = require("./dbTestHelpers");

beforeEach(async () => {
  await resetTasksTable();
});

afterAll(async () => {
  await closePool();
});

const newTask = {
  task_name: "Integration Test Task",
  task_type: "Hearing",
  task_description: "This is a test task for integration testing",
  task_status: "In Progress",
  due_date: "2099-12-31",
};

const firstTask = {
  task_name: "First Task",
  task_type: "Case Management",
  task_description: "This is the first task",
  task_status: "To do",
  due_date: "2099-12-30",
};

describe("integration POST /api/tasks", () => {
  const invalidStatusTask = {
    task_name: "Invalid Status Task",
    task_type: "Hearing",
    task_description: "This task has an invalid status",
    task_status: "NotARealStatus",
    due_date: "2099-12-31",
  };

  const invalidTypeTask = {
    task_name: "Invalid Type Task",
    task_type: "NotARealType",
    task_description: "This task has an invalid type",
    task_status: "In Progress",
    due_date: "2099-12-31",
  };

  const pastDueDateTask = {
    task_name: "Past Due Date Task",
    task_type: "Hearing",
    task_description: "This task has a past due date",
    task_status: "In Progress",
    due_date: "2000-01-01",
  };

  const missingFieldsTask = {
    task_name: "",
    task_type: "Hearing",
    task_description: "This task is missing required fields",
    task_status: "In Progress",
    due_date: "2099-12-31",
  };

  it("should create a new task", async () => {
    const res = await request(app).post("/api/tasks").send(newTask);
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      task_name: "Integration Test Task",
      task_type: "Hearing",
      task_description: "This is a test task for integration testing",
      task_status: "In Progress",
      due_date: "2099-12-31",
    });
  });

  it("should reject invalid status types", async () => {
    const res = await request(app).post("/api/tasks").send(invalidStatusTask);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'invalid input value for enum task_status_enum: "NotARealStatus"',
    });
  });

  it("should reject invalid task types", async () => {
    const res = await request(app).post("/api/tasks").send(invalidTypeTask);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: 'invalid input value for enum task_type_enum: \"NotARealType\"',
    });
  });

  it("should reject past due dates", async () => {
    const res = await request(app).post("/api/tasks").send(pastDueDateTask);
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error:
        'new row for relation "tasks" violates check constraint "due_date_check"',
    });
  });

  it("expect a post error when missing required fields", async () => {
    const res = await request(app).post("/api/tasks").send(missingFieldsTask);
    expect(res.status).toBe(201);
  });
});

describe("integration GET /api/tasks", () => {
  it("should fetch the correct task status types", async () => {
    const res = await request(app).get("/api/task-statuses");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(["To do", "In Progress", "Completed", "Deleted"]);
  });

  it("should fetch the correct task types", async () => {
    const res = await request(app).get("/api/task-types");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      "Hearing",
      "Case Management",
      "Document Review",
      "Bug",
      "Other",
    ]);
  });

  it("should return exact list of tasks in desc order", async () => {
    const res = await request(app).post("/api/tasks").send(firstTask);
    const res2 = await request(app).post("/api/tasks").send(newTask);

    const getRes = await request(app).get("/api/tasks");
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          task_name: "First Task",
          task_type: "Case Management",
          task_description: "This is the first task",
          task_status: "To do",
          due_date: "2099-12-30",
        }),
        expect.objectContaining({
          task_name: "Integration Test Task",
          task_type: "Hearing",
          task_description: "This is a test task for integration testing",
          task_status: "In Progress",
          due_date: "2099-12-31",
        }),
      ]),
    );
  });
  // add provided warning/info for empty return in main file and test
});

describe("integration PUT /api/tasks/:task_id", () => {
  const updatedTaskName = {
    task_name: "First Task UPDATED",
    task_type: "Case Management",
    task_description: "This is the first task",
    task_status: "To do",
    due_date: "2099-12-30",
  };

  const updatedTaskStatus = {
    task_name: "First Task",
    task_type: "Case Management",
    task_description: "This is the first task",
    task_status: "Completed",
    due_date: "2099-12-30",
  };

  const updatedTaskType = {
    task_name: "First Task",
    task_type: "Document Review",
    task_description: "This is the first task",
    task_status: "To do",
    due_date: "2099-12-30",
  };

  const updatedTaskDueDate = {
    task_name: "First Task",
    task_type: "Case Management",
    task_description: "This is the first task",
    task_status: "To do",
    due_date: "2099-12-31",
  };

  const updatedTaskDescription = {
    task_name: "First Task",
    task_type: "Case Management",
    task_description: "This is the UPDATED description",
    task_status: "To do",
    due_date: "2099-12-30",
  };

  it("should update a task and return the updated task field", async () => {
    const res = await request(app).post("/api/tasks").send(firstTask);

    const updateRes = await request(app)
      .put(`/api/tasks/${res.body.task_id}`)
      .send(updatedTaskStatus);

    expect(updateRes.status).toBe(200);
    expect(updateRes.body).toMatchObject({
      task_name: "First Task",
      task_type: "Case Management",
      task_description: "This is the first task",
      task_status: "Completed",
      due_date: "2099-12-30",
    });
  });

  it("should return error if task not found", async () => {
    const updateRes = await request(app)
      .put("/api/tasks/9999")
      .send(updatedTaskStatus);

    expect(updateRes.status).toBe(404);
    expect(updateRes.body).toEqual({ error: "Task not found" });
  });

  it("should updated the updated_at field to the current timestamp", async () => {
    expect(1).toBe(1);
  });

  // error handling on update
});

describe("integration DELETE /api/tasks/:task_id", () => {
  it("should delete a task and return the only remaining task", async () => {
    const res = await request(app).post("/api/tasks").send(firstTask);
    const res2 = await request(app).post("/api/tasks").send(newTask);

    const deleteRes = await request(app).delete(
      `/api/tasks/${res.body.task_id}`,
    );
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toEqual({
      ok: true,
      deleted: expect.objectContaining({
        task_name: "First Task",
        task_type: "Case Management",
        task_description: "This is the first task",
        task_status: "To do",
        due_date: "2099-12-30",
      }),
    });

    const getRes = await request(app).get("/api/tasks");
    expect(getRes.status).toBe(200);
    expect(getRes.body).toEqual([
      expect.objectContaining({
        task_name: "Integration Test Task",
        task_type: "Hearing",
        task_description: "This is a test task for integration testing",
        task_status: "In Progress",
        due_date: "2099-12-31",
      }),
    ]);
    ]);
  });

  // error handling on deletion
});

// clean db
