import React, { useEffect, useState } from 'react';
import { Student, useQuiz, Question } from '../context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CheckCircle2, XCircle, User, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';
// import { set } from 'date-fns';

interface StudentDetailedPerformanceProps {
  students: Student[];
}
interface StudentPerformance {
  difficultyPerformance: {
    easy: {
      correct: number;
      attempted: number;
    };
    medium: {
      correct: number;
      attempted: number;
    };
    hard: {
      correct: number;
      attempted: number;
    };
  },
  operationPerformance: {
    addition: {
      correct: number;
      attempted: number;
    };
    subtraction: {
      correct: number;
      attempted: number;
    };
    multiplication: {
      correct: number;
      attempted: number;
    };
    division: {
      correct: number;
      attempted: number;
    };
  };

}
const API_URL = import.meta.env.VITE_API_BASE_URL;


const StudentDetailedPerformance: React.FC<StudentDetailedPerformanceProps> = ({ students }) => {
  const [studentRoll, setStudentRoll] = useState('');
  const [studentPerformance, setStudentPerformance] = useState<StudentPerformance | null>(null);
  const [operationPerformanceData, setOperationPerformanceData] = useState([
    { name: "Addition", correct: 0, wrong: 0 },
    { name: "Subtraction", correct: 0, wrong: 0 },
    { name: "Multiplication", correct: 0, wrong: 0 },
    { name: "Division", correct: 0, wrong: 0 }
  ]);
  const [difficultyPerformanceData, setDifficultyPerformanceData] = useState([
    { name: "Easy", correct: 0, wrong: 0 },
    { name: "Medium", correct: 0, wrong: 0 },
    { name: "Hard", correct: 0, wrong: 0 }
  ]);
  console.log("🚀 ~ operationPerformanceData:", operationPerformanceData)
  console.log("🚀 ~ students:", students)
useEffect(() => {
    const fetchStudentPerformance = async () => {
      if (!studentRoll) return;
      try {
        const response = await axios.get(`${API_URL}/teacher/student-performance/${studentRoll}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem('teacher_token')}`,
          },
        });
        const data = await response.data.data;
      if (data.operationPerformance) {

        setOperationPerformanceData((prevData) =>
          prevData.map((item) => {
            const operation = data.operationPerformance[item.name.toLowerCase()];
            console.log("🚀 ~ prevData.map ~ operation:", operation)
            return operation
              ? { ...item, correct: operation.correct, wrong: operation.attempted - operation.correct }
              : item;
          })
        );
        
      }
      if(data.difficultyPerformance){
        setDifficultyPerformanceData((prevData) =>
          prevData.map((item) => {
            const difficulty = data.difficultyPerformance[item.name.toLowerCase()];
            console.log("🚀 ~ prevData.map ~ difficulty:", difficulty)
            return difficulty
              ? { ...item, correct: difficulty.correct, wrong: difficulty.attempted - difficulty.correct }
              : item;
          })
        );
      }
        console.log("Student performance", response);
        setStudentPerformance(response.data?.data);
      } catch (error) {
        console.error('Error fetching student performance:', error);
      }
    };

    if (studentRoll) {
      fetchStudentPerformance();
    }
}, [studentRoll]);
  const { questionHistory } = useQuiz();
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // If there are no students, show a message
  if (students.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
          <CardDescription>
            Detailed analysis of student performance
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No student data available
        </CardContent>
      </Card>
    );
  }

  // If no student is selected, show the student list
  if (!selectedStudent) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Student Performance</CardTitle>
          <CardDescription>
            Select a student to view their detailed performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {students.map((student) => {
              const accuracy = student.total_questions_attempted > 0 
                ? Math.round((student.correct_questions / student.total_questions_attempted) * 100) 
                : 0;
                
              return (
                <div 
                  key={student.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/20 cursor-pointer"
                  onClick={() => { setSelectedStudent(student); setStudentRoll(student.roll_number); }}
                >
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Roll: {student.roll_number} | Class: {student.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Score: {student.score}</div>
                    <div className="text-sm text-muted-foreground">
                      Accuracy: {accuracy}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate student metrics
  const accuracy = selectedStudent.total_questions_attempted > 0 
    ? Math.round((selectedStudent.correct_questions / selectedStudent.total_questions_attempted) * 100) 
    : 0;
    const wrongAnswers = Number(selectedStudent.total_questions_attempted) - Number(selectedStudent.correct_questions);


  // Generate mock question data for the student
  // Instead of using allQuestions (which doesn't exist), create mock data based on the student's performance
  // or use the available questionHistory as a reference
  const mockAnsweredQuestions = Array.from({ length: selectedStudent.total_questions_attempted }).map((_, index) => {
    // Use questionHistory items as templates if available, otherwise create generic questions
    const baseQuestion = questionHistory[index % questionHistory.length] || {
      id: `mock-${index}`,
      question: `${index + 1} + ${index + 2} = ?`,
      options: [index + 3, index + 4, index + 5, index + 6],
      answer: index + 3,
      operation: ['addition', 'subtraction', 'multiplication', 'division'][index % 4] as any,
      difficulty: ['easy', 'medium', 'hard'][index % 3] as any
    };
    
    // Make sure the number of correct answers matches the student's record
    const isCorrect = index < Number(selectedStudent.correct_questions);
    
    return {
      ...baseQuestion,
      studentAnswer: isCorrect ? baseQuestion.answer : (baseQuestion.options.find(opt => opt !== baseQuestion.answer) || 0),
      isCorrect
    };
  });

  // Data for operation type performance
 console.log("Student Performnceeeee", studentPerformance);
 if (studentPerformance) {
 const {difficultyPerformance, operationPerformance} = studentPerformance;
 console.log("🚀 ~ difficultyPerformance:", difficultyPerformance)
 console.log("🚀 ~ operationPerformance:", operationPerformance)
 }else{
  console.log("🚀 ~ No student performance data available");
 }

  // const operationPerformanceData = [
  //   { name: 'Addition', correct: 0 , wrong: 0 },
  //   { name: 'Subtraction', correct: 0, wrong: 0 },
  //   { name: 'Multiplication', correct: 0, wrong: 0 },
  //   { name: 'Division', correct: 0, wrong: 0 }
  // ];

  // Data for difficulty level performance
  // const difficultyPerformanceData = [
  //   { name: 'Easy', correct: 0, wrong: 0 },
  //   { name: 'Medium', correct: 0, wrong: 0 },
  //   { name: 'Hard', correct: 0, wrong: 0 }
  // ];

  // Calculate operation and difficulty performance
  mockAnsweredQuestions.forEach(q => {
    const opIndex = operationPerformanceData.findIndex(op => 
      op.name.toLowerCase() === q.operation
    );
    
    if (opIndex !== -1) {
      if (q.isCorrect) {
        operationPerformanceData[opIndex].correct++;
      } else {
        operationPerformanceData[opIndex].wrong++;
      }
    }

    const diffIndex = difficultyPerformanceData.findIndex(diff => 
      diff.name.toLowerCase() === q.difficulty
    );
    
    if (diffIndex !== -1) {
      if (q.isCorrect) {
        difficultyPerformanceData[diffIndex].correct++;
      } else {
        difficultyPerformanceData[diffIndex].wrong++;
      }
    }
  });

  // Filter out operation types with no data
  const filteredOperationPerf = operationPerformanceData.filter(
    op => op.correct > 0 || op.wrong > 0
  );

  // Filter out difficulty levels with no data
  const filteredDifficultyPerf = difficultyPerformanceData.filter(
    diff => diff.correct > 0 || diff.wrong > 0
  );

  // Data for the overall performance pie chart
  const overallData = [
    { name: 'Correct', value: Number(selectedStudent.correct_questions), color: '#4ade80' },
    { name: 'Wrong', value: wrongAnswers, color: '#ef4444' }
  ].filter(item => item.value > 0);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center">
          <div className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedStudent(null)}
              className="mb-2"
            >
              <ChevronLeft className="mr-1 h-4 w-4" /> Back to List
            </Button>
            <CardTitle>{selectedStudent.name}</CardTitle>
            <CardDescription>
              Roll Number: {selectedStudent.roll_number} | Class: {selectedStudent.class}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{selectedStudent.score}</div>
            <div className="text-sm text-muted-foreground">Score</div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      Correct: {
                        color: "#4ade80"
                      },
                      Wrong: {
                        color: "#ef4444"
                      }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={overallData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {overallData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            labelClassName="font-medium" 
                            formatter={(value, name) => [`${value} questions`, name]}
                          />
                        }
                      />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Accuracy</div>
                    <div className="text-2xl font-bold">{accuracy}%</div>
                  </div>
                  <div className="flex flex-col items-center p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Questions</div>
                    <div className="text-2xl font-bold">{selectedStudent.total_questions_attempted}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Operation Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      correct: {
                        label: "Correct",
                        color: "#4ade80"
                      },
                      wrong: {
                        label: "Wrong",
                        color: "#ef4444"
                      }
                    }}
                  >
                    <BarChart
                      data={filteredOperationPerf}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            labelClassName="font-medium" 
                          />
                        }
                      />
                      <Bar dataKey="correct" name="Correct" fill="var(--color-correct)" stackId="a" />
                      <Bar dataKey="wrong" name="Wrong" fill="var(--color-wrong)" stackId="a" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Difficulty Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      correct: {
                        label: "Correct",
                        color: "#4ade80"
                      },
                      wrong: {
                        label: "Wrong",
                        color: "#ef4444"
                      }
                    }}
                  >
                    <BarChart
                      data={filteredDifficultyPerf}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <ChartTooltip 
                        content={
                          <ChartTooltipContent 
                            labelClassName="font-medium" 
                          />
                        }
                      />
                      <Bar dataKey="correct" name="Correct" fill="var(--color-correct)" stackId="a" />
                      <Bar dataKey="wrong" name="Wrong" fill="var(--color-wrong)" stackId="a" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Question History</CardTitle>
          <CardDescription>
            Detailed list of questions answered by {selectedStudent.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Question</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Student Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnsweredQuestions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No question history available
                  </TableCell>
                </TableRow>
              ) : (
                mockAnsweredQuestions.map((question, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {question.isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>{question.question}</TableCell>
                    <TableCell className="capitalize">{question.operation}</TableCell>
                    <TableCell className="capitalize">{question.difficulty}</TableCell>
                    <TableCell>{question.studentAnswer}</TableCell>
                    <TableCell>{question.studentAnswer}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDetailedPerformance;
