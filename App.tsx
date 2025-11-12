import React, { useState, useCallback } from 'react';
import { ContractSummary } from './types';
import { summarizeContract, answerQuestion } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import SummaryDisplay from './components/SummaryDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';
import AuthPage from './components/auth/AuthPage';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, register, logout, socialLogin } = useAuth();
  const [contractText, setContractText] = useState<string>('');
  const [summary, setSummary] = useState<ContractSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [isAnswering, setIsAnswering] = useState<boolean>(false);
  const [qaError, setQaError] = useState<string | null>(null);

  const resetAnalysisState = () => {
    setContractText('');
    setSummary(null);
    setError(null);
    setIsLoading(false);
    setAnswer(null);
    setIsAnswering(false);
    setQaError(null);
  };

  const handleLogout = () => {
    logout();
    resetAnalysisState();
  };

  const handleSummarize = useCallback(async (content: string | File) => {
    const isFile = typeof content !== 'string';
    if (!isFile && !content.trim()) {
      setError('Please enter or upload a contract.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setAnswer(null);
    setQaError(null);

    // For the Q&A context, we'll store the text or a file descriptor.
    const textForQa = isFile ? `File content of: ${content.name}` : content;
    setContractText(textForQa);

    try {
      const result = await summarizeContract(content);
      setSummary(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to simplify the contract. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleAskQuestion = useCallback(async (question: string) => {
    if (!contractText) {
      setQaError("Contract context is missing. Please analyze a document first.");
      return;
    }
    setIsAnswering(true);
    setQaError(null);
    setAnswer(null);

    try {
      const result = await answerQuestion(contractText, question);
      setAnswer(result);
    } catch (err: any) {
      console.error(err);
      setQaError(err.message || "Sorry, I couldn't answer that question. Please try again.");
    } finally {
      setIsAnswering(false);
    }
  }, [contractText]);

  const handleReset = () => {
    setContractText('');
    setSummary(null);
    setError(null);
    setIsLoading(false);
    setAnswer(null);
    setIsAnswering(false);
    setQaError(null);
  };

  if (!user) {
    return <AuthPage onLogin={login} onRegister={register} onSocialLogin={socialLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      <Header user={user} onLogout={handleLogout} />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {!summary && !isLoading && (
            <FileUpload onSummarize={handleSummarize} initialText={contractText} />
          )}

          {isLoading && <Loader />}
          
          {error && !isLoading && <ErrorDisplay message={error} onReset={handleReset} />}

          {summary && !isLoading && (
            <SummaryDisplay 
              summary={summary} 
              onReset={handleReset}
              onAskQuestion={handleAskQuestion}
              answer={answer}
              isAnswering={isAnswering}
              qaError={qaError}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;