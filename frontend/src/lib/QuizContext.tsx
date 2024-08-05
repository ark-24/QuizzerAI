// QuizContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '@clerk/clerk-react';

const QuizContext = createContext();

export const useQuiz = () => {
  return useContext(QuizContext);
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizCount, setQuizCount] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress;
        if (userEmail) {
          const response = await axios.get(`http://127.0.0.1:8000/api/quizzes/${userEmail}`);
          setQuizzes(response.data);
          setQuizCount(response.data.length);
        } else {
          console.log("Error: User Not Found");
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    };
    fetchQuizzes();
  }, [user]);

  return (
    <QuizContext.Provider value={{ quizzes, quizCount }}>
      {children}
    </QuizContext.Provider>
  );
};
