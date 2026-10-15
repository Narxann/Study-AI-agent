import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import {
  CheckSquare,
  Clock3,
  Trophy,
  TrendingUp,
} from "lucide-react";

function Progress() {
  const [progress, setProgress] = useState(null);

  const loadProgress = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/progress"
      );

      const data = await response.json();

      setProgress(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  if (!progress) {
    return (
      <div className="page-loading">
        Loading progress...
      </div>
    );
  }

  const chartData = [
    {
      name: "Completion",
      value: progress.task_completion_rate,
    },
    {
      name: "Quiz",
      value: progress.average_quiz_score,
    },
  ];

  return (
    <div className="content-page">

      <div className="page-header">
        <div>
          <span className="page-label">
            YOUR JOURNEY
          </span>

          <h2>Progress</h2>

          <p>
            See how your study habits are growing.
          </p>
        </div>
      </div>

      <div className="progress-grid">

        <div className="progress-stat-card">

          <div className="progress-stat-icon">
            <CheckSquare size={18} />
          </div>

          <span>Tasks completed</span>

          <strong>
            {progress.completed_tasks}
          </strong>

          <small>
            out of {progress.total_tasks}
          </small>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon">
            <Clock3 size={18} />
          </div>

          <span>Total study time</span>

          <strong>
            {progress.total_study_minutes}
          </strong>

          <small>minutes studied</small>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon">
            <Trophy size={18} />
          </div>

          <span>Quiz average</span>

          <strong>
            {progress.average_quiz_score}%
          </strong>

          <small>average score</small>

        </div>

        <div className="progress-stat-card">

          <div className="progress-stat-icon">
            <TrendingUp size={18} />
          </div>

          <span>Task completion</span>

          <strong>
            {progress.task_completion_rate}%
          </strong>

          <small>overall completion</small>

        </div>

      </div>

      <div className="progress-chart-card">

        <div className="chart-header">
          <div>
            <h3>Performance overview</h3>
            <p>
              Your completion and quiz performance
            </p>
          </div>

          <div className="chart-badge">
            <TrendingUp size={14} />
            Overall
          </div>
        </div>

        <div className="chart-container">

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eeeeF2"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#777b87",
                }}
              />

              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "#999ca5",
                }}
                tickFormatter={(value) =>
                  `${value}%`
                }
              />

              <Tooltip
                formatter={(value) => [
                  `${value}%`,
                  "Score",
                ]}
                cursor={{
                  fill: "rgba(108,99,255,0.04)",
                }}
              />

              <Bar
                dataKey="value"
                fill="var(--primary)"
                radius={[8, 8, 0, 0]}
                barSize={55}
              />
            </BarChart>
          </ResponsiveContainer>

        </div>
      </div>

      <div className="progress-message">

        <div className="progress-message-icon">
          ✦
        </div>

        <div>
          <strong>Keep going!</strong>

          <p>
            Every study session adds up. Keep
            building your learning habit one day
            at a time.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Progress;