/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { MessageCircle, PlusCircle } from "lucide-react";
import { Button } from './ui/button';

const SideBar = () => {

    return (
  <div className="w-64 bg-slate-700 h-full overflow-y-auto">
    {/* Sidebar content goes here */}
    <Button className="w-full border-dashed flex justify-center items-center border-white border h-10">
      <PlusCircle className="w-4 h-4 mr-4" />
      New Chat
    </Button>

    <div className="flex flex-col gap-2 mt-4">
      {/* Render chat items here */}
      {/* Replace this with your chat item rendering logic */}
      {/* {chats.map((chat) => (
        <Link key={chat.id} href={`/chat/${chat.id}`}>
          <div
            className={cn("rounded-lg p-3 text-slate-300 flex items-center", {
              "bg-blue-600 text-white": chat.id === chatId,
              "hover:text-white": chat.id !== chatId,
            })}
          >
            <MessageCircle className="mr-2" />
            <p className="w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis">
              {chat.pdfName}
            </p>
          </div>
        </Link>
      ))} */}
    </div>
  </div>
    );
}

export default SideBar