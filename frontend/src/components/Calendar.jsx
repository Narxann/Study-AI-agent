import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  Trash2,
} from "lucide-react";

function Calendar() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  const loadTasks = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/calendar"
      );

      const data = await response.json();

      setTasks(data);
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
  useEffect(() => {
    loadTasks();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );

  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();

  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const previousMonth = () => {
    setCurrentDate(
      new Date(year, month - 1, 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(year, month + 1, 1)
    );
  };

  const goToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  const formatDate = (date) => {
    const y = date.getFullYear();

    const m = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const d = String(
      date.getDate()
    ).padStart(2, "0");

    return `${y}-${m}-${d}`;
  };

  const selectedDateString =
    formatDate(selectedDate);

  const selectedTasks = tasks.filter(
    (task) =>
      task.due_date === selectedDateString
  );

  const hasTasks = (day) => {
    const date = new Date(
      year,
      month,
      day
    );

    return tasks.some(
      (task) =>
        task.due_date === formatDate(date)
    );
  };

  const isSelected = (day) => {
    const date = new Date(
      year,
      month,
      day
    );

    return (
      formatDate(date) ===
      selectedDateString
    );
  };

  const isToday = (day) => {
    const today = new Date();

    const date = new Date(
      year,
      month,
      day
    );

    return (
      formatDate(date) ===
      formatDate(today)
    );
  };

  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="content-page">

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            CALENDAR
          </p>

          <h2>
            Your calendar
          </h2>

          <p>
            See your deadlines and tasks in one place.
          </p>
        </div>

        <button
          className="calendar-today-button"
          onClick={goToday}
        >
          Today
        </button>
      </div>

      <div className="calendar-layout">

        <div className="calendar-card">

          <div className="calendar-header">

            <button onClick={previousMonth}>
              <ChevronLeft size={20} />
            </button>

            <h3>
              {monthName}
            </h3>

            <button onClick={nextMonth}>
              <ChevronRight size={20} />
            </button>

          </div>

          <div className="calendar-weekdays">
            {[
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ].map((day) => (
              <div key={day}>
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">

            {calendarDays.map(
              (day, index) => {

                if (!day) {
                  return (
                    <div
                      key={index}
                      className="calendar-empty"
                    />
                  );
                }

                return (
                  <button
                    key={day}
                    className={`calendar-day ${
                      isSelected(day)
                        ? "selected"
                        : ""
                    } ${
                      isToday(day)
                        ? "today"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedDate(
                        new Date(
                          year,
                          month,
                          day
                        )
                      )
                    }
                  >
                    <span>
                      {day}
                    </span>

                    {hasTasks(day) && (
                      <span className="calendar-dot" />
                    )}
                  </button>
                );
              }
            )}

          </div>
        </div>

        <div className="calendar-details">

          <div className="calendar-details-header">

            <p>
              {selectedDate.toLocaleDateString(
                "en-US",
                {
                  weekday: "long",
                }
              )}
            </p>

            <h3>
              {selectedDate.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  day: "numeric",
                }
              )}
            </h3>

          </div>

          {selectedTasks.length === 0 ? (
            <div className="calendar-empty-state">
              <Check size={28} />

              <h4>
                No tasks
              </h4>

              <p>
                Nothing scheduled for this day.
              </p>
            </div>
          ) : (
            <div className="calendar-task-list">

              {selectedTasks.map(
                (task) => (
                    <div
                    className={`calendar-task ${
                        task.completed ? "completed" : ""
                    }`}
                    key={task.id}
                    >
                    <div className="calendar-task-line" />

                    <div className="calendar-task-content">
                        <h4>{task.task}</h4>

                        {task.description && (
                        <p>{task.description}</p>
                        )}

                        {task.due_time && (
                        <span>
                            <Clock size={14} />
                            {task.due_time.slice(0, 5)}
                        </span>
                        )}
                    </div>

                    <div className="calendar-task-actions">

                        {!task.completed && (
                        <button
                            onClick={() =>
                            completeTask(task.id)
                            }
                            title="Complete"
                        >
                            <Check size={16} />
                        </button>
                        )}

                        <button
                        onClick={() =>
                            deleteTask(task.id)
                        }
                        title="Delete"
                        >
                        <Trash2 size={16} />
                        </button>

                    </div>
                    </div>
                )
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Calendar;