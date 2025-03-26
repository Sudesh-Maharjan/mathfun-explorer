
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { post } from '@/api';
const StudentRegistration: React.FC = () => {
  // Register state
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [studentClass, setStudentClass] = useState('');
  
  // Login state
  const [loginRollNumber, setLoginRollNumber] = useState('');
  
  const { saveStudent } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();

  // const handleRegister = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!name.trim() || !rollNumber.trim() || !studentClass.trim()) {
  //     toast({
  //       title: "Registration Failed",
  //       description: "Please fill in all fields",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   saveStudent(name, rollNumber, studentClass);
    
  //   toast({
  //     title: "Registration Successful",
  //     description: "You're ready to play!",
  //   });
    
  //   navigate('/quiz');
  // };
//API handleRegister function
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!name.trim() || !rollNumber.trim() || !studentClass.trim()) {
    toast({
      title: "Registration Failed",
      description: "Please fill in all fields",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await post('/register/student', {
        name,
        rollNumber,
        className: studentClass,
    });
    const data = await response;

    if (data.status === 201) {
      toast({
        title: "Registration Successful",
        description: "You're ready to play!",
      });

      navigate('/quiz');
    } else {
      toast({
        title: "Registration Failed",
        description: data.message || "Something went wrong",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Registration Failed",
      description: "Unable to connect to the server",
      variant: "destructive",
    });
  }
};
//API handleRegister function end
  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (!loginRollNumber.trim()) {
  //     toast({
  //       title: "Login Failed",
  //       description: "Please enter your roll number",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   const success = studentLogin(loginRollNumber);
    
  //   if (success) {
  //     toast({
  //       title: "Login Successful",
  //       description: "Welcome back! Ready to play?",
  //     });
  //     navigate('/quiz');
  //   } else {
  //     toast({
  //       title: "Login Failed",
  //       description: "Student not found. Please register first.",
  //       variant: "destructive",
  //     });
  //   }
  // };
//API handleLogin function
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!loginRollNumber.trim()) {
    toast({
      title: "Login Failed",
      description: "Please enter your roll number",
      variant: "destructive",
    });
    return;
  }

  try {
    const response = await post('/login/student', {
        rollNumber: loginRollNumber,
    });

    const data = await response;

    if (response) {
      saveStudent(data.student.name, data.student.roll_number, data.student.className);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem("student", JSON.stringify(data.student));
      toast({
        title: "Login Successful",
        description: `Welcome back! ${data.student.name}, Ready to play?`,
      });

      navigate('/quiz');
    } else {
      toast({
        title: "Login Failed",
        description: data.message || "Invalid roll number. Please register first.",
        variant: "destructive",
      });
    }
  } catch (error) {
    toast({
      title: "Login Failed",
      description: "Unable to connect to the server",
      variant: "destructive",
    });
  }
};
//API handleLogin function end
  return (
    <AuthLayout title="Student Portal">
      <Card className="glass-card max-w-md mx-auto">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
              <CardDescription>
                Enter your roll number to continue playing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Roll Number</label>
                  <Input
                    type="text"
                    value={loginRollNumber}
                    onChange={(e) => setLoginRollNumber(e.target.value)}
                    required
                    placeholder="Enter your roll number"
                  />
                </div>
                <Button type="submit" className="w-full">
                  <LogIn className="mr-2 h-4 w-4" />
                  Start Game
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="register">
            <CardHeader>
              <CardTitle>Student Registration</CardTitle>
              <CardDescription>
                Register to start playing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
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
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register & Start
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </AuthLayout>
  );
};

export default StudentRegistration;
