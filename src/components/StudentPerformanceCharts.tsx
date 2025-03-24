
import React from 'react';
import { Student } from '../context/QuizContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface StudentPerformanceChartsProps {
  students: Student[];
}

const StudentPerformanceCharts: React.FC<StudentPerformanceChartsProps> = ({ students }) => {
  // Early return if no students
  if (students.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance Charts</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8 text-muted-foreground">
          No student data available for visualization
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the score bar chart
  const scoreData = students
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(student => ({
      name: student.name,
      score: student.score
    }));

  // Prepare data for the accuracy pie chart
  const accuracyGroups = [
    { name: 'Excellent (90-100%)', value: 0, color: '#4ade80' },
    { name: 'Good (70-89%)', value: 0, color: '#3b82f6' },
    { name: 'Average (50-69%)', value: 0, color: '#f59e0b' },
    { name: 'Needs Improvement (0-49%)', value: 0, color: '#ef4444' }
  ];

  students.forEach(student => {
    const accuracy = student.totalQuestions > 0 
      ? Math.round((student.correctAnswers / student.totalQuestions) * 100) 
      : 0;
      
    if (accuracy >= 90) {
      accuracyGroups[0].value++;
    } else if (accuracy >= 70) {
      accuracyGroups[1].value++;
    } else if (accuracy >= 50) {
      accuracyGroups[2].value++;
    } else {
      accuracyGroups[3].value++;
    }
  });

  // Filter out groups with zero students
  const filteredAccuracyGroups = accuracyGroups.filter(group => group.value > 0);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Top 10 Student Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                score: {
                  label: "Score",
                  color: "#8B5CF6"
                }
              }}
            >
              <BarChart data={scoreData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      labelClassName="font-medium" 
                      formatter={(value) => [`${value}`, 'Score']}
                    />
                  }
                />
                <Bar dataKey="score" name="Score" fill="var(--color-score)" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Student Accuracy Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                accuracy: {
                  label: "Accuracy",
                  color: "#8B5CF6"
                }
              }}
            >
              <PieChart>
                <Pie
                  data={filteredAccuracyGroups}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {filteredAccuracyGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={
                    <ChartTooltipContent 
                      labelClassName="font-medium" 
                      formatter={(value, name) => [`${value} students`, name]}
                    />
                  }
                />
                <Legend />
              </PieChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPerformanceCharts;
