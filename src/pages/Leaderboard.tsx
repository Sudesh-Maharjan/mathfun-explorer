
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuiz, Student } from '../context/QuizContext';
import Header from '../components/Header';
import { Trophy, Medal, Award, Search, AlertTriangle, X, BarChart2, List } from 'lucide-react';
import StudentPerformanceCharts from '../components/StudentPerformanceCharts';
import axios from 'axios';


const API_URL = import.meta.env.VITE_API_BASE_URL;

const Leaderboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`${API_URL}/leaderboard`);
        console.log("Leaderboard response data", response);
        setStudents(response.data?.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(
        students.filter(student => 
          student.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, students]);
  
  // Sort students by score and accuracy
  const sortedStudents = [...filteredStudents].sort((a, b) => b.score - a.score);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy className="text-yellow-500" size={24} />;
      case 1: return <Medal className="text-gray-400" size={24} />;
      case 2: return <Award className="text-amber-700" size={24} />;
      default: return <span className="w-6 h-6 inline-flex items-center justify-center bg-gray-100 rounded-full text-sm font-medium">{rank + 1}</span>;
    }
  };

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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="list">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                Ranking List
              </TabsTrigger>
              <TabsTrigger value="charts" className="gap-2">
                <BarChart2 className="h-4 w-4" />
                Performance Charts
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <Card className="glass-card">
                <CardHeader className="pb-3">
                  <CardTitle>Student Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  {sortedStudents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No students found</h3>
                      <p className="text-muted-foreground mt-1">
                        {students.length === 0 
                          ? "No students have played the game yet." 
                          : "No students match your search criteria."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      <div className="hidden sm:grid grid-cols-12 text-sm font-medium text-muted-foreground p-2 border-b">
                        <div className="col-span-1">Rank</div>
                        <div className="col-span-5">Name</div>
                        <div className="col-span-2 text-center">Questions</div>
                        <div className="col-span-2 text-center">Accuracy</div>
                        <div className="col-span-2 text-right">Score</div>
                      </div>
                      
                      {sortedStudents.map((student, index) => {
                        const accuracy = student.totalQuestions > 0 
                          ? Math.round((student.correctAnswers / student.totalQuestions) * 100) 
                          : 0;
                          
                        return (
                          <motion.div
                            key={student.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className={`grid grid-cols-3 sm:grid-cols-12 items-center p-3 rounded-md ${
                              index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                              index === 1 ? 'bg-gray-50 border border-gray-200' :
                              index === 2 ? 'bg-amber-50 border border-amber-200' :
                              'bg-white border border-gray-100'
                            }`}
                          >
                            <div className="col-span-1 flex items-center justify-center sm:justify-start">
                              {getRankIcon(index)}
                            </div>
                            
                            <div className="col-span-2 sm:col-span-5 font-medium truncate">
                              {student.name}
                            </div>
                            
                            <div className="hidden sm:block sm:col-span-2 text-center">
                              {student.totalQuestions}
                            </div>
                            
                            <div className="hidden sm:block sm:col-span-2 text-center">
                              {accuracy}%
                            </div>
                            
                            <div className="col-span-1 sm:col-span-2 text-right font-bold">
                              {student.score}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="charts">
              <StudentPerformanceCharts students={students} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Leaderboard;
