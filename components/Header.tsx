import React from 'react';

interface HeaderProps {
    user?: { email: string };
    onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-slate-800/50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            AI Contract Simplifier
          </h1>
          <p className="hidden sm:block mt-1 text-sm text-slate-600 dark:text-slate-300">
            Turn complex legal jargon into simple, actionable insights.
          </p>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600 dark:text-slate-300 hidden md:inline">
              Welcome, {user.email}
            </span>
            <button
              onClick={onLogout}
              className="px-4 py-2 border border-slate-300 dark:border-slate-500 rounded-md text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
