
import React, { useState } from 'react';
import { useQuiz, Operation, Difficulty, Question } from '../context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Trash2, Plus, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { post } from '@/api';

const AdminPanel: React.FC = () => {
  const { customQuestions, addCustomQuestion, removeCustomQuestion } = useQuiz();
  const { toast } = useToast();
  
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '']);
  const [operation, setOperation] = useState<Operation>('addition');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = async() => {
    console.log("Add Question executed!")
    // Validation
    if (!newQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    if (!newAnswer.trim() || isNaN(Number(newAnswer))) {
      toast({
        title: "Error",
        description: "Please enter a valid numeric answer",
        variant: "destructive",
      });
      return;
    }

    // Combine the correct answer with the other options
    const allOptions = [...options.filter(opt => opt.trim() && !isNaN(Number(opt))), newAnswer];
    
    if (allOptions.length < 2) {
      toast({
        title: "Error",
        description: "Please provide at least one option besides the correct answer",
        variant: "destructive",
      });
      return;
    }

    // Convert options to numbers
    // const numericOptions = allOptions.map(Number);

    // Create the new question
    // const questionObj: Omit<Question, 'id'> = {
    //   question: newQuestion,
    //   answer: Number(newAnswer),
    //   options: numericOptions,
    //   operation,
    //   difficulty,
    // };

    if (editingId) {
      // Update existing question
      removeCustomQuestion(editingId);
      // addCustomQuestion(questionObj);
      setEditingId(null);
      toast({
        title: "Success",
        description: "Question updated successfully",
      });
    } else {
      // Add new question
      // addCustomQuestion(questionObj);

      // toast({
      //   title: "Success",
      //   description: "New question added successfully",
      // });
      setLoading(true);
      try {
        const token = localStorage.getItem("teacher_token");
        console.log("Teacher Token", token)
        const response = await post('/teacher/custom-quetsions', {
          operation,
          difficulty,
          question: newQuestion,
          correct_answer: newAnswer,
          wrong_option1: options[0],
          wrong_option2: options[1],
          wrong_option3: options[2]
        }, token);
        console.log('Add question response',response)
        if (!response) throw new Error('Failed to add question');
        toast({ title: "Success", description: "Question added successfully" });
        setNewQuestion('');
        setNewAnswer('');
        setOptions(['', '', '']);
      } catch (error) {
        toast({ title: "Error", description: "Failed to add question", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }

    // Reset form
    setNewQuestion('');
    setNewAnswer('');
    setOptions(['', '', '']);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id);
    setNewQuestion(question.question);
    setNewAnswer(question.answer.toString());
    
    // Set options excluding the correct answer
    const otherOptions = question.options
      .filter(opt => opt !== question.answer)
      .map(opt => opt.toString());
    
    // Fill in the available options or pad with empty strings
    setOptions([
      otherOptions[0] || '',
      otherOptions[1] || '',
      otherOptions[2] || '',
    ]);
    
    setOperation(question.operation);
    setDifficulty(question.difficulty);
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus size={18} />
            {editingId ? 'Edit Question' : 'Add Custom Question'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Operation</label>
                <Select
                  value={operation}
                  onValueChange={(value) => setOperation(value as Operation)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="addition">Addition</SelectItem>
                    <SelectItem value="subtraction">Subtraction</SelectItem>
                    <SelectItem value="multiplication">Multiplication</SelectItem>
                    <SelectItem value="division">Division</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Difficulty</label>
                <Select
                  value={difficulty}
                  onValueChange={(value) => setDifficulty(value as Difficulty)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Question</label>
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="e.g. 5 + 3 = ?"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Correct Answer</label>
              <Input
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                placeholder="e.g. 8"
                type="number"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Wrong Options (at least one)</label>
              <div className="grid grid-cols-3 gap-2">
                {options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    type="number"
                  />
                ))}
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              {editingId && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setNewQuestion('');
                    setNewAnswer('');
                    setOptions(['', '', '']);
                  }}
                >
                  Cancel
                </Button>
              )}
              <Button onClick={handleAddQuestion} disabled={loading}>
                {editingId ? (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Question
                  </>
                ) : (
                  <>
                    {loading ? 'Adding...' : <><Plus className="mr-2 h-4 w-4" /> Add Question</>}
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Custom Questions ({customQuestions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {customQuestions.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">
              No custom questions yet. Add one above to get started.
            </p>
          ) : (
            <motion.div className="space-y-3">
              <AnimatePresence>
                {customQuestions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{question.question}</div>
                      <div className="text-sm text-muted-foreground">
                        Answer: {question.answer} | 
                        {question.operation.charAt(0).toUpperCase() + question.operation.slice(1)} |
                        {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditQuestion(question)}
                      >
                        <Edit size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          removeCustomQuestion(question.id);
                          toast({
                            title: "Success",
                            description: "Question removed successfully",
                          });
                        }}
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
