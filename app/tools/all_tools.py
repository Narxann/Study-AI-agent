from datetime import datetime

from app.database import get_connection


def calculator(a: int, b: int) -> int:
    """Multiply two numbers."""
    return a * b


def get_current_time() -> str:
    """Get the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def subtract_numbers(a: int, b: int) -> int:
    """Get subtraction of two numbers."""
    return a - b


def add_task(
    task: str,
    due_date: str = None,
    due_time: str = None,
    description: str = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO tasks
                (task, due_date, due_time, description)
                VALUES (%s, %s, %s, %s)
                RETURNING id, task, completed, due_date, due_time, description
                """,
                (
                    task,
                    due_date,
                    due_time,
                    description
                )
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "task": row[1],
            "completed": row[2],
            "due_date": str(row[3]) if row[3] else None,
            "due_time": str(row[4]) if row[4] else None,
            "description": row[5]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_tasks():
    """Get all tasks from the student's task list."""
    print("🔧 TOOL: list_tasks")
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM tasks;")
            tasks = cursor.fetchall()

        return [
            {
                "id": task[0],
                "task": task[1],
                "completed": task[2],
                "created_at": task[3].isoformat()
            }
            for task in tasks
        ]

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()


def complete_task(task_id: int):
    """Mark a task as completed using its task id."""
    print("🔧 TOOL: complete_task")
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE tasks
                SET completed = TRUE
                WHERE id = %s
                RETURNING id, task, completed
                """,
                (task_id,)
            )
            completed_task = cursor.fetchone()

        connection.commit()

        if completed_task is None:
            return {
                "success": False,
                "message": "Task олдсонгүй."
            }

        return {
            "success": True,
            "id": completed_task[0],
            "task": completed_task[1],
            "completed": completed_task[2]
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()


def delete_task(task_id: int):
    """Delete a task from the student's task list using task id."""
    print("🔧 TOOL: delete_task")
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM tasks
                WHERE id = %s
                RETURNING id, task
                """,
                (task_id,)
            )
            deleted_task = cursor.fetchone()

        connection.commit()

        if deleted_task is None:
            return {
                "success": False,
                "message": "Task олдсонгүй."
            }

        return {
            "success": True,
            "id": deleted_task[0],
            "task": deleted_task[1]
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()

def add_note(title: str, content: str):
    """Add a new study note."""

    print("🔧 TOOL: add_note")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO notes (title, content)
                VALUES (%s, %s)
                RETURNING id, title, content, created_at
                """,
                (title, content)
            )
            note = cursor.fetchone()

        connection.commit()

        return {
            "id": note[0],
            "title": note[1],
            "content": note[2],
            "created_at": note[3].isoformat()
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()


def list_notes():
    """Get all study notes."""

    print("🔧 TOOL: list_notes")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, title, content, created_at
                FROM notes
                ORDER BY created_at DESC
                """
            )
            notes = cursor.fetchall()

        return [
            {
                "id": note[0],
                "title": note[1],
                "content": note[2],
                "created_at": note[3].isoformat()
            }
            for note in notes
        ]

    finally:
        connection.close()


def delete_note(note_id: int):
    """Delete a study note by id."""

    print("🔧 TOOL: delete_note")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM notes
                WHERE id = %s
                RETURNING id, title
                """,
                (note_id,)
            )
            note = cursor.fetchone()

        connection.commit()

        if note is None:
            return {
                "success": False,
                "message": "Note олдсонгүй."
            }

        return {
            "success": True,
            "id": note[0],
            "title": note[1]
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()

def add_study_session(subject: str, duration_minutes: int):
    """Save a study session."""

    print("🔧 TOOL: add_study_session")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO study_sessions (subject, duration_minutes)
                VALUES (%s, %s)
                RETURNING id, subject, duration_minutes, studied_at
                """,
                (subject, duration_minutes)
            )
            session = cursor.fetchone()

        connection.commit()

        return {
            "id": session[0],
            "subject": session[1],
            "duration_minutes": session[2],
            "studied_at": session[3].isoformat()
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()


def list_study_sessions():
    """Get all study sessions."""

    print("🔧 TOOL: list_study_sessions")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, subject, duration_minutes, studied_at
                FROM study_sessions
                ORDER BY studied_at DESC
                """
            )
            sessions = cursor.fetchall()

        return [
            {
                "id": session[0],
                "subject": session[1],
                "duration_minutes": session[2],
                "studied_at": session[3].isoformat()
            }
            for session in sessions
        ]

    finally:
        connection.close()

def save_quiz_result(subject: str, score: int, total: int):
    """Save a quiz result."""

    print("🔧 TOOL: save_quiz_result")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO quizzes (subject, score, total)
                VALUES (%s, %s, %s)
                RETURNING id, subject, score, total, created_at
                """,
                (subject, score, total)
            )
            result = cursor.fetchone()

        connection.commit()

        return {
            "id": result[0],
            "subject": result[1],
            "score": result[2],
            "total": result[3],
            "created_at": result[4].isoformat()
        }

    except Exception as e:
        connection.rollback()
        print(f"Алдаа: {e}")
        raise

    finally:
        connection.close()


def get_quiz_results():
    """Get all quiz results."""

    print("🔧 TOOL: get_quiz_results")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, subject, score, total, created_at
                FROM quizzes
                ORDER BY created_at DESC
                """
            )
            results = cursor.fetchall()

        return [
            {
                "id": result[0],
                "subject": result[1],
                "score": result[2],
                "total": result[3],
                "created_at": result[4].isoformat()
            }
            for result in results
        ]

    finally:
        connection.close()

def get_progress():
    """Get the student's overall learning progress."""

    print("🔧 TOOL: get_progress")

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute("SELECT COUNT(*) FROM tasks")
            total_tasks = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COUNT(*) FROM tasks WHERE completed = TRUE"
            )
            completed_tasks = cursor.fetchone()[0]

            cursor.execute(
                "SELECT COALESCE(SUM(duration_minutes), 0) FROM study_sessions"
            )
            total_study_minutes = cursor.fetchone()[0]

            cursor.execute(
                """
                SELECT COALESCE(
                    AVG(score::float / NULLIF(total, 0) * 100),
                    0
                )
                FROM quizzes
                """
            )
            average_quiz_score = cursor.fetchone()[0]

        if total_tasks > 0:
            task_completion_rate = (
                completed_tasks / total_tasks
            ) * 100
        else:
            task_completion_rate = 0

        return {
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "task_completion_rate": round(task_completion_rate, 2),
            "total_study_minutes": total_study_minutes,
            "average_quiz_score": round(float(average_quiz_score), 2)
        }

    finally:
        connection.close()
        
def create_study_plan(
    goal: str,
    days: int = 7,
    hours_per_day: float = 2
):
    """
    Create a structured study plan.
    This does not create tasks in the database.
    """

    if days <= 0:
        days = 7

    if hours_per_day <= 0:
        hours_per_day = 2

    plan = []

    for day in range(1, days + 1):
        plan.append({
            "day": day,
            "hours": hours_per_day,
            "focus": f"{goal} - Day {day}",
            "activities": [
                "Learn new concept",
                "Practice",
                "Review"
            ]
        })

    return {
        "goal": goal,
        "days": days,
        "hours_per_day": hours_per_day,
        "plan": plan
    }
    
def save_chat_message(conversation_id: int, role: str, message: str):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO chat_messages
                (conversation_id, role, message)
                VALUES (%s, %s, %s)
                RETURNING id, conversation_id, role, message, created_at
                """,
                (conversation_id, role, message)
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "conversation_id": row[1],
            "role": row[2],
            "message": row[3],
            "created_at": row[4].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def get_chat_history(conversation_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, role, message, created_at
                FROM chat_messages
                WHERE conversation_id = %s
                ORDER BY created_at ASC
                """,
                (conversation_id,)
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "role": row[1],
                "message": row[2],
                "created_at": row[3].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()
        
def create_conversation(title: str):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO conversations (title)
                VALUES (%s)
                RETURNING id, title, created_at
                """,
                (title,)
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "title": row[1],
            "created_at": row[2].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def list_conversations():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, title, created_at
                FROM conversations
                ORDER BY created_at DESC
                """
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "title": row[1],
                "created_at": row[2].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()
        
