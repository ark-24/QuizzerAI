import React, { useRef, useState } from 'react';
import { ArrowBigRight, CircleCheckBig } from 'lucide-react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface MultipleChoiceCardProps {

  // currIndex: number;
  content : [{
  question: string;
  options: Array<string>;
  correct_answer: string;
  }];
  // handleNextQuestion: () => void;
  // handleScore: (isCorrect: boolean) => void;
}

// const MultipleChoiceCard = ({ currIndex, question, options, correctAnswer,handleNextQuestion, handleScore }: MultipleChoiceCardProps) => {
const MultipleChoiceCard = ({ content }: MultipleChoiceCardProps) => {

  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const currentQ = useRef<any>();
  const queLength = content.length;
  const [currIndex, setCurrIndex] = useState<number>(0);

  const score = useRef<number>(0);

  
  const handleOptionChange = (option: string) => {
    if (!isSubmitted) {
    setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === content[currIndex].correct_answer) {
      handleScore(true)
    }
    
  };

  
  const handleScore = (isCorrect: boolean) => {
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
    setCurrIndex((prevIndex) => (prevIndex + 1)  % queLength);
    console.log((currIndex));
    setSelectedOption("")
    currentQ.current = content[currIndex];
    setIsSubmitted(false);


  };

  const handleReset = () => {
    // if (carouselRef.current) {
    //   // Move to the next slide
    //   carouselRef.current.next();
    //   console.log(carouselRef.current);
    // }
    setCurrIndex(0);
    score.current = 0
    
    currentQ.current = content[currIndex];
    setIsSubmitted(false);


  };


  return (
    <>
    <TransitionGroup>
    <CSSTransition
      key={currIndex}
      timeout={500}
      classNames="fade"
    >
    <div className="bg-white p-6 rounded-lg  shadow-lg max-w-lg mx-auto text-center" >
     {currIndex < (queLength - 1) ? <> <div className="mb-4">
        <h2 className="text-xl font-semibold justify-center align-middle max-w-xl break-words">{content[currIndex].question}</h2>
      </div>

      <div >
        {content[currIndex].options && content[currIndex].options.map((option: string, index: number) => (
          <div
            key={index}
            
            className={`border-2 font-lato border-teal-400 p-4 mb-2 rounded-lg cursor-pointer hover:bg-teal-200
              ${selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${isSubmitted && option === content[currIndex].correct_answer ? 'bg-green-100 border-green-500' : ''}
              ${isSubmitted && selectedOption === option && selectedOption !== content[currIndex].correct_answer ? 'bg-red-100 border-red-500' : ''}
            `}
            onClick={() => handleOptionChange(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Select
        </button>
        {isSubmitted && selectedOption && (currIndex < (queLength -1) ? (
          <button
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
            onClick={handleNextQuestion}
          >
             <ArrowBigRight />
          </button>
        ):(
          <button
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
            onClick={handleNextQuestion}
          >
             Submit
          </button>
        ))}
      </div>

      {isSubmitted && selectedOption && (
        <div className="mt-4">
          {selectedOption === content[currIndex].correct_answer ? (
            <div className="text-green-600">Correct!</div>
          ) : (
            <div className="text-red-600">Incorrect. The correct answer is: {content[currIndex].correct_answer}</div>
          )}
        </div>
      )}</> :
      (<><div className="mb-4">
      <h2 className="text-xl flex font-semibold justify-center align-middle py-2 px-4"> Quiz Complete!   <CircleCheckBig className='ml-2 text-green-400'/> </h2>
    </div>
    <div className='align-middle justify-center flex'>
      You Scored {score.current}/{queLength}
    </div>
    <div className='flex justify-center'>
      <button  className="bg-teal-500 flex justify-center mt-10 text-white py-2 px-4 rounded-lg hover:bg-teal-700" onClick={handleReset}>Try Again</button>
    </div>
    </>
    )}
    </div>
    {/* <div> {currIndex+1}/{queLength}</div> */}
    </CSSTransition>
    </TransitionGroup>
            </>
  );
};

export default MultipleChoiceCard;
