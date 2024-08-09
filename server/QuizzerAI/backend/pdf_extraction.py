

from pdf2image import convert_from_path
import pytesseract 
from pytesseract import image_to_string
from PIL import Image
from dotenv import load_dotenv
import os
import fitz
import io
from paddleocr import PaddleOCR, draw_ocr
import easyocr

# Load environment variables from .env file


def extractText(file):
   
    doc = fitz.open(stream=file, filetype="pdf")

    text = ""
    for page_num in range(len(doc)):
        page = doc.load_page(page_num)  # load page
        d = page.get_text("dict")
        blocks = d["blocks"]
        imgblocks = [b for b in blocks if b["type"] == 1]
        if imgblocks:
            image = Image.open(io.BytesIO(imgblocks[0]["image"]))
            text += pytesseract.image_to_string(image)
        else:
            text += page.get_text()


    return text

      

        


