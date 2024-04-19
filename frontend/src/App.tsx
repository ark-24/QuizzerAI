

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
// @ts-expect-error test
import {MyProSidebarProvider} from './components/sidebarContext.jsx';
import NewPage from "./components/NewPage.js";
 
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
<div style={{ display: 'flex', flexDirection: 'row' }}>
    <MyProSidebarProvider/>
  <NewPage/>
  </div>
      </SignedIn>
    </header>
  )
}