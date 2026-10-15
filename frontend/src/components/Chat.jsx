import { useEffect, useState } from "react";
import {
  Send,
  CheckSquare,
  BookOpen,
  BarChart3,
  Sparkles,
  Bot,
} from "lucide-react";

function Chat({ conversationId, setConversationId }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  const createConversation = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/conversations?title=New Chat",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setConversationId(data.id);

      return data.id;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const loadHistory = async (id) => {
    if (!id) {
      setMessages([]);
      setHistoryLoading(false);
      return;
    }

    try {
      setHistoryLoading(true);

      const response = await fetch(
        `http://127.0.0.1:8000/conversations/${id}/messages`
      );

      const data = await response.json();

      const formattedMessages = data.map((item) => ({
        role: item.role,
        text: item.message,
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error(error);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(conversationId);
  }, [conversationId]);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    let currentConversationId = conversationId;

    if (!currentConversationId) {
      currentConversationId = await createConversation();

      if (!currentConversationId) {
        return;
      }

      await fetch(
        `http://127.0.0.1:8000/conversations/${currentConversationId}?title=${encodeURIComponent(
          userMessage.slice(0, 30)
        )}`,
        {
          method: "PUT",
        }
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            conversation_id: currentConversationId,
          }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Server-тэй холбогдож чадсангүй.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      icon: CheckSquare,
      title: "My tasks",
      description: "View your tasks",
      message: "Show my tasks",
    },
    {
      icon: BookOpen,
      title: "Study help",
      description: "Learn something new",
      message: "Help me study",
    },
    {
      icon: BarChart3,
      title: "My progress",
      description: "Check your progress",
      message: "Show my progress",
    },
    {
      icon: Sparkles,
      title: "Study plan",
      description: "Plan your week",
      message: "Create a study plan",
    },
  ];

  return (
    <div className="chat-page">

      {/* HEADER */}
      <div className="chat-header-modern">
        <div className="chat-title-area">
          <div className="chat-title-icon">
            <Bot size={20} strokeWidth={1.8} />
          </div>

          <div>
            <div className="chat-title-row">
              <h2>AI Student Assistant</h2>
              <span className="online-dot"></span>
            </div>

            <p>Your personal study companion</p>
          </div>
        </div>

        <div className="header-mascot">
          <div className="mini-robot">
            <div className="mini-robot-face">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="chat-messages">

        {historyLoading ? (
          <div className="chat-loading-modern">
            <div className="loading-circle"></div>
            <span>Loading your conversation...</span>
          </div>
        ) : (
          <>
            {/* WELCOME */}
            {messages.length === 0 && (
              <div className="chat-welcome-modern">

                <div className="welcome-robot-wrapper">
                  <div className="welcome-glow"></div>

                  <div className="welcome-robot">
                    <div className="welcome-antenna">
                      <span></span>
                    </div>

                    <div className="welcome-head">
                      <div className="welcome-ear left"></div>
                      <div className="welcome-ear right"></div>

                      <div className="welcome-face">
                        <span className="welcome-eye"></span>
                        <span className="welcome-eye"></span>
                      </div>

                      <div className="welcome-mouth"></div>
                    </div>

                    <div className="welcome-body">
                      <div className="welcome-screen">
                        <Sparkles size={19} />
                      </div>
                    </div>

                    <div className="welcome-arm left"></div>
                    <div className="welcome-arm right"></div>
                  </div>
                </div>

                <div className="welcome-copy">
                  <div className="welcome-badge">
                    <Sparkles size={13} />
                    AI STUDY COMPANION
                  </div>

                  <h3>
                    What are we learning
                    <br />
                    <span>today?</span>
                  </h3>

                  <p>
                    I can help you organize tasks, study smarter,
                    take notes and track your progress.
                  </p>
                </div>

                <div className="quick-actions-modern">
                  {quickActions.map((action) => {
                    const Icon = action.icon;

                    return (
                      <button
                        key={action.title}
                        className="quick-action-card"
                        onClick={() => setMessage(action.message)}
                      >
                        <div className="quick-action-icon">
                          <Icon size={18} strokeWidth={1.8} />
                        </div>

                        <div className="quick-action-content">
                          <strong>{action.title}</strong>
                          <span>{action.description}</span>
                        </div>

                        <span className="quick-action-arrow">
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MESSAGES */}
            <div className="message-list">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.role === "user"
                      ? "message-row user-row"
                      : "message-row ai-row"
                  }
                >

                  {msg.role === "assistant" && (
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={
                      msg.role === "user"
                        ? "message-bubble user-bubble"
                        : "message-bubble ai-bubble"
                    }
                  >
                    <div className="message-name">
                      {msg.role === "user" ? "You" : "Study AI"}
                    </div>

                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}

              {/* THINKING */}
              {loading && (
                <div className="message-row ai-row">
                  <div className="message-avatar">
                    <Bot size={16} />
                  </div>

                  <div className="thinking-bubble">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* INPUT */}
      <div className="chat-input-wrapper">

        <div className="chat-input-modern">

          <textarea
            value={message}
            placeholder="Ask your AI assistant anything..."
            rows="1"
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            <Send size={18} />
          </button>

        </div>

        <p className="input-hint">
          Press <strong>Enter</strong> to send ·{" "}
          <strong>Shift + Enter</strong> for a new line
        </p>

      </div>
    </div>
  );
}

export default Chat;