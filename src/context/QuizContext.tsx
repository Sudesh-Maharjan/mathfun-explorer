
import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateQuestion } from '../utils/questionGenerator';

export type Difficulty = 'easy' | 'medium' | 'hard';
export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';

export interface Question {
  id: string;
  question: string;
  options: number[];
  answer: number;
  operation: Operation;
  difficulty: Difficulty;
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface Teacher {
  username: string;
  password: string;
}

export interface QuizContextType {
  currentQuestion: Question | null;
  score: number;
  difficulty: Difficulty;
  operation: Operation;
  students: Student[];
  isTeacher: boolean;
  customQuestions: Question[];
  questionHistory: Question[];
  generateNewQuestion: () => void;
  checkAnswer: (selectedAnswer: number) => boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  setOperation: (operation: Operation) => void;
  teacherLogin: (username: string, password: string) => boolean;
  teacherLogout: () => void;
  addCustomQuestion: (question: Omit<Question, 'id'>) => void;
  removeCustomQuestion: (id: string) => void;
  saveStudent: (name: string, rollNumber: string, studentClass: string) => void;
  currentStudent: Student | null;
  resetQuiz: () => void;
}

const defaultContext: QuizContextType = {
  currentQuestion: null,
  score: 0,
  difficulty: 'easy',
  operation: 'addition',
  students: [],
  isTeacher: false,
  customQuestions: [],
  questionHistory: [],
  generateNewQuestion: () => {},
  checkAnswer: () => false,
  setDifficulty: () => {},
  setOperation: () => {},
  teacherLogin: () => false,
  teacherLogout: () => {},
  addCustomQuestion: () => {},
  removeCustomQuestion: () => {},
  saveStudent: () => {},
  currentStudent: null,
  resetQuiz: () => {},
};

const QuizContext = createContext<QuizContextType>(defaultContext);

export const useQuiz = () => useContext(QuizContext);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [operation, setOperation] = useState<Operation>('addition');
  const [isTeacher, setIsTeacher] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const [questionHistory, setQuestionHistory] = useState<Question[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  // Predefined teacher credentials
  const teacherCredentials: Teacher = {
    username: 'teacher',
    password: 'admin123'
  };

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedStudents = localStorage.getItem('mathQuizStudents');
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }

    const savedCustomQuestions = localStorage.getItem('mathQuizCustomQuestions');
    if (savedCustomQuestions) {
      setCustomQuestions(JSON.parse(savedCustomQuestions));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('mathQuizStudents', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mathQuizCustomQuestions', JSON.stringify(customQuestions));
  }, [customQuestions]);

  const generateNewQuestion = () => {
    // Check if we have custom questions for the current operation and difficulty
    const filteredCustomQuestions = customQuestions.filter(
      q => q.operation === operation && q.difficulty === difficulty
    );

    let newQuestion;

    if (filteredCustomQuestions.length > 0) {
      // Use a custom question 30% of the time if available
      const useCustom = Math.random() < 0.3;
      
      if (useCustom) {
        const randomIndex = Math.floor(Math.random() * filteredCustomQuestions.length);
        newQuestion = filteredCustomQuestions[randomIndex];
      } else {
        newQuestion = generateQuestion(operation, difficulty);
      }
    } else {
      // No custom questions, generate a random one
      newQuestion = generateQuestion(operation, difficulty);
    }

    // Ensure we don't repeat questions that were recently asked
    const isRepeat = questionHistory.some(q => q.question === newQuestion.question);
    
    if (isRepeat && questionHistory.length < 20) {
      // Try again if it's a repeat and we haven't asked too many questions yet
      generateNewQuestion();
      return;
    }

    // Add to history and limit history size
    setQuestionHistory(prev => {
      const updated = [newQuestion, ...prev];
      return updated.slice(0, 20); // Keep the last 20 questions
    });

    setCurrentQuestion(newQuestion);
  };

  const checkAnswer = (selectedAnswer: number) => {
    if (!currentQuestion) return false;
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      // Update current student score if one is selected
      if (currentStudent) {
        const updatedStudent = {
          ...currentStudent,
          score: currentStudent.score + 1,
          correctAnswers: currentStudent.correctAnswers + 1,
          totalQuestions: currentStudent.totalQuestions + 1
        };
        
        setCurrentStudent(updatedStudent);
        
        // Update in the students array
        setStudents(prev => 
          prev.map(s => s.id === currentStudent.id ? updatedStudent : s)
        );
      }
    } else if (currentStudent) {
      // Update the attempt count even if wrong
      const updatedStudent = {
        ...currentStudent,
        totalQuestions: currentStudent.totalQuestions + 1
      };
      
      setCurrentStudent(updatedStudent);
      
      // Update in the students array
      setStudents(prev => 
        prev.map(s => s.id === currentStudent.id ? updatedStudent : s)
      );
    }
    
    return isCorrect;
  };

  const teacherLogin = (username: string, password: string) => {
    const isValid = username === teacherCredentials.username && password === teacherCredentials.password;
    
    if (isValid) {
      setIsTeacher(true);
      // Reset current student when teacher logs in
      setCurrentStudent(null);
    }
    
    return isValid;
  };

  const teacherLogout = () => {
    setIsTeacher(false);
  };

  const addCustomQuestion = (question: Omit<Question, 'id'>) => {
    const newQuestion: Question = {
      ...question,
      id: Date.now().toString(),
    };
    
    setCustomQuestions(prev => [...prev, newQuestion]);
  };

  const removeCustomQuestion = (id: string) => {
    setCustomQuestions(prev => prev.filter(q => q.id !== id));
  };

  const saveStudent = (name: string, rollNumber: string, studentClass: string) => {
    // Check if student already exists by roll number
    const existingStudent = students.find(s => s.rollNumber === rollNumber);
    
    if (existingStudent) {
      setCurrentStudent(existingStudent);
    } else {
      // Create new student
      const newStudent: Student = {
        id: Date.now().toString(),
        name,
        rollNumber,
        class: studentClass,
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0
      };
      
      setStudents(prev => [...prev, newStudent]);
      setCurrentStudent(newStudent);
    }
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionHistory([]);
    generateNewQuestion();
  };

  // Generate the first question when difficulty or operation changes
  useEffect(() => {
    generateNewQuestion();
  }, [difficulty, operation]);

  const value: QuizContextType = {
    currentQuestion,
    score,
    difficulty,
    operation,
    students,
    isTeacher,
    customQuestions,
    questionHistory,
    generateNewQuestion,
    checkAnswer,
    setDifficulty,
    setOperation,
    teacherLogin,
    teacherLogout,
    addCustomQuestion,
    removeCustomQuestion,
    saveStudent,
    currentStudent,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
