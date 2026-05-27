import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { TaskList } from "../src/components/TaskList";

describe("TaskList", () => {
  it("should be empty when no tasks are passed", () => {
    const { container } = render(
      <TaskList
        tasks={[]}
        statuses={["Pending", "In Progress", "Completed"]}
        taskTypes={[
          "Hearing",
          "Case Management",
          "Document Review",
          "Bug",
          "Other",
        ]}
        onDelete={() => {}}
        onStatusChange={() => {}}
        onTaskNameChange={() => {}}
        onTaskDescriptionChange={() => {}}
        onTaskTypeChange={() => {}}
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
        taskTypes={[
          "Hearing",
          "Case Management",
          "Document Review",
          "Bug",
          "Other",
        ]}
        onDelete={() => {}}
        onStatusChange={() => {}}
        onTaskNameChange={() => {}}
        onTaskDescriptionChange={() => {}}
        onTaskTypeChange={() => {}}
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
    const taskName = screen.getByLabelText(/task name/i);
    const taskType = screen.getByText(/hearing/i);
    const taskDescription = screen.getByLabelText(/description/i);
    const statusLabel = screen.getByLabelText(/status/i);
    const expectedDueDate = new Date(testTask.due_date).toLocaleDateString();
    const taskItem = screen.getByRole("listitem");
    expect(taskName).toBeInTheDocument();
    expect(taskType).toBeInTheDocument();
    expect(taskDescription).toBeInTheDocument();
    expect(statusLabel).toBeInTheDocument();
    expect(taskItem).toHaveTextContent(expectedDueDate);

    expect(taskName.tagName).toBe("INPUT");
    expect(taskType.tagName).toBe("OPTION");
    expect(taskDescription.tagName).toBe("TEXTAREA");
    expect(statusLabel.tagName).toBe("SELECT");
    expect(taskItem.tagName).toBe("LI");

    expect(taskName.value).toBe("Test Task");
    expect(taskType.textContent).toContain("Hearing");
    expect(taskDescription.value).toBe("Test description");
    expect(statusLabel.value).toBe("Pending");
  });

  it("should call onStatusChange when status is changed", () => {
    const mockStatusChange = vi.fn();
    const { container } = render(
      <TaskList
        tasks={[testTask]}
        statuses={["Pending", "In Progress", "Completed"]}
        taskTypes={[
          "Hearing",
          "Case Management",
          "Document Review",
          "Bug",
          "Other",
        ]}
        onDelete={() => {}}
        onStatusChange={mockStatusChange}
        onTaskNameChange={() => {}}
        onTaskDescriptionChange={() => {}}
        onTaskTypeChange={() => {}}
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
        taskTypes={[
          "Hearing",
          "Case Management",
          "Document Review",
          "Bug",
          "Other",
        ]}
        onDelete={mockOnDelete}
        onStatusChange={() => {}}
        onTaskNameChange={() => {}}
        onTaskDescriptionChange={() => {}}
        onTaskTypeChange={() => {}}
      />,
    );

    const deleteButton = container.querySelector("button");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(testTask.task_id);
  });

  it("should call onTaskTypeChange when type is changed", () => {
    const mockTypeChange = vi.fn();
    const { container } = render(
      <TaskList
        tasks={[testTask]}
        statuses={["Pending", "In Progress", "Completed"]}
        taskTypes={[
          "Hearing",
          "Case Management",
          "Document Review",
          "Bug",
          "Other",
        ]}
        onDelete={() => {}}
        onStatusChange={() => {}}
        onTaskNameChange={() => {}}
        onTaskDescriptionChange={() => {}}
        onTaskTypeChange={mockTypeChange}
      />,
    );
    const typeSelect = container.querySelector(`#type-${testTask.task_id}`);
    fireEvent.change(typeSelect, { target: { value: "Case Management" } });
    expect(mockTypeChange).toHaveBeenCalledWith(
      testTask.task_id,
      "Case Management",
    );
  });
});
