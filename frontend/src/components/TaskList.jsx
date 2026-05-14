export function TaskList({ tasks, statuses, onDelete, onStatusChange }) {
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
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
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
