import chromadb
from chromadb.utils import embedding_functions
from typing import List

# Configuration (must match ingest.py)
DB_PATH = "chroma_db"
COLLECTION_NAME = "rag_collection"

def file_retrieve(query: str, max_chunks: int = 3) -> List[str]:
    """
    Connects to the local ChromaDB and retrieves relevant chunks.
    """
    try:
        # Initialize Client
        client = chromadb.PersistentClient(path=DB_PATH)
        
        # Initialize Embedding Function
        sentence_transformer_ef = embedding_functions.SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        
        # Get Collection
        collection = client.get_or_create_collection(
            name=COLLECTION_NAME,
            embedding_function=sentence_transformer_ef
        )
        
        # Query
        results = collection.query(
            query_texts=[query],
            n_results=max_chunks,
            include=["documents", "metadatas"]
        )
        
        if results and results['documents']:
            docs = results['documents'][0]
            metas = results['metadatas'][0] if results['metadatas'] else []
            
            if not docs:
                print("Results returned but 'documents' list is empty.")
                return []

            print(f"Number of documents found: {len(docs)}")
    
            # Combine doc content with source info
            formatted_results = []
            for i, doc in enumerate(docs):
                source = metas[i].get("source", "unknown") if i < len(metas) else "unknown"
                formatted_results.append(f"[Source: {source}]\n{doc}")
            
            # Debug print first result
            if formatted_results:
                # Safe access for debug
                first_meta = metas[0] if metas else {}
                source_preview = first_meta.get('source', 'unknown')
                doc_preview = docs[0][:100] if docs else "No content"
                print(f"First result source: {source_preview}")
                print(f"First result preview: {doc_preview}...")

            return formatted_results
        
        print("No results found in ChromaDB.")
        return []
        
    except Exception as e:
        print(f"Error querying ChromaDB: {e}")
        return []
