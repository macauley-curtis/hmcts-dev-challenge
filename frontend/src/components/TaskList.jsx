export function TaskList({
  tasks = [],
  statuses = [],
  onDelete = () => {},
  onStatusChange = () => {},
  onTaskNameChange = () => {},
  onTaskDescriptionChange = () => {},
  taskTypes = [],
  onTaskTypeChange = () => {},
}) {
  return (
    <div>
      <h2>Task List</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.task_id}>
            <label htmlFor={`task-name-${task.task_id}`}>Task name:</label>
            <input
              id={`task-name-${task.task_id}`}
              type="text"
              value={task.task_name}
              onChange={(e) => onTaskNameChange?.(task.task_id, e.target.value)}
            />
            <label htmlFor={`type-${task.task_id}`}>Type:</label>
            <select
              id={`type-${task.task_id}`}
              value={task.task_type}
              onChange={(e) => onTaskTypeChange?.(task.task_id, e.target.value)}
            >
              {(taskTypes || []).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <label htmlFor={`task-description-${task.task_id}`}>
              Description:
            </label>
            <textarea
              id={`task-description-${task.task_id}`}
              value={task.task_description || ""}
              onChange={(e) =>
                onTaskDescriptionChange?.(task.task_id, e.target.value)
              }
            />
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
            {task.due_date ? new Date(task.due_date).toLocaleDateString() : "-"}{" "}
            delete:
            <button type="button" onClick={() => onDelete(task.task_id)}>
              del
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
