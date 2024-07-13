
from backend.RAG import RAGSystem


rag = RAGSystem()

def generate_multiple_choice(content):
    content = rag.generate_rag(content,"MC")
    return content

def generate_flashcards(content):
    content = rag.generate_rag(content,"FC")
    return content


def generate_summary(content):
    print("in gen sum")
    content = rag.generate_rag(content,"SUM")
    return content


 