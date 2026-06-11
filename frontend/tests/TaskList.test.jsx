import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { TaskList } from "../src/components/TaskList";

const testTask = {
  task_id: 1,
  task_name: "Test Task",
  task_type: "Hearing",
  task_description: "Test description",
  task_status: "Pending",
  due_date: "2099-12-31",
};

const defaultProps = {
  tasks: [testTask],
  statuses: ["Pending", "In Progress", "Completed"],
  taskTypes: ["Hearing", "Case Management", "Document Review", "Bug", "Other"],
  onDelete: vi.fn(),
  onStatusChange: vi.fn(),
  onTaskNameChange: vi.fn(),
  onTaskDescriptionChange: vi.fn(),
  onTaskTypeChange: vi.fn(),
};

const renderTaskList = (props = {}) => {
  return render(<TaskList {...defaultProps} {...props} />);
};

describe("TaskList", () => {
  it("should be empty when no tasks are passed", () => {
    renderTaskList({ tasks: [] });

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders the task list header component", () => {
    renderTaskList();

    expect(
      screen.getByRole("heading", { name: /task list/i }),
    ).toBeInTheDocument();
  });

  it("renders delete button", () => {
    renderTaskList();

    expect(screen.getByRole("button", { name: /del/i })).toBeInTheDocument();
  });

  it("renders task elements with correct values", () => {
    renderTaskList();

    const taskName = screen.getByDisplayValue("Test Task");
    const taskDescription = screen.getByDisplayValue("Test description");
    const statusSelect = screen.getByDisplayValue("Pending");

    expect(taskName).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();

    expect(taskName.tagName).toBe("INPUT");
    expect(taskDescription.tagName).toBe("TEXTAREA");
    expect(statusSelect.tagName).toBe("SELECT");
  });

  it("should call onStatusChange when status is changed", () => {
    const mockStatusChange = vi.fn();

    renderTaskList({
      onStatusChange: mockStatusChange,
    });

    const statusSelect = screen.getByDisplayValue("Pending");

    fireEvent.change(statusSelect, {
      target: { value: "Completed" },
    });

    expect(mockStatusChange).toHaveBeenCalledWith(
      testTask.task_id,
      "Completed",
    );
  });

  it("should call onDelete when delete button is clicked", () => {
    const mockOnDelete = vi.fn();

    renderTaskList({
      onDelete: mockOnDelete,
    });

    fireEvent.click(screen.getByRole("button", { name: /del/i }));

    expect(mockOnDelete).toHaveBeenCalledWith(testTask.task_id);
  });

  it("should call onTaskTypeChange when type is changed", () => {
    const mockTypeChange = vi.fn();

    renderTaskList({
      onTaskTypeChange: mockTypeChange,
    });

    const typeSelect = screen.getByDisplayValue("Hearing");

    fireEvent.change(typeSelect, {
      target: { value: "Case Management" },
    });

    expect(mockTypeChange).toHaveBeenCalledWith(
      testTask.task_id,
      "Case Management",
    );
  });
});
