
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuiz } from '../context/QuizContext';
import Header from '../components/Header';
import AdminPanel from '../components/AdminPanel';
import { Settings, Users } from 'lucide-react';

const Admin = () => {
  const { students, isAdmin } = useQuiz();

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="content-container">
          <div className="max-w-md mx-auto">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-center">Access Restricted</CardTitle>
                <CardDescription className="text-center">
                  You need admin access to view this page.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center py-6">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p>Please enable admin mode from the header to access the admin panel.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="content-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
          
          <Tabs defaultValue="questions">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="questions" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage Questions
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2">
                <Users className="h-4 w-4" />
                Student Data
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="questions">
              <AdminPanel />
            </TabsContent>
            
            <TabsContent value="students">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Student Data</CardTitle>
                  <CardDescription>
                    View performance data for all students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-3 font-medium">Name</th>
                          <th className="text-center py-2 px-3 font-medium">Score</th>
                          <th className="text-center py-2 px-3 font-medium">Questions Attempted</th>
                          <th className="text-center py-2 px-3 font-medium">Correct Answers</th>
                          <th className="text-center py-2 px-3 font-medium">Accuracy</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-6 text-muted-foreground">
                              No student data available
                            </td>
                          </tr>
                        ) : (
                          students.map(student => {
                            const accuracy = student.totalQuestions > 0 
                              ? Math.round((student.correctAnswers / student.totalQuestions) * 100) 
                              : 0;
                              
                            return (
                              <tr key={student.id} className="border-b hover:bg-muted/20">
                                <td className="py-2 px-3 font-medium">{student.name}</td>
                                <td className="py-2 px-3 text-center">{student.score}</td>
                                <td className="py-2 px-3 text-center">{student.totalQuestions}</td>
                                <td className="py-2 px-3 text-center">{student.correctAnswers}</td>
                                <td className="py-2 px-3 text-center">{accuracy}%</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin;
