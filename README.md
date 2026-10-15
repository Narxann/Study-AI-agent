# Study AI Agent

An AI-powered study assistant designed to help students organize their learning and manage academic tasks through an interactive chat interface.

## Overview

Study AI Agent is a personal project exploring how AI agents can support students in their daily academic activities. It combines a language model with backend tools to handle user requests and support task management.

The project focuses on integrating AI capabilities with practical application features.

## Features

- **AI-powered chat:** Interact with an AI assistant through a conversational interface.
- **Task management:** Use integrated tools to support academic task management.
- **Backend API:** Handle application requests through a FastAPI backend.
- **LLM integration:** Connect a language model using the Google Gemini API.
- **Frontend interface:** Provide a user interface for interacting with the assistant.

## Tech Stack

- **Language:** Python, JavaScript
- **Backend:** FastAPI
- **AI / LLM:** Google Gemini API
- **Frontend:** JavaScript-based web application
- **Tools:** Git, GitHub

## Project Structure

```text
Study-AI-agent/
├── app/                 # Backend application
├── frontend/            # Frontend application
├── .gitignore
├── App.css
├── package.json
├── test_modules.py
├── test_tasks.py
└── README.md
```

## Getting Started

### Prerequisites

- Python
- Node.js and npm
- A Google Gemini API key

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Narxann/Study-AI-agent.git
   cd Study-AI-agent
   ```

2. Create and activate a Python virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install the required Python packages according to the project's dependency configuration.
4. Configure your Gemini API key using an environment variable in a local `.env` file. Never commit API keys or other secrets to GitHub.
5. Install the frontend dependencies using npm in the directory containing the frontend's `package.json`.
6. Start the backend and frontend using their respective development commands.

_Note: Exact installation and startup commands depend on the project's current dependency files and application entry points._

## What I Learned

Through this project, I have been exploring:

- Integrating a large language model into an application
- Building backend APIs with FastAPI
- Connecting AI capabilities with application tools
- Organizing a project into backend and frontend components
- Testing application functionality and debugging integration issues

## Future Improvements

- Improve the assistant's reliability and error handling
- Expand academic task management capabilities
- Add learning resource management features
- Improve automated testing and documentation

## Author

**Narxann**

Computer Science student interested in software engineering, artificial intelligence, and machine learning.

- GitHub: [@Narxann](https://github.com/Narxann)
