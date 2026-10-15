import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Chat from "./components/Chat";
import Tasks from "./components/Tasks";
import Study from "./components/Study";
import Notes from "./components/Notes";
import Quiz from "./components/Quiz";
import Progress from "./components/Progress";
import Flashcards from "./components/Flashcards";
import Calendar from "./components/Calendar";
import Courses from "./components/Courses";

import "./App.css";

function App() {
  const [page, setPage] = useState("Dashboard");
  const [conversationId, setConversationId] = useState(null);

  const [theme, setTheme] = useState(
    localStorage.getItem("study-ai-theme") || "lavender"
  );

  const renderPage = () => {
    if (page === "Dashboard") return <Dashboard />;

    if (page === "Chat") {
      return (
        <Chat
          conversationId={conversationId}
          setConversationId={setConversationId}
        />
      );
    }

    if (page === "Tasks") return <Tasks />;
    if (page === "Study") return <Study />;
    if (page === "Notes") return <Notes />;
    if (page === "Quiz") return <Quiz />;
    if (page === "Progress") return <Progress />;
    if (page === "Flashcards") return <Flashcards />;
    if (page === "Calendar") return <Calendar />;
    if (page === "Courses") return <Courses />;

    return <Dashboard />;
  };

  useEffect(() => {
    localStorage.setItem("study-ai-theme", theme);
  }, [theme]);

  return (
    <div className={`app theme-${theme}`}>
      <Sidebar
        page={page}
        setPage={setPage}
        conversationId={conversationId}
        setConversationId={setConversationId}
        theme={theme}
        setTheme={setTheme}
      />

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;