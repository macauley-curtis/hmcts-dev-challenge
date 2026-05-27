import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { Form } from "../src/components/Form";

describe("Form", () => {
  const taskTypes = [
    "Hearing",
    "Case Management",
    "Document Review",
    "Bug",
    "Other",
  ];
  const taskStatuses = ["To do", "In Progress", "Completed", "Deleted"];

  const valid_inputs = {
    task_name: "Test task",
    task_type: "Hearing",
    task_description: "This is a test task",
    task_status: "To do",
    due_date: "2099-12-31T23:59:59.000Z",
  };

  it("renders the form component in order", () => {
    render(
      <Form
        onTaskCreation={() => {}}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const fields = [
      screen.getByLabelText(/task name/i),
      screen.getByLabelText(/type/i),
      screen.getByLabelText(/description/i),
      screen.getByLabelText(/status/i),
      screen.getByLabelText(/due date/i),
    ];

    // check elements are present
    fields.forEach((f) => expect(f).toBeInTheDocument());

    // check elements order
    expect(fields[0].compareDocumentPosition(fields[1])).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(fields[1].compareDocumentPosition(fields[2])).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(fields[2].compareDocumentPosition(fields[3])).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(fields[3].compareDocumentPosition(fields[4])).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("should have the correct field types", () => {
    render(
      <Form
        onTaskCreation={() => {}}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const fields = [
      screen.getByLabelText(/task name/i),
      screen.getByLabelText(/type/i),
      screen.getByLabelText(/description/i),
      screen.getByLabelText(/status/i),
      screen.getByLabelText(/due date/i),
    ];

    expect(fields[0].tagName).toBe("INPUT");
    expect(fields[1].tagName).toBe("SELECT");
    expect(fields[2].tagName).toBe("TEXTAREA");
    expect(fields[3].tagName).toBe("SELECT");
    expect(fields[4].tagName).toBe("INPUT");
  });

  it("should have the create button", () => {
    render(
      <Form
        onTaskCreation={() => {}}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const button = screen.getByRole("button", { name: /create task/i });
    expect(button).toBeInTheDocument();
  });

  it("should have a valid type drop down", () => {
    render(
      <Form
        onTaskCreation={() => {}}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const typeSelect = screen.getByLabelText(/type/i);
    const valid_types = Array.from(typeSelect.options).map(
      (o) => o.textContent,
    );
    expect(valid_types).toEqual([
      "Hearing",
      "Case Management",
      "Document Review",
      "Bug",
      "Other",
    ]);
    expect(valid_types.length).toBe(5);
  });

  it("should have a valid status drop down", () => {
    render(
      <Form
        onTaskCreation={() => {}}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const statusSelect = screen.getByLabelText(/status/i);
    const valid_statuses = Array.from(statusSelect.options).map(
      (o) => o.textContent,
    );
    expect(valid_statuses).toEqual([
      "To do",
      "In Progress",
      "Completed",
      "Deleted",
    ]);
    expect(valid_statuses.length).toBe(4);
  });

  it("should submit the form with valid values", async () => {
    const mockOnTaskCreation = vi.fn();

    const originalFetch = global.fetch;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });

    render(
      <Form
        onTaskCreation={mockOnTaskCreation}
        taskTypes={taskTypes}
        taskStatuses={taskStatuses}
      />,
    );

    const taskNameInput = screen.getByLabelText(/task name/i);
    const taskTypeInput = screen.getByLabelText(/type/i);
    const taskDescriptionInput = screen.getByLabelText(/description/i);
    const taskStatusInput = screen.getByLabelText(/status/i);

    fireEvent.change(taskNameInput, {
      target: { value: valid_inputs.task_name },
    });

    fireEvent.change(taskTypeInput, {
      target: { value: valid_inputs.task_type },
    });

    fireEvent.change(taskDescriptionInput, {
      target: { value: valid_inputs.task_description },
    });

    fireEvent.change(taskStatusInput, {
      target: { value: valid_inputs.task_status },
    });

    fireEvent.click(screen.getByRole("button", { name: /create task/i }));

    await waitFor(() => {
      expect(mockOnTaskCreation).toHaveBeenCalled();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/tasks", expect.any(Object));

    const [, options] = global.fetch.mock.calls[0];

    expect(options.method).toBe("POST");

    const body = JSON.parse(options.body);

    expect(body.task_name).toBe(valid_inputs.task_name);
    expect(body.task_type).toBe(valid_inputs.task_type);
    expect(body.task_description).toBe(valid_inputs.task_description);
    expect(body.task_status).toBe(valid_inputs.task_status);

    global.fetch = originalFetch;
  });
});
