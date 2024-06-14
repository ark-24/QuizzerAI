/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
// import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton, useUser } from '@clerk/clerk-react'
import {Button} from "@/components/ui/button" 
import { LogIn } from 'lucide-react'

const LandingPage = () => {
  // const { loggedIn, email } = props
  // //const navigate = useNavigate()

  // const onButtonClick = () => {
  //   // You'll update this function later
  // }
   
  //const { user } = useUser()
 


    return (
<>
      <div className="w-screen min-h-screen bg-gradient-to-r from-gray-700 to-teal-200">

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
        <div className='mt-10 mb-10'>
              <img src="/QAI--.png"></img>

            </div>
          <div className="flex items-center">
           
            <h1 className="mr-3 text-5xl font-semibold">Chat with any PDF</h1>
          </div>

         

          <p className="max-w-xl mt-1 text-lg text-slate-600">
            Join millions of students, researchers and professionals to instantly
            answer questions and understand research with AI
          </p>
          <div className="mt-20">
          <SignedOut>
        <SignInButton afterSignInUrl='/dashboard'>
        <Button className="bg-black text-white font-bold py-2 px-4 rounded flex items-center"> Log in <LogIn className='w-4 h-4 ml-2'/> </Button>
        </SignInButton>

      </SignedOut>
      <SignedIn>
        {/* <SignInButton afterSignInUrl='/dashboard'> */}
        {/* <Button onClick={goToDashboard} className="bg-black text-white font-bold py-2 px-4 rounded flex items-center"> Go To Chats <LogIn className='w-4 h-4 ml-2'/> </Button> */}
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