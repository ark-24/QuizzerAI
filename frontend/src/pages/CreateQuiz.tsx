/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useContext, useEffect, useRef, useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUpload from '@/components/FileUpload';
import axios from 'axios';
import { Button } from '../components/ui/button';
import {Copy, Upload } from 'lucide-react';
import Radio from '@mui/material/Radio';
import { toast } from "react-hot-toast";
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from "@tanstack/react-query";
import { FormControl, FormLabel, InputAdornment,RadioGroup, TextField, alpha  } from '@mui/material';
import {  styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from 'react-router-dom';
import FormHelperText from '@mui/material/FormHelperText';
import { Pencil } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';



interface CreateQuizProps {
  userEmail: string;
}

const CreateQuiz = ({userEmail}: CreateQuizProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [quizType, setQuizType] = useState<string>('');
  const [title, setTitle] = useState<string>();
  const [helperText, setHelperText] = useState('');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuizType((event.target as HTMLInputElement).value);
    setError(false);
    
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

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
        title : title ? title : fileName
      }) .then(response => {
            toast.success("Quiz created!");
            console.log('Response:', response.data);
            navigate(`/quiz/${response.data.quizId}?type=${quizType}`)
          })
          .catch(error => {
            toast.error("Error Generating Quiz.");

            console.error('Error:', error);
          });
          
      return response;
    },
    onSuccess: (data) => {
        console.log("done ", data)
    }
  });
  
  const handleFileUpload = async () => {
    if (helperText === '') {
        setHelperText("Select a Quiz Type")
        setError(true)
    }
    if(uploadedFile) {
      setIsUploading(true);
      const data = await uploadToS3(uploadedFile);
        try {
          // const data = await uploadToS3(file);
          if (!data?.fileKey || !data.fileName) {
            toast.error("Something went wrong");
            return;
          }
          mutate(data, {
            onSuccess: (data) => {
              console.log(data);
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
    backgroundColor: 'rgba(39, 245, 200, 0.8)',
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
    // backgroundColor: '#e3f2fd',
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

  return (
     <div className='h-full' style={{
      backgroundImage: "url(/back.jpg)",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} 
    //style={{
    //   backgroundImage: "url(/background.jpg)",
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center',
    // }}>
    >
        <div className='flex justify-center items-center h-screen'>
    <FormGroup>
    <h2 className='text-5xl font-roboto mb-24'> Create A Quiz </h2>

   
            <div className="relative flex items-center max-w-2xl ">
    <Pencil className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform" />
      <Input
        placeholder="Title"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        className=" pl-8 border-black border ring-black ring-2"
      />
 </div>

  <div id="demo-controlled-radio-buttons-group" className='text-center mt-10 text-xl'>Quiz Type</div>
  <RadioGroup
  className='font-robotoSlab' 
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={quizType}
    sx={{
      fontSize: "xl",
      fontFamily: "inter, Times New Roman, serif"
    }}
    onChange={handleChange}
  >
    <div className='flex items-center relative mt-4'>
    <FormControlLabel value="Multiple Choice"  control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="" />
    <span className='font-lato text-lg ml-2'>Multiple Choice</span>
    </div>
    <div className='flex items-center relative mt-2'>
    <FormControlLabel value="Flashcards" sx={{ fontSize: "xl"}} control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />}/>} label="" />
    <span className='font-lato text-lg ml-2'>Flashcards</span>
    
    </div>
    <div className='flex items-center relative mt-2'>
    <FormControlLabel value="Summary"  sx={{ fontSize: "xl"}} control={<CustomRadio   icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} />} label="" />
    <span className='font-lato text-lg ml-2'>Summary</span>
    
    </div>

  </RadioGroup> 


   {/* <div className='flex justify-start'>
<RadioGroup className=" checked:scale-110"  >
  <div className="flex items-center space-x-2 my-4 text-lg font-inter ">
    <RadioGroupItem  className=" border-black "  value="option-one" id="option-one" />
    <Label className="text-xl" htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2 checked:bg-slate-500 font-ubuntu font-xl ">
    <RadioGroupItem className="border-black   " value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div> */}


{/* </div> */}
  {quizType === '' && (<FormHelperText error={error} className='text-red-400 flex text-center justify-center align-middle'>{helperText}</FormHelperText>)}
  <div className='mt-8 w-full'>
        <FileUpload isUploading={isUploading} isPending={isPending} onFileDrop={handleFileDrop}/>
      </div>
      <div className='flex bg-black justify-center mt-10 text-white font-bold transition-all hover:scale-110   rounded '>
        <Button onClick={handleFileUpload} className='items-center flex py-2 px-4'>
          Upload <Upload className='w-4 h-4 ml-2'/>
        </Button>
      </div>
      
</FormGroup>

      </div>
      {/* <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Share</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md text-white bg-black">
        <DialogHeader>
          <DialogTitle> Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 ">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue="https://ui.shadcn.com/docs/installation"
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
        <DialogClose asChild={true}>

          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog> */}
    </div>
  )
}

export default CreateQuiz