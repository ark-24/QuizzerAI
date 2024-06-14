import React, { useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUpload from '@/components/FileUpload';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from "react-hot-toast";
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from "@tanstack/react-query";
// import { useNavigate  } from 'react-router-dom';
// import axios from 'axios';

const CreateQuiz = () => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [checkbox, setCheckbox] = useState({
    flashCards: false,
    multiChoice: false,
    summary: false,
  });
  // const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox({
      ...checkbox,
      [event.target.name]: event.target.checked,
    });
  };

  const { flashCards, multiChoice, summary  } = checkbox;



  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("http://127.0.0.1:8000/api/create-quiz/", {
        file_key,
        file_name,
        checkbox
      }) .then(response => {
            console.log('Response:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      return response;
    },
  });


  
  const handleFileUpload = async () => {
    if(uploadedFile) {
      setIsUploading(true);
      const data = await uploadToS3(uploadedFile);
      // axios.post("http://127.0.0.1:8000/api/read-file/", data)
      //   .then(response => {
      //     console.log('Response:', response.data);
      //   })
      //   .catch(error => {
      //     console.error('Error:', error);
      //   });
        try {
          // const data = await uploadToS3(file);
          if (!data?.file_key || !data.file_name) {
            toast.error("Something went wrong");
            return;
          }
          mutate(data, {
            onSuccess: () => {
              toast.success("Chat created!");
              // navigate(`/chat/${chat_id}`);
            },
            onError: (err) => {
              toast.error("Error creating chat");
              console.error(err);
            },
          });
        } catch (error) {
          console.log(error);
        } finally {
          setIsUploading(false);
        }
    }
      
  };

  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
      
  };

  // const handleSubmit = () => {
  //   console.log(`Values are ${flashCards}, ${multiChoice}, ${summary}`)

  // }
  return (
    <div className='h-full bg-green-200'>
        <div className='flex justify-center items-center h-screen'>
        <FormGroup>
      <FormControlLabel control={<Checkbox checked={flashCards} onChange={handleChange} name="flashCards"/>} label="Flashcards" />
      <FormControlLabel required control={<Checkbox checked={multiChoice} onChange={handleChange} name="multiChoice"/>} label="Multiple Choice Questions" />
      <FormControlLabel  control={<Checkbox checked={summary} onChange={handleChange} name="summary"/>} label="Summary" />
      <div className='mt-8'>
        <FileUpload isUploading={isUploading} isPending={isPending} onFileDrop={handleFileDrop}/>
      </div>
      <div className='flex bg-black justify-center mt-10 text-white font-bold  rounded '>
        <Button onClick={handleFileUpload} className='items-center flex py-2 px-4'>
          Upload <Upload className='w-4 h-4 ml-2'/>
        </Button>
      </div>
    </FormGroup>

      </div>
    </div>
  )
}

export default CreateQuiz