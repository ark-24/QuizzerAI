
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import LandingPage from "./pages/LandingPage"
import MainLayoutPage from "./pages/MainLayoutPage"
import DashboardPage from "./pages/DashboardPage"
import QuizPage from "./pages/QuizPage"

import { SignedIn } from '@clerk/clerk-react';
import Providers from "./components/Providers";
import SideBar from '@/components/SideBar';

// import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      {/* <Route
        path="/dashboard"
        element={
            <SignedIn>
             
      <div className="w-1000 bg-gray-600">

      <DashboardPage />
</div>
              </SignedIn>
              

        }
      /> */}
       <Route
            element={
              <SignedIn>
                <MainLayoutPage />
              </SignedIn>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="quiz/:id" element={<QuizPage />} />
            {/* Add other routes as needed */}
          </Route>

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