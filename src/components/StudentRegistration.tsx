
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogIn } from 'lucide-react';
import AuthLayout from './AuthLayout';

const StudentRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const { saveStudent } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !rollNumber.trim() || !studentClass.trim()) {
      toast({
        title: "Registration Failed",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    saveStudent(name, rollNumber, studentClass);
    
    toast({
      title: "Registration Successful",
      description: "You're ready to play!",
    });
    
    navigate('/quiz');
  };

  return (
    <AuthLayout title="Student Registration">
      <Card className="glass-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Student Registration</CardTitle>
          <CardDescription>
            Enter your details to start playing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Roll Number</label>
              <Input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
                placeholder="Enter your roll number"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Class</label>
              <Input
                type="text"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                required
                placeholder="Enter your class (e.g., 4A)"
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Start Game
            </Button>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default StudentRegistration;
