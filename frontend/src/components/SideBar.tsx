/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { createContext, useEffect, useRef, useState } from 'react'
import { MessageCircle, PlusCircle, CircleDot, SquareCheck, RectangleEllipsis, ScrollText, Calendar, CreditCard, WalletCards    } from "lucide-react";
import { Button } from './ui/button';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {getCurrentUserEmail, getCurrentUserObj} from '../lib/currentUser';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator"
import Divider from '@mui/material/Divider';
import {Stripe, loadStripe} from '@stripe/stripe-js';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const SideBar =  () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Array<any>>([]);
  const { user } = useUser();
  const location = useLocation();
  const [quizId, setQuizId] = useState<string>("");
  // const [stripeObj, setStripeObj] = useState<any>(null); 'Promise<Stripe|null> | null'
  const userEmail = getCurrentUserEmail();
  const userObj = getCurrentUserObj();
  const quizCount = useRef(0)
  console.log(userObj);
  const QuizContext = createContext<Number>(0);

  useEffect(()=> {
  if (location.pathname.includes("quiz")) {
    if(location.pathname.split("/quiz/"))
    {
      setQuizId(location.pathname.split("/quiz/")[1])
    }
    console.log(quizId)
  }
},[location])

useEffect(() => {

  const configStripe = async () => {
  try {
  const response = await axios.get("http://127.0.0.1:8000/api/config-stripe/")
  console.log(response.data);

  

// Initialize Stripe.js
  const stripe = loadStripe(response.data.publicKey);
  // setStripeObj(stripe)
  console.log(stripe);
    }
    catch (error) {
      console.error("Error fetching quiz:", error);
    }
}
  configStripe();

},[])

  const handleNewQuiz = () => {
    navigate(`/dashboard`)
  }

  const handleSubscriptions = async () => {
    try {
      const response = await axios.patch(`http://127.0.0.1:8000/api/create-subscription/`,{email:userEmail})
      console.log(response.data);
    
      // return stripeObj.redirectToCheckout({sessionId: response.data.sessionId})
      window.location = response.data.url
        }
        catch (error) {
          console.error("Error fetching quiz:", error);
        }
  }

  useEffect(()=> {
    const getQuizzes = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
        const response = await axios.get(`http://127.0.0.1:8000/api/quizzes/${userEmail}`);
        setQuizzes(response.data);
        quizCount.current = response.data.length
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

    return () => {
      setQuizId("")
    }
  }, [location]);

  
    return (
      <QuizContext.Provider value={quizCount.current}>
  <div className="w-64 bg-slate-600 h-full overflow-y-auto soff p-4">
    {/* Sidebar content goes here */}
    <Button className="w-full border-dashed flex rounded-lg justify-center items-center hover:bg-slate-800 text-white font-ubuntu border-white border h-10" onClick={handleNewQuiz}>
      <PlusCircle className="w-4 h-4 mr-4 " />
      New Quiz
    </Button>

    <div className="flex flex-col gap-2 mt-4">
        {quizzes && quizzes.map((quiz: any, index:number) => (
          <Link key={index} to={`/quiz/${quiz.id}?type=${quiz.quizType}`}>
          <div key={index} className={cn("rounded-lg p-3 group  text-slate-300 flex items-center font-lato hover:bg-slate-100 ", {
            "bg-teal-600 text-red": quiz.id === quizId,
            "hover:text-white": quiz.id !== quizId,
          })}>
            <div className='flex justify-start items-start'>
            { quiz.quizType === "Multiple Choice" && (<div className='group-hover:text-black'><SquareCheck/> </div> )}
            { quiz.quizType === "Flashcards" && (<div className='group-hover:text-black'><RectangleEllipsis/></div> )}
            { quiz.quizType === "Summary" && (<div className='group-hover:text-black'><ScrollText/></div> )}
            </div>
            <div className=' flex justify-center items-center align-middle ml-4 group-hover:text-black'>{quiz.title} </div>
            
          </div>
          </Link>
    ))}
<div className=' bottom-0 h-16 object-bottom fixed'>
  <Separator className="w-full bottom-2 h-px bg-slate-500 " />
  <DropdownMenu>
      <DropdownMenuTrigger asChild>
<Button className=" border p-4 bg-gradient-to-r from-teal-500 to-cyan-500 flex rounded-lg hover:border-green-800 mt-2 justify-center align-middle bottom-0 items-center hover:bg-slate-800  text-white font-ubuntu border-white  h-10" >
      <WalletCards className="w-4 h-4 mr-4 " />
      Manage Subscription
    </Button>
    </DropdownMenuTrigger>

    {/* <DropdownMenuContent className="w-56">
    <DropdownMenuItem className='bg-white'>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>One-Time</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='bg-white mt-2'>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>1 Month</span>
          </DropdownMenuItem>
    </DropdownMenuContent> */}

<DropdownMenuContent className="w-56 bg-white">
        {/* <DropdownMenuLabel>Appearance</DropdownMenuLabel> */}
        {/* <DropdownMenuSeparator /> */}
        <DropdownMenuItem className='bg-white hover:bg-gray-200' onClick={() => handleSubscriptions()}>
             <CreditCard className="mr-2 h-4 w-4" /> 
            <span>One-Time</span>
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator className='bg-black'/>
          <DropdownMenuItem className='bg-white hover:bg-gray-200' onClick={() => handleSubscriptions("One-Month")}>
            <Calendar className="mr-2 h-4 w-4" /> 
            <span>1 Month</span>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
  </DropdownMenu>
    </div>
    </div>

  </div>
  </QuizContext.Provider>
    );
}

export default SideBar