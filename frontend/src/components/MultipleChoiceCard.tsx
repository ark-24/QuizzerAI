import React, { useRef, useState } from 'react';

interface MultipleChoiceCardProps {
  key: number;
  question: string;
  options: Array<string>;
  correctAnswer: string;
  handleNextQuestion: () => void;
  handleScore: (isCorrect: boolean) => void;
}

const MultipleChoiceCard = ({ question, options, correctAnswer, handleNextQuestion, handleScore }: MultipleChoiceCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  console.log(question);
  console.log(options);

  
  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    if (selectedOption.charAt(0) == correctAnswer) {
      handleScore(true)
    }
    
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold justify-center align-middle">{question}</h2>
      </div>

      <div>
        {options && options.map((option: string, index: number) => (
          <div
            key={index}
            className={`border p-4 mb-2 rounded-lg cursor-pointer 
              ${selectedOption === option ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
              ${isSubmitted && option.charAt(0) === correctAnswer ? 'bg-green-100 border-green-500' : ''}
              ${isSubmitted && selectedOption === option && selectedOption.charAt(0) !== correctAnswer ? 'bg-red-100 border-red-500' : ''}
            `}
            onClick={() => handleOptionChange(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isSubmitted}
        >
          Submit
        </button>
        {isSubmitted && selectedOption && (
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            onClick={handleNextQuestion}
          >
            Next
          </button>
        )}
      </div>

      {isSubmitted && selectedOption && (
        <div className="mt-4">
          {selectedOption.charAt(0) === correctAnswer ? (
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
