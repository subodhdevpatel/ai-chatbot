import os
import chromadb
from chromadb.utils import embedding_functions
from typing import List

# Configuration
DOCUMENTS_DIR = "documents"
DB_PATH = "chroma_db"
COLLECTION_NAME = "rag_collection"

def load_documents(directory: str) -> List[str]:
    """Reads all .txt files from the directory and returns their content."""
    documents = []
    if not os.path.exists(directory):
        os.makedirs(directory)
        return []
    
    for filename in os.listdir(directory):
        if filename.endswith(".txt"):
            path = os.path.join(directory, filename)
            with open(path, "r", encoding="utf-8") as f:
                text = f.read()
                documents.append(text)
                print(f"Loaded: {filename}")
                
        # Simple PDF support (if needed later, we can expand)
        # elif filename.endswith(".pdf"): ...
        
    return documents

def split_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Splits text into chunks with overlap."""
    chunks = []
    start = 0
    text_len = len(text)
    
    while start < text_len:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += (chunk_size - overlap)
        
    return chunks

def main():
    print("Initializing ChromaDB client...")
    client = chromadb.PersistentClient(path=DB_PATH)
    
    print("Initializing Embedding Function (all-MiniLM-L6-v2)...")
    # Uses the local model from sentence-transformers
    sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
        model_name="all-MiniLM-L6-v2"
    )
    
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        embedding_function=sentence_transformer_ef
    )
    
    print(f"Loading documents from '{DOCUMENTS_DIR}'...")
    raw_docs = load_documents(DOCUMENTS_DIR)
    
    if not raw_docs:
        print("No documents found. Please add .txt files to the documents/ directory.")
        return

    all_chunks = []
    all_ids = []
    
    chunk_counter = 0
    for doc in raw_docs:
        chunks = split_text(doc)
        for chunk in chunks:
            all_chunks.append(chunk)
            all_ids.append(f"chunk_{chunk_counter}")
            chunk_counter += 1
            
    if all_chunks:
        print(f"Upserting {len(all_chunks)} chunks into ChromaDB...")
        collection.upsert(
            documents=all_chunks,
            ids=all_ids
        )
        print("Ingestion complete!")
    else:
        print("No text content could be extracted.")

if __name__ == "__main__":
    main()
