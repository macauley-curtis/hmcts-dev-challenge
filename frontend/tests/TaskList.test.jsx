import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { TaskList } from "../src/components/TaskList";

describe("TaskList", () => {
  it("should be empty when no tasks are passed", () => {
    const { container } = render(
      <TaskList
        tasks={[]}
        statuses={["Pending", "In Progress", "Completed"]}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />,
    );
    const listItems = container.querySelectorAll("li");
    expect(listItems).toHaveLength(0);
  });

  const testTask = {
    task_id: 1,
    task_name: "Test Task",
    task_type: "Hearing",
    task_description: "Test description",
    task_status: "Pending",
    due_date: "2099-12-31",
  };

  beforeEach(() => {
    render(
      <TaskList
        tasks={[testTask]}
        statuses={["Pending", "In Progress", "Completed"]}
        onDelete={() => {}}
        onStatusChange={() => {}}
      />,
    );
  });

  it("renders the task list header component", () => {
    const header = screen.getByRole("heading", { name: /task list/i });
    expect(header).toBeInTheDocument();
  });
  it("render delete button", () => {
    const deleteButton = screen.getByRole("button", { name: /del/i });
    expect(deleteButton).toBeInTheDocument();
  });

  it("renders task elements with correct types", () => {
    const taskName = screen.getByText(/test task/i);
    const taskType = screen.getByText(/hearing/i);
    const taskDescription = screen.getByText(/test description/i);
    const statusLabel = screen.getByLabelText(/status/i);
    const expectedDueDate = new Date(testTask.due_date).toLocaleDateString();
    const dueDate = screen.getByText(expectedDueDate);
    expect(taskName).toBeInTheDocument();
    expect(taskType).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(statusLabel).toBeInTheDocument();
    expect(dueDate).toBeInTheDocument();

    expect(taskName.tagName).toBe("STRONG");
    expect(taskType.tagName).toBe("LI");
    expect(taskDescription.tagName).toBe("LI");
    expect(statusLabel.tagName).toBe("SELECT");
    expect(dueDate.tagName).toBe("LI");

    expect(taskName.textContent).toContain("Test Task");
    expect(taskType.textContent).toContain("Hearing");
    expect(taskDescription.textContent).toContain("Test description");
    expect(statusLabel.value).toBe("Pending");
    expect(dueDate.textContent).toContain(expectedDueDate);
  });

  it("should call onStatusChange when status is changed", () => {
    const mockStatusChange = vi.fn();
    const { container } = render(
      <TaskList
        tasks={[testTask]}
        statuses={["Pending", "In Progress", "Completed"]}
        onDelete={() => {}}
        onStatusChange={mockStatusChange}
      />,
    );
    const statusSelect = container.querySelector(`#status-${testTask.task_id}`);

    fireEvent.change(statusSelect, { target: { value: "Completed" } });

    expect(mockStatusChange).toHaveBeenCalledWith(
      testTask.task_id,
      "Completed",
    );
  });

  it("should call onDelete when delete button is clicked", () => {
    const mockOnDelete = vi.fn();
    const { container } = render(
      <TaskList
        tasks={[testTask]}
        statuses={["Pending", "In Progress", "Completed"]}
        onDelete={mockOnDelete}
        onStatusChange={() => {}}
      />,
    );
    const deleteButton = container.querySelector("button");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(testTask.task_id);
  });
});
