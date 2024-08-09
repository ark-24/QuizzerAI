/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import {Button} from "@/components/ui/button" 
import { LogIn } from 'lucide-react'
import Divider from '@mui/material/Divider';
import { Separator } from "@/components/ui/separator"
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  // const { loggedIn, email } = props
  const navigate = useNavigate()

  // const onButtonClick = () => {
  //   // You'll update this function later
  // }
   
  //const { user } = useUser()
  const [stepData, setStepData] = useState<string>("Select a preferred study guide format from multiple choice questions, flashcards, or a summary. Then, proceed to upload a PDF document containing your notes for further processing.");

  const handleStepClick = (id:number) => {
    switch (id) {
      case 1:
        setStepData("Select a preferred study guide format from multiple choice questions, flashcards, or a summary. Then, proceed to upload a PDF document containing your notes for further processing.");
        return;
      case 2:
        setStepData("Allow our cutting-edge AI to handle the heavy lifting, providing you with accurate and efficient assistance tailored to your needs.")
        return;

      case 3:
        setStepData("Engage with the generated study materials to thoroughly prepare and excel in your exams!")
        return;

      default:
        setStepData("Create you quize of choice and upload pdf")
        return;


    }

  }


    return (
<>
      <div className="w-screen min-h-screen bg-gradient-to-r from-gray-600 to-teal-200 " style={{
            backgroundImage: "url(/Qr.jpg)",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
        <div className='mt-10 mb-10'>
              <img src="/QAI--.png"></img>

            </div>
          <div className="flex items-center">
           
            <h1 className="mr-3 text-4xl font-semibold font-lato">Improve Your Studying with AI</h1>
          </div>

         

          <p className="max-w-xl mt-4 text-lg font-mono text-black">
            Join our growing community of students, researchers and professionals to sharpen your understanding with AI!
          </p>
          <div className='flex justify-center mt-10'>
            <h1 className='text-3xl font-lato'> How Does it Work? </h1>
          </div>

            <div className='flex flex-row items-center relative space-x-4 mt-10 '>
            <div className='flex flex-col  top-0 mr-10 '>
              <Button id="1" onClick={()=>handleStepClick(1)} className='border-black rounded bg-gray-300 relative font-inter px-2 py-2 mr-4 text-stone-600 hover:bg-teal-300'> Step 1: Create A Quiz</Button>
              <Button id="2" onClick={()=>handleStepClick(2)} className='border-black rounded bg-gray-300 relative font-inter px-2 py-2 mr-4 text-stone-600 hover:bg-teal-300 mt-4'> Step 2: AI Does its Magic </Button>
              <Button id="3" onClick={()=>handleStepClick(3)} className='border-black rounded bg-gray-300 relative font-inter px-2 py-2 mr-4 text-stone-600 hover:bg-teal-300 mt-4'> Step 3: Study and Improve!</Button>

            </div>
            {/* <Separator orientation="vertical" className='ml-2 mr-2 mx-4 ' /> */}
            {/* <> */}

            <div className=' justify-center  items-center w-[300px] '>
            {/* <TransitionGroup>
             <CSSTransition
                key={1}
                timeout={500}
                classNames="fade"
              > */}
                <div className='text-black '>{stepData}</div> {/* Ensured the text is centered */}
              {/* </CSSTransition>
            </TransitionGroup> */}
      </div>
    {/* </> */}


            </div>

          <div className="mt-20">
          <SignedOut>
        <SignInButton afterSignInUrl='/dashboard'>
        <Button className="bg-black text-white font-bold py-2 px-4 rounded flex items-center"> Log in <LogIn className='w-4 h-4 ml-2'/> </Button>
        </SignInButton>

      </SignedOut>
      <SignedIn>
        {/* <SignInButton afterSignInUrl='/dashboard'>  */}
        <Button onClick={()=> navigate(`/dashboard`)} className="bg-black text-white font-bold py-2 px-4 rounded flex items-center"> Go To Quizzes <LogIn className='w-4 h-4 ml-2'/> </Button>
        {/* </SignInButton> */}

      </SignedIn>
      </div>
        </div>
      </div>
    </div>
    </>

    

      /* The children of the SignedIn component are rendered only when the user is signed in. In this case, the app will render the SignOutButton */
      /*<SignedIn>
        <SignOutButton>
        <Button> Log out</Button>

        </SignOutButton>
      </SignedIn>*/

      /* You can also check if a user is logged in or not using the 'user' object from the useUser hook. In this case, a non-undefined user object will render the user's email on the page */
    )
}

export default LandingPage