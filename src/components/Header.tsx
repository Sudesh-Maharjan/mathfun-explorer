
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { Calculator, Medal, Home, Settings, LucideIcon } from 'lucide-react';
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
  const { isAdmin, toggleAdmin, currentStudent } = useQuiz();
  
  const path = location.pathname;

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
          <NavItem to="/quiz" icon={Calculator} label="Play" current={path === "/quiz"} />
          <NavItem to="/leaderboard" icon={Medal} label="Leaderboard" current={path === "/leaderboard"} />
          {isAdmin && (
            <NavItem to="/admin" icon={Settings} label="Admin" current={path === "/admin"} />
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          {currentStudent && (
            <div className="text-sm font-medium hidden sm:block">
              <span className="text-muted-foreground">Student:</span>{" "}
              <span className="text-foreground">{currentStudent.name}</span>
            </div>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleAdmin}
            className="text-xs"
          >
            {isAdmin ? "Exit Admin" : "Admin Mode"}
          </Button>
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
            <Calculator size={20} />
            <span>Play</span>
          </Link>
          <Link to="/leaderboard" className={`flex flex-col items-center text-xs ${path === "/leaderboard" ? "text-primary" : "text-muted-foreground"}`}>
            <Medal size={20} />
            <span>Scores</span>
          </Link>
          {isAdmin && (
            <Link to="/admin" className={`flex flex-col items-center text-xs ${path === "/admin" ? "text-primary" : "text-muted-foreground"}`}>
              <Settings size={20} />
              <span>Admin</span>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
