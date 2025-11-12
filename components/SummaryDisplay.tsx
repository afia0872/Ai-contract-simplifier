import React, { useState } from 'react';
import { ContractSummary } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import WarningIcon from './icons/WarningIcon';
import LightbulbIcon from './icons/LightbulbIcon';

interface SummaryDisplayProps {
  summary: ContractSummary;
  onReset: () => void;
  onAskQuestion: (question: string) => void;
  answer: string | null;
  isAnswering: boolean;
  qaError: string | null;
}

const SummaryCard: React.FC<{ title: string; items: string[]; icon: React.ReactNode, color: string }> = ({ title, items, icon, color }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex flex-col">
    <div className="flex items-center mb-4">
      <div className={`p-2 rounded-full ${color}`}>
        {icon}
      </div>
      <h3 className="ml-3 text-xl font-bold text-slate-800 dark:text-white">{title}</h3>
    </div>
    <ul className="space-y-3 list-disc list-inside text-slate-600 dark:text-slate-300 flex-grow">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const QnASection: React.FC<Pick<SummaryDisplayProps, 'onAskQuestion' | 'answer' | 'isAnswering' | 'qaError'>> = ({ onAskQuestion, answer, isAnswering, qaError }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && !isAnswering) {
            onAskQuestion(question);
        }
    };

    return (
        <div className="mt-12">
            <div className="bg-white dark:bg-slate-800/50 p-6 sm:p-8 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">Ask a Question About the Document</h3>
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., What is the governing law?"
                        className="flex-grow p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:text-slate-200 disabled:opacity-50"
                        disabled={isAnswering}
                        aria-label="Ask a question about the contract"
                    />
                    <button
                        type="submit"
                        disabled={isAnswering || !question.trim()}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-all disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isAnswering ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                               <span>Asking...</span>
                            </>
                        ) : (
                            'Ask'
                        )}
                    </button>
                </form>

                <div className="mt-6 min-h-[4rem]">
                    {qaError && (
                         <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-md" role="alert">
                            <p><span className="font-bold">Error:</span> {qaError}</p>
                        </div>
                    )}
                    {answer && !isAnswering && (
                        <div className="bg-slate-100 dark:bg-slate-700/50 p-4 rounded-lg">
                            <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{answer}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary, onReset, onAskQuestion, answer, isAnswering, qaError }) => {
  return (
    <div className="animate-fade-in">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Your Simplified Summary</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <SummaryCard title="Key Terms" items={summary.keyTerms} icon={<DocumentIcon />} color="bg-blue-100 dark:bg-blue-900/50" />
            <SummaryCard title="Potential Risks" items={summary.potentialRisks} icon={<WarningIcon />} color="bg-red-100 dark:bg-red-900/50" />
            <SummaryCard title="Your Obligations" items={summary.obligations} icon={<LightbulbIcon />} color="bg-green-100 dark:bg-green-900/50" />
        </div>
        
        <QnASection 
            onAskQuestion={onAskQuestion}
            answer={answer}
            isAnswering={isAnswering}
            qaError={qaError}
        />

        <div className="mt-12 text-center">
            <button
                onClick={onReset}
                className="px-8 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-800 transition-all"
            >
                Analyze Another Document
            </button>
        </div>
        <style>{`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default SummaryDisplay;
