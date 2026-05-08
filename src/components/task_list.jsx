export function TaskListStatus({ completed, remaining }) {
  return (
    <section>
      <div>
        <p>Completed</p>
        <p>To action</p>
      </div>
      <div>
        {completed}/{remaining}
      </div>
    </section>
  );
}

export function TaskListItem({ item }) {
  return (
    <li id={item?.id} className="task_item">
      <button className="task_items_left">
        <svg>
          <circle cx="11.998" cy="11.998" fillRule="nonzero" r="9.998" />
        </svg>
        <p>{item?.title}</p>
      </button>
      <div className="task_items_right">
        <button>
          <span className="visually-hidden">Edit</span>
          <svg>
            <path d="" />
          </svg>
        </button>
        <button>
          <span className="visually-hidden">Delete</span>
          <svg>
            <path d="" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export function TaskList() {
  return (
    <ol className="task_list">
      <TaskListItem item={{ id: 1, title: "Task 1" }} />
      <TaskListItem item={{ id: 2, title: "Task 2" }} />
    </ol>
  );
}
