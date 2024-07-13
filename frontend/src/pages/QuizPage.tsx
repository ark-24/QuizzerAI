import React from 'react'


interface QuizProps {
    pdfUrl: string;
    quizId: string;
    quizType: string;
}

const QuizPage = ({}: QuizProps) => {
  return (
    <div>Quiz</div>
  )
}

export default QuizPage