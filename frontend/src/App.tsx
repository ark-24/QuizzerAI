import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
 
export default function App() {
  return (
    <header>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton  appearance={{
          elements: {
            userButtonBox: { position: 'absolute', top: '10px', right: '10px' },
          
          }

  }} />
      </SignedIn>
    </header>
  )
}