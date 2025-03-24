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
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface QuizContextType {
  currentQuestion: Question | null;
  score: number;
  difficulty: Difficulty;
  operation: Operation;
  students: Student[];
  teachers: Teacher[];
  isTeacher: boolean;
  customQuestions: Question[];
  questionHistory: Question[];
  generateNewQuestion: () => void;
  checkAnswer: (selectedAnswer: number) => boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  setOperation: (operation: Operation) => void;
  teacherLogin: (username: string, password: string) => boolean;
  teacherLogout: () => void;
  registerTeacher: (name: string, email: string, username: string, password: string) => boolean;
  addCustomQuestion: (question: Omit<Question, 'id'>) => void;
  removeCustomQuestion: (id: string) => void;
  saveStudent: (name: string, rollNumber: string, studentClass: string) => void;
  studentLogin: (rollNumber: string) => boolean;
  currentStudent: Student | null;
  resetQuiz: () => void;
}

const defaultContext: QuizContextType = {
  currentQuestion: null,
  score: 0,
  difficulty: 'easy',
  operation: 'addition',
  students: [],
  teachers: [],
  isTeacher: false,
  customQuestions: [],
  questionHistory: [],
  generateNewQuestion: () => {},
  checkAnswer: () => false,
  setDifficulty: () => {},
  setOperation: () => {},
  teacherLogin: () => false,
  teacherLogout: () => {},
  registerTeacher: () => false,
  addCustomQuestion: () => {},
  removeCustomQuestion: () => {},
  saveStudent: () => {},
  studentLogin: () => false,
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

  useEffect(() => {
    const savedTeachers = localStorage.getItem('mathQuizTeachers');
    if (savedTeachers) {
      setTeachers(JSON.parse(savedTeachers));
    } else {
      const defaultTeacher: Teacher = {
        id: '1',
        username: 'teacher',
        password: 'admin123',
        name: 'Default Teacher',
        email: 'teacher@example.com'
      };
      setTeachers([defaultTeacher]);
      localStorage.setItem('mathQuizTeachers', JSON.stringify([defaultTeacher]));
    }
  }, []);

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

  useEffect(() => {
    localStorage.setItem('mathQuizStudents', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mathQuizCustomQuestions', JSON.stringify(customQuestions));
  }, [customQuestions]);

  useEffect(() => {
    localStorage.setItem('mathQuizTeachers', JSON.stringify(teachers));
  }, [teachers]);

  const generateNewQuestion = () => {
    const filteredCustomQuestions = customQuestions.filter(
      q => q.operation === operation && q.difficulty === difficulty
    );

    let newQuestion;

    if (filteredCustomQuestions.length > 0) {
      const useCustom = Math.random() < 0.3;
      
      if (useCustom) {
        const randomIndex = Math.floor(Math.random() * filteredCustomQuestions.length);
        newQuestion = filteredCustomQuestions[randomIndex];
      } else {
        newQuestion = generateQuestion(operation, difficulty);
      }
    } else {
      newQuestion = generateQuestion(operation, difficulty);
    }

    const isRepeat = questionHistory.some(q => q.question === newQuestion.question);
    
    if (isRepeat && questionHistory.length < 20) {
      generateNewQuestion();
      return;
    }

    setQuestionHistory(prev => {
      const updated = [newQuestion, ...prev];
      return updated.slice(0, 20);
    });

    setCurrentQuestion(newQuestion);
  };

  const checkAnswer = (selectedAnswer: number) => {
    if (!currentQuestion) return false;
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
      
      if (currentStudent) {
        const updatedStudent = {
          ...currentStudent,
          score: currentStudent.score + 1,
          correctAnswers: currentStudent.correctAnswers + 1,
          totalQuestions: currentStudent.totalQuestions + 1
        };
        
        setCurrentStudent(updatedStudent);
        
        setStudents(prev => 
          prev.map(s => s.id === currentStudent.id ? updatedStudent : s)
        );
      }
    } else if (currentStudent) {
      const updatedStudent = {
        ...currentStudent,
        totalQuestions: currentStudent.totalQuestions + 1
      };
      
      setCurrentStudent(updatedStudent);
      
      setStudents(prev => 
        prev.map(s => s.id === currentStudent.id ? updatedStudent : s)
      );
    }
    
    return isCorrect;
  };

  const teacherLogin = (username: string, password: string) => {
    const teacher = teachers.find(t => t.username === username && t.password === password);
    
    if (teacher) {
      setIsTeacher(true);
      setCurrentStudent(null);
      return true;
    }
    
    return false;
  };

  const teacherLogout = () => {
    setIsTeacher(false);
  };

  const registerTeacher = (name: string, email: string, username: string, password: string) => {
    const usernameExists = teachers.some(t => t.username === username);
    
    if (usernameExists) {
      return false;
    }
    
    const newTeacher: Teacher = {
      id: Date.now().toString(),
      name,
      email,
      username,
      password
    };
    
    setTeachers(prev => [...prev, newTeacher]);
    return true;
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
    const existingStudent = students.find(s => s.rollNumber === rollNumber);
    
    if (existingStudent) {
      setCurrentStudent(existingStudent);
    } else {
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
    
    return true;
  };

  const studentLogin = (rollNumber: string) => {
    const student = students.find(s => s.rollNumber === rollNumber);
    
    if (student) {
      setCurrentStudent(student);
      return true;
    }
    
    return false;
  };

  const resetQuiz = () => {
    setScore(0);
    setQuestionHistory([]);
    generateNewQuestion();
  };

  useEffect(() => {
    generateNewQuestion();
  }, [difficulty, operation]);

  const value: QuizContextType = {
    currentQuestion,
    score,
    difficulty,
    operation,
    students,
    teachers,
    isTeacher,
    customQuestions,
    questionHistory,
    generateNewQuestion,
    checkAnswer,
    setDifficulty,
    setOperation,
    teacherLogin,
    teacherLogout,
    registerTeacher,
    addCustomQuestion,
    removeCustomQuestion,
    saveStudent,
    studentLogin,
    currentStudent,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
