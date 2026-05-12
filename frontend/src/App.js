import "./App.css";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { TaskList } from "./components/TaskList";

function App() {
  // Set tasks state to pass to classes
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <Header />
      <Form onTaskCreation={fetchTasks} />
      <TaskList tasks={tasks} onDelete={deleteTask} />
    </div>
  );
}

export default App;
