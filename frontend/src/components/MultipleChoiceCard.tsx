import React, { useRef, useState } from 'react';
import { ArrowBigRight } from 'lucide-react';
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
  console.log(content[0].question);
  console.log(content[0].options);
  console.log(content[0].correct_answer);
  const currentQ = useRef<any>();
  const queLength = content.length;
  const [currIndex, setCurrIndex] = useState<number>(0);

  const score = useRef<number>(0);

  
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
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
    setIsSubmitted(false);
    
    currentQ.current = content[currIndex];

  };


  return (
    <>
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto " >
      <div className="mb-4">
        <h2 className="text-xl font-semibold justify-center align-middle">{content[currIndex].question}</h2>
      </div>

      <div>
        {content[currIndex].options && content[currIndex].options.map((option: string, index: number) => (
          <div
            key={index}
            className={`border-2 border-teal-400 p-4 mb-2 rounded-lg cursor-pointer hover:bg-teal-200
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
        {isSubmitted && selectedOption && (
          <button
            className="bg-teal-500 text-white py-2 px-4 rounded-lg hover:bg-teal-700"
            onClick={handleNextQuestion}
          >
             <ArrowBigRight />
          </button>
        )}
      </div>

      {isSubmitted && selectedOption && (
        <div className="mt-4">
          {selectedOption === content[currIndex].correct_answer ? (
            <div className="text-green-600">Correct!</div>
          ) : (
            <div className="text-red-600">Incorrect. The correct answer is: {content[currIndex].correct_answer}</div>
          )}
        </div>
      )}
    </div>
    <div> {currIndex+1}/{queLength}</div>
            </>
  );
};

export default MultipleChoiceCard;
