import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  CheckSquare,
  BookOpen,
  FileText,
  Brain,
  BarChart3,
  Plus,
  Trash2,
  Sparkles,
  Layers,
  CalendarDays
} from "lucide-react";

function Sidebar({
  page,
  setPage,
  conversationId,
  setConversationId,
  theme,
  setTheme,
}) {
  const [conversations, setConversations] = useState([]);

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Chat",
      icon: MessageCircle,
    },
    {
      name: "Tasks",
      icon: CheckSquare,
    },
    {
      name: "Study",
      icon: BookOpen,
    },
    {
      name: "Notes",
      icon: FileText,
    },
    {
      name: "Quiz",
      icon: Brain,
    },
    {
      name: "Flashcards",
      icon: Layers
    },
    {
      name: "Progress",
      icon: BarChart3,
    },
    {
      name: "Calendar",
      icon: CalendarDays,
    },
    {
      name: "Courses",
      icon: BookOpen
    },
  ];

  const loadConversations = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/conversations"
      );

      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const newChat = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/conversations?title=New Chat",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setConversations((prev) => [data, ...prev]);

      setConversationId(data.id);
      setPage("Chat");
    } catch (error) {
      console.error(error);
    }
  };

  const openConversation = (id) => {
    setConversationId(id);
    setPage("Chat");
  };

  const deleteConversation = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/conversations/${id}`,
        {
          method: "DELETE",
        }
      );

      setConversations((prev) =>
        prev.filter(
          (conversation) => conversation.id !== id
        )
      );

      if (conversationId === id) {
        setConversationId(null);
        setPage("Chat");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <div className="logo-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <h1>Study AI</h1>
          <span>Student Assistant</span>
        </div>
      </div>

      <nav className="sidebar-menu">

        <p className="menu-label">MAIN</p>

        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={
                page === item.name
                  ? "menu-item active"
                  : "menu-item"
              }
              onClick={() => setPage(item.name)}
            >
              <Icon size={18} strokeWidth={1.8} />

              <span>{item.name}</span>
            </button>
          );
        })}

      </nav>

      <div className="conversation-section">

        <button
          className="new-chat-button"
          onClick={newChat}
        >
          <Plus size={17} />
          <span>New Chat</span>
        </button>

        <div className="chat-section-header">
          <p>RECENT CHATS</p>
          <span>{conversations.length}</span>
        </div>

        <div className="conversation-list">

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={
                conversationId === conversation.id
                  ? "conversation-row active"
                  : "conversation-row"
              }
            >

              <button
                className="conversation"
                onClick={() =>
                  openConversation(conversation.id)
                }
              >
                <MessageCircle size={14} />
                <span>{conversation.title}</span>
              </button>

              <button
                className="conversation-delete"
                onClick={() =>
                  deleteConversation(conversation.id)
                }
              >
                <Trash2 size={13} />
              </button>

            </div>
          ))}

          {conversations.length === 0 && (
            <p className="no-chats">
              No conversations yet
            </p>
          )}

        </div>
      </div>

      <div className="theme-picker">

        <p>APPEARANCE</p>

        <div className="theme-options">

          <button
            className={`theme-dot lavender ${
              theme === "lavender" ? "selected" : ""
            }`}
            onClick={() => setTheme("lavender")}
            title="Lavender"
          />

          <button
            className={`theme-dot blue ${
              theme === "blue" ? "selected" : ""
            }`}
            onClick={() => setTheme("blue")}
            title="Blue"
          />

          <button
            className={`theme-dot mint ${
              theme === "mint" ? "selected" : ""
            }`}
            onClick={() => setTheme("mint")}
            title="Mint"
          />

          <button
            className={`theme-dot peach ${
              theme === "peach" ? "selected" : ""
            }`}
            onClick={() => setTheme("peach")}
            title="Peach"
          />

        </div>
      </div>

    </aside>
  );
}

export default Sidebar;