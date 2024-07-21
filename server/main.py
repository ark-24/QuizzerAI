from openai import OpenAI
import os
from dotenv import load_dotenv
from server.QuizzerAI.backend.pdf_extraction import extractText

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.environ['OPENAI_API_KEY']

client = OpenAI(
    # This is the default and can be omitted
    api_key=api_key,
)

notes = extractText()

response = client.chat.completions.create(
     model="gpt-3.5-turbo",
     messages=[{"role": "user", "content": f"Given the following data extracted from notes. Generate 10 multiple choice questions that can be used to study. Return the data in strict json format (no comments) with the labelled question and answers with the '(correct)' around the right answer. Here is the data: {notes}"}]
)

print(response.choices[0].message.content.strip())
