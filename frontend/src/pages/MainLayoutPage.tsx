// MainLayout.tsx
import React, { createContext, useContext  } from 'react';
import SideBar from '@/components/SideBar';
import { Outlet } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';



const MainLayoutPage = () => {
  
  


  return (
    <div className="flex h-screen">
      <div className="w-64 bg-stone-300 rounded-lg">
        <SideBar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
      <div className="absolute top-0 right-0 p-2">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}

export default MainLayoutPage;
