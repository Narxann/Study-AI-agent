import { useState } from "react";
import {
  Layers,
  Plus,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";

function Flashcards() {
  const [topic, setTopic] = useState("");
  const [cardCount, setCardCount] = useState(5);

  const [flashcards, setFlashcards] = useState(null);
  const [currentCard, setCurrentCard] = useState(0);

  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateFlashcards = async () => {
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/flashcards/generate?topic=${encodeURIComponent(
          topic
        )}&number_of_cards=${cardCount}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setFlashcards(data);
      setCurrentCard(0);
      setShowAnswer(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (
      currentCard <
      flashcards.cards.length - 1
    ) {
      setCurrentCard((prev) => prev + 1);
      setShowAnswer(false);
    }
  };

  const previousCard = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setShowAnswer(false);
    }
  };

  const restartCards = () => {
    setCurrentCard(0);
    setShowAnswer(false);
  };

  return (
    <div className="content-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="dashboard-label">
            FLASHCARDS
          </p>

          <h2>
            Learn with flashcards 📚
          </h2>

          <p>
            Turn any topic into quick study cards.
          </p>
        </div>

        <div className="page-header-icon">
          <Layers size={28} />
        </div>

      </div>


      {/* GENERATOR */}

      {!flashcards && (
        <div className="flashcard-generator">

          <div className="flashcard-generator-icon">
            <Layers size={22} />
          </div>

          <div className="flashcard-form">

            <input
              type="text"
              placeholder="What do you want to learn?"
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
            />

            <select
              value={cardCount}
              onChange={(e) =>
                setCardCount(
                  Number(e.target.value)
                )
              }
            >
              <option value={5}>
                5 cards
              </option>

              <option value={10}>
                10 cards
              </option>
            </select>

            <button
              onClick={generateFlashcards}
              disabled={
                loading || !topic.trim()
              }
            >
              <Plus size={18} />

              {loading
                ? "Creating..."
                : "Generate"}
            </button>

          </div>

        </div>
      )}


      {/* FLASHCARD */}

      {flashcards && (
        <div className="flashcard-section">

          <div className="flashcard-top">

            <div>
              <span className="focus-badge">
                ✦ STUDY CARDS
              </span>

              <h3>
                {flashcards.topic}
              </h3>
            </div>

            <span>
              {currentCard + 1} /{" "}
              {flashcards.cards.length}
            </span>

          </div>


          <div className="flashcard">

            {!showAnswer ? (
              <>
                <span className="flashcard-label">
                  QUESTION
                </span>

                <h2>
                  {
                    flashcards.cards[
                      currentCard
                    ].front
                  }
                </h2>

                <button
                  className="show-answer"
                  onClick={() =>
                    setShowAnswer(true)
                  }
                >
                  Show Answer
                </button>
              </>
            ) : (
              <>
                <span className="flashcard-label">
                  ANSWER
                </span>

                <h2>
                  {
                    flashcards.cards[
                      currentCard
                    ].back
                  }
                </h2>

                <div className="flashcard-rating">

                  <button
                    className="again-button"
                    onClick={() =>
                      setShowAnswer(false)
                    }
                  >
                    Again
                  </button>

                  <button
                    className="good-button"
                    onClick={nextCard}
                  >
                    Good
                  </button>

                </div>
              </>
            )}

          </div>


          {/* NAVIGATION */}

          <div className="flashcard-navigation">

            <button
              onClick={previousCard}
              disabled={currentCard === 0}
            >
              <ChevronLeft size={18} />
              Previous
            </button>

            <button
              onClick={restartCards}
            >
              <RotateCcw size={17} />
              Restart
            </button>

            <button
              onClick={nextCard}
              disabled={
                currentCard ===
                flashcards.cards.length - 1
              }
            >
              Next
              <ChevronRight size={18} />
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default Flashcards;