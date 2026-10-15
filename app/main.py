import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from app.tools.all_tools import TOOLS
from fastapi import UploadFile, File
from fastapi.staticfiles import StaticFiles
# =========================
# 1. Gemini
# =========================

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY олдсонгүй.")


client = genai.Client(api_key=api_key)


# =========================
# 2. AI Agent
# =========================

SYSTEM_INSTRUCTION = """
You are an AI Student Assistant.

You help university students with:
- studying
- tasks
- notes
- quizzes
- planning
- calculations
- productivity

Use tools when they are useful.

Important task rule:
- Do NOT create tasks automatically when the user asks for a study plan, weekly plan, schedule, advice, or suggestions.
- Only use add_task when the user explicitly asks you to add, create, save, or remember a task.
- A study plan should normally be returned as text, not saved to the tasks database.
- Use create_study_plan when the user asks for a study plan or weekly study plan.

Quiz rule:
- Use create_quiz when the user asks to generate a quiz.
- Do not save quiz results until the student actually completes the quiz.
- Do not use add_task when generating a quiz.
- A generated quiz should contain multiple-choice questions with 4 options and one correct answer.

Answer simply and clearly in Mongolian unless the user asks for another language.
"""


# =========================
# 3. FastAPI
# =========================

def create_gemini_chat(conversation_id: int):
    from app.tools.all_tools import get_chat_history

    history = get_chat_history(conversation_id)

    gemini_history = []

    for item in history:
        if item["role"] == "user":
            gemini_history.append(
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": item["message"]
                        }
                    ]
                }
            )

        elif item["role"] == "assistant":
            gemini_history.append(
                {
                    "role": "model",
                    "parts": [
                        {
                            "text": item["message"]
                        }
                    ]
                }
            )

    return client.chats.create(
        model="gemini-3.6-flash",
        history=gemini_history,
        config={
            "system_instruction": SYSTEM_INSTRUCTION,
            "tools": TOOLS
        }
    )

app = FastAPI(
    title="AI Student Assistant",
    description="AI Student Assistant Agent API"
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 4. Request format
# =========================

class ChatRequest(BaseModel):
    message: str
    conversation_id: int


# =========================
# 5. Home
# =========================

@app.get("/")
def home():
    return {
        "message": "AI Student Assistant is running!",
        "tools": len(TOOLS)
    }


# =========================
# 6. Chat
# =========================

@app.post("/chat")
def chat_with_agent(request: ChatRequest):
    from app.tools.all_tools import save_chat_message

    try:
        save_chat_message(
            request.conversation_id,
            "user",
            request.message
        )

        chat = create_gemini_chat(
            request.conversation_id
        )

        response = chat.send_message(
            request.message
        )

        save_chat_message(
            request.conversation_id,
            "assistant",
            response.text
        )

        return {
            "reply": response.text
        }

    except Exception as e:
        print(f"Gemini error: {e}")

        return {
            "reply": "AI одоогоор хариу өгөх боломжгүй байна. Түр хүлээгээд дахин оролдоно уу."
        }
        
        
@app.get("/tasks")
def get_tasks():
    from app.tools.all_tools import list_tasks

    return list_tasks()

@app.post("/tasks")
def create_task(
    task: str,
    due_date: str = None,
    due_time: str = None,
    description: str = None
):
    from app.tools.all_tools import add_task

    return add_task(
        task,
        due_date,
        due_time,
        description
    )

@app.post("/tasks/{task_id}/complete")
def complete_task_api(task_id: int):
    from app.tools.all_tools import complete_task

    return complete_task(task_id)

@app.delete("/tasks/{task_id}")
def delete_task_api(task_id: int):
    from app.tools.all_tools import delete_task

    return delete_task(task_id)

@app.put("/tasks/{task_id}")
def update_task_api(
    task_id: int,
    task: str,
    due_date: str = None,
    due_time: str = None,
    description: str = None
):
    from app.tools.all_tools import update_task

    return update_task(
        task_id,
        task,
        due_date,
        due_time,
        description
    )


@app.get("/notes")
def get_notes():
    from app.tools.all_tools import list_notes

    return list_notes()


@app.post("/notes")
def create_note(title: str, content: str):
    from app.tools.all_tools import add_note

    return add_note(title, content)


@app.delete("/notes/{note_id}")
def remove_note(note_id: int):
    from app.tools.all_tools import delete_note

    return delete_note(note_id)

@app.get("/study")
def get_study_sessions():
    from app.tools.all_tools import list_study_sessions
    return list_study_sessions()


@app.post("/study")
def create_study_session(subject: str, duration_minutes: int):
    from app.tools.all_tools import add_study_session
    return add_study_session(subject, duration_minutes)


@app.get("/quiz")
def get_quizzes():
    from app.tools.all_tools import get_quiz_results
    return get_quiz_results()


@app.post("/quiz")
def create_quiz_result(subject: str, score: int, total: int):
    from app.tools.all_tools import save_quiz_result
    return save_quiz_result(subject, score, total)

@app.post("/quiz/generate")
def generate_quiz(topic: str, number_of_questions: int = 5):
    from app.tools.all_tools import create_quiz

    return create_quiz(
        topic,
        number_of_questions
    )


@app.get("/progress")
def get_progress_api():
    from app.tools.all_tools import get_progress
    return get_progress()

@app.delete("/study/{session_id}")
def delete_study_session(session_id: int):
    from app.database import get_connection

    connection = get_connection()

    try:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM study_sessions
                WHERE id = %s
                RETURNING id, subject
                """,
                (session_id,)
            )

            session = cursor.fetchone()

        connection.commit()

        if session is None:
            return {
                "success": False,
                "message": "Study session олдсонгүй."
            }

        return {
            "success": True,
            "id": session[0],
            "subject": session[1]
        }

    except Exception as e:
        connection.rollback()
        raise

    finally:
        connection.close()
        

@app.get("/conversations")
def get_conversations():
    from app.tools.all_tools import list_conversations

    return list_conversations()


@app.post("/conversations")
def create_new_conversation(title: str = "New Chat"):
    from app.tools.all_tools import create_conversation

    return create_conversation(title)


@app.get("/conversations/{conversation_id}/messages")
def get_conversation_messages(conversation_id: int):
    from app.tools.all_tools import get_chat_history

    return get_chat_history(conversation_id)


@app.delete("/conversations/{conversation_id}")
def delete_conversation(conversation_id: int):
    from app.database import get_connection

    connection = get_connection()

    try:
        with connection.cursor() as cursor:

            cursor.execute(
                """
                DELETE FROM chat_messages
                WHERE conversation_id = %s
                """,
                (conversation_id,)
            )

            cursor.execute(
                """
                DELETE FROM conversations
                WHERE id = %s
                RETURNING id
                """,
                (conversation_id,)
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
            "id": row[0]
        }

    except Exception:
        connection.rollback()
        raise

    finally:
        connection.close()
        
@app.put("/conversations/{conversation_id}")
def update_conversation(
    conversation_id: int,
    title: str
):
    from app.tools.all_tools import update_conversation_title

    return update_conversation_title(
        conversation_id,
        title
    )
    
@app.post("/study/plan")
def generate_study_plan(
    goal: str,
    days: int = 7,
    hours_per_day: float = 2
):
    from app.tools.all_tools import create_study_plan

    return create_study_plan(
        goal,
        days,
        hours_per_day
    )
    
@app.post("/flashcards/generate")
def generate_flashcards(
    topic: str,
    number_of_cards: int = 5
):
    from app.tools.all_tools import create_flashcards

    return create_flashcards(
        topic,
        number_of_cards
    )
    
@app.get("/calendar")
def get_calendar_tasks():
    from app.tools.all_tools import list_tasks

    tasks = list_tasks()

    return [
        task
        for task in tasks
        if task["due_date"]
    ]
    
@app.get("/courses")
def get_courses():
    from app.tools.all_tools import list_courses

    return list_courses()


@app.post("/courses")
def create_course(
    name: str,
    code: str = None,
    description: str = None
):
    from app.tools.all_tools import add_course

    return add_course(
        name,
        code,
        description
    )


@app.delete("/courses/{course_id}")
def remove_course(course_id: int):
    from app.tools.all_tools import delete_course

    return delete_course(course_id)

@app.get("/assignments")
def get_assignments(course_id: int = None):
    from app.tools.all_tools import list_assignments

    return list_assignments(course_id)


@app.post("/assignments")
def create_assignment(
    course_id: int,
    title: str,
    description: str = None,
    due_date: str = None,
    due_time: str = None
):
    from app.tools.all_tools import add_assignment

    return add_assignment(
        course_id,
        title,
        description,
        due_date,
        due_time
    )


@app.post("/assignments/{assignment_id}/complete")
def complete_assignment_api(assignment_id: int):
    from app.tools.all_tools import complete_assignment

    return complete_assignment(assignment_id)


@app.delete("/assignments/{assignment_id}")
def remove_assignment(assignment_id: int):
    from app.tools.all_tools import delete_assignment

    return delete_assignment(assignment_id)

@app.get("/courses/{course_id}/resources")
def get_course_resources(course_id: int):
    from app.tools.all_tools import list_course_resources

    return list_course_resources(course_id)


@app.post("/courses/{course_id}/resources")
def create_course_resource(
    course_id: int,
    title: str,
    resource_type: str,
    url: str = None,
    file_path: str = None,
    description: str = None
):
    from app.tools.all_tools import add_course_resource

    return add_course_resource(
        course_id,
        title,
        resource_type,
        url,
        file_path,
        description
    )


@app.delete("/resources/{resource_id}")
def remove_course_resource(resource_id: int):
    from app.tools.all_tools import delete_course_resource

    return delete_course_resource(resource_id)

@app.get("/courses/{course_id}/notes")
def get_course_notes(course_id: int):
    from app.tools.all_tools import list_course_notes

    return list_course_notes(course_id)


@app.post("/courses/{course_id}/notes")
def create_course_note(
    course_id: int,
    title: str,
    content: str
):
    from app.tools.all_tools import add_course_note

    return add_course_note(
        course_id,
        title,
        content
    )


@app.delete("/course-notes/{note_id}")
def remove_course_note(note_id: int):
    from app.tools.all_tools import delete_course_note

    return delete_course_note(note_id)

@app.get("/assignments/{assignment_id}/files")
def get_assignment_files(assignment_id: int):
    from app.tools.all_tools import list_assignment_files

    return list_assignment_files(assignment_id)


@app.post("/assignments/{assignment_id}/files")
def create_assignment_file(
    assignment_id: int,
    file_name: str,
    file_path: str,
    file_size: int = None
):
    from app.tools.all_tools import add_assignment_file

    return add_assignment_file(
        assignment_id,
        file_name,
        file_path,
        file_size
    )


@app.delete("/assignment-files/{file_id}")
def remove_assignment_file(file_id: int):
    from app.tools.all_tools import delete_assignment_file

    return delete_assignment_file(file_id)

import os
import uuid
@app.post("/assignments/{assignment_id}/files/upload")
async def upload_assignment_file(
    assignment_id: int,
    file: UploadFile = File(...)
):
    from app.tools.all_tools import add_assignment_file

    upload_dir = "uploads/assignments"
    os.makedirs(upload_dir, exist_ok=True)

    original_name = file.filename

    extension = ""

    if original_name and "." in original_name:
        extension = "." + original_name.split(".")[-1]

    stored_name = f"{uuid.uuid4()}{extension}"

    file_path = os.path.join(
        upload_dir,
        stored_name
    )

    file_size = 0

    try:
        with open(file_path, "wb") as output_file:
            while True:
                chunk = await file.read(1024 * 1024)

                if not chunk:
                    break

                output_file.write(chunk)
                file_size += len(chunk)

        result = add_assignment_file(
            assignment_id,
            original_name,
            file_path,
            file_size
        )

        result["file_url"] = (
            f"/uploads/assignments/{stored_name}"
        )

        return result

    except Exception:
        if os.path.exists(file_path):
            os.remove(file_path)

        raise