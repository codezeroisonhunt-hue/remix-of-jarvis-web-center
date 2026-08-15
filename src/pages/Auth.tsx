
import React from 'react';
import { Helmet } from 'react-helmet-async';
import AuthForm from '@/components/auth/AuthForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Auth: React.FC = () => {
  const { user } = useAuth();

  // If user is already logged in, redirect to interface
  if (user) {
    return <Navigate to="/interface" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Helmet>
        <title>JARVIS - Authentication</title>
      </Helmet>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-jarvis text-glow mb-2">JARVIS</h1>
            <p className="text-gray-400">Artificial Intelligence Interface</p>
          </div>
          
          <AuthForm />
        </div>
      </main>
      
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} JARVIS AI System</p>
      </footer>
    </div>
  );
};

export default Auth;
