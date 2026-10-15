
import { useEffect, useState } from "react";
import {
  BookOpen,
  Plus,
  Trash2,
  ArrowLeft,
  ClipboardList,
  Check,
  FileText,
  Link as LinkIcon,
  StickyNote,
} from "lucide-react";

import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [assignments, setAssignments] = useState([]);
  const [resources, setResources] = useState([]);
  const [notes, setNotes] = useState([]);

  const [activeTab, setActiveTab] = useState("assignments");

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] =
    useState(false);
  const [showResourceForm, setShowResourceForm] =
    useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [assignmentTitle, setAssignmentTitle] =
    useState("");
  const [assignmentDescription, setAssignmentDescription] =
    useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] =
    useState("lecture");
  const [resourceUrl, setResourceUrl] = useState("");
  const [resourceDescription, setResourceDescription] =
    useState("");

  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  const loadCourses = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/courses"
      );

      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCourseData = async (courseId) => {
    try {
      const [
        assignmentsResponse,
        resourcesResponse,
        notesResponse,
      ] = await Promise.all([
        fetch(
          `http://127.0.0.1:8000/assignments?course_id=${courseId}`
        ),
        fetch(
          `http://127.0.0.1:8000/courses/${courseId}/resources`
        ),
        fetch(
          `http://127.0.0.1:8000/courses/${courseId}/notes`
        ),
      ]);

      const assignmentsData =
        await assignmentsResponse.json();
      const resourcesData =
        await resourcesResponse.json();
      const notesData = await notesResponse.json();

      setAssignments(assignmentsData);
      setResources(resourcesData);
      setNotes(notesData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openCourse = async (course) => {
    setSelectedCourse(course);
    setActiveTab("assignments");

    await loadCourseData(course.id);
  };

  const addCourse = async () => {
    if (!name.trim()) return;

    try {
      const params = new URLSearchParams({
        name,
      });

      if (code.trim()) {
        params.append("code", code);
      }

      if (description.trim()) {
        params.append("description", description);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/courses?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setCourses((prev) => [data, ...prev]);

      setName("");
      setCode("");
      setDescription("");
      setShowCourseForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCourse = async (courseId) => {
    if (!window.confirm("Энэ хичээлийг устгах уу?")) {
      return;
    }

    try {
      await fetch(
        `http://127.0.0.1:8000/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

      setCourses((prev) =>
        prev.filter((course) => course.id !== courseId)
      );

      setSelectedCourse(null);
    } catch (error) {
      console.error(error);
    }
  };

  const addAssignment = async () => {
    if (!assignmentTitle.trim()) return;

    try {
      const params = new URLSearchParams({
        course_id: selectedCourse.id,
        title: assignmentTitle,
      });

      if (assignmentDescription.trim()) {
        params.append(
          "description",
          assignmentDescription
        );
      }

      if (dueDate) {
        params.append("due_date", dueDate);
      }

      if (dueTime) {
        params.append("due_time", dueTime);
      }

      const response = await fetch(
        `http://127.0.0.1:8000/assignments?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setAssignments((prev) => [data, ...prev]);

      setAssignmentTitle("");
      setAssignmentDescription("");
      setDueDate("");
      setDueTime("");
      setShowAssignmentForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const completeAssignment = async (id) => {
    try {
      await fetch(
        `http://127.0.0.1:8000/assignments/${id}/complete`,
        {
          method: "POST",
        }
      );

      setAssignments((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, completed: true }
            : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Assignment устгах уу?")) {
      return;
    }

    try {
      await fetch(
        `http://127.0.0.1:8000/assignments/${id}`,
        {
          method: "DELETE",
        }
      );

      setAssignments((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addResource = async () => {
    if (!resourceTitle.trim()) return;

    try {
      const params = new URLSearchParams({
        title: resourceTitle,
        resource_type: resourceType,
      });

      if (resourceUrl.trim()) {
        params.append("url", resourceUrl);
      }

      if (resourceDescription.trim()) {
        params.append(
          "description",
          resourceDescription
        );
      }

      const response = await fetch(
        `http://127.0.0.1:8000/courses/${selectedCourse.id}/resources?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setResources((prev) => [data, ...prev]);

      setResourceTitle("");
      setResourceType("lecture");
      setResourceUrl("");
      setResourceDescription("");
      setShowResourceForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Resource устгах уу?")) {
      return;
    }

    try {
      await fetch(
        `http://127.0.0.1:8000/resources/${id}`,
        {
          method: "DELETE",
        }
      );

      setResources((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      return;
    }

    try {
      const params = new URLSearchParams({
        title: noteTitle,
        content: noteContent,
      });

      const response = await fetch(
        `http://127.0.0.1:8000/courses/${selectedCourse.id}/notes?${params.toString()}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setNotes((prev) => [data, ...prev]);

      setNoteTitle("");
      setNoteContent("");
      setShowNoteForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Note устгах уу?")) {
      return;
    }

    try {
      await fetch(
        `http://127.0.0.1:8000/course-notes/${id}`,
        {
          method: "DELETE",
        }
      );

      setNotes((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  if (selectedCourse) {
    return (
      <div className="courses-page">
        <button
          className="back-button"
          onClick={() => {
            setSelectedCourse(null);
            setAssignments([]);
            setResources([]);
            setNotes([]);
          }}
        >
          <ArrowLeft size={18} />
          My Courses
        </button>

        <div className="course-detail-header">
          <div className="course-detail-icon">
            <BookOpen size={28} />
          </div>

          <div className="course-detail-info">
            <h1>{selectedCourse.name}</h1>

            {selectedCourse.code && (
              <p>{selectedCourse.code}</p>
            )}
          </div>

          <button
            className="delete-course detail-delete"
            onClick={() =>
              deleteCourse(selectedCourse.id)
            }
          >
            <Trash2 size={18} />
          </button>
        </div>

        {selectedCourse.description && (
          <div className="course-description">
            {selectedCourse.description}
          </div>
        )}

        <div className="course-tabs">
          <button
            className={
              activeTab === "assignments"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("assignments")
            }
          >
            <ClipboardList size={17} />
            Assignments
            <span>{assignments.length}</span>
          </button>

          <button
            className={
              activeTab === "resources"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("resources")
            }
          >
            <FileText size={17} />
            Resources
            <span>{resources.length}</span>
          </button>

          <button
            className={
              activeTab === "notes" ? "active" : ""
            }
            onClick={() => setActiveTab("notes")}
          >
            <StickyNote size={17} />
            Notes
            <span>{notes.length}</span>
          </button>
        </div>

        {activeTab === "assignments" && (
          <div className="workspace-section">
            <div className="workspace-header">
              <div>
                <h2>Assignments</h2>
                <p>
                  Энэ хичээлийн даалгаврууд
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setShowAssignmentForm(
                    !showAssignmentForm
                  )
                }
              >
                <Plus size={18} />
                Add Assignment
              </button>
            </div>

            {showAssignmentForm && (
              <div className="workspace-form">
                <h3>New Assignment</h3>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={assignmentTitle}
                    onChange={(e) =>
                      setAssignmentTitle(
                        e.target.value
                      )
                    }
                    placeholder="SQL Lab 8"
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={assignmentDescription}
                    onChange={(e) =>
                      setAssignmentDescription(
                        e.target.value
                      )
                    }
                    placeholder="Assignment-ийн тайлбар..."
                  />
                </div>

                <div className="assignment-date-row">
                  <div className="form-group">
                    <label>Due date</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) =>
                        setDueDate(e.target.value)
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Due time</label>
                    <input
                      type="time"
                      value={dueTime}
                      onChange={(e) =>
                        setDueTime(e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setShowAssignmentForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={addAssignment}
                  >
                    Add Assignment
                  </button>
                </div>
              </div>
            )}

            {assignments.length === 0 ? (
              <div className="empty-assignments">
                <ClipboardList size={38} />
                <h3>No assignments yet</h3>
                <p>
                  Энэ хичээлд assignment нэмээгүй
                  байна.
                </p>
              </div>
            ) : (
              <div className="assignment-list">
                {assignments.map((item) => (
                  <div
                    className={`assignment-card ${
                      item.completed
                        ? "assignment-completed"
                        : ""
                    }`}
                    key={item.id}
                  >
                    <button
                      className="assignment-check"
                      onClick={() =>
                        !item.completed &&
                        completeAssignment(item.id)
                      }
                    >
                      {item.completed && (
                        <Check size={16} />
                      )}
                    </button>

                    <div className="assignment-content">
                      <h3>{item.title}</h3>

                      {item.description && (
                        <p>{item.description}</p>
                      )}

                      {(item.due_date ||
                        item.due_time) && (
                        <div className="assignment-due">
                          {item.due_date}
                          {item.due_time &&
                            ` · ${item.due_time.slice(
                              0,
                              5
                            )}`}
                        </div>
                      )}
                    </div>

                    <button
                      className="delete-assignment"
                      onClick={() =>
                        deleteAssignment(item.id)
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "resources" && (
          <div className="workspace-section">
            <div className="workspace-header">
              <div>
                <h2>Resources</h2>
                <p>
                  Лекц, ном, website болон бусад
                  хэрэгтэй эх сурвалж
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setShowResourceForm(
                    !showResourceForm
                  )
                }
              >
                <Plus size={18} />
                Add Resource
              </button>
            </div>

            {showResourceForm && (
              <div className="workspace-form">
                <h3>New Resource</h3>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={resourceTitle}
                    onChange={(e) =>
                      setResourceTitle(
                        e.target.value
                      )
                    }
                    placeholder="Lecture 8"
                  />
                </div>

                <div className="form-group">
                  <label>Type</label>

                  <select
                    value={resourceType}
                    onChange={(e) =>
                      setResourceType(e.target.value)
                    }
                  >
                    <option value="lecture">
                      Lecture
                    </option>
                    <option value="book">
                      Book
                    </option>
                    <option value="website">
                      Website
                    </option>
                    <option value="document">
                      Document
                    </option>
                    <option value="other">
                      Other
                    </option>
                  </select>
                </div>

                <div className="form-group">
                  <label>URL</label>
                  <input
                    value={resourceUrl}
                    onChange={(e) =>
                      setResourceUrl(e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={resourceDescription}
                    onChange={(e) =>
                      setResourceDescription(
                        e.target.value
                      )
                    }
                    placeholder="Энэ resource юунд хэрэгтэй вэ?"
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setShowResourceForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={addResource}
                  >
                    Add Resource
                  </button>
                </div>
              </div>
            )}

            {resources.length === 0 ? (
              <div className="empty-assignments">
                <FileText size={38} />
                <h3>No resources yet</h3>
                <p>
                  Lecture, ном эсвэл website
                  нэмээрэй.
                </p>
              </div>
            ) : (
              <div className="resource-list">
                {resources.map((resource) => (
                  <div
                    className="resource-card"
                    key={resource.id}
                  >
                    <div className="resource-icon">
                      {resource.resource_type ===
                      "website" ? (
                        <LinkIcon size={20} />
                      ) : (
                        <FileText size={20} />
                      )}
                    </div>

                    <div className="resource-content">
                      <div className="resource-type">
                        {resource.resource_type}
                      </div>

                      <h3>{resource.title}</h3>

                      {resource.description && (
                        <p>
                          {resource.description}
                        </p>
                      )}

                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) =>
                            e.stopPropagation()
                          }
                        >
                          Open resource
                        </a>
                      )}
                    </div>

                    <button
                      className="delete-assignment"
                      onClick={() =>
                        deleteResource(resource.id)
                      }
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="workspace-section">
            <div className="workspace-header">
              <div>
                <h2>My Notes</h2>
                <p>
                  Энэ хичээлтэй холбоотой өөрийн
                  тэмдэглэл
                </p>
              </div>

              <button
                className="primary-button"
                onClick={() =>
                  setShowNoteForm(!showNoteForm)
                }
              >
                <Plus size={18} />
                Add Note
              </button>
            </div>

            {showNoteForm && (
              <div className="workspace-form">
                <h3>New Note</h3>

                <div className="form-group">
                  <label>Title</label>
                  <input
                    value={noteTitle}
                    onChange={(e) =>
                      setNoteTitle(e.target.value)
                    }
                    placeholder="LATERAL"
                  />
                </div>

                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    className="large-note-input"
                    value={noteContent}
                    onChange={(e) =>
                      setNoteContent(e.target.value)
                    }
                    placeholder="Өөрийн ойлгосноо бич..."
                  />
                </div>

                <div className="form-actions">
                  <button
                    className="secondary-button"
                    onClick={() =>
                      setShowNoteForm(false)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="primary-button"
                    onClick={addNote}
                  >
                    Save Note
                  </button>
                </div>
              </div>
            )}

            {notes.length === 0 ? (
              <div className="empty-assignments">
                <StickyNote size={38} />
                <h3>No notes yet</h3>
                <p>
                  Хичээлийн өөрийн тэмдэглэлээ
                  хадгалаарай.
                </p>
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <div
                    className="course-note-card"
                    key={note.id}
                  >
                    <div className="note-card-header">
                      <StickyNote size={18} />

                      <button
                        className="delete-assignment"
                        onClick={() =>
                          deleteNote(note.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h3>{note.title}</h3>

                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="page-header">
        <div>
          <h1>My Courses</h1>
          <p>
            Сурч байгаа хичээлүүдээ энд удирдана.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setShowCourseForm(!showCourseForm)
          }
        >
          <Plus size={18} />
          Add Course
        </button>
      </div>

      {showCourseForm && (
        <div className="course-form">
          <h2>Add New Course</h2>

          <div className="form-group">
            <label>Course name</label>
            <input
              placeholder="Database"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Course code</label>
            <input
              placeholder="CS204"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="PostgreSQL болон SQL"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

          <div className="form-actions">
            <button
              className="secondary-button"
              onClick={() =>
                setShowCourseForm(false)
              }
            >
              Cancel
            </button>

            <button
              className="primary-button"
              onClick={addCourse}
            >
              Add Course
            </button>
          </div>
        </div>
      )}

      {courses.length === 0 ? (
        <div className="empty-courses">
          <BookOpen size={44} />

          <h2>No courses yet</h2>

          <p>
            Одоо үзэж байгаа хичээлүүдээ нэмээрэй.
          </p>
        </div>
      ) : (
        <div className="course-grid">
          {courses.map((course) => (
            <div
              className="course-card"
              key={course.id}
              onClick={() => openCourse(course)}
            >
              <div className="course-card-top">
                <div className="course-icon">
                  <BookOpen size={22} />
                </div>

                <button
                  className="delete-course"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCourse(course.id);
                  }}
                >
                  <Trash2 size={17} />
                </button>
              </div>

              <h2>{course.name}</h2>

              {course.code && (
                <span className="course-code">
                  {course.code}
                </span>
              )}

              {course.description && (
                <p>{course.description}</p>
              )}

              <div className="course-card-footer">
                <ClipboardList size={16} />
                Open Course
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;

