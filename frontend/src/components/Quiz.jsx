import { useEffect, useState } from "react";
import {
  Brain,
  Plus,
  Trophy,
  Target,
  ChevronRight,
} from "lucide-react";

function Quiz() {
  const [quizzes, setQuizzes] = useState([]);

  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);

  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const loadQuizzes = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/quiz"
      );

      const data = await response.json();

      setQuizzes(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, []);

  const generateQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/quiz/generate?topic=${encodeURIComponent(
          topic
        )}&number_of_questions=${questionCount}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setGeneratedQuiz(data);

      setCurrentQuestion(0);
      setSelectedAnswer(null);
      setScore(0);
      setQuizFinished(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const saveQuizResult = async (finalScore) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/quiz?subject=${encodeURIComponent(
          generatedQuiz.topic
        )}&score=${finalScore}&total=${
          generatedQuiz.questions.length
        }`,
        {
          method: "POST",
        }
      );

      await loadQuizzes();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(answer);

    const question =
      generatedQuiz.questions[currentQuestion];

    if (answer === question.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = async () => {
    if (
      currentQuestion <
      generatedQuiz.questions.length - 1
    ) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      const lastQuestion =
        generatedQuiz.questions[currentQuestion];

      const finalScore =
        score +
        (selectedAnswer ===
        lastQuestion.correct_answer
          ? 1
          : 0);

      setScore(finalScore);
      setQuizFinished(true);

      await saveQuizResult(finalScore);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  };

  const average =
    quizzes.length > 0
      ? (
          quizzes.reduce(
            (sum, quiz) =>
              sum + (quiz.score / quiz.total) * 100,
            0
          ) / quizzes.length
        ).toFixed(0)
      : 0;

  return (
    <div className="content-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="dashboard-label">
            AI QUIZ
          </p>

          <h2>
            Test your knowledge 🧠
          </h2>

          <p>
            Generate a quiz and practice what
            you've learned.
          </p>
        </div>

        <div className="page-header-icon">
          <Brain size={28} />
        </div>
      </div>


      {/* QUIZ GENERATOR */}

      {!generatedQuiz && (
        <div className="quiz-add-card">

          <div className="quiz-card-icon">
            <Brain size={22} />
          </div>

          <div className="quiz-form">

            <input
              type="text"
              placeholder="What do you want to study?"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            />

            <select
              value={questionCount}
              onChange={(e) =>
                setQuestionCount(
                  Number(e.target.value)
                )
              }
            >
              <option value={5}>
                5 questions
              </option>

              <option value={10}>
                10 questions
              </option>
            </select>

            <button
              onClick={generateQuiz}
              disabled={
                loading || !topic.trim()
              }
            >
              <Plus size={18} />

              {loading
                ? "Generating..."
                : "Generate Quiz"}
            </button>

          </div>
        </div>
      )}


      {/* INTERACTIVE QUIZ */}

      {generatedQuiz &&
        !quizFinished && (
          <div className="interactive-quiz">

            <div className="quiz-top">

              <div>
                <span className="focus-badge">
                  ✦ AI QUIZ
                </span>

                <h3>
                  {generatedQuiz.topic}
                </h3>
              </div>

              <span className="question-number">
                {currentQuestion + 1} /{" "}
                {generatedQuiz.questions.length}
              </span>

            </div>


            {/* PROGRESS */}

            <div className="quiz-progress-bar">

              <div
                className="quiz-progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      generatedQuiz.questions.length) *
                    100
                  }%`,
                }}
              />

            </div>


            {/* QUESTION */}

            <div className="quiz-question">

              <h2>
                {
                  generatedQuiz.questions[
                    currentQuestion
                  ].question
                }
              </h2>


              {/* OPTIONS */}

              <div className="quiz-options">

                {generatedQuiz.questions[
                  currentQuestion
                ].options.map((option, index) => {

                  const question =
                    generatedQuiz.questions[
                      currentQuestion
                    ];

                  let className =
                    "quiz-option";

                  if (
                    selectedAnswer !== null
                  ) {
                    if (
                      option ===
                      question.correct_answer
                    ) {
                      className +=
                        " correct";
                    } else if (
                      option ===
                      selectedAnswer
                    ) {
                      className +=
                        " incorrect";
                    }
                  }

                  return (
                    <button
                      key={option}
                      className={className}
                      onClick={() =>
                        handleAnswer(option)
                      }
                    >
                      <span className="option-letter">
                        {String.fromCharCode(
                          65 + index
                        )}
                      </span>

                      <span>
                        {option}
                      </span>
                    </button>
                  );
                })}

              </div>

            </div>


            {/* NEXT */}

            {selectedAnswer !== null && (
              <div className="quiz-next-wrapper">

                <button
                  className="quiz-next-button"
                  onClick={nextQuestion}
                >
                  {currentQuestion ===
                  generatedQuiz.questions.length - 1
                    ? "Finish Quiz"
                    : "Next Question"}

                  <ChevronRight size={18} />
                </button>

              </div>
            )}

          </div>
        )}


      {/* RESULT */}

      {generatedQuiz &&
        quizFinished && (
          <div className="quiz-result-card">

            <div className="result-icon">
              <Trophy size={36} />
            </div>

            <span className="focus-badge">
              ✦ QUIZ COMPLETE
            </span>

            <h2>
              {score} /{" "}
              {generatedQuiz.questions.length}
            </h2>

            <p>
              You scored{" "}
              {Math.round(
                (score /
                  generatedQuiz.questions.length) *
                  100
              )}
              %
            </p>

            <button
              onClick={restartQuiz}
            >
              Try Again
            </button>

          </div>
        )}


      {/* STATS */}

      <div className="quiz-stats">

        <div className="quiz-stat-card">

          <Trophy size={22} />

          <div>
            <span>
              Quizzes completed
            </span>

            <strong>
              {quizzes.length}
            </strong>
          </div>

        </div>


        <div className="quiz-stat-card">

          <Target size={22} />

          <div>
            <span>
              Average score
            </span>

            <strong>
              {average}%
            </strong>
          </div>

        </div>

      </div>


      {/* PREVIOUS RESULTS */}

      <div className="dashboard-section">

        <div className="section-header">

          <h3>
            Previous quiz results
          </h3>

          <span>
            {quizzes.length} quizzes
          </span>

        </div>

        {quizzes.map((quiz) => {

          const percentage =
            Math.round(
              (quiz.score /
                quiz.total) *
                100
            );

          return (
            <div
              key={quiz.id}
              className="dashboard-item"
            >

              <div className="task-left">

                <span className="study-dot"></span>

                <span>
                  {quiz.subject}
                </span>

              </div>

              <span className="quiz-result-score">
                {quiz.score}/{quiz.total}{" "}
                ({percentage}%)
              </span>

            </div>
          );
        })}

        {quizzes.length === 0 && (
          <p className="empty-state">
            No quiz results yet.
          </p>
        )}

      </div>

    </div>
  );
}

export default Quiz;