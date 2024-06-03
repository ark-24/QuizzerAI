

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


'''
def extractText():
    load_dotenv()

    poppler = os.environ['POPPLER_PATH']

    images = convert_from_path("./server/test.pdf",poppler_path=poppler)
    final_text = ""

    for pg, image in enumerate(images):
        final_text += image_to_string(image)

    print(final_text)

'''
def extractText(file):
   
    doc = fitz.open(stream=file, filetype="pdf") #./server/MunchMart-BusinessPlan.pdf
    # pdfbytes = doc.convert_to_pdf()
    # pdf = fitz.open("pdf", pdfbytes)
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

            # print("-------------------------------------")

    return text

        # pix = page.get_pixmap(dpi=150)  # render page to an internal image format
    # now output as desired image file:
    # or using Pillow:
        # pix.pil_save() 

    # print(text)


        


