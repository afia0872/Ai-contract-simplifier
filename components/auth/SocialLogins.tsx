import React, { useState } from 'react';
import { SocialProvider } from '../../hooks/useAuth';
import GoogleIcon from '../icons/GoogleIcon';
import TwitterIcon from '../icons/TwitterIcon';
import GithubIcon from '../icons/GithubIcon';

interface SocialLoginsProps {
    onSocialLogin: (provider: SocialProvider) => Promise<{ success: boolean; error?: string }>;
}

const SocialButton: React.FC<{
    provider: SocialProvider;
    icon: React.ReactNode;
    text: string;
    onClick: (provider: SocialProvider) => void;
    isLoading: boolean;
    currentLoadingProvider: SocialProvider | null;
}> = ({ provider, icon, text, onClick, isLoading, currentLoadingProvider }) => (
    <button
        type="button"
        onClick={() => onClick(provider)}
        disabled={isLoading}
        className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-60"
    >
        {isLoading && currentLoadingProvider === provider ? (
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : (
           icon
        )}
        <span>{text}</span>
    </button>
);


const SocialLogins: React.FC<SocialLoginsProps> = ({ onSocialLogin }) => {
    const [loadingProvider, setLoadingProvider] = useState<SocialProvider | null>(null);

    const handleLogin = async (provider: SocialProvider) => {
        setLoadingProvider(provider);
        try {
            await onSocialLogin(provider);
            // On success, the component will unmount, no need to reset state.
        } catch (error) {
            console.error(`Social login failed for ${provider}`, error);
            setLoadingProvider(null); // Reset on failure
        }
    };

    return (
        <div className="space-y-3">
            <SocialButton
                provider="google"
                icon={<GoogleIcon />}
                text="Continue with Google"
                onClick={handleLogin}
                isLoading={!!loadingProvider}
                currentLoadingProvider={loadingProvider}
            />
            <SocialButton
                provider="twitter"
                icon={<TwitterIcon />}
                text="Continue with Twitter"
                onClick={handleLogin}
                isLoading={!!loadingProvider}
                currentLoadingProvider={loadingProvider}
            />
            <SocialButton
                provider="github"
                icon={<GithubIcon />}
                text="Continue with GitHub"
                onClick={handleLogin}
                isLoading={!!loadingProvider}
                currentLoadingProvider={loadingProvider}
            />
        </div>
    );
};

export default SocialLogins;