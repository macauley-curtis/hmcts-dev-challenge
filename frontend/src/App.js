import "./App.css";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { TaskList } from "./components/TaskList";

function deleteTask(task_id) {
  fetch(`/api/tasks/${task_id}`, {
    method: "DELETE",
  }).then((res) => {
    if (res.ok) {
      console.log("Deleted task", task_id);
    }
  });
}

function App() {
  // Set tasks state to pass to classes
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
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
