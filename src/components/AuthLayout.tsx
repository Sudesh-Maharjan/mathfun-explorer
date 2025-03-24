
import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="content-container py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;
