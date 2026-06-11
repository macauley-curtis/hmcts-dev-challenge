export function TaskList({
  tasks = [],
  statuses = [],
  onDelete = () => {},
  onStatusChange = () => {},
  onTaskNameChange = () => {},
  onTaskDescriptionChange = () => {},
  onDueDateChange = () => {},
  taskTypes = [],
  onTaskTypeChange = () => {},
}) {
  return (
    <div>
      <h2>Task List</h2>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task.task_id} className="task-card">
            <div className="task-header">
              <input
                id={`task-name-${task.task_id}`}
                type="text"
                value={task.task_name}
                onChange={(e) =>
                  onTaskNameChange?.(task.task_id, e.target.value)
                }
              />
              <div className="task-footer">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => onDelete(task.task_id)}
                >
                  delete
                </button>
              </div>
            </div>

            <div className="task-fields">
              <div className="field">
                <label htmlFor={`type-${task.task_id}`}></label>
                <select
                  id={`type-${task.task_id}`}
                  value={task.task_type}
                  onChange={(e) =>
                    onTaskTypeChange?.(task.task_id, e.target.value)
                  }
                >
                  {(taskTypes || []).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor={`status-${task.task_id}`}></label>
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
                <label htmlFor={`due-date-${task.task_id}`}>Due Date</label>
                <input
                  id={`due-date-${task.task_id}`}
                  type="date"
                  value={task.due_date?.split("T")[0] || ""}
                  onChange={(e) =>
                    onDueDateChange?.(task.task_id, e.target.value)
                  }
                />
              </div>

              <div className="field_desc">
                <label htmlFor={`task-description-${task.task_id}`}></label>
                <textarea
                  id={`task-description-${task.task_id}`}
                  value={task.task_description || ""}
                  onChange={(e) =>
                    onTaskDescriptionChange?.(task.task_id, e.target.value)
                  }
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
