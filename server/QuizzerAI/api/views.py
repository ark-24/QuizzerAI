import json
from PyPDF2 import PdfReader
from django.shortcuts import redirect, render
from numpy import generic
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
from rest_framework import generics 
import stripe

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

class QuizDetailView(generics.RetrieveAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer
    lookup_field = 'id'

    def get_object(self):
        quiz_id = self.kwargs.get('quiz_id')
        return generics.get_object_or_404(models.Quiz, id=quiz_id)
    
class QuizListView(generics.ListAPIView):
    queryset = models.Quiz.objects.all()
    serializer_class = serializers.QuizSerializer

    def get_queryset(self):
        email = self.kwargs.get('email')
        userId = get_user_id(email)
        print("userId: " + str(userId))
        return models.Quiz.objects.filter(user=userId)
    
    
        
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
            return user.id
            # return JsonResponse({"exists":user_exists})
        else:

            return JsonResponse({"error": "Email not provided"}, status=400)   

@csrf_exempt
def get_quiz(request):
    if request.method == "GET":
        id = request.GET.get("id")
        if id:
            quiz = models.Quiz.objects.get(id=id)
            return JsonResponse({ quiz }, status=200)
        else:
            return JsonResponse({"error": "Email not provided"}, status=400)  
    else: 
        return HttpResponseNotFound("Sorry this method is not supported") 


@csrf_exempt
def stripe_config(request):
    if request.method == 'GET':
        stripe_config = {'publicKey': os.environ.get('STRIPE_PUBLISHABLE_KEY')}
        return JsonResponse(stripe_config, safe=False)
    

class CreateCheckoutSessionView(APIView):
    def get(self, request, payType, *args, **kwargs):
    # if request.method == 'GET':
        session = None

        stripe.api_key = os.environ.get('STRIPE_SECRET_KEY')
        # pay_type = request.GET.get("payType")
        if payType == "One-Month":
            lineItems = [{
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                            'name': 'One-Month Subscription',
                            },
                            'unit_amount': 2000,
                        },
                        'quantity': 1,
                        }]
                           
        else:
            lineItems = [{
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                            'name': 'One-Time Subscription',
                            },
                            'unit_amount': 100,
                        },
                        'quantity': 1,
                        }
                        ]
        session = stripe.checkout.Session.create(
                        line_items=lineItems,
                        mode='payment',
                        success_url='http://127.0.0.1:5173/dashboard',
                        cancel_url='http://127.0.0.1:5173/dashboard',
                        
                    )


        return Response({"url": session.url}, status=200)


@csrf_exempt
def create_quiz(request):
    if request.method == "POST":
        reqBody = request.body
        data_dict = json.loads(reqBody)
        file_key = data_dict["fileKey"]
        file_name = data_dict["fileName"]
        quiz_type = data_dict["quizType"]
        user_email = data_dict["userEmail"]
        title = data_dict["title"]

        user_id = get_user_id(user_email)

        if file_key:
            response = process_file_from_AWS(file_key)
            content = None
            match quiz_type:
                case "Multiple Choice":
                    try:
                        content = generate_multiple_choice(response)
                    except:
                        return JsonResponse({"error": "Error Generating Study Document"},status=500)
                
                case "Flashcards": 
                    try:
                        content = generate_flashcards(response)
                    except:
                        return JsonResponse({"error": "Error Generating Study Document"},status=500)

                case "Summary":
                    try:
                        content = generate_summary(response)
                    except:
                        return JsonResponse({"error": "Error Generating Study Document"},status=500)


            if content is None:
               return JsonResponse({"error": "Error generating study document..."},status=500)
            quiz = request.body
            quiz_dict = json.loads(quiz)
            new_quiz = models.Quiz(fileKey=file_key, fileName=file_name, user_id=user_id, quizType=quiz_type, content=content, title=title)
            new_quiz.save()
            return JsonResponse({"quizId": new_quiz.id}, status=200)

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