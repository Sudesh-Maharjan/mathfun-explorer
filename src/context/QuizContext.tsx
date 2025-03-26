import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateQuestion } from '../utils/questionGenerator';
import { toast } from "@/hooks/use-toast";

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
  roll_number: string;
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
  availableOperations: Operation[];
  availableDifficulties: Difficulty[];
  generateNewQuestion: () => void;
  checkAnswer: (selectedAnswer: number) => boolean;
  setDifficulty: (difficulty: Difficulty) => void;
  setOperation: (operation: Operation) => void;
  teacherLogin: (username: string, password: string) => boolean;
  teacherLogout: () => void;
  registerTeacher: (name: string, email: string, username: string, password: string) => boolean;
  addCustomQuestion: (question: Omit<Question, 'id'>) => void;
  removeCustomQuestion: (id: string) => void;
  saveStudent: (name: string, roll_number: string, studentClass: string) => void;
  studentLogin: (roll_number: string) => boolean;
  studentLogout: () => void;
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
  availableOperations: ['addition'],
  availableDifficulties: ['easy'],
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
  studentLogout: () => {},
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
  const [availableOperations, setAvailableOperations] = useState<Operation[]>(['addition']);
  const [availableDifficulties, setAvailableDifficulties] = useState<Difficulty[]>(['easy']);

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
      const loadedQuestions = JSON.parse(savedCustomQuestions) as Question[];
      setCustomQuestions(loadedQuestions);
      
      updateAvailableOptions(loadedQuestions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mathQuizStudents', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('mathQuizCustomQuestions', JSON.stringify(customQuestions));
    
    updateAvailableOptions(customQuestions);
  }, [customQuestions]);

  useEffect(() => {
    localStorage.setItem('mathQuizTeachers', JSON.stringify(teachers));
  }, [teachers]);

  const updateAvailableOptions = (questions: Question[]) => {
    const operations = new Set<Operation>();
    const difficulties = new Set<Difficulty>();
    
    questions.forEach(q => {
      operations.add(q.operation);
      difficulties.add(q.difficulty);
    });
    
    const ops = operations.size > 0 ? Array.from(operations) : ['addition' as Operation];
    const diffs = difficulties.size > 0 ? Array.from(difficulties) : ['easy' as Difficulty];
    
    setAvailableOperations(ops);
    setAvailableDifficulties(diffs);
    
    if (!ops.includes(operation)) {
      setOperation(ops[0]);
    }
    
    if (!diffs.includes(difficulty)) {
      setDifficulty(diffs[0]);
    }
  };

  const generateNewQuestion = () => {
    const filteredQuestions = customQuestions.filter(
      q => q.operation === operation && q.difficulty === difficulty
    );
    
    if (filteredQuestions.length === 0) {
      toast({
        title: "No questions available",
        description: `No ${difficulty} ${operation} questions found. Please ask a teacher to add some.`,
        variant: "destructive",
      });
      setCurrentQuestion(null);
      console.log(`No ${difficulty} ${operation} questions found. Please ask a teacher to add some.`);
      return;
    }
    
    if (filteredQuestions.length < 10 && questionHistory.length === 0) {
      toast({
        title: "Limited Questions",
        description: `Only ${filteredQuestions.length} questions available. A full quiz needs at least 10 questions.`,
        variant: "default",
      });
    }
    
    const randomIndex = Math.floor(Math.random() * filteredQuestions.length);
    const newQuestion = filteredQuestions[randomIndex];
    
    const isRepeat = questionHistory.slice(0, 5).some(q => q.id === newQuestion.id);
    
    if (isRepeat && filteredQuestions.length > 1) {
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

  const saveStudent = (name: string, roll_number: string, studentClass: string) => {
    const existingStudent = students.find(s => s.roll_number === roll_number);
    
    if (existingStudent) {
      setCurrentStudent(existingStudent);
    } else {
      const newStudent: Student = {
        id: Date.now().toString(),
        name,
        roll_number,
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

  const studentLogin = (roll_number: string) => {
    const student = students.find(s => s.roll_number === roll_number);
    
    if (student) {
      setCurrentStudent(student);
      return true;
    }
    
    return false;
  };

  const studentLogout = () => {
    setCurrentStudent(null);
    setScore(0);
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
    availableOperations,
    availableDifficulties,
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
    studentLogout,
    currentStudent,
    resetQuiz,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
