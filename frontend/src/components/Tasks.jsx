import { useEffect, useState } from "react";
import {
  Check,
  Trash2,
  Plus,
  CalendarDays,
  Clock,
  X,
  Pencil,
} from "lucide-react";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/tasks"
      );

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const resetForm = () => {
    setTask("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    setEditingTask(null);
    setShowForm(false);
  };

  const addTask = async () => {
    if (!task.trim()) return;

    try {
      await fetch(
        `http://127.0.0.1:8000/tasks?task=${encodeURIComponent(
          task
        )}&due_date=${encodeURIComponent(
          dueDate
        )}&due_time=${encodeURIComponent(
          dueTime
        )}&description=${encodeURIComponent(
          description
        )}`,
        {
          method: "POST",
        }
      );

      resetForm();
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const startEditing = (item) => {
    setEditingTask(item);

    setTask(item.task || "");
    setDescription(item.description || "");
    setDueDate(item.due_date || "");
    setDueTime(
      item.due_time
        ? item.due_time.slice(0, 5)
        : ""
    );

    setShowForm(true);
  };

  const updateTask = async () => {
    if (!task.trim() || !editingTask) return;

    try {
      await fetch(
        `http://127.0.0.1:8000/tasks/${editingTask.id}?task=${encodeURIComponent(
          task
        )}&due_date=${encodeURIComponent(
          dueDate
        )}&due_time=${encodeURIComponent(
          dueTime
        )}&description=${encodeURIComponent(
          description
        )}`,
        {
          method: "PUT",
        }
      );

      resetForm();
      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const completeTask = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/tasks/${id}/complete`,
        {
          method: "POST",
        }
      );

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      loadTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayTasks = tasks.filter(
    (item) =>
      !item.completed &&
      item.due_date === today
  );

  const upcomingTasks = tasks.filter(
    (item) =>
      !item.completed &&
      item.due_date &&
      item.due_date > today
  );

  const noDeadlineTasks = tasks.filter(
    (item) =>
      !item.completed &&
      !item.due_date
  );

  const completedTasks = tasks.filter(
    (item) => item.completed
  );

  const activeCount =
    todayTasks.length +
    upcomingTasks.length +
    noDeadlineTasks.length;

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(
      `${dateString}T00:00:00`
    );

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const TaskCard = ({
    item,
    completed = false,
  }) => {
    return (
      <div
        className={`task-card ${
          completed
            ? "task-card-completed"
            : ""
        }`}
      >
        <button
          className={`task-checkbox ${
            completed ? "checked" : ""
          }`}
          onClick={() =>
            !completed &&
            completeTask(item.id)
          }
          title={
            completed
              ? "Completed"
              : "Complete task"
          }
        >
          {completed && (
            <Check size={15} />
          )}
        </button>

        <div className="task-main">

          <h3>{item.task}</h3>

          {item.description && (
            <p className="task-description">
              {item.description}
            </p>
          )}

          <div className="task-details">

            {item.due_date && (
              <span className="task-detail">
                <CalendarDays size={14} />

                {formatDate(
                  item.due_date
                )}
              </span>
            )}

            {item.due_time && (
              <span className="task-detail">
                <Clock size={14} />

                {item.due_time.slice(
                  0,
                  5
                )}
              </span>
            )}

            {!item.due_date &&
              !completed && (
                <span className="no-deadline-label">
                  No deadline
                </span>
              )}

          </div>
        </div>

        <div className="task-actions">

          <button
            className="edit-task-button"
            onClick={() =>
              startEditing(item)
            }
            title="Edit task"
          >
            <Pencil size={15} />
          </button>

          <button
            className="delete-task-button"
            onClick={() =>
              deleteTask(item.id)
            }
            title="Delete task"
          >
            <Trash2 size={15} />
          </button>

        </div>
      </div>
    );
  };

  const TaskSection = ({
    title,
    subtitle,
    items,
    type,
  }) => {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className="task-section">

        <div className="task-section-heading">

          <div>
            <h3>{title}</h3>

            <p>{subtitle}</p>
          </div>

          <span className="task-count">
            {items.length}
          </span>

        </div>

        <div className="task-list">

          {items.map((item) => (
            <TaskCard
              key={item.id}
              item={item}
              completed={
                type === "completed"
              }
            />
          ))}

        </div>
      </section>
    );
  };

  return (
    <div className="tasks-page">

      {/* HEADER */}

      <header className="tasks-header">

        <div>
          <p className="dashboard-label">
            TASKS
          </p>

          <div className="tasks-title-row">

            <h2>My tasks</h2>

            <span className="total-task-badge">
              {activeCount} active
            </span>

          </div>

          <p className="tasks-subtitle">
            Plan your work, keep track of
            deadlines, and stay on top of
            your study goals.
          </p>
        </div>

        <button
          className="add-task-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add task
        </button>

      </header>


      {/* FORM */}

      {showForm && (
        <div className="task-form-card">

          <div className="task-form-header">

            <div>
              <span className="form-badge">
                {editingTask
                  ? "EDIT TASK"
                  : "NEW TASK"}
              </span>

              <h3>
                {editingTask
                  ? "Edit your task"
                  : "Create a new task"}
              </h3>

              <p>
                {editingTask
                  ? "Update the details below."
                  : "Add a deadline if you need one."}
              </p>
            </div>

            <button
              className="close-form-button"
              onClick={resetForm}
            >
              <X size={18} />
            </button>

          </div>


          <div className="task-form-fields">

            <div className="form-field">

              <label>
                Task
              </label>

              <input
                className="task-title-input"
                type="text"
                placeholder="e.g. Finish SQL assignment"
                value={task}
                onChange={(e) =>
                  setTask(e.target.value)
                }
                autoFocus
              />

            </div>


            <div className="form-field">

              <label>
                Description
              </label>

              <textarea
                placeholder="Add some details (optional)"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>


            <div className="task-form-row">

              <div className="form-field">

                <label>
                  <CalendarDays
                    size={14}
                  />
                  Due date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(
                      e.target.value
                    )
                  }
                />

              </div>


              <div className="form-field">

                <label>
                  <Clock size={14} />
                  Due time
                </label>

                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) =>
                    setDueTime(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

          </div>


          <div className="task-form-actions">

            <button
              className="cancel-task"
              onClick={resetForm}
            >
              Cancel
            </button>

            <button
              className="save-task"
              onClick={
                editingTask
                  ? updateTask
                  : addTask
              }
              disabled={!task.trim()}
            >
              {editingTask ? (
                <>
                  <Check size={16} />
                  Save changes
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add task
                </>
              )}
            </button>

          </div>

        </div>
      )}


      {/* TASK CONTENT */}

      <main className="tasks-content">

        <TaskSection
          title="Today"
          subtitle="Things that need your attention today"
          items={todayTasks}
          type="today"
        />

        <TaskSection
          title="Upcoming"
          subtitle="Your next deadlines"
          items={upcomingTasks}
          type="upcoming"
        />

        <TaskSection
          title="No deadline"
          subtitle="Tasks you can work on anytime"
          items={noDeadlineTasks}
          type="no-deadline"
        />

        <TaskSection
          title="Completed"
          subtitle="Things you've already finished"
          items={completedTasks}
          type="completed"
        />


        {tasks.length === 0 && (
          <div className="empty-tasks">

            <div className="empty-task-icon">
              <Check size={24} />
            </div>

            <h3>
              No tasks yet
            </h3>

            <p>
              Create your first task and
              start organizing your day.
            </p>

            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <Plus size={17} />
              Add your first task
            </button>

          </div>
        )}

      </main>

    </div>
  );
}

export default Tasks;