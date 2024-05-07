import React from 'react'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FileUpload from '@/components/FileUpload';

const CreateQuiz = () => {
  return (
    <div className='h-full bg-green-200'>
        <div className='flex justify-center items-center h-screen'>
        <FormGroup>
      <FormControlLabel control={<Checkbox defaultChecked />} label="Flashcards" />
      <FormControlLabel required control={<Checkbox />} label="Multiple Choice Questions" />
      <FormControlLabel  control={<Checkbox />} label="Summary" />
      <div className='mt-8'>
        <FileUpload/>
      </div>
    </FormGroup>

      </div>
    </div>
  )
}

export default CreateQuiz