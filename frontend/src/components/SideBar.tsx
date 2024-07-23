/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react'
import { MessageCircle, PlusCircle } from "lucide-react";
import { Button } from './ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {getCurrentUserEmail} from '../lib/currentUser';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Link } from "react-router-dom";

const SideBar =  () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Array<any>>([]);
  const { user } = useUser();
  const location = useLocation();
  let quizId=""
  useEffect(()=> {
  if (location.pathname.includes("quiz")) {
    if(location.pathname.split("/quiz/"))
    {
      quizId = location.pathname.split("/quiz/")[1]
    }
    console.log(quizId)
  }
},[])
  const handleNewQuiz = () => {
    navigate(`/dashboard`)
  }


  useEffect(()=> {
    const getQuizzes = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
        const response = await axios.get(`http://127.0.0.1:8000/api/quizzes/${userEmail}`);
        setQuizzes(response.data);
        console.log(response.data);
        }
        else {
          console.log("Error: User Not Found");
          
        }

      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }
    getQuizzes();
  }, []);

  
    return (
  <div className="w-64 bg-slate-700 h-full overflow-y-auto">
    {/* Sidebar content goes here */}
    <Button className="w-full border-dashed flex justify-center items-center border-white border h-10" onClick={handleNewQuiz}>
      <PlusCircle className="w-4 h-4 mr-4" />
      New Chat
    </Button>

    <div className="flex flex-col gap-2 mt-4">
      {/* Render chat items here */}
      {/* Replace this with your chat item rendering logic */}
      {/* {chats.map((chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <div
            className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
              "bg-blue-600 text-white": chat.id === chatId,
              "hover:text-white": chat.id !== chatId,
            })}
          >
            <MessageCircle className="mr-2" />
            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
              {chat.pdfName}
            </p>
          </div>
        </Link>
      ))} */}
        {quizzes && quizzes.map((quiz: any, index:number) => (
          <Link key={index} to={`/quiz/${quiz.id}?type=${quiz.quizType}`}>
          <div key={index} className={cn("rounded-lg p-3 text-slate-300  border-red-500  flex items-center", {
            "bg-blue-600 text-white": quiz.id === quizId,
            "hover:text-white": quiz.id !== quizId,
          })}>
            {quiz.title}
          </div>
          </Link>
        ))}

    </div>
  </div>
    );
}

export default SideBar