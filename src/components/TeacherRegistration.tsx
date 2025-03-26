
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuiz } from '../context/QuizContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UserPlus } from 'lucide-react';
import AuthLayout from './AuthLayout';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { post } from '@/api';

const registerSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const TeacherRegistration: React.FC = () => {
  const { registerTeacher } = useQuiz();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    }
  });

  // const onSubmit = (values: RegisterFormValues) => {
  //   const success = registerTeacher(values.fullName, values.email, values.username, values.password);
    
  //   if (success) {
  //     toast({
  //       title: "Registration Successful",
  //       description: "You can now login with your credentials",
  //     });
  //     navigate('/login');
  //   } else {
  //     toast({
  //       title: "Registration Failed",
  //       description: "Username is already taken. Please try a different one.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await post('/register/teacher', {
          fullName: values.fullName,
          email: values.email,
          username: values.username,
          password: values.password
      });
      const data = await response;
    if (data.status === 201) {

      toast({
        title: "Registration Successful",
        description: "You can now login with your credentials",
      });
      navigate('/login');
    }else {
      throw new Error(data.message || "Something went wrong");
    }
    }catch (error) {
      let errorMessage = "An error occurred during registration.";
  
      if (error.response) {
        // If the server responds with an error
        errorMessage = error.response.data?.message || "Something went wrong on the server.";
      } else if (error.request) {
        // If the request was made but no response was received
        errorMessage = "No response from the server. Please check your network.";
      } else if (error.message) {
        // Other errors (e.g., timeout, client-side issues)
        errorMessage = error.message;
      }
  
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  return (
    <AuthLayout title="Teacher Registration">
      <Card className="glass-card max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Teacher Registration</CardTitle>
          <CardDescription>
            Register as a teacher to access the admin panel and manage questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Create a password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input placeholder="Confirm your password" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-between items-center pt-2">
                <Button type="button" variant="outline" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
                <Button type="submit">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
};

export default TeacherRegistration;
