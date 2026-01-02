# Domain-Specific AI Chatbot using Retrieval-Augmented Generation (RAG)

## Project Title
Build a Domain-Specific AI Chatbot using Retrieval-Augmented Generation (RAG)

## Objective
Design and build a simple AI-powered chatbot that can answer user questions based on a given set of documents using a RAG-based approach. The goal is to demonstrate understanding of how AI systems work in production environments.

## Features
- Accepts natural language questions from users
- Retrieves relevant information from provided documents
- Uses an LLM (OpenAI GPT) to generate accurate, grounded responses based only on retrieved data
- Simple and clean UI for user interaction
- Document upload support (txt, pdf, md)

## System Architecture
```
User <-> React Frontend <-> FastAPI Backend <-> Document Store & LLM
```
- **Frontend:** React app for chat interface and document upload
- **Backend:** FastAPI server for chat and document ingestion endpoints
- **Retrieval:** Simple keyword-based retrieval (mocked, can be replaced with vector DB)
- **LLM:** OpenAI GPT-3.5/4 (or mock if no API key)

## Folder Structure
```
backend/
  main.py           # FastAPI app
  chatbot.py        # RAG logic and LLM call
  retriever.py      # Document retrieval logic
  ingest.py         # Document ingestion and splitting
  system_prompt.py  # System prompt for LLM
  documents/        # Uploaded/ingested documents
frontend/
  src/
    components/     # Chat UI components
    api/            # API client
    ...
```

## Setup Instructions

### Backend
1. `cd backend`
2. Create a `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-...
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend
1. `cd frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm start
   ```

## Usage
- Ask questions in the chat UI. The bot will answer using only the ingested documents.
- Upload new documents to expand the knowledge base.

## Design Decisions
- **RAG Pattern:** Ensures answers are grounded in source data, reducing hallucinations.
- **System Prompt:** Strict instructions to only answer from retrieved context.
- **Mock Retrieval:** Simple keyword search for demo; can be replaced with vector DB (e.g., ChromaDB, Pinecone).
- **OpenAI LLM:** Used for generation; falls back to mock if no API key.
- **Frontend/Backend Separation:** Clean API boundary for scalability.

## Edge Cases & Limitations
- If no relevant document is found, the bot will say it doesn't have enough information.
- Only `.txt` files are fully supported for ingestion (PDF support is stubbed).
- Retrieval is basic; for production, use a vector DB and embeddings.
- No authentication or user management.
- LLM responses are only as good as the context retrieved.

## Improvements (with more time)
- Integrate a real vector database for semantic search
- Add PDF parsing and richer document support
- Improve UI/UX and add chat history
- Add authentication and user management
- Support for multiple LLM providers
- Better error handling and logging

## Example Questions for Omega Project
Here are some questions you can ask the chatbot based on the Omega Project documents:

- What is the Omega Project?
- Who is the lead researcher of the Omega Project?
- Where is the headquarters of the Omega Project?
- What happened to the Omega Project in late 2024?
- What is the Alpha Protocol?
- Who funds the Omega Project?
- What are the technical goals of the Omega Project?
- What is the main rival to the Omega Project?
- When did operations resume for the Omega Project?
- What is the mission of the Omega Project?

## License
MIT
