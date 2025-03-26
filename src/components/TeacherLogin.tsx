
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useQuiz } from '../context/QuizContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LogIn, UserPlus } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { post } from '@/api';

const TeacherLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { teacherLogin } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   const success = teacherLogin(username, password);
    
  //   if (success) {
  //     toast({
  //       title: "Login Successful",
  //       description: "Welcome back, Teacher!",
  //     });
  //     navigate('/admin');
  //   } else {
  //     toast({
  //       title: "Login Failed",
  //       description: "Invalid username or password",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await post('/login/teacher', { username, password });
      const data = await response;
console.log("Teacher data", data);
      if (data) {
        teacherLogin(username, password);
        toast({
          title: "Login Successful",
          description: `Welcome back, Tutor, ${data.user.full_name}!`,
        });
        if (data.accessToken) {
          localStorage.setItem('teacher_token', data.accessToken);
          localStorage.setItem('teacher', data.user);
        }
        navigate('/admin');
      }
       else {
        throw new Error(data.message || "Invalid username or password");
      }
    } catch (error) {
      let errorMessage = "An error occurred during login.";

      if (error.response) {
        errorMessage = error.response.data?.message || "Something went wrong on the server.";
      } else if (error.request) {
        errorMessage = "No response from the server. Please check your network.";
      } else {
        errorMessage = error.message || "Unexpected error occurred.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <AuthLayout title="Teacher Login">
      <Card className="glass-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Teacher Login</CardTitle>
          <CardDescription>
            Login to access the teacher panel and manage questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Username</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>
            <Button type="submit" className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t pt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register-teacher" className="text-primary font-medium hover:underline">
              Register now
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default TeacherLogin;
