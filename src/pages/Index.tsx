
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Award, Plus, Minus, X, Divide, LogIn, User, Play } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import Header from '../components/Header';
import LeaderboardCard from '../components/LeaderboardCard';

const operationIcons = [
  { icon: Plus, color: 'bg-blue-500', name: 'Addition' },
  { icon: Minus, color: 'bg-red-500', name: 'Subtraction' },
  { icon: X, color: 'bg-green-500', name: 'Multiplication' },
  { icon: Divide, color: 'bg-purple-500', name: 'Division' },
];

const Index = () => {
  const { students, isTeacher, currentStudent } = useQuiz();

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { type: 'spring', stiffness: 400, damping: 10 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hero Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-xl glass-card p-8 h-full">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 to-transparent" />
              
              <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                  Math<span className="text-primary">Quest</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                  An engaging math adventure for 4th graders. Practice addition, subtraction, 
                  multiplication, and division while tracking your progress!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-background/60 rounded-lg border">
                    <h2 className="text-lg font-semibold mb-3 flex items-center">
                      <User className="mr-2 h-5 w-5 text-primary" />
                      For Students
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      {currentStudent 
                        ? `Welcome back, ${currentStudent.name}! Ready to continue your math journey?` 
                        : 'Register with your details to play math games and track your progress!'}
                    </p>
                    <Link to={currentStudent ? "/quiz" : "/register"} className="w-full">
                      <Button className="w-full">
                        {currentStudent ? (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Play Now
                          </>
                        ) : (
                          'Register & Play'
                        )}
                      </Button>
                    </Link>
                  </div>
                  
                  {!isTeacher && (
                    <div className="p-4 bg-background/60 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center">
                        <LogIn className="mr-2 h-5 w-5 text-primary" />
                        For Teachers
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Login to view student performance, manage questions, and more.
                      </p>
                      <Link to="/login" className="w-full">
                        <Button variant="outline" className="w-full">Teacher Login</Button>
                      </Link>
                    </div>
                  )}
                  
                  {isTeacher && (
                    <div className="p-4 bg-background/60 rounded-lg border">
                      <h2 className="text-lg font-semibold mb-3 flex items-center">
                        <LogIn className="mr-2 h-5 w-5 text-primary" />
                        Teacher Portal
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Access the admin panel to manage questions and view student performance.
                      </p>
                      <Link to="/admin" className="w-full">
                        <Button variant="outline" className="w-full">Go to Admin Panel</Button>
                      </Link>
                    </div>
                  )}
                </div>
                
                <h2 className="text-lg font-medium mb-4">Practice your skills:</h2>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {operationIcons.map((op, index) => (
                    <motion.div key={index} variants={item}>
                      <Link to={{ pathname: "/quiz", search: `?op=${op.name.toLowerCase()}` }}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <CardContent className="p-0">
                            <div className="p-6 flex flex-col items-center">
                              <motion.div 
                                className={`${op.color} text-white p-3 rounded-full mb-3`}
                                variants={iconVariants}
                                whileHover="hover"
                              >
                                <op.icon size={24} />
                              </motion.div>
                              <span className="font-medium">{op.name}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
          
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <LeaderboardCard students={students} />
            
            <div className="mt-4 text-center">
              <Link to="/leaderboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Award size={16} />
                  View Full Leaderboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
