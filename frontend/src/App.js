import "./App.css";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { TaskList } from "./components/TaskList";

function App() {
  // Set tasks state to pass to classes
  const [tasks, setTasks] = useState([]);
  const [taskTypes, setTaskTypes] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  const fetchStatuses = async () => {
    const res = await fetch("/api/task-statuses");
    const data = await res.json();
    setStatuses(data);
  };

  const fetchTaskTypes = async () => {
    const res = await fetch("/api/task-types");
    const data = await res.json();
    setTaskTypes(data);
  };

  const deleteTask = async (task_id) => {
    try {
      const res = await fetch(`/api/tasks/${task_id}`, { method: "DELETE" });
      if (res.ok) {
        console.log("Deleted task", task_id);
        await fetchTasks();
      } else {
        const txt = await res.text();
        console.error("Delete failed:", txt);
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const updateTask = async (task_id, updates) => {
    try {
      const res = await fetch(`/api/tasks/${task_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        console.log(`Updated task ${task_id}`);
        await fetchTasks();
      } else {
        const txt = await res.text();
        console.error("Update failed:", txt);
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const updateTaskStatus = async (task_id, new_status) => {
    await updateTask(task_id, { task_status: new_status });
  };

  const updateTaskName = async (task_id, new_name) => {
    await updateTask(task_id, { task_name: new_name });
  };

  const updateTaskDescription = async (task_id, new_description) => {
    await updateTask(task_id, { task_description: new_description });
  };

  const updateTaskType = async (task_id, new_type) => {
    await updateTask(task_id, { task_type: new_type });
  };

  useEffect(() => {
    fetchTasks();
    fetchStatuses();
    fetchTaskTypes();
  }, []);

  return (
    <div className="App">
      <Header />
      <Form
        onTaskCreation={fetchTasks}
        taskTypes={taskTypes}
        taskStatuses={statuses}
      />
      <TaskList
        tasks={tasks}
        taskTypes={taskTypes}
        statuses={statuses}
        onDelete={deleteTask}
        onStatusChange={updateTaskStatus}
        onTaskNameChange={updateTaskName}
        onTaskDescriptionChange={updateTaskDescription}
        onTaskTypeChange={updateTaskType}
      />
    </div>
  );
}

export default App;