def update_conversation_title(conversation_id: int, title: str):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE conversations
                SET title = %s
                WHERE id = %s
                RETURNING id, title
                """,
                (title, conversation_id)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Conversation олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "title": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()

def create_quiz(
    topic: str,
    number_of_questions: int = 5
):
    """
    Create a sample structured quiz.
    This does not save the quiz result.
    """

    sample_questions = [
        {
            "question": "Python-д function зарлахад аль keyword ашигладаг вэ?",
            "options": [
                "function",
                "def",
                "func",
                "create"
            ],
            "correct_answer": "def"
        },
        {
            "question": "Python list-ийн эхний index хэд вэ?",
            "options": [
                "0",
                "1",
                "-1",
                "2"
            ],
            "correct_answer": "0"
        },
        {
            "question": "Python-д integer төрлийн жишээ аль нь вэ?",
            "options": [
                '"10"',
                "10",
                "10.5",
                "True"
            ],
            "correct_answer": "10"
        },
        {
            "question": "Python-д comment бичихэд аль тэмдэг ашигладаг вэ?",
            "options": [
                "//",
                "/*",
                "#",
                "<!--"
            ],
            "correct_answer": "#"
        },
        {
            "question": "Python dictionary ямар хаалт ашигладаг вэ?",
            "options": [
                "()",
                "[]",
                "{}",
                "<>"
            ],
            "correct_answer": "{}"
        }
    ]

    questions = sample_questions[:number_of_questions]

    return {
        "topic": topic,
        "questions": questions
    }

def create_flashcards(
    topic: str,
    number_of_cards: int = 5
):
    """
    Create sample flashcards.
    This does not save anything to the database.
    """

    sample_cards = [
        {
            "front": "What is Python?",
            "back": "Python is a high-level programming language."
        },
        {
            "front": "What is a function?",
            "back": "A function is a reusable block of code that performs a specific task."
        },
        {
            "front": "What is a variable?",
            "back": "A variable is a name that refers to a value stored in memory."
        },
        {
            "front": "What is a list in Python?",
            "back": "A list is an ordered, mutable collection of elements."
        },
        {
            "front": "What is a dictionary?",
            "back": "A dictionary stores data as key-value pairs."
        }
    ]

    cards = sample_cards[:number_of_cards]

    return {
        "topic": topic,
        "cards": cards
    }


TOOLS = [
    calculator,
    get_current_time,

    add_task,
    subtract_numbers,
    list_tasks,
    complete_task,
    delete_task,

    add_note,
    list_notes,
    delete_note,

    add_study_session,
    list_study_sessions,

    save_quiz_result,
    get_quiz_results,

    get_progress,
    create_study_plan,
    create_quiz,
    
    create_flashcards,
]

def update_task(
    task_id: int,
    task: str,
    due_date: str = None,
    due_time: str = None,
    description: str = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE tasks
                SET
                    task = %s,
                    due_date = %s,
                    due_time = %s,
                    description = %s
                WHERE id = %s
                RETURNING
                    id,
                    task,
                    completed,
                    created_at,
                    due_date,
                    due_time,
                    description
                """,
                (
                    task,
                    due_date,
                    due_time,
                    description,
                    task_id
                )
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Task олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "task": row[1],
            "completed": row[2],
            "created_at": row[3].isoformat(),
            "due_date": str(row[4])
            if row[4] else None,
            "due_time": str(row[5])
            if row[5] else None,
            "description": row[6]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def add_course(
    name: str,
    code: str = None,
    description: str = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO courses
                (name, code, description)
                VALUES (%s, %s, %s)
                RETURNING id, name, code, description, created_at
                """,
                (name, code, description)
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "name": row[1],
            "code": row[2],
            "description": row[3],
            "created_at": row[4].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_courses():
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    code,
                    description,
                    created_at
                FROM courses
                ORDER BY id DESC
                """
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "name": row[1],
                "code": row[2],
                "description": row[3],
                "created_at": row[4].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()


def delete_course(course_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM courses
                WHERE id = %s
                RETURNING id, name
                """,
                (course_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Course олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "name": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def add_assignment(
    course_id: int,
    title: str,
    description: str = None,
    due_date: str = None,
    due_time: str = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO assignments
                (course_id, title, description, due_date, due_time)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING
                    id,
                    course_id,
                    title,
                    description,
                    due_date,
                    due_time,
                    completed,
                    created_at
                """,
                (
                    course_id,
                    title,
                    description,
                    due_date,
                    due_time
                )
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "course_id": row[1],
            "title": row[2],
            "description": row[3],
            "due_date": str(row[4]) if row[4] else None,
            "due_time": str(row[5]) if row[5] else None,
            "completed": row[6],
            "created_at": row[7].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_assignments(course_id: int = None):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            if course_id is not None:
                cursor.execute(
                    """
                    SELECT
                        a.id,
                        a.course_id,
                        c.name,
                        a.title,
                        a.description,
                        a.due_date,
                        a.due_time,
                        a.completed,
                        a.created_at
                    FROM assignments a
                    JOIN courses c
                        ON a.course_id = c.id
                    WHERE a.course_id = %s
                    ORDER BY
                        a.completed ASC,
                        a.due_date ASC NULLS LAST,
                        a.due_time ASC NULLS LAST,
                        a.id DESC
                    """,
                    (course_id,)
                )
            else:
                cursor.execute(
                    """
                    SELECT
                        a.id,
                        a.course_id,
                        c.name,
                        a.title,
                        a.description,
                        a.due_date,
                        a.due_time,
                        a.completed,
                        a.created_at
                    FROM assignments a
                    JOIN courses c
                        ON a.course_id = c.id
                    ORDER BY
                        a.completed ASC,
                        a.due_date ASC NULLS LAST,
                        a.due_time ASC NULLS LAST,
                        a.id DESC
                    """
                )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "course_id": row[1],
                "course_name": row[2],
                "title": row[3],
                "description": row[4],
                "due_date": str(row[5]) if row[5] else None,
                "due_time": str(row[6]) if row[6] else None,
                "completed": row[7],
                "created_at": row[8].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()


def complete_assignment(assignment_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE assignments
                SET completed = TRUE
                WHERE id = %s
                RETURNING id, title, completed
                """,
                (assignment_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Assignment олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "title": row[1],
            "completed": row[2]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def delete_assignment(assignment_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM assignments
                WHERE id = %s
                RETURNING id, title
                """,
                (assignment_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Assignment олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "title": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def add_course_resource(
    course_id: int,
    title: str,
    resource_type: str,
    url: str = None,
    file_path: str = None,
    description: str = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO course_resources
                (
                    course_id,
                    title,
                    resource_type,
                    url,
                    file_path,
                    description
                )
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING
                    id,
                    course_id,
                    title,
                    resource_type,
                    url,
                    file_path,
                    description,
                    created_at
                """,
                (
                    course_id,
                    title,
                    resource_type,
                    url,
                    file_path,
                    description
                )
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "course_id": row[1],
            "title": row[2],
            "resource_type": row[3],
            "url": row[4],
            "file_path": row[5],
            "description": row[6],
            "created_at": row[7].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_course_resources(course_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    course_id,
                    title,
                    resource_type,
                    url,
                    file_path,
                    description,
                    created_at
                FROM course_resources
                WHERE course_id = %s
                ORDER BY created_at DESC
                """,
                (course_id,)
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "course_id": row[1],
                "title": row[2],
                "resource_type": row[3],
                "url": row[4],
                "file_path": row[5],
                "description": row[6],
                "created_at": row[7].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()


def delete_course_resource(resource_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM course_resources
                WHERE id = %s
                RETURNING id, title
                """,
                (resource_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Resource олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "title": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def add_course_note(
    course_id: int,
    title: str,
    content: str
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO course_notes
                (course_id, title, content)
                VALUES (%s, %s, %s)
                RETURNING
                    id,
                    course_id,
                    title,
                    content,
                    created_at
                """,
                (
                    course_id,
                    title,
                    content
                )
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "course_id": row[1],
            "title": row[2],
            "content": row[3],
            "created_at": row[4].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_course_notes(course_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    course_id,
                    title,
                    content,
                    created_at
                FROM course_notes
                WHERE course_id = %s
                ORDER BY created_at DESC
                """,
                (course_id,)
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "course_id": row[1],
                "title": row[2],
                "content": row[3],
                "created_at": row[4].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()


def delete_course_note(note_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM course_notes
                WHERE id = %s
                RETURNING id, title
                """,
                (note_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "Note олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "title": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
def add_assignment_file(
    assignment_id: int,
    file_name: str,
    file_path: str,
    file_size: int = None
):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO assignment_files
                (
                    assignment_id,
                    file_name,
                    file_path,
                    file_size
                )
                VALUES (%s, %s, %s, %s)
                RETURNING
                    id,
                    assignment_id,
                    file_name,
                    file_path,
                    file_size,
                    uploaded_at
                """,
                (
                    assignment_id,
                    file_name,
                    file_path,
                    file_size
                )
            )

            row = cursor.fetchone()

        connection.commit()

        return {
            "id": row[0],
            "assignment_id": row[1],
            "file_name": row[2],
            "file_path": row[3],
            "file_size": row[4],
            "uploaded_at": row[5].isoformat()
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()


def list_assignment_files(assignment_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    assignment_id,
                    file_name,
                    file_path,
                    file_size,
                    uploaded_at
                FROM assignment_files
                WHERE assignment_id = %s
                ORDER BY uploaded_at DESC
                """,
                (assignment_id,)
            )

            rows = cursor.fetchall()

        return [
            {
                "id": row[0],
                "assignment_id": row[1],
                "file_name": row[2],
                "file_path": row[3],
                "file_size": row[4],
                "uploaded_at": row[5].isoformat()
            }
            for row in rows
        ]

    finally:
        connection.close()


def delete_assignment_file(file_id: int):
    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM assignment_files
                WHERE id = %s
                RETURNING id, file_name
                """,
                (file_id,)
            )

            row = cursor.fetchone()

        connection.commit()

        if row is None:
            return {
                "success": False,
                "message": "File олдсонгүй."
            }

        return {
            "success": True,
            "id": row[0],
            "file_name": row[1]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()