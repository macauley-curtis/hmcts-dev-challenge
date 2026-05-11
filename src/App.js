import "./App.css";
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { Form } from "./components/Form";
import { TaskList } from "./components/TaskList";

function App() {
  // Set tasks state to pass to classes
  const [task, setTasks] = useState([]);

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
      <TaskList tasks={task} />
    </div>
  );
}

export default App;
