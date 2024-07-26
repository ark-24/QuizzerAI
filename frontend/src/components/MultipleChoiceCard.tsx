import React, { useRef, useState } from 'react';
import { ArrowBigRight } from 'lucide-react';
interface MultipleChoiceCardProps {
  currIndex: number;
  question: string;
  options: Array<string>;
  correctAnswer: string;
  handleNextQuestion: () => void;
  handleScore: (isCorrect: boolean) => void;
}

const MultipleChoiceCard = ({ currIndex, question, options, correctAnswer,handleNextQuestion, handleScore }: MultipleChoiceCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log(question);
  console.log(options);
  console.log(correctAnswer);


  
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption === correctAnswer) {
      handleScore(true)
    }
    
  };

  return (
    
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto " >
      <div className="mb-4">
        <h2 className="text-xl font-semibold justify-center align-middle">{question}</h2>
      </div>

      <div>
        {options && options.map((option: string, index: number) => (
          <div
            key={index}
            className={`border-2 border-teal-400 p-4 mb-2 rounded-lg cursor-pointer hover:bg-teal-200
              ${selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${isSubmitted && option === correctAnswer ? 'bg-green-100 border-green-500' : ''}
              ${isSubmitted && selectedOption === option && selectedOption !== correctAnswer ? 'bg-red-100 border-red-500' : ''}
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
          {selectedOption === correctAnswer ? (
            <div className="text-green-600">Correct!</div>
          ) : (
            <div className="text-red-600">Incorrect. The correct answer is: {correctAnswer}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceCard;
