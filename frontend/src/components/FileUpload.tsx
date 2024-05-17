/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inbox, Loader2 } from 'lucide-react'
import React from 'react'
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {useDropzone} from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
const {getRootProps,  getInputProps} = useDropzone({
  accept: {"application/pdf": [".pdf"]},
  maxFiles: 1,
  /*onDrop: async (acceptedFiles) => {
    console.log(acceptedFiles)
    const file = acceptedFiles[0]
    if (file.size > 10 * 1024 * 1024)
    {
      alert('Please upload a file under 10 MB')
      return
    }
    try {
    const data = await uploadToS3(file);
      console.log("data: ", data);
      axios.post("http://127.0.0.1:8000/api/read-file/", data)
      .then(response => {
        // Handle successful response
        console.log('Response:', response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
      
    } catch (error) {
      console.log(error)
    }
  }*/

  onDrop: async (acceptedFiles) => {
    const file = acceptedFiles[0];
    console.log("file in comp: ", file);
    
    if (file && file.size <= 10 * 1024 * 1024) {
      onFileUpload(file);
    } else {
      alert('Please upload a file under 10 MB');
    }
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