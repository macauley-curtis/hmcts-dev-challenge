import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Form({ onTaskCreation, taskTypes = [], taskStatuses = [] }) {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [taskStatus, setTaskStatus] = useState("");

  useEffect(() => {
    if (taskTypes.length > 0 && !taskTypes.includes(taskType)) {
      setTaskType(taskTypes[0]);
    }
  }, [taskTypes, taskType]);

  useEffect(() => {
    if (taskStatuses.length > 0 && !taskStatuses.includes(taskStatus)) {
      setTaskStatus(taskStatuses[0]);
    }
  }, [taskStatuses, taskStatus]);

  const submitEvent = async (e) => {
    e.preventDefault();

    const body = {
      task_name: taskName,
      task_type: taskType,
      task_description: taskDescription,
      task_status: taskStatus,
      due_date: dueDate ? dueDate.toISOString() : null,
    };
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setTaskName("");
      setTaskType(taskTypes[0] || "");
      setTaskDescription("");
      setDueDate(null);
      setTaskStatus(taskStatuses[0] || "");

      onTaskCreation();
    } else {
      console.error("Create failed", await res.text());
    }
  };

  return (
    <form className="form" onSubmit={submitEvent}>
      <label htmlFor="task_name">Task name</label>
      <input
        id="task_name"
        name="task_name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        required
      />

      <label htmlFor="task_type">Type</label>
      <select
        id="task_type"
        value={taskType}
        onChange={(e) => setTaskType(e.target.value)}
        required
      >
        {taskTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <label htmlFor="task_description">Description</label>
      <textarea
        id="task_description"
        value={taskDescription}
        onChange={(e) => setTaskDescription(e.target.value)}
      />

      <label htmlFor="task_status">Status</label>
      <select
        id="task_status"
        value={taskStatus}
        onChange={(e) => setTaskStatus(e.target.value)}
        required
      >
        {taskStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>

      <label htmlFor="due_date">Due Date</label>
      <DatePicker
        id="due_date"
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select due date"
        isClearable
      />

      <button type="submit">Submit task</button>
    </form>
  );
}
