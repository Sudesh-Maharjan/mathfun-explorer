
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useQuiz, Difficulty, Operation } from '../context/QuizContext';
import Header from '../components/Header';
import QuizCard from '../components/QuizCard';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  RefreshCw, 
  Trophy, 
  BarChart3, 
  ChevronRight, 
  ChevronLeft 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DifficultyBadge: React.FC<{ difficulty: Difficulty; selected: boolean; onClick: () => void }> = ({ 
  difficulty, 
  selected, 
  onClick 
}) => (
  <Button
    variant={selected ? "default" : "outline"}
    size="sm"
    className={`rounded-full px-4 ${
      selected ? "" : "hover:bg-muted"
    }`}
    onClick={onClick}
  >
    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
  </Button>
);

const OperationButton: React.FC<{ 
  operation: Operation; 
  selected: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ operation, selected, onClick, icon }) => (
  <Button
    variant={selected ? "default" : "outline"}
    size="sm"
    className={`gap-2 ${selected ? "" : "hover:bg-muted"}`}
    onClick={onClick}
  >
    {icon}
    <span className="hidden sm:inline">
      {operation.charAt(0).toUpperCase() + operation.slice(1)}
    </span>
  </Button>
);

const Quiz = () => {
  const { 
    currentQuestion, 
    score, 
    difficulty, 
    operation, 
    setDifficulty, 
    setOperation, 
    generateNewQuestion, 
    checkAnswer,
    resetQuiz,
    currentStudent,
  } = useQuiz();
  
  const [searchParams] = useSearchParams();
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [completedQuiz, setCompletedQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState<Array<{ question: string; correct: boolean }>>([]);

  useEffect(() => {
    // Check search params for initial operation
    const opParam = searchParams.get('op');
    if (opParam) {
      switch(opParam.toLowerCase()) {
        case 'addition':
          setOperation('addition');
          break;
        case 'subtraction':
          setOperation('subtraction');
          break;
        case 'multiplication':
          setOperation('multiplication');
          break;
        case 'division':
          setOperation('division');
          break;
      }
    }
  }, [searchParams, setOperation]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    resetQuiz();
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setQuizResults([]);
    setCompletedQuiz(false);
  };

  const handleAnswerSelected = (selectedAnswer: number) => {
    if (!currentQuestion) return;
    
    const isCorrect = checkAnswer(selectedAnswer);
    setQuestionsAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Record result for the progress chart
    setQuizResults(prev => [
      ...prev, 
      { 
        question: `Q${prev.length + 1}`, 
        correct: isCorrect 
      }
    ]);
    
    // Check if quiz is complete (10 questions)
    if (questionsAnswered + 1 >= 10) {
      setCompletedQuiz(true);
    }
  };

  const handleNextQuestion = () => {
    generateNewQuestion();
  };

  const getProgressColor = () => {
    const accuracy = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;
    if (accuracy >= 80) return 'bg-green-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Prepare chart data
  const chartData = quizResults.map((result, index) => ({
    name: result.question,
    score: result.correct ? 1 : 0,
    cumulative: quizResults.slice(0, index + 1).filter(r => r.correct).length
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="content-container">
        {!quizStarted ? (
          <Card className="max-w-2xl mx-auto glass-card">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Ready to practice math?</CardTitle>
              <CardDescription className="text-center">
                Choose your difficulty and operation to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Select Difficulty:</h3>
                  <div className="flex flex-wrap gap-2">
                    <DifficultyBadge 
                      difficulty="easy" 
                      selected={difficulty === 'easy'} 
                      onClick={() => setDifficulty('easy')} 
                    />
                    <DifficultyBadge 
                      difficulty="medium" 
                      selected={difficulty === 'medium'} 
                      onClick={() => setDifficulty('medium')} 
                    />
                    <DifficultyBadge 
                      difficulty="hard" 
                      selected={difficulty === 'hard'} 
                      onClick={() => setDifficulty('hard')} 
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Select Operation:</h3>
                  <div className="flex flex-wrap gap-2">
                    <OperationButton 
                      operation="addition" 
                      selected={operation === 'addition'} 
                      onClick={() => setOperation('addition')} 
                      icon={<Plus size={16} />}
                    />
                    <OperationButton 
                      operation="subtraction" 
                      selected={operation === 'subtraction'} 
                      onClick={() => setOperation('subtraction')} 
                      icon={<Minus size={16} />}
                    />
                    <OperationButton 
                      operation="multiplication" 
                      selected={operation === 'multiplication'} 
                      onClick={() => setOperation('multiplication')} 
                      icon={<X size={16} />}
                    />
                    <OperationButton 
                      operation="division" 
                      selected={operation === 'division'} 
                      onClick={() => setOperation('division')} 
                      icon={<Divide size={16} />}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button size="lg" onClick={handleStartQuiz}>
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        ) : completedQuiz ? (
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-3 text-center">
                  <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                  <CardDescription>
                    {currentStudent ? `Great job, ${currentStudent.name}!` : 'Great job!'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative w-32 h-32 mb-4">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trophy size={64} className="text-yellow-500" />
                      </div>
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-gray-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-primary"
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 * (1 - correctAnswers / 10)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                    </div>
                    
                    <h2 className="text-3xl font-bold">{correctAnswers}/10</h2>
                    <p className="text-muted-foreground mb-6">Questions Answered Correctly</p>
                    
                    <div className="w-full max-w-md">
                      <Tabs defaultValue="results">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="results">Results</TabsTrigger>
                          <TabsTrigger value="progress">Progress Chart</TabsTrigger>
                        </TabsList>
                        <TabsContent value="results" className="p-4">
                          <div className="space-y-2">
                            {quizResults.map((result, index) => (
                              <div 
                                key={index}
                                className={`flex items-center justify-between p-2 rounded-md ${
                                  result.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                }`}
                              >
                                <span>{`Question ${index + 1}`}</span>
                                <span>{result.correct ? 'Correct' : 'Incorrect'}</span>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                        <TabsContent value="progress" className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={chartData}
                              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Area 
                                type="monotone" 
                                dataKey="cumulative" 
                                stroke="#4338ca" 
                                fill="#818cf8" 
                                name="Correct Answers"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center gap-3">
                  <Button variant="outline" onClick={handleStartQuiz}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Play Again
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span>Progress:</span>
                  <span className="font-bold">{questionsAnswered}/10</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <span>Score:</span>
                  <span className="font-bold">{correctAnswers}/10</span>
                </div>
              </div>
              <Progress value={(questionsAnswered / 10) * 100} className={getProgressColor()} />
            </div>
            
            <div className="mb-6 flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <DifficultyBadge 
                  difficulty="easy" 
                  selected={difficulty === 'easy'} 
                  onClick={() => setDifficulty('easy')} 
                />
                <DifficultyBadge 
                  difficulty="medium" 
                  selected={difficulty === 'medium'} 
                  onClick={() => setDifficulty('medium')} 
                />
                <DifficultyBadge 
                  difficulty="hard" 
                  selected={difficulty === 'hard'} 
                  onClick={() => setDifficulty('hard')} 
                />
              </div>
              
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  disabled={questionsAnswered === 0} 
                  onClick={resetQuiz}
                >
                  <RefreshCw size={18} />
                </Button>
              </div>
            </div>
            
            <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
              <OperationButton 
                operation="addition" 
                selected={operation === 'addition'} 
                onClick={() => setOperation('addition')} 
                icon={<Plus size={16} />}
              />
              <OperationButton 
                operation="subtraction" 
                selected={operation === 'subtraction'} 
                onClick={() => setOperation('subtraction')} 
                icon={<Minus size={16} />}
              />
              <OperationButton 
                operation="multiplication" 
                selected={operation === 'multiplication'} 
                onClick={() => setOperation('multiplication')} 
                icon={<X size={16} />}
              />
              <OperationButton 
                operation="division" 
                selected={operation === 'division'} 
                onClick={() => setOperation('division')} 
                icon={<Divide size={16} />}
              />
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion?.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {currentQuestion && (
                  <QuizCard
                    question={currentQuestion}
                    onAnswerSelected={handleAnswerSelected}
                    onNextQuestion={handleNextQuestion}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

export default Quiz;
