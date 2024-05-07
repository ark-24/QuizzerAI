/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {useDropzone} from 'react-dropzone';


const FileUpload = () => {
const {getRootProps,  getInputProps} = useDropzone({
  accept: {"application/pdf": [".pdf"]},
  maxFiles: 1,
  onDrop: (acceptedFiles) => {
    console.log(acceptedFiles)
  }
});
  return (
    <div className="p-2 bg-white rounded-xl">
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()}/>
        <>
          <Inbox className='w-10 h-10 text-green-500'/>
          <p className='mt-2 text-sm text-slate-400'> Drop PDF Here</p>
        </>
      </div>
  </div>
  )
}

export default FileUpload