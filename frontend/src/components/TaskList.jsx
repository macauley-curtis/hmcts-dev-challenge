import Dropdown from "react-bootstrap/Dropdown";

function BasicExample() {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Dropdown Button
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default BasicExample;

export function TaskList({ tasks, onDelete, onStatusChange }) {
  // on task creation, fetch list of task
  return (
    <div>
      <h2>Task List</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>
            <strong>{task.task_name}</strong> - {task.task_type} -{" "}
            {task.task_description} - {""}
            <label htmlFor={`status-${task.task_id}`}>Status:</label>
            <select
              id={`status-${task.task_id}`}
              value={task.task_status}
              onChange={(e) => onStatusChange(task.task_id, e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Deleted">Deleted</option>
            </select>
            | Due:{" "}
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}{" "}
            delete:
            <button type="button" onClick={() => onDelete(task.task_id)}>
              del
            </button>
            {/* <button onClick={() => onEdit(task.task_id)}>edit</button> */}
          </li>
        ))}
      </ul>
    </div>
  );
}
