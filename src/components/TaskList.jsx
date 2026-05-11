import React, { useState, useEffect } from "react";

export function TaskList({ tasks, onDelete }) {
  // on task creation, fetch list of task
  return (
    <div>
      <h2>Task List</h2>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.task_name}</strong> - {task.task_type} -{" "}
            {task.task_description} - {""} {task.task_status} - Due:{" "}
            {new Date(task.due_date).toLocaleDateString()} delete:
            <button onClick={() => onDelete(task.id)}>del</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
