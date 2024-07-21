import PDFViewer from '@/components/PDFViewer';
import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom';
import { getS3Url } from '@/lib/s3';
import Flashcards from '@/components/Flashcards';
import MultipleChoiceCard from '@/components/MultipleChoiceCard';
import Carousel from 'react-bootstrap/Carousel';
import type { CarouselRef } from 'react-bootstrap/Carousel';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import '../styles/QuizPage.css';

interface QuizProps {
    pdfUrl: string;
    quizId: string;
    quizType: string;
}

interface MCType {
  content : Array<{questions: Array<object>}>;
  createdAt : string;
  fileKey : string;
  fileName : string;
  id : string;
  quizType : string;  
  title : string;
  user : string;
}

interface FCType {
  content : Array<{cards: Array<object>}>;
  createdAt : string;
  fileKey : string;
  fileName : string;
  id : string;
  quizType : string;  
  title : string;
  user : string;
}

const QuizPage = ({}: QuizProps) => {
  const {id} = useParams();
  const [params] = useSearchParams();
  const [quizData, setQuizData] = useState<any>();
  const [fileKey, setFileKey] = useState<string>();
  const quizType = params.get('type');
  const [currIndex, setCurrIndex] = useState<number>(1);
  const currentQ = useRef<any>(quizData?.content?.questions[1]);
  const score = useRef<number>(0);

  useEffect(()=> {
    const getQuiz = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/quiz/${id}`);
        setQuizData(response.data);
        setFileKey(response.data.fileKey);
        currentQ.current = response.data?.content?.questions[0]

      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    }
    getQuiz();
  }, [id]);

  if (!quizData) {
    return (<div>Loading...</div>);
  }

  const handleMCScore = (isCorrect: boolean) => {
    if (isCorrect) {
      score.current = score.current + 1

    }
  }

  const handleNextQuestion = () => {
    // if (carouselRef.current) {
    //   // Move to the next slide
    //   carouselRef.current.next();
    //   console.log(carouselRef.current);
    // }
    setCurrIndex((prevIndex) => (prevIndex + 1) % quizData.content.questions.length);
    console.log((currIndex));
    
    currentQ.current = quizData?.content?.questions[currIndex];
    console.log(currentQ.current?.correct_answer)

  };

  return (
    <div className='flex h-screen'>
      <div className='w-5/12'>
        <PDFViewer pdf_url={fileKey ? getS3Url(fileKey) : ""}/>
      </div>
      <div className='w-7/12 bg-green-400'>
        { quizType === "Multiple Choice" && (
          <>
          <div className="flex flex-col justify-center items-center h-screen relative">
          <TransitionGroup>
                <CSSTransition
                  key={currIndex}
                  timeout={500}
                  classNames="fade"
                >
                  <MultipleChoiceCard
                    key={currIndex}
                    question={currentQ.current?.question}
                    options={currentQ.current?.options}
                    correctAnswer={currentQ.current?.correct_answer}
                    handleNextQuestion={handleNextQuestion}
                    handleScore={handleMCScore}
                  />
                </CSSTransition>
              </TransitionGroup>
              </div>
          <div>{score.current}</div>
          </>
        )}
        { quizType === "Flashcards" && (
          <Flashcards cards={quizData.content.cards} title={quizData.title} />
        )}
        { quizType === "Summary" && (
          <div>Summary</div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
