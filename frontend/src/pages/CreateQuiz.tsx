/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUpload from '@/components/FileUpload';
import axios from 'axios';
import { Button } from '../components/ui/button';
import {Upload } from 'lucide-react';
import Radio from '@mui/material/Radio';
import { toast } from "react-hot-toast";
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from "@tanstack/react-query";
import { FormControl, FormLabel, InputAdornment, RadioGroup, TextField, alpha  } from '@mui/material';
import {  styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CreateIcon from '@mui/icons-material/Create';

interface QuizProps {
  userEmail: string;
}
// import { useNavigate  } from 'react-router-dom';
// import axios from 'axios';

const CreateQuiz = ({userEmail}: QuizProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [quizType, setQuizType] = useState<string>('');
  const [title, setTitle] = useState<string>();




  // const navigate = useNavigate();

  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setCheckbox({
  //     ...checkbox,
  //     [event.target.name]: event.target.checked,
  //   });
  // };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuizType((event.target as HTMLInputElement).value);
    

  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  // const { flashCards, multiChoice, summary  } = checkbox;



  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      fileKey,
      fileName,
    }: {
      fileKey: string;
      fileName: string;
    }) => {
      const response = await axios.post("http://127.0.0.1:8000/api/create-quiz/", {
        fileKey,
        fileName,
        quizType,
        userEmail,
        title
      }) .then(response => {
            console.log('Response:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
          });
      return response;
    }
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
          if (!data?.fileKey || !data.fileName) {
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
  const CustomRadio = styled(Radio)(({ theme }) => ({
     color: 'black',
  '&.Mui-checked': {
    // color: '#1E88E5',
    // transition: 'color 0.3s ease-in-out',
    background: 'linear-gradient(45deg, #000000 30%, #42a5f5 90%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  '&:hover': {
    backgroundColor: 'rgba(30, 136, 229, 0.15)',
  },
  '& .MuiSvgIcon-root': {
    transition: 'transform 0.3s ease-in-out, color 0.3s ease-in-out',
    fontSize: '1.5rem',
  },
  '&:hover .MuiSvgIcon-root': {
    transform: 'scale(1.2)',
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: '#000000',
    borderRadius: '50%',
    backgroundColor: '#e3f2fd',
    padding: '4px',
  },
  '& .MuiTouchRipple-root': {
    color: '#000000',
  },
  '&:focus-visible': {
    outline: '2px solid #000000',
    outlineOffset: '2px',
    boxShadow: '0 0 10px rgba(30, 136, 229, 0.5)',
  },
    
  }));

  // const handleSubmit = () => {
  //   console.log(`Values are ${flashCards}, ${multiChoice}, ${summary}`)

  // }
  return (
    <div className='h-full bg-green-200'>
        <div className='flex justify-center items-center h-screen'>
        {/* <FormGroup>
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
    </FormGroup> */}
    <FormGroup className=''>
    {/* <FormControl> */}
    <TextField
        id="input-with-icon-textfield"
        label="Title"
        onChange={handleTitleChange}
        inputRef={inputTextRef}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <CreateIcon />
            </InputAdornment>
          ),
        }}
        variant="standard"
      />

  <FormLabel id="demo-controlled-radio-buttons-group" className='text-center mt-10'>Quiz Type</FormLabel>
  <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={quizType}
    onChange={handleChange}
  >
    <FormControlLabel value="Multiple Choice" control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Multiple Choice" />
    <FormControlLabel value="Flashcards" control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />}/>} label="Flashcards" />
    <FormControlLabel value="Summary" control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="Summary" />

  </RadioGroup>
  <div className='mt-8 w-full'>
        <FileUpload isUploading={isUploading} isPending={isPending} onFileDrop={handleFileDrop}/>
      </div>
      <div className='flex bg-black justify-center mt-10 text-white font-bold  rounded '>
        <Button onClick={handleFileUpload} className='items-center flex py-2 px-4'>
          Upload <Upload className='w-4 h-4 ml-2'/>
        </Button>
      </div>
{/* </FormControl> */}
</FormGroup>


      </div>
    </div>
  )
}

export default CreateQuiz