import React from 'react';
import { useLocation } from 'wouter';
import AuthForm from '@/components/auth/AuthForm';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import PageTransition from '@/components/ui/PageTransition';

export default function Auth() {
  const [, setLocation] = useLocation();
  const { t } = useLanguage();
  
  const handleAuthSuccess = () => {
    // Redirect to home page after successful authentication
    setLocation('/');
  };

  return (
    <PageTransition className="min-h-[calc(100vh-176px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-pacifico text-secondary mb-2">{t.general.appName}</h1>
          <p className="text-gray-400">Your companion for clean eating and wellness</p>
        </div>
        
        <AuthForm onSuccess={handleAuthSuccess} />
        
        <p className="mt-8 text-center text-sm text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </PageTransition>
  );
}