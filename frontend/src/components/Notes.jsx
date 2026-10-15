import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
} from "lucide-react";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/notes"
      );

      const data = await response.json();
      setNotes(data);
    } catch (error) {
      setError(
        "Notes авахад алдаа гарлаа."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const addNote = async () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    await fetch(
      `http://127.0.0.1:8000/notes?title=${encodeURIComponent(
        title
      )}&content=${encodeURIComponent(content)}`,
      {
        method: "POST",
      }
    );

    setTitle("");
    setContent("");

    loadNotes();
  };

  const deleteNote = async (id) => {
    await fetch(
      `http://127.0.0.1:8000/notes/${id}`,
      {
        method: "DELETE",
      }
    );

    loadNotes();
  };

  if (loading) {
    return (
      <div className="page-loading">
        Loading notes...
      </div>
    );
  }

  return (
    <div className="content-page">

      <div className="page-header">
        <div>
          <span className="page-label">
            KNOWLEDGE
          </span>

          <h2>Notes</h2>

          <p>
            Save ideas, concepts and important
            things you learn.
          </p>
        </div>

        <div className="page-stat">
          <strong>{notes.length}</strong>
          <span>notes</span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="note-editor">

        <div className="note-editor-icon">
          <FileText size={18} />
        </div>

        <input
          placeholder="Note title..."
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Write something you want to remember..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
          rows="4"
        />

        <button onClick={addNote}>
          <Plus size={17} />
          Save note
        </button>

      </div>

      <div className="page-section">

        <div className="section-header">
          <h3>My notes</h3>
          <span>{notes.length} saved</span>
        </div>

        <div className="notes-grid">

          {notes.map((note) => (
            <div
              key={note.id}
              className="modern-note"
            >

              <div className="note-top">
                <div className="note-icon">
                  <FileText size={16} />
                </div>

                <button
                  className="icon-delete"
                  onClick={() =>
                    deleteNote(note.id)
                  }
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <h3>{note.title}</h3>

              <p>{note.content}</p>

            </div>
          ))}

          {notes.length === 0 && (
            <div className="empty-box">
              <span>📝</span>
              <p>No notes yet.</p>
              <small>
                Save something you learned today.
              </small>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

export default Notes;