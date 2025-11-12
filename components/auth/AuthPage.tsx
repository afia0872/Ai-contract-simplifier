import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import SocialLogins from './SocialLogins';
import { SocialProvider } from '../../hooks/useAuth';

type AuthResult = Promise<{ success: boolean; error?: string }>;

interface AuthPageProps {
  onLogin: (email: string, password: string) => AuthResult;
  onRegister: (email: string, password: string) => AuthResult;
  onSocialLogin: (provider: SocialProvider) => AuthResult;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister, onSocialLogin }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            AI Contract Simplifier
            </h1>
            <p className="mt-2 text-md text-slate-600 dark:text-slate-300">
            Sign in or create an account to get started.
            </p>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-2xl rounded-2xl p-6 sm:p-8">
          <SocialLogins onSocialLogin={onSocialLogin} />

          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
            <span className="flex-shrink mx-4 text-sm text-slate-500 dark:text-slate-400">OR</span>
            <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          
          <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
            <button
              onClick={() => setIsLoginView(true)}
              className={`w-1/2 py-3 text-center font-semibold transition-colors ${
                isLoginView
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Login with Email
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`w-1/2 py-3 text-center font-semibold transition-colors ${
                !isLoginView
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Register with Email
            </button>
          </div>
          {isLoginView ? <Login onLogin={onLogin} /> : <Register onRegister={onRegister} />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;