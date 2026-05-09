import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Form() {
  const [taskName, setTaskName] = useState("");
  const [taskType, setTaskType] = useState("Other");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [taskStatus, setTaskStatus] = useState("Pending");

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
      setTaskType("Other");
      setTaskDescription("");
      setDueDate(null);
      setTaskStatus("Pending");
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
      >
        <option>Hearing</option>
        <option>Case Management</option>
        <option>Document Review</option>
        <option>Bug</option>
        <option>Other</option>
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
      >
        <option>Pending</option>
        <option>In Progress</option>
        <option>Completed</option>
        <option>Deleted</option>
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

      <button type="submit">Create task</button>
    </form>
  );
}
