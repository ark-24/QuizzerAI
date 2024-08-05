import { useUser } from "@clerk/clerk-react";
import axios from "axios";


export function getCurrentUserEmail() {
  

  const { user } = useUser();
  try {
    const email = user?.primaryEmailAddress?.emailAddress;
    return email;
  } catch (error) {
    console.log(error);
    return undefined;
  }

}


export async function getCurrentUserObj() {
  

  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress
  if (userEmail) {
  try {
    const url = `http://127.0.0.1:8000/api/get-user?email=${encodeURIComponent(userEmail)}`;

// Make a GET request to the endpoint
    axios.get(url)
      .then(response => {
        console.log(response.data); // Handle the response data
        return response.data
      }
        )
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  } catch(error) {
    console.log("Error ", error)
    }

  }
}
