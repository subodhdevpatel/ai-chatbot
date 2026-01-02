import os
from dotenv import load_dotenv
from openai import OpenAI

from system_prompt import SYSTEM_PROMPT
from retriever import file_retrieve

load_dotenv()

# Initialize OpenAI Client if API key is present
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None

def generate_response(user_query: str) -> str:
    """
    Generates a response using the RAG flow.
    1. Retrieve context.
    2. Format prompt.
    3. Call LLM (or mock if no key).
    """
    
    # 1. Retrieve
    retrieved_docs = file_retrieve(user_query)
    context_str = "\n\n".join(retrieved_docs) if retrieved_docs else "No relevant documents found."
    
    # 2. Format Prompt
    # We construct the messages structure for the ChatCompletion API
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"CONTEXT:\n{context_str}\n\nUSER QUESTION:\n{user_query}"}
    ]
    
    # 3. Call LLM
    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo", # Or gpt-4
                messages=messages,
                temperature=0.0  # Zero temperature for factual grounding
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error communicating with LLM: {str(e)}"
    else:
        # Mock LLM behavior for demo purposes without API key
        if not retrieved_docs:
            return "I don't have enough information in the provided documents to answer that question."
        return f"[MOCK AI RESPONSE]\nRelevant info:\n{chr(10).join(retrieved_docs)}\n\n(Note: Set OPENAI_API_KEY in .env to get real AI responses)"
