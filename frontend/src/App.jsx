
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LandingPage from "./pages/LandingPage"
import DashboardPage from "./pages/DashboardPage"
import { SignedIn } from '@clerk/clerk-react';
import Providers from "./components/Providers";

// import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
            <SignedIn>
              <DashboardPage />
              </SignedIn>
              

        }
      />

    </>
  )
);

function App() {
  return (
    <>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </>
  );
}

export default App;