

from pdf2image import convert_from_path
from pytesseract import image_to_string
from PIL import Image
from dotenv import load_dotenv
import os

# Load environment variables from .env file



def extractText():
    load_dotenv()

    poppler = os.environ['POPPLER_PATH']

    images = convert_from_path("./backend/dsp.pdf",poppler_path=poppler)
    final_text = ""

    for pg, image in enumerate(images):
        final_text += image_to_string(image)

    return final_text
        


