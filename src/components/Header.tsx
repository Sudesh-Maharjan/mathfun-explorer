
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { Calculator, Medal, Home, Settings, LogIn, LogOut, User, LucideIcon, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  current: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, current }) => {
  
  return (
    <Link to={to}>
      <Button
        variant={current ? "default" : "ghost"}
        className={`relative flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
          current ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        <Icon size={18} />
        <span>{label}</span>
        {current && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute bottom-0 left-0 h-0.5 w-full bg-primary-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </Button>
    </Link>
  );
};

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isTeacher, teacherLogout, studentLogout } = useQuiz();
  const storedStudent = localStorage.getItem("student");
  const currentStudent = storedStudent ? JSON.parse(storedStudent) : null;
  const path = location.pathname;

  const handleTeacherLogout = () => {
    teacherLogout();
    navigate('/');
  };

  const handleStudentLogout = () => {
    localStorage.removeItem("student");
    studentLogout();
    navigate('/');
  };

  return (
    <motion.header 
      className="sticky top-0 z-10 w-full backdrop-blur-md bg-background/80 border-b"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="content-container flex items-center justify-between h-16">
        <div className="flex items-center space-x-2">
          <motion.div 
            className="bg-primary rounded-full p-2 text-primary-foreground"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Calculator size={24} />
          </motion.div>
          <Link to="/">
            <h1 className="text-xl font-bold tracking-tight">
              Math<span className="text-primary">Quest</span>
            </h1>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-1">
          <NavItem to="/" icon={Home} label="Home" current={path === "/"} />
          <NavItem to="/quiz" icon={currentStudent ? Play : Calculator} label={currentStudent ? "Play" : "Quiz"} current={path === "/quiz"} />
          <NavItem to="/leaderboard" icon={Medal} label="Leaderboard" current={path === "/leaderboard"} />
          {isTeacher && (
            <NavItem to="/admin" icon={Settings} label="Teacher Panel" current={path === "/admin"} />
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {currentStudent && (
            <div className="text-sm font-medium hidden sm:block">
              <span className="text-muted-foreground">Student:</span>{" "}
              <span className="text-foreground">{currentStudent.name} ({currentStudent.roll_number}, {currentStudent.class})</span>
            </div>
          )}
          
          {isTeacher ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTeacherLogout}
              className="text-xs"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          ) : currentStudent ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleStudentLogout}
              className="text-xs"
            >
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
              >
                <LogIn size={16} className="mr-1" />
                Teacher Login
              </Button>
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="md:hidden border-t">
        <div className="flex justify-around py-2">
          <Link to="/" className={`flex flex-col items-center text-xs ${path === "/" ? "text-primary" : "text-muted-foreground"}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/quiz" className={`flex flex-col items-center text-xs ${path === "/quiz" ? "text-primary" : "text-muted-foreground"}`}>
            {currentStudent ? <Play size={20} /> : <Calculator size={20} />}
            <span>{currentStudent ? "Play" : "Quiz"}</span>
          </Link>
          <Link to="/leaderboard" className={`flex flex-col items-center text-xs ${path === "/leaderboard" ? "text-primary" : "text-muted-foreground"}`}>
            <Medal size={20} />
            <span>Scores</span>
          </Link>
          {isTeacher && (
            <Link to="/admin" className={`flex flex-col items-center text-xs ${path === "/admin" ? "text-primary" : "text-muted-foreground"}`}>
              <Settings size={20} />
              <span>Teacher</span>
            </Link>
          )}
          {!isTeacher && !currentStudent && (
            <Link to="/login" className={`flex flex-col items-center text-xs ${path === "/login" ? "text-primary" : "text-muted-foreground"}`}>
              <User size={20} />
              <span>Login</span>
            </Link>
          )}
          {currentStudent && (
            <button 
              onClick={handleStudentLogout}
              className={`flex flex-col items-center text-xs text-muted-foreground`}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
