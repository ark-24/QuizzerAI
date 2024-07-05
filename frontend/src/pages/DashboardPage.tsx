import { UserButton, useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import type { UserResource } from '@clerk/types';
import SideBar from '@/components/SideBar';
import CreateQuiz from './CreateQuiz';

const DashboardPage = () => {

  const [currentUser, setcurrentUser] = useState<UserResource>();
  const [userEmail, setUserEmail] = useState<string>("");
  

  const { user } = useUser();

  console.log(currentUser)
  useEffect(()=> {
    if (user && user?.primaryEmailAddress?.emailAddress ) {
      setcurrentUser(user);
      setUserEmail(user.primaryEmailAddress.emailAddress)
    }
  }, [user]);

  useEffect(()=> {

    if (currentUser){
    const url = `http://127.0.0.1:8000/api/check-user?email=${encodeURIComponent(userEmail)}/`;

// Make a GET request to the endpoint
axios.get(url)
  .then(response => {
    console.log(response.data); // Handle the response data
    if(!response.data.exists)
    {
      const userData = {
        email: currentUser?.primaryEmailAddress?.emailAddress,
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        image_url: currentUser.imageUrl

      }
      const postUrl = "http://127.0.0.1:8000/api/users/"
      axios.post(postUrl, userData)
  .then(response => {
    // Handle successful response
    console.log('Response:', response.data);
  })
  .catch(error => {
    // Handle error
    console.error('Error:', error);
  });
    }
  })
  .catch(error => {
    console.error('There was a problem with the Axios request:', error); // Handle errors
  });
}
  },[currentUser, userEmail])

  return (
    <>
<div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-600">
        <SideBar />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <CreateQuiz userEmail={userEmail} />
      </div>

      {/* User Button */}
      <div className="absolute top-0 right-0">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
</>
  )
}

export default DashboardPage