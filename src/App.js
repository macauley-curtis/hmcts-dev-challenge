import "./App.css";
import { Header } from "./components/header";
import { Form } from "./components/form";
import { TaskList, TaskListStatus } from "./components/task_list";

function App() {
  return (
    <div className="App">
      <Header />
      <Form />
      <TaskListStatus completed={2} remaining={5} />
      <TaskList />
    </div>
  );
}

export default App;
