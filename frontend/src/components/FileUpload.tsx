/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inbox } from 'lucide-react'
import {useDropzone} from 'react-dropzone';
import { Loader2 } from 'lucide-react';

interface FileUploadProps {
  isPending: boolean;
  isUploading: boolean;
  onFileDrop: (file: File) => void;
}

const FileUpload = ({ isUploading, isPending, onFileDrop }: FileUploadProps) => {

const {getRootProps,  getInputProps} = useDropzone({
  accept: {"application/pdf": [".pdf"]},
  maxFiles: 1,
  onDrop: async (acceptedFiles) => {
    console.log(acceptedFiles)
    const file = acceptedFiles[0]
    if (file.size > 10 * 1024 * 1024)
    {
      alert('Please upload a file under 10 MB')
      return
    }
    onFileDrop(file)
  }

});

  return (
    <div className="p-2 bg-white rounded-xl">
      <div {...getRootProps({
        className: 'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col'
      })}>
        <input {...getInputProps()}/>
        { isPending || isUploading? (
        <>
        <Loader2 className='h-10 w-10 text-green-300 animate-spin'/>
        <p className='text-sm text-slate-500 mt-2'> Creating Study Guide...</p>
        </>
        ) : (
        
        <>
          <Inbox className='w-10 h-10 text-green-500'/>
          <p className='mt-2 text-sm text-slate-400'> Drop PDF Here</p>
        </>)
}
      </div>
  </div>
  )
}

export default FileUpload