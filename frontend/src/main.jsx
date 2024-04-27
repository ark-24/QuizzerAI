import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import { GoogleOAuthProvider } from '@react-oauth/google';
import { ClerkProvider } from '@clerk/clerk-react'


// const AUTH_KEY = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY



ReactDOM.createRoot(document.getElementById('root')).render(
  // <GoogleOAuthProvider clientId={AUTH_KEY}>
  <ClerkProvider publishableKey={clerkPubKey}>
  <App />
</ClerkProvider>,
  // </GoogleOAuthProvider>
);
