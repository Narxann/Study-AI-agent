import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Clock } from "lucide-react";

function Study() {
  const [sessions, setSessions] = useState([]);
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState("");
  const [days, setDays] = useState(7);
  const [hoursPerDay, setHoursPerDay] = useState(2);
  const [studyPlan, setStudyPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);

  const generateStudyPlan = async () => {
    if (!goal.trim()) return;

    setPlanLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/study/plan?goal=${encodeURIComponent(
          goal
        )}&days=${days}&hours_per_day=${hoursPerDay}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setStudyPlan(data);
    } catch (error) {
      console.error(error);
    } finally {
      setPlanLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/study"
      );

      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const addSession = async () => {
    if (!subject || !duration) return;

    await fetch(
      `http://127.0.0.1:8000/study?subject=${encodeURIComponent(
        subject
      )}&duration_minutes=${duration}`,
      {
        method: "POST",
      }
    );

    setSubject("");
    setDuration("");

    loadSessions();
  };

  const deleteSession = async (id) => {
    await fetch(
      `http://127.0.0.1:8000/study/${id}`,
      {
        method: "DELETE",
      }
    );

    loadSessions();
  };

  if (loading) {
    return (
      <div className="page-loading">
        Loading study sessions...
      </div>
    );
  }

  const totalMinutes = sessions.reduce(
    (sum, session) =>
      sum + session.duration_minutes,
    0
  );

  return (
    <div className="content-page">

      <div className="page-header">
          <div className="study-planner-card">
            {studyPlan && (
              <div className="generated-plan">

                <div className="section-header">
                  <div>
                    <h3>{studyPlan.goal}</h3>

                    <span>
                      {studyPlan.days} days ·{" "}
                      {studyPlan.hours_per_day} hours/day
                    </span>
                  </div>
                </div>

                <div className="plan-days">

                  {studyPlan.plan.map((day) => (
                    <div
                      key={day.day}
                      className="plan-day"
                    >

                      <div className="plan-day-number">
                        {day.day}
                      </div>

                      <div className="plan-day-content">

                        <h4>
                          Day {day.day}
                        </h4>

                        <strong>
                          {day.focus}
                        </strong>

                        <div className="plan-activities">

                          {day.activities.map(
                            (activity) => (
                              <span key={activity}>
                                ✓ {activity}
                              </span>
                            )
                          )}

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </div>
            )}
            <div className="planner-header">
            <div>
              <span className="focus-badge">
                ✦ AI STUDY PLANNER
              </span>

              <h3>Plan your learning</h3>

              <p>
                Create a study plan based on your goal and available time.
              </p>
            </div>
          </div>

          <div className="planner-form">

            <input
              type="text"
              placeholder="What do you want to learn?"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />

            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={3}>3 days</option>
              <option value={7}>7 days</option>
              <option value={14}>14 days</option>
              <option value={30}>30 days</option>
            </select>

            <select
              value={hoursPerDay}
              onChange={(e) =>
                setHoursPerDay(Number(e.target.value))
              }
            >
              <option value={1}>1 hour/day</option>
              <option value={2}>2 hours/day</option>
              <option value={3}>3 hours/day</option>
              <option value={4}>4 hours/day</option>
            </select>

            <button
              onClick={generateStudyPlan}
              disabled={planLoading || !goal.trim()}
            >
              {planLoading ? "Creating..." : "Create Plan"}
            </button>

          </div>
        </div>
      </div>

      <div className="study-add-card">

        <div className="form-icon">
          <BookOpen size={19} />
        </div>

        <div className="study-form">
          <div>
            <label>Subject</label>
            <input
              placeholder="e.g. Machine Learning"
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
            />
          </div>

          <div>
            <label>Duration</label>
            <input
              type="number"
              placeholder="Minutes"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
            />
          </div>

          <button onClick={addSession}>
            <Plus size={17} />
            Add session
          </button>
        </div>

      </div>

      <div className="page-section">

        <div className="section-header">
          <h3>Study history</h3>
          <span>{sessions.length} sessions</span>
        </div>

        <div className="study-list">

          {sessions.map((session) => (
            <div
              key={session.id}
              className="modern-study-card"
            >
              <div className="study-icon">
                <BookOpen size={17} />
              </div>

              <div className="study-info">
                <strong>{session.subject}</strong>
                <small>
                  Focused study session
                </small>
              </div>

              <div className="study-time">
                <Clock size={14} />
                {session.duration_minutes} min
              </div>

              <button
                className="icon-delete"
                onClick={() =>
                  deleteSession(session.id)
                }
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}

          {sessions.length === 0 && (
            <div className="empty-box">
              <span>📚</span>
              <p>No study sessions yet.</p>
              <small>
                Start tracking your study time.
              </small>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}

export default Study;