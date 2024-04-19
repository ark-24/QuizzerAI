import React, { useState, createContext, useContext } from "react";
import { ProSidebarProvider } from "react-pro-sidebar";
import CollapsibleSidebar from "./CollapsibleSidebar";

const SidebarContext = createContext({});

export const MyProSidebarProvider = ({ children }) => {
  console.log(children)
  const [sidebarBackgroundColor, setSidebarBackgroundColor] =
    useState(undefined);
  const [sidebarImage, setSidebarImage] = useState(undefined);
  return (
    <ProSidebarProvider>
      <SidebarContext.Provider
        value={{
          sidebarBackgroundColor,
          setSidebarBackgroundColor,

          sidebarImage,
          setSidebarImage,

        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",//sidebarRTL ? "row-reverse" : "row",
          }}
        >
          <CollapsibleSidebar />
          {children}
        </div>
      </SidebarContext.Provider>
    </ProSidebarProvider>
  );
};

export const useSidebarContext = () => useContext(SidebarContext);
