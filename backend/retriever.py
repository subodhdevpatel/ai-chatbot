import os
from typing import List
from ingest import load_documents, split_text, DOCUMENTS_DIR

def file_retrieve(query: str, max_chunks: int = 3) -> List[str]:
    """
    Loads all .txt files from the documents/ folder, splits them into paragraphs, and returns the most relevant ones based on keyword matching.
    If the query is empty or too generic, return all paragraphs.
    """
    documents = load_documents(DOCUMENTS_DIR)
    all_chunks = []
    for doc in documents:
        # Split by paragraph (double newline)
        all_chunks.extend([p.strip() for p in doc.split('\n\n') if p.strip()])
    
    query_lower = query.strip().lower()
    if not query_lower or query_lower in ["what", "info", "information", "details", "about", "describe", "summary"]:
        return all_chunks  # Return all if query is empty or too generic
    relevant = [chunk for chunk in all_chunks if any(word in chunk.lower() for word in query_lower.split())]
    if not relevant:
        return []
    return relevant[:max_chunks]

def mock_retrieve(query: str) -> List[str]:
    """
    Simulates a retrieval system.
    In a real app, this would query a vector database (e.g., Pinecone, ChromaDB).
    For this demo, it returns static documents based on simple keyword matching.
    """
    
    # Mock database
    documents = [
        "The Omega Project is a top-secret initiative started in 2024 to develop quantum-resistant encryption.",
        "The main headquarters of the Omega Project is located in Zurich, Switzerland.",
        "Dr. Eleanor Vance is the lead researcher of the Omega Project.",
        "The project faced a temporary shutdown in late 2024 due to funding issues but resumed in early 2025.",
        "The Alpha Protocol is a competing standard developed by a rival consortium."
    ]
    
    query_lower = query.lower()
    retrieved = [doc for doc in documents if any(word in doc.lower() for word in query_lower.split())]
    

    
    if not retrieved:
        return []
    
    return retrieved[:3] # Return top 3 matches
