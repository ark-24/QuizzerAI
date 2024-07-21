import { useUser } from "@clerk/clerk-react";


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
