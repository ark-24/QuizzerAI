import json
from PyPDF2 import PdfReader
from django.shortcuts import render
from rest_framework.decorators import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, JsonResponse, HttpResponseNotFound
from rest_framework import viewsets
from api import serializers
import boto3
from dotenv import load_dotenv
from . import models
import os
import io
from backend.pdf_extraction import extractText
from backend.RAG import RAGSystem
from backend.createQuiz import generate_multiple_choice, generate_flashcards, generate_summary



load_dotenv()

class RegisterNewUser(APIView):
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")
        name = request.data.get(name)

        try: 
            user = User.objects.create_user(
                username=username,
                password="pass123",
                email=email,
                first_name = name,
            ) 
            user.save()
            print("{} created successfully".format(user.username))
            return Response({"message": "User created"})
        except:
            return Response({"message": "User creation failed or user already exists"})
        
class greeting(APIView):
    permission_classes = ( IsAuthenticated, ) 

    def get(self, request):
        content = {'message': f'Hello, {request.user.first_name}!'}
        return Response(content) 
    

@csrf_exempt
def handle_users(request):
    if request.method == "GET":
        users = list(models.User.objects.values())
        print(f"users: {users}")

        return JsonResponse(users, safe=False, status=200)
    elif request.method == "POST":
        user = request.body
        user_dict = json.loads(user)
        new_user = models.User(**user_dict)
        new_user.save()
        return JsonResponse(user_dict, status=200)
    else: 
        return HttpResponseNotFound("Sorry this method is not supported")
    
@csrf_exempt
def check_users(request):
    if request.method == "GET":
        email = request.GET.get("email")
        if email:
            user_exists = models.User.objects.filter(email=email).exists()
            return JsonResponse({"exists":user_exists})
        else:

            return JsonResponse({"error": "Email not provided"}, status=400)
    else: 
        return HttpResponseNotFound("Sorry this method is not supported")
    
def get_user_id(email):
        if email:
            user = models.User.objects.get(email=email)
            # return JsonResponse({"exists":user_exists})
            print(user.id)
        else:

            return JsonResponse({"error": "Email not provided"}, status=400)   
    
@csrf_exempt
def create_quiz(request):
    if request.method == "POST":
        print("in endpoint")
        reqBody = request.body
        data_dict = json.loads(reqBody)
        file_key = data_dict["fileKey"]
        file_name = data_dict["fileName"]
        quiz_type = data_dict["quizType"]
        user_email = data_dict["userEmail"]

        title = "test"
        user_id = get_user_id(user_email)

        if file_key:
            response = process_file_from_AWS(file_key)
            content = None
            print("in if")
            # return JsonResponse({"exists":user_exists})
            # return JsonResponse({"data": response})
            match quiz_type:
                case "Multiple Choice":
                    content = generate_multiple_choice(response)
                    print(content)
                
                case "Flashcards": 
                    content = generate_flashcards(response)
                    print(content)


                case "Summary":
                    print("in case sum")
                    content = generate_summary(response)
                    print(content)

            #if content is None:
             #   return JsonResponse({"error": "Error generating study document..."},status=500)
            quiz = request.body
            quiz_dict = json.loads(quiz)
            quiz_dict["content"] = content
            new_quiz = models.Quiz(**quiz_dict)
            new_quiz.save()
            return JsonResponse(quiz_dict, status=200)

    else: 
        return HttpResponseNotFound("Sorry this method is not supported")  
    


def process_file_from_AWS(file_key):

    s3 = boto3.client('s3',
                    aws_access_key_id= os.environ.get('AWS_ACCESS_KEY_ID'),
                    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
                    region_name='us-west-1')  # Replace with your region

    response = s3.get_object(Bucket=os.environ.get('AWS_BUCKET_NAME'), Key=file_key)
    pdf_content = response['Body'].read()
    # text = extractText(pdf_content)
    file_obj = io.BytesIO(pdf_content)

    extractedText = extractText(file_obj)
    # content = rag.generate_rag(extractedText)
    # print(f"text is {text}")
    '''
    bytes_buffer = io.BytesIO()
    s3.download_fileobj(Bucket=os.environ.get('AWS_BUCKET_NAME'), Key=file_key, Fileobj=bytes_buffer)
    byte_value = bytes_buffer.getvalue()
    str_value = byte_value.decode()
    print(str_value)
    '''
    return extractedText



class UserViewset(viewsets.ModelViewSet):
    serializer_class = serializers.UserSerializer
    queryset = models.User.objects.all()
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        # print(f"users: {serializer.data}")  # Print the serialized data
        users = serializer.data
        emails = []
        for pair in users:
            emails.append(pair["email"])
        print(emails)
        return Response(serializer.data)
    

class QuizViewset(viewsets.ModelViewSet):
    serializer = serializers.QuizSerializer
    queryset = models.Quiz.objects.all()
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)