
import React, { useState } from 'react';
import { Question } from '../context/QuizContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface QuizCardProps {
  question: Question;
  onAnswerSelected: (answer: number) => void;
  onNextQuestion: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, onAnswerSelected, onNextQuestion }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();

  const handleOptionClick = (option: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(option);
    const correct = question.answer === option;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Call the parent handler
    onAnswerSelected(option);
    
    // Show toast
    if (correct) {
      toast({
        title: "Correct!",
        description: "Great job! You got it right.",
        variant: "default",
      });
    } else {
      toast({
        title: "Not quite right",
        description: `The correct answer was ${question.answer}`,
        variant: "destructive",
      });
    }
    
    // Auto-advance after a delay
    setTimeout(() => {
      onNextQuestion();
      // Reset state for next question
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFeedback(false);
    }, 2000);
  };

  const getOperationSymbol = () => {
    switch (question.operation) {
      case 'addition': return '+';
      case 'subtraction': return '-';
      case 'multiplication': return '×';
      case 'division': return '÷';
      default: return '';
    }
  };

  const getOperationColor = () => {
    switch (question.operation) {
      case 'addition': return 'bg-blue-100 text-blue-700';
      case 'subtraction': return 'bg-red-100 text-red-700';
      case 'multiplication': return 'bg-green-100 text-green-700';
      case 'division': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="glass-card shadow-lg overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center mb-2">
            <div className={`text-xs font-medium rounded-full px-3 py-1 ${getOperationColor()}`}>
              {question.operation.charAt(0).toUpperCase() + question.operation.slice(1)}
            </div>
            <div className="text-xs font-medium bg-secondary text-secondary-foreground rounded-full px-3 py-1">
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-bold tracking-tighter">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="grid grid-cols-2 gap-3">
            {question.options.map((option, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant={selectedAnswer === option 
                    ? isCorrect 
                      ? "default" 
                      : "destructive" 
                    : "outline"}
                  className={`quiz-option w-full h-16 text-2xl font-semibold ${
                    selectedAnswer === option ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : ''
                  } ${showFeedback && option === question.answer && selectedAnswer !== option ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => handleOptionClick(option)}
                  disabled={selectedAnswer !== null}
                >
                  {option}
                  {showFeedback && selectedAnswer === option && (
                    <AnimatePresence>
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute right-2"
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-6 w-6 text-green-100" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-100" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0 justify-end">
          {selectedAnswer !== null && (
            <Button onClick={onNextQuestion} className="mt-2">
              Next Question
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default QuizCard;
