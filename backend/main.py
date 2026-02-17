from fastapi import FastAPI, HTTPException, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ingest import ingest_docs, remove_document_from_db
from chatbot import generate_response
import shutil
import os

app = FastAPI(title="RAG Chatbot API")

# Setup CORS to allow requests from the React frontend (running on port 5173 usually)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev, allow all. In prod, lock this down.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str

@app.get("/")
def read_root():
    return {"status": "ok", "message": "RAG Chatbot API is running"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    try:
        response_text = generate_response(request.message)
        return ChatResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "documents")

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    # Supported file types
    allowed_extensions = [".txt", ".pdf", ".docx"]
    ext = os.path.splitext(file.filename)[1].lower()
    
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}")
    
    save_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Trigger ingestion for this specific file
    success = ingest_docs(file_path=save_path)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to ingest document into database.")
        
    return {"filename": file.filename, "status": "uploaded_and_ingested"}

@app.get("/documents")
def list_documents():
    if not os.path.exists(UPLOAD_DIR):
        return []
    return [f for f in os.listdir(UPLOAD_DIR) if os.path.isfile(os.path.join(UPLOAD_DIR, f))]

from fastapi.responses import FileResponse

@app.get("/documents/{filename}/content")
def get_document_content(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.delete("/documents/{filename}")
def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    deleted_from_db = False
    deleted_from_disk = False
    
    # 1. Remove from Disk
    if os.path.exists(file_path):
        os.remove(file_path)
        deleted_from_disk = True
    else:
        # If not on disk, we might still want to clean up DB
        print(f"File {filename} not found on disk, but proceeding to remove from DB.")

    # 2. Remove from ChromaDB
    try:
        if remove_document_from_db(filename):
            deleted_from_db = True
        else:
             print(f"ChromaDB returned False for deletion of {filename}")
    except Exception as e:
        print(f"Error removing from DB: {e}")

    if not deleted_from_disk and not deleted_from_db:
        raise HTTPException(status_code=404, detail="Document not found")
        
    return {"status": "deleted", "filename": filename}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
