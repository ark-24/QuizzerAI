import React, { useState } from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUpload from '@/components/FileUpload';
import { Button } from '../components/ui/button';
import { Upload } from 'lucide-react';
// import axios from 'axios';

const CreateQuiz = () => {

  const [uploadedFile, setUploadedFile] = useState<File|null>(null);
  const [checkbox, setCheckbox] = useState({
    flashCards: false,
    multiChoice: false,
    summary: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCheckbox({
      ...checkbox,
      [event.target.name]: event.target.checked,
    });
  };

  const { flashCards, multiChoice, summary  } = checkbox;

  
  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    const formData = new FormData();
    formData.append('file', file);
    /*axios.post("http://127.0.0.1:8000/api/read-file/", formData)
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });*/
      console.log(uploadedFile);
      
  };

  const handleSubmit = () => {
    console.log(`Values are ${flashCards}, ${multiChoice}, ${summary}`)

  }
  return (
    <div className='h-full bg-green-200'>
        <div className='flex justify-center items-center h-screen'>
        <FormGroup>
      <FormControlLabel control={<Checkbox checked={flashCards} onChange={handleChange} name="flashCards"/>} label="Flashcards" />
      <FormControlLabel required control={<Checkbox checked={multiChoice} onChange={handleChange} name="multiChoice"/>} label="Multiple Choice Questions" />
      <FormControlLabel  control={<Checkbox checked={summary} onChange={handleChange} name="summary"/>} label="Summary" />
      <div className='mt-8'>
        <FileUpload onFileUpload={handleFileUpload}/>
      </div>
      <div className='flex bg-black justify-center mt-10 text-white font-bold  rounded '>
        <Button onClick={handleSubmit} className='items-center flex py-2 px-4'>
          Upload <Upload className='w-4 h-4 ml-2'/>
        </Button>
      </div>
    </FormGroup>

      </div>
    </div>
  )
}

export default CreateQuiz