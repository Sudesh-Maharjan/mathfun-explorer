
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '../context/QuizContext';
import { Trophy, Award, Medal } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

interface LeaderboardCardProps {
  students: Student[];
  limit?: number;
  showTitle?: boolean;
}

const API_URL = import.meta.env.VITE_API_BASE_URL;

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ 
  limit = 5,
  showTitle = true
}) => {
    const [students, setStudents] = useState([]);
  
  // Sort students by score and take the top ones
  const topStudents = [...students]
    .sort((a, b) => {
      // Primary sort by score
      if (b.score !== a.score) return b.score - a.score;
      // Secondary sort by accuracy (correct answers / total)
      const aAccuracy = a.total_questions_attempted > 0 ? a.correct_questions / a.total_questions_attempted : 0;
      const bAccuracy = b.total_questions_attempted > 0 ? b.correct_questions / b.total_questions_attempted : 0;
      return bAccuracy - aAccuracy;
    })
    .slice(0, limit);
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
  // No students yet
  if (topStudents.length === 0) {
    return (
      <Card className="glass-card">
        <CardHeader>
          {showTitle && <CardTitle className="text-xl">Leaderboard</CardTitle>}
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No students have played yet. Be the first!
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Trophy className="text-yellow-500" size={20} />;
      case 1: return <Medal className="text-gray-400" size={20} />;
      case 2: return <Award className="text-amber-700" size={20} />;
      default: return <span className="w-5 inline-block text-center">{rank + 1}</span>;
    }
  };

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        {showTitle && <CardTitle className="text-xl">Leaderboard</CardTitle>}
      </CardHeader>
      <CardContent>
        <motion.div
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {topStudents.map((student, index) => {
            // Calculate accuracy percentage
            const accuracy = student.total_questions_attempted > 0 
              ? Math.round((student.correct_questions / student.total_questions_attempted) * 100) 
              : 0;
              
            return (
              <motion.div
                key={student.id}
                variants={item}
                className={`flex items-center p-3 rounded-md ${
                  index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                  index === 1 ? 'bg-gray-50 border border-gray-200' :
                  index === 2 ? 'bg-amber-50 border border-amber-200' :
                  'bg-white border border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {getRankIcon(index)}
                  </div>
                  <div className="font-medium truncate">{student.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {accuracy}% Accuracy
                  </div>
                  <div className="font-bold text-lg">
                    {student.score}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
