"""
URL configuration for QuizzerAI project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from api import views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter


from . import views

router = DefaultRouter()
router.register('users', views.UserViewset)

urlpatterns = [
    path('admin/', admin.site.urls),
    path("hello/", views.greeting.as_view(),name="greeting"),
    path("register/", views.RegisterNewUser.as_view(),name="register"),
    path("login/", obtain_auth_token,name="create_token"),
    path("check-user/", views.check_users,name="check-user"),
    path("get-quiz/", views.get_quiz,name="get-quiz"),
    path('quiz/<uuid:quiz_id>/', views.QuizDetailView.as_view(), name='quiz-detail'),   
    path('quizzes/<str:email>/', views.QuizListView.as_view(), name='quizzes'),   
    # path("read-file/", views.get_file_from_AWS,name="get-file-from-AWS"),
    path("create-quiz/", views.create_quiz,name="create-quiz"),



    path('', include(router.urls)),

]
