from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access environment variables
api_key = os.environ['OPENAI_API_KEY']

client = OpenAI(
    # This is the default and can be omitted
    api_key=api_key,
)

response = client.chat.completions.create(
     model="gpt-3.5-turbo",
     messages=[{"role": "user", "content":"Hi how are you"}]
)

print(response.choices[0].message.content.strip())
