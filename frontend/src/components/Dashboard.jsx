import { useEffect, useState } from "react";

function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [sessions, setSessions] = useState([]);

  const loadProgress = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/progress"
    );

    const data = await response.json();
    setProgress(data);
  };

  const loadTasks = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/tasks"
    );

    const data = await response.json();
    setTasks(data);
  };

  const loadSessions = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/study"
    );

    const data = await response.json();
    setSessions(data);
  };

  useEffect(() => {
    loadProgress();
    loadTasks();
    loadSessions();
  }, []);

  if (!progress) {
    return <div>Loading...</div>;
  }

  const unfinishedTasks = tasks.filter(
    (task) => !task.completed
  );

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const todayTasks = unfinishedTasks.filter(
    (task) => task.due_date === today
  );

  const upcomingTasks = unfinishedTasks.filter(
    (task) =>
      task.due_date &&
      task.due_date > today
  );

  const noDeadlineTasks = unfinishedTasks.filter(
    (task) => !task.due_date
  );

  const focusTask =
    todayTasks.length > 0
      ? todayTasks[0].task
      : upcomingTasks.length > 0
      ? upcomingTasks[0].task
      : noDeadlineTasks.length > 0
      ? noDeadlineTasks[0].task
      : "Take some time to review what you learned today.";

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">
        <div>
          <p className="dashboard-label">
            STUDY DASHBOARD
          </p>

          <h2>Good afternoon 👋</h2>

          <p>
            Here's what's happening with your study today.
          </p>
        </div>
      </div>


      {/* STATS */}

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <div className="stat-icon purple">
            ✓
          </div>

          <h3>Tasks</h3>

          <p>
            {progress.completed_tasks}
            <span>
              {" "}
              / {progress.total_tasks}
            </span>
          </p>

          <small>
            completed
          </small>
        </div>


        <div className="dashboard-card">
          <div className="stat-icon blue">
            ◷
          </div>

          <h3>Study time</h3>

          <p>
            {progress.total_study_minutes}
            <span> min</span>
          </p>

          <small>
            total studied
          </small>
        </div>


        <div className="dashboard-card">
          <div className="stat-icon green">
            ★
          </div>

          <h3>Quiz average</h3>

          <p>
            {progress.average_quiz_score}
            <span>%</span>
          </p>

          <small>
            average score
          </small>
        </div>


        <div className="dashboard-card">
          <div className="stat-icon peach">
            ↗
          </div>

          <h3>Completion</h3>

          <p>
            {progress.task_completion_rate}
            <span>%</span>
          </p>

          <small>
            task progress
          </small>
        </div>

      </div>


      {/* AI FOCUS */}

      <div className="focus-card">

        <div className="focus-content">

          <span className="focus-badge">
            ✦ AI FOCUS
          </span>

          <h3>Today's focus</h3>

          <p>{focusTask}</p>

          <button>
            Start studying →
          </button>

        </div>


        <div className="dashboard-robot">

          <div className="robot-head">

            <div className="robot-face">
              <span className="robot-eye"></span>
              <span className="robot-eye"></span>
            </div>

            <div className="robot-mouth"></div>

          </div>

          <div className="robot-body">
            <div className="robot-light"></div>
          </div>

        </div>

      </div>


      {/* TODAY */}

      <div className="dashboard-section">

        <div className="section-header">

          <h3>Today's tasks</h3>

          <span>
            {todayTasks.length} tasks
          </span>

        </div>

        {todayTasks.length > 0 ? (
          todayTasks.slice(0, 5).map((task) => (

            <div
              key={task.id}
              className="dashboard-item"
            >

              <div className="task-left">

                <span className="task-check">
                  •
                </span>

                <div>
                  <span>
                    {task.task}
                  </span>

                  {task.description && (
                    <small className="dashboard-task-description">
                      {task.description}
                    </small>
                  )}
                </div>

              </div>

              <span className="task-status">
                {task.due_time
                  ? task.due_time.slice(0, 5)
                  : "Today"}
              </span>

            </div>

          ))
        ) : (
          <p className="empty-state">
            No tasks due today 🎉
          </p>
        )}

      </div>


      {/* UPCOMING */}

      <div className="dashboard-section">

        <div className="section-header">

          <h3>Upcoming deadlines</h3>

          <span>
            {upcomingTasks.length}
          </span>

        </div>

        {upcomingTasks.length > 0 ? (
          upcomingTasks.slice(0, 5).map((task) => (

            <div
              key={task.id}
              className="dashboard-item"
            >

              <div className="task-left">

                <span className="task-check">
                  •
                </span>

                <span>
                  {task.task}
                </span>

              </div>

              <span className="task-status">
                {task.due_date}
              </span>

            </div>

          ))
        ) : (
          <p className="empty-state">
            No upcoming deadlines.
          </p>
        )}

      </div>


      {/* RECENT TASKS */}

      <div className="dashboard-section">

        <div className="section-header">

          <h3>Recent tasks</h3>

          <span>
            {tasks.length} total
          </span>

        </div>

        {tasks.slice(0, 5).map((task) => (

          <div
            key={task.id}
            className="dashboard-item"
          >

            <div className="task-left">

              <span
                className={
                  task.completed
                    ? "task-check completed"
                    : "task-check"
                }
              >
                {task.completed ? "✓" : ""}
              </span>

              <span
                className={
                  task.completed
                    ? "task-completed"
                    : ""
                }
              >
                {task.task}
              </span>

            </div>

            <span className="task-status">
              {task.completed
                ? "Completed"
                : "In progress"}
            </span>

          </div>

        ))}

        {tasks.length === 0 && (
          <p className="empty-state">
            No tasks yet.
          </p>
        )}

      </div>


      {/* STUDY ACTIVITY */}

      <div className="dashboard-section">

        <div className="section-header">

          <h3>Recent study sessions</h3>

          <span>
            {sessions.length} sessions
          </span>

        </div>

        {sessions.slice(0, 5).map((session) => (

          <div
            key={session.id}
            className="dashboard-item"
          >

            <div className="task-left">

              <span className="study-dot"></span>

              <span>
                {session.subject}
              </span>

            </div>

            <span className="study-duration">
              {session.duration_minutes} min
            </span>

          </div>

        ))}

        {sessions.length === 0 && (
          <p className="empty-state">
            No study sessions yet.
          </p>
        )}

      </div>

    </div>
  );
}

export default Dashboard;