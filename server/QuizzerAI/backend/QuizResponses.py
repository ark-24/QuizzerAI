class MultipleChoice:
    options: list[str]
    question: str
    correct_answer: str

class Card:
    id: int
    backHTML: str
    frontHTML: str

class Flashcard:
    cards: list[Card]
    
class Summary:
    Base: str