# Study AI Agent

An experimental AI-powered study assistant for university students, combining a conversational interface with academic productivity tools.

> **Status:** Personal learning project / prototype. Features listed below are implemented in repository code; end-to-end reliability and deployment have not been independently verified.

## Overview

The project explores how a large language model can interact with application tools and persistent academic data. The backend uses FastAPI and the Google Gemini API; the repository also includes a React/Vite frontend.

## Features in the codebase

- Conversational AI endpoint with conversation history and tool configuration.
- Task creation, editing, completion, deletion and calendar-oriented task listing.
- Notes, study sessions, course and assignment management.
- Quiz generation and quiz-result records, study-plan and flashcard generation.
- Study progress and course-resource endpoints.

Some functions depend on database configuration and external API access. The presence of an endpoint does not guarantee that every flow has been tested successfully.

## Technology

- **Backend:** Python, FastAPI, Pydantic
- **LLM:** Google Gemini API / Google GenAI SDK
- **Frontend:** React, JavaScript, Vite
- **Data:** Database access through `app/database.py`
- **Development:** Git, GitHub, Python test scripts

## Repository layout

```text
app/                FastAPI application, database access and tools
frontend/           React/Vite frontend
test_modules.py     Test script
test_tasks.py       Test script
README.md           Project documentation
```

## Local setup (development)

1. Clone this repository and create a Python virtual environment.
2. Install the backend dependencies used by `app/main.py` and the tools modules.
3. Configure a local `.env` with `GEMINI_API_KEY` and the database settings required by `app/database.py`. Never commit secrets.
4. Ensure the database and required tables are available. The application mounts an `uploads/` directory, so create it if needed.
5. Start the backend from the repository root with `uvicorn app.main:app --reload`.
6. Install frontend dependencies in `frontend/` using `npm install`, then start it with `npm run dev`.

**Note:** Backend dependencies and database initialization may need additional setup. These instructions are a development starting point, not a verified one-command installation.

## AI-assisted development and learning

This project is developed with AI coding assistance. My focus is understanding the architecture, how the frontend communicates with FastAPI, how LLM tool calls connect to application operations, and how to diagnose and test integration issues. I do not claim to have independently authored every line of code.

## Next steps

- Document database setup and pin backend dependencies.
- Add repeatable end-to-end tests and clearer error handling.
- Verify each feature with reproducible test cases.
- Add screenshots and a short demonstration after validation.

## Author

[Narxann](https://github.com/Narxann)
